class Blog {
    constructor() {
        this.articles = [];
        this.filteredArticles = [];
        this.allArticles = []; // Tous les articles, même non publiés
        this.currentTag = 'all';
        this.debugMode = this.isDebugMode();
        this.init();
    }

    // Fonction pour normaliser les URLs (minuscules, sans accents, espaces remplacés par des tirets)
    normalizeUrl(str) {
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
            .replace(/[^a-z0-9\s-]/g, '') // Garder seulement lettres, chiffres, espaces et tirets
            .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
            .replace(/-+/g, '-') // Remplacer les tirets multiples par un seul
            .replace(/^-|-$/g, ''); // Supprimer les tirets en début et fin
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
        // Active le mode debug si on est en localhost ou avec le paramètre ?debug=true
        return window.location.hostname === 'localhost' ||
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

            // Charger chaque article
            const articlePromises = config.articles.map(async (articleConfig) => {
                try {
                    const response = await fetch(`./articles/${articleConfig.file}`);
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
            if (this.debugMode) {
                console.log('🔧 Mode debug activé - Affichage de tous les articles');
                this.articles = validArticles;
                // Ajouter une indication visuelle pour les articles non publiés
                this.articles.forEach(article => {
                    if (!this.isArticlePublished(article)) {
                        article.isDraft = true;
                    }
                });
            } else {
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

        // Si published est true ou non défini, vérifier la date et l'heure
        if (article.date) {
            const articleDate = new Date(article.date);

            // Comparer la date et l'heure complètes
            if (articleDate > now) {
                return false;
            }
        }

        return true;
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
        const path = window.location.pathname;
        const hash = window.location.hash.slice(1); // Enlever le #

        if (hash) {
            if (hash.startsWith('article/')) {
                const normalizedSlug = hash.replace('article/', '');
                const article = this.findArticleByNormalizedSlug(normalizedSlug);
                if (article) {
                    this.showArticle(article.slug);
                } else {
                    // Fallback pour les anciennes URLs
                    const slug = decodeURIComponent(normalizedSlug);
                    this.showArticle(slug);
                }
            } else if (hash.startsWith('tag/')) {
                const normalizedTag = hash.replace('tag/', '');
                const originalTag = this.findOriginalTag(normalizedTag);
                if (originalTag) {
                    this.filterByTag(originalTag);
                } else {
                    // Fallback pour les anciennes URLs
                    const tag = decodeURIComponent(normalizedTag);
                    this.filterByTag(tag);
                }
                this.showSection('articles');
                this.updateActiveNav(document.querySelector('[data-section="articles"]'));
            } else if (hash.startsWith('series/')) {
                const normalizedSeries = hash.replace('series/', '');
                const originalSeries = this.findOriginalSeries(normalizedSeries);
                if (originalSeries) {
                    this.filterBySeries(originalSeries);
                } else {
                    // Fallback pour les anciennes URLs
                    const series = decodeURIComponent(normalizedSeries);
                    this.filterBySeries(series);
                }
            } else {
                this.showSection(hash);
                this.updateActiveNav(document.querySelector(`[data-section="${hash}"]`));
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

        // Mettre à jour le titre de la section
        const articlesTitle = document.querySelector('#articles h2');
        if (articlesTitle) {
            articlesTitle.textContent = `Articles de la série : ${series}`;
        }

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

        const cards = await Promise.all(
            this.filteredArticles.map(article => this.createArticleCard(article))
        );
        container.innerHTML = cards.join('');

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
        const tagsHtml = (article.tags || []).map(tag =>
            `<span class="tag" data-tag="${encodeURIComponent(tag)}">${tag}</span>`
        ).join('');
    
        const seriesHtml = article.series ?
            `<div class="article-series">
                <span class="series-badge" data-series="${encodeURIComponent(article.series)}">📚 ${article.series}</span>
            </div>` : '';
    
        const draftIndicator = article.isDraft ?
            `<div class="draft-indicator">
                <span class="draft-badge">🚧 Brouillon</span>
            </div>` : '';
    
        const hasCover = await this.getCoverHtml(article.image_cover);
        const cover = hasCover ? `<div class="article-cover"><img src="${article.image_cover}" alt="${article.title}" /></div>` : '';
    
        const cardClass = article.isDraft ? 'article-card draft-card' : 'article-card';
    
        return `
            <div class="${cardClass}" data-slug="${encodeURIComponent(article.slug)}">
                ${draftIndicator}
                ${seriesHtml}
                <h3 class="article-title">${article.title || 'Article sans titre'}</h3>
                ${cover}
                <p class="article-excerpt">${article.excerpt || 'Pas d\'aperçu disponible...'}</p>
                <div class="article-meta">
                    <span class="article-date">${formattedDate}</span>
                    <div class="article-tags">${tagsHtml}</div>
                </div>
            </div>
        `;
    }

    attachArticleCardListeners() {
        document.querySelectorAll('.article-card').forEach(card => {
            card.addEventListener('click', () => {
                const slug = decodeURIComponent(card.getAttribute('data-slug'));
                this.navigateToArticle(slug);
            });
        });
    }

    showArticle(slug) {
        const article = this.articles.find(a => a.slug === slug);
        if (!article) {
            console.error('❌ Article non trouvé:', slug);
            // Rediriger vers la page d'accueil si l'article n'existe pas
            this.navigateToSection('home');
            return;
        }

        const container = document.getElementById('article-content');
        const formattedDate = this.formatDate(article.date);
        const tagsHtml = (article.tags || []).map(tag =>
            `<span class="tag" data-tag="${encodeURIComponent(tag)}">${tag}</span>`
        ).join('');

        const seriesHtml = article.series ?
            `<span class="series-badge-large" data-series="${encodeURIComponent(article.series)}">📚 Série : ${article.series}</span>` : '';

        container.innerHTML = `
            <header class="article-header">
                <h1>${article.title || 'Article sans titre'}</h1>
                <div class="article-meta">
                    <span class="article-date">${formattedDate}</span>
                    ${seriesHtml}
                    <div class="article-tags">${tagsHtml}</div>
                </div>
            </header>
            <div class="article-body">
                ${article.content || '<p>Contenu indisponible</p>'}
            </div>
        `;

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

        // Générer les filtres de séries
        let seriesHtml = '';
        if (allSeries.length > 0) {
            seriesHtml = allSeries.map(series =>
                `<button class="filter-btn series-filter" data-series="${encodeURIComponent(series)}">${series}</button>`
            ).join('');
        } else {
            seriesHtml = '<p class="no-filters">Aucune série disponible</p>';
        }

        // Générer les filtres de tags
        let tagsHtml = '';
        if (allTags.length > 0) {
            tagsHtml = allTags.map(tag =>
                `<button class="filter-btn" data-tag="${encodeURIComponent(tag)}">${tag}</button>`
            ).join('');
        } else {
            tagsHtml = '<p class="no-filters">Aucun tag disponible</p>';
        }

        seriesContainer.innerHTML = seriesHtml;
        tagsContainer.innerHTML = tagsHtml;
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
        container.innerHTML = `
            <div class="error" style="text-align: center; padding: 2rem; color: var(--accent-red);">
                <h3>❌ Erreur</h3>
                <p>${message}</p>
            </div>
        `;
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
}

// Initialisation du blog au chargement de la page
let blog;
document.addEventListener('DOMContentLoaded', () => {
    blog = new Blog();
});
