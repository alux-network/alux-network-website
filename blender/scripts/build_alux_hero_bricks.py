import bpy
import math
import os
from mathutils import Vector


SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BLENDER_ROOT = os.path.dirname(SCRIPT_DIR)
PROJECT_ROOT = os.path.dirname(BLENDER_ROOT)
ALUX_ROOT = os.path.dirname(PROJECT_ROOT)
OUTPUT_DIR = os.path.join(ALUX_ROOT, "output", "20260714_home-3d-candidates")
SCENE_PATH = os.path.join(BLENDER_ROOT, "scenes", "alux_hero_bricks_candidate.blend")
REVIEW_PATH = os.path.join(OUTPUT_DIR, "20260714_ALUX首屏3D积木候选_1比1_暖象牙.png")
ALPHA_PATH = os.path.join(OUTPUT_DIR, "20260714_ALUX首屏3D积木候选_1比1_透明.png")


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for datablocks in (
        bpy.data.meshes,
        bpy.data.curves,
        bpy.data.materials,
        bpy.data.cameras,
        bpy.data.lights,
    ):
        for block in list(datablocks):
            if block.users == 0:
                datablocks.remove(block)


def set_input(node, name, value):
    socket = node.inputs.get(name)
    if socket is not None:
        socket.default_value = value


def make_material(
    name,
    color,
    roughness=0.38,
    coat=0.07,
    coat_roughness=0.24,
    alpha=1.0,
    emission=None,
    emission_strength=0.0,
):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    mat.diffuse_color = (*color, alpha)
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    set_input(bsdf, "Base Color", (*color, 1.0))
    set_input(bsdf, "Roughness", roughness)
    set_input(bsdf, "Metallic", 0.0)
    set_input(bsdf, "IOR", 1.46)
    set_input(bsdf, "Coat Weight", coat)
    set_input(bsdf, "Coat Roughness", coat_roughness)
    set_input(bsdf, "Alpha", alpha)
    if emission is not None:
        set_input(bsdf, "Emission Color", (*emission, 1.0))
        set_input(bsdf, "Emission Strength", emission_strength)
    if alpha < 1.0:
        try:
            mat.surface_render_method = "DITHERED"
        except Exception:
            pass
        mat.use_transparency_overlap = False
    return mat


def apply_modifier(obj, modifier):
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.modifier_apply(modifier=modifier.name)
    obj.select_set(False)


def rounded_box(name, dimensions, location=(0, 0, 0), bevel=0.05, material=None, apply=True):
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel > 0:
        mod = obj.modifiers.new("Precision bevel", "BEVEL")
        mod.width = bevel
        mod.segments = 4
        mod.limit_method = "ANGLE"
        mod.harden_normals = True
        if apply:
            apply_modifier(obj, mod)
    if material is not None:
        obj.data.materials.append(material)
    for poly in obj.data.polygons:
        poly.use_smooth = False
    return obj


def cylinder(name, radius, depth, location, material, vertices=64, bevel=0.045):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=location)
    obj = bpy.context.object
    obj.name = name
    mod = obj.modifiers.new("Stud edge bevel", "BEVEL")
    mod.width = bevel
    mod.segments = 3
    mod.limit_method = "ANGLE"
    mod.harden_normals = True
    apply_modifier(obj, mod)
    obj.data.materials.append(material)
    # Keep the circular side/bevel continuous while leaving the two caps flat.
    # Smoothing every polygon makes the cap borrow a side normal at the seam,
    # which reads as a missing wedge from the hero camera angle.
    for poly in obj.data.polygons:
        poly.use_smooth = abs(poly.normal.z) < 0.999
    obj.data.update()
    return obj


def sphere(name, radius, location, material, segments=64, rings=32):
    bpy.ops.mesh.primitive_uv_sphere_add(
        segments=segments,
        ring_count=rings,
        radius=radius,
        location=location,
    )
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(material)
    for poly in obj.data.polygons:
        poly.use_smooth = True
    return obj


def difference(target, cutter):
    mod = target.modifiers.new(f"Recess {cutter.name}", "BOOLEAN")
    mod.operation = "DIFFERENCE"
    mod.solver = "EXACT"
    mod.object = cutter
    apply_modifier(target, mod)
    bpy.data.objects.remove(cutter, do_unlink=True)


def parent_group(name, objects, location=(0, 0, 0), rotation=(0, 0, 0)):
    root = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(root)
    for obj in objects:
        obj.parent = root
    root.location = location
    root.rotation_euler = rotation
    return root


