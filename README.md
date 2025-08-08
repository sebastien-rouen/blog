# 🐙 Bastou Blog - Les aventures d'un coach Agile

Bienvenue sur mon blog professionnel ! Un espace de partage où je raconte mes retours d'expérience, mes réflexions sur l'Agilité, le développement et l'accompagnement d'équipes. Le tout dans un site simple, rapide et maintenable.

> _"Propulsé par du café et du code clean hébergé en local"_ ☕

---

## 🎯 Objectif

Ce blog vise à :

- **Partager du concret** : Retours d'expérience, outils pratiques, du vécu
- **Pas de blabla corporate** : Juste du contenu authentique et utile
- **Site autonome** : Pas de dépendance à des CMS lourds
- **Performance** : Chargement rapide, design responsive

---

## 🚀 Caractéristiques

- **🐙 Design unique** : Thème sombre avec logo personnalisé et couleurs tech
- **📱 Responsive** : S'adapte parfaitement à tous les écrans
- **📝 Articles Markdown** : Écriture simple avec métadonnées YAML
- **📚 Séries d'articles** : Regroupement thématique avec navigation entre articles
- **🖇️ URLs prartageable** : Système de routage pour partager facilement articles et séries
- **⏰ Publication programmée** : Articles publiés automatiquement selon la date ET l'heure
- **🚧 Mode drafts** : Différenciation environnements prod/drafts avec badges visuels
- **🔍 Filtres avancés** : Navigation par tags ET par séries
- **🎨 Intégration LinkedIn** : Liens vers profil professionnel
- **⚡ Performance** : Vanilla JS, pas de framework lourd
- **🎨 Interface moderne** : Cards avec animations, typographie soignée
- **👤 Section À propos** : Présentation avec stats et badges

### 🚧 Nouveau : Mode Drafts

Le blog dispose maintenant d'un système de différenciation entre environnements :

- **Production** (`blog.bastou.dev`) : Affiche uniquement les articles publiés
- **Drafts** (`drafts.blog.bastou.dev`) : Affiche TOUS les articles avec badges pour les brouillons

**Fonctionnalités :**
✅ Détection automatique de l'environnement  
✅ Indicateur visuel en haut de la page  
✅ Badges discrets sur les articles non publiés  
✅ Compteur d'articles (publiés vs brouillons)  
✅ Prévisualisation complète de tous les contenus  

🔒 **Sécurité :** [SECURITY.md](docs/SECURITY.md)
📙 **Guide de Tags :** [TAGS_GUIDE.md](docs/TAGS_GUIDE.md)
💹 **Google Analytics :** [Analytics](docs/ANALYTICS.md)

---

## 📁 Structure du projet

```
blog/
├── index.html              # Page principale avec logo et navigation
├── css/
│   └── style.css           # Styles responsive avec thème sombre
├── js/
│   └── main.js             # Logique du blog avec système de publication
├── articles/
│   ├── config.yaml         # Configuration des articles
│   ├── agile-jour-1.md     # Article publié
│   ├── agile-jour-2.md     # Article en brouillon
│   ├── agile-jour-3.md     # Article programmé
│   └── ...
└── README.md               # Ce fichier !
```

---

## 🔧 Installation

1. Clone le projet :

```bash
git clone https://github.com/sebastien-rouen/blog.git
cd blog
```

2. Configure Google Analytics (optionnel) :

```javascript
// Dans js/config.js, remplace 'GA_MEASUREMENT_ID' par ton ID Google Analytics
measurementId: "G-XXXXXXXXXX";
```

3. Lance un serveur local :

```bash
# Python 3.x
python -m http.server 8080

# Node.js avec http-server
npx http-server -p 8080

# Ou avec VSCode Live Server
```

4. Ouvre ton navigateur sur `http://localhost:8080`

> ⚠️ **Important** : Un serveur HTTP est nécessaire pour charger les fichiers YAML/Markdown (CORS).
> 📊 **Analytics** : Désactivé automatiquement en localhost pour éviter de polluer les stats.

---

## 📊 Configuration

### Articles (`articles/config.yaml`)

```yaml
articles:
  - file: "agile-jour-1.md"
    featured: true
    priority: 1
  - file: "agile-jour-2.md"
    featured: false
    priority: 2

blog:
  title: "Bastou - Les aventures d'un coach Agile"
  description: "Aventures d'une pieuvre multitâche dans l'univers du code"
  author: "Bastou"

display:
  articles_per_page: 6
  excerpt_length: 200
  show_reading_time: true
```

### Format des articles

Chaque article `.md` contient un front matter YAML :

```yaml
---
title: "Mon super article"
date: "2025-01-15 14:30:00" # Date ET heure de publication
author: "Bastou"
tags: ["Agile", "DevLife", "Coaching"]
series: "Carnets Agile : Du Code aux Équipes" # Optionnel - Série d'articles
excerpt: "Description courte de l'article..."
reading_time: 8
featured: true
published: true # true/false - Contrôle la publication
image_cover: "articles/images/mon-article-cover.jpg" # Optionnel - Image de couverture
image_prompt: "Une illustration moderne d'une équipe agile..." # Optionnel - Prompt pour génération d'image
pitch: "Un résumé accrocheur de l'article en une phrase" # Optionnel - Pitch marketing
---
# Contenu de l'article en Markdown

Ton contenu ici...
```

