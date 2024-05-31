// script.js
//elements that will be initialized with the page
document.addEventListener('DOMContentLoaded', () => {
  // constants declarations
  //popUps
  const openUpImgButton = document.getElementById('open-upload-image');
  const openCAButton = document.getElementById('open-create-album');
  const createAlbumPopup = document.getElementById('create-album-popup');
  const imageUploadPopup = document.getElementById('image-upload-popup');
  //forms
  const uploadForm = document.getElementById('uploadForm');
  const imageUpload = document.getElementById('imageUpload');
  const previewImage = document.getElementById('previewImage');
  const createAlbumForm = document.getElementById('createAlbumForm');
  //interagibles
  const cardsContainer = document.getElementById('cards'); // Use a single container for both

  //uploadimage logic
  openUpImgButton.addEventListener('click', () => {
    new bootstrap.Modal(imageUploadPopup).show();
  });

  imageUpload.addEventListener('change', function (event) {
    const file = event.target.files[0]; // Get the selected file
    const reader = new FileReader(); // Create a FileReader object

    reader.onload = function (event) {
      previewImage.src = event.target.result; // Set the image preview source
      previewImage.style = "width: 100%; height: fit-content; border-radius: 4px";
    }

    if (file) {
      reader.readAsDataURL(file); // Read the file as a data URL
    } else {
      previewImage.src = '#'; // Clear the preview if no file is selected
    }
  });

  // Function to display image on card (inside DOMContentLoaded)
  function displayImage(fileName, date) {
    // Create a new card element (clone the template)
    const template = document.getElementById('photoCardTemplate');
    const newCard = template.content.cloneNode(true).querySelector('.col'); // Clone the template content and get the .col element

    // Set the image source, text, and date for the new card
    newCard.querySelector('.card-img-top').src = `/uploads/${fileName}`;
    newCard.querySelector('.text-muted#photoFileName').textContent = fileName; // Set filename
    newCard.querySelector('.text-muted#photoUploadDate').textContent = date;

    // Add the new card to the cards container
    cardsContainer.appendChild(newCard);
  }

  // Fetch and display existing images on page load
  fetch('/fetchImages')
    .then(response => response.json())
    .then(images => {
      images.forEach(image => {
        displayImage(image.fileName, image.uploadDate);
      });
    })
    .catch(error => {
      console.error('Error fetching images:', error);
    });

  uploadForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(uploadForm);
    fetch('/upload', {
      method: 'POST',
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Upload failed');
        }
        return response.json();
      })
      .then(data => {
        const date = new Date().toLocaleDateString();
        displayImage(data.fileName, date);

        // Refresh the upload form (optional, but good practice)
        new bootstrap.Modal(imageUploadPopup).hide();
        uploadForm.reset(); // Clears the form fields
        previewImage.src = '#'; // Clears the preview image
        previewImage.style = "display: flex; justify-content: center; align-items: center;";

      })
      .catch(error => {
        console.error('Error uploading image:', error);
        // Handle the error appropriately
      });
  });
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //createAlbum logic
  openCAButton.addEventListener('click', () => {
    new bootstrap.Modal(createAlbumPopup).show();
  });

  // Create Album functionality
  createAlbumForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const albumName = document.getElementById('albumName').value;
    const albumDescription = document.getElementById('albumDescription').value;
    const albumImagesInput = document.getElementById('albumImages').value;

    // Split image names by comma and trim whitespace
    const albumImages = albumImagesInput
      .split(',')
      .map(image => image.trim());

    // Create a new album card dynamically
    const template = document.getElementById('albumCardTemplate');
    const newCard = template.content.cloneNode(true).querySelector('.col');
    const albumCard = newCard.querySelector('.card');

    // Set attributes for the new card
    albumCard.dataset.albumName = albumName;
    newCard.querySelector('.card-title').textContent = albumName;
    newCard.querySelector('.card-text').textContent = albumDescription;
    newCard.querySelector('#albumUploadDate').textContent = new Date().toLocaleDateString();

    // Add the new card to the cards container
    cardsContainer.appendChild(newCard);

    // Update the createAlbumForm data
    fetch('/createAlbum', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        albumName: albumName,
        albumDescription: albumDescription,
        albumImages: albumImages,
        creationDate: new Date().toLocaleDateString()
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Album creation failed');
        }
        return response.json();
      })
      .then(data => {
        // Handle success, possibly update the album's ID on the card
        console.log('Album created successfully:', data);
        // Close the modal and clear the form
        new bootstrap.Modal(createAlbumPopup).hide();
        createAlbumForm.reset();
      })
      .catch(error => {
        console.error('Error creating album:', error);
        // Handle the error appropriately
      });
  });

  // Fetch and display existing albums on page load
  fetch('/fetchAlbums')
    .then(response => response.json())
    .then(albums => {
      albums.forEach(album => {
        displayAlbum(album.albumName, album.albumDescription, album.albumImages, album.creationDate);
      });
    })
    .catch(error => {
      console.error('Error fetching albums:', error);
    });

  // Function to display albums on card (inside DOMContentLoaded)
  function displayAlbum(albumName, albumDescription, albumImages, creationDate) {
    const template = document.getElementById('albumCardTemplate');
    const newCard = template.content.cloneNode(true).querySelector('.col');
    const albumCard = newCard.querySelector('.card');

    // Set attributes for the new card
    albumCard.dataset.albumName = albumName;
    newCard.querySelector('.card-title').textContent = albumName;
    newCard.querySelector('.card-text').textContent = albumDescription;
    newCard.querySelector('#albumUploadDate').textContent = creationDate;

    // Set the image preview for the album (if images are provided)
    if (albumImages.length > 0) {
      const firstImage = albumImages[0]; // Get the first image from the array
      const imgElement = newCard.querySelector('.card-img-top');
      imgElement.src = `/uploads/${firstImage}`; // Set the image source
      imgElement.classList.remove('bd-placeholder-img'); // Remove the placeholder class
       // Add the new card to the cards container
      cardsContainer.appendChild(newCard);
    }
  }
  //end of DOM
});

//interactions afterpage
function deletePhoto(button) {
  const card = button.closest('.col'); // Find the parent card element
  const fileName = card.querySelector('.card-img-top').src.split('/').pop(); // Get the filename from the image source

  if (confirm(`Are you sure you want to delete this photo?`)) {
    fetch(`/deletePhoto/${fileName}`, { method: 'DELETE' })
      .then(response => {
        if (response.ok) {
          card.remove(); // Remove the card from the DOM
        } else {
          console.error('Error deleting photo');
        }
      })
      .catch(error => {
        console.error('Error deleting photo:', error);
      });
  }
}

function deleteAlbum(button) {
  const card = button.closest('.col');
  const albumName = card.querySelector('.card-title').textContent; // Get the album name from the card title

  if (confirm(`Are you sure you want to delete the album "${albumName}"?`)) {
    fetch(`/deleteAlbum/${albumName}`, { method: 'DELETE' })
      .then(response => {
        if (response.ok) {
          card.remove();
        } else {
          console.error('Error deleting album');
        }
      })
      .catch(error => {
        console.error('Error deleting album:', error);
      });
  }
}