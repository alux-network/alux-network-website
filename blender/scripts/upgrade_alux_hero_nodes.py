import bpy
import math
import os
from mathutils import Quaternion, Vector


SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BLENDER_ROOT = os.path.dirname(SCRIPT_DIR)
PROJECT_ROOT = os.path.dirname(BLENDER_ROOT)
SOURCE_BLEND = os.path.join(BLENDER_ROOT, "scenes", "alux_hero_bricks_candidate.blend")
OUTPUT_BLEND = os.path.join(BLENDER_ROOT, "scenes", "alux_hero_bricks_hybrid.blend")
ASSET_DIR = os.path.join(PROJECT_ROOT, "assets")
SUN_OUTPUT = os.path.join(ASSET_DIR, "alux-hero-3d-sun-pixel.png")
BLUE_OUTPUT = os.path.join(ASSET_DIR, "alux-hero-3d-blue-node.png")


def set_input(node, name, value):
    socket = node.inputs.get(name)
    if socket is not None:
        socket.default_value = value


def make_material(name, color, roughness, coat, emission=None, emission_strength=0.0):
    existing = bpy.data.materials.get(name)
    material = existing or bpy.data.materials.new(name)
    material.use_nodes = True
    material.diffuse_color = (*color, 1.0)
    bsdf = material.node_tree.nodes.get("Principled BSDF")
    set_input(bsdf, "Base Color", (*color, 1.0))
    set_input(bsdf, "Roughness", roughness)
    set_input(bsdf, "Metallic", 0.0)
    set_input(bsdf, "IOR", 1.46)
    set_input(bsdf, "Coat Weight", coat)
    set_input(bsdf, "Coat Roughness", 0.24)
    if emission is not None:
        set_input(bsdf, "Emission Color", (*emission, 1.0))
        set_input(bsdf, "Emission Strength", emission_strength)
    return material


def apply_modifier(obj, modifier):
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.modifier_apply(modifier=modifier.name)
    obj.select_set(False)


def rounded_box(name, dimensions, location, material, bevel=0.055):
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    modifier = obj.modifiers.new("Soft pixel bevel", "BEVEL")
    modifier.width = bevel
    modifier.segments = 4
    modifier.limit_method = "ANGLE"
    modifier.harden_normals = True
    apply_modifier(obj, modifier)
    obj.data.materials.append(material)
    return obj


def cylinder(name, radius, depth, location, material):
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=96,
        radius=radius,
        depth=depth,
        location=location,
    )
    obj = bpy.context.object
    obj.name = name
    modifier = obj.modifiers.new("Node rim bevel", "BEVEL")
    modifier.width = 0.025
    modifier.segments = 3
    modifier.limit_method = "ANGLE"
    modifier.harden_normals = True
    apply_modifier(obj, modifier)
    obj.data.materials.append(material)
    for polygon in obj.data.polygons:
        polygon.use_smooth = True
    return obj


def sphere(name, radius, location, material):
    bpy.ops.mesh.primitive_uv_sphere_add(
        segments=72,
        ring_count=36,
        radius=radius,
        location=location,
    )
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(material)
    for polygon in obj.data.polygons:
        polygon.use_smooth = True
    return obj


def remove_prefixed(prefixes):
    for obj in list(bpy.data.objects):
        if any(obj.name.startswith(prefix) for prefix in prefixes):
            bpy.data.objects.remove(obj, do_unlink=True)


def configure_sun(camera):
    sun_sphere = bpy.data.objects.get("Sun sphere")
    sun_halo = bpy.data.objects.get("Sun halo disc")
    if sun_sphere is None or sun_halo is None:
        raise RuntimeError("The approved source scene is missing the sun objects")

    sun_material = make_material(
        "Sun",
        (1.0, 0.55, 0.005),
        roughness=0.30,
        coat=0.09,
        emission=(1.0, 0.42, 0.002),
        emission_strength=0.34,
    )
    halo_material = make_material(
        "Sun halo",
        (1.0, 0.70, 0.08),
        roughness=0.52,
        coat=0.02,
        emission=(1.0, 0.56, 0.015),
        emission_strength=0.12,
    )
    ray_material = make_material(
        "Sun pixel rays",
        (1.0, 0.50, 0.018),
        roughness=0.40,
        coat=0.05,
        emission=(1.0, 0.38, 0.008),
        emission_strength=0.15,
    )

    sun_sphere.data.materials.clear()
    sun_sphere.data.materials.append(sun_material)
    sun_halo.data.materials.clear()
    sun_halo.data.materials.append(halo_material)

    center = sun_sphere.location.copy()
    camera_rotation = camera.matrix_world.to_quaternion()
    right = camera_rotation @ Vector((1.0, 0.0, 0.0))
    up = camera_rotation @ Vector((0.0, 1.0, 0.0))
    forward = camera_rotation @ Vector((0.0, 0.0, -1.0))

    rays = []
    for index in range(8):
        angle = index * math.tau / 8.0
        radial_length = 0.38 if index % 2 == 0 else 0.30
        distance = 1.34 if index % 2 == 0 else 1.31
        location = (
            center
            + right * math.cos(angle) * distance
            + up * math.sin(angle) * distance
            + forward * 0.22
        )
        ray = rounded_box(
            f"Sun pixel ray {index + 1:02d}",
            (radial_length, 0.22, 0.075),
            location,
            ray_material,
            bevel=0.052,
        )
        ray.rotation_mode = "QUATERNION"
        ray.rotation_quaternion = camera_rotation @ Quaternion(Vector((0.0, 0.0, 1.0)), angle)
        rays.append(ray)

    return [sun_halo, sun_sphere, *rays]