### Nouveaux champs optionnels

#### **`image_cover`** - Image de couverture

- **Format** : Chemin relatif vers l'image (ex: `"articles/images/mon-article.jpg"`)
- **Usage** : Image principale affichée en tête d'article et dans les cartes
- **Formats supportés** : JPG, PNG, WebP (recommandé pour les performances)
- **Taille recommandée** : 1200x630px (ratio 16:9)

#### **`image_prompt`** - Prompt pour génération d'image

- **Format** : Texte descriptif en français ou anglais
- **Usage** : Description pour générer une image avec IA (DALL-E, Midjourney, etc.)
- **Exemple** : `"Une illustration moderne d'une équipe agile travaillant ensemble"`
- **Bonnes pratiques** : Décrire le style, les couleurs, l'ambiance souhaitée

#### **`pitch`** - Accroche marketing

- **Format** : Phrase courte et percutante (max 120 caractères)
- **Usage** : Résumé accrocheur pour les réseaux sociaux et référencement
- **Exemple** : `"Découvrez comment transformer votre équipe en 30 jours"`
- **Différence avec excerpt** : Plus court et orienté conversion

### Système de publication

- **`published: true`** : Article publié (si date/heure <= maintenant)
- **`published: false`** : Article en brouillon (jamais affiché)
- **Date/heure future** : Publication automatique au moment précis
- **Mode debug** : `?debug=true` ou localhost pour voir les brouillons

### Séries d'articles

Les séries permettent de regrouper des articles par thématique :

- **Navigation automatique** : Liens précédent/suivant entre articles d'une série
- **Filtrage par série** : Voir tous les articles d'une série
- **URLs dédiées** : `#series/nom-de-la-serie` pour partager
- **Badges visuels** : Identification claire des articles appartenant à une série

Exemple de série : "Carnets Agile : Du Code aux Équipes"

### Système de routage

URLs partageable pour chaque contenu :

- `#home` - Page d'accueil
- `#articles` - Liste des articles
- `#about` - Page à propos
- `#article/slug-de-larticle` - Article spécifique
- `#tag/nom-du-tag` - Articles filtrés par tag
- `#series/nom-de-la-serie` - Articles d'une série

---

## 🎨 Personnalisation

### 🎨 Palette de couleurs

Le thème utilise une palette "DevBast" dans `/css/style.css` :

```css
:root {
  --bg-primary: #1a1a2e; /* Fond principal */
  --bg-secondary: #16213e; /* Cards et sections */
  --bg-tertiary: #0f1419; /* Code et éléments sombres */

  --text-primary: #e8f4f8; /* Texte principal */
  --text-secondary: #b8c4d0; /* Texte secondaire */
  --text-muted: #8892a8; /* Texte discret */

  --accent-green: #64ffda; /* Vert principal */
  --accent-blue: #6c5ce7; /* Bleu */
  --accent-pink: #fd79a8; /* Rose */
  --accent-yellow: #ffd93d; /* Jaune (code) */
  --accent-red: #ff6b6b; /* Rouge (erreurs) */
}
```

### 🖼️ Gestion des images

#### Logo

- Place ton logo dans `assets/images/logo.png` (60x60px recommandé)
- Il apparaîtra automatiquement dans le header et comme favicon

#### Images de couverture d'articles

- **Dossier** : `assets/images/articles/`
- **Format recommandé** : WebP pour les performances
- **Taille optimale** : 1200x630px (ratio 16:9)
- **Nommage** : `nom-article-cover.webp`

#### Génération d'images avec IA

1. **Utilise le champ `image_prompt`** pour décrire l'image souhaitée
2. **Outils recommandés** :
   - DALL-E 3 (OpenAI)
   - Midjourney
   - Stable Diffusion
