/**
 * Contact Page Simple JavaScript
 * Handles interactions and enhancements for the contact page
 */

class ContactPageManager {
    constructor() {
        this.config = {
            animationDelay: 300,
            scrollOffset: 100
        };

        this.elements = {};
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.initializeFeatures();
        this.updateAvailabilityStatus();
        console.log('🚀 Contact page loaded successfully!');
    }

    cacheElements() {
        this.elements = {
            emailLinks: document.querySelectorAll('a[href^="mailto:"]'),
            phoneLinks: document.querySelectorAll('a[href^="tel:"]'),
            socialLinks: document.querySelectorAll('.social-link'),
            quickActions: document.querySelectorAll('.quick-action'),
            ctaButtons: document.querySelectorAll('.cta-btn, .cta-button'),
            availabilityStatus: document.getElementById('availabilityStatus'),
            contactItems: document.querySelectorAll('.contact-item')
        };
    }

    bindEvents() {
        // Email link enhancements
        this.bindEmailEvents();
        
        // Social link tracking
        this.bindSocialEvents();
        
        // Quick action enhancements
        this.bindQuickActionEvents();
        
        // CTA button tracking
        this.bindCTAEvents();
        
        // Keyboard shortcuts
        this.bindKeyboardEvents();
        
        // Contact item interactions
        this.bindContactItemEvents();
    }

