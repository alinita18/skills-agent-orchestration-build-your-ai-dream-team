# Project Pulse implementation plan

## Goal

Create a polished, accessible static Project Pulse dashboard that helps contributors scan project ownership, status, recent activity, priority, and a short summary. The page must load its data from `app/project-data.json` and be launchable through VS Code.

## Roles and file assignments

| Agent | Responsibilities | Assigned files |
| --- | --- | --- |
| Planner | Define the data contract, file ownership, dependencies, risks, and validation before implementation. | `docs/project-pulse-plan.md` |
| Designer | Establish the page's information hierarchy, responsive behavior, accessible colors and focus states, and polished card-based visual treatment. | `app/styles.css` |
| Coder | Implement the semantic page, load and render project data safely, provide loading/error states, and configure the local preview. | `app/index.html`, `app/project-data.json`, `.vscode/launch.json` |
| Orchestrator | Coordinate the phases, keep file ownership explicit, validate the integrated result, and prepare the handoff. | Integration and validation; no implementation-file ownership |

## Data contract

`app/project-data.json` contains a top-level `projects` array. Every project has `name`, `owner`, `status`, `recentActivity`, and `priority`. A concise `summary` may be included to make the cards more useful to contributors. Status and priority values are rendered as text as well as visual badges so meaning does not depend on color.

## Implementation phases

1. **Plan and agree on the contract.** Planner records the goal, ownership, dependencies, parallel work decisions, and validation expectations in this document. The Orchestrator confirms the five required project fields and the optional summary.
2. **Build in parallel after the contract is fixed.**
   - Designer creates the responsive visual system and card styling in `app/styles.css`.
   - Coder creates `app/project-data.json`, the accessible page and data rendering in `app/index.html`, and `.vscode/launch.json`.
   - These scopes do not overlap. The agreed data contract is the dependency that lets the page and data work proceed without file conflicts.
3. **Integrate and verify.** The Orchestrator checks that the page links to the stylesheet, fetches the JSON data, renders one `.project-card` per project, and displays status, recent activity, priority, and summary. It also checks the launch configuration and runs the available validation.
4. **Hand off.** Record the delivered files, validation results, and any remaining environment limitation in `docs/final-handoff.md`.

## Dependencies and parallel work

- The HTML renderer depends on the JSON contract established in Phase 1.
- The styles depend on stable semantic hooks such as `.dashboard` and `.project-card`; the Designer can work independently once those hooks and the visual requirements are agreed.
- Data, CSS, page markup, and launch configuration have separate file ownership and can be implemented in parallel after the contract is fixed.
- Integration and final handoff depend on all implementation files being present.

## Risks and edge cases

- Fetching JSON requires an HTTP server; opening `index.html` directly with a `file://` URL is not the supported preview path.
- An unavailable, malformed, or incomplete data file must produce a visible, understandable error instead of an empty dashboard that looks successful.
- Project values are treated as untrusted text and inserted with DOM text APIs rather than interpreted as HTML.
- Layout must remain readable on narrow viewports and at increased text sizes.
- Status and priority must remain understandable without color, and interactive controls need visible keyboard focus.
- The preview must open `index.html`, not the server's directory listing.

## Validation expectations

- Parse `app/project-data.json` and `.vscode/launch.json` as strict JSON.
- Check that each project has `name`, `owner`, `status`, `recentActivity`, and `priority`.
- Check that `app/index.html` has the exact title `Project Pulse`, links `styles.css`, loads `project-data.json`, and renders `.project-card` elements with the required project fields.
- Check that `app/styles.css` includes `.dashboard`, `.project-card`, `border-radius`, `box-shadow`, and responsive rules.
- Check that `.vscode/launch.json` defines `Run Project Pulse Dashboard`, runs `python3 -m http.server 5500` with its working directory set to `app/`, and opens `http://localhost:%s/index.html`.
- Run the repository's `bash scripts/validate-exercise.sh` suite and verify the page is served over HTTP where the environment permits.