3. **Convertis en WebP** avec des outils comme [Squoosh](https://squoosh.app/)
4. **Optimise la taille** : < 200KB pour de bonnes performances

#### Exemple de workflow

```bash
# 1. Génère l'image avec ton outil IA préféré
# 2. Convertis en WebP
cwebp input.jpg -o assets/images/articles/mon-article-cover.webp -q 80

# 3. Ajoute le chemin dans ton article
image_cover: "assets/images/articles/mon-article-cover.webp"
```

### ✍️ Typographie

Police utilisée : **Inter** (Google Fonts)

- Poids : 300, 400, 500, 600, 700
- Optimisée pour la lisibilité sur écran

---

## ⚙️ Fonctionnement technique

### Routage URL

Le blog utilise un système de routage basé sur les hash URLs :

- **Navigation sans rechargement** : SPA (Single Page Application)
- **URLs partageable** : Chaque article/série a son URL unique
- **Gestion des caractères spéciaux** : Encodage/décodage automatique
- **Historique navigateur** : Boutons précédent/suivant fonctionnels

### Gestion des séries

- **Tri chronologique** : Articles d'une série triés par date
- **Navigation contextuelle** : Liens vers article précédent/suivant
- **Filtrage intelligent** : Affichage des articles d'une série uniquement

### Publication programmée

- **Précision à la seconde** : Publication basée sur date ET heure
- **Comparaison temps réel** : Vérification continue de l'heure de publication
- **Affichage conditionnel** : Articles futurs masqués automatiquement

### Service Worker (`sw.js`)

Cache intelligent :

- HTML, CSS, JS
- Fichiers YAML et articles Markdown
- Chargement rapide hors ligne

Forcer un rechargement :

```javascript
caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));
location.reload();
```

---

## 🧪 Dépannage

### ❌ Articles non affichés ?

- Vérifie le fichier `config.yaml`
- Lance un vrai serveur HTTP
- Ouvre la console (`F12`) pour voir les erreurs

### ❌ CSS non chargé ?

- Vérifie le chemin `css/style.css`
- Force un rechargement : `Ctrl + F5`

---

## 📈 Améliorations futures (roadmap)

- [x] **Séries d'articles** : Regroupement thématique avec navigation
- [x] **URLs partageable** : Système de routage complet
- [x] **Publication précise** : Date ET heure de publication
- [x] **Intégration LinkedIn** : Liens vers profil professionnel
- [x] **Filtres avancés** : Par tags ET par séries
- [x] **Analytics Google** : Suivi respectueux avec désactivation en debug
- [ ] Recherche plein texte
- [ ] Thème clair/sombre switchable
- [ ] Flux RSS
- [ ] Intégration commentaires GitHub
- [ ] PWA installable

---

## 💡 Tips de pieuvre expérimentée

### Bonnes pratiques articles

| Élément          | Conseil                                       |
| ---------------- | --------------------------------------------- |
| **Titre**        | < 60 caractères, accrocheur                   |
| **Excerpt**      | 150–200 caractères                            |
| **Pitch**        | < 120 caractères, orienté conversion          |
| **Tags**         | 3 à 5 max                                     |
| **Série**        | Nom cohérent pour tous les articles           |
| **Date**         | Format ISO avec heure : `2025-01-15 14:30:00` |
| **Lecture**      | 200 mots/min \~ 1 min/200 mots                |
| **Image cover**  | 1200x630px, format WebP optimisé              |
| **Image prompt** | Descriptif précis pour génération IA          |

### Arborescence conseillée

```
articles/
├── 2025/
│   ├── 01-janvier/
│   │   ├── docker-guide.md
│   │   ├── agile-carnets-1.md    # Série "Carnets Agile"
│   │   ├── agile-carnets-2.md    # Série "Carnets Agile"
│   │   └── images/
│   │       ├── docker-guide-cover.webp
│   │       ├── agile-carnets-1-cover.webp
│   │       └── agile-carnets-2-cover.webp
├── assets/
│   └── images/
│       └── articles/             # Images de couverture
└── config.yaml
```

### Exemple de série complète

```yaml
# Article 1 de la série
---
title: "Carnets Agile #1 : Les bases"
date: "2025-01-15 09:00:00"
series: "Carnets Agile : Du Code aux Équipes"
tags: ["Agile", "Coaching"]
image_cover: "assets/images/articles/agile-carnets-1-cover.webp"
image_prompt: "Une équipe diverse travaillant ensemble autour d'un tableau kanban coloré, style moderne et chaleureux"
pitch: "Découvrez les fondamentaux de l'Agilité en 10 minutes chrono"
---
# Article 2 de la série
---
title: "Carnets Agile #2 : En pratique"
date: "2025-01-22 09:00:00"
series: "Carnets Agile : Du Code aux Équipes"
tags: ["Agile", "Pratique"]
image_cover: "assets/images/articles/agile-carnets-2-cover.webp"
image_prompt: "Des développeurs en action lors d'un sprint, écrans avec du code, ambiance dynamique et collaborative"
pitch: "Passez de la théorie à la pratique avec des exemples concrets"
---
```

---

## 🙌 Contribuer

Tu veux contribuer ? Fork le repo, propose une PR :

```bash
git clone https://github.com/ton-utilisateur/devbast-blog.git
cd devbast-blog
git checkout -b feature/ta-branche
# Modifie, commit, push et propose ta PR
```

---

## 📚 Ressources utiles

- [Markdown Guide](https://www.markdownguide.org/)
- [YAML Lint](https://yamllint.com/)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

## 🧙‍♂️ Auteur

**Sébastien "Bastou" ROUEN** – Coach Agile | Facilitateur | Ex-Dev PHP | Pieuvre Tech

� LinkedIn : [https://www.linkedin.com/in/sebastien-rouen/](https://www.linkedin.com/in/sebastien-rouen/)
🔗 Site : [https://blog.bastou.dev](https://blog.bastou.dev)

> _"Ancien développeur depuis + de 10 ans, Coach Agile depuis plus de 8 ans, passionné par l'intelligence collective, la simplicité et le sens."_