    bindEmailEvents() {
        this.elements.emailLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleEmailClick(e, link);
            });

            // Add copy functionality with right-click
            link.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.copyEmailToClipboard(link);
            });
        });
    }

    bindSocialEvents() {
        this.elements.socialLinks.forEach(link => {
            link.addEventListener('click', () => {
                const platform = link.dataset.platform || this.getSocialPlatform(link);
                this.trackEvent('social_click', { platform });
                this.showLinkFeedback(link, `Abriendo ${platform}...`);
            });
        });
    }

    bindQuickActionEvents() {
        this.elements.quickActions.forEach(action => {
            action.addEventListener('click', () => {
                const actionType = this.getActionType(action);
                this.trackEvent('quick_action_click', { action: actionType });
                this.showActionFeedback(action);
            });
        });
    }

    bindCTAEvents() {
        this.elements.ctaButtons.forEach(button => {
            button.addEventListener('click', () => {
                const buttonText = button.textContent.trim();
                this.trackEvent('cta_click', { button: buttonText });
            });
        });
    }

    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            // Email shortcut: Ctrl+E
            if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
                e.preventDefault();
                this.openEmailClient();
            }

            // LinkedIn shortcut: Ctrl+L
            if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
                e.preventDefault();
                this.openLinkedIn();
            }

            // Copy email: Ctrl+C when focused on email
            if ((e.ctrlKey || e.metaKey) && e.key === 'c' && document.activeElement.href?.includes('mailto:')) {
                e.preventDefault();
                this.copyEmailToClipboard(document.activeElement);
            }
        });
    }

    bindContactItemEvents() {
        this.elements.contactItems.forEach(item => {
            // Add click interaction for contact items with links
            item.addEventListener('click', () => {
                const link = item.querySelector('a');
                if (link) {
                    link.click();
                }
            });

            // Add keyboard navigation
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const link = item.querySelector('a');
                    if (link) {
                        link.click();
                    }
                }
            });

            // Make focusable
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
        });
    }

    handleEmailClick(e, link) {
        // Track email click
        this.trackEvent('email_click', { 
            email: this.extractEmailFromHref(link.href) 
        });

        // Show feedback
        this.showEmailFeedback(link);

        // Add to recent contacts (if supported)
        this.addToRecentContacts(link);
    }

    copyEmailToClipboard(link) {
        const email = this.extractEmailFromHref(link.href);
        
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(email).then(() => {
                this.showCopySuccess(link, email);
            }).catch(() => {
                this.fallbackCopy(email);
            });
        } else {
            this.fallbackCopy(email);
        }

        this.trackEvent('email_copied', { email });
    }

    showCopySuccess(element, email) {
        const originalText = element.textContent;
        element.textContent = '✓ Email copiado';
        element.style.color = 'var(--success-color)';
        
        setTimeout(() => {
            element.textContent = originalText;
            element.style.color = '';
        }, 2000);

        this.showToast(`Email copiado: ${email}`, 'success');
    }

    fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showToast(`Email copiado: ${text}`, 'success');
        } catch (err) {
            console.error('Fallback copy failed:', err);
            this.showToast('No se pudo copiar automáticamente', 'warning');
        }
        
        document.body.removeChild(textArea);
    }

    showLinkFeedback(link, message) {
        const originalTitle = link.title;
        link.title = message;
        
        setTimeout(() => {
            link.title = originalTitle;
        }, 2000);
    }

    showActionFeedback(action) {
        action.style.transform = 'scale(0.95)';
        setTimeout(() => {
            action.style.transform = '';
        }, 150);
    }

    showEmailFeedback(link) {
        const icon = link.querySelector('i');
        if (icon) {
            const originalClass = icon.className;
            icon.className = 'fas fa-check';
            
            setTimeout(() => {
                icon.className = originalClass;
            }, 1000);
        }
    }

    openEmailClient() {
        const emailLink = document.querySelector('a[href^="mailto:"]');
        if (emailLink) {
            emailLink.click();
            this.trackEvent('keyboard_email_open');
        }
    }

    openLinkedIn() {
        const linkedinLink = document.querySelector('.social-link.linkedin');
        if (linkedinLink) {
            linkedinLink.click();
            this.trackEvent('keyboard_linkedin_open');
        }
    }

    initializeFeatures() {
        this.initScrollAnimations();
        this.initTooltips();
        this.initClickEffects();
        this.preloadSocialIcons();
    }

    initScrollAnimations() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observe elements with data-aos attribute
            document.querySelectorAll('[data-aos]').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(el);
            });
        }
    }

    initTooltips() {
        // Add tooltips to social links
        this.elements.socialLinks.forEach(link => {
            const platform = link.dataset.platform || this.getSocialPlatform(link);
            if (!link.title) {
                link.title = `Visitar mi perfil de ${platform}`;
            }
        });

        // Add tooltips to quick actions
        this.elements.quickActions.forEach(action => {
            const actionType = this.getActionType(action);
            if (!action.title) {
                action.title = `Clic derecho para más opciones`;
            }
        });
    }

    initClickEffects() {
        // Add ripple effect to buttons
        document.querySelectorAll('.cta-button, .cta-btn, .quick-action').forEach(button => {
            button.addEventListener('click', this.createRippleEffect);
        });
    }

    createRippleEffect(e) {
        const button = e.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    preloadSocialIcons() {
        // Preload social platform favicons for faster loading
        const socialDomains = [
            'linkedin.com',
            'github.com', 
            'twitter.com',
            'instagram.com'
        ];

        socialDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = `//${domain}`;
            document.head.appendChild(link);
        });
    }

    updateAvailabilityStatus() {
        if (!this.elements.availabilityStatus) return;

        const now = new Date();
        const hour = now.getHours();
        const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        const isWorkingHours = (day >= 1 && day <= 5) && (hour >= 9 && hour <= 18);
        const statusDot = this.elements.availabilityStatus.querySelector('.status-dot');
        const statusText = this.elements.availabilityStatus.querySelector('.status-text');
        
        if (isWorkingHours) {
            statusDot.className = 'status-dot available';
            statusText.textContent = 'Disponible ahora';
        } else if ((day >= 1 && day <= 5) && (hour >= 6 && hour <= 22)) {
            statusDot.className = 'status-dot busy';
            statusText.textContent = 'Respuesta en pocas horas';
        } else {
            statusDot.className = 'status-dot unavailable';
            statusText.textContent = 'Respuesta en 24 horas';
        }

        // Update every hour
        setTimeout(() => {
            this.updateAvailabilityStatus();
        }, 60 * 60 * 1000);
    }

    addToRecentContacts(link) {
        try {
            const email = this.extractEmailFromHref(link.href);
            const contacts = JSON.parse(localStorage.getItem('recentContacts') || '[]');
            
            const contactInfo = {
                email: email,
                name: 'Jesús Navarrete',
                timestamp: Date.now()
            };

            // Remove if already exists
            const filteredContacts = contacts.filter(c => c.email !== email);
            
            // Add to beginning
            filteredContacts.unshift(contactInfo);
            
            // Keep only last 5
            const recentContacts = filteredContacts.slice(0, 5);
            
            localStorage.setItem('recentContacts', JSON.stringify(recentContacts));
        } catch (error) {
            console.warn('Could not save to recent contacts:', error);
        }
    }

    showToast(message, type = 'info') {
        const toastId = 'contact-toast-' + Date.now();
        const toastHTML = `
            <div id="${toastId}" class="toast-notification ${type}" role="alert">
                <div class="toast-content">
                    <i class="fas fa-${this.getToastIcon(type)} me-2"></i>
                    <span>${message}</span>
                </div>
                <button type="button" class="toast-close" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', toastHTML);
        
        const toast = document.getElementById(toastId);
        
        // Add CSS if not exists
        if (!document.getElementById('toast-styles')) {
            const styles = document.createElement('style');
            styles.id = 'toast-styles';
            styles.textContent = `
                .toast-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 8px;
                    padding: 16px 20px;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    max-width: 350px;
                    animation: slideInToast 0.3s ease;
                    border-left: 4px solid var(--primary-color);
                }
                .toast-notification.success { border-left-color: var(--success-color); }
                .toast-notification.warning { border-left-color: var(--warning-color); }
                .toast-notification.error { border-left-color: var(--danger-color); }
                .toast-content { display: flex; align-items: center; flex: 1; }
                .toast-close { background: none; border: none; cursor: pointer; padding: 4px; }
                @keyframes slideInToast {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            if (toast && toast.parentElement) {
                toast.style.animation = 'slideInToast 0.3s ease reverse';
                setTimeout(() => toast.remove(), 300);
            }
        }, 4000);
    }

    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            warning: 'exclamation-triangle',
            error: 'times-circle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getSocialPlatform(link) {
        const href = link.href.toLowerCase();
        if (href.includes('linkedin')) return 'LinkedIn';
        if (href.includes('github')) return 'GitHub';
        if (href.includes('twitter')) return 'Twitter';
        if (href.includes('instagram')) return 'Instagram';
        return 'Social Media';
    }

    getActionType(action) {
        const href = action.href;
        if (href.includes('mailto:')) return 'email';
        if (href.includes('tel:')) return 'phone';
        if (href.includes('whatsapp') || href.includes('wa.me')) return 'whatsapp';
        return 'unknown';
    }

    extractEmailFromHref(href) {
        return href.replace('mailto:', '').split('?')[0];
    }

    trackEvent(eventName, properties = {}) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'Contact Page',
                ...properties
            });
        }

        // Console log for development
        console.log(`Event: ${eventName}`, properties);
    }
}

// Utility functions
function formatPhoneNumber(phone) {
    return phone.replace(/\D/g, '').replace(/(\d{2})(\d{4})(\d{4})/, '+56 $1 $2 $3');
}

function isWorkingHours() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    return (day >= 1 && day <= 5) && (hour >= 9 && hour <= 18);
}

function getTimeUntilNextWorkingDay() {
    const now = new Date();