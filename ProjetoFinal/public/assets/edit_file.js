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
    // Set the image source in the <img> tag
    const selectedImage = document.getElementById('selectedImage');
    if (selectedImage) { 
        selectedImage.src = `/uploads/${imageName}`;
    } else {
        console.error("selectedImage element not found.");
    }
});