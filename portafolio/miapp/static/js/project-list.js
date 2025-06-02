/**
 * Project List Enhanced JavaScript
 * Manages filtering, searching, view toggling, and user interactions
 */

class ProjectListManager {
    constructor() {
        // Configuration
        this.config = {
            searchDelay: 300,
            animationDuration: 300,
            debounceDelay: 250,
            maxRetries: 3
        };

        // State management
        this.state = {
            currentView: 'grid',
            isLoading: false,
            searchTimeout: null,
            filters: {
                category: null,
                keyword: null
            }
        };

        // DOM elements cache
        this.elements = {};
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    /**
     * Initialize the application
     */
    init() {
        this.cacheElements();
        this.bindEvents();
        this.restoreUserPreferences();
        this.initializePlugins();
        this.setupAccessibility();
        this.logInitialization();
    }

    /**
     * Cache frequently used DOM elements
     */
    cacheElements() {
        this.elements = {
            // Forms and inputs
            filterForm: document.getElementById('filterForm'),
            categoriaSelect: document.getElementById('categoria'),
            keywordInput: document.getElementById('keyword'),
            clearSearchBtn: document.getElementById('clearSearch'),
            clearAllFiltersBtn: document.getElementById('clearAllFilters'),

            // View controls
            gridViewBtn: document.getElementById('gridView'),
            listViewBtn: document.getElementById('listView'),
            projectsContainer: document.getElementById('projectsContainer'),

            // Filter display
            activeFilters: document.getElementById('activeFilters'),
            removeFilterBtns: document.querySelectorAll('.remove-filter'),

            // Loading
            loadingOverlay: document.getElementById('loadingOverlay'),

            // Projects
            projectCards: document.querySelectorAll('.project-card'),
            paginationLinks: document.querySelectorAll('.pagination .page-link'),

            // Images
            lazyImages: document.querySelectorAll('img[loading="lazy"]')
        };
    }

    /**
     * Bind all event listeners
     */
    bindEvents() {
        // Form events
        this.bindFormEvents();
        
        // View toggle events
        this.bindViewToggleEvents();
        
        // Filter events
        this.bindFilterEvents();
        
        // Navigation events
        this.bindNavigationEvents();
        
        // Keyboard events
        this.bindKeyboardEvents();
        
        // Project card events
        this.bindProjectCardEvents();
        
        // Window events
        this.bindWindowEvents();
    }

    /**
     * Bind form-related events
     */
    bindFormEvents() {
        if (this.elements.filterForm) {
            this.elements.filterForm.addEventListener('submit', (e) => {
                this.handleFormSubmit(e);
            });
        }

        if (this.elements.categoriaSelect) {
            this.elements.categoriaSelect.addEventListener('change', 
                this.debounce(() => this.handleCategoryChange(), this.config.debounceDelay)
            );
        }

        if (this.elements.keywordInput) {
            this.elements.keywordInput.addEventListener('input', 
                this.debounce((e) => this.handleSearchInput(e), this.config.searchDelay)
            );

            this.elements.keywordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleFormSubmit(e);
                }
            });
        }

        if (this.elements.clearSearchBtn) {
            this.elements.clearSearchBtn.addEventListener('click', () => {
                this.clearSearch();
            });
        }

        if (this.elements.clearAllFiltersBtn) {
            this.elements.clearAllFiltersBtn.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }
    }

    /**
     * Bind view toggle events
     */
    bindViewToggleEvents() {
        if (this.elements.gridViewBtn) {
            this.elements.gridViewBtn.addEventListener('click', () => {
                this.setView('grid');
            });
        }

        if (this.elements.listViewBtn) {
            this.elements.listViewBtn.addEventListener('click', () => {
                this.setView('list');
            });
        }
    }

    /**
     * Bind filter-related events
     */
    bindFilterEvents() {
        this.elements.removeFilterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.removeFilter(e.target.dataset.filter);
            });
        });
    }

    /**
     * Bind navigation events
     */
    bindNavigationEvents() {
        this.elements.paginationLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handlePaginationClick(e);
            });
        });
    }

    /**
     * Bind keyboard shortcuts
     */
    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    /**
     * Bind project card events
     */
    bindProjectCardEvents() {
        this.elements.projectCards.forEach(card => {
            this.setupProjectCard(card);
        });
    }

    /**
     * Bind window events
     */
    bindWindowEvents() {
        // Save scroll position before page unload
        window.addEventListener('beforeunload', () => {
            this.saveScrollPosition();
        });

        // Handle resize events
        window.addEventListener('resize', 
            this.debounce(() => this.handleResize(), this.config.debounceDelay)
        );

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
    }

    /**
     * Handle form submission
     */
    handleFormSubmit(e) {
        const keyword = this.elements.keywordInput?.value.trim();
        const categoria = this.elements.categoriaSelect?.value;

        // If no filters applied, redirect to clean URL
        if (!keyword && !categoria) {
            e.preventDefault();
            this.clearAllFilters();
            return;
        }

        // Show loading state
        this.showLoading();
        
        // Track form submission
        this.trackEvent('filter_search', {
            keyword: keyword || null,
            category: categoria || null
        });
    }

    /**
     * Handle category select change
     */
    handleCategoryChange() {
        if (this.elements.categoriaSelect) {
            const selectedValue = this.elements.categoriaSelect.value;
            
            if (selectedValue) {
                this.trackEvent('filter_category_changed', {
                    category: this.elements.categoriaSelect.options[this.elements.categoriaSelect.selectedIndex].text
                });
            }

            // Auto-submit form
            this.elements.filterForm?.submit();
        }
    }

    /**
     * Handle search input with suggestions
     */
    handleSearchInput(e) {
        const query = e.target.value.trim();
        
        // Show/hide clear button
        this.toggleClearButton(query.length > 0);
        
        // Show search suggestions if needed
        if (query.length > 2) {
            this.showSearchSuggestions(query);
        } else {
            this.hideSearchSuggestions();
        }
    }

    /**
     * Clear search input
     */
    clearSearch() {
        if (this.elements.keywordInput) {
            this.elements.keywordInput.value = '';
            this.elements.keywordInput.focus();
            this.toggleClearButton(false);
            this.hideSearchSuggestions();
        }
    }

    /**
     * Clear all filters and redirect
     */
    clearAllFilters() {
        // Get the clean project list URL from Django
        const projectListUrl = this.elements.clearAllFiltersBtn?.getAttribute('href') || 
                              '/proyectos/'; // fallback URL
        
        this.showLoading();
        window.location.href = projectListUrl;
    }

    /**
     * Remove individual filter
     */
    removeFilter(filterType) {
        const url = new URL(window.location);
        
        switch (filterType) {
            case 'categoria':
                url.searchParams.delete('categoria_id');
                break;
            case 'keyword':
                url.searchParams.delete('keyword');
                break;
        }
        
        this.showLoading();
        window.location.href = url.toString();
    }

    /**
     * Set view mode (grid/list)
     */
    setView(viewType) {
        if (!this.elements.projectsContainer) return;

        this.state.currentView = viewType;
        
        // Update container class
        if (viewType === 'list') {
            this.elements.projectsContainer.classList.add('list-view');
        } else {
            this.elements.projectsContainer.classList.remove('list-view');
        }

        // Update button states
        this.updateViewButtons(viewType);
        
        // Save preference
        this.saveUserPreference('projectView', viewType);
        
        // Track view change
        this.trackEvent('view_changed', { view: viewType });
    }

    /**
     * Update view toggle button states
     */
    updateViewButtons(activeView) {
        [this.elements.gridViewBtn, this.elements.listViewBtn].forEach(btn => {
            if (btn) {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            }
        });

        const activeBtn = activeView === 'grid' ? 
                         this.elements.gridViewBtn : 
                         this.elements.listViewBtn;
        
        if (activeBtn) {
            activeBtn.classList.add('active');
            activeBtn.setAttribute('aria-pressed', 'true');
        }
    }

    /**
     * Setup individual project card
     */
    setupProjectCard(card) {
        if (!card) return;

        // Add click handler for card navigation
        card.addEventListener('click', (e) => {
            this.handleProjectCardClick(e, card);
        });

        // Add hover effects
        card.addEventListener('mouseenter', () => {
            card.style.zIndex = '10';
        });

        card.addEventListener('mouseleave', () => {
            card.style.zIndex = '1';
        });

        // Setup tooltips for truncated text
        const description = card.querySelector('.project-description');
        if (description && description.scrollHeight > description.clientHeight) {
            description.title = description.textContent;
        }
    }

    /**
     * Handle project card click
     */
    handleProjectCardClick(e, card) {
        // Don't navigate if clicking on links or buttons
        if (e.target.closest('a, button, .btn')) {
            return;
        }

        const detailLink = card.querySelector('.project-link, .overlay-btn');
        if (detailLink) {
            e.preventDefault();
            
            // Track project click
            this.trackEvent('project_clicked', {
                project_id: card.dataset.projectId,
                project_title: card.querySelector('.project-title')?.textContent?.trim()
            });
            
            // Navigate to project detail
            window.location.href = detailLink.href;
        }
    }

    /**
     * Handle pagination click
     */
    handlePaginationClick(e) {
        // Add loading state to project cards
        this.elements.projectCards.forEach(card => {
            card.classList.add('loading');
        });

        this.showLoading();
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcuts(e) {
        // Focus search with Ctrl+K or Cmd+K
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.elements.keywordInput?.focus();
        }

        // Clear filters with Escape
        if (e.key === 'Escape' && this.hasActiveFilters()) {
            this.clearAllFilters();
        }

        // Toggle view with V key
        if (e.key === 'v' && !e.ctrlKey && !e.metaKey && !this.isInputFocused()) {
            e.preventDefault();
            this.toggleView();
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Adjust layouts if needed
        this.adjustLayoutForScreenSize();
    }

    /**
     * Handle visibility change (tab focus/blur)
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden - pause any ongoing operations
            this.pauseOperations();
        } else {
            // Page is visible - resume operations
            this.resumeOperations();
        }
    }

    /**
     * Show loading overlay
     */
    showLoading() {
        if (this.elements.loadingOverlay) {
            this.state.isLoading = true;
            this.elements.loadingOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Hide loading overlay
     */
    hideLoading() {
        if (this.elements.loadingOverlay) {
            this.state.isLoading = false;
            this.elements.loadingOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    /**
     * Toggle clear search button visibility
     */
    toggleClearButton(show) {
        if (this.elements.clearSearchBtn) {
            this.elements.clearSearchBtn.style.opacity = show ? '1' : '0';
        }
    }

    /**
     * Show search suggestions (placeholder for future implementation)
     */
    showSearchSuggestions(query) {
        // This could be enhanced with an AJAX call to get suggestions
        console.log('Searching for:', query);
        
        // Example implementation:
        // this.fetchSearchSuggestions(query).then(suggestions => {
        //     this.renderSuggestions(suggestions);
        // });
    }

    /**
     * Hide search suggestions
     */
    hideSearchSuggestions() {
        // Remove any suggestion dropdown
        const existingSuggestions = document.querySelector('.search-suggestions');
        if (existingSuggestions) {
            existingSuggestions.remove();
        }
    }

    /**
     * Toggle between grid and list view
     */
    toggleView() {
        const newView = this.state.currentView === 'grid' ? 'list' : 'grid';
        this.setView(newView);
    }

    /**
     * Check if any filters are active
     */
    hasActiveFilters() {
        const url = new URL(window.location);
        return url.searchParams.has('categoria_id') || url.searchParams.has('keyword');
    }

    /**
     * Check if an input is currently focused
     */
    isInputFocused() {
        const activeElement = document.activeElement;
        return activeElement && (
            activeElement.tagName === 'INPUT' || 
            activeElement.tagName === 'TEXTAREA' || 
            activeElement.tagName === 'SELECT' ||
            activeElement.contentEditable === 'true'
        );
    }

    /**
     * Adjust layout for different screen sizes
     */
    adjustLayoutForScreenSize() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile && this.state.currentView === 'list') {
            // Force grid view on mobile for better UX
            this.setView('grid');
        }
    }

    /**
     * Pause operations when page is hidden
     */
    pauseOperations() {
        // Cancel any ongoing timeouts
        if (this.state.searchTimeout) {
            clearTimeout(this.state.searchTimeout);
        }
    }

    /**
     * Resume operations when page becomes visible
     */
    resumeOperations() {
        // Resume any paused operations if needed
        console.log('Operations resumed');
    }

    /**
     * Save scroll position for back navigation
     */
    saveScrollPosition() {
        this.saveUserPreference('projectListScrollY', window.scrollY);
    }

    /**
     * Restore scroll position
     */
    restoreScrollPosition() {
        const savedScrollY = this.getUserPreference('projectListScrollY');
        if (savedScrollY && performance.navigation.type === 2) { // Back navigation
            window.scrollTo(0, parseInt(savedScrollY));
            this.removeUserPreference('projectListScrollY');
        }
    }

    /**
     * Restore user preferences
     */
    restoreUserPreferences() {
        // Restore view preference
        const savedView = this.getUserPreference('projectView');
        if (savedView && (savedView === 'list' || savedView === 'grid')) {
            this.setView(savedView);
        }

        // Restore scroll position
        this.restoreScrollPosition();
    }

    /**
     * Initialize plugins and additional features
     */
    initializePlugins() {
        this.initLazyLoading();
        this.initPerformanceMonitoring();
        this.updateFaviconWithFilterCount();
        this.initServiceWorker();
    }

    /**
     * Initialize lazy loading for images
     */
    initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                        }
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            this.elements.lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    /**
     * Initialize performance monitoring
     */
    initPerformanceMonitoring() {
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.entryType === 'largest-contentful-paint') {
                            console.log('LCP:', entry.startTime);
                            
                            // Track performance if analytics available
                            this.trackEvent('performance_lcp', {
                                value: Math.round(entry.startTime)
                            });
                        }
                    }
                });

                observer.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (error) {
                console.warn('Performance monitoring not available:', error);
            }
        }
    }

    /**
     * Update favicon with filter count
     */
    updateFaviconWithFilterCount() {
        const activeFilterCount = document.querySelectorAll('.active-filter').length;
        const currentTitle = document.title;
        
        if (activeFilterCount > 0) {
            const baseTitle = currentTitle.replace(/^\(\d+\)\s*/, '');
            document.title = `(${activeFilterCount}) ${baseTitle}`;
        }
    }

    /**
     * Initialize service worker for offline support
     */
    initServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }

    /**
     * Setup accessibility features
     */
    setupAccessibility() {
        // Add ARIA labels and roles where needed
        this.enhanceAccessibility();
        
        // Setup focus management
        this.setupFocusManagement();
        
        // Add screen reader announcements
        this.setupScreenReaderAnnouncements();
    }

    /**
     * Enhance accessibility attributes
     */
    enhanceAccessibility() {
        // Ensure all interactive elements have proper labels
        const interactiveElements = document.querySelectorAll('button, input, select, a');
        interactiveElements.forEach(element => {
            if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
                // Add appropriate aria-label based on context
                this.addAriaLabel(element);
            }
        });

        // Add live region for dynamic content updates
        this.createLiveRegion();
    }

    /**
     * Add appropriate ARIA label to element
     */
    addAriaLabel(element) {
        const text = element.textContent?.trim();
        const placeholder = element.getAttribute('placeholder');
        const title = element.getAttribute('title');
        
        const label = text || placeholder || title || 'Interactive element';
        element.setAttribute('aria-label', label);
    }

    /**
     * Create live region for screen reader announcements
     */
    createLiveRegion() {
        if (!document.getElementById('liveRegion')) {
            const liveRegion = document.createElement('div');
            liveRegion.id = 'liveRegion';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            document.body.appendChild(liveRegion);
        }
    }

    /**
     * Setup focus management
     */
    setupFocusManagement() {
        // Handle focus trapping in modals/overlays
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && this.state.isLoading) {
                // Prevent tabbing when loading overlay is active
                e.preventDefault();
            }
        });
    }

    /**
     * Setup screen reader announcements
     */
    setupScreenReaderAnnouncements() {
        // Announce when filters are applied
        const originalSubmit = this.elements.filterForm?.submit;
        if (originalSubmit) {
            this.elements.filterForm.submit = () => {
                this.announceToScreenReader('Aplicando filtros...');
                originalSubmit.call(this.elements.filterForm);
            };
        }
    }

    /**
     * Announce message to screen readers
     */
    announceToScreenReader(message) {
        const liveRegion = document.getElementById('liveRegion');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    /**
     * Save user preference to localStorage
     */
    saveUserPreference(key, value) {
        try {
            localStorage.setItem(`projectList_${key}`, JSON.stringify(value));
        } catch (error) {
            console.warn('Could not save user preference:', error);
        }
    }

    /**
     * Get user preference from localStorage
     */
    getUserPreference(key) {
        try {
            const item = localStorage.getItem(`projectList_${key}`);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.warn('Could not get user preference:', error);
            return null;
        }
    }

    /**
     * Remove user preference from localStorage
     */
    removeUserPreference(key) {
        try {
            localStorage.removeItem(`projectList_${key}`);
        } catch (error) {
            console.warn('Could not remove user preference:', error);
        }
    }

    /**
     * Track analytics events
     */
    trackEvent(eventName, properties = {}) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }

        // Alternative analytics platforms can be added here
        console.log(`Event tracked: ${eventName}`, properties);
    }

    /**
     * Debounce function to limit function calls
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function to limit function calls
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Log successful initialization
     */
    logInitialization() {
        console.log('🚀 ProjectListManager initialized successfully!');
        console.log('Features loaded:', {
            lazyLoading: 'IntersectionObserver' in window,
            performanceMonitoring: 'PerformanceObserver' in window,
            serviceWorker: 'serviceWorker' in navigator,
            localStorage: this.isLocalStorageAvailable()
        });
    }

    /**
     * Check if localStorage is available
     */
    isLocalStorageAvailable() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Error handling for failed operations
     */
    handleError(error, operation = 'Unknown operation') {
        console.error(`Error in ${operation}:`, error);
        
        // Track error
        this.trackEvent('javascript_error', {
            operation: operation,
            error: error.message,
            stack: error.stack
        });

        // Show user-friendly error message
        this.showErrorMessage('Ha ocurrido un error. Por favor, recarga la página.');
    }

    /**
     * Show error message to user
     */
    showErrorMessage(message) {
        // Create or update error notification
        let errorDiv = document.getElementById('errorNotification');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'errorNotification';
            errorDiv.className = 'alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3';
            errorDiv.style.zIndex = '9999';
            document.body.appendChild(errorDiv);
        }

        errorDiv.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-exclamation-triangle me-2"></i>
                <span>${message}</span>
                <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
            </div>
        `;

        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (errorDiv && errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
    }

    /**
     * Public API methods
     */
    getState() {
        return { ...this.state };
    }

    getCurrentFilters() {
        const url = new URL(window.location);
        return {
            category: url.searchParams.get('categoria_id'),
            keyword: url.searchParams.get('keyword')
        };
    }

    refresh() {
        window.location.reload();
    }
}

// Additional utility functions that can be used globally

/**
 * Format date for display
 */
function formatDate(dateString, locale = 'es-ES') {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'short'
        });
    } catch (error) {
        return dateString;
    }
}

/**
 * Truncate text with ellipsis
 */
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

/**
 * Generate URL with updated parameters
 */
function updateUrlParams(params) {
    const url = new URL(window.location);
    
    Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
            url.searchParams.delete(key);
        } else {
            url.searchParams.set(key, value);
        }
    });
    
    return url.toString();
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Smooth scroll to element
 */
function smoothScrollTo(element, offset = 0) {
    const elementPosition = element.offsetTop;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Initialize the application
const projectListManager = new ProjectListManager();

// Make some methods available globally for debugging
window.ProjectListManager = projectListManager;
window.projectListUtils = {
    formatDate,
    truncateText,
    updateUrlParams,
    isInViewport,
    smoothScrollTo
};