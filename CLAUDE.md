# CLAUDE.md — L'Atelier IA
> Point d'entrée unique. Lis UNIQUEMENT ce fichier + le fichier MD du module que tu touches.
> Ne scanne jamais tout le projet. Chaque module a son propre contexte dans `docs/`.

## 🧠 Routing Modèle (OBLIGATOIRE)

| Tâche | Modèle |
|-------|--------|
| CSS, Tailwind, layout, stubs | claude-haiku-4-5-20251001 |
| Composants UI, hooks, store | claude-sonnet-4-6 |
| Services, enrichmentService | claude-sonnet-4-6 |
| Architecture, review finale | claude-opus-4-6 |
| Fichiers de données statiques | claude-haiku-4-5-20251001 |

## 🏗️ Architecture
src/data/ → dictionnaire métier JS pur, jamais d'import React
src/services/ → logique métier isolée, jamais de JSX
src/components/ → UI pure, jamais de logique métier directe
src/hooks/ → bridges entre store et composants
src/store/ → Zustand uniquement
src/pages/ → assemblage final

Règle absolue : zéro logique métier dans les composants. Tout passe par services/.

## 🤖 Agents parallèles
Agent 1 — DATA      : src/data/          → Haiku
Agent 2 — SERVICES  : src/services/      → Sonnet
Agent 3 — UI-BASE   : composants layout  → Haiku
Agent 4 — UI-LOGIC  : composants métier  → Sonnet
Agent 5 — STORE     : Zustand + hooks    → Haiku
Agent 6 — PAGES     : Dashboard          → Sonnet
Agent 7 — TESTS     : tests unitaires    → Haiku
Agent 8 — REVIEW    : validation finale  → Opus

Règles de parallélisme :
- Agents DATA et SERVICES : simultanés (pas de dépendance)
- Agents UI-BASE et STORE : simultanés
- Agent UI-LOGIC : attend fin DATA + SERVICES
- Agent PAGES : lance en dernier
- Agent REVIEW : uniquement après checkpoint humain validé

## ✅ Checkpoints humains (NE PAS SAUTER)
CHECKPOINT 1 : Après Data + Services → valider specs_engine et sourcing
CHECKPOINT 2 : Après UI-BASE → valider look & feel avant logique
CHECKPOINT 3 : Après UI-LOGIC → valider workflow complet
CHECKPOINT 4 : Review finale Opus → go/no-go production

## 🧪 Tests
Framework : Vitest
src/services/__tests__/enrichmentService.test.js
src/services/__tests__/promptBuilder.test.js
src/data/__tests__/specs_engine.test.js

## 📦 Stack
Vite + React 18 | Tailwind CSS | Zustand | framer-motion | lucide-react
Claude API enrichissement : claude-sonnet-4-6
Palette : #FFFFFF / #1A1A1A / #D4AF37

## 📚 Contextes modules
Données métier    → docs/DATA_CONTEXT.md
Composants UI     → docs/UI_CONTEXT.md
Services et API   → docs/SERVICES_CONTEXT.md

## ⚠️ Dette technique V2 (traiter avant mise en production partagée)
- Clés API (VITE_REPLICATE_API_KEY, VITE_OPENAI_API_KEY) exposées côté client
  → Solution : Vercel Edge Functions proxy avant tout partage utilisateur
- getRelevantCategories : helper d'affichage encore dans SourcingModule
  → Solution : migrer vers sourcingService.js
- TYPES_CHAUSSURES : constante encore dans Generator
  → Solution : migrer vers src/data/segments.js
