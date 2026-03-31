# TESTING.md — Guide de test et lancement local

## Prérequis

- **Node.js** >= 18.0.0 (recommandé : 20 LTS ou supérieur)
- **npm** >= 9.0.0

```bash
# Vérifier les versions
node --version
npm --version

# Installer les dépendances
npm install
```

## Configuration des clés API

Copier le fichier d'exemple et remplir les clés :

```bash
cp .env.example .env
```

Contenu du `.env` :

```env
# Claude API — enrichissement IA (optionnel, le mode statique fonctionne sans)
# Obtenir sur : https://console.anthropic.com/settings/keys
VITE_CLAUDE_API_KEY=sk-ant-api03-...

# Replicate — génération d'images Flux Pro (optionnel)
# Obtenir sur : https://replicate.com/account/api-tokens
VITE_REPLICATE_API_KEY=r8_...

# OpenAI — génération d'images DALL-E 3 (optionnel)
# Obtenir sur : https://platform.openai.com/api-keys
VITE_OPENAI_API_KEY=sk-proj-...
```

> **Note** : L'application fonctionne en mode dégradé sans clés API.
> L'enrichissement utilise le dictionnaire statique (INTENTION_MAP) et les rendus d'images ne seront pas générés.

## Lancement en local

```bash
npm run dev
```

L'application est accessible sur : **http://localhost:5173/**

Commandes utiles :

```bash
npm run build    # Build production
npm run preview  # Preview du build
npm run test     # Lancer les 173 tests
```

## Scénarios de test

### Scénario A — Femme / Escarpin soirée vernis

1. Ouvrir http://localhost:5173/
2. Cliquer sur le segment **Femme** dans la barre latérale
3. Sélectionner **Type de chaussure** : Escarpin
4. Sélectionner **Matériau tige** : chevreau
5. Sélectionner **Couleur** : Noir
6. Sélectionner **Montage** : cousu blake
7. Dans le champ **Inspiration**, taper : `escarpin soirée vernis talon aiguille`
8. Cliquer sur **Générer la fiche**

**Vérifications attendues :**

- [ ] Badge source affiche **Statique** (confiance >= 90%)
- [ ] **TechnicalCard** affiche la BOM complète : matériau, semelle, montage, finition, doublure
- [ ] Référence **ATL-YYYYMMDD-XXXX** visible en haut à droite de la fiche
- [ ] **PromptCard** affiche le prompt positif en zone monospace avec score prompt >= 80/100
- [ ] **SourcingModule** affiche les fournisseurs en mode "Maroc Local"
- [ ] **RenderGallery** affiche 5 vues (Vue principale, Profil, Détail macro, Semelle, Portée)
- [ ] Chaque vue a un toggle **Flux Pro** / **DALL-E 3**
- [ ] Le coût total s'affiche en USD avec 3 décimales

### Scénario B — Bébé / Chausson doux premiers pas

1. Cliquer sur le segment **Bébé**
2. Sélectionner **Type** : Chausson
3. Dans **Inspiration** : `chausson doux premiers pas coton`
4. Cliquer sur **Générer la fiche**

**Vérifications attendues :**

- [ ] Aucune mention de **chrome** dans la BOM
- [ ] Montage affiché : **Strobel** ou **Collé** (jamais Blake ou Goodyear)
- [ ] Semelle : **EVA** uniquement
- [ ] Normes affichées : EN 71-3, REACH Annexe XVII, OEKO-TEX
- [ ] Poids max affiché : 80g
- [ ] Hauteur talon : 0mm

### Scénario C — Homme / Richelieu patiné

1. Cliquer sur le segment **Homme**
2. Sélectionner **Type** : Richelieu
3. Sélectionner **Matériau** : box_calf
4. Dans **Inspiration** : `richelieu patiné classique bureau`
5. Cliquer sur **Générer la fiche**

**Vérifications attendues :**

- [ ] Badge source : **Statique** (richelieu a confidence 0.95 dans INTENTION_MAP)
- [ ] Montage recommandé : **Cousu Goodyear**
- [ ] Matériau : **Box-calf** ou cuir premium
- [ ] Finition : patine / cire
- [ ] Doublure : **Veau velours** (premium)
- [ ] Le prompt image mentionne "goodyear welted construction"

### Scénario D — Export PDF

1. Après avoir généré une fiche (scénario A, B ou C)
2. Repérer le bouton **Exporter PDF** dans la TechnicalCard
3. Le bouton est actuellement désactivé avec le label "Bientôt" (V1)

**Vérifications attendues :**

- [ ] Le bouton est présent et clairement marqué comme désactivé
- [ ] La référence **ATL-YYYYMMDD-XXXX** est visible et unique à chaque génération
- [ ] Le bouton **Sauvegarder** fonctionne et l'entrée apparaît dans la barre latérale
- [ ] Cliquer sur une entrée historique recharge les specs complètes

## Résolution des problèmes courants

### Clé API manquante

**Symptôme** : Message d'erreur "VITE_CLAUDE_API_KEY non configurée" ou "VITE_REPLICATE_API_KEY non configurée"

**Solution** :
1. Vérifier que le fichier `.env` existe à la racine du projet
2. Vérifier que les clés sont correctement renseignées (pas d'espaces, pas de guillemets)
3. Redémarrer le serveur de dev après modification du `.env` (`Ctrl+C` puis `npm run dev`)

> Sans clé Claude, l'enrichissement fonctionne en mode statique (dictionnaire INTENTION_MAP).
> Sans clés Replicate/OpenAI, les images ne seront pas générées mais le reste de l'app fonctionne.

### Image qui ne génère pas

**Symptôme** : Les cellules de la RenderGallery restent en état "Génération..." indéfiniment

**Solutions** :
1. Vérifier la clé API Replicate (`VITE_REPLICATE_API_KEY`) et/ou OpenAI (`VITE_OPENAI_API_KEY`)
2. Vérifier la connexion réseau
3. Ouvrir la console navigateur (F12) pour voir les erreurs détaillées
4. Le timeout est de 120 secondes par image — patienter si le service est lent
5. Vérifier les quotas/crédits sur les plateformes Replicate et OpenAI

### PDF vide ou non généré

**Symptôme** : Le bouton Exporter ne produit rien

**Solution** : L'export PDF complet est prévu pour la V2. En V1, le bouton est désactivé. L'export JSON est disponible via la page Historique (bouton "Exporter JSON").

### Erreurs de build

```bash
# Nettoyer et réinstaller
rm -rf node_modules dist
npm install
npm run build
```

### Tests qui échouent

```bash
# Lancer les tests avec plus de détails
npx vitest run --reporter=verbose
```
