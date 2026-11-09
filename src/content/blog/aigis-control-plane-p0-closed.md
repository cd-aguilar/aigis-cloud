---
title: "I red-teamed my own AI agent control plane and found a P0"
summary: "An agent could read a forbidden secret, rewrite the failing test and still get a PASS. How aigis-control-plane v0.1.0 closed it — and what is still open."
date: 2026-11-09
tags: ["ai-security", "ai-agents", "evaluation", "aigis-control-plane"]
---

[aigis-control-plane](/portfolio/aigis-control-plane/) is built around one sentence: *the agent can claim it is done; the system decides whether it is true.* An LLM proposes and executes changes, but a deterministic Decision Engine — not the model — decides whether a task passes.

## The hole

On 2026-09-22 a review of my own MVP found a P0. The `run_command` tool let the agent run arbitrary commands inside its workspace. That was enough to:

1. read a secret outside its allowed paths,
2. rewrite the test that was failing,
3. and still end with a **PASS** decision.

The system that was supposed to verify the agent was trusting data the agent could write.

## The principle behind the fix

**The decision may only depend on data the agent cannot write.** Every change below follows from that.

- **No arbitrary commands.** `run_command` is gone. The agent gets fixed-profile `run_tests` / `run_lint` tools with structured summaries.
- **Forbidden paths are never copied** into the agent workspace — there is nothing to read.
- **Gate inputs are protected.** Tests and gate config are protected paths, the evaluation workspace is rebuilt from the base repo, reports are written outside it, and skip/xfail/`noqa` tricks no longer produce a silent PASS.
- **Scope comes from observed changes.** `scope_ok` and `max_files_changed` are computed from the filesystem, not from the agent's own log.
- **Docker by default.** `--network none`, non-root, read-only root + tmpfs, base image pinned by digest. Local mode only via an explicit `--unsafe-local` flag, which is recorded in the evidence.
- **Security DENYs escalate** to `NEEDS_HUMAN` instead of being retried silently.

The security suite grew from S01–S05 to **S01–S08**; S06–S08 are regressions for this exact P0.

## Evidence, not claims

- Nine closure criteria were written *before* the fix started; each one is backed by committed evidence (`STATUS.md`, `docs/security/P0-design.md`).
- Post-fix benchmark: 8 tasks × 3 runs against Claude in Docker — **24/24 PASS**, about **USD 0.04 per passing task**.
- The first post-fix run had 3 FAILs caused by a harness bug (a missing dependency in the sandbox image), not by the agent. It was fixed and those failures are published, not deleted.

One caveat about my own number: 24/24 with zero DENYs shows the agent behaved — it does not prove the controls work. That is what the adversarial S01–S08 scenarios are for.

## What is still open

- Agent-written code still runs inside pytest and could tamper with its own evaluation.
- Evidence Bundle checksums are not signed yet.
- `--unsafe-local` still exists (explicit and recorded, but it exists).

These are documented in the repo's `docs/SECURITY.md` rather than left out of the story.

**Release:** [v0.1.0 on GitHub](https://github.com/cd-aguilar/aigis-control-plane/releases/tag/v0.1.0) · **Repo:** [cd-aguilar/aigis-control-plane](https://github.com/cd-aguilar/aigis-control-plane)