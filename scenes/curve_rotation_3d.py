"""
Curve Rotation in Space — Surface of Revolution
================================================
A 3Blue1Brown-style animation: a 2D curve rotates around the x-axis,
sweeping out a beautiful surface in 3D space.

Uses Manim Community Edition (manim >= 0.19.0).

Render:
    manim -pqh scenes/curve_rotation_3d.py SurfaceOfRevolution   # 1080p preview
    manim -pqk scenes/curve_rotation_3d.py SurfaceOfRevolution   # 4K preview
    manim -qh scenes/curve_rotation_3d.py SurfaceOfRevolution    # 1080p final
"""

from manim import *
import numpy as np

# ── config ──────────────────────────────────────────────────────────
config.pixel_height = 1080
config.pixel_width = 1920
config.frame_rate = 60
config.background_color = "#0a0a14"


def profile_curve(t: float) -> float:
    """The generating curve: radius at position x = t.

    f(t) = 1.8 + sin(t) + 0.35*cos(2.5*t) + 0.15*sin(4*t)

    Creates a vase-like profile — organic, not symmetric,
    with subtle high-frequency detail that looks gorgeous
    when revolved.
    """
    return 1.8 + np.sin(t) + 0.35 * np.cos(2.5 * t) + 0.15 * np.sin(4 * t)


def surface_of_revolution(u: float, v: float) -> np.ndarray:
    """Parametric surface: revolve profile_curve around the x-axis.

    u ∈ [0, 2π]  — position along the axis (the generating curve's parameter)
    v ∈ [0, 2π]  — azimuthal angle around the axis

    Returns (x, y, z) = (u, f(u)*cos(v), f(u)*sin(v))
    """
    r = profile_curve(u)
    return np.array([u, r * np.cos(v), r * np.sin(v)])


class SurfaceOfRevolution(ThreeDScene):
    """Show a curve rotating in 3D space to generate a surface."""

    def construct(self):
        # ── 1. Title ───────────────────────────────────────────────
        title = Text(
            "Surface of Revolution",
            font="sans-serif", font_size=64,
            gradient=(BLUE_C, TEAL_C, GREEN_C),
        )
        subtitle = Text(
            "Curve Rotation in 3D Space",
            font="sans-serif", font_size=36,
            color=WHITE,
        ).next_to(title, DOWN, buff=0.3)

        formula = MathTex(
            r"f(x) = 1.8 + \sin(x) + 0.35\cos(2.5x) + 0.15\sin(4x)",
            color=YELLOW_C,
            font_size=36,
        ).next_to(subtitle, DOWN, buff=0.5)

        self.play(
            Write(title, run_time=1.2),
            FadeIn(subtitle, shift=UP * 0.3, run_time=1.0),
            Write(formula, run_time=1.5),
        )
        self.wait(0.8)
        self.play(
            FadeOut(title),
            FadeOut(subtitle),
            formula.animate.to_edge(UP, buff=0.4).scale(0.7),
        )
        self.wait(0.3)

        # ── 2. Draw the generating curve in the xy-plane ───────────
        axes_2d = Axes(
            x_range=[0, TAU + 0.5, 1],
            y_range=[0, 4.5, 1],
            x_length=10,
            y_length=5,
            axis_config={"color": GREY_B, "stroke_width": 1.5},
        ).shift(DOWN * 0.5)

        curve_2d = axes_2d.plot(
            lambda x: profile_curve(x),
            x_range=[0, TAU],
            color=YELLOW,
            stroke_width=5,
        )

        curve_label = MathTex(
            r"y = f(x)",
            color=YELLOW,
            font_size=30,
        ).next_to(curve_2d.get_end(), RIGHT, buff=0.4)

        axis_x_label = MathTex(r"x", color=GREY_B, font_size=28).next_to(
            axes_2d.x_axis.get_end(), RIGHT, buff=0.2
        )

        self.play(
            Create(axes_2d, run_time=1.0),
            Create(curve_2d, run_time=2.0),
            Write(curve_label, run_time=0.5),
            Write(axis_x_label, run_time=0.3),
        )
        self.wait(0.8)

        # ── 3. Transition to 3D ────────────────────────────────────
        # Fade out 2D labels, set 3D camera
        self.play(
            FadeOut(curve_label),
            FadeOut(axis_x_label),
            FadeOut(axes_2d),
        )

        self.move_camera(
            phi=72 * DEGREES,
            theta=-55 * DEGREES,
            frame_center=np.array([PI, 0, 0.5]),
            zoom=0.85,
            run_time=2.0,
        )

        # ── 4. 3D elements: axis + generating curve ──────────────────
        axis_3d = Line3D(
            start=np.array([-0.5, 0, 0]),
            end=np.array([TAU + 0.8, 0, 0]),
            color=WHITE,
            stroke_width=3,
        ).shift(np.array([0, 0, 0]))

        axis_arrow = Cone(
            direction=RIGHT,
            base_radius=0.08,
            height=0.3,
            fill_color=WHITE,
            fill_opacity=0.9,
        ).move_to(np.array([TAU + 0.8, 0, 0]))

        axis_label_3d = MathTex(
            r"\text{axis of rotation}",
            color=LIGHT_GREY,
            font_size=28,
        ).next_to(axis_3d.get_end(), RIGHT * 0.5 + UP * 0.3)

        curve_3d = ParametricFunction(
            lambda t: np.array([t, profile_curve(t), 0]),
            t_range=[0, TAU],
            color=YELLOW,
            stroke_width=6,
        )

        self.play(
            Create(axis_3d, run_time=1.0),
            FadeIn(axis_arrow, scale=0.5, run_time=0.5),
            Write(axis_label_3d, run_time=0.6),
        )
        self.wait(0.3)
        self.play(Create(curve_3d, run_time=2.5))
        self.wait(0.6)

        # ── 5. Animate the rotation ────────────────────────────────
        # Show the curve at increasing angles, leaving ghost traces
        # that build up the surface.

        num_ribs = 24
        angles = np.linspace(0, TAU, num_ribs + 1)[:-1]  # skip 2π (same as 0)

        ribs = VGroup()
        for angle in angles:
            rib = ParametricFunction(
                lambda t: np.array([
                    t,
                    profile_curve(t) * np.cos(angle),
                    profile_curve(t) * np.sin(angle),
                ]),
                t_range=[0, TAU],
                color=interpolate_color(YELLOW, TEAL_C, angle / TAU),
                stroke_width=1.8,
                stroke_opacity=0.5,
            )
            ribs.add(rib)

        # Animate ribs appearing one by one, while rotating the
        # original curve
        orig_curve_ref = curve_3d.copy()

        for i, (angle, rib) in enumerate(zip(angles, ribs)):
            # Rotate the highlighted curve to this angle
            new_curve = ParametricFunction(
                lambda t, a=angle: np.array([
                    t,
                    profile_curve(t) * np.cos(a),
                    profile_curve(t) * np.sin(a),
                ]),
                t_range=[0, TAU],
                color=YELLOW,
                stroke_width=5,
            )

            if i == 0:
                self.add(new_curve)
                self.remove(curve_3d)
                curve_3d_ref = new_curve
            else:
                self.play(
                    Transform(curve_3d_ref, new_curve, run_time=0.08),
                    FadeIn(rib, run_time=0.06),
                )

        self.wait(0.5)

        # ── 6. Build the full surface ───────────────────────────────
        surface = Surface(
            lambda u, v: surface_of_revolution(u, v),
            u_range=[0, TAU],
            v_range=[0, TAU],
            resolution=(80, 48),
            fill_opacity=0.55,
            checkerboard_colors=[BLUE_D, TEAL_D],
            stroke_width=0.3,
            stroke_color=BLUE_E,
        )

        self.play(
            FadeIn(surface, run_time=1.8),
            FadeOut(axis_label_3d, run_time=0.4),
        )

        # Dim the ribs now that the surface is in place
        self.play(ribs.animate.set_stroke(opacity=0.15), run_time=1.0)

        self.wait(0.6)

        # ── 7. Camera orbit around the finished surface ─────────────
        formula_annotation = MathTex(
            r"\begin{pmatrix} x \\ y \\ z \end{pmatrix}"
            r"= \begin{pmatrix} u \\ f(u)\cos v \\ f(u)\sin v \end{pmatrix}",
            color=LIGHT_GREY,
            font_size=28,
        ).to_corner(DR, buff=0.6)

        self.play(Write(formula_annotation, run_time=1.0))
        self.wait(0.3)

        self.begin_ambient_camera_rotation(rate=0.35)
        self.wait(8.0)
        self.stop_ambient_camera_rotation()

        # ── 8. Outro — fade to wireframe, then out ──────────────────
        wireframe = Surface(
            lambda u, v: surface_of_revolution(u, v),
            u_range=[0, TAU],
            v_range=[0, TAU],
            resolution=(30, 18),
            fill_opacity=0.0,
            stroke_width=1.0,
            stroke_color=TEAL_C,
        )

        self.play(
            Transform(surface, wireframe, run_time=1.5),
            ribs.animate.set_stroke(opacity=0.05),
        )
        self.wait(1.0)

        self.play(
            *[FadeOut(mob, run_time=1.0) for mob in self.mobjects],
        )

        # ── 9. End card ─────────────────────────────────────────────
        end_card = VGroup(
            Text("Surface of Revolution", font_size=48, gradient=(BLUE_C, TEAL_C)),
            Text(
                "math-animation-studio • github.com",
                font_size=24,
                color=GREY_B,
            ).next_to(Text(""), DOWN, buff=0.4),
        ).arrange(DOWN, buff=0.3)

        # Fix: properly chain the texts
        end_card[1].next_to(end_card[0], DOWN, buff=0.4)

        self.play(FadeIn(end_card, run_time=1.2))
        self.wait(2.0)
        self.play(FadeOut(end_card, run_time=0.8))


# ── Bonus: quick interactive test scene ────────────────────────────
class QuickPreview(ThreeDScene):
    """Fast low-res preview — renders in seconds for iteration."""

    def construct(self):
        self.set_camera_orientation(phi=70 * DEGREES, theta=-50 * DEGREES)
        self.camera.frame_center = np.array([PI, 0, 0.3])

        surface = Surface(
            lambda u, v: surface_of_revolution(u, v),
            u_range=[0, TAU],
            v_range=[0, TAU],
            resolution=(40, 24),
            fill_opacity=0.6,
            checkerboard_colors=[BLUE_D, TEAL_D],
            stroke_width=0.4,
            stroke_color=BLUE_E,
        )

        axis = Line3D(
            start=np.array([-0.5, 0, 0]),
            end=np.array([TAU + 0.5, 0, 0]),
            color=WHITE,
            stroke_width=2,
        )

        self.add(axis, surface)
        self.begin_ambient_camera_rotation(rate=0.5)
        self.wait(6.0)
        self.stop_ambient_camera_rotation()
