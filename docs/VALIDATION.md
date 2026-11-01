# Validation record

November 1, 2026. Results describe actual checks, not intended coverage.

## Automated

Nine Node tests pass:

1. Exact reconstruction of compatible masks, including multiple separated pixels per row.
2. Detection of one-sided occupied rows without invented geometry.
3. Explicit support repair, nonmutation of originals, and recovered exact projections.
4. Reduced-material forward-projection preservation across 29 deterministic varied mask pairs.
5. Empty, face-connected and diagonal-contact component counting.
6. Shared-face removal and positive outward triangle winding.
7. Binary STL header, triangle count and byte length.
8. Rejection of malformed, nonbinary and oversized project data.
9. Exact single-voxel recovery at every tested row.

`npm run check` and the Vite production build succeeded. Vite reports a bundle-size advisory for the Three.js-containing main bundle; no build error.

## Actual desktop browser use

Chrome rendered the actual heart/moon sculpture and both directional-light shadows. The live metrics reported 14,417 occupied cells, one face-connected component and 100%/100% grid IoU for that example at resolution 48.

Entered custom front text HI. Switched to reduced material: both IoUs remained 100%, while the volume fell to 1,280 cells and component count became 261. Cleared side B: the app reported 40 incompatible rows, empty geometry, 0%/100% IoU and disabled STL export. Explicit repair reported 40 pixels added to B and recovered 100%/100% agreement, with disconnected pieces still reported.

Returned to the solid heart/moon pair. Saved editable JSON, STL and SVG proof through the real UI. The downloads existed on disk: project 41,569 bytes; STL 594,484 bytes; SVG proof 99,754 bytes. A browser download-event waiter timed out, but the application toast and actual files confirmed successful downloads. The timeout was a browser automation limitation, not an application export failure.

Desktop screenshots were captured from the actual app. Additional import/reload, drawing, mobile-width and recording checks are tracked as they complete.

## Not established

Physical fabrication, actual iPhone use, user-study outcomes and arbitrary-model support are not verified. No result here establishes novelty, adoption or winning likelihood.