def create_blue_node(camera):
    blue_material = make_material(
        "Ice blue node",
        (0.40, 0.70, 1.0),
        roughness=0.27,
        coat=0.12,
        emission=(0.30, 0.62, 1.0),
        emission_strength=0.16,
    )
    halo_material = make_material(
        "Ice blue node halo",
        (0.72, 0.86, 1.0),
        roughness=0.58,
        coat=0.015,
        emission=(0.55, 0.78, 1.0),
        emission_strength=0.07,
    )

    center = Vector((-3.6, -0.4, 2.25))
    node_sphere = sphere("Blue node sphere", 0.60, center, blue_material)
    node_halo = cylinder("Blue node halo disc", 0.86, 0.045, center, halo_material)
    camera_forward = camera.matrix_world.to_quaternion() @ Vector((0.0, 0.0, -1.0))
    node_halo.location += camera_forward * 0.18
    node_halo.rotation_euler = (camera.location - node_halo.location).to_track_quat("Z", "Y").to_euler()
    return [node_halo, node_sphere]


def world_bounds(objects):
    points = []
    for obj in objects:
        if obj.type == "MESH":
            points.extend(obj.matrix_world @ Vector(corner) for corner in obj.bound_box)
    if not points:
        raise RuntimeError("No mesh bounds found for render target")
    return points


def frame_camera(camera, objects, resolution, padding):
    points = world_bounds(objects)
    rotation = camera.matrix_world.to_quaternion()
    right = rotation @ Vector((1.0, 0.0, 0.0))
    up = rotation @ Vector((0.0, 1.0, 0.0))
    forward = rotation @ Vector((0.0, 0.0, -1.0))

    horizontal = [point.dot(right) for point in points]
    vertical = [point.dot(up) for point in points]
    depth = [point.dot(forward) for point in points]
    center = (
        right * ((min(horizontal) + max(horizontal)) * 0.5)
        + up * ((min(vertical) + max(vertical)) * 0.5)
        + forward * ((min(depth) + max(depth)) * 0.5)
    )
    camera.location = center - forward * 16.0
    camera.rotation_mode = "QUATERNION"
    camera.rotation_quaternion = rotation
    width = max(horizontal) - min(horizontal)
    height = max(vertical) - min(vertical)
    aspect = resolution[0] / resolution[1]
    camera.data.type = "ORTHO"
    camera.data.shift_x = 0.0
    camera.data.shift_y = 0.0
    camera.data.ortho_scale = max(height * padding, width * padding / aspect)


def render_target(scene, camera, objects, resolution, output_path, padding):
    target_set = set(objects)
    hidden_state = {obj.name: obj.hide_render for obj in scene.objects}
    for obj in scene.objects:
        if obj.type == "MESH":
            obj.hide_render = obj not in target_set

    frame_camera(camera, objects, resolution, padding)
    scene.render.resolution_x = resolution[0]
    scene.render.resolution_y = resolution[1]
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.image_settings.color_depth = "8"
    scene.render.image_settings.compression = 45
    scene.render.filepath = output_path
    bpy.ops.render.render(write_still=True)

    for obj in scene.objects:
        obj.hide_render = hidden_state.get(obj.name, False)


def main():
    os.makedirs(ASSET_DIR, exist_ok=True)
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE_NEXT"
    camera = scene.camera
    if camera is None:
        raise RuntimeError("The approved source scene has no camera")

    remove_prefixed(("Sun pixel ray", "Blue node"))
    original_location = camera.location.copy()
    original_rotation = camera.rotation_euler.copy()
    original_scale = camera.data.ortho_scale

    sun_objects = configure_sun(camera)
    blue_objects = create_blue_node(camera)

    render_target(scene, camera, sun_objects, (800, 800), SUN_OUTPUT, padding=1.12)
    render_target(scene, camera, blue_objects, (600, 600), BLUE_OUTPUT, padding=1.16)

    camera.location = original_location
    camera.rotation_mode = "XYZ"
    camera.rotation_euler = original_rotation
    camera.data.ortho_scale = original_scale
    scene.render.film_transparent = False
    bpy.ops.wm.save_as_mainfile(filepath=OUTPUT_BLEND)

    print(f"SUN={SUN_OUTPUT}")
    print(f"BLUE={BLUE_OUTPUT}")
    print(f"BLEND={OUTPUT_BLEND}")


if __name__ == "__main__":
    main()
