// imageUtils.ts

/**
 * Image compression, resizing, and processing utilities
 */

/**
 * Compress image to reduce its file size
 * @param {File} imageFile - The image file to compress
 * @returns {Promise<Blob>} - The compressed image as a Blob
 */
async function compressImage(imageFile) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(imageFile);
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            // Set canvas dimensions to image dimensions
            canvas.width = img.width;
            canvas.height = img.height;
            // Draw the image on the canvas
            ctx.drawImage(img, 0, 0);
            // Compress the image
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Compression failed')); 
                }
            }, 'image/jpeg', 0.8); // 80% quality
        };
        img.onerror = (error) => {
            reject(error);
        };
    });
}

/**
 * Resize image to new dimensions
 * @param {File} imageFile - The image file to resize
 * @param {number} width - The desired width
 * @param {number} height - The desired height
 * @returns {Promise<Blob>} - The resized image as a Blob
 */
async function resizeImage(imageFile, width, height) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(imageFile);
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Resizing failed'));
                }
            }, imageFile.type, 0.8);
        };
        img.onerror = (error) => {
            reject(error);
        };
    });
}

/**
 * Process image with compression and resizing
 * @param {File} imageFile - The image file to process
 * @param {number} targetWidth - The target width after resizing
 * @param {number} targetHeight - The target height after resizing
 * @returns {Promise<Blob>} - The processed image as a Blob
 */
async function processImage(imageFile, targetWidth, targetHeight) {
    const compressedImage = await compressImage(imageFile);
    const processedImage = await resizeImage(compressedImage, targetWidth, targetHeight);
    return processedImage;
}

export { compressImage, resizeImage, processImage };