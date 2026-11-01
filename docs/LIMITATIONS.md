# Interpretation and fabrication limits

Umbra's verification is exact only for the selected binary grid and the two orthogonal endpoint projections. Light sweep is an exploratory rendering, not a third verified silhouette. A live shadow map is filtered raster graphics, so edge pixels can look softer than the binary proof. A 100% score is not a photometric, physical or semantic accuracy claim.

If target A has a nonempty row while B has an empty row at the same height, no voxel can satisfy that row of A without adding a pixel to B. The UI reports these rows. Explicit repair adds a central pixel in each missing row; it changes the design specification rather than secretly claiming the original pair worked.

Grid components use face adjacency. Edge- or corner-touching cells remain separate under that definition. A face-connected result is not necessarily mechanically strong. Local boundary face emission does not guarantee manifoldness at degenerate contacts. Reduced mode may be unsuitable for fabrication without supports, connecting structures, thickening or redesign.

STL is unitless. Umbra's outer grid spans four arbitrary units and has no inferred material properties or structural analysis. Physical assembly, lighting alignment, printer resolution and fabrication have not been validated. Rendering a plausible-looking object is not a manufacturing certificate.

Input is ordinary binary drawing, text rasterization and intensity-thresholded local image import. No neural model, natural-language understanding, gesture recognition, automatic object identification, or general image-to-3D capability is present. The bundled examples are labeled input presets. The guided walkthrough is scripted but invokes the same live engine as the editor; it is not recorded user research.

The project has no measured user benefit or user study. Hardware/browser support is limited to the checks recorded in VALIDATION.md. A responsive screenshot alone does not establish actual iPhone performance.
