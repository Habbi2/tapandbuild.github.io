// ===========================================
// Tap & Build - Sync Video Recorder
// ===========================================
// Uses CDP Virtual Time for perfect CSS sync
//
// USAGE: node record-video-sync.js
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
const frameDurationMs = 1000 / CONFIG.fps; // ~33.33ms per frame

console.log(`Total video duration: ${(totalDuration / 1000).toFixed(1)} seconds`);
console.log(`Total scenes: ${totalScenes}`);
console.log(`Frame duration: ${frameDurationMs.toFixed(2)}ms`);

async function recordTrailer() {
    console.log('\n🎬 TAP & BUILD - Sync Video Recorder\n');
    console.log('Starting browser...');

    const browser = await puppeteer.launch({
        headless: 'new',  // Headless is fine with virtual time!
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

    // Get CDP session for virtual time control
    const client = await page.target().createCDPSession();

    console.log('Loading trailer...');
    await page.goto(CONFIG.trailerUrl, { waitUntil: 'networkidle0' });

    // Create frames directory
    const framesDir = path.join(__dirname, 'trailer-frames');
    if (fs.existsSync(framesDir)) {
        fs.rmSync(framesDir, { recursive: true });
    }
    fs.mkdirSync(framesDir);

    // Enable virtual time - this makes CSS animations deterministic!
    await client.send('Emulation.setVirtualTimePolicy', {
        policy: 'pause'
    });

    console.log('Recording frames with virtual time sync...\n');
    
    let frameIndex = 0;
    let currentScene = 1;
    let timeInScene = 0;

    // Calculate total frames needed
    const totalFrames = Math.ceil(totalDuration / frameDurationMs);
    
    for (let i = 0; i < totalFrames; i++) {
        // Check if we need to advance to next scene
        while (currentScene <= totalScenes && timeInScene >= CONFIG.sceneDurations[currentScene - 1]) {
            timeInScene = 0;
            currentScene++;
            if (currentScene <= totalScenes) {
                await page.evaluate(() => nextScene());
            }
        }

        if (currentScene > totalScenes) break;

        // Capture frame
        const framePath = path.join(framesDir, `frame-${String(frameIndex).padStart(6, '0')}.png`);
        await page.screenshot({ path: framePath, type: 'png' });
        frameIndex++;

        // Advance virtual time by exactly one frame duration
        await client.send('Emulation.setVirtualTimePolicy', {
            policy: 'advance',
            budget: frameDurationMs * 1000  // microseconds
        });

        // Wait for virtual time to be granted
        await new Promise(resolve => setTimeout(resolve, 10));

        timeInScene += frameDurationMs;

        // Progress indicator
        if (frameIndex % CONFIG.fps === 0) {
            const seconds = frameIndex / CONFIG.fps;
            process.stdout.write(`\r  Progress: ${seconds.toFixed(0)}s / ${(totalDuration / 1000).toFixed(0)}s (Scene ${currentScene}/${totalScenes})`);
        }
    }

    console.log(`\n\nTotal frames captured: ${frameIndex}`);

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