def create_brick(
    name,
    columns,
    rows,
    body_height,
    body_material,
    inset_material,
    pixel_material,
    stud_material,
    plate_coverage=None,
):
    length = columns - 0.025
    depth = rows - 0.025
    body = rounded_box(
        f"{name}_Body",
        (length, depth, body_height),
        bevel=0,
        material=body_material,
    )
    objects = [body]

    # Discrete underside-style grooves align to the stud grid.
    groove_count = max(columns - 1, 1)
    groove_span = max(columns - 2, 0)
    groove_positions = [
        -groove_span / 2 + i * (groove_span / max(groove_count - 1, 1))
        for i in range(groove_count)
    ]
    groove_z = -body_height / 2 + 0.055
    for i, x in enumerate(groove_positions):
        cutter = rounded_box(
            f"{name}_BottomGrooveCutter_{i + 1:02d}",
            (0.44, 0.20, 0.17),
            location=(x, -depth / 2 + 0.025, groove_z),
            bevel=0.05,
        )
        difference(body, cutter)

    # Nearly flush square tiles provide a restrained voxel rhythm.
    pixel_count = min(columns, 6)
    pixel_span = min(length - 0.9, 3.9)
    pixel_start = -pixel_span / 2

    # A shallow groove on the visible right end face.
    side_cutter = rounded_box(
        f"{name}_SideGrooveCutter",
        (0.20, min(0.42, depth * 0.42), 0.26),
        location=(length / 2 - 0.02, -depth * 0.06, -body_height / 2 + 0.105),
        bevel=0.045,
    )
    difference(body, side_cutter)

    # Bevel after cutting so all recess edges catch a narrow, controlled highlight.
    bevel_mod = body.modifiers.new("Engineering edge bevel", "BEVEL")
    bevel_mod.width = 0.07
    bevel_mod.segments = 4
    bevel_mod.limit_method = "ANGLE"
    bevel_mod.harden_normals = True
    apply_modifier(body, bevel_mod)

    for i, x in enumerate(groove_positions):
        groove_insert = rounded_box(
            f"{name}_BottomGrooveInset_{i + 1:02d}",
            (0.31, 0.035, 0.085),
            location=(x, -depth / 2 + 0.102, groove_z),
            bevel=0.03,
            material=inset_material,
        )
        objects.append(groove_insert)

    side_insert = rounded_box(
        f"{name}_SideGrooveInset",
        (0.035, min(0.30, depth * 0.30), 0.14),
        location=(length / 2 - 0.105, -depth * 0.06, -body_height / 2 + 0.105),
        bevel=0.018,
        material=inset_material,
    )
    objects.append(side_insert)

    for i in range(pixel_count):
        x = pixel_start + (pixel_span * i / max(pixel_count - 1, 1))
        pixel = rounded_box(
            f"{name}_PixelInset_{i + 1:02d}",
            (0.13, 0.025, 0.13),
            location=(x, -depth / 2 - 0.008, 0.10),
            bevel=0.012,
            material=pixel_material,
        )
        objects.append(pixel)

    coverage = plate_coverage or set()
    stud_radius = 0.30
    stud_height = 0.22
    x0 = -(columns - 1) / 2
    y0 = -(rows - 1) / 2
    for row in range(rows):
        for col in range(columns):
            if (col, row) in coverage:
                continue
            stud = cylinder(
                f"{name}_Stud_{col + 1:02d}_{row + 1:02d}",
                stud_radius,
                stud_height,
                (x0 + col, y0 + row, body_height / 2 + stud_height / 2 - 0.002),
                stud_material,
                bevel=0.035,
            )
            objects.append(stud)

    return objects


def add_area_light(name, location, energy, size, color, target=(0, 0, 1.5)):
    data = bpy.data.lights.new(name, "AREA")
    data.energy = energy
    data.shape = "DISK"
    data.size = size
    data.color = color
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    return obj


