/**
 * Build script to generate localized landing pages from translations.json
 * Run: node build-i18n.js
 */

const fs = require('fs');
const path = require('path');

const WEBSITE_DIR = path.join(__dirname);
const TRANSLATIONS_FILE = path.join(WEBSITE_DIR, 'i18n', 'translations.json');

// Load translations
const translations = JSON.parse(fs.readFileSync(TRANSLATIONS_FILE, 'utf8'));

// All supported languages
const LANGUAGES = ['en', 'es', 'pt', 'de', 'fr', 'it', 'ja', 'ko', 'ru', 'sv', 'zh'];

// Escape special characters for JSON-LD
function escapeJsonLd(str) {
    return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

// Locale mapping for og:locale:alternate
const LOCALE_MAP = {
    en: 'en_US', es: 'es_ES', pt: 'pt_BR', de: 'de_DE', fr: 'fr_FR',
    it: 'it_IT', ja: 'ja_JP', ko: 'ko_KR', ru: 'ru_RU', sv: 'sv_SE', zh: 'zh_CN'
};

// Generate og:locale:alternate tags
function generateOgLocaleAlternates(currentLang) {
    return LANGUAGES
        .filter(lang => lang !== currentLang)
        .map(lang => `    <meta property="og:locale:alternate" content="${LOCALE_MAP[lang]}">`)
        .join('\n');
}

// Generate hreflang links
function generateHreflangTags() {
    let tags = '';
    LANGUAGES.forEach(lang => {
        const url = lang === 'en' ? 'https://tapandbuild.com/' : `https://tapandbuild.com/${lang}/`;
        tags += `    <link rel="alternate" hreflang="${lang}" href="${url}">\n`;
    });
    tags += `    <link rel="alternate" hreflang="x-default" href="https://tapandbuild.com/">`;
    return tags;
}

// Generate language dropdown HTML
function generateLangDropdown(currentLang) {
    let html = '';
    const isCurrentEnglish = currentLang === 'en';
    LANGUAGES.forEach(lang => {
        const t = translations[lang];
        // Use relative paths with explicit index.html for local file:// browsing
        let url;
        if (isCurrentEnglish) {
            // From root: go to index.html for English, or ./lang/index.html for others
            url = lang === 'en' ? 'index.html' : `./${lang}/index.html`;
        } else {
            // From /lang/ folder: go to ../index.html for English, or ../lang/index.html for others
            url = lang === 'en' ? '../index.html' : `../${lang}/index.html`;
        }
        html += `                    <a href="${url}">${t.flag} ${t.langName}</a>\n`;
    });
    return html.trim();
}

// HTML Template
function generateHTML(lang) {
    const t = translations[lang];
    const isEnglish = lang === 'en';
    const canonicalUrl = isEnglish ? 'https://tapandbuild.com/' : `https://tapandbuild.com/${lang}/`;
    const playStoreUrl = `https://play.google.com/store/apps/details?id=com.tapandbuild.game${isEnglish ? '' : '&hl=' + lang}`;
    const basePath = isEnglish ? '' : '/';

    return `<!DOCTYPE html>
<html lang="${t.htmlLang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${t.title}</title>
    <meta name="description" content="${t.metaDescription}">
    <meta name="keywords" content="${t.metaKeywords}">
    <meta name="author" content="Habbi Games">
    <meta name="robots" content="index, follow">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${canonicalUrl}">
    
    <!-- Hreflang Tags -->
${generateHreflangTags()}
    
    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:title" content="${t.ogTitle}">
    <meta property="og:description" content="${t.ogDescription}">
    <meta property="og:image" content="https://tapandbuild.com/og-facebook.jpg">
    <meta property="og:image:secure_url" content="https://tapandbuild.com/og-facebook.jpg">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Tap & Build - Idle Factory Tycoon gameplay">
    <meta property="og:site_name" content="Tap & Build">
    <meta property="og:locale" content="${t.locale}">
${generateOgLocaleAlternates(lang)}
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@HabbiGames">
    <meta name="twitter:url" content="${canonicalUrl}">
    <meta name="twitter:title" content="${t.twitterTitle}">
    <meta name="twitter:description" content="${t.twitterDescription}">
    <meta name="twitter:image" content="https://tapandbuild.com/og-twitter.jpg">
    <meta name="twitter:image:alt" content="Tap & Build gameplay screenshot">
    
    <meta name="theme-color" content="#FF9F1C">
    <meta name="msapplication-TileColor" content="#FF9F1C">
    
    <!-- DNS Prefetch -->
    <link rel="dns-prefetch" href="https://play.google.com">
    <link rel="dns-prefetch" href="https://fonts.googleapis.com">
    <link rel="dns-prefetch" href="https://fonts.gstatic.com">
    
    <!-- Favicon -->
    <link rel="shortcut icon" href="/favicon.ico">
    <link rel="icon" href="/favicon.ico" sizes="48x48">
    <link rel="icon" href="/favicon-96.png" type="image/png" sizes="96x96">
    <link rel="icon" href="/favicon-192.png" type="image/png" sizes="192x192">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">
    <link rel="manifest" href="/manifest.json">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Inter:wght@400;600;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Inter:wght@400;600;700&display=swap" rel="stylesheet"></noscript>
    
    <!-- Preload LCP image -->
    <link rel="preload" as="image" href="${isEnglish ? '' : '../'}6_market.webp" type="image/webp" fetchpriority="high">
    
    <!-- JSON-LD -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Tap & Build: Idle Factory Tycoon",
        "operatingSystem": "Android",
        "applicationCategory": "GameApplication",
        "applicationSubCategory": "Idle Game",
        "inLanguage": "${lang}",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "description": "${escapeJsonLd(t.metaDescription)}",
        "screenshot": [
            "https://tapandbuild.com/6_market.png",
            "https://tapandbuild.com/1_main_factory.png",
            "https://tapandbuild.com/2_generators_tab.png",
            "https://tapandbuild.com/5_prestige.png",
            "https://tapandbuild.com/8_leaderboard.png"
        ],
        "featureList": [
            "${escapeJsonLd(t.feature1Title)}",
            "${escapeJsonLd(t.feature3Title)}",
            "${escapeJsonLd(t.feature5Title)}",
            "${escapeJsonLd(t.feature6Title)}",
            "${escapeJsonLd(t.feature7Title)}",
            "${escapeJsonLd(t.feature8Title)}"
        ],
        "author": { "@type": "Organization", "name": "Habbi Games" },
        "url": "${canonicalUrl}",
        "downloadUrl": "${playStoreUrl}",
        "softwareVersion": "1.3.2"
    }
    </script>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "${escapeJsonLd(t.faq1Q)}",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "${escapeJsonLd(t.faq1A)}"
                }
            },
            {
                "@type": "Question",
                "name": "${escapeJsonLd(t.faq2Q)}",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "${escapeJsonLd(t.faq2A)}"
                }
            },
            {
                "@type": "Question",
                "name": "${escapeJsonLd(t.faq3Q)}",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "${escapeJsonLd(t.faq3A)}"
                }
            },
            {
                "@type": "Question",
                "name": "${escapeJsonLd(t.faq4Q)}",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "${escapeJsonLd(t.faq4A)}"
                }
            }
        ]
    }
    </script>

    <link rel="stylesheet" href="../styles.css">
</head>
<body>
    <div class="bg-canvas" aria-hidden="true">
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
        <div class="grid-bg"></div>
    </div>

    <nav id="nav">
        <a href="index.html" class="nav-logo">
            <div class="nav-logo-icon">🏭</div>
            <span class="nav-logo-text">TAP & BUILD</span>
        </a>
        <div class="nav-links">
            <a href="#features">${t.navFeatures}</a>
            <a href="#faq">${t.navFaq}</a>
            <a href="updates.html">${t.navUpdates}</a>
            <a href="trailer.html">${t.navTrailer || 'Trailer'}</a>
            <a href="https://discord.gg/YxUGEz8GTZ">Discord</a>
            <div class="lang-selector" id="langSelector">
                🌐 ${lang.toUpperCase()}
                <div class="lang-dropdown">
${generateLangDropdown(lang)}
                </div>
            </div>
            <a href="${playStoreUrl}" class="nav-cta">${t.navDownload}</a>
        </div>
        <div class="nav-mobile-right">
            <div class="lang-selector" id="langSelectorMobile">
                🌐 ${lang.toUpperCase()}
                <div class="lang-dropdown">
${generateLangDropdown(lang)}
                </div>
            </div>
            <button class="menu-toggle" id="menuToggle" aria-label="Menu">
                <span></span><span></span><span></span>
            </button>
        </div>
    </nav>

    <main>
    <section class="hero">
        <div class="hero-grid">
            <div class="hero-content">
                <div class="hero-badge">
                    <span>🚀</span>
                    <span>${t.heroBadge}</span>
                </div>
                <h1 class="hero-title">${t.heroTitle}</h1>
                <p class="hero-subtitle">${t.heroSubtitle}</p>
                <div class="hero-buttons">
                    <a href="${playStoreUrl}" class="btn-hero btn-primary">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/></svg>
                        ${t.btnDownload}
                    </a>
                    <a href="https://discord.gg/YxUGEz8GTZ" class="btn-hero btn-outline">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z"/></svg>
                        ${t.btnDiscord}
                    </a>
                </div>
                <div class="hero-stats">
                    <div class="stat">
                        <div class="stat-value">14</div>
                        <div class="stat-label">${t.statGenerators}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">30+</div>
                        <div class="stat-label">${t.statUpgrades}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">∞</div>
                        <div class="stat-label">${t.statNumbers}</div>
                    </div>
                </div>
            </div>
            <div class="hero-showcase">
                <div class="phone-device">
                    <div class="phone-screen">
                        <img src="../6_market.webp" alt="${t.altMarket}" class="active" loading="eager">
                        <img src="../1_main_factory.webp" alt="${t.altFactory}" loading="lazy">
                        <img src="../2_generators_tab.webp" alt="${t.altGenerators}" loading="lazy">
                        <img src="../5_prestige.webp" alt="${t.altPrestige}" loading="lazy">
                        <img src="../8_leaderboard.webp" alt="${t.altLeaderboard}" loading="lazy">
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="features" id="features">
        <div class="section-header">
            <div class="section-tag">✦ ${t.featuresTag}</div>
            <h2 class="section-title">${t.featuresTitle}</h2>
            <p class="section-subtitle">${t.featuresSubtitle}</p>
        </div>
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon">🔧</div>
                <h3 class="feature-title">${t.feature1Title}</h3>
                <p class="feature-desc">${t.feature1Desc}</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🎯</div>
                <h3 class="feature-title">${t.feature2Title}</h3>
                <p class="feature-desc">${t.feature2Desc}</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">💎</div>
                <h3 class="feature-title">${t.feature3Title}</h3>
                <p class="feature-desc">${t.feature3Desc}</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🌟</div>
                <h3 class="feature-title">${t.feature4Title}</h3>
                <p class="feature-desc">${t.feature4Desc}</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">👔</div>
                <h3 class="feature-title">${t.feature5Title}</h3>
                <p class="feature-desc">${t.feature5Desc}</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🏆</div>
                <h3 class="feature-title">${t.feature6Title}</h3>
                <p class="feature-desc">${t.feature6Desc}</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🎁</div>
                <h3 class="feature-title">${t.feature7Title}</h3>
                <p class="feature-desc">${t.feature7Desc}</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">📴</div>
                <h3 class="feature-title">${t.feature8Title}</h3>
                <p class="feature-desc">${t.feature8Desc}</p>
            </div>
        </div>
    </section>

    <!-- Alpha Signup Section -->
    <section class="cta-section reveal" id="alpha">
        <div class="cta-box">
            <div class="alpha-badge">${t.alphaBadge}</div>
            <h2 class="cta-title">${t.alphaTitle}</h2>
            <p class="cta-subtitle">${t.alphaSubtitle}</p>
            
            <div id="alpha-form-container">
                <form action="https://formspree.io/f/xwvvlykd" method="POST" class="alpha-form" id="alpha-form">
                    <div class="form-row">
                        <input type="email" name="email" class="form-input" id="email-input" placeholder="${t.alphaPlaceholder}" required>
                        <button type="submit" class="form-submit" id="submit-btn">${t.alphaButton}</button>
                    </div>
                    <p class="form-error" id="form-error">${t.alphaError}</p>
                    <p class="form-helper">📱 ${t.alphaHelper}</p>
                </form>
            </div>
            
            <div class="form-success" id="form-success">
                <div class="form-success-icon">🎉</div>
                <h3 class="form-success-title">${t.alphaSuccessTitle}</h3>
                <p class="form-success-text">${t.alphaSuccessText}</p>
            </div>
        </div>
    </section>

    <section class="faq" id="faq">
        <div class="section-header">
            <div class="section-tag">❓ ${t.faqTag}</div>
            <h2 class="section-title">${t.faqTitle}</h2>
        </div>
        <div class="faq-grid">
            <details class="faq-item">
                <summary>${t.faq1Q}</summary>
                <p>${t.faq1A}</p>
            </details>
            <details class="faq-item">
                <summary>${t.faq2Q}</summary>
                <p>${t.faq2A}</p>
            </details>
            <details class="faq-item">
                <summary>${t.faq3Q}</summary>
                <p>${t.faq3A}</p>
            </details>
            <details class="faq-item">
                <summary>${t.faq4Q}</summary>
                <p>${t.faq4A}</p>
            </details>
        </div>
    </section>
    </main>

    <footer>
        <div class="footer-grid">
            <div class="footer-brand">
                <p class="footer-brand-title">🏭 Tap & Build</p>
                <p>${t.footerTagline}</p>
            </div>
            <div class="footer-column">
                <p class="footer-heading">${t.footerGame}</p>
                <a href="${playStoreUrl}">Google Play</a>
                <a href="#features">${t.navFeatures}</a>
                <a href="https://discord.gg/YxUGEz8GTZ">Discord</a>
            </div>
            <div class="footer-column">
                <p class="footer-heading">${t.footerLegal}</p>
                <a href="privacy.html">${t.footerPrivacy}</a>
                <a href="terms.html">${t.footerTerms}</a>
            </div>
            <div class="footer-column">
                <p class="footer-heading">${t.footerSupport}</p>
                <a href="mailto:support@tapandbuild.com">${t.footerContact}</a>
                <a href="#faq">${t.navFaq}</a>
                <a href="press.html">${t.footerPressKit}</a>
            </div>
        </div>
        <div class="footer-bottom">
            <p>${t.footerCopyright}</p>
        </div>
    </footer>

    <script>
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.querySelector('.nav-links');
        menuToggle.addEventListener('click', () => { menuToggle.classList.toggle('active'); navLinks.classList.toggle('active'); });
        // Close menu when clicking nav links (but not lang dropdown)
        navLinks.querySelectorAll('a:not(.lang-dropdown a)').forEach(link => {
            link.addEventListener('click', () => { menuToggle.classList.remove('active'); navLinks.classList.remove('active'); });
        });
        window.addEventListener('scroll', () => { document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 50); }, { passive: true });
        const screens = document.querySelectorAll('.phone-screen img');
        let currentScreen = 0;
        setInterval(() => { screens[currentScreen].classList.remove('active'); currentScreen = (currentScreen + 1) % screens.length; screens[currentScreen].classList.add('active'); }, 3000);
        
        // Language selector click handler (both desktop and mobile)
        document.querySelectorAll('.lang-selector').forEach(langSelector => {
            langSelector.addEventListener('click', (e) => {
                e.stopPropagation();
                // Close other lang selectors
                document.querySelectorAll('.lang-selector').forEach(other => {
                    if (other !== langSelector) other.classList.remove('active');
                });
                langSelector.classList.toggle('active');
            });
        });
        document.addEventListener('click', () => {
            document.querySelectorAll('.lang-selector').forEach(ls => ls.classList.remove('active'));
        });
        
        // Alpha form handling
        (function() {
            const form = document.getElementById('alpha-form');
            const emailInput = document.getElementById('email-input');
            const submitBtn = document.getElementById('submit-btn');
            const formError = document.getElementById('form-error');
            const formContainer = document.getElementById('alpha-form-container');
            const formSuccess = document.getElementById('form-success');
            
            if (!form) return;
            
            emailInput.addEventListener('input', function() {
                emailInput.classList.remove('error');
                formError.classList.remove('visible');
            });
            
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                const email = emailInput.value.trim().toLowerCase();
                
                if (!email.endsWith('@gmail.com')) {
                    emailInput.classList.add('error');
                    formError.classList.add('visible');
                    return;
                }
                
                submitBtn.disabled = true;
                submitBtn.textContent = '...';
                
                try {
                    const response = await fetch(form.action, {
                        method: 'POST',
                        body: new FormData(form),
                        headers: { 'Accept': 'application/json' }
                    });
                    
                    if (response.ok) {
                        formContainer.style.display = 'none';
                        formSuccess.classList.add('visible');
                    } else {
                        throw new Error('Form submission failed');
                    }
                } catch (error) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = '${t.alphaButton}';
                    formError.textContent = 'Error. Please try again.';
                    formError.classList.add('visible');
                }
            });
        })();
        
        // Reveal on scroll
        const reveals = document.querySelectorAll('.reveal');
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) e.target.classList.add('visible');
            });
        }, { threshold: 0.1, rootMargin: '-50px' });
        reveals.forEach(el => revealObserver.observe(el));

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', e => {
                e.preventDefault();
                const target = document.querySelector(a.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    </script>
</body>
</html>`;
}

// Build all pages
console.log('🚀 Building localized landing pages...\n');

LANGUAGES.forEach(lang => {
    const html = generateHTML(lang);
    const outputDir = lang === 'en' ? WEBSITE_DIR : path.join(WEBSITE_DIR, lang);
    const outputFile = path.join(outputDir, 'index.html');
    
    // Create directory if needed
    if (lang !== 'en' && !fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Don't overwrite the main English index.html (it has more features)
    if (lang === 'en') {
        console.log(`⏭️  Skipping en/index.html (keeping original with alpha form)`);
        return;
    }
    
    fs.writeFileSync(outputFile, html, 'utf8');
    console.log(`✅ Built ${lang}/index.html`);
});

// Generate sitemap
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${LANGUAGES.map(lang => {
    const url = lang === 'en' ? 'https://tapandbuild.com/' : `https://tapandbuild.com/${lang}/`;
    const hreflangLinks = LANGUAGES.map(l => {
        const lUrl = l === 'en' ? 'https://tapandbuild.com/' : `https://tapandbuild.com/${l}/`;
        return `        <xhtml:link rel="alternate" hreflang="${l}" href="${lUrl}"/>`;
    }).join('\n');
    return `    <url>
        <loc>${url}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${lang === 'en' ? '1.0' : '0.8'}</priority>
${hreflangLinks}
        <xhtml:link rel="alternate" hreflang="x-default" href="https://tapandbuild.com/"/>
    </url>`;
}).join('\n')}
${LANGUAGES.map(lang => {
    const updatesUrl = lang === 'en' ? 'https://tapandbuild.com/updates.html' : `https://tapandbuild.com/${lang}/updates.html`;
    const updatesHreflangLinks = LANGUAGES.map(l => {
        const lUrl = l === 'en' ? 'https://tapandbuild.com/updates.html' : `https://tapandbuild.com/${l}/updates.html`;
        return `        <xhtml:link rel="alternate" hreflang="${l}" href="${lUrl}"/>`;
    }).join('\n');
    return `    <url>
        <loc>${updatesUrl}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
${updatesHreflangLinks}
        <xhtml:link rel="alternate" hreflang="x-default" href="https://tapandbuild.com/updates.html"/>
    </url>`;
}).join('\n')}
${LANGUAGES.map(lang => {
    const pressUrl = lang === 'en' ? 'https://tapandbuild.com/press.html' : `https://tapandbuild.com/${lang}/press.html`;
    const pressHreflangLinks = LANGUAGES.map(l => {
        const lUrl = l === 'en' ? 'https://tapandbuild.com/press.html' : `https://tapandbuild.com/${l}/press.html`;
        return `        <xhtml:link rel="alternate" hreflang="${l}" href="${lUrl}"/>`;
    }).join('\n');
    return `    <url>
        <loc>${pressUrl}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
${pressHreflangLinks}
        <xhtml:link rel="alternate" hreflang="x-default" href="https://tapandbuild.com/press.html"/>
    </url>`;
}).join('\n')}
${LANGUAGES.map(lang => {
    const trailerUrl = lang === 'en' ? 'https://tapandbuild.com/trailer.html' : `https://tapandbuild.com/${lang}/trailer.html`;
    const trailerHreflangLinks = LANGUAGES.map(l => {
        const lUrl = l === 'en' ? 'https://tapandbuild.com/trailer.html' : `https://tapandbuild.com/${l}/trailer.html`;
        return `        <xhtml:link rel="alternate" hreflang="${l}" href="${lUrl}"/>`;
    }).join('\n');
    return `    <url>
        <loc>${trailerUrl}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
${trailerHreflangLinks}
        <xhtml:link rel="alternate" hreflang="x-default" href="https://tapandbuild.com/trailer.html"/>
    </url>`;
}).join('\n')}
${LANGUAGES.map(lang => {
    const privacyUrl = lang === 'en' ? 'https://tapandbuild.com/privacy.html' : `https://tapandbuild.com/${lang}/privacy.html`;
    const privacyHreflangLinks = LANGUAGES.map(l => {
        const lUrl = l === 'en' ? 'https://tapandbuild.com/privacy.html' : `https://tapandbuild.com/${l}/privacy.html`;
        return `        <xhtml:link rel="alternate" hreflang="${l}" href="${lUrl}"/>`;
    }).join('\n');
    return `    <url>
        <loc>${privacyUrl}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.3</priority>
${privacyHreflangLinks}
        <xhtml:link rel="alternate" hreflang="x-default" href="https://tapandbuild.com/privacy.html"/>
    </url>`;
}).join('\n')}
${LANGUAGES.map(lang => {
    const termsUrl = lang === 'en' ? 'https://tapandbuild.com/terms.html' : `https://tapandbuild.com/${lang}/terms.html`;
    const termsHreflangLinks = LANGUAGES.map(l => {
        const lUrl = l === 'en' ? 'https://tapandbuild.com/terms.html' : `https://tapandbuild.com/${l}/terms.html`;
        return `        <xhtml:link rel="alternate" hreflang="${l}" href="${lUrl}"/>`;
    }).join('\n');
    return `    <url>
        <loc>${termsUrl}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.3</priority>
${termsHreflangLinks}
        <xhtml:link rel="alternate" hreflang="x-default" href="https://tapandbuild.com/terms.html"/>
    </url>`;
}).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(WEBSITE_DIR, 'sitemap.xml'), sitemapContent, 'utf8');
console.log('\n✅ Generated sitemap.xml with hreflang');

console.log('\n🎉 Build complete! Generated 10 localized pages + sitemap');
console.log('\nLanguages: en, es, pt, de, fr, it, ja, ko, ru, sv, zh');
