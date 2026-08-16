---
title: "aigis-detect"
summary: "SOC homelab with a real SIEM/SOAR/DFIR stack (Elastic, Wazuh, TheHive, Velociraptor) and a local AI triage agent, validated against Atomic Red Team with an honest, measured evaluation harness — not a demo against synthetic logs."
stack: ["Elastic Stack", "Wazuh", "TheHive", "Velociraptor", "Ollama", "Terraform"]
role: "Detection Engineer / AI Security"
repo: "https://github.com/cd-aguilar/aigis-detect"
featured: true
order: 4
---

**Problem.** Most "AI SOC agent" portfolio pieces run against synthetic or pre-labeled alerts. This project answers a harsher question: does the agent hold up against a real SIEM ingesting real attack telemetry, and can the result be verified independently of the agent's own claim?

**Architecture decisions.**

- **Real stack, not a mock.** Elasticsearch + Kibana for search, Wazuh Manager (via Filebeat) as the log/EDR source, TheHive for case management, Velociraptor for DFIR — nine services in Docker Compose, not a single all-in-one container standing in for a SIEM.
- **8 MITRE ATT&CK techniques mapped end to end** (T1059.001, T1136.001, T1110.001, T1562.001, T1046, T1021.002, T1041, T1070.001), each with a documented detection rule, not just a citation.
- **Evaluation harness independent of the agent.** `run_evaluation.py` fires Atomic Red Team techniques via WinRM, queries Elastic Security by rule UUID and time window, and checks TheHive for the agent's verdict via custom fields — three separate systems have to agree before a test case counts as a pass. Dataset: 50 validated cases (true positives, legitimate false positives, borderline).
- **Honest result, not a curated one.** `qwen3:1.7b` reached 50% on the eval suite; `qwen3:4b` wasn't viable due to inference timeout on the homelab hardware. Both numbers are published as-is — the point of the harness is to measure this, not to hide it.
- **Fase 3: AWS honeypot (Cowrie via Terraform)** feeds real attacker telemetry back into the same pipeline, plus a Redis lock so overlapping n8n triage runs don't race each other, and a weekly GitHub Actions job that re-runs the eval harness so results don't silently rot.

**Result.** A working detection pipeline — Wazuh alert → n8n → TheHive case, with an AI triage layer measured against a real evaluation harness instead of asserted. The current ceiling (50% on small local models) is reported as a limitation, not smoothed over: it's evidence the harness actually discriminates between "works" and "doesn't," which is the more useful signal for a Detection/AI Security role than a clean-looking demo would be.
