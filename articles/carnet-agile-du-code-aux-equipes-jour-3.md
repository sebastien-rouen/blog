---
title: "3# Les clients d'hier vs aujourd'hui : Même impatience, nouveaux outils"
date: "2025-08-08 08:30:00"
series: "Carnet Agile - Du Code aux Équipes"
author: "Bastou"
tags: ["Agile", "Client", "Communication", "Outils"]
image_cover: articles/images/agile-jour-3.png
image_prompt: >
    Scène: Pixel art, Sébastien devant un board au Daily coloré avec des post it, découvrant l'Agilité pour la première fois avec d'autres collègues qui parlent de leur tâches.
    Style: Inspiré des jeux 16-bit type Secret of Mana, esthétique rétro pixel art avec palette de couleurs chaudes, détails fins dans le style années 2000.
    Mood: Surprise de Sébastien, étonné, mais content !
    Focus: Sébastien habillé décontracté (t-shirt, pantacourt), avec une petite barbichette sous les lèvres mais pas de barbe complète.
    Détail fun: Des tasses apparaissant sur des bureaux, de café à moitié vide, plusieurs post-it collés sur des écrans avec des notes de bug, et peut-être un petit serveur physique qui clignote dans le coin avec un voyant rouge d'alerte.
    Ambiance générale: Bureaux de développeurs 2009. Ambiance collective avec des nerfs sur les bureaux
pitch: >
    📅 14h30, visio client hier :

    > Client : "Cette petite modification sur le formulaire, ça peut se faire pour cet après-midi ? C'est juste ajouter un champ téléphone."
    > Moi : "Il faudrait l'ajouter au backlog, l'estimer avec l'équipe, puis la planifier au sprint suivant..."
    > Client : "Mais... avant tu me faisais ça en 10 minutes."
    > Moi : "Oui mais maintenant on a des tests automatisés, de la revue de code, des environnements de staging..."
    > Client : "Moi j'ai un salon qui ouvre lundi..."
    Fin de la visio. Malaise. 😅

    Cette conversation, je l'ai eue des dizaines de fois. A chaque fois, même frustration : on a l'impression d'avoir régressé aux yeux du client.
    - 2009 : Appel → FTP → Modif en direct → "C'est en ligne !" → Client ravi
    - 2025 : Backlog → Estimation → Sprint → Tests → Déploiement → Client perplexe

    Le grand malentendu : 
    - Le client mesure le temps entre sa demande et le résultat
    - Nous, on mesure la qualité et la fiabilité sur le long terme

    Comment réconcilier les deux ? J'ai quelques pistes... 🤔

    Mon analyse complète : https://blog.bastou.dev/#article/carnet-agile-du-code-aux-equipes-jour-3

    Et vous, cette tension qualité vs réactivité, comment vous la gérez ?
    #Agile #QualiteVsReactivite #MonParcours #ClientSatisfaction #Efficacité
excerpt: >
    Pourquoi les clients trouvent qu'on était "plus efficaces avant" et comment réconcilier qualité technique et réactivité business.
    Entre nostalgie du FTP et réalité des process modernes, mon retour d'expérience sur cette tension permanente.
reading_time: 12
featured: true
published: true
---

<img src="articles/images/agile-jour-3.png" alt="Les clients d'hier vs aujourd'hui : Même impatience, nouveaux outils" />

*Pourquoi "c'était plus simple avant" et comment réconcilier qualité et réactivité client*

## La scène qui m'a inspiré cet article

**Hier, 14h30, visio client :**

> **Client :** "Sebastien, cette petite modification sur le formulaire de contact, ça peut se faire pour cet après-midi ? C'est juste ajouter un champ 'téléphone'."

> **Moi :** "Il faudrait l'ajouter au backlog, l'estimer avec l'équipe lors du prochain refinement, puis la planifier au sprint suivant..."

> **Client :** *(silence gêné)* "Mais... c'est vraiment juste un champ. Avant, tu me faisais ça en 10 minutes."

> **Moi :** "Oui mais maintenant on a des tests automatisés, de la revue de code, des environnements de staging..."

> **Client :** "Je comprends, mais moi j'ai un salon qui ouvre lundi et j'ai besoin de récupérer les téléphones de mes prospects..."

**Fin de la visio. Malaise.**

Cette conversation, je l'ai eue des dizaines de fois ces dernières années.

Et à chaque fois, je ressens la même frustration : **on a l'impression d'avoir régressé aux yeux du client.**

## Il était une fois... l'époque bénie du "vite fait, bien fait" (enfin... vite fait)

### Le bon vieux temps client (2009-2014)

**Le contexte :** Sites vitrine, petits e-commerces, pas d'enjeux critiques.

**Le process client typique :**
> **14h00** - Appel client : "J'aimerais modifier quelque chose"

> **14h05** - Connexion FTP

