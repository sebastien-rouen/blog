---
title: "1# Il y a 16 ans : Quand on faisait de l'Agile... sans le savoir"
date: "2025-08-06 08:30:00"
series: "Carnet Agile - Du Code aux Équipes"
author: "Bastou"
tags: ["Agile", "DevLife", "Développement", "Transformation"]
image_cover: articles/images/agile-jour-1.png
image_prompt: >
    Scène: Pixel art, 3 développeurs sur leur ordinateur, avec 1 fenêtre sans rideau avec vue sur Paris.
    Style : Inspiré des jeux 16-bit type Secret of Mana
    Mood : Nostalgie + légère complexité visible sur les écrans concernant un site de voyages avec avion
    Focus : Sébastien habillé décontracté avec une petite barbichette sous les lèvres, mais pas de barbe. Légèrement perplexe devant son écran qui présente un bug
    Détail fun : une tasse de café chaude à côté"
pitch: >
    [Il y a 16 ans : Quand on faisait de l'Agile... sans le savoir]

    2009 : Une demande client → 20 minutes → en prod ⚡
    2025 : Une demande client → Sprint planning → Dev → Review → Tests → 2 semaines 🐌
    Question qui me hante : Étions-nous plus "agiles" il y a 16 ans ?
    Mon analyse de développeur devenu coach : On faisait de l'Agile... sans process ! Article complet : [https://blog.bastou.dev/#article/carnet-agile-du-code-aux-equipes-jour-1]
    L'agilité, c'est l'équilibre entre vitesse ET qualité. Pas l'un contre l'autre.
    Vous aussi, vous avez cette nostalgie du "livré dans l'heure" ?
    #Agile #RetourAuxSources #Efficacité
excerpt: >
    Il y a 16 ans, une demande client était livrée en 20 minutes.
    
    Aujourd'hui, avec nos process Agile "parfaits", il faut 2 semaines. 
    
    Paradoxe ? En 2009, sans le savoir, on appliquait déjà les vrais principes de l'agilité : réactivité maximale, feedback immédiat, collaboration directe. Certes, sans la qualité d'aujourd'hui. Mais étions-nous plus "agiles" à l'époque ? Réflexion d'un développeur devenu coach sur l'équilibre entre vitesse et process.
reading_time: 12
featured: true
published: true
---

<img src="articles/images/agile-jour-1.png" alt="Il y a 16 ans : Quand on faisait de l'Agile... sans le savoir" />

_Ou comment j'ai découvert que mes débuts chaotiques de développeur contenaient déjà les graines de l'agilité_

## Le bon vieux temps (qui n'était pas si bon que ça)

Nous sommes en 2009. J'ai 22 ans, je suis développeur PHP dans une petite agence web. Notre infrastructure ? **Un serveur mutualisé OVH à 15€/mois** sur lequel tournent cinq sites clients différents.

Notre environnement de développement ? **Il n'y en a qu'un : la production.**

Notre processus de test ? **Les vrais utilisateurs qui nous remontent les bugs.**

Et vous savez quoi ? **On était fiers de notre réactivité !**

### Une journée type en 2009

> **14h00** - Le téléphone sonne : _"Salut Sébastien ! Le client Dupont veut absolument ajouter un formulaire de contact sur sa page d'accueil. Il reçoit des prospects cet après-midi, il faut que ce soit en ligne avant 16h !"_

> **14h02** - J'ouvre FileZilla, je me connecte en FTP sur le serveur de prod.

> **14h03** - J'édite directement le fichier `index.php` via le client FTP (oui, directement sur le serveur).

> **14h15** - Premier test : j'actualise la page. Le formulaire apparaît. ✅

> **14h17** - Je remplis le formulaire et je clique sur "Envoyer"... Page blanche. 💥

> **14h18** - Correction rapide du code PHP (une variable mal échappée, classique).

> **14h20** - Nouveau test. Cette fois, le mail part bien. ✅

> **14h22** - J'appelle le client : "C'est en ligne !"

**Total :** 20 minutes de la demande à la livraison.

### Qu'est-ce qui marchait (vraiment bien) ?

Avec le recul de mes 8 ans d'expérience en coaching Agile, je réalise qu'on appliquait déjà certains principes fondamentaux :

**🚀 Livraison continue réelle**

- Pas de "sprint de 2 semaines"
- Pas de "release tous les mois"
- Du code en prod plusieurs fois par jour

**🔄 Feedback immédiat**

- Le client testait directement en prod
- Les bugs étaient remontés instantanément
- Les corrections étaient appliquées dans la foulée

**👥 Collaboration directe**

- Client au téléphone → développeur → livraison
- Zéro intermédiaire, zéro process lourd
- Communication ultra-directe

**⚡ Réactivité maximale**

- "C'est urgent" = livré dans l'heure
- Adaptation constante aux besoins clients
- Zéro résistance au changement

### Ce qui ne marchait pas (du tout)

Évidemment, tout n'était pas rose dans ce monde de bisounours développeurs :

**💣 Qualité aléatoire**

- Pas de tests automatisés (ils existaient déjà, mais on ne les connaissait pas)
- Régressions fréquentes
- Code spaghetti assumé

**😰 Stress permanent**

- Pas de sauvegarde fiable
- Une erreur = tous les sites down
- Weekends de maintenance d'urgence

**📈 Pas de scalabilité**

- Impossible de faire grandir l'équipe
- Pas de documentation
- Connaissance dans la tête d'une seule personne

## Le paradoxe d'aujourd'hui

**Aujourd'hui**, j'aide des équipes avec des process Agile rodés :

- Sprint planning de 2h pour estimer une fonctionnalité
- 3 environnements de test minimum (dev/staging/prod)
- Pipeline CI/CD avec 47 étapes de validation (Intégration continus / Déploiement continus)
- Code review obligatoire
- Tests automatisés à 80% de couverture

**Le résultat ?** Une qualité et une fiabilité incomparables.

**Mais aussi :** Il faut parfois 2 semaines pour livrer ce qu'on sortait en 2 heures en 2009.

### La question qui me hante

**L'Agile était censé nous rendre plus réactifs que les méthodes traditionnelles.**

Alors pourquoi ai-je l'impression qu'on était plus "agiles" (au sens étymologique) il y a 15 ans ?

### Ce que j'ai compris avec l'expérience

Le problème n'est pas l'Agile. **Le problème, c'est qu'on a parfois oublié l'objectif pour se concentrer sur les process.**

Les vrais principes Agile, c'est :

- **Répondre au changement** plutôt que suivre un plan
- **Collaboration** plutôt que négociation contractuelle
- **Logiciel fonctionnel** plutôt que documentation exhaustive
- **Individus et interactions** plutôt que processus et outils

En 2009, sans le savoir, on appliquait ces principes. Avec trop peu de structure, certes. Mais on les appliquait.

### Résumé en 3 points clés

✅ **L'agilité, c'est l'équilibre** entre réactivité et qualité, pas l'un au détriment de l'autre

✅ **Les process sont au service de l'efficacité**, pas l'inverse

✅ **Parfois, regarder en arrière aide à mieux avancer** - on peut s'inspirer de ce qui marchait "avant"

## Et maintenant ?

Cette réflexion m'accompagne dans tous mes accompagnements d'équipes. Comment garder cette capacité de réaction rapide tout en construisant quelque chose de solide ?

C'est d'ailleurs une des questions qui nourrit un projet sur lequel je travaille actuellement...

**Et vous ?** Vous avez connu cette époque du développement "à l'arrache" ? Comment vous conciliez vitesse et qualité dans vos équipes aujourd'hui ?

---

_Sébastien - Coach Agile & ex-développeur nostalgique_

_Prochain épisode : "Je passe de 5 sites sur un seul environnement, à Scrum Master : Mon parcours"_
