---
title: "agent-orchestrator-soc"
summary: "Multi-agent SOC triage system (LangGraph supervisor-worker + local RAG over MITRE ATT&CK notes) that turns a raw alert into a triage report with severity and recommended action — 100% local, zero marginal cost, reproducible by any recruiter with one command."
stack: ["LangGraph", "Ollama", "ChromaDB", "MITRE ATT&CK"]
role: "AI Engineer / Detection Engineer"
repo: "https://github.com/cd-aguilar/agent-orchestrator-soc"
featured: true
order: 3
---

**Problem.** A SOC analyst triaging a raw alert has to do three different kinds of work in sequence: enrich it with threat intel, research it against internal knowledge (MITRE techniques, runbooks, past HTB writeups), and write it up with a severity and recommended action. Doing all of that with a single prompt-plus-RAG call produces shallow, unreliable output. The goal was to demonstrate actual multi-agent orchestration — the pattern production AI Engineering teams use — not "a prompt with retrieval bolted on."

**Architecture decisions.**

- **Supervisor-worker pattern over a manual loop.** A supervisor node does no work itself — it only decides which specialized agent acts next based on accumulated state. Three workers each do exactly one thing: **Enrichment** (tool calling to extract IOCs and check them against a threat intel feed), **Research** (RAG over the local knowledge base for relevant MITRE techniques and playbooks), and **Report** (writes the final triage with severity and action).
- **LangGraph instead of a hand-rolled state machine.** Explicit typed state and conditional branching make the graph debuggable and, critically, *extensible* — adding a fourth agent (DFIR, Elastic query generation) means wiring one new node, not touching the three that already work.
- **Native tool calling instead of manual prompt parsing.** More reliable than regex-ing structured data out of free text, and it's the same pattern needed for any production agent stack or MCP integration — reused directly from the `local-rag-second-brain` retrieval layer.
- **Ollama (local model) over a hosted API.** Zero marginal cost, and — the part that actually matters for a security tool — sensitive alert data never leaves the machine. Same reasoning as `local-rag-second-brain`, applied to a use case where data sensitivity isn't optional.
- **Secrets handling built in from the start, not bolted on.** `.env` is gitignored, `.env.example` documents required variables with no real values, and the README specifies running a secrets scanner (`gitleaks`/`trufflehog`) before the first push — the habit that matters once real API keys (VirusTotal, AbuseIPDB) get wired in.

**Result.** An end-to-end pipeline that takes a sample alert and produces a structured triage report — severity plus recommended action — without manual intervention, runnable locally in one command (`python orchestrator.py`) or via Docker Compose, with a test suite (`pytest`) that runs without Ollama for CI. Because it's 100% local, it's 100% reproducible at zero cost: any recruiter can clone it and run it themselves, rather than take a screenshot's word for it. Formal evaluation is the next step on the roadmap — logging (alert, report) pairs into a regression set to measure whether prompt or model changes improve or degrade triage quality, plus a human-in-the-loop approval gate before any destructive action, the standard pattern for production security agents.