> **14h15** - Modification en direct

> **14h20** - "C'est en ligne, tu peux vérifier"

> **14h25** - Client ravi : "Parfait ! Tu facturas combien ?"

**Les avantages côté client :**
- **Immédiateté totale**
- **Pas de jargon technique**
- **Pas de process incompréhensible**
- **Sensation d'être écouté**
- **Budget prévisible** (30€ la modif, point)

**Les avantages côté dev :**
- **Relation directe** avec le vrai décideur
- **Feedback immédiat**
- **Satisfaction client garantie**
- **Facturation simple**

### Les coulisses moins reluisantes

Mais derrière cette apparente efficacité, c'était souvent le chaos :

---

**📱 Week-ends sacrifiés :**  
*"Sébastien, le site ne marche plus depuis ta modif de vendredi..."*  
→ Debug d'urgence le dimanche matin

---

**🔥 Effet domino :**  
Changer une CSS → casser 3 autres pages → correction d'urgence → nouveau bug → etc.

---

**📝 Pas de traçabilité :**  
*"Tu te souviens de cette modif que tu avais faite il y a 6 mois ?"*  
→ Non, et il n'y a aucune documentation.

---

**💸 Sous-facturation chronique :**  
"30€ pour ajouter un champ" → mais 4h de debug caché le lendemain

---

**🎯 Pas de vision produit :**  
Accumulation de features sans cohérence → site devenu ingérable

## L'évolution : quand les enjeux grandissent

### 2015-2020 : La montée en complexité

**Les projets grossissent :**
- Sites vitrines → Applications métier
- 10 visiteurs/jour → 10 000 utilisateurs/jour  
- Budget 500€ → Budget 50k€
- Équipe de 1 → Équipe de 8

**Les risques explosent :**
- Une erreur → perte de CA immédiate
- Pas de tests → régression sur des fonctions critiques
- Pas de sauvegarde → catastrophe business
- Code mal organisé → maintenance impossible

**On découvre les bonnes pratiques :**
- Versionning (Git)
- Tests automatisés
- Environnements séparés
- Code review
- Documentation

**Résultat :** La qualité explose... mais la vélocité apparente s'effondre.

### 2020-2025 : L'ère Agile (théorique)

**L'Agile arrive dans nos PME :**
- Scrum Masters
- Sprint planning
- Daily standups  
- Retrospectives
- User stories avec critères d'acceptation

**Les outils se sophistiquent :**
- Jira/Azure DevOps remplacent les emails
- Pipelines CI/CD remplacent le FTP
- Tests E2E remplacent les "ça marche chez moi"

**On gagne en :**
- **Qualité** (moins de bugs en prod)
- **Prévisibilité** (vélocité mesurée)
- **Maintenabilité** (code propre et documenté)
- **Collaboration** (équipe alignée)

**Mais le client voit :**
- **Plus de process** à comprendre
- **Plus de délais** pour les "petites choses"
- **Plus de jargon** dans nos échanges
- **Moins de flexibilité** apparente

## Le grand malentendu

### Du côté client : "Avant c'était mieux"

**Sa logique :**
*"Mes besoins n'ont pas changé. J'ai toujours besoin qu'on réponde vite à mes demandes urgentes. Pourquoi c'est devenu si compliqué ?"*

**Ses frustrations :**
- **Délais incompréhensibles** : "Pourquoi 3 jours pour un bouton ?"
- **Process opaques** : "C'est quoi un 'backlog' ?"  
- **Perte de contrôle** : "Avant je te demandais, maintenant il faut que je passe par Jira"
- **Rigidité** : "On ne peut plus rien changer en cours de sprint ?"

### Du côté équipe : "Maintenant c'est mieux"

**Notre logique :**
*"On livre de la qualité industrielle. Nos process garantissent la fiabilité et la maintenabilité. Le client devrait comprendre la valeur."*

**Nos frustrations :**
- **Client "old school"** : "Il ne comprend pas qu'on ne peut pas casser nos process"
- **Pression constante** : "Il veut toujours tout pour hier"
- **Dévalorisation** : "Il pense qu'on est moins efficaces qu'avant"

### Le problème : on ne parle pas du même "mieux"

**Le client mesure :** Temps entre sa demande et le résultat visible

**Nous, on mesure :** Qualité, maintenabilité, fiabilité sur le long terme

**Le client veut :** Flexibilité et réactivité
**Nous, on livre :** Structure et prévisibilité

## Réconcilier les deux mondes : mes apprentissages terrain

### 1. Éduquer sans condescendre

**Au lieu de :** *"Maintenant on fait de l'Agile, c'est plus pro."*

**Dire :** *"Avant, quand on modifiait vite, on cassait souvent autre chose. Maintenant nos vérifications évitent ça. Au final, ça vous fait gagner du temps."*

