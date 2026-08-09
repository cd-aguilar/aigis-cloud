---
title: "local-rag-second-brain"
summary: "100% local RAG over an Obsidian vault (markdown-aware chunking, Ollama, ChromaDB) so hundreds of technical notes and lab writeups become queryable and cited — nothing leaves the machine. The foundation project the other two reuse."
stack: ["Ollama", "ChromaDB", "LangChain", "Python"]
role: "AI Engineer"
repo: "https://github.com/cd-aguilar/local-rag-second-brain"
featured: true
order: 3
---

**Problem.** Technical notes, lab writeups, and study materials pile up in an Obsidian vault faster than they can be searched by hand. The goal was to ask questions against that knowledge base directly instead of manually digging through hundreds of markdown files — without sending any of it, including security lab notes, to a third-party API.

**Architecture decisions.**

- **Markdown-aware chunking (LangChain's `MarkdownTextSplitter`) instead of blind fixed-size splitting.** Respects heading and section structure, so a retrieved chunk stays a coherent unit of the original note instead of an arbitrary character-count slice.
- **Fully local models via Ollama** — `nomic-embed-text` for embeddings, `qwen2.5:7b` for generation. Zero API cost, and zero data leaving the machine, which is the actual requirement once the vault contains lab and writeup content that shouldn't go to a hosted model.
- **ChromaDB as the persistent vector store** — lightweight and serverless, no separate database process to run and maintain alongside the pipeline.
- **YAML frontmatter tags preserved as metadata**, enabling filtered retrieval by tag instead of a flat search over the entire vault.
- **Resilient indexing**: embedding calls run in retried batches, so one failed batch doesn't wipe out content already indexed — the difference between a script and something that survives reindexing hundreds of files.
- **Source attribution by default.** Every generated answer cites the notes it drew from, so the output is checkable against the original note rather than trusted blind.

**Result.** A three-command CLI — `index_vault.py index`, `query "prompt"` for retrieval only, `chat "prompt"` for full RAG with cited answers. This is the foundation the other two projects build on directly: `agent-orchestrator-soc`'s Research agent and the retrieval layer behind `rag-api-cloud` both reuse the pattern proven here first, rather than each reinventing chunking and retrieval. Next on the roadmap: exposing it as an MCP server so it can be queried directly from Claude Desktop or Claude Code.
