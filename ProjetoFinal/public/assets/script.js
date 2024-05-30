document.addEventListener('DOMContentLoaded', () => {
  // Your JavaScript code goes here
  const openPopupButton = document.getElementById('open-popup');
  const openCAButton = document.getElementById('open-create-album');
  const imageUploadPopup = document.getElementById('image-upload-popup');
  const createAlbumPopup = document.getElementById('create-album-popup');
  const uploadForm = document.getElementById('uploadForm');
    
    // Function to display image on card
  function displayImage(fileName, text, date) {
    const imageCard = document.querySelector('.col[data-type="photo"]'); // Assuming only one photo card for now
    const imgElement = imageCard.querySelector('.card-img-top');
    const photoText = imageCard.querySelector('.card-text');
    const uploadDate = imageCard.querySelector('.text-muted');

    imgElement.src = `/uploads/${fileName}`; // Use the filename from the upload response
    imgElement.alt = 'Photo Preview'; 
    photoText.textContent = text;
    uploadDate.textContent = date;
  }

  // Update the displayImage function to handle the new response format
  function displayImage(fileName, text, date) {
    const imageCard = document.querySelector('.col[data-type="photo"]'); // Assuming only one photo card for now
    const imgElement = imageCard.querySelector('.card-img-top');
    const photoText = imageCard.querySelector('.card-text');
    const uploadDate = imageCard.querySelector('.text-muted');

    imgElement.src = `/uploads/${fileName}`; // Use the filename from the upload response
    imgElement.alt = 'Photo Preview'; 
    photoText.textContent = text;
    uploadDate.textContent = date;
  }

  // Add logic to fetch and display existing images on page load
  fetch('/fetchImages') // Replace with your actual route to get images
    .then(response => response.json())
    .then(images => {
      images.forEach(image => {
        displayImage(image.fileName, image.text, image.uploadDate); // Update with appropriate properties
      });
    })
    .catch(error => {
      console.error('Error fetching images:', error);
    });

  //upload logic
  uploadForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(uploadForm);
    fetch('/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      // Get optional text and date from the form
      const text = document.getElementById('photoText').value; 
      const date = new Date().toLocaleDateString();
      displayImage(data.fileName, text, date);
    })
    .catch(error => {
      console.error('Error uploading image:', error);
    });
  });


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
        alert("Image Uploaded Sucessfully!")
      })
      .catch(error => {
        console.error('Error uploading image:', error);
        // Handle the error, for example:
        // Display an error message to the user
        alert("The Image cannot be uploaded, please try again")
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




