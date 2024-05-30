document.addEventListener('DOMContentLoaded', () => {
  // Your JavaScript code goes here
  const openPopupButton = document.getElementById('open-popup');
  const openCAButton = document.getElementById('open-create-album');
  const imageUploadPopup = document.getElementById('image-upload-popup');
  const createAlbumPopup = document.getElementById('create-album-popup');


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

const createAlbumForm = document.getElementById('createAlbumForm');
const albumCreationResult = document.getElementById('albumCreationResult');

createAlbumForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent default form submission

  const albumTitle = document.getElementById('albumTitle').value;
  const albumDescription = document.getElementById('albumDescription').value;

  // Send the data to your server-side endpoint using fetch or AJAX
  fetch('/create-album', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title: albumTitle, description: albumDescription })
  })
    .then(response => {
      // Handle the response from the server
      if (response.ok) {
        albumCreationResult.innerHTML = '<div class="alert alert-success" role="alert">Album created successfully!</div>';
      } else {
        albumCreationResult.innerHTML = '<div class="alert alert-danger" role="alert">Error creating album.</div>';
      }
    })
    .catch(error => {
      // Handle any errors during the upload
      albumCreationResult.innerHTML = '<div class="alert alert-danger" role="alert">Error creating album.</div>';
    });
});

//image upload handling
const uploadForm = document.getElementById('uploadForm');
const imageUpload = document.getElementById('imageUpload');

//implementar
uploadForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent default form submission

  const file = imageUpload.files[0];

  if (file) {
    const formData = new FormData();
    formData.append('image', file); // Append the image file to the FormData object

    // Send the FormData object to your server-side endpoint using fetch or AJAX
    fetch('/your-upload-endpoint', {
      method: 'POST',
      body: formData
    })
      .then(response => {
        // Handle the response from the server
        console.log(response); // Example: log the response to check if the upload was successful
        // You can display a success message, update the UI, etc., here.
      })
      .catch(error => {
        // Handle any errors during the upload
        console.error('Upload Error:', error);
      });
  } else {
    alert('Please select an image to upload.');
  }
});



