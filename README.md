# AIDD Pro v3 — AI-Driven Development pour Claude Code

> Workflow complet en 7 phases : du cadrage au déploiement. TDD strict, sous-agents spécialisés, hooks d'automatisation, agent teams, sécurité OWASP, CI/CD.

---

## Ce qui a changé (v1 → v2 → v3)

| Aspect | v1 | v2 | v3 (Pro) |
|--------|----|----|----------|
| Phases | 4 | 5 | **7** (+ TDD séparé + Security Audit) |
| CLAUDE.md | ~150 lignes | ~60 lignes | ~70 lignes, équilibré |
| Agents | 3 basiques | 4 spécialisés | **7** (+tester, security-auditor, doc-writer, meta-agent) |
| Hooks | 0 | 4 | **6** (+bash guard, security check Python, session log) |
| Agent Teams | Non | Non | **Oui** (parallélisation) |
| Commandes | 6 | 7 | **9** (+/test, /security-audit, /deploy-check) |
| Security | Conseils | Hook basique | **OWASP Top 10 + ESLint security + Python scanner** |
| CI/CD | Non | Non | **GitHub Actions complet** (quality + security + build + E2E) |
| Vitest Config | Non | Non | **Oui** (seuils coverage 80%) |
| Checklist prod | Non | Non | **Oui** (/deploy-check) |

---

## Architecture

```
.claude/
├── settings.json              # Permissions + Hooks + Agent Teams
├── settings.local.json        # Overrides locaux (gitignored)
├── agents/                    # 7 sous-agents spécialisés
│   ├── architect.md           # Specs, ADR, planification
│   ├── tester.md              # TDD — écrit les tests (RED)
│   ├── implementer.md         # Code production (GREEN)
│   ├── reviewer.md            # Code review (proactif)
│   ├── security-auditor.md    # Audit OWASP (read-only)
│   ├── doc-writer.md          # Documentation
│   ├── memory-manager.md      # Mémoire projet (proactif)
│   └── meta-agent.md          # Crée de nouveaux agents
├── commands/                  # 9 slash commands
│   ├── plan.md                # /plan <feature>
│   ├── test.md                # /test <feature> (TDD RED)
│   ├── implement.md           # /implement <feature> (GREEN)
│   ├── review.md              # /review <scope>
│   ├── security-audit.md      # /security-audit <scope>
│   ├── deploy-check.md        # /deploy-check
│   ├── commit.md              # /commit [hint]
│   ├── ship.md                # /ship [base-branch]
│   └── fix.md                 # /fix <bug>
└── skills/
    └── aidd-pipeline/SKILL.md # Pipeline 7 phases

scripts/hooks/                 # Hook scripts
├── pre-bash-guard.sh          # Bloque commandes destructrices
├── pre-edit-guard.sh          # Protège fichiers sensibles
├── post-edit-format.sh        # Prettier auto après edit
├── post-edit-typecheck.sh     # ESLint feedback après edit
└── security-check.py          # Scan patterns dangereux dans le code

docs/
├── specs/                     # Spécifications fonctionnelles
├── architecture/              # ADR
├── api/                       # Documentation API
├── runbooks/                  # Guides de déploiement
└── memory-bank/               # Mémoire persistante
    ├── project-brief.md
    ├── tech-decisions.md
    ├── current-sprint.md
    ├── patterns.md
    └── errors-log.md

.github/workflows/ci.yml      # CI/CD complet
.eslintrc.security.json        # Règles ESLint sécurité
vitest.config.ts               # Config tests + coverage
```

---

## Installation

### 1. Copier les fichiers à la racine de ton projet

```bash
cp -r aidd-v3/.claude ./
cp -r aidd-v3/.vscode ./
cp -r aidd-v3/.github ./
cp -r aidd-v3/docs ./
cp -r aidd-v3/scripts ./
cp aidd-v3/CLAUDE.md ./
cp aidd-v3/.prettierrc ./
cp aidd-v3/.gitignore ./
cp aidd-v3/.eslintrc.security.json ./
cp aidd-v3/eslint.config.mjs ./
cp aidd-v3/vitest.config.ts ./
```

### 2. Rendre les hooks exécutables

```bash
chmod +x scripts/hooks/*.sh scripts/hooks/*.py
```

### 3. Installer les dépendances

```bash
# Core
pnpm add -D typescript eslint prettier vitest @vitest/coverage-v8 playwright

# ESLint plugins
pnpm add -D @eslint/eslintrc @typescript-eslint/eslint-plugin @typescript-eslint/parser \
  eslint-plugin-react-hooks eslint-plugin-import eslint-config-next \
  eslint-plugin-security eslint-plugin-no-unsanitized

# Prettier
pnpm add -D prettier-plugin-tailwindcss

# Validation
pnpm add zod

# Outils requis par les hooks
# jq : sudo apt install jq (Linux) / brew install jq (macOS)
# gh  : brew install gh (macOS) / voir https://github.com/cli/cli#installation
```