**Concrètement :** Montrer des exemples de régressions évitées grâce aux tests.

### 2. Créer des "soupapes de décompression"

**Principe :** Garder de la place pour l'imprévu vraiment urgent.

**En pratique :**
- **20% de buffer** dans chaque sprint pour les urgences
- **Process d'escalade** clair : "urgence client" vs "envie client"
- **Hot-fix** channel avec process allégé mais sécurisé

### 3. Rendre visible la valeur cachée

**Avant :** Le client ne voyait que le résultat final

**Maintenant :** Montrer le travail invisible qui garantit la qualité

**Exemples concrets :**
- *"Cette modif a pris 2 jours, mais on a aussi vérifié qu'elle ne casse rien sur les 47 autres pages"*
- *"Voici le rapport de tests : 0 régression détectée"*
- *"Temps de rollback en cas de problème : 30 secondes"*

### 4. Adapter le process au niveau de risque

**Toutes les demandes ne sont pas égales :**

**🟢 Faible risque** (couleur, texte, image) → Process allégé

**🟡 Risque moyen** (nouveau champ, modification workflow) → Process standard  

**🔴 Haut risque** (logique métier, paiement, sécurité) → Process complet

### 5. Parler "impact business" plutôt que "process technique"

**Au lieu de :** *"Il faut estimer en story points"*

**Dire :** *"On évalue l'effort pour vous donner une date fiable"*

**Au lieu de :** *"C'est planifié au prochain sprint"*  

**Dire :** *"On peut vous livrer ça d'ici 10 jours, testé et sans casser l'existant"*

## Cas pratique : la demande de champ téléphone

**Reprenons l'exemple du début, voici comment je gère maintenant :**

> **Client :** "Ce champ téléphone, c'est pour cet après-midi ?"

> **Moi :** "Je comprends l'urgence pour votre salon. Laisse-moi vérifier le niveau de complexité..."

*[5 minutes d'analyse]*

> **Moi :** "Bonne nouvelle : c'est faible risque. On peut faire un hot-fix sécurisé. Je le livre dans 2h avec tests de non-régression. Ça vous va ?"

> **Client :** "Parfait ! Et ça coûte combien ?"

> **Moi :** "150€ pour la modification + les vérifications. Comme ça, pas de mauvaise surprise le weekend 😊"

**Résultat :**
- ✅ Client satisfait (rapidité + transparence)
- ✅ Qualité préservée (tests + process allégé adapté)  
- ✅ Équipe sereine (pas de compromis sur la sécurité)
- ✅ Relation client maintenue (confiance mutuelle)

## Les pièges à éviter

### ❌ L'extrême rigidité
*"Désolé, c'est pas possible, on est en sprint."*
→ Le client se sent méprisé

### ❌ L'extrême flexibilité  
*"OK, on fait l'exception juste cette fois."*
→ Retour vers le chaos d'avant

### ❌ La sur-justification technique
*"Il faut faire un merge request avec review par deux personnes et déploiement sur l'environnement de staging..."*
→ Le client décroche

### ❌ La dévalorisation du passé
*"Avant on faisait n'importe quoi, maintenant on fait bien."*
→ Le client culpabilise

## Ma vision pour 2025 et au-delà

**L'objectif :** Garder le meilleur des deux mondes.

**Du passé (2009), on garde :**
- La réactivité face à l'urgent
- La relation directe et humaine
- La simplicité dans les échanges
- L'adaptabilité

**Du présent (2025), on garde :**
- La qualité et la fiabilité
- La traçabilité et la documentation
- Les tests automatisés
- Le travail en équipe

**Pour demain, on construit :**
- Des outils qui servent cette vision
- Des process adaptatifs selon le contexte
- Une éducation client continue
- Une agilité vraiment... agile

## Résumé en 5 points clés

✅ **Le client n'a pas tort** de regretter la simplicité d'avant - il faut reconnaître cette frustration

✅ **Nos process ont de la valeur** - mais il faut la rendre visible et compréhensible  

✅ **L'adaptabilité est au cœur de l'Agile** - un process rigide n'est pas agile

✅ **Éduquer sans condescendre** - montrer la valeur par l'exemple, pas par la théorie

✅ **Créer des soupapes** - prévoir de la place pour l'imprévu dans nos plannings

## Et vous ?

- **Comment vous gérez cette tension entre qualité et réactivité ?**
- **Quelles sont vos astuces pour concilier process structuré et flexibilité ?**

Cette réflexion alimente un projet sur lequel je travaille : comment créer des outils qui aident les équipes à être agiles... vraiment agiles ? *(à voir dans mes futurs articles, pourquoi pas...)*

---
*Sébastien - Scrum Master qui n'a pas oublié ses années de dev*  
*Prochain épisode : "Rétrospectives : Au-delà du Mad/Sad/Glad"*