# Copilot instructions

## Repository purpose and architecture

This repository is a GitHub Skills exercise, not a conventional application. It teaches multi-agent orchestration in a Codespace through four sequenced GitHub Actions workflows:

1. The learner documents the prebuilt agent team in `docs/agent-team.md`.
2. The Orchestrator asks the Planner for a file-owned implementation plan in `docs/project-pulse-plan.md`.
3. The Orchestrator delegates a static Project Pulse dashboard to Designer and Coder: `app/index.html`, `app/styles.css`, `app/project-data.json`, and `.vscode/launch.json`.
4. The Orchestrator validates the result and records `docs/final-handoff.md`.

Each `N-step.yml` workflow watches only its corresponding learner output on `main`, validates required files and phrases, posts the next exercise step to the exercise issue, then disables itself and enables the following step. `0-start-exercise.yml` creates the exercise issue and activates Step 1.

The Codespace configuration is part of the lesson: `.devcontainer/postCreate.sh` installs or verifies Copilot CLI, creates only the Step 1 starter document, and ensures `app/` and `docs/` exist. `.devcontainer/postStart.sh`, launched by the folder-open VS Code task, starts:

```bash
copilot --allow-all --enable-all-github-mcp-tools
```

## Agent orchestration conventions

- Keep the four prebuilt agents in `.github/agents/` and preserve their distinct responsibilities and model assignments: Orchestrator and Planner use Claude Opus 5.5, Coder uses GPT-5.5, and Designer uses Gemini 3.7 Flash.
- The Orchestrator coordinates but does not implement: it obtains the Planner's plan first, converts it into dependency-aware phases and explicit file scopes, and runs only non-overlapping, independent scopes in parallel.
- Planner is plan-only. Designer and Coder modify only files assigned by the Orchestrator. No custom agent stages, commits, or pushes; learner-facing step prompts ask Copilot CLI to perform Git operations.
- The Project Pulse data contract is a top-level `projects` array. Each project has `name`, `owner`, `status`, `recentActivity`, and `priority`. The page must load that data, render `project-card` elements, and expose a polished responsive UI through `.dashboard` and `.project-card` styling.
- The generated preview configuration is strict JSON with no comments. It must be named `Run Project Pulse Dashboard`, serve with its working directory set to `app/`, and open `index.html` rather than a directory listing.

## Exercise authoring conventions

- This template must not track learner output files. The validation script explicitly rejects tracked `docs/agent-team.md`, `docs/project-pulse-plan.md`, `docs/final-handoff.md`, `app/index.html`, `app/styles.css`, `app/project-data.json`, and `.vscode/launch.json`.
- For workflow file/content checks, use `skills/exercise-toolkit/actions/file-exists@v0.9.3` and `skills/action-keyphrase-checker@v2`, with `case-sensitive: false`; do not replace them with inline shell checks.
- Learner step documents use a left-aligned `> [!NOTE]` before the Copilot launch command, a quoted `prompt` fence with the Copilot prompt badge, wrapped prompt lines, and no raw `git add`, `git commit`, or `git push` commands.
- Keep step workflow guards that ignore branch-creation pushes and the template's `Initial commit`, so the exercise advances only from learner progress.

## Validation

There is no build system, linter, or unit-test runner. Run the full template validation suite with:

```bash
bash scripts/validate-exercise.sh
```

The suite has no single-check selector. For focused validation of a changed file, use the same underlying checks:

```bash
# One workflow's YAML syntax
ruby -e "require 'yaml'; YAML.load_file(ARGV.fetch(0))" .github/workflows/3-step.yml

# One JSON artifact, after the learner creates it
python3 -m json.tool app/project-data.json >/dev/null
python3 -m json.tool .vscode/launch.json >/dev/null

# One shell script's syntax
bash -n .devcontainer/postCreate.sh
```
