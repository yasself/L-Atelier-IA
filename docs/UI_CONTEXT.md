# UI_CONTEXT.md
> Lis ce fichier UNIQUEMENT si tu travailles sur src/components/ ou src/pages/.
> Layout/CSS → Haiku | Logique composant → Sonnet

## Design System Luxury Minimalist
Primaire : #1A1A1A | Or : #D4AF37 | Surface : #FFFFFF | Background : #F8F8F6 | Border : #E8E6DF
Titres : Playfair Display (serif) | Corps : Inter (sans) | Données : JetBrains Mono
Mobile-first. Breakpoint principal lg (1024px).

## Règles absolues composants
1. Jamais de logique métier dans un composant
2. Jamais d'import direct specs_engine.js dans un composant (sauf SEGMENT_LIST)
3. Tout appel API passe par enrichmentService.js
4. Tout état global passe par useAtelierStore
5. Tout accès historique passe par useHistory hook

## Sidebar.jsx
DOIT : afficher historique via useHistory(), miniature par entrée, bouton supprimer, bouton vider
NE DOIT PAS : appeler historyService directement

## Generator.jsx
DOIT : sélecteur 4 segments avec icônes, textarea inspiration, bouton Générer, état loading framer-motion, badge source résultat (statique vs IA)
NE DOIT PAS : importer specs_engine directement, contenir logique enrichissement

## TechnicalCard.jsx
DOIT : BOM complète (matériau, semelle, montage, finition, doublure), badge segment, badge source, checklist contraintes respectées, fourchette prix MAD, slot bouton export (V1 = désactivé)

## PromptCard.jsx
DOIT : prompt positif en zone monospace, prompt négatif dépliable, bouton Copier avec feedback check vert 2s, indicateurs qualité, label compatible Midjourney/DALL-E/Flux

## SourcingModule.jsx
DOIT : toggle pill Maroc Local / Export Premium, fournisseurs filtrés par matériaux du currentSpecs, afficher nom/ville/prix/MOQ/délai/certifications

## Layout Dashboard
Mobile : stack vertical Header → Generator → TechnicalCard → PromptCard → Sourcing → Sidebar
Desktop : Sidebar gauche fixe | colonne droite Generator + TechnicalCard/PromptCard + Sourcing

## Animations framer-motion
Apparition résultat : { initial: {opacity:0, y:16}, animate: {opacity:1, y:0}, transition: {duration:0.35} }
Loading : { animate: {opacity:[0.4,1,0.4]}, transition: {repeat:Infinity, duration:1.5} }
