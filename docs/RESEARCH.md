# Prior art and scope

Reviewed November 1, 2026, using primary sources.

## Closest research

- Niloy J. Mitra and Mark Pauly, [Shadow Art (2009)](https://graphics.stanford.edu/~niloy/research/shadowArt/shadowArt_sigA_09.html). This work already allows specifying multiple desired shadow images and optimizes geometry when those images conflict. Umbra does not claim to invent inverse shadow design or solve that general optimization problem.
- [Shadow Art Revisited: A Differentiable Rendering Based Approach (WACV 2022)](https://openaccess.thecvf.com/content/WACV2022/html/Sadekar_Shadow_Art_Revisited_A_Differentiable_Rendering_Based_Approach_WACV_2022_paper.html). Differentiable reconstruction from desired shadows is established. Umbra instead uses a deterministic orthogonal binary grid with explicit row feasibility checks.
- [MoSculp (MIT CSAIL, 2018)](https://mosculp.csail.mit.edu/) turns video motion into sculptures. This was considered as a different creative direction, not implemented here.

## What this entry contributes

The contribution is the implemented product workflow: two directly editable targets, real-time visual hull reconstruction, forward-projected evidence, explicit target-changing repairs, projection-preserving material reduction, disconnected-component reporting, and portable geometry/project/proof exports. The implementation and presentation should be judged on those working features, not on a claim of fundamental algorithmic novelty.

## Event

- [Overview and requirements](https://arbiter-hacks-v1.devpost.com/)
- [Official rules](https://arbiter-hacks-v1.devpost.com/rules)
- [Schedule](https://arbiter-hacks-v1.devpost.com/details/dates)

General Track selected in the intended submission. User confirmed eligibility. Event-specific AI-assistance and pre-existing-work policies were not stated on the reviewed rules page; this is unresolved, not an invented permission or prohibition. AI assistance and established prior art are disclosed. The deadline was listed as Dec 20, 2026 at 9 p.m. PST, equivalent to Dec 21 at 00:00 EST. Public source, written description and a 2–3 minute working video are required; missing repository or video makes the submission ineligible.
