# Agent team

I am using GitHub Copilot CLI in a Codespace to orchestrate the custom agent team for Mona's Project Pulse dashboard.

| Agent | Model | Definition | Responsibility |
| --- | --- | --- | --- |
| Orchestrator | Claude Opus 5.5 | `.github/agents/orchestrator.agent.md` | Coordinates the workflow without implementing it. The Orchestrator asks Planner for a plan, assigns explicit file scopes, sequences dependent work, verifies the integrated result, and reports the handoff. |
| Planner | Claude Opus 5.5 | `.github/agents/planner.agent.md` | Researches the repository and produces a practical plan with file assignments, dependencies, parallel and sequential work, risks, validation expectations, and open questions. Planner does not write code. |
| Designer | Gemini 3.7 Flash | `.github/agents/designer.agent.md` | Handles Project Pulse UX and visual direction within its assigned files, including accessible hierarchy, responsive layout, project cards, status badges, priority treatment, and polished styling. |
| Coder | GPT-5.5 | `.github/agents/coder.agent.md` | Implements the assigned dashboard and supporting configuration files with predictable, testable behavior. When assigned the runnable app, Coder also creates the strict JSON VS Code launch configuration. |

The Orchestrator begins by having Planner create the implementation plan. It then delegates design decisions to Designer and implementation to Coder using non-overlapping file scopes where possible. The team validates the completed Project Pulse dashboard and prepares the final handoff; I retain control of staging, committing, and pushing changes through GitHub Copilot CLI.
