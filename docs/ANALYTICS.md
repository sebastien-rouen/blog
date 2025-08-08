# 📊 Configuration Google Analytics pour Bastou Blog

Ce guide vous explique comment configurer Google Analytics 4 (GA4) sur votre blog.

## 🚀 Configuration rapide

### 1. Créer un compte Google Analytics

1. Allez sur [analytics.google.com](https://analytics.google.com)
2. Connectez-vous avec votre compte Google
3. Cliquez sur "Commencer" si c'est votre premier compte
4. Créez une propriété pour votre site web

### 2. Récupérer votre ID de mesure

1. Dans Google Analytics, allez dans **Admin** (roue dentée en bas à gauche)
2. Dans la colonne **Propriété**, cliquez sur **Flux de données**
3. Cliquez sur votre flux de données web
4. Copiez l'**ID de mesure** (format : `G-XXXXXXXXXX`)

### 3. Configurer votre blog

**Option A : Modification directe dans index.html**

Remplacez `GA_MEASUREMENT_ID` par votre vrai ID dans le fichier `index.html` :

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-VOTRE-ID-ICI"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-VOTRE-ID-ICI');
</script>
```

**Option B : Configuration via config.js (recommandé)**

Modifiez le fichier `js/config.js` :

```javascript
const BLOG_CONFIG = {
    analytics: {
        measurementId: 'G-VOTRE-ID-ICI', // Remplacez par votre ID
        enableInDebug: false,
        // ...
    }
    // ...
};
```

## 📈 Fonctionnalités de tracking

Le système de Google Analytics intégré track automatiquement :

### Pages virtuelles
- **Page d'accueil** : `/home`
- **Liste des articles** : `/articles`
- **Page à propos** : `/about`
- **Articles individuels** : `/article/slug-de-larticle`

### Événements personnalisés
- **Lecture d'articles** : Temps de lecture et titre
- **Filtres par tag** : Tag sélectionné
- **Filtres par série** : Série sélectionnée
- **Liens externes** : URL et texte du lien
- **Téléchargements** : Nom du fichier (si applicable)

### Désactivation automatique
- **Mode debug** : Désactivé sur localhost et avec `?debug=true`
- **Développement** : Pas de pollution des statistiques en développement

## 🔧 Configuration avancée

### Personnaliser les événements

Dans `js/config.js`, vous pouvez désactiver certains événements :

```javascript
analytics: {
    measurementId: 'G-VOTRE-ID-ICI',
    events: {
        articleRead: true,      // Lecture d'articles
        externalLinks: false,   // Désactiver le tracking des liens externes
        tagFilters: true,       // Filtres par tag
        seriesFilters: true,    // Filtres par série
        downloads: true         // Téléchargements
    }
}
```

### Ajouter des événements personnalisés

Utilisez l'instance globale `window.analytics` :

```javascript
// Exemple : tracker un clic sur un bouton spécial
document.getElementById('special-button').addEventListener('click', () => {
    if (window.analytics) {
        window.analytics.trackEvent('special_action', {
            event_category: 'engagement',
            event_label: 'Special Button Click'
        });
    }
});
```

## 📊 Métriques importantes à surveiller

### Pages les plus vues
- Articles les plus populaires
- Sections les plus visitées
- Temps passé sur chaque page

### Engagement
- Taux de rebond
- Durée de session
- Pages par session

### Comportement utilisateur
- Tags les plus filtrés
- Séries les plus consultées
- Liens externes les plus cliqués

### Acquisition
- Sources de trafic
- Mots-clés de recherche
- Réseaux sociaux

## 🛠️ Dépannage

### Analytics ne fonctionne pas ?

1. **Vérifiez l'ID de mesure** : Format `G-XXXXXXXXXX`
2. **Ouvrez la console** : Recherchez les erreurs JavaScript
3. **Testez en production** : Analytics est désactivé en localhost
4. **Attendez 24-48h** : Les données peuvent prendre du temps à apparaître

### Vérifier que ça fonctionne

1. **Console du navigateur** : Vous devriez voir `📊 Google Analytics activé`
2. **Onglet Réseau** : Requêtes vers `google-analytics.com`
3. **Google Analytics** : Rapport en temps réel (peut prendre quelques minutes)

### Messages de debug

Le système affiche des messages dans la console :

```
📊 Google Analytics activé
📊 Page vue trackée: /home - Accueil - Bastou Blog
📊 Événement tracké: article_read {article_title: "Mon Article"}
```

## 🔒 Respect de la vie privée

### Conformité RGPD

Le système actuel ne collecte que des données anonymes. Pour une conformité RGPD complète, vous pourriez vouloir :

1. **Ajouter un bandeau de cookies**
2. **Permettre l'opt-out**
3. **Anonymiser les IPs** (activé par défaut dans GA4)

### Configuration respectueuse

```javascript
// Dans index.html, après gtag('config', 'G-VOTRE-ID'):
gtag('config', 'G-VOTRE-ID', {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
});
```

## 📚 Ressources utiles

- [Guide officiel Google Analytics 4](https://support.google.com/analytics/answer/10089681)
- [Documentation gtag.js](https://developers.google.com/analytics/devguides/collection/gtagjs)
- [Événements recommandés GA4](https://support.google.com/analytics/answer/9267735)
- [Test de configuration](https://tagassistant.google.com/)

## 🐙 Support

Si vous rencontrez des problèmes :

1. Vérifiez la console du navigateur
2. Testez avec l'extension [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
3. Consultez les rapports en temps réel dans Google Analytics

---

**Astuce de pieuvre** : Commencez simple avec juste l'ID de mesure, puis ajoutez progressivement les fonctionnalités avancées selon vos besoins ! 🐙