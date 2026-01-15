/**
 * Tap & Build - Trailer Real-Time Recorder
 * Uses Playwright's native video recording for perfect CSS animations
 * 
 * Usage: node record-trailer-realtime.js
 * Requires: npm install playwright
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const CONFIG = {
    width: 1920,
    height: 1080,
    duration: 20000,  // 20 seconds (18s trailer + 2s buffer)
};

async function recordTrailer() {
    const htmlPath = path.resolve(__dirname, 'trailer.html');
    const outputDir = __dirname;
    const outputPath = path.join(outputDir, 'trailer-output.mp4');

    console.log('🎬 Tap & Build - Real-Time Trailer Recorder');
    console.log('============================================');
    console.log(`📐 Resolution: ${CONFIG.width}x${CONFIG.height}`);
    console.log(`⏱️  Duration: ~${CONFIG.duration / 1000} seconds`);
    console.log('');

    // Launch browser with video recording enabled
    const browser = await chromium.launch({
        headless: true,
    });

    const context = await browser.newContext({
        viewport: { width: CONFIG.width, height: CONFIG.height },
        recordVideo: {
            dir: outputDir,
            size: { width: CONFIG.width, height: CONFIG.height }
        }
    });

    const page = await context.newPage();

    console.log('📱 Loading trailer...');
    await page.goto(`file://${htmlPath}?autoplay=true`);
    
    // Wait for fonts and initial render
    await page.waitForTimeout(1000);

    console.log('🎥 Recording in real-time (CSS animations play normally!)');
    console.log('');

    // Progress indicator
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        process.stdout.write(`\r⏱️  Recording: ${elapsed}s / ${Math.floor(CONFIG.duration / 1000)}s`);
    }, 500);

    // Let it play naturally - CSS animations run at normal speed!
    await page.waitForTimeout(CONFIG.duration);

    clearInterval(progressInterval);
    console.log('\n');

    // Get video path before closing
    const video = page.video();
    
    console.log('💾 Saving recording...');
    await page.close();
    await context.close();
    await browser.close();

    // Convert to high-quality MP4
    if (video) {
        const recordedPath = await video.path();
        
        if (recordedPath && fs.existsSync(recordedPath)) {
            console.log('🎬 Converting to high-quality MP4...');
            
            const ffmpegCmd = [
                'ffmpeg',
                '-y',
                '-i', `"${recordedPath}"`,
                '-c:v', 'libx264',
                '-preset', 'slow',
                '-crf', '18',
                '-pix_fmt', 'yuv420p',
                '-r', '30',                      // Force 30fps output
                '-movflags', '+faststart',
                `"${outputPath}"`
            ].join(' ');

            try {
                execSync(ffmpegCmd, { stdio: 'pipe', shell: true });
                
                // Clean up temp webm file
                fs.unlinkSync(recordedPath);
                
                const stats = fs.statSync(outputPath);
                const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
                
                console.log('');
                console.log(`✅ Video saved: ${outputPath}`);
                console.log(`📊 File size: ${sizeMB} MB`);
                console.log(`📐 Resolution: ${CONFIG.width}x${CONFIG.height}`);
            } catch (err) {
                // If FFmpeg fails, keep the webm
                const webmPath = outputPath.replace('.mp4', '.webm');
                fs.renameSync(recordedPath, webmPath);
                console.log(`✅ Video saved as WebM: ${webmPath}`);
            }
        }
    }

    console.log('');
    console.log('🎉 Recording complete!');
}

recordTrailer().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
