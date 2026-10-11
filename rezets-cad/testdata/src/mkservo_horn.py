import math, Part, FreeCAD as App
V = App.Vector
# servo body, same as testdata/servo.step
body = Part.makeBox(23, 12.5, 22.5, V(-11.5, -6.25, 0))
tabs = Part.makeBox(32.5, 12.5, 2.5, V(-16.25, -6.25, 16))
servo = body.fuse(tabs)
for x in (-14, 14): servo = servo.cut(Part.makeCylinder(1, 10, V(x, 0, 10)))
AX = V(-5.5, 0, 0)
servo = servo.fuse(Part.makeCylinder(5.9, 1.5, V(-5.5, 0, 22.5))).fuse(Part.makeCylinder(2.4, 4, V(-5.5, 0, 22.5))).removeSplitter()
# horn, proportions of the SC09 horn: arm 1.5 thick, bottom 1.75 above the shaft end, screw head 0.6
SHAFT_TOP = 26.5; Z0 = SHAFT_TOP + 1.75; T = 1.5; L = 17.1 - 2.0; R1 = 4.65; R2 = 2.0
def arm(sign):
    phi = math.asin((R1 - R2) / L)
    c1 = V(AX.x, 0, Z0); c2 = V(AX.x, sign * L, Z0)
    def pt(c, r, nx, ny): return V(c.x + r * nx, c.y + r * ny, Z0)
    # arm along y: tangent normals in the xy plane
    nu = (math.cos(phi), sign * math.sin(phi)); nl = (-math.cos(phi), sign * math.sin(phi))
    t1u, t2u = pt(c1, R1, *nu), pt(c2, R2, *nu); t1l, t2l = pt(c1, R1, *nl), pt(c2, R2, *nl)
    tip = V(c2.x, c2.y + sign * R2, Z0); back = V(c1.x, c1.y - sign * R1, Z0)
    w = Part.Wire([Part.LineSegment(t1u, t2u).toShape(), Part.Arc(t2u, tip, t2l).toShape(), Part.LineSegment(t2l, t1l).toShape(), Part.Arc(t1l, back, t1u).toShape()])
    return Part.Face(w).extrude(V(0, 0, T))
horn = arm(1).fuse(arm(-1))
horn = horn.fuse(Part.makeCylinder(3.5, Z0 - 24.1, V(AX.x, 0, 24.1)))            # hub down to the boss
horn = horn.cut(Part.makeCylinder(2.4, SHAFT_TOP - 24.1, V(AX.x, 0, 24.1)))         # splined bore on the shaft
for s in (1, -1):
    for i in range(6): horn = horn.cut(Part.makeCylinder(0.5, 5, V(AX.x, s * (6.5 + 1.9 * i), Z0 - 1)))
horn = horn.fuse(Part.makeCylinder(2.9, 0.6, V(AX.x, 0, Z0 + T))).removeSplitter()   # screw head
Part.makeCompound([servo, horn]).exportStep("/home/user/FreeCAD/rezets-cad/testdata/servo_horn.step")
bb = Part.makeCompound([servo, horn]).BoundBox
print("servo top", servo.BoundBox.ZMax, "with horn", bb.ZMax, "horn len", horn.BoundBox.YLength, "solids", len(servo.Solids), len(horn.Solids), "vol", round(horn.Volume, 2))
