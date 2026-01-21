const fs = require('fs');
const path = require('path');

const WEBSITE_DIR = path.join(__dirname, '..');
const translations = JSON.parse(fs.readFileSync(path.join(__dirname, 'terms-translations.json'), 'utf8'));

const LANGUAGES = ['en', 'es', 'pt', 'de', 'fr', 'it', 'ja', 'ko', 'ru', 'sv', 'zh'];

function generateHTML(lang) {
    const t = translations[lang];
    const isEnglish = lang === 'en';
    const homeUrl = isEnglish ? '/' : `/${lang}/`;
    const assetPrefix = isEnglish ? '' : '../';
    
    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${t.title}</title>
    <link rel="canonical" href="https://tapandbuild.com${isEnglish ? '/terms.html' : `/${lang}/terms.html`}">
    <link rel="icon" href="/favicon.ico" sizes="48x48">
    <link rel="icon" href="/favicon-96.png" type="image/png" sizes="96x96">
    <link rel="stylesheet" href="${assetPrefix}legal-styles.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>${t.heading}</h1>
            <p class="last-updated">${t.lastUpdated}</p>
        </header>
        
        <main>
            <p>${t.intro}</p>
            
            <h2>${t.section1Title}</h2>
            <p>${t.section1Text}</p>
            
            <h2>${t.section2Title}</h2>
            <p>${t.section2Intro}</p>
            <ul>
                ${t.section2Items.map(item => `<li>${item}</li>`).join('\n                ')}
            </ul>
            
            <h2>${t.section3Title}</h2>
            <p>${t.section3Intro}</p>
            <ul>
                ${t.section3Items.map(item => `<li>${item}</li>`).join('\n                ')}
            </ul>
            <p>${t.section3Text}</p>
            
            <h2>${t.section4Title}</h2>
            <p>${t.section4Intro}</p>
            <ul>
                ${t.section4Items.map(item => `<li>${item}</li>`).join('\n                ')}
            </ul>
            
            <h2>${t.section5Title}</h2>
            <p>${t.section5Text}</p>
            
            <h2>${t.section6Title}</h2>
            <p>${t.section6Text}</p>
            
            <h2>${t.section7Title}</h2>
            <p>${t.section7Intro}</p>
            <ul>
                ${t.section7Items.map(item => `<li>${item}</li>`).join('\n                ')}
            </ul>
            
            <h2>${t.section8Title}</h2>
            <p>${t.section8Text}</p>
            
            <h2>${t.section9Title}</h2>
            <p>${t.section9Intro}</p>
            <ul>
                ${t.section9Items.map(item => `<li>${item}</li>`).join('\n                ')}
            </ul>
            
            <h2>${t.section10Title}</h2>
            <p>${t.section10Text}</p>
            
            <h2>${t.section11Title}</h2>
            <p>${t.section11Text}</p>
            
            <h2>${t.section12Title}</h2>
            <p>${t.section12Text}</p>
            <p><strong>${t.contactEmail}</strong> <a href="mailto:support@tapandbuild.com">support@tapandbuild.com</a></p>
            
            <a href="${homeUrl}" class="back-link">${t.backLink}</a>
        </main>
        
        <footer>
            <p>© 2026 Tap & Build. All rights reserved.</p>
        </footer>
    </div>
</body>
</html>`;
}

console.log('📜 Building terms pages...\n');

LANGUAGES.forEach(lang => {
    const html = generateHTML(lang);
    const outputDir = lang === 'en' ? WEBSITE_DIR : path.join(WEBSITE_DIR, lang);
    const outputFile = path.join(outputDir, 'terms.html');
    
    if (lang !== 'en' && !fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputFile, html, 'utf8');
    console.log(`✅ Built ${lang === 'en' ? '' : lang + '/'}terms.html`);
});

console.log('\n🎉 Terms pages complete!');
