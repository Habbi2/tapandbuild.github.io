const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

async function optimizeImage(inputPath, outputPath, targetSizeKB = 300) {
    try {
        const img = await loadImage(inputPath);
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');
        
        // Enable image smoothing for better quality at lower file sizes
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        ctx.drawImage(img, 0, 0);
        
        // Try different quality levels to get under target size
        let quality = 0.6;
        let buffer;
        let attempts = 0;
        
        while (attempts < 10) {
            buffer = canvas.toBuffer('image/jpeg', { quality, progressive: true });
            const sizeKB = buffer.length / 1024;
            
            if (sizeKB <= targetSizeKB) {
                break;
            }
            
            quality -= 0.05;
            attempts++;
        }
        
        // If JPEG didn't work, try PNG with max compression
        if (buffer.length / 1024 > targetSizeKB) {
            buffer = canvas.toBuffer('image/png', { 
                compressionLevel: 9,
                filters: canvas.PNG_FILTER_NONE 
            });
        }
        
        // Save with appropriate extension
        const finalPath = buffer.length / 1024 <= targetSizeKB && outputPath.endsWith('.png') 
            ? outputPath.replace('.png', '.jpg')
            : outputPath;
        
        fs.writeFileSync(finalPath, buffer);
        
        const originalSize = fs.statSync(inputPath).size;
        const newSize = buffer.length;
        const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
        
        console.log(`✓ ${inputPath}`);
        console.log(`  ${(originalSize / 1024).toFixed(0)} KB → ${(newSize / 1024).toFixed(0)} KB (${savings}% smaller)`);
        
        if (newSize / 1024 > targetSizeKB) {
            console.log(`  ⚠️  Still above ${targetSizeKB}KB target`);
        } else {
            console.log(`  ✅ Under ${targetSizeKB}KB target!`);
        }
        
        return { path: finalPath, size: newSize };
    } catch (error) {
        console.error(`✗ Error optimizing ${inputPath}:`, error.message);
        return null;
    }
}

async function main() {
    console.log('🎨 Aggressively optimizing OG images for social media...\n');
    console.log('Target: < 300 KB for optimal loading\n');
    
    const images = [
        { file: 'og-facebook.png', target: 280 },
        { file: 'og-twitter.png', target: 280 },
        { file: 'og-whatsapp.png', target: 280 },
        { file: 'og-premium.png', target: 280 }
    ];
    
    for (const { file, target } of images) {
        if (fs.existsSync(file)) {
            const result = await optimizeImage(file, file, target);
            
            if (result && result.path !== file) {
                // Renamed to .jpg, remove old .png
                if (fs.existsSync(file)) {
                    fs.unlinkSync(file);
                }
                console.log(`  📝 Renamed to JPEG format\n`);
            } else {
                console.log('');
            }
        }
    }
    
    console.log('\n✅ Optimization complete!');
    console.log('\n💡 Tip: JPEG format is more efficient for photos/screenshots.');
}

main();
