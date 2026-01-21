const fs = require('fs');
const path = require('path');

const WEBSITE_DIR = path.join(__dirname, '..');
const translations = JSON.parse(fs.readFileSync(path.join(__dirname, 'privacy-translations.json'), 'utf8'));

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
    <link rel="canonical" href="https://tapandbuild.com${isEnglish ? '/privacy.html' : `/${lang}/privacy.html`}">
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
            <p><strong>${t.section1Text1}</strong></p>
            <ul>
                <li>${t.section1Item1}</li>
            </ul>
            <p><strong>${t.section1Text2}</strong></p>
            <ul>
                <li>${t.section1Item2}</li>
                <li>${t.section1Item3}</li>
            </ul>
            
            <h2>${t.section2Title}</h2>
            <ul>
                ${t.section2Items.map(item => `<li>${item}</li>`).join('\n                ')}
            </ul>
            
            <h2>${t.section3Title}</h2>
            <p>${t.section3Text1}</p>
            <p>${t.section3Text2}</p>
            
            <h2>${t.section4Title}</h2>
            <p>${t.section4Intro}</p>
            <ul>
                <li>${t.section4Item1} <a href="https://policies.google.com/privacy" target="_blank">Google's Privacy Policy</a></li>
                <li>${t.section4Item2} <a href="https://supabase.com/privacy" target="_blank">Supabase Privacy Policy</a></li>
            </ul>
            
            <h2>${t.section5Title}</h2>
            <p>${t.section5Text}</p>
            <ul>
                ${t.section5Items.map(item => `<li>${item}</li>`).join('\n                ')}
            </ul>
            <p>${t.section5Text2}</p>
            
            <h2>${t.section6Title}</h2>
            <p>${t.section6Text}</p>
            
            <h2>${t.section7Title}</h2>
            <ul>
                ${t.section7Items.map(item => `<li>${item}</li>`).join('\n                ')}
            </ul>
            
            <h2>${t.section8Title}</h2>
            <p>${t.section8Intro}</p>
            <ul>
                ${t.section8Items.map(item => `<li>${item}</li>`).join('\n                ')}
            </ul>
            
            <h2>${t.section9Title}</h2>
            <p>${t.section9Text}</p>
            
            <h2>${t.section10Title}</h2>
            <p>${t.section10Text}</p>
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

console.log('🔒 Building privacy pages...\n');

LANGUAGES.forEach(lang => {
    const html = generateHTML(lang);
    const outputDir = lang === 'en' ? WEBSITE_DIR : path.join(WEBSITE_DIR, lang);
    const outputFile = path.join(outputDir, 'privacy.html');
    
    if (lang !== 'en' && !fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputFile, html, 'utf8');
    console.log(`✅ Built ${lang === 'en' ? '' : lang + '/'}privacy.html`);
});

console.log('\n🎉 Privacy pages complete!');
