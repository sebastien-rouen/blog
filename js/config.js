/**
 * Configuration du blog Bastou
 * Centralisé pour faciliter la maintenance
 */

const BLOG_CONFIG = {
    // Google Analytics
    analytics: {
        // Remplacez 'GA_MEASUREMENT_ID' par votre vrai ID Google Analytics (format: G-XXXXXXXXXX)
        measurementId: 'G-CG8PVE02BX',
        
        // Désactiver en mode debug/localhost
        enableInDebug: false,
        
        // Événements personnalisés à tracker
        events: {
            articleRead: true,
            externalLinks: true,
            tagFilters: true,
            seriesFilters: true,
            downloads: true
        }
    },

    // Configuration du blog
    blog: {
        title: 'Blog de Bastou - Les aventures d\'un coach Agile',
        description: 'Aventures d\'une pieuvre multitâche dans l\'univers du code',
        author: 'Sébastien "Bastou" ROUEN',
        url: 'https://blog.bastou.dev'
    },

    // Réseaux sociaux
    social: {
        linkedin: 'https://www.linkedin.com/in/sebastien-rouen/',
        buyMeACoffee: 'https://buymeacoffee.com/sebastien.rouen'
    }
};

// Export global pour compatibilité
window.BLOG_CONFIG = BLOG_CONFIG;