### 4. Personnaliser

1. **CLAUDE.md** — Nom du projet, stack, commandes
2. **docs/memory-bank/project-brief.md** — Description du projet
3. **docs/memory-bank/tech-decisions.md** — Tes ADR
4. **.claude/settings.json** — Ajuster les permissions si besoin

### 5. Vérifier

```bash
# Dans Claude Code :
/plan "test: vérifier que le setup AIDD Pro fonctionne"
```

---

## Workflow — Les 7 Phases

```
Phase 1          Phase 2         Phase 3        Phase 4
CONTEXT      →   SPEC/PLAN   →   TDD (RED)  →   IMPLEMENT (GREEN)
Cadrage          @architect      @tester        @implementer
CLAUDE.md        docs/specs/     Tests fail     Tests pass

    Phase 5          Phase 6            Phase 7
→   REVIEW       →   SECURITY AUDIT →   DEPLOY READY
    @reviewer        @security-auditor   /deploy-check
    Refactoring      OWASP Top 10       CI vert + PR
```

### Quality Gates (chaque phase doit passer avant la suivante)

| Phase | Gate |
|-------|------|
| 1. Context | CLAUDE.md complet, stack identifiée |
| 2. Spec | Spec validée, plan de tâches ordonné |
| 3. TDD | Tests compilent et échouent (RED) |
| 4. Implement | Tests passent, lint OK, typecheck OK, coverage ≥ 80% |
| 5. Review | 0 issue bloquante, tous tests verts |
| 6. Security | 0 vulnérabilité critique/haute |
| 7. Deploy | Build OK, docs à jour, CI vert |

---

## Commandes

| Commande | Phase | Description |
|----------|-------|-------------|
| `/plan <feature>` | 2 | Créer spec + plan technique |
| `/test <feature>` | 3 | Écrire les tests TDD (RED) |
| `/implement <feature>` | 4 | Implémenter (GREEN) |
| `/review <scope>` | 5 | Code review complète |
| `/security-audit <scope>` | 6 | Audit sécurité OWASP |
| `/deploy-check` | 7 | Checklist pré-déploiement |
| `/commit [hint]` | * | Commit conventionnel |
| `/ship [branch]` | 7 | Push + PR |
| `/fix <bug>` | * | Fix autonome avec TDD |

---

## Mode Autonome

```
"Implémente le module d'authentification de manière autonome, du plan à la PR"
```

Claude va enchaîner toutes les phases. Les hooks assurent la continuité :
- **Stop hook** → vérifie si le travail est terminé, continue si non
- **SubagentStop hook** → valide chaque sous-agent
- **@reviewer** (proactif) → review auto après implémentation
- **@memory-manager** (proactif) → met à jour la mémoire

---

## Agent Teams (Parallélisation)

```
Crée un agent team pour le module d'authentification.
Spawn 3 teammates :
1. Backend : Routes API (login, register, reset) — @implementer
2. Frontend : Composants React (LoginForm, RegisterForm) — @implementer
3. Tests : Tests unit + intégration — @tester
```

Activé via `"CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"` dans settings.json.

---

## Hooks

| Événement | Matcher | Script | Rôle |
|-----------|---------|--------|------|
| PreToolUse | Bash | `pre-bash-guard.sh` | Bloque commandes destructrices |
| PreToolUse | Edit/Write | `pre-edit-guard.sh` | Protège fichiers sensibles |
| PostToolUse | Edit/Write | `post-edit-format.sh` | Prettier auto |
| PostToolUse | Edit/Write | `post-edit-typecheck.sh` | ESLint feedback |
| Stop | * | prompt | Vérifie completion → continue |
| Stop | * | command | Log de session |
| SubagentStop | * | prompt | Valide sous-agent |
| SessionStart | cli | command | Log début session |

---

## FAQ

**Les hooks ne marchent pas ?**
→ `chmod +x scripts/hooks/*` + vérifier que `jq` est installé

**Claude ignore le CLAUDE.md ?**
→ Fichier trop long ou mal placé. Garder < 80 lignes. Détails dans agents/skills.

**Comment ajouter un agent ?**
→ `/meta-agent` ou créer manuellement dans `.claude/agents/`

**Comment lancer les agent teams ?**
→ Prompt naturel : "Crée un agent team pour X. Spawn N teammates..."

---

*AIDD Pro v3 — Février 2026*
