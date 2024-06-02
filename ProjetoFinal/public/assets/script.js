// script.js
// Declare cardsContainer globally
let cardsContainer;
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
  cardsContainer = document.getElementById('cards'); // Get the container

  // Fetch and display images and albums
  Promise.all([
    fetch('/fetchImages'),
    fetch('/fetchAlbums')
  ])
    .then(([imageResponse, albumResponse]) => {
      return Promise.all([
        imageResponse.json(),
        albumResponse.json()
      ]);
    })
    .then(([images, albums]) => {
      // DOM is now guaranteed to be ready

      // Display images
      images.forEach(image => {
        displayImage(image.fileName, image.uploadDate);
      });

      // Display albums
      albums.forEach(album => {
        displayAlbum(album.albumName, album.albumDescription, album.albumImages, album.creationDate);
      });

    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });

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

  function displayImage(fileName, date) {
    // Create a new card element (clone the template)
    const template = document.getElementById('photoCardTemplate');
    const newCard = template.content.cloneNode(true).querySelector('.col'); // Clone the template content and get the .col element

    // Set the image source, text, and date for the new card
    newCard.querySelector('.card-img-top').src = `data/uploads/${fileName}`;
    newCard.querySelector('.card-img-top').dataset.fullScreenImage = `data/uploads/${fileName}`;
    newCard.querySelector('.text-muted#photoFileName').textContent = fileName; // Set filename
    newCard.querySelector('.text-muted#photoUploadDate').textContent = date;

    // Inside the displayImage and displayAlbum functions:

    // Add event listener to the "View" button
    newCard.querySelector('.btn-group button:first-child').addEventListener('click', (event) => {
      const fullScreenImagePath = newCard.querySelector('.card-img-top').dataset.fullScreenImage;
      fullScreenImage.src = fullScreenImagePath;
      new bootstrap.Modal(viewImageModal).show();
    });

    // Add the new card to the cards container
    cardsContainer.appendChild(newCard);

    // Add event listeners *after* the card is added to the DOM
    const imageElement = newCard.querySelector('.card-img-top');
    if (imageElement) {
      imageElement.addEventListener('click', (event) => {
        const fullScreenImagePath = event.target.dataset.fullScreenImage;
        fullScreenImage.src = fullScreenImagePath;
        new bootstrap.Modal(viewImageModal).show();
      });
    }

    // Add event listeners to the "Edit" and "Delete" buttons AFTER the card is added to the DOM
    const editButton = newCard.querySelector('.btn-group button:nth-child(2)');
    if (editButton) { // Check if the element exists
      editButton.addEventListener('click', () => {
        window.location.href = `/edit_file?image=${encodeURIComponent(fileName)}`;
      });
    }

  }

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
    cardsContainer.appendChild(newCard); // This line adds the card to the DOM

    // Get the image element *after* the card is added to the DOM
    const imgElement = newCard.querySelector('.card-img-top');

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
      })
      .catch(error => {
        console.error('Error creating album:', error);
        // Handle the error appropriately
      });

    // Set the image source *after* the card is added to the DOM
    imgElement.src = `data/uploads/${albumImages[0]}`; // Get the first image from the array
    imgElement.dataset.fullScreenImage = `data/uploads/${albumImages[0]}`; // Set the full-screen image path
    imgElement.classList.remove('bd-placeholder-img'); // Remove the placeholder class

    // Close the modal and clear the form
    new bootstrap.Modal(createAlbumPopup).hide();
    createAlbumForm.reset();
  });

  // Function to display albums on card 
  function displayAlbum(albumName, albumDescription, albumImages, creationDate) {
    const template = document.getElementById('albumCardTemplate');
    const newCard = template.content.cloneNode(true).querySelector('.col');
    const albumCard = newCard.querySelector('.card');

    // Set attributes for the new card
    albumCard.dataset.albumName = albumName;
    newCard.querySelector('.card-title').textContent = albumName;
    newCard.querySelector('.card-text').textContent = albumDescription;
    newCard.querySelector('#albumUploadDate').textContent = creationDate;

    // Inside the displayImage and displayAlbum functions:
    // Update these lines to attach the listener to the image
    newCard.querySelector('.card-img-top').addEventListener('click', (event) => {
      const fullScreenImagePath = event.target.dataset.fullScreenImage;
      fullScreenImage.src = fullScreenImagePath;
      new bootstrap.Modal(viewImageModal).show();
    });

    // Add event listener to the "View" button
    newCard.querySelector('.btn-group button:first-child').addEventListener('click', (event) => {
      const fullScreenImagePath = newCard.querySelector('.card-img-top').dataset.fullScreenImage;
      fullScreenImage.src = fullScreenImagePath;
      new bootstrap.Modal(viewImageModal).show();
    });

    // Set the image preview for the album (if images are provided)
    if (albumImages.length > 0) {
      const firstImage = albumImages[0]; // Get the first image from the array
      const imgElement = newCard.querySelector('.card-img-top');
      // Use a timeout to allow the image element to be added to the DOM
      setTimeout(() => {
        imgElement.src = `data/uploads/${firstImage}`; // Set the image source
        imgElement.dataset.fullScreenImage = `data/uploads/${firstImage}`; // Set the full-screen image path
        imgElement.classList.remove('bd-placeholder-img'); // Remove the placeholder class
      }, 10); // Adjust the timeout as needed

      // Add the new card to the cards container
      cardsContainer.appendChild(newCard);
    }
  }
  //teste
  // Function to display albums in a carousel
  function displayAlbumCarousel(albumImages) {
    const carouselInner = document.getElementById('carousel-inner');
    carouselInner.innerHTML = ''; // Clear previous carousel items

    albumImages.forEach((image, index) => {
      const carouselItem = document.createElement('div');
      carouselItem.className = `carousel-item${index === 0 ? ' active' : ''}`;

      const imgElement = document.createElement('img');
      imgElement.src = `data/uploads/${image}`;
      imgElement.className = 'd-block w-100';

      carouselItem.appendChild(imgElement);
      carouselInner.appendChild(carouselItem);
    });

    new bootstrap.Carousel(document.getElementById('albumCarousel'), {
      interval: 2000, // 2 seconds interval
      wrap: true
    });
  }

  // Get the albumId from the hidden input field
  const albumId = document.getElementById('albumId').value;
  console.log('Fetched albumId:', albumId); // Log the albumId to ensure it's fetched

  // Fetch album images
  fetch(`/fetchAlbumImages?albumId=${albumId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(albumImages => {
      console.log('Fetched album images:', albumImages); // Log fetched images
      displayAlbumCarousel(albumImages);
    })
    .catch(error => {
      console.error('Error fetching album images:', error);
    });

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
