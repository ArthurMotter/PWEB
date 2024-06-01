// edit_file.js

// Get the image name from the URL
const urlParams = new URLSearchParams(window.location.search);
const imageName = urlParams.get('image');

// Fetch image metadata (name and upload date)
fetch('/fetchImageMetadata/' + imageName)
    .then(response => response.json())
    .then(data => {
        document.getElementById('photoFileName').textContent = data.fileName;
        document.getElementById('photoUploadDate').textContent = data.uploadDate;
    })
    .catch(error => {
        console.error('Error fetching image metadata:', error);
    });

document.addEventListener('DOMContentLoaded', () => {
    // Get the image element and crop button
    const imageElement = document.getElementById('selectedImage');
    const cropButton = document.getElementById('cropButton');

    // Set the image source
    if (imageElement) {
        imageElement.src = `/uploads/${imageName}`;
    } else {
        console.error("selectedImage element not found.");
    }

    // Initialize Cropper.js (for newer versions)
    let cropper = null;
    imageElement.addEventListener('load', () => {
        cropper = new Cropper(imageElement, {
            aspectRatio: 0, // Set the aspect ratio for the crop
            viewMode: 1, // Show the crop box
            movable: true,
            cropBoxMovable: true,
            cropBoxResizable: true,
        });
        // Show the crop button after the image loads
        cropButton.style.display = 'inline-block';
    });

    // Add event listener to the crop button
    cropButton.addEventListener('click', () => {
        const croppedCanvas = cropper.getCroppedCanvas({
            width: 400 // Adjust the width as needed
        });
        // Save the cropped image (replace with your server-side logic)
        croppedCanvas.toBlob(blob => {
            const formData = new FormData();
            formData.append('croppedImage', blob, 'cropped_' + imageName);
            fetch('/cropImage', { // Update this route accordingly
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (response.ok) {
                        console.log("Cropped image saved successfully!");
                        // Redirect to menu.html
                        window.location.href = '/'; 
                    } else {
                        console.error('Error saving cropped image.');
                    }
                })
                .catch(error => {
                    console.error('Error cropping image:', error);
                });
        });
        // Destroy the cropper instance
        cropper.destroy();
    });
});