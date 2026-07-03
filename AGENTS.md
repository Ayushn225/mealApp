# App Architecture & Agentic Protocol: MealApp (Expo SDK 54 + Convex + Clerk)

## 🚨 MANDATORY AGENT BEHAVIOR PROTOCOL

You must ALWAYS operate under a strict **Two-Phase Execution Cycle**. Do not skip phases or generate codebase-wide changes without user sign-off.

### Phase 1: The Implementation Plan (Design Stage)
Before writing, modifying, or deleting any functional app code, the agent must output a structured **Implementation Plan** containing:
1.  **Objective:** A concise summary of what feature is being introduced or fixed.
2.  **Affected Files:** A clear list of files that will be created, updated, or deleted.
3.  **Step-by-Step Breakdown:** The precise engineering roadmap detailing *how* the files will be modified.
4.  **Verification Steps:** How the user can test that the changes work.
*The agent must end Phase 1 with a strict explicit prompt waiting for user confirmation: "Please review this plan. Reply with 'Approved' or provide adjustments to begin implementation."*

### Phase 2: Execution & Changelog (Action Stage)
Only after receiving explicit user confirmation/approval may the agent begin writing the code blocks. Upon finishing the file edits, the agent **must** append a summary entry directly to a `changelog.md` file at the root of the project.

---

## 🗒️ Changelog Format Requirement (`changelog.md`)
Every execution turn must append to `changelog.md` in this exact structure:
```markdown
## [YYYY-MM-DD] - [Brief Feature Title]
- **Added:** New components/files/endpoints.
- **Changed:** Structural or logic modifications.
- **Fixed:** Bugs or compiler errors cleared.
- **Agent Assigned:** [Lead Agent Persona]