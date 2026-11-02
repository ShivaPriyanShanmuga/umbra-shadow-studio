# Validation record

November 1, 2026. Results describe actual checks, not intended coverage.

## Automated

Thirteen Node tests pass:

1. Exact reconstruction of compatible masks, including multiple separated pixels per row.
2. Detection of one-sided occupied rows without invented geometry.
3. Explicit support repair, nonmutation of originals, and recovered exact projections.
4. Reduced-material forward-projection preservation across 29 deterministic varied mask pairs.
5. Empty, face-connected and diagonal-contact component counting.
6. Shared-face removal and positive outward triangle winding.
7. Binary STL header, triangle count and byte length.
8. Rejection of malformed, nonbinary and oversized project data.
9. Exact single-voxel recovery at every tested row.
10. Variable chapter durations, boundaries and total runtime.
11. Continuous camera poses across chapter boundaries.
12. Quintic easing endpoints and out-of-range clamping.
13. MP4 timing, sample tables and chunk offsets.

`npm run check` and the Vite production build succeeded. Vite reports a bundle-size advisory for the Three.js-containing main bundle; no build error.

## Actual desktop browser use

Chrome rendered the actual heart/moon sculpture and both directional-light shadows. The live metrics reported 14,417 occupied cells, one face-connected component and 100%/100% grid IoU for that example at resolution 48.

Entered custom front text HI. Switched to reduced material: both IoUs remained 100%, while the volume fell to 1,280 cells and component count became 261. Cleared side B: the app reported 40 incompatible rows, empty geometry, 0%/100% IoU and disabled STL export. Explicit repair reported 40 pixels added to B and recovered 100%/100% agreement, with disconnected pieces still reported.

Returned to the solid heart/moon pair. Saved editable JSON, STL and SVG proof through the real UI. The downloads existed on disk: project 41,569 bytes; STL 594,484 bytes; SVG proof 99,754 bytes. A browser download-event waiter timed out, but the application toast and actual files confirmed successful downloads. The timeout was a browser automation limitation, not an application export failure.

Desktop screenshots were captured from the actual app. Additional import/reload, drawing, mobile-width and recording checks are tracked as they complete.

## Not established

Physical fabrication, actual iPhone use, user-study outcomes and arbitrary-model support are not verified. No result here establishes novelty, adoption or winning likelihood.

## Hosted and responsive verification
The public GitHub Pages build was opened in Chrome without a sign-in gate. At an explicit 390-pixel viewport, innerWidth was 390 and document scrollWidth was 375, with no horizontal overflow; a full-page screenshot was visually inspected. The narrow layout moves the studio before the drawing tools. This is a desktop browser viewport check, not actual iPhone hardware testing. GitHub Actions test/build run 41374359257 and Pages deployment run 41354025756 completed successfully. A separate owner-private Sites deployment also succeeded.


## Additional end-to-end checks
On the public app, a direct pointer drag changed front-target IoU to 97.8%, produced four incompatible rows, and changed geometry volume to 14,515 cells. Undo restored the prior design. A real saved JSON was opened through the file chooser; the app recomputed 14,417 cells and 100%/100% agreement. Reload preserved the project. Stage PNG export produced an 87,288-byte file. The original demonstration was published as a narrated video and has since been superseded by the revised frame-accurate export documented below.


## Smooth demonstration revision

The revised renderer evaluates each camera pose at an explicit timestamp and encodes every frame with WebCodecs, avoiding dependence on real-time screen capture speed. Camera transitions use quintic easing. Static shadow maps are refreshed when scene geometry or lights change.

The actual four-second browser export contains 240 frames at 60 fps. A two-second moving sample contained 120 distinct decoded frames. The complete narrated MP4 contains 7,560 video frames at 1280×720 and 60 fps, with a 126.000-second runtime; a moving one-second sample contained 60 distinct decoded video frames. Representative full-video frames were visually inspected.

The revised demonstration is published at https://youtu.be/LzysLYKsMy4 and embedded in the existing Devpost entry. The previous video was made private. Devpost still displays SUBMITTED TO Arbiter Hacks V1. The public application shows the revised Render demo control. GitHub CI run 41374359257 and Pages run 41374360639 succeeded.
