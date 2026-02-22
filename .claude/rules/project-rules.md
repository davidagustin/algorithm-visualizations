---
description: Project rules for Algomations – algorithm visualization website
alwaysApply: true
---

# Project Rules

## Ralph Loop – Tasks Until Done

When working on a task:

1. **Loop until done** – Keep iterating on the task until it is fully complete. Do not stop with partial implementations or "good enough" states.
2. **Verify before claiming completion** – Before saying the task is done:
   - Run the relevant verification (tests, build, lint).
   - Read the output and confirm it actually passed.
   - Only then treat the task as complete.
3. **No partial completion** – Deliver the full scope. If verification fails or something is missing, fix it and re-verify; do not leave failing tests or broken builds.
4. **Use a todo list** – For multi-step work, track items and ensure every item is completed before finishing.

Do not claim completion without fresh verification evidence (e.g. test/build output showing success).

---

## Push When Done

When you finish a task that changes files:

1. **Stage** the relevant files (`git add`).
2. **Commit** with a clear conventional commit message.
3. **Push** to the remote (`git push`).

Do this as the final step before telling the user the task is complete. If the user says "don't push" or the repo has no remote, skip the push step.

---

## No Extra Markdown Files – Consolidate to README

- **Do not** create additional `.md` files unless they have functional value for the app.
- **Consolidate** all informational documentation into **README.md**.
- **Exception:** `.claude/rules/*.md` are allowed.

---

## Multi-Agent Unique Tasks

When spawning multiple agents:

1. **Assign distinct work** – Each agent must have a clearly different responsibility.
2. **Partition by scope** – Split work by file, feature, or layer so there is no overlap.
3. **Avoid duplicate effort** – No two agents should write the same file.
4. **Name or tag tasks** – Label them so it's obvious which agent does what.
