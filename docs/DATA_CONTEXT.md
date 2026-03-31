# DATA_CONTEXT.md
> Lis ce fichier UNIQUEMENT si tu travailles sur src/data/.
> Modèle : Haiku

## Fichiers
specs_engine.js → dictionnaire matériaux, semelles, montages, mapping intentions
sourcing.js → fournisseurs enrichis prix MAD, MOQ, délais, certifications
segments.js → config 4 segments + contraintes construction

## Structure specs_engine.js
MATERIALS.cuirs[id] : { id, label, tanning, finish, thickness_mm, price_mad_m2: {local, premium}, segments, keywords, supplier_ids }
SEMELLES[id] : { id, label, rigidity, durability, price_mad_pair: {local, premium}, segments, keywords }
MONTAGES[id] : { id, label, durability, flexibility, price_mad_pair: {local, premium}, segments, keywords }
INTENTION_MAP[mot_cle] : { semelle, montage, material, finition, doublure, confidence: 0.0-1.0 }

## Structure sourcing.js
SUPPLIERS[id] : { id, name, mode: 'local'|'international', country, city, materials, price_range: {min, max, currency:'MAD', unit:'m²'}, moq: {quantity, unit}, lead_time_days: {min, max}, certifications, contact, notes, rating, since }

## Règles métier critiques
Bébé : tannage chrome INTERDIT, montage goodyear/blake INTERDIT, talon INTERDIT, semelle antidérapante obligatoire
Enfant : talon max 20mm, goodyear INTERDIT
Femme : talon max 120mm, tous montages autorisés
Homme : goodyear recommandé, modèles classiques Derby/Richelieu/Chelsea/Brogue

## Seuil confiance INTENTION_MAP
confidence >= 0.80 → sortie statique, zéro token API
confidence < 0.80 → escalade Claude API dans enrichmentService

## Tests requis
INTENTION_MAP : chaque entrée a confidence entre 0 et 1
MATERIALS : chaque matériau a price_mad_m2.local et .premium
SEGMENTS : contraintes bébé cohérentes (pas chrome, pas talon)
SUPPLIERS : chaque fournisseur a moq, lead_time_days, price_range
