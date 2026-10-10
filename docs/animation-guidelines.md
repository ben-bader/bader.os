# Animation guidelines

Motion gives a small amount of continuity to the portfolio; it never gates content.

- GSAP and ScrollTrigger reveal section headings and coordinate the selected project's architecture focus.
- The React Three Fiber scene owns its frame updates; Lenis is advanced from that same frame bridge.
- The pointer and scroll buses are shared input sources. Do not add another document-wide listener for the same signal.
- Keep content visible before hydration and when JavaScript, WebGL, or motion is unavailable.
- Honor `prefers-reduced-motion`: the runtime omits both the Canvas and GSAP orchestrator, and CSS removes decorative motion and smooth scrolling.
- Avoid pinned sections, large text transitions, and continuous project diagram animation.
