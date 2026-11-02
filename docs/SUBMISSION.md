**General Track — Arbiter Hacks V1**

## Inspiration
Shadow art makes an ordinary object carry more than one meaning. Designing it usually requires understanding geometry or working through a complicated modeling workflow. Umbra asks a simpler question: what if you could start with the two shadows you want, then inspect the form that makes them possible?

## What it does
Draw two silhouettes, enter short text, or import a dark-on-light image. Umbra reconstructs their shared voxel volume and displays a sculpture under two real-time directional lights. Change either target and the geometry updates. Explore endpoint views, materials, orbit and a moving light.

The interface also checks its own result. It projects the occupied cells back onto both target grids and reports intersection-over-union scores. When one target contains a horizontal row absent from the other, the app marks the missing pixels and explains why the pair cannot work. An explicit repair adds support pixels to the missing target rows and tells you exactly how the specification changed.

Reduced-material mode preserves both endpoint projections while retaining fewer cells. The interface reports disconnected components so a visually attractive result is not mistaken for a physically ready object. Export the actual STL geometry, an editable JSON project, a stage image, or an SVG grid proof. Drawings and imports remain local to the browser.

## How it was built
JavaScript ES modules separate the pure geometry engine, canvas mask tools, Three.js rendering and editor state. The core is a deterministic orthogonal visual hull: a cell exists only when both target projections permit it. Forward projection verifies each target independently. Material reduction covers all occupied samples within each row; component analysis uses face adjacency. Boundary meshing omits shared interior faces and writes a binary STL.

Vite bundles the app into static assets, including its dependencies. It runs without model credentials, runtime CDN imports, remote fonts, analytics or server-side image processing. The repository includes setup instructions, architecture, tests, prior-art citations and limitations.

## Challenges
The hardest product issue is distinguishing an attractive rendering from a supported claim. Some target pairs are impossible; some valid pairs produce disconnected pieces. Umbra exposes both. Its exact binary-grid proof is separate from the filtered shadow maps used for real-time presentation, and its STL export explicitly does not certify printability.

## Validation
Nine automated tests pass, covering exact recovery, incompatible-row detection, explicit repair, material-reduction projection preservation over varied inputs, component counting, mesh winding, shared-face removal, STL structure and project validation. Production builds and GitHub CI pass. Actual desktop Chrome checks cover custom text, reduced material, incompatible targets, repair and exports. The saved STL's triangle count and byte length were checked independently. A 390-pixel responsive viewport was inspected; actual iPhone hardware and physical fabrication have not been validated.

## Originality and AI disclosure
Visual hull reconstruction and computational shadow art are established techniques. In particular, Mitra and Pauly's [Shadow Art (2009)](https://graphics.stanford.edu/~niloy/research/shadowArt/shadowArt_sigA_09.html) is important prior art. Umbra does not claim a new inverse-graphics algorithm. This entry contributes its implemented editing, evidence, repair and portable-export workflow.

This is a fresh Umbra implementation started November 1, 2026. AI assistance was used extensively for project selection, implementation, tests, design, documentation and demo preparation. The application itself does not use an AI model: image thresholding and geometry are deterministic. The video is an explicitly automated walkthrough recorded from the actual running engine, with synthetic narration using an installed system voice. There are no fabricated users, outcome metrics or physical-test results.

## What is next
Improve connected geometry construction, add manufacturing-aware thickness constraints, evaluate the editor with artists and students, and validate physical output. These are future work, not current capabilities.

## Links
- [Public demo](https://shivapriyanshanmuga.github.io/umbra-shadow-studio/)
- [Public source](https://github.com/ShivaPriyanShanmuga/umbra-shadow-studio)
- [Architecture and setup](https://github.com/ShivaPriyanShanmuga/umbra-shadow-studio#readme)
- [Validation](https://github.com/ShivaPriyanShanmuga/umbra-shadow-studio/blob/main/docs/VALIDATION.md)
- [Limitations](https://github.com/ShivaPriyanShanmuga/umbra-shadow-studio/blob/main/docs/LIMITATIONS.md)
