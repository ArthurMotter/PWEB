// script.js
//elements that will be initialized with the page
document.addEventListener('DOMContentLoaded', () => {
  // constants declarations
  //popUps
  const openPopupButton = document.getElementById('open-popup');
  const openCAButton = document.getElementById('open-create-album');
  const createAlbumPopup = document.getElementById('create-album-popup');
  const imageUploadPopup = document.getElementById('image-upload-popup');
  //forms
  const uploadForm = document.getElementById('uploadForm');
  const imageUpload = document.getElementById('imageUpload');
  const previewImage = document.getElementById('previewImage');
  const createAlbumForm = document.getElementById('createAlbumForm');
  //interagibles
  const albumsButton = document.getElementById('albums-button');
  const photosButton = document.getElementById('photos-button');
  const cards = document.querySelectorAll('.col');
  const albumCardsContainer = document.getElementById('album-cards');

  //events
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

  openPopupButton.addEventListener('click', () => {
    new bootstrap.Modal(imageUploadPopup).show();
  });

  openCAButton.addEventListener('click', () => {
    new bootstrap.Modal(createAlbumPopup).show();
  });

  albumsButton.addEventListener('click', () => {
    cards.forEach(card => {
      if (card.dataset.type === 'album') {
        card.style.display = 'block'; // Show albums
      } else {
        card.style.display = 'none'; // Hide photos
      }
    });
    albumsButton.style = "background-color: #0055ff; width: 70%;"
    photosButton.style = "background-color: gray; width: 70%;"
    openCAButton.style = "background-color: #0055ff; width: 30%;"
    openPopupButton.style = "background-color: gray; width: 30%;"
  });

  photosButton.addEventListener('click', () => {
    cards.forEach(card => {
      if (card.dataset.type === 'photo') {
        card.style.display = 'block'; // Show photos
      } else {
        card.style.display = 'none'; // Hide albums
      }
    });
    albumsButton.style = "background-color: gray; width: 70%;"
    photosButton.style = "background-color: #0055ff; width: 70%;"
    openCAButton.style = "background-color: gray; width: 30%;"
    openPopupButton.style = "background-color: #0055ff; width: 30%;"
  });

  // Initial display (show albums by default, for example):
  cards.forEach(card => {
    if (card.dataset.type === 'album') {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
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

    // Add the new card to the image-cards container
    document.getElementById('image-cards').appendChild(newCard);
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

  // Function to create and display album cards
  function displayAlbum(albumName, albumDescription, date) {
    const template = document.getElementById('albumCardTemplate');
    const newCard = template.content.cloneNode(true).querySelector('.col'); 
  
    // Set the album name, description, and date for the new card
    newCard.querySelector('.card-title').textContent = albumName;
    newCard.querySelector('.card-text').textContent = albumDescription;
    newCard.querySelector('.text-muted#albumUploadDate').textContent = date;
    newCard.dataset.albumName = albumName; // Store album name as data attribute directly on newCard
  
    // Add the new card to the album-cards container
    albumCardsContainer.appendChild(newCard);
  }

  // Function to delete an album and its cards
  function deleteAlbum(button) {
    const card = button.closest('.col'); // Find the parent card element
    const albumName = card.dataset.albumName; // Get the album name from the data attribute

    if (confirm(`Are you sure you want to delete the album "${albumName}"?`)) {
      fetch(`/deleteAlbum/${albumName}`, { method: 'DELETE' })
        .then(response => {
          if (response.ok) {
            card.remove(); // Remove the card from the DOM
          } else {
            console.error('Error deleting album');
          }
        })
        .catch(error => {
          console.error('Error deleting album:', error);
        });
    }
  }

  //fetch albums
  fetch('/fetchAlbums')
    .then(response => {
      if (!response.ok) {
        throw new Error('Error fetching albums');
      }
      return response.json();
    })
    .then(albums => {
      albums.forEach(album => {
        displayAlbum(album.name, album.description, album.date);
      });
    })
    .catch(error => {
      console.error('Error fetching albums:', error);
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
        uploadForm.reset(); // Clears the form fields
        previewImage.src = '#'; // Clears the preview image
        previewImage.style = "display: flex; justify-content: center; align-items: center;";

      })
      .catch(error => {
        console.error('Error uploading image:', error);
        // Handle the error appropriately
      });
  });

  createAlbumForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const albumTitle = document.getElementById('albumTitle').value;
    const albumDescription = document.getElementById('albumDescription').value;

    fetch('/createAlbum', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ albumTitle, albumDescription })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Album creation failed');
        }
        return response.json();
      })
      .then(data => {
        const date = new Date().toLocaleDateString();
        displayAlbum(albumTitle, albumDescription, date);

        // Close the modal
        new bootstrap.Modal(createAlbumPopup).hide();

        // Clear the form fields
        createAlbumForm.reset();
      })
      .catch(error => {
        console.error('Error creating album:', error);
        // Handle the error appropriately
      });
  });
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