const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

async function optimizeImage(inputPath, outputPath, quality = 0.85) {
    try {
        const img = await loadImage(inputPath);
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');
        
        ctx.drawImage(img, 0, 0);
        
        // Output as optimized PNG with compression
        const buffer = canvas.toBuffer('image/png', { 
            compressionLevel: 9,
            filters: canvas.PNG_FILTER_NONE 
        });
        
        fs.writeFileSync(outputPath, buffer);
        
        const originalSize = fs.statSync(inputPath).size;
        const newSize = buffer.length;
        const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
        
        console.log(`✓ ${inputPath}`);
        console.log(`  ${(originalSize / 1024).toFixed(0)} KB → ${(newSize / 1024).toFixed(0)} KB (${savings}% smaller)`);
        
        return newSize;
    } catch (error) {
        console.error(`✗ Error optimizing ${inputPath}:`, error.message);
    }
}

async function main() {
    console.log('🎨 Optimizing OG images...\n');
    
    const images = [
        'og-facebook.png',
        'og-twitter.png',
        'og-whatsapp.png',
        'og-premium.png'
    ];
    
    for (const img of images) {
        if (fs.existsSync(img)) {
            const tempFile = img.replace('.png', '-temp.png');
            const size = await optimizeImage(img, tempFile);
            
            // Only replace if optimization worked and file is smaller
            if (size && size < fs.statSync(img).size) {
                fs.renameSync(tempFile, img);
            } else {
                fs.unlinkSync(tempFile);
                console.log(`  Keeping original (already optimized)\n`);
            }
        }
    }
    
    console.log('\n✅ Done!');
}

main();
