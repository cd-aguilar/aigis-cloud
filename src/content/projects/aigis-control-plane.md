---
title: "aigis-control-plane"
summary: "Evidence-driven control plane for AI coding agents — deterministic policy engine, Docker-isolated execution, quality gates the agent can't write to, and 8 scripted security evals. Found and closed its own P0 scope bypass; post-fix benchmark 24/24 PASS against Claude in Docker, $0.040 cost-to-pass."
stack: ["Python", "Pydantic", "Docker", "Policy Engine", "Claude API"]
role: "AI Engineer / Security"
repo: "https://github.com/cd-aguilar/aigis-control-plane"
featured: true
order: 2
---

**Problem.** Most coding-agent harnesses let the LLM grade its own work: its final "I'm done" message is the verdict. This project separates three questions that usually collapse into one untrusted answer — what the agent *can* do, what it is *authorized* to do right now, and whether the task *verifiably* passed. The thesis: *the agent can claim it is done; the system decides whether it is true.*

**Architecture decisions.**

- **Authority outside the LLM.** Every tool call is a structured `ToolRequest` (never a shell string) evaluated by a deterministic, deny-by-default Policy Engine (ALLOW / DENY / REQUIRE_HUMAN) before it reaches the sandbox.
- **Fixed-profile tools, no arbitrary commands.** The agent gets `read_file`, `patch_file`, `run_tests` and `run_lint` — no generic `run_command`, no free executable or arguments.
- **Docker sandbox by default.** `--network none`, non-root, read-only filesystem + tmpfs, image pinned by digest; local mode only behind an explicit `--unsafe-local` flag that is recorded in the evidence.
- **Decisions from data the agent can't write.** Scope is computed from observed filesystem changes, not the agent's own log; tests and gate config are protected paths; the evaluation workspace is rebuilt from the base repo; reports are written outside the workspace.
- **Evidence Bundle + Decision Engine.** Diffs, structured pytest/ruff reports, policy decisions and environment metadata, hashed with SHA-256. PASS / FAIL / NEEDS_HUMAN is computed from that evidence, fail-closed.
- **Security Evaluation Suite (S01–S08)** — prompt injection, secret access, path traversal, command injection, resource exhaustion and three P0 regressions — run against the real Policy Engine and sandbox with negative controls, mapped to the OWASP Top 10 for Agentic Applications (2026).

**The P0.** A review found that `run_command` bypassed path scope: an agent could read a forbidden secret, rewrite the failing test, and still get PASS. The fix principle — *the decision may only depend on data the agent cannot write* — was implemented in six steps (D1–D6) and closed against nine written criteria, each with committed evidence. The post-fix benchmark also caught a bug in the harness itself (missing dependency in the sandbox image blamed on the agent); those failures are published, not hidden.

**Result.** 8 benchmark tasks × 3 runs against `claude-sonnet-5` in Docker: **24/24 PASS**, 4.9 tool calls on average, **$0.040 cost-to-pass**. 441 tests passing, CI green. Residual limits are documented rather than smoothed over: agent-written code still runs inside pytest and could tamper with its own evaluation, and evidence checksums are not yet signed. N=3 per task shows stability, not statistical significance — and 24/24 with zero DENYs says the agent behaved, not that the benchmark exercised the controls; that's what the scripted security suite is for.
