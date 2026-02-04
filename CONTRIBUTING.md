# Contributing Guidelines / Team Rules

Welcome! This document defines how our team collaborates on this repository.  
Please read and follow these rules to ensure smooth development.

---

## Branching Rules

> [!IMPORTANT]  
> **Do NOT work on the `main` branch.**

- Every contributor **must work on their own branch**
- All changes must be merged into `main` via a Pull Request (PR)

### Branch Naming Convention (Required)

```text
feat/{task-name}
fix/{task-name}
chore/{task-name}
docs/{task-name}
```

**Examples:**
- `feat/payroll-run-endpoint`
- `fix/time-entry-validation`
- `docs/contributing-guide`

---

## Standard Workflow

### 1️⃣ Create a Branch

```bash
git checkout -b feat/your-task-name
```

### 2️⃣ Make Changes Locally

- Implement your assigned task
- Run the application locally if applicable

### 3️⃣ Commit Changes

```bash
git add .
git commit -m "feat: add payroll run endpoint"
```

> [!NOTE]  
> Use clear, descriptive commit messages. Avoid vague messages like "update" or "fix stuff".

### 4️⃣ Push Your Branch

```bash
git push -u origin feat/your-task-name
```

---

## Pull Request (PR) Rules

> [!IMPORTANT]  
> All PRs must target the `main` branch.
> [!NOTE]
> Please refer to this section on [How To Create a PR](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request#creating-the-pull-request)

### PR Title Format (Required)

Use a conventional prefix:

```text
feat: add payroll run calculation
fix: resolve negative hours bug
docs: update README setup steps
chore: update dependencies
```

### PR Description (Required)

Your PR body must include:

- **What** was implemented or changed
- Any assumptions or limitations

**Example:**

```markdown
## Summary
Implements the payroll run endpoint for hourly employees.

## Notes
Taxes are currently calculated at a flat rate.
```

> [!NOTE]  
> Clear PR descriptions help reviewers understand your intent and speed up approvals.

---

## Automated Workflows (CodeQL & Linter)

> [!IMPORTANT]  
> Every PR triggers CodeQL and Linter workflows automatically.

- These checks **must pass** before merging
- If a workflow fails:
  1. Fix the issue locally
  2. Commit the fix
  3. Push to the same branch
  4. The PR will update automatically

> [!CAUTION]  
> Do not ignore failing checks. PRs with failing workflows should not be merged.

---

## Code Review Expectations

> [!IMPORTANT]  
> Address all review comments before merging (unless explicitly told otherwise).

- Reviewers may request changes or suggest improvements
- Push fixes to the same PR
- Reply to comments once addressed (e.g., "Fixed validation issue as suggested")

> [!NOTE]  
> PRs should not be merged without at least one approval.

---

## Merging Rules

> [!IMPORTANT]  
> Always use **"Squash and Merge"**.

**Why?**
- Maintains a clean, linear commit history
- One PR = one commit on `main`

> [!CAUTION]  
> Do not use:
> - "Merge commit"
> - "Rebase and merge"

**After merging:**
- Delete the feature branch

---

## Commit Message Guidelines

Use conventional commit prefixes:

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation only
- `chore:` maintenance/config
- `refactor:` internal code changes
- `style:` formatting only

**Examples:**

```text
feat: add payroll calculation service
fix: prevent submitting negative hours
docs: add API usage section
```

---

## Keeping Your Branch Up to Date

Before opening or updating a PR, sync with `main`.

### Merge `main` into your branch

```bash
git checkout main
git pull origin main
git checkout feat/your-branch
git merge main
git push
```

---

## Local Pre-Checks (Recommended)

Before opening a PR:

```bash
npm install
npm run lint
npm run dev
```

> [!NOTE]  
> Catching issues locally saves time and avoids failed PR checks.

---

## PR Checklist (Before Requesting Merge)

- [ ] Branch name follows convention
- [ ] No commits directly to `main`
- [ ] PR targets `main`
- [ ] PR title uses correct prefix
- [ ] PR body clearly explains changes
- [ ] CodeQL & Linter checks are passing
- [ ] All review comments addressed
- [ ] Squash and merge selected

---

## General Notes & Best Practices

> [!NOTE]  
> - Keep PRs small and focused
> - Avoid unrelated changes in the same PR
> - Coordinate DB schema changes with the database owner
> - Ask questions early if blocked

---

## Need Help?

If you're unsure about anything:

- Comment on the PR and tag the person who gave suggestions/fixes
- Or create an issue describing the problem
- Message on our discord server

---