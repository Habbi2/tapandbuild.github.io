const fs = require('fs');
const path = require('path');

const WEBSITE_DIR = path.join(__dirname, '..');
const translations = JSON.parse(fs.readFileSync(path.join(__dirname, 'press-translations.json'), 'utf8'));

const LANGUAGES = ['en', 'es', 'pt', 'de', 'fr', 'it', 'ja', 'ko', 'ru', 'sv', 'zh'];

function generateHTML(lang) {
    const t = translations[lang];
    const isEnglish = lang === 'en';
    const homeUrl = isEnglish ? 'index.html' : 'index.html';
    const assetPrefix = isEnglish ? '' : '../';
    const canonicalPath = isEnglish ? '/press.html' : `/${lang}/press.html`;
    const privacyPath = isEnglish ? 'privacy.html' : 'privacy.html';
    const termsPath = isEnglish ? 'terms.html' : 'terms.html';
    
    return `<!DOCTYPE html>
<html lang="${t.htmlLang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${t.title}</title>
    <meta name="description" content="${t.metaDescription}">
    <meta name="robots" content="index, follow">
    
    <link rel="canonical" href="https://tapandbuild.com${canonicalPath}">
    
    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://tapandbuild.com${canonicalPath}">
    <meta property="og:title" content="${t.pressKitTitle} - Tap & Build">
    <meta property="og:description" content="${t.metaDescription}">
    <meta property="og:image" content="https://tapandbuild.com/og-facebook.jpg">
    
    <meta name="theme-color" content="#FF9F1C">
    
    <link rel="icon" href="${assetPrefix}favicon.ico" sizes="48x48">
    <link rel="icon" href="${assetPrefix}favicon-96.png" type="image/png" sizes="96x96">
    <link rel="apple-touch-icon" href="${assetPrefix}apple-touch-icon.png" sizes="180x180">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="${assetPrefix}press-styles.css">
</head>
<body>
    <div class="container">
        <a href="${homeUrl}" class="back-link">${t.backToHome}</a>
        
        <header class="header">
            <h1>${t.pressKitTitle}</h1>
            <p>${t.pressKitSubtitle}</p>
        </header>

        <!-- Fact Sheet -->
        <section class="section">
            <h2>${t.factSheetTitle}</h2>
            <div class="fact-sheet">
                <div class="fact">
                    <div class="fact-label">${t.factGameTitle}</div>
                    <div class="fact-value">${t.factGameTitleValue}</div>
                </div>
                <div class="fact">
                    <div class="fact-label">${t.factDeveloper}</div>
                    <div class="fact-value">${t.factDeveloperValue}</div>
                </div>
                <div class="fact">
                    <div class="fact-label">${t.factReleaseDate}</div>
                    <div class="fact-value">${t.factReleaseDateValue}</div>
                </div>
                <div class="fact">
                    <div class="fact-label">${t.factPlatforms}</div>
                    <div class="fact-value">${t.factPlatformsValue}</div>
                </div>
                <div class="fact">
                    <div class="fact-label">${t.factPrice}</div>
                    <div class="fact-value">${t.factPriceValue}</div>
                </div>
                <div class="fact">
                    <div class="fact-label">${t.factGenre}</div>
                    <div class="fact-value">${t.factGenreValue}</div>
                </div>
                <div class="fact">
                    <div class="fact-label">${t.factLanguages}</div>
                    <div class="fact-value">${t.factLanguagesValue}</div>
                </div>
                <div class="fact">
                    <div class="fact-label">${t.factVersion}</div>
                    <div class="fact-value">${t.factVersionValue}</div>
                </div>
            </div>
        </section>

        <!-- Description -->
        <section class="section">
            <h2>${t.descriptionTitle}</h2>
            <div class="description">
                <h3>${t.shortDescTitle}</h3>
                <p>${t.shortDesc}</p>
                
                <h3>${t.longDescTitle}</h3>
                <p>${t.longDesc1}</p>
                <p>${t.longDesc2}</p>
                <p>${t.longDesc3}</p>
                <p>${t.longDesc4}</p>
            </div>
        </section>

        <!-- Features -->
        <section class="section">
            <h2>${t.featuresTitle}</h2>
            <div class="features-grid">
                <div class="feature">
                    <span class="feature-icon">🏭</span>
                    <span class="feature-text">${t.feature1}</span>
                </div>
                <div class="feature">
                    <span class="feature-icon">⭐</span>
                    <span class="feature-text">${t.feature2}</span>
                </div>
                <div class="feature">
                    <span class="feature-icon">✨</span>
                    <span class="feature-text">${t.feature3}</span>
                </div>
                <div class="feature">
                    <span class="feature-icon">📊</span>
                    <span class="feature-text">${t.feature4}</span>
                </div>
                <div class="feature">
                    <span class="feature-icon">👔</span>
                    <span class="feature-text">${t.feature5}</span>
                </div>
                <div class="feature">
                    <span class="feature-icon">🎯</span>
                    <span class="feature-text">${t.feature6}</span>
                </div>
                <div class="feature">
                    <span class="feature-icon">🏆</span>
                    <span class="feature-text">${t.feature7}</span>
                </div>
                <div class="feature">
                    <span class="feature-icon">👥</span>
                    <span class="feature-text">${t.feature8}</span>
                </div>
                <div class="feature">
                    <span class="feature-icon">🔥</span>
                    <span class="feature-text">${t.feature9}</span>
                </div>
                <div class="feature">
                    <span class="feature-icon">😴</span>
                    <span class="feature-text">${t.feature10}</span>
                </div>
                <div class="feature">
                    <span class="feature-icon">🎰</span>
                    <span class="feature-text">${t.feature11}</span>
                </div>
                <div class="feature">
                    <span class="feature-icon">☁️</span>
                    <span class="feature-text">${t.feature12}</span>
                </div>
            </div>
        </section>

        <!-- Screenshots -->
        <section class="section">
            <h2>${t.screenshotsTitle}</h2>
            <p style="color: var(--text-muted); margin-bottom: 20px;">${t.screenshotsSubtitle}</p>
            <div class="screenshots-grid">
                <div class="screenshot">
                    <img src="${assetPrefix}1_main_factory.webp" alt="${t.screenshot1Alt}" loading="lazy">
                    <div class="screenshot-overlay">
                        <a href="${assetPrefix}1_main_factory.png" download>${t.downloadPng}</a>
                    </div>
                </div>
                <div class="screenshot">
                    <img src="${assetPrefix}2_generators_tab.webp" alt="${t.screenshot2Alt}" loading="lazy">
                    <div class="screenshot-overlay">
                        <a href="${assetPrefix}2_generators_tab.png" download>${t.downloadPng}</a>
                    </div>
                </div>
                <div class="screenshot">
                    <img src="${assetPrefix}3_upgrades_panel.webp" alt="${t.screenshot3Alt}" loading="lazy">
                    <div class="screenshot-overlay">
                        <a href="${assetPrefix}3_upgrades_panel.png" download>${t.downloadPng}</a>
                    </div>
                </div>
                <div class="screenshot">
                    <img src="${assetPrefix}4_challenges.webp" alt="${t.screenshot4Alt}" loading="lazy">
                    <div class="screenshot-overlay">
                        <a href="${assetPrefix}4_challenges.png" download>${t.downloadPng}</a>
                    </div>
                </div>
                <div class="screenshot">
                    <img src="${assetPrefix}5_prestige.webp" alt="${t.screenshot5Alt}" loading="lazy">
                    <div class="screenshot-overlay">
                        <a href="${assetPrefix}5_prestige.png" download>${t.downloadPng}</a>
                    </div>
                </div>
                <div class="screenshot">
                    <img src="${assetPrefix}6_market.webp" alt="${t.screenshot6Alt}" loading="lazy">
                    <div class="screenshot-overlay">
                        <a href="${assetPrefix}6_market.png" download>${t.downloadPng}</a>
                    </div>
                </div>
                <div class="screenshot">
                    <img src="${assetPrefix}7_ascension_perks.webp" alt="${t.screenshot7Alt}" loading="lazy">
                    <div class="screenshot-overlay">
                        <a href="${assetPrefix}7_ascension_perks.png" download>${t.downloadPng}</a>
                    </div>
                </div>
                <div class="screenshot">
                    <img src="${assetPrefix}8_leaderboard.webp" alt="${t.screenshot8Alt}" loading="lazy">
                    <div class="screenshot-overlay">
                        <a href="${assetPrefix}8_leaderboard.png" download>${t.downloadPng}</a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Logos & Icons -->
        <section class="section">
            <h2>${t.logosTitle}</h2>
            <div class="logos-grid">
                <div class="logo-item">
                    <img src="${assetPrefix}favicon-512.png" alt="${t.appIcon} 512px">
                    <div>${t.appIcon}</div>
                    <a href="${assetPrefix}favicon-512.png" download>512x512 PNG</a>
                </div>
                <div class="logo-item">
                    <img src="${assetPrefix}favicon-192.png" alt="${t.appIcon} 192px">
                    <div>${t.appIcon}</div>
                    <a href="${assetPrefix}favicon-192.png" download>192x192 PNG</a>
                </div>
                <div class="logo-item">
                    <img src="${assetPrefix}favicon-96.png" alt="${t.appIcon} 96px">
                    <div>${t.appIcon}</div>
                    <a href="${assetPrefix}favicon-96.png" download>96x96 PNG</a>
                </div>
            </div>
        </section>

        <!-- Video -->
        <section class="section">
            <h2>${t.trailerTitle}</h2>
            <div class="video-container">
                <div class="video-embed">
                    <iframe 
                        src="https://www.youtube.com/embed/9qrewptoRwY" 
                        title="Tap & Build: Idle Clicker - Official Gameplay Trailer"
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
                <p style="color: var(--text-muted); margin-top: 15px;">
                    <a href="https://youtu.be/9qrewptoRwY" style="color: var(--accent);" target="_blank" rel="noopener">${t.watchOnYoutube}</a> · 
                    <a href="https://play.google.com/store/apps/details?id=com.tapandbuild.game" style="color: var(--accent);" target="_blank" rel="noopener">${t.viewOnGooglePlay}</a>
                </p>
            </div>
        </section>

        <!-- Links -->
        <section class="section">
            <h2>${t.linksTitle}</h2>
            <div class="links-grid">
                <a href="https://play.google.com/store/apps/details?id=com.tapandbuild.game" class="link-card" target="_blank" rel="noopener">
                    <span class="link-icon">▶️</span>
                    <div class="link-info">
                        <h4>${t.googlePlayStore}</h4>
                        <span>${t.downloadForAndroid}</span>
                    </div>
                </a>
                <a href="https://tapandbuild.com" class="link-card" target="_blank" rel="noopener">
                    <span class="link-icon">🌐</span>
                    <div class="link-info">
                        <h4>${t.officialWebsite}</h4>
                        <span>tapandbuild.com</span>
                    </div>
                </a>
                <a href="${privacyPath}" class="link-card">
                    <span class="link-icon">🔒</span>
                    <div class="link-info">
                        <h4>${t.privacyPolicy}</h4>
                        <span>${t.legalInfo}</span>
                    </div>
                </a>
            </div>
        </section>

        <!-- Contact -->
        <section class="section">
            <h2>${t.contactTitle}</h2>
            <div class="contact-box">
                <h3>${t.getInTouch}</h3>
                <p>${t.contactDesc}</p>
                <a href="mailto:press@tapandbuild.com" class="contact-email">press@tapandbuild.com</a>
            </div>
        </section>
    </div>

    <footer class="footer">
        <p>${t.footerCopyright}</p>
        <p style="margin-top: 10px;">
            <a href="${homeUrl}">${t.footerHome}</a> · 
            <a href="${privacyPath}">${t.footerPrivacy}</a> · 
            <a href="${termsPath}">${t.footerTerms}</a>
        </p>
    </footer>
</body>
</html>`;
}

console.log('📦 Building press kit pages...\n');

LANGUAGES.forEach(lang => {
    const html = generateHTML(lang);
    const outputDir = lang === 'en' ? WEBSITE_DIR : path.join(WEBSITE_DIR, lang);
    const outputFile = path.join(outputDir, 'press.html');
    
    if (lang !== 'en' && !fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputFile, html, 'utf8');
    console.log(`✅ Built ${lang === 'en' ? '' : lang + '/'}press.html`);
});

console.log('\n🎉 Press kit pages complete!');
