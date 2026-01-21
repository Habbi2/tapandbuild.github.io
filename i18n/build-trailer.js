const fs = require('fs');
const path = require('path');

const WEBSITE_DIR = path.join(__dirname, '..');
const translations = JSON.parse(fs.readFileSync(path.join(__dirname, 'trailer-translations.json'), 'utf8'));

const LANGUAGES = ['en', 'es', 'pt', 'de', 'fr', 'it', 'ja', 'ko', 'ru', 'sv', 'zh'];

// Locale mapping for og:locale
const LOCALE_MAP = {
    en: 'en_US', es: 'es_ES', pt: 'pt_BR', de: 'de_DE', fr: 'fr_FR',
    it: 'it_IT', ja: 'ja_JP', ko: 'ko_KR', ru: 'ru_RU', sv: 'sv_SE', zh: 'zh_CN'
};

// Generate hreflang tags for trailer pages
function generateTrailerHreflangTags() {
    let tags = LANGUAGES.map(l => {
        const url = l === 'en' ? 'https://tapandbuild.com/trailer.html' : `https://tapandbuild.com/${l}/trailer.html`;
        return `    <link rel="alternate" hreflang="${l}" href="${url}">`;
    }).join('\n');
    tags += `\n    <link rel="alternate" hreflang="x-default" href="https://tapandbuild.com/trailer.html">`;
    return tags;
}

// Generate og:locale:alternate tags
function generateOgLocaleAlternates(currentLang) {
    return LANGUAGES
        .filter(l => l !== currentLang)
        .map(l => `    <meta property="og:locale:alternate" content="${LOCALE_MAP[l]}">`)
        .join('\n');
}

// Generate VideoObject JSON-LD schema
function generateVideoObjectSchema(lang, t) {
    const canonicalUrl = lang === 'en' ? 'https://tapandbuild.com/trailer.html' : `https://tapandbuild.com/${lang}/trailer.html`;
    return `
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": "${t.title}",
        "description": "Interactive cinematic trailer for Tap & Build: Idle Factory Tycoon. Experience all game features including 21 generators, prestige system, global leaderboards, and more.",
        "thumbnailUrl": "https://tapandbuild.com/og-facebook.jpg",
        "uploadDate": "2026-01-01",
        "contentUrl": "${canonicalUrl}",
        "embedUrl": "${canonicalUrl}",
        "interactionStatistic": {
            "@type": "InteractionCounter",
            "interactionType": { "@type": "WatchAction" },
            "userInteractionCount": 0
        },
        "publisher": {
            "@type": "Organization",
            "name": "Habbi Games",
            "logo": {
                "@type": "ImageObject",
                "url": "https://tapandbuild.com/favicon-512.png"
            }
        }
    }
    </script>`;
}

// Read the original trailer.html as base template
const baseTrailer = fs.readFileSync(path.join(WEBSITE_DIR, 'trailer.html'), 'utf8');

