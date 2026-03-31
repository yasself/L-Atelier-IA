# SERVICES_CONTEXT.md
> Lis ce fichier UNIQUEMENT si tu travailles sur src/services/.
> Modèle : Sonnet

## enrichmentService.js — Flow obligatoire
1. analyzeConfidence(input) → scan INTENTION_MAP → {match, confidence}
2. confidence >= 0.80 → staticEnrich() → retour immédiat zéro token
3. confidence < 0.80 → claudeEnrich() → Claude API sonnet-4-6 max_tokens 1000
4. Retour : { specs, source: 'static'|'claude_api', confidence }

## Contrat de retour specs (RESPECTER EXACTEMENT)
{ segment, inspiration, confidence, source, enrichedByAI, materials[], semelles[], montages[], finitions[], doublure, interieur, safetyNotes[], tanning, prix_estime: {min, max, currency:'MAD'} }

## Calcul prix estimé
base = (matPrice * 0.3) + solePrice + montagePrice + doublurePrice
retourner { min: Math.round(base * 0.9), max: Math.round(base * 1.3), currency: 'MAD' }

## promptBuilder.js — 5 détails macro OBLIGATOIRES
1. micro-texture of leather grain clearly visible
2. precision hand stitching (5 stitches per centimeter)
3. wax-polished leather edges (trépointe)
4. subtle leather surface reflection
5. sharp focus on material texture
Retour : { positive: String, negative: String, quality_indicators: {detail_level, lighting, angle, estimated_realism} }

## historyService.js
Interface : getAll(), save(entry), delete(id), clear(), getById(id)
HistoryEntry : { id: UUID, timestamp: ISO8601, segment, inspiration, specs, prompt, sourcingMode }
Limite : MAX 50 entrées LIFO

## Gestion erreurs obligatoire
claudeEnrich() : try/catch → fallback specs statiques + confidence 0.7 + error:true
historyService : try/catch JSON.parse → toujours retourner []

## Tests Vitest requis
enrichmentService : confidence>=0.80 retourne source=static, bébé rejette chrome, calcul prix les deux modes
promptBuilder : 5 détails macro présents, retourne positive+negative+quality_indicators
