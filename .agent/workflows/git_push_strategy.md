---
description: Workflow for pushing changes to Git. Defaults to Verza-v2 branch, requires confirmation for main.
---

1.  **Check Current Branch**:
    - Run `git branch` to confirm the current branch.
    - If not on `Verza-v2`, switch to it using `git checkout Verza-v2` (or create it with `git checkout -b Verza-v2` if it doesn't exist).

2.  **Verify User Intent**:
    - **Default**: Assume all changes should be pushed to `Verza-v2`.
    - **Exception**: If the user explicitly requests to push to `main`:
        - **STOP AND ASK**: "⚠️ Are you sure you want to push to `main`? This will affect the visible prototype. Please confirm."
        - Only proceed if the user explicitly confirms.

3.  **Execute Push**:
    - Stage changes: `git add .`
    - Commit changes: `git commit -m "Your commit message"`
    - Push: `git push origin Verza-v2` (or `main` if confirmed).