def setup_scene():
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE_NEXT"
    scene.render.resolution_x = 1600
    scene.render.resolution_y = 1600
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.image_settings.color_depth = "8"
    scene.render.film_transparent = False
    scene.render.use_file_extension = True
    scene.render.filepath = REVIEW_PATH

    scene.view_settings.view_transform = "AgX"
    try:
        scene.view_settings.look = "AgX - Medium High Contrast"
    except Exception:
        pass
    scene.view_settings.exposure = 0.0
    scene.view_settings.gamma = 1.0

    world = bpy.data.worlds.new("ALUX Warm World") if bpy.data.worlds.get("ALUX Warm World") is None else bpy.data.worlds["ALUX Warm World"]
    scene.world = world
    world.use_nodes = True
    nodes = world.node_tree.nodes
    links = world.node_tree.links
    nodes.clear()
    output = nodes.new("ShaderNodeOutputWorld")
    environment_bg = nodes.new("ShaderNodeBackground")
    environment_bg.name = "Soft environment light"
    environment_bg.inputs["Color"].default_value = (1.0, 0.93, 0.82, 1.0)
    environment_bg.inputs["Strength"].default_value = 0.24
    camera_bg = nodes.new("ShaderNodeBackground")
    camera_bg.name = "Warm ivory camera background"
    camera_bg.inputs["Color"].default_value = (1.0, 0.90, 0.74, 1.0)
    camera_bg.inputs["Strength"].default_value = 1.7
    light_path = nodes.new("ShaderNodeLightPath")
    mix = nodes.new("ShaderNodeMixShader")
    links.new(light_path.outputs["Is Camera Ray"], mix.inputs[0])
    links.new(environment_bg.outputs["Background"], mix.inputs[1])
    links.new(camera_bg.outputs["Background"], mix.inputs[2])
    links.new(mix.outputs["Shader"], output.inputs["Surface"])
    scene.camera = None
    return scene


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(SCENE_PATH), exist_ok=True)
    clear_scene()
    scene = setup_scene()

    caramel = make_material("Caramel polymer", (0.52, 0.255, 0.105), roughness=0.39, coat=0.07)
    caramel_inset = make_material("Caramel recess", (0.31, 0.115, 0.035), roughness=0.48, coat=0.02)
    caramel_pixel = make_material("Caramel voxel inset", (0.59, 0.305, 0.135), roughness=0.43, coat=0.035)
    caramel_stud = make_material("Caramel stud", (0.58, 0.29, 0.115), roughness=0.34, coat=0.09)

    mint = make_material("Mint polymer", (0.12, 0.53, 0.39), roughness=0.35, coat=0.09)
    mint_inset = make_material("Mint recess", (0.055, 0.31, 0.22), roughness=0.44, coat=0.03)
    mint_pixel = make_material("Mint voxel inset", (0.16, 0.59, 0.45), roughness=0.39, coat=0.05)
    mint_stud = make_material("Mint stud", (0.18, 0.64, 0.49), roughness=0.31, coat=0.10)

    ivory = make_material("Ivory background", (1.0, 0.95, 0.86), roughness=0.76, coat=0.0)
    backdrop_mat = make_material(
        "Warm ivory backdrop",
        (1.0, 0.94, 0.84),
        roughness=0.82,
        coat=0.0,
        emission=(1.0, 0.88, 0.72),
        emission_strength=0.16,
    )
    dot_mat = make_material("Floating ivory details", (0.94, 0.89, 0.80), roughness=0.35, coat=0.05)
    sun_mat = make_material(
        "Sun",
        (1.0, 0.76, 0.002),
        roughness=0.34,
        coat=0.08,
        emission=(1.0, 0.50, 0.001),
        emission_strength=0.32,
    )
    halo_mat = make_material(
        "Sun halo",
        (1.0, 0.84, 0.18),
        roughness=0.58,
        coat=0.0,
        alpha=1.0,
        emission=(1.0, 0.65, 0.04),
        emission_strength=0.10,
    )

    upper_objects = create_brick(
        "Upper_5x1",
        5,
        1,
        0.92,
        caramel,
        caramel_inset,
        caramel_pixel,
        caramel_stud,
    )
    parent_group(
        "Upper floating precision module",
        upper_objects,
        location=(-0.70, 0.22, 3.35),
        rotation=(math.radians(-7.0), math.radians(2.0), math.radians(-2.5)),
    )

    covered = {(2, 0), (3, 0), (4, 0), (5, 0)}
    lower_objects = create_brick(
        "Lower_6x2",
        6,
        2,
        0.92,
        caramel,
        caramel_inset,
        caramel_pixel,
        caramel_stud,
        plate_coverage=covered,
    )

    mint_objects = create_brick(
        "Mint_4x1_Plate",
        4,
        1,
        0.32,
        mint,
        mint_inset,
        mint_pixel,
        mint_stud,
    )
    for obj in mint_objects:
        obj.location.x += 1.0
        obj.location.y -= 0.50
        obj.location.z += 0.62
    lower_objects.extend(mint_objects)
    parent_group(
        "Lower connected module assembly",
        lower_objects,
        location=(0.45, 0.0, 0.03),
        rotation=(math.radians(1.5), math.radians(-1.0), math.radians(1.5)),
    )

    sun_position = Vector((3.35, 0.72, 5.12))
    halo_disc = cylinder("Sun halo disc", 1.10, 0.05, sun_position, halo_mat, vertices=96, bevel=0.018)
    sphere("Sun sphere", 0.82, sun_position, sun_mat)

    for i, x in enumerate((-1.35, -0.92, -0.49)):
        sphere(
            f"Floating detail {i + 1}",
            0.105 - i * 0.006,
            (x, -0.64, 2.05 + i * 0.015),
            dot_mat,
            segments=32,
            rings=16,
        )

    add_area_light(
        "Sun key",
        (5.6, -4.8, 10.5),
        980,
        4.6,
        (1.0, 0.72, 0.43),
        target=(0.4, 0, 2.0),
    )
    add_area_light(
        "Soft front fill",
        (-5.4, -6.2, 5.4),
        360,
        5.2,
        (0.72, 0.84, 0.88),
        target=(0.0, 0.0, 1.8),
    )
    add_area_light(
        "Mint edge separation",
        (1.0, 6.0, 6.8),
        360,
        3.2,
        (0.72, 0.92, 0.84),
        target=(0.5, 0.0, 1.4),
    )

    camera_data = bpy.data.cameras.new("ALUX product camera")
    camera = bpy.data.objects.new("ALUX product camera", camera_data)
    bpy.context.collection.objects.link(camera)
    camera.location = (9.4, -14.4, 8.7)
    target = Vector((0.25, 0.0, 2.55))
    camera.rotation_euler = (target - camera.location).to_track_quat("-Z", "Y").to_euler()
    camera_data.type = "ORTHO"
    camera_data.ortho_scale = 9.45
    camera_data.lens = 70
    scene.camera = camera

    # A clean opaque disc gives the sun its quiet ring without noisy transparency.
    away_from_camera = (halo_disc.location - camera.location).normalized()
    halo_disc.location += away_from_camera * 0.18
    halo_disc.rotation_euler = (camera.location - halo_disc.location).to_track_quat("Z", "Y").to_euler()

    # Seamless product cyclorama: a floor that curves into the backdrop.
    view_horizontal = Vector((target.x - camera.location.x, target.y - camera.location.y, 0.0)).normalized()
    right_axis = Vector((-view_horizontal.y, view_horizontal.x, 0.0))
    base_origin = Vector((target.x, target.y, 0.0))
    floor_z = -0.44
    curve_start = 5.2
    curve_radius = 4.8
    profile = [(-24.0, floor_z), (curve_start, floor_z)]
    for i in range(1, 17):
        angle = -math.pi / 2 + (math.pi / 2) * (i / 16)
        profile.append(
            (
                curve_start + curve_radius * math.cos(angle),
                floor_z + curve_radius + curve_radius * math.sin(angle),
            )
        )
    profile.append((curve_start + curve_radius, 24.0))

    half_width = 25.0
    vertices = []
    for distance, z in profile:
        center = base_origin + view_horizontal * distance + Vector((0.0, 0.0, z))
        vertices.append(tuple(center - right_axis * half_width))
        vertices.append(tuple(center + right_axis * half_width))
    faces = []
    for i in range(len(profile) - 1):
        left_a = i * 2
        right_a = left_a + 1
        left_b = (i + 1) * 2
        right_b = left_b + 1
        faces.append((left_a, left_b, right_b, right_a))
    cyc_mesh = bpy.data.meshes.new("Warm ivory cyclorama mesh")
    cyc_mesh.from_pydata(vertices, [], faces)
    cyc_mesh.update()
    ground = bpy.data.objects.new("Warm ivory seamless cyclorama", cyc_mesh)
    bpy.context.collection.objects.link(ground)
    ground.data.materials.append(ivory)
    for poly in ground.data.polygons:
        poly.use_smooth = True

    bpy.ops.wm.save_as_mainfile(filepath=SCENE_PATH)

    scene.render.film_transparent = False
    ground.hide_render = True
    scene.render.filepath = REVIEW_PATH
    bpy.ops.render.render(write_still=True)

    scene.render.film_transparent = True
    ground.hide_render = True
    scene.render.filepath = ALPHA_PATH
    bpy.ops.render.render(write_still=True)

    scene.render.film_transparent = False
    ground.hide_render = True
    scene.render.filepath = REVIEW_PATH
    bpy.ops.wm.save_as_mainfile(filepath=SCENE_PATH)

    print(f"REVIEW={REVIEW_PATH}")
    print(f"ALPHA={ALPHA_PATH}")
    print(f"BLEND={SCENE_PATH}")


if __name__ == "__main__":
    main()
