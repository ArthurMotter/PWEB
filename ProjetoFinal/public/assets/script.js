document.addEventListener('DOMContentLoaded', () => {
  // Your JavaScript code goes here
  const openPopupButton = document.getElementById('open-popup');
  const openCAButton = document.getElementById('open-create-album');
  const imageUploadPopup = document.getElementById('image-upload-popup');
  const createAlbumPopup = document.getElementById('create-album-popup');
  const uploadForm = document.getElementById('uploadForm');
    
    uploadForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent default form submission
      const formData = new FormData(uploadForm); // Create FormData for the file
      fetch('/upload', { 
        method: 'POST',
        body: formData 
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // Handle the response from the server, for example:
        // Display a success message or update the UI
      })
      .catch(error => {
        console.error('Error uploading image:', error);
        // Handle the error, for example:
        // Display an error message to the user
      });
    });

  openPopupButton.addEventListener('click', () => {
    new bootstrap.Modal(imageUploadPopup).show();
  });

  openCAButton.addEventListener('click', () => {
    new bootstrap.Modal(createAlbumPopup).show();
  });

  const albumsButton = document.getElementById('albums-button');
  const photosButton = document.getElementById('photos-button');
  const cards = document.querySelectorAll('.col');

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


});




