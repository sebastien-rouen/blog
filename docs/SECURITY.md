# 🔒 Sécurité du Blog

## Mesures de sécurité implémentées

### 🛡️ Protection contre les XSS (Cross-Site Scripting)

- **Échappement HTML** : Toutes les données utilisateur sont échappées avant affichage
- **Validation des entrées** : Validation stricte des slugs, tags et noms de fichiers
- **DOM sécurisé** : Utilisation de `textContent` et création d'éléments DOM plutôt qu'`innerHTML`
- **Sanitisation Markdown** : Le contenu Markdown est traité par marked.js qui échappe automatiquement le HTML

### 🚫 Protection contre Path Traversal

- **Validation des noms de fichiers** : Interdiction des caractères dangereux (`../`, `..\\`, etc.)
- **Whitelist des caractères** : Seuls les caractères alphanumériques, tirets et underscores sont autorisés
- **Limitation de longueur** : Noms de fichiers limités à 255 caractères
- **Encodage des URLs** : Utilisation d'`encodeURIComponent` pour les paramètres d'URL

### 🔍 Validation des paramètres d'URL

- **Slugs d'articles** : Validation avec regex `^[a-zA-Z0-9_-]+$`
- **Sections autorisées** : Whitelist des sections (`home`, `articles`, `about`)
- **Gestion d'erreurs** : Redirection vers l'accueil en cas de paramètre invalide
- **Limitation de longueur** : Tags < 50 caractères, séries < 100 caractères

### 🛠️ Fonctions de sécurité

```javascript
// Échappement HTML
escapeHtml(text) {
    if (!text || typeof text !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Validation des noms de fichiers
isValidFilename(filename) {
    if (!filename || typeof filename !== 'string') return false;
    const dangerousPattern = /[<>:"|?*\x00-\x1f]|\.\.\/|\.\.\\|\.\./;
    return !dangerousPattern.test(filename) && filename.length > 0 && filename.length < 255;
}

// Validation des slugs
isValidSlug(slug) {
    if (!slug || typeof slug !== 'string') return false;
    return /^[a-zA-Z0-9_-]+$/.test(slug) && slug.length > 0 && slug.length < 100;
}
```

## 🚨 Bonnes pratiques

### Pour les développeurs

1. **Toujours valider les entrées** avant traitement
2. **Utiliser `textContent`** plutôt qu'`innerHTML` quand possible
3. **Encoder les paramètres d'URL** avec `encodeURIComponent`
4. **Limiter la longueur** des chaînes de caractères
5. **Gérer les erreurs** proprement avec des fallbacks sécurisés

### Pour les rédacteurs d'articles

1. **Noms de fichiers sûrs** : Utiliser uniquement `a-z`, `0-9`, `-`, `_`
2. **Éviter les caractères spéciaux** dans les titres et tags
3. **Vérifier les URLs d'images** avant publication
4. **Tester en mode drafts** avant publication

## 🔧 Configuration sécurisée

### Headers de sécurité recommandés (serveur web)

```nginx
# Content Security Policy
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self';" always;

# Autres headers de sécurité
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

### Variables d'environnement

```bash
# Mode production (recommandé)
NODE_ENV=production

# Désactiver les logs de debug en production
DEBUG=false
```

## 🚨 Signalement de vulnérabilités

Si vous découvrez une vulnérabilité de sécurité :

1. **NE PAS** créer d'issue publique
2. **Contacter** directement : security@bastou.dev
3. **Inclure** : description détaillée, étapes de reproduction, impact potentiel
4. **Attendre** la correction avant divulgation publique

## 📋 Checklist de sécurité

### Avant chaque déploiement

- [ ] Validation de tous les paramètres d'entrée
- [ ] Échappement HTML de toutes les données utilisateur
- [ ] Test des URLs avec caractères spéciaux
- [ ] Vérification des noms de fichiers d'articles
- [ ] Test en mode drafts et production
- [ ] Vérification des headers de sécurité
- [ ] Scan de vulnérabilités automatisé

### Maintenance régulière

- [ ] Mise à jour des dépendances (marked.js, js-yaml)
- [ ] Audit de sécurité mensuel
- [ ] Vérification des logs d'erreurs
- [ ] Test de pénétration trimestriel
- [ ] Sauvegarde des données

## 🔄 Historique des correctifs

### Version 2.1.0 (2025-08-08)
- ✅ Ajout de l'échappement HTML systématique
- ✅ Validation des noms de fichiers (protection path traversal)
- ✅ Validation des slugs et paramètres d'URL
- ✅ Remplacement d'innerHTML par création d'éléments DOM
- ✅ Gestion d'erreurs sécurisée avec fallbacks

### Version 2.0.0 (2025-08-07)
- ✅ Implémentation du mode drafts
- ✅ Amélioration de la validation des articles

## 📚 Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Marked.js Security](https://marked.js.org/#/USING_ADVANCED.md#options)