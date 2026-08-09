---
title: "rag-api-cloud"
summary: "Production RAG deployment on AWS (ECS Fargate + Bedrock, VPC/ALB, Terraform, GitHub Actions OIDC) that answers the question a Cloud/DevOps interviewer actually asks: what does it take to run this as a real, internet-facing service, not a notebook demo."
stack: ["FastAPI", "AWS Bedrock", "Terraform", "Docker", "GitHub Actions"]
role: "AI Engineer / Cloud"
repo: "https://github.com/cd-aguilar/rag-api-cloud"
featured: true
order: 2
---

**Problem.** `local-rag-second-brain` proves the RAG pattern works. The question this project answers is what most AI/Cloud Engineer interviews actually probe for: what does it take to run that as a real, internet-facing service — with infrastructure as code, no long-lived credentials, and a repeatable deploy — instead of a notebook demo.

**Architecture decisions.**

- **ECS Fargate Spot over Lambda.** A serverless function would have been the cheaper, easier answer. Fargate was chosen specifically because it exercises VPC design, load balancing, and container orchestration more thoroughly — the parts of cloud infrastructure a Lambda deployment would let me skip.
- **Managed Bedrock (Claude Haiku 4.5 + Titan Embeddings V2) over self-hosted Ollama.** The companion project already proves self-hosted inference works end to end; this one deliberately integrates managed AI services in a cloud-native pipeline, which is what most AI/Cloud Engineer roles actually ask for in practice.
- **GitHub Actions + OIDC federation instead of stored AWS keys.** No long-lived credentials anywhere in the repo or CI config. One non-obvious wrinkle worth naming: GitHub's OIDC `sub` claim embeds org/repo IDs (`repo:org@…:repo@…:ref:refs/heads/main`), which forced wildcard patterns in the IAM trust policy that aren't obvious from AWS's own docs.
- **Three-stage CI/CD pipeline, split into separate jobs** (ECR bootstrap → image build/push → Terraform apply) — avoids a real race condition where Terraform, which owns the ECR repo, could run after a Docker push already tried to hit a repository that doesn't exist yet.
- **Least-privilege IAM split.** The ECS execution role (image pulls, logging) and the task role (Bedrock/S3 access) are kept independent, so a compromise of one doesn't hand over the other's permissions.
- **Ephemeral infrastructure by design.** Deploy and teardown are manual `workflow_dispatch` runs, not always-on: the NAT Gateway and ALB only exist during active demos, keeping cost near $0/month the rest of the time.
- **Private data stays private.** The Chroma index — built from personal notes — never touches git or the Docker image. It's synced to S3 manually and pulled by containers at runtime through IAM task-role auth, not baked into the deployed artifact.

**Result.** A FastAPI service with `/health` (ALB liveness), `/query` (answer, cited sources, retrieval score, token usage, latency), `/metrics`, and interactive `/docs`, deployable on demand and torn down after, with a matching local dev loop via `docker-compose`. Two gaps are named on the roadmap rather than hidden: retrieval quality is currently scored ad hoc and is due for RAGAS-based evaluation (faithfulness, context precision/recall), and the OIDC deploy role currently runs with `AdministratorAccess` and needs to be scoped down to least privilege — the honest state of a project built to demonstrate real infrastructure judgment, not a finished product.