function translateTrailer(lang) {
    const t = translations[lang];
    const isEnglish = lang === 'en';
    // Use relative paths that work both locally and on server
    const homeUrl = isEnglish ? 'index.html' : 'index.html';
    
    let html = baseTrailer;
    
    // Update lang attribute
    html = html.replace('<html lang="en">', `<html lang="${lang}">`);
    
    // Update title
    html = html.replace('<title>Tap & Build - Cinematic Trailer</title>', `<title>${t.title}</title>`);
    
    // Update canonical URL
    const canonicalUrl = isEnglish ? 'https://tapandbuild.com/trailer.html' : `https://tapandbuild.com/${lang}/trailer.html`;
    html = html.replace(
        '<link rel="canonical" href="https://tapandbuild.com/trailer.html">',
        `<link rel="canonical" href="${canonicalUrl}">`
    );
    
    // Add hreflang, meta tags, and VideoObject schema after canonical
    const metaTags = `<link rel="canonical" href="${canonicalUrl}">
    
    <!-- Hreflang Tags -->
${generateTrailerHreflangTags()}
    
    <!-- Meta Description -->
    <meta name="description" content="${t.taglineDesc || 'Interactive cinematic trailer for Tap & Build: Idle Factory Tycoon'}">
    <meta name="robots" content="index, follow">
    
    <!-- Open Graph -->
    <meta property="og:type" content="video.other">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:title" content="${t.title}">
    <meta property="og:description" content="${t.taglineDesc || 'Interactive cinematic trailer for Tap & Build'}">
    <meta property="og:image" content="https://tapandbuild.com/og-facebook.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="Tap & Build">
    <meta property="og:locale" content="${LOCALE_MAP[lang]}">
${generateOgLocaleAlternates(lang)}
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@HabbiGames">
    <meta name="twitter:title" content="${t.title}">
    <meta name="twitter:description" content="${t.taglineDesc || 'Interactive cinematic trailer for Tap & Build'}">
    <meta name="twitter:image" content="https://tapandbuild.com/og-twitter.jpg">
    
    <!-- VideoObject Schema -->
${generateVideoObjectSchema(lang, t)}`;
    
    html = html.replace(`<link rel="canonical" href="${canonicalUrl}">`, metaTags);
    
    // Update navigation - fix BOTH home links (back button and logo)
    html = html.replace(/href="index\.html" class="nav-back"/g, `href="${homeUrl}" class="nav-back"`);
    html = html.replace(/href="index\.html" class="nav-logo"/g, `href="${homeUrl}" class="nav-logo"`);
    
    // Nav text - simple text replacement
    html = html.replace('Back to Home', t.backToHome);
    html = html.replace('Download Free', t.downloadFree);
    
    // Controls hint
    html = html.replace('Swipe or tap to navigate', t.controlsHint);
    
    // Daily rewards calendar - Day labels
    if (t.dayLabel) {
        for (let i = 1; i <= 14; i++) {
            if (t.daySuffix) {
                // Chinese format: 第1天, 第2天, etc.
                html = html.replace(`>Day ${i}</div>`, `>${t.dayLabel}${i}${t.daySuffix}</div>`);
            } else if (lang === 'ja') {
                // Japanese format: 1日目, 2日目, etc.
                html = html.replace(`>Day ${i}</div>`, `>${i}${t.dayLabel}</div>`);
            } else {
                // Most languages: Día 1, Tag 1, День 1, etc.
                html = html.replace(`>Day ${i}</div>`, `>${t.dayLabel} ${i}</div>`);
            }
        }
    }
    
    // Scene 1 - Intro subtitle
    html = html.replace('>Idle Factory Tycoon</div>', `>${t.subtitle}</div>`);
    
    // Scene 2 - Tagline
    html = html.replace('Tap. <span class="highlight">Build.</span> Dominate.', t.tagline);
    html = html.replace('The ultimate idle factory tycoon. Start with a single tap, build an empire that spans dimensions.', t.taglineDesc);
    
    // Scene 3 - Generators
    html = html.replace('🏭 <span class="highlight">21</span> Unique Generators', t.generatorsTitle);
    html = html.replace('>Conveyor Belt</div>', `>${t.gen1}</div>`);
    html = html.replace('>Assembly Line</div>', `>${t.gen2}</div>`);
    html = html.replace('>Robotic Arm</div>', `>${t.gen3}</div>`);
    html = html.replace('>Factory Floor</div>', `>${t.gen4}</div>`);
    html = html.replace('>Industrial Zone</div>', `>${t.gen5}</div>`);
    html = html.replace('>Global Network</div>', `>${t.gen6}</div>`);
    html = html.replace('>Quantum Fabricator</div>', `>${t.gen7}</div>`);
    html = html.replace('>Fusion Reactor</div>', `>${t.gen8}</div>`);
    html = html.replace('>Antimatter Engine</div>', `>${t.gen9}</div>`);
    html = html.replace('>Dyson Sphere</div>', `>${t.gen10}</div>`);
    html = html.replace('>Black Hole</div>', `>${t.gen11}</div>`);
    html = html.replace('>Multiverse Gateway</div>', `>${t.gen12}</div>`);
    html = html.replace('>Temporal Accelerator</div>', `>${t.gen13}</div>`);
    
    // Scene 4 - Prestige (uses <span> for benefits, not </div>)
    html = html.replace('⭐ <span class="highlight">Prestige</span> System', t.prestigeTitle);
    html = html.replace('>PRESTIGE</div>', `>${t.prestigeText}</div>`);
    html = html.replace('>Permanent production multipliers</span>', `>${t.prestigeBenefit1}</span>`);
    html = html.replace('>Unlock ascension perks</span>', `>${t.prestigeBenefit2}</span>`);
    html = html.replace('>Compound growth: 1.08× per level</span>', `>${t.prestigeBenefit3}</span>`);
    html = html.replace('>Path to Transcendence</span>', `>${t.prestigeBenefit4}</span>`);
    
    // Scene 5 - Ascension
    html = html.replace('🔱 <span class="highlight">Ascension</span> Perks', t.ascensionTitle);
    html = html.replace('>Production</div>', `>${t.branchProduction}</div>`);
    html = html.replace('>Efficient Factories<br>Bulk Discount<br>Industrial Revolution<br>Singularity</div>', `>${t.branchProductionPerks}</div>`);
    html = html.replace('>Tap Power</div>', `>${t.branchTap}</div>`);
    html = html.replace('>Strong Fingers<br>Precision Taps<br>Devastating Crits<br>Godlike Taps</div>', `>${t.branchTapPerks}</div>`);
    html = html.replace('>Offline</div>', `>${t.branchOffline}</div>`);
    html = html.replace('>Passive Income<br>Head Start<br>Prestige Mastery<br>Time Warp</div>', `>${t.branchOfflinePerks}</div>`);
    html = html.replace('>Luck</div>', `>${t.branchLuck}</div>`);
    html = html.replace('>Lucky Charm<br>Treasure Hunter<br>Golden Touch<br>Fortune\'s Favor</div>', `>${t.branchLuckPerks}</div>`);
    
    // Scene 6 - Artifacts (uses <div class="artifact-rarity">)
    html = html.replace('💎 Collect <span class="highlight">Artifacts</span>', t.artifactsTitle);
    html = html.replace('>Common</div>', `>${t.rarityCommon}</div>`);
    html = html.replace('>Rare</div>', `>${t.rarityRare}</div>`);
    html = html.replace('>Epic</div>', `>${t.rarityEpic}</div>`);
    html = html.replace('>Legendary</div>', `>${t.rarityLegendary}</div>`);
    html = html.replace('>Mythic</div>', `>${t.rarityMythic}</div>`);
    html = html.replace('Fuse 3 artifacts → 1 higher rarity', t.artifactFuse);
    
    // Scene 7 - Challenges (uses <div class="name">)
    html = html.replace('🎯 Daily <span class="highlight">Challenges</span>', t.challengesTitle);
    html = html.replace('>Tap 10,000 times</div>', `>${t.challenge1}</div>`);
    html = html.replace('>Earn 1 Trillion</div>', `>${t.challenge2}</div>`);
    html = html.replace('>Reach 500 Combo</div>', `>${t.challenge3}</div>`);
    html = html.replace('>Buy 50 Generators</div>', `>${t.challenge4}</div>`);
    html = html.replace('>Prestige 3 Times</div>', `>${t.challenge5}</div>`);
    html = html.replace('>Weekly Bonus</div>', `>${t.challenge6}</div>`);
    
    // Scene 8 - Market (stock index labels)
    html = html.replace('📈 Live <span class="highlight">Market</span>', t.marketTitle);
    html = html.replace('>TECH INDEX</div>', `>${t.stockTech}</div>`);
    html = html.replace('>INDUSTRY ETF</div>', `>${t.stockIndustry}</div>`);
    html = html.replace('>COMMODITY</div>', `>${t.stockCommodity}</div>`);
    
    // Scene 9 - Leaderboards
    html = html.replace('🏆 Global <span class="highlight">Leaderboards</span>', t.leaderboardTitle);
    html = html.replace('>Lifetime Earnings</span>', `>${t.lbCat1}</span>`);
    html = html.replace('>Highest CPS</span>', `>${t.lbCat2}</span>`);
    html = html.replace('>Total Taps</span>', `>${t.lbCat3}</span>`);
    html = html.replace('>Prestige Count</span>', `>${t.lbCat4}</span>`);
    html = html.replace('>Best Combo</span>', `>${t.lbCat5}</span>`);
    html = html.replace('>Transcendence</span>', `>${t.lbCat6}</span>`);
    
    // Scene 10 - Friend Rooms (uses <span class="title">)
    html = html.replace('👥 Compete in <span class="highlight">Friend Rooms</span>', t.friendRoomsTitle);
    html = html.replace('>Factory Kings</span>', `>${t.room1Name}</span>`);
    html = html.replace('>Weekly Season</span>', `>${t.room2Name}</span>`);
    html = html.replace('>Trophy rewards!</div>', `>${t.room2Reward}</div>`);
    html = html.replace('>5 DAYS LEFT</div>', `>${t.room2TimeLeft}</div>`);
    html = html.replace('>Hall of Fame</span>', `>${t.room3Name}</span>`);
    html = html.replace('>Season Champions</div>', `>${t.room3Subtitle}</div>`);
    html = html.replace('>Eternal glory awaits</div>', `>${t.room3Desc}</div>`);
    
    // Scene 11 - Daily Rewards (text in inline style div)
    html = html.replace('🎁 <span class="highlight">Daily</span> Rewards', t.dailyRewardsTitle);
    html = html.replace('30 days of escalating rewards • Never miss a day!', t.dailyRewardsDesc);
    
    // Scene 12 - Lucky Wheel (uses plain divs with emoji prefix)
    html = html.replace('🎰 <span class="highlight">Lucky</span> Wheel', t.luckyWheelTitle);
    html = html.replace('>🪙 Bonus Coins</div>', `>🪙 ${t.wheelPrize1}</div>`);
    html = html.replace('>⏱️ Time Boosts</div>', `>⏱️ ${t.wheelPrize2}</div>`);
    html = html.replace('>💎 Rare Artifacts</div>', `>💎 ${t.wheelPrize3}</div>`);
    html = html.replace('>⭐ Prestige Points</div>', `>⭐ ${t.wheelPrize4}</div>`);
    html = html.replace('>🎰 Extra Spins</div>', `>🎰 ${t.wheelPrize5}</div>`);
    html = html.replace('>🏆 JACKPOT!</div>', `>🏆 ${t.wheelPrize6}</div>`);
    
    // Scene 13 - Respect (uses <div class="respect-title"> and <div class="respect-desc">)
    html = html.replace('A Game That <span class="highlight">Respects You</span>', t.respectTitle);
    html = html.replace('>No Forced Ads</div>', `>${t.respect1Title}</div>`);
    html = html.replace('>Ads are 100% optional. Watch for bonuses, never required.</div>', `>${t.respect1Desc}</div>`);
    html = html.replace('>No Paywalls</div>', `>${t.respect2Title}</div>`);
    html = html.replace('>All 21 generators, all features accessible completely FREE.</div>', `>${t.respect2Desc}</div>`);
    html = html.replace('>No Pay-to-Win</div>', `>${t.respect3Title}</div>`);
    html = html.replace('>Leaderboards are fair. Skill &amp; dedication, not wallet size.</div>', `>${t.respect3Desc}</div>`);
    html = html.replace('>Leaderboards are fair. Skill & dedication, not wallet size.</div>', `>${t.respect3Desc}</div>`);
    html = html.replace('>No Energy System</div>', `>${t.respect4Title}</div>`);
    html = html.replace('>Play as much as you want, whenever you want.</div>', `>${t.respect4Desc}</div>`);
    html = html.replace('>One Fair Price</div>', `>${t.respect5Title}</div>`);
    html = html.replace('>$4.99 removes ads forever + bonuses. No subscriptions.</div>', `>${t.respect5Desc}</div>`);
    
    // Scene 14 - Offline (uses h2, p, and div)
    html = html.replace('>Earn While You Sleep</h2>', `>${t.offlineTitle}</h2>`);
    html = html.replace('>Your factories never stop producing.<br>Come back to massive rewards!</p>', `>${t.offlineDesc}</p>`);
    html = html.replace('>+$847.3 TRILLION</div>', `>${t.offlineAmount}</div>`);
    
    // Scene 15 - CTA (uses inline divs and spans, plus button)
    html = html.replace('Your factory empire awaits', t.ctaText);
    html = html.replace('>🏭 21 Generators</span>', `>${t.ctaFeature1}</span>`);
    html = html.replace('>⭐ Prestige System</span>', `>${t.ctaFeature2}</span>`);
    html = html.replace('>🌍 Global Leaderboards</span>', `>${t.ctaFeature3}</span>`);
    html = html.replace('>💯 100% FREE</span>', `>${t.ctaFeature4}</span>`);
    html = html.replace('>DOWNLOAD FREE</button>', `>${t.ctaButton}</button>`);
    
    return html;
}

console.log('🎬 Building trailer pages...\n');

LANGUAGES.forEach(lang => {
    const html = translateTrailer(lang);
    const outputDir = lang === 'en' ? WEBSITE_DIR : path.join(WEBSITE_DIR, lang);
    const outputFile = path.join(outputDir, 'trailer.html');
    
    if (lang !== 'en' && !fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputFile, html, 'utf8');
    console.log(`✅ Built ${lang === 'en' ? '' : lang + '/'}trailer.html`);
});

console.log('\n🎉 Trailer pages complete!');
