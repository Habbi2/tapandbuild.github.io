// ===========================================
// Tap & Build - Auto Video Recorder
// ===========================================
// Generates MP4 from trailer.html automatically
//
// USAGE: node record-video.js
// OUTPUT: trailer-output.mp4 (1920x1080)
// ===========================================

const puppeteer = require('puppeteer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const CONFIG = {
    width: 1920,
    height: 1080,
    fps: 30,
    outputFile: 'trailer-output.mp4',
    trailerUrl: `file:///${path.join(__dirname, 'trailer.html').replace(/\\/g, '/')}`,
    // Scene timings (in ms) - ~18 SECONDS TOTAL
    sceneDurations: [1200, 1000, 1500, 1200, 1200, 1200, 1000, 1000, 1000, 1200, 1000, 1200, 1800, 1000, 2000],
};

const totalScenes = CONFIG.sceneDurations.length;
const totalDuration = CONFIG.sceneDurations.reduce((a, b) => a + b, 0);
console.log(`Total video duration: ${(totalDuration / 1000).toFixed(1)} seconds`);
console.log(`Total scenes: ${totalScenes}`);

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function recordTrailer() {
    console.log('\n🎬 TAP & BUILD - Video Recorder\n');
    console.log('Starting browser...');

    const browser = await puppeteer.launch({
        headless: false,  // HEADED MODE - CSS renders in real-time!
        args: [
            `--window-size=${CONFIG.width},${CONFIG.height}`,
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--allow-file-access-from-files'
        ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: CONFIG.width, height: CONFIG.height });

    console.log('Loading trailer...');
    await page.goto(CONFIG.trailerUrl, { waitUntil: 'networkidle0' });
    
    // Wait for fonts and initial render
    await sleep(1500);

    // Create frames directory
    const framesDir = path.join(__dirname, 'trailer-frames');
    if (fs.existsSync(framesDir)) {
        fs.rmSync(framesDir, { recursive: true });
    }
    fs.mkdirSync(framesDir);

    console.log('Recording frames...\n');
    
    const frameDuration = 1000 / CONFIG.fps;
    let frameIndex = 0;

    // Record each scene - script controls transitions, NOT HTML autoplay
    for (let sceneNum = 1; sceneNum <= totalScenes; sceneNum++) {
        const sceneDuration = CONFIG.sceneDurations[sceneNum - 1];
        const sceneFrames = Math.ceil(sceneDuration / frameDuration);
        
        process.stdout.write(`  Scene ${sceneNum}/${totalScenes}: ${sceneDuration}ms... `);

        // Advance to this scene (scene 1 is already showing)
        if (sceneNum > 1) {
            await page.evaluate(() => nextScene());
            await sleep(100); // Let transition start
        }

        // Capture frames for this scene
        for (let f = 0; f < sceneFrames; f++) {
            const framePath = path.join(framesDir, `frame-${String(frameIndex).padStart(6, '0')}.png`);
            await page.screenshot({ path: framePath, type: 'png' });
            frameIndex++;
            await sleep(frameDuration);
        }
        
        console.log(`done (${sceneFrames} frames)`);
    }

    console.log(`\nTotal frames captured: ${frameIndex}`);

    console.log('Closing browser...');
    await browser.close();

    console.log('Encoding video with FFmpeg...\n');
    
    await new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', [
            '-y',
            '-framerate', String(CONFIG.fps),
            '-i', path.join(framesDir, 'frame-%06d.png'),
            '-c:v', 'libx264',
            '-preset', 'slow',
            '-crf', '18',
            '-pix_fmt', 'yuv420p',
            '-movflags', '+faststart',
            CONFIG.outputFile
        ], { stdio: 'inherit' });

        ffmpeg.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`FFmpeg exited with code ${code}`));
        });

        ffmpeg.on('error', reject);
    });

    // Cleanup frames
    console.log('\nCleaning up frames...');
    fs.rmSync(framesDir, { recursive: true });

    console.log(`\n✅ Video saved: ${CONFIG.outputFile}`);
    console.log(`   Resolution: ${CONFIG.width}x${CONFIG.height}`);
    console.log(`   Duration: ${(totalDuration / 1000).toFixed(1)}s`);
    console.log(`   FPS: ${CONFIG.fps}`);
}

// Check for FFmpeg
async function checkFFmpeg() {
    return new Promise((resolve) => {
        const ffmpeg = spawn('ffmpeg', ['-version']);
        ffmpeg.on('close', (code) => resolve(code === 0));
        ffmpeg.on('error', () => resolve(false));
    });
}

// Main
(async () => {
    const hasFFmpeg = await checkFFmpeg();
    if (!hasFFmpeg) {
        console.error('❌ FFmpeg not found!');
        console.log('\nInstall FFmpeg from: https://ffmpeg.org/download.html');
        process.exit(1);
    }

    try {
        await recordTrailer();
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
})();
