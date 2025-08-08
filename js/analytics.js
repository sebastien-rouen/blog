/**
 * Configuration et utilitaires Google Analytics pour le blog Bastou
 * Gère le suivi des pages virtuelles pour une SPA (Single Page Application)
 */

class Analytics {
    constructor() {
        this.isEnabled = this.checkAnalyticsEnabled();
        this.measurementId = this.getMeasurementId();
        
        if (this.isEnabled && this.measurementId) {
            console.log('📊 Google Analytics activé');
        }
    }

    /**
     * Vérifie si Google Analytics est activé
     * Désactivé en mode debug/localhost pour éviter de polluer les stats
     */
    checkAnalyticsEnabled() {
        // Désactiver en mode debug ou localhost
        const isLocalhost = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1';
        const isDebug = new URLSearchParams(window.location.search).get('debug') === 'true';
        
        return !isLocalhost && !isDebug && typeof gtag !== 'undefined';
    }

    /**
     * Récupère l'ID de mesure depuis la configuration ou le script Google Analytics
     */
    getMeasurementId() {
        // Priorité à la configuration
        if (window.BLOG_CONFIG && window.BLOG_CONFIG.analytics.measurementId !== 'GA_MEASUREMENT_ID') {
            return window.BLOG_CONFIG.analytics.measurementId;
        }

        // Fallback : récupérer depuis le script
        const scripts = document.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]');
        if (scripts.length > 0) {
            const src = scripts[0].src;
            const match = src.match(/id=([^&]+)/);
            return match ? match[1] : null;
        }
        return null;
    }

    /**
     * Envoie un événement de page vue virtuelle
     * @param {string} pagePath - Chemin de la page (ex: '/articles', '/article/mon-article')
     * @param {string} pageTitle - Titre de la page
     */
    trackPageView(pagePath, pageTitle = '') {
        if (!this.isEnabled) return;

        try {
            gtag('config', this.measurementId, {
                page_path: pagePath,
                page_title: pageTitle || document.title
            });
        } catch (error) {
            console.warn('Erreur lors du tracking de page:', error);
        }
    }

    /**
     * Envoie un événement personnalisé
     * @param {string} eventName - Nom de l'événement
     * @param {object} parameters - Paramètres de l'événement
     */
    trackEvent(eventName, parameters = {}) {
        if (!this.isEnabled) return;

        try {
            gtag('event', eventName, parameters);
        } catch (error) {
            console.warn('Erreur lors du tracking d\'événement:', error);
        }
    }

    /**
     * Track les clics sur les liens externes
     * @param {string} url - URL du lien externe
     * @param {string} linkText - Texte du lien
     */
    trackExternalLink(url, linkText = '') {
        this.trackEvent('click', {
            event_category: 'external_link',
            event_label: url,
            link_text: linkText
        });
    }

    /**
     * Track les téléchargements de fichiers
     * @param {string} fileName - Nom du fichier téléchargé
     */
    trackDownload(fileName) {
        this.trackEvent('file_download', {
            event_category: 'download',
            event_label: fileName
        });
    }

    /**
     * Track la lecture d'articles (temps passé)
     * @param {string} articleTitle - Titre de l'article
     * @param {number} readingTime - Temps de lecture estimé
     */
    trackArticleReading(articleTitle, readingTime = 0) {
        this.trackEvent('article_read', {
            event_category: 'engagement',
            event_label: articleTitle,
            reading_time: readingTime
        });
    }

    /**
     * Track les recherches par tag
     * @param {string} tag - Tag recherché
     */
    trackTagFilter(tag) {
        this.trackEvent('filter_by_tag', {
            event_category: 'navigation',
            event_label: tag
        });
    }

    /**
     * Track les recherches par série
     * @param {string} series - Série recherchée
     */
    trackSeriesFilter(series) {
        this.trackEvent('filter_by_series', {
            event_category: 'navigation',
            event_label: series
        });
    }
}

// Instance globale
window.analytics = new Analytics();