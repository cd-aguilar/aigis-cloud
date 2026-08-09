---
title: "agent-orchestrator-soc"
summary: "Multi-agent SOC triage system (LangGraph supervisor-worker) that turns a raw alert into a severity-scored triage report — real threat-intel enrichment (VirusTotal/AbuseIPDB/OTX), a human-approval gate before any High/Critical report closes, and a regression eval (5/5) to catch prompt/model regressions. Deployed live and triggered via n8n, validated end-to-end against real Wazuh/Elasticsearch alerts."
stack: ["LangGraph", "FastAPI", "Ollama", "ChromaDB", "n8n", "MITRE ATT&CK"]
role: "AI Engineer / Detection Engineer"
repo: "https://github.com/cd-aguilar/agent-orchestrator-soc"
demo: "https://soc-api.aigis-cloud.com/docs"
featured: true
order: 1
---

**Problem.** A SOC analyst triaging a raw alert has to do three different kinds of work in sequence: enrich it with threat intel, research it against internal knowledge (MITRE techniques, runbooks, past HTB writeups), and write it up with a severity and recommended action. Doing all of that with a single prompt-plus-RAG call produces shallow, unreliable output. The goal was to demonstrate actual multi-agent orchestration — the pattern production AI Engineering teams use — not "a prompt with retrieval bolted on."

**Architecture decisions.**

- **Supervisor-worker pattern over a manual loop.** A supervisor node does no work itself — it only decides which specialized agent acts next based on accumulated state. Three workers each do exactly one thing: **Enrichment** (tool calling to extract IOCs and check them against a threat intel feed), **Research** (RAG over the local knowledge base for relevant MITRE techniques and playbooks), and **Report** (writes the final triage with severity and action).
- **LangGraph instead of a hand-rolled state machine.** Explicit typed state and conditional branching make the graph debuggable and, critically, *extensible* — adding a fourth agent (DFIR, Elastic query generation) means wiring one new node, not touching the three that already work.
- **Native tool calling instead of manual prompt parsing.** More reliable than regex-ing structured data out of free text, and it's the same pattern needed for any production agent stack or MCP integration — reused directly from the `local-rag-second-brain` retrieval layer.
- **Ollama (local model) over a hosted API.** Zero marginal cost, and — the part that actually matters for a security tool — sensitive alert data never leaves the machine. Same reasoning as `local-rag-second-brain`, applied to a use case where data sensitivity isn't optional.
- **Secrets handling built in from the start, not bolted on.** `.env` is gitignored, `.env.example` documents required variables with no real values, and the README specifies running a secrets scanner (`gitleaks`/`trufflehog`) before the first push — the habit that matters once real API keys (VirusTotal, AbuseIPDB) get wired in.
- **Human-approval gate via LangGraph's `interrupt()` + `MemorySaver`, not a bolted-on confirmation step.** Any High/Critical report pauses the graph mid-run instead of auto-closing; state is checkpointed so the run resumes exactly where it left off once `POST /triage/{thread_id}/approve` resolves it — the standard safety pattern for production security agents, not a manual "are you sure?" prompt.

**Result.** An end-to-end pipeline that takes a raw alert and produces a structured triage report — severity plus recommended action — without manual intervention, runnable locally (`python orchestrator.py`), via Docker Compose, or triggered over HTTP (`POST /triage`, live at [soc-api.aigis-cloud.com/docs](https://soc-api.aigis-cloud.com/docs) via a Cloudflare Tunnel). A High/Critical report doesn't auto-close: the graph pauses on a `human-approval` interrupt until `POST /triage/{thread_id}/approve` resolves it — the standard safety pattern for production security agents, already wired rather than left as a roadmap item. An n8n workflow triggers the pipeline from a webhook and publishes each report (plus a Slack notification); this was validated against two real alerts pulled live from a Wazuh/Elasticsearch stack, not just the synthetic sample. A regression eval (`eval/run_regression.py`, 5 fixed cases against the real graph — real Ollama, real ChromaDB) catches quality regressions from prompt or model changes; current baseline is **5/5**. Switching the local model to a GPU-sized `llama3.2:3b` cut a triage run from 6m17s to **39.7s**. Because it still runs 100% local, it stays 100% reproducible at zero cost — any recruiter can clone it and run it themselves.
