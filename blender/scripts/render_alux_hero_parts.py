import bpy
import os
from mathutils import Vector


SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BLENDER_ROOT = os.path.dirname(SCRIPT_DIR)
PROJECT_ROOT = os.path.dirname(BLENDER_ROOT)
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "assets")


def descendants(root):
    result = []
    stack = list(root.children)
    while stack:
        obj = stack.pop()
        result.append(obj)
        stack.extend(obj.children)
    return result


def world_bounds(objects):
    points = []
    for obj in objects:
        if obj.type != "MESH":
            continue
        points.extend(obj.matrix_world @ Vector(corner) for corner in obj.bound_box)
    if not points:
        raise RuntimeError("No mesh bounds found for render target")
    minimum = Vector((
        min(point.x for point in points),
        min(point.y for point in points),
        min(point.z for point in points),
    ))
    maximum = Vector((
        max(point.x for point in points),
        max(point.y for point in points),
        max(point.z for point in points),
    ))
    return points, minimum, maximum


def frame_camera(camera, objects, resolution, padding=1.22):
    points, _, _ = world_bounds(objects)
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
    # Keep a final render-safe gutter in addition to the compositional padding.
    # The previous export touched the top/bottom alpha bounds, which physically
    # clipped the first stud even though the mesh itself was complete.
    camera.data.ortho_scale = max(height * padding, width * padding / aspect) * 1.16
    bpy.context.view_layer.update()
    print(
        f"FRAME {resolution}: width={width:.3f} height={height:.3f} "
        f"aspect={aspect:.3f} ortho={camera.data.ortho_scale:.3f} center={tuple(round(v, 3) for v in center)}"
    )


def render_target(name, objects, resolution, filename, padding=1.22):
    scene = bpy.context.scene
    camera = scene.camera
    target_set = set(objects)

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
    scene.render.image_settings.compression = 50
    scene.render.filepath = os.path.join(OUTPUT_DIR, filename)
    bpy.ops.render.render(write_still=True)
    print(f"RENDERED {name}: {scene.render.filepath}")


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE_NEXT"

    upper_root = bpy.data.objects.get("Upper floating precision module")
    lower_root = bpy.data.objects.get("Lower connected module assembly")
    sun_sphere = bpy.data.objects.get("Sun sphere")
    sun_halo = bpy.data.objects.get("Sun halo disc")

    if not all((upper_root, lower_root, sun_sphere, sun_halo)):
        missing = [
            name
            for name, obj in (
                ("Upper floating precision module", upper_root),
                ("Lower connected module assembly", lower_root),
                ("Sun sphere", sun_sphere),
                ("Sun halo disc", sun_halo),
            )
            if obj is None
        ]
        raise RuntimeError(f"Missing scene objects: {missing}")

    upper_meshes = [obj for obj in descendants(upper_root) if obj.type == "MESH"]
    lower_meshes = [obj for obj in descendants(lower_root) if obj.type == "MESH"]
    sun_meshes = [sun_halo, sun_sphere]

    render_target(
        "upper brick",
        upper_meshes,
        (1400, 560),
        "alux-hero-3d-upper-brick.png",
        padding=2.35,
    )
    render_target(
        "lower connected assembly",
        lower_meshes,
        (1600, 720),
        "alux-hero-3d-lower-assembly.png",
        padding=2.15,
    )
    render_target(
        "sun",
        sun_meshes,
        (700, 700),
        "alux-hero-3d-sun.png",
        padding=1.15,
    )


if __name__ == "__main__":
    main()
