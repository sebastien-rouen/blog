class Blog {
    constructor() {
        this.articles = [];
        this.filteredArticles = [];
        this.allArticles = []; // Tous les articles, même non publiés
        this.currentTag = 'all';
        this.debugMode = this.isDebugMode();
        this.isDrafts = this.isDraftsEnvironment();
        this.init();
    }

    // Fonction pour normaliser les URLs (minuscules, sans accents, espaces remplacés par des tirets)
    normalizeUrl(str) {
        if (!str || typeof str !== 'string') return '';
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
            .replace(/[^a-z0-9\s-]/g, '') // Garder seulement lettres, chiffres, espaces et tirets
            .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
            .replace(/-+/g, '-') // Remplacer les tirets multiples par un seul
            .replace(/^-|-$/g, ''); // Supprimer les tirets en début et fin
    }

    // Fonction pour échapper le HTML et prévenir les XSS
    escapeHtml(text) {
        if (!text || typeof text !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Fonction pour valider les noms de fichiers (prévenir path traversal)
    isValidFilename(filename) {
        if (!filename || typeof filename !== 'string') return false;
        // Interdire les caractères dangereux et les tentatives de path traversal
        const dangerousPattern = /[<>:"|?*\x00-\x1f]|\.\.\/|\.\.\\|\.\./;
        return !dangerousPattern.test(filename) && filename.length > 0 && filename.length < 255;
    }

    // Fonction pour valider les slugs d'articles
    isValidSlug(slug) {
        if (!slug || typeof slug !== 'string') return false;
        // Seuls les caractères alphanumériques, tirets et underscores sont autorisés
        return /^[a-zA-Z0-9_-]+$/.test(slug) && slug.length > 0 && slug.length < 100;
    }

    // Fonction pour retrouver l'article original à partir du slug normalisé
    findArticleByNormalizedSlug(normalizedSlug) {
        return this.articles.find(article => 
            this.normalizeUrl(article.slug) === normalizedSlug
        );
    }

    // Fonction pour retrouver le tag original à partir du tag normalisé
    findOriginalTag(normalizedTag) {
        const allTags = [...new Set(this.articles.flatMap(article => article.tags || []))];
        return allTags.find(tag => this.normalizeUrl(tag) === normalizedTag);
    }

    // Fonction pour retrouver la série originale à partir de la série normalisée
    findOriginalSeries(normalizedSeries) {
        const allSeries = [...new Set(this.articles.map(article => article.series).filter(Boolean))];
        return allSeries.find(series => this.normalizeUrl(series) === normalizedSeries);
    }

    isDebugMode() {
        // Active le mode debug si on est en localhost, drafts.blog.bastou.dev ou avec le paramètre ?debug=true
        return window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.hostname === 'drafts.blog.bastou.dev' ||
            new URLSearchParams(window.location.search).get('debug') === 'true';
    }

    isDraftsEnvironment() {
        // Détecte spécifiquement l'environnement drafts
        return window.location.hostname === 'drafts.blog.bastou.dev' ||
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            new URLSearchParams(window.location.search).get('debug') === 'true';
    }

    async init() {
        console.log('🐙 Blog - Initialisation...');

        try {
            await this.loadArticles();
            this.setupEventListeners();
            this.setupRouter();
            this.setupExternalLinkTracking();
            this.setupHeroEffects();
            this.showDraftsIndicator();
            this.renderRecentArticles();
            this.renderAllArticles();
            this.renderTagFilters();
            this.handleInitialRoute();
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation:', error);
            this.showError('Impossible de charger les articles');
        }
    }

    async loadArticles() {
        try {
            // Charger la configuration des articles
            const configResponse = await fetch('./articles/config.yaml');
            if (!configResponse.ok) {
                throw new Error(`Erreur HTTP: ${configResponse.status}`);
            }

            const configText = await configResponse.text();
            const config = jsyaml.load(configText);

            // Charger chaque article avec validation de sécurité
            const articlePromises = config.articles.map(async (articleConfig) => {
                try {
                    // Validation du nom de fichier pour prévenir path traversal
                    if (!this.isValidFilename(articleConfig.file)) {
                        console.warn(`⚠️ Nom de fichier invalide: ${articleConfig.file}`);
                        return null;
                    }

                    // Construire l'URL de manière sécurisée
                    const articleUrl = `./articles/${encodeURIComponent(articleConfig.file)}`;
                    const response = await fetch(articleUrl);
                    if (!response.ok) {
                        console.warn(`⚠️ Article non trouvé: ${articleConfig.file}`);
                        return null;
                    }

                    const content = await response.text();
                    const parsedArticle = this.parseMarkdown(content);
                    const finalArticle = {
                        ...articleConfig,
                        ...parsedArticle,
                        slug: articleConfig.file.replace('.md', '')
                    };
                    
                    return finalArticle;
                } catch (error) {
                    console.error(`❌ Erreur lors du chargement de ${articleConfig.file}:`, error);
                    return null;
                }
            });

            const articles = await Promise.all(articlePromises);
            const validArticles = articles.filter(article => article !== null);

            // Garder tous les articles pour le mode debug
            this.allArticles = [...validArticles];

            // Filtrer les articles selon leur statut de publication et leur date
            if (this.isDrafts) {
                console.log('🚧 Mode drafts activé - Affichage de tous les articles');
                this.articles = validArticles;
                // Ajouter des indications visuelles pour les articles
                this.articles.forEach(article => {
                    if (this.isArticleDraft(article)) {
                        article.isDraft = true;
                    } else if (this.isArticleScheduled(article)) {
                        article.isScheduled = true;
                    }
                });
            } else {
                console.log('📝 Mode production - Affichage des articles publiés uniquement');
                this.articles = this.filterPublishedArticles(validArticles);
            }

            // Trier par date (plus récent en premier)
            this.articles.sort((a, b) => new Date(b.date) - new Date(a.date));
            this.filteredArticles = [...this.articles];

        } catch (error) {
            console.error('❌ Erreur lors du chargement de la configuration:', error);
            throw error;
        }
    }

    isArticlePublished(article) {
        const now = new Date();

        // Si published est explicitement false, ne pas afficher
        if (article.published === false) {
            return false;
        }

        // Vérifier la date et l'heure pour tous les articles (même published: true)
        if (article.date) {
            const articleDate = new Date(article.date);
            // Comparer la date et l'heure complètes
            if (articleDate > now) {
                return false;
            }
        }

        return true;
    }

    // Nouvelle fonction pour détecter les articles programmés
    isArticleScheduled(article) {
        const now = new Date();

        // Un article est programmé si published: true ET date future
        if (article.published === true && article.date) {
            const articleDate = new Date(article.date);
            return articleDate > now;
        }

        return false;
    }

    // Nouvelle fonction pour détecter les brouillons
    isArticleDraft(article) {
        // Un article est un brouillon si published: false
        return article.published === false;
    }

    filterPublishedArticles(articles) {
        return articles.filter(article => {
            return this.isArticlePublished(article);
        });
    }

    parseMarkdown(content) {
        // Extraire les métadonnées YAML (front matter)
        // Regex plus flexible pour gérer différents types de retours à la ligne
        const frontMatterRegex = /^---\s*[\r\n]+(.*?)[\r\n]+---\s*[\r\n]+([\s\S]*)$/s;
        const match = content.match(frontMatterRegex);

        let metadata = {};
        let markdownContent = content;

        if (match) {
            try {
                metadata = jsyaml.load(match[1]) || {};
                markdownContent = match[2];
            } catch (error) {
                console.warn('⚠️ Erreur lors du parsing YAML:', error);
            }
        } else {
            console.warn('⚠️ Aucun front matter trouvé dans le contenu');
            console.log('🔍 Début du contenu:', content.substring(0, 100));
            console.log('🔍 Codes des premiers caractères:', content.substring(0, 10).split('').map(c => c.charCodeAt(0)));
        }

        // Convertir le Markdown en HTML
        const htmlContent = marked.parse(markdownContent);

        // Générer un extrait
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        const excerpt = textContent.substring(0, 200) + (textContent.length > 200 ? '...' : '');

        const result = {
            ...metadata,
            content: htmlContent,
            excerpt: metadata.excerpt || excerpt
        };

        return result;
    }

    setupEventListeners() {
        // Navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('data-section');
                this.navigateToSection(section);
            });
        });

        // Boutons CTA du hero
        const heroButtons = document.querySelectorAll('.hero-btn[data-section]');
        heroButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('data-section');
                this.navigateToSection(section);
            });
        });

        // Filtres par tags
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn') && e.target.hasAttribute('data-tag')) {
                const tag = decodeURIComponent(e.target.getAttribute('data-tag'));
                if (tag) {
                    this.navigateToTag(tag);
                }
            }
        });

        // Filtres et badges de séries
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('series-badge') ||
                e.target.classList.contains('series-badge-large') ||
                e.target.classList.contains('series-filter') ||
                (e.target.classList.contains('filter-btn') && e.target.hasAttribute('data-series'))) {
                const series = decodeURIComponent(e.target.getAttribute('data-series'));
                if (series) {
                    this.navigateToSeries(series);
                }
            }
        });

        // Tags cliquables
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tag')) {
                const tag = decodeURIComponent(e.target.getAttribute('data-tag'));
                if (tag) {
                    this.navigateToTag(tag);
                }
            }
        });

        // Retour depuis un article
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.navigateToSection('articles');
            });
        }
    }

    setupRouter() {
        // Écouter les changements d'URL
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });
    }

    handleInitialRoute() {
        this.handleRoute();
    }

    handleRoute() {
        const hash = window.location.hash.slice(1); // Enlever le #

        if (hash) {
            if (hash.startsWith('article/')) {
                const normalizedSlug = hash.replace('article/', '');
                // Validation et décodage sécurisé
                try {
                    const decodedSlug = decodeURIComponent(normalizedSlug);
                    if (this.isValidSlug(decodedSlug)) {
                        const article = this.findArticleByNormalizedSlug(normalizedSlug);
                        if (article) {
                            this.showArticle(article.slug);
                        } else {
                            this.showArticle(decodedSlug);
                        }
                    } else {
                        console.warn('❌ Slug invalide dans l\'URL:', normalizedSlug);
                        this.navigateToSection('home');
                    }
                } catch (error) {
                    console.error('❌ Erreur de décodage URL:', error);
                    this.navigateToSection('home');
                }
            } else if (hash.startsWith('tag/')) {
                const normalizedTag = hash.replace('tag/', '');
                try {
                    const decodedTag = decodeURIComponent(normalizedTag);
                    const originalTag = this.findOriginalTag(normalizedTag);
                    if (originalTag) {
                        this.filterByTag(originalTag);
                    } else if (decodedTag && decodedTag.length < 50) { // Limite de longueur
                        this.filterByTag(decodedTag);
                    } else {
                        console.warn('❌ Tag invalide dans l\'URL:', normalizedTag);
                        this.navigateToSection('articles');
                    }
                } catch (error) {
                    console.error('❌ Erreur de décodage tag:', error);
                    this.navigateToSection('articles');
                }
                this.showSection('articles');
                this.updateActiveNav(document.querySelector('[data-section="articles"]'));
            } else if (hash.startsWith('series/')) {
                const normalizedSeries = hash.replace('series/', '');
                try {
                    const decodedSeries = decodeURIComponent(normalizedSeries);
                    const originalSeries = this.findOriginalSeries(normalizedSeries);
                    if (originalSeries) {
                        this.filterBySeries(originalSeries);
                    } else if (decodedSeries && decodedSeries.length < 100) { // Limite de longueur
                        this.filterBySeries(decodedSeries);
                    } else {
                        console.warn('❌ Série invalide dans l\'URL:', normalizedSeries);
                        this.navigateToSection('articles');
                    }
                } catch (error) {
                    console.error('❌ Erreur de décodage série:', error);
                    this.navigateToSection('articles');
                }
            } else {
                // Validation des sections autorisées
                const allowedSections = ['home', 'articles', 'about'];
                if (allowedSections.includes(hash)) {
                    this.showSection(hash);
                    this.updateActiveNav(document.querySelector(`[data-section="${hash}"]`));
                } else {
                    console.warn('❌ Section non autorisée:', hash);
                    this.navigateToSection('home');
                }
            }
        } else {
            // Route par défaut
            this.showSection('home');
            this.updateActiveNav(document.querySelector('[data-section="home"]'));
        }
    }

    navigateToSection(section) {
        window.location.hash = section;
        this.showSection(section);
        this.updateActiveNav(document.querySelector(`[data-section="${section}"]`));
        
        // Réinitialiser le titre si on va à la section articles
        if (section === 'articles') {
            this.currentTag = 'all';
            this.filteredArticles = [...this.articles];
            this.renderAllArticles();
            this.updateArticlesSectionTitle();
        }
    }

    navigateToArticle(slug) {
        const normalizedSlug = this.normalizeUrl(slug);
        window.location.hash = `article/${normalizedSlug}`;
        this.showArticle(slug);
    }

    navigateToTag(tag) {
        const normalizedTag = this.normalizeUrl(tag);
        window.location.hash = `tag/${normalizedTag}`;
        this.filterByTag(tag);
        this.updateActiveFilter(document.querySelector(`[data-tag="${encodeURIComponent(tag)}"]`));
    }

    navigateToSeries(series) {
        const normalizedSeries = this.normalizeUrl(series);
        window.location.hash = `series/${normalizedSeries}`;
        this.filterBySeries(series);
        this.showSection('articles');
        this.updateActiveNav(document.querySelector('[data-section="articles"]'));
    }

    filterBySeries(series) {
        this.currentTag = 'all';
        this.filteredArticles = this.articles.filter(article =>
            article.series === series
        );
        this.renderAllArticles();
        this.updateArticlesSectionTitle('all', series);

        // Tracking Google Analytics pour le filtre par série
        if (window.analytics) {
            window.analytics.trackSeriesFilter(series);
        }
    }

    showSection(sectionId) {
        // Cacher toutes les sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Afficher la section demandée
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Tracking Google Analytics
        if (window.analytics) {
            const pageTitle = this.getSectionTitle(sectionId);
            window.analytics.trackPageView(`/${sectionId}`, pageTitle);
        }
    }

    updateActiveNav(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    async renderRecentArticles() {
        const container = document.getElementById('recent-articles-container');
        const recentArticles = this.articles.slice(0, 3);

        if (recentArticles.length === 0) {
            container.innerHTML = '<p class="loading">Aucun article disponible pour le moment 🐙</p>';
            return;
        }

        const cards = await Promise.all(
            recentArticles.map(article => this.createArticleCard(article))
        );
        container.innerHTML = cards.join('');

        this.attachArticleCardListeners();
    }

    async renderAllArticles() {
        const container = document.getElementById('articles-container');

        if (this.filteredArticles.length === 0) {
            container.innerHTML = '<p class="loading">Aucun article trouvé pour ce filtre</p>';
            return;
        }

        // Ajouter un compteur en mode drafts
        let counterHtml = '';
        if (this.isDrafts) {
            const publishedCount = this.filteredArticles.filter(article => !article.isDraft && !article.isScheduled).length;
            const scheduledCount = this.filteredArticles.filter(article => article.isScheduled).length;
            const draftCount = this.filteredArticles.filter(article => article.isDraft).length;
            const totalCount = this.filteredArticles.length;
            
            let counters = [];
            if (publishedCount > 0) counters.push(`<span class="published-count">${publishedCount} publiés</span>`);
            if (scheduledCount > 0) counters.push(`<span class="scheduled-count">${scheduledCount} programmés</span>`);
            if (draftCount > 0) counters.push(`<span class="draft-count">${draftCount} brouillons</span>`);
            counters.push(`<span>${totalCount} total</span>`);
            
            counterHtml = `
                <div class="articles-count drafts-mode">
                    ${counters.join(' • ')}
                </div>
            `;
        }

        const cards = await Promise.all(
            this.filteredArticles.map(article => this.createArticleCard(article))
        );
        container.innerHTML = counterHtml + cards.join('');

        this.attachArticleCardListeners();
    }

    async getCoverHtml(url) {
        if (!url) return false;
        
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    async createArticleCard(article) {
        const formattedDate = this.formatDate(article.date);
        const safeTitle = this.escapeHtml(article.title || 'Article sans titre');
        const safeExcerpt = this.escapeHtml(article.excerpt || 'Pas d\'aperçu disponible...');
        
        const tagsHtml = (article.tags || []).map(tag => {
            const safeTag = this.escapeHtml(tag);
            return `<span class="tag" data-tag="${encodeURIComponent(tag)}">${safeTag}</span>`;
        }).join('');
    
        const seriesHtml = article.series ?
            `<div class="article-series">
                <span class="series-badge" data-series="${encodeURIComponent(article.series)}">📚 ${this.escapeHtml(article.series)}</span>
            </div>` : '';
    
        // Indicateurs de statut
        let statusIndicator = '';
        let cardClass = 'article-card';
        
        if (article.isDraft) {
            statusIndicator = `<div class="draft-indicator">
                <span class="draft-badge">🚧 Brouillon</span>
            </div>`;
            cardClass = 'article-card draft-card';
        } else if (article.isScheduled) {
            statusIndicator = `<div class="scheduled-indicator">
                <span class="scheduled-badge">⏰ Programmé</span>
            </div>`;
            cardClass = 'article-card scheduled-card';
        }
    
        const hasCover = await this.getCoverHtml(article.image_cover);
        const cover = hasCover ? `<div class="article-cover"><img src="${this.escapeHtml(article.image_cover)}" alt="${safeTitle}" /></div>` : '';
    
        const safeSlug = this.isValidSlug(article.slug) ? article.slug : '';
        
        return `
            <div class="${cardClass}" data-slug="${encodeURIComponent(safeSlug)}">
                ${statusIndicator}
                ${seriesHtml}
                ${cover}
                <h3 class="article-title">${safeTitle}</h3>
                <p class="article-excerpt">${safeExcerpt.replace(/\n/g, '<br>')}</p>
                <div class="article-meta">
                    <span class="article-date">${this.escapeHtml(formattedDate)}</span>
                </div>
            </div>
        `;
    }

    attachArticleCardListeners() {
        document.querySelectorAll('.article-card').forEach(card => {
            card.addEventListener('click', () => {
                try {
                    const encodedSlug = card.getAttribute('data-slug');
                    if (encodedSlug) {
                        const slug = decodeURIComponent(encodedSlug);
                        if (this.isValidSlug(slug)) {
                            this.navigateToArticle(slug);
                        } else {
                            console.warn('❌ Slug invalide dans la carte:', slug);
                        }
                    }
                } catch (error) {
                    console.error('❌ Erreur lors du clic sur la carte:', error);
                }
            });
        });
    }

    showArticle(slug) {
        // Validation du slug
        if (!this.isValidSlug(slug)) {
            console.error('❌ Slug invalide:', slug);
            this.navigateToSection('home');
            return;
        }

        const article = this.articles.find(a => a.slug === slug);
        if (!article) {
            console.error('❌ Article non trouvé:', slug);
            // Rediriger vers la page d'accueil si l'article n'existe pas
            this.navigateToSection('home');
            return;
        }

        const container = document.getElementById('article-content');
        const formattedDate = this.formatDate(article.date);
        const safeTitle = this.escapeHtml(article.title || 'Article sans titre');
        
        const tagsHtml = (article.tags || []).map(tag => {
            const safeTag = this.escapeHtml(tag);
            return `<span class="tag" data-tag="${encodeURIComponent(tag)}">${safeTag}</span>`;
        }).join('');

        const seriesHtml = article.series ?
            `<span class="series-badge-large" data-series="${encodeURIComponent(article.series)}">📚 Série : ${this.escapeHtml(article.series)}</span>` : '';

        const draftHeaderIndicator = article.isDraft ?
            `<div class="article-draft-header">
                <span class="draft-badge-large">🚧 Article non publié</span>
            </div>` : '';

        // Créer les éléments de manière sécurisée
        container.innerHTML = '';
        
        // Ajouter l'indicateur de statut si nécessaire
        if (article.isDraft) {
            const draftDiv = document.createElement('div');
            draftDiv.className = 'article-draft-header';
            draftDiv.innerHTML = '<span class="draft-badge-large">🚧 Article non publié</span>';
            container.appendChild(draftDiv);
        } else if (article.isScheduled) {
            const scheduledDiv = document.createElement('div');
            scheduledDiv.className = 'article-scheduled-header';
            scheduledDiv.innerHTML = '<span class="scheduled-badge-large">⏰ Article programmé</span>';
            container.appendChild(scheduledDiv);
        }

        const headerDiv = document.createElement('header');
        headerDiv.className = 'article-header';
        
        const titleH1 = document.createElement('h1');
        titleH1.textContent = article.title || 'Article sans titre';
        headerDiv.appendChild(titleH1);

        const metaDiv = document.createElement('div');
        metaDiv.className = 'article-meta';
        
        const dateSpan = document.createElement('span');
        dateSpan.className = 'article-date';
        dateSpan.textContent = formattedDate;
        metaDiv.appendChild(dateSpan);

        if (article.series) {
            const seriesSpan = document.createElement('span');
            seriesSpan.className = 'series-badge-large';
            seriesSpan.setAttribute('data-series', encodeURIComponent(article.series));
            seriesSpan.textContent = `📚 Série : ${article.series}`;
            metaDiv.appendChild(seriesSpan);
        }

        const tagsDiv = document.createElement('div');
        tagsDiv.className = 'article-tags';
        (article.tags || []).forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'tag';
            tagSpan.setAttribute('data-tag', encodeURIComponent(tag));
            tagSpan.textContent = tag;
            tagsDiv.appendChild(tagSpan);
        });
        metaDiv.appendChild(tagsDiv);
        
        headerDiv.appendChild(metaDiv);
        container.appendChild(headerDiv);

        const bodyDiv = document.createElement('div');
        bodyDiv.className = 'article-body';
        // Le contenu Markdown est déjà traité par marked.js qui échappe le HTML
        bodyDiv.innerHTML = article.content || '<p>Contenu indisponible</p>';
        container.appendChild(bodyDiv);

        this.showSection('article-detail');
        window.scrollTo({ top: 0 });

        // Tracking Google Analytics pour l'article
        if (window.analytics) {
            window.analytics.trackPageView(`/article/${slug}`, article.title);
            window.analytics.trackArticleReading(article.title, article.reading_time);
        }
    }

    renderTagFilters() {
        const tagsContainer = document.getElementById('tag-filters');
        const seriesContainer = document.getElementById('series-filters');
        const allTags = [...new Set(this.articles.flatMap(article => article.tags || []))];
        const allSeries = [...new Set(this.articles.map(article => article.series).filter(Boolean))];

        // Vider les conteneurs
        tagsContainer.innerHTML = '';
        seriesContainer.innerHTML = '';

        // Générer les filtres de séries de manière sécurisée
        if (allSeries.length > 0) {
            allSeries.forEach(series => {
                const button = document.createElement('button');
                button.className = 'filter-btn series-filter';
                button.setAttribute('data-series', encodeURIComponent(series));
                button.textContent = series;
                seriesContainer.appendChild(button);
            });
        } else {
            const p = document.createElement('p');
            p.className = 'no-filters';
            p.textContent = 'Aucune série disponible';
            seriesContainer.appendChild(p);
        }

        // Générer les filtres de tags de manière sécurisée
        if (allTags.length > 0) {
            allTags.forEach(tag => {
                const button = document.createElement('button');
                button.className = 'filter-btn';
                button.setAttribute('data-tag', encodeURIComponent(tag));
                button.textContent = tag;
                tagsContainer.appendChild(button);
            });
        } else {
            const p = document.createElement('p');
            p.className = 'no-filters';
            p.textContent = 'Aucun tag disponible';
            tagsContainer.appendChild(p);
        }
    }

    filterByTag(tag) {
        this.currentTag = tag;

        if (tag === 'all') {
            this.filteredArticles = [...this.articles];
        } else {
            this.filteredArticles = this.articles.filter(article =>
                article.tags && article.tags.includes(tag)
            );
        }

        this.renderAllArticles();
        this.updateArticlesSectionTitle(tag);

        // Tracking Google Analytics pour le filtre par tag
        if (window.analytics && tag !== 'all') {
            window.analytics.trackTagFilter(tag);
        }
    }

    updateActiveFilter(activeBtn) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    formatDate(dateString) {
        if (!dateString) return 'Date inconnue';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }) + ' à ' + date.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.warn('⚠️  Format de date invalide:', dateString);
            return 'Date invalide';
        }
    }

    showError(message) {
        const container = document.getElementById('articles-container');
        container.innerHTML = '';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.style.cssText = 'text-align: center; padding: 2rem; color: var(--accent-red);';
        
        const h3 = document.createElement('h3');
        h3.textContent = '❌ Erreur';
        errorDiv.appendChild(h3);
        
        const p = document.createElement('p');
        p.textContent = this.escapeHtml(message);
        errorDiv.appendChild(p);
        
        container.appendChild(errorDiv);
    }

    /**
     * Retourne le titre de la section pour Google Analytics
     */
    getSectionTitle(sectionId) {
        const titles = {
            'home': 'Accueil - Bastou Blog',
            'articles': 'Articles - Bastou Blog',
            'about': 'À propos - Bastou Blog',
            'article-detail': 'Article - Bastou Blog'
        };
        return titles[sectionId] || `${sectionId} - Bastou Blog`;
    }

    /**
     * Configure le tracking des liens externes
     */
    setupExternalLinkTracking() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href) {
                const url = new URL(link.href, window.location.origin);
                
                // Vérifier si c'est un lien externe
                if (url.hostname !== window.location.hostname) {
                    if (window.analytics) {
                        window.analytics.trackExternalLink(link.href, link.textContent.trim());
                    }
                }
            }
        });
    }

    /**
     * Initialise les effets visuels du hero
     */
    setupHeroEffects() {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            // Effet de typing au chargement de la page
            setTimeout(() => {
                heroTitle.classList.add('typing');
                setTimeout(() => {
                    heroTitle.classList.remove('typing');
                }, 3000);
            }, 500);
        }
    }

    /**
     * Affiche l'indicateur de mode drafts si nécessaire
     */
    showDraftsIndicator() {
        if (this.isDrafts) {
            // Créer l'indicateur s'il n'existe pas déjà
            let indicator = document.getElementById('drafts-indicator');
            if (!indicator) {
                indicator = document.createElement('div');
                indicator.id = 'drafts-indicator';
                indicator.className = 'drafts-indicator';
                
                const content = document.createElement('div');
                content.className = 'drafts-indicator-content';
                
                const icon = document.createElement('span');
                icon.className = 'drafts-icon';
                icon.textContent = '🚧';
                content.appendChild(icon);
                
                const text = document.createElement('span');
                text.className = 'drafts-text';
                text.textContent = 'Mode Drafts - Tous les articles sont visibles';
                content.appendChild(text);
                
                const env = document.createElement('span');
                env.className = 'drafts-env';
                env.textContent = window.location.hostname;
                content.appendChild(env);
                
                indicator.appendChild(content);
                
                // Insérer au début du body
                document.body.insertBefore(indicator, document.body.firstChild);
            }
        }
    }

    /**
     * Met à jour le titre de la section articles selon le filtre actif
     */
    updateArticlesSectionTitle(tag = 'all', series = null) {
        const articlesTitle = document.querySelector('#articles h2');
        if (!articlesTitle) return;

        let title = 'Tous les articles';
        
        if (series) {
            title = `Articles de la série : ${series}`;
        } else if (tag && tag !== 'all') {
            title = `Articles avec le tag : ${tag}`;
        }

        // Ajouter l'indication du mode drafts si nécessaire
        if (this.isDrafts && (series || (tag && tag !== 'all'))) {
            title += ' (mode drafts)';
        }

        articlesTitle.textContent = title;
    }
}

// Initialisation du blog au chargement de la page
let blog;
document.addEventListener('DOMContentLoaded', () => {
    blog = new Blog();
});
