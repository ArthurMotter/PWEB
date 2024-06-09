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
  const viewAlbumButtons = document.querySelectorAll('.view-album-button');
  const albumImagesModal = new bootstrap.Modal(document.getElementById('albumImagesModal'));
  const albumImagesCarouselInner = document.querySelector('#albumImagesCarousel .carousel-inner');
  //forms
  const uploadForm = document.getElementById('uploadForm');
  const imageUpload = document.getElementById('imageUpload');
  const previewImage = document.getElementById('previewImage');
  const createAlbumForm = document.getElementById('createAlbumForm');
  //interagibles
  cardsContainer = document.getElementById('cards'); // Get the containerSSS

  const editAlbumForm = document.getElementById('editAlbumForm');
  const editAlbumPopup = document.getElementById('edit-album-popup');
  const albumImageSelect = document.getElementById('albumImageSelect');
  const albumImagesContainer = document.getElementById('albumImagesContainer');

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
        displayAlbum(album.albumName, album.albumDescription, album.albumImages, album.creationDate, album.albumId);
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

        // After the album is created, fetch the album images and display the carousel
        const albumId = data.albumId; // Get the album ID from the response
        fetch(`/fetchAlbumImages?albumId=${albumId}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(albumImages => {
            console.log('Fetched album images:', albumImages); // Log fetched images
            displayAlbumCarousel(albumImages, albumId, albumCard);
          })
          .catch(error => {
            console.error('Error fetching album images:', error);
          });
      })
      .catch(error => {
        console.error('Error creating album:', error);
        // Handle the error appropriately
      });

    // Close the modal and clear the form
    new bootstrap.Modal(createAlbumPopup).hide();
    createAlbumForm.reset();
  });

  // Function to display albums on card 
  function displayAlbum(albumName, albumDescription, albumImages, creationDate, albumId) {
    const template = document.getElementById('albumCardTemplate');
    const newCard = template.content.cloneNode(true).querySelector('.col');
    const albumCard = newCard.querySelector('.card');

    // Set attributes for the new card
    albumCard.dataset.albumName = albumName;
    newCard.querySelector('.card-title').textContent = albumName;
    newCard.querySelector('.card-text').textContent = albumDescription;
    newCard.querySelector('#albumUploadDate').textContent = creationDate;
    const hiddenAlbumId = newCard.querySelector('#albumId');
    hiddenAlbumId.value = albumId; // Set the album ID in the hidden input

    // Set the image preview for the album (if images are provided)
    if (albumImages.length > 0) {
      const viewButton = newCard.querySelector('.btn-group button:first-child');
      viewButton.dataset.albumId = albumId; // Set the album ID for the view button
      viewButton.classList.add('view-album-button'); // Add a class for easier selection

      // Add event listener to the "Edit" button
      const editButton = newCard.querySelector('.btn-group button:nth-child(2)');
      editButton.dataset.albumId = albumId; // Set the album ID for the edit button
      editButton.addEventListener('click', () => {
        // Fetch album data using the albumId
        fetch(`/fetchAlbum?albumId=${albumId}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(album => {
            // Populate the edit form fields with the fetched album data
            document.getElementById('albumName').value = album.albumName;
            document.getElementById('albumDescription').value = album.albumDescription;


            // Open the edit album popup
            new bootstrap.Modal(editAlbumPopup).show();
          })
          .catch(error => {
            console.error('Error fetching album data:', error);
          });
      });

      cardsContainer.appendChild(newCard);

      // Add the carousel to the album card
      displayAlbumCarousel(albumImages, albumId, albumCard); // Pass the album ID and card element

      // Add event listeners *after* the card is added to the DOM
      if (viewButton) {
        viewButton.addEventListener('click', () => {
          showAlbumImagesModal(albumId);
        });
      }
    }
  }

  // Function to fetch and display album details
  function fetchAlbumDetails(albumId) {
    fetch(`/fetchAlbum?albumId=${albumId}`)
      .then(response => response.json())
      .then(album => {
        document.getElementById('editAlbumName').value = album.albumName;
        document.getElementById('editAlbumDescription').value = album.albumDescription;
        displayAlbumImages(album.albumImages);
      })
      .catch(error => console.error('Error fetching album details:', error));
  }

  // Function to display album images
  function displayAlbumImages(images) {
    albumImagesContainer.innerHTML = ''; // Clear existing images
    images.forEach(image => {
      const imgElement = document.createElement('img');
      imgElement.src = `data/uploads/${image}`;
      imgElement.classList.add('album-image');
      imgElement.dataset.fileName = image;
      albumImagesContainer.appendChild(imgElement);

      // Add remove button
      const removeButton = document.createElement('button');
      removeButton.textContent = 'Remove';
      removeButton.addEventListener('click', () => {
        albumImagesContainer.removeChild(imgElement);
      });
      imgElement.appendChild(removeButton);
    });
  }

  function showAlbumImagesModal(albumId) {
    fetch(`/fetchAlbumImages?albumId=${albumId}`)
      .then(response => response.json())
      .then(images => {
        const albumImagesCarouselInner = document.querySelector('#albumImagesCarousel .carousel-inner');
        albumImagesCarouselInner.innerHTML = ''; // Clear existing images

        images.forEach((image, index) => {
          const carouselItem = document.createElement('div');
          carouselItem.classList.add('carousel-item');
          if (index === 0) carouselItem.classList.add('active');

          const img = document.createElement('img');
          img.src = `data/uploads/${image}`;
          img.classList.add('d-block', 'w-100');
          carouselItem.appendChild(img);

          albumImagesCarouselInner.appendChild(carouselItem);
        });

        const albumImagesModal = new bootstrap.Modal(document.getElementById('albumImagesModal'));
        albumImagesModal.show();
      })
      .catch(error => {
        console.error('Error fetching album images:', error);
      });
  }

  function displayAlbumCarousel(albumImages, albumId, albumCard) {
    const carouselInner = albumCard.querySelector('#albumCarousel .carousel-inner');
    carouselInner.innerHTML = ''; // Clear existing images

    // Create carousel indicators
    const carouselIndicators = albumCard.querySelector('#albumCarousel .carousel-indicators');
    if (carouselIndicators) {
      carouselIndicators.innerHTML = '';
    }

    albumImages.forEach((imageSrc, index) => {
      // Create carousel item
      const carouselItem = document.createElement('div');
      carouselItem.className = 'carousel-item';

      if (index === 0) {
        carouselItem.classList.add('active');
      }

      // Create image element
      const img = document.createElement('img');
      img.src = `data/uploads/${imageSrc}`;
      img.className = 'd-block w-100';
      img.alt = `Album Image ${index + 1}`; // Add alt text for accessibility

      // Add image to carousel item
      carouselItem.appendChild(img);

      // Add the newly created carousel item to the DOM
      carouselInner.appendChild(carouselItem);

      // Create carousel indicator
      const indicator = document.createElement('li');
      indicator.dataset.bsTarget = '#albumCarousel';
      indicator.dataset.bsSlideTo = index;
      if (index === 0) {
        indicator.classList.add('active');
      }
      carouselIndicators.appendChild(indicator);
    });

    // **Add this line to make the carousel unique for each album**
    albumCard.querySelector('#albumCarousel').id = `albumCarousel-${albumId}`;

    // Initialize the carousel (after creating the structure)
    const carousel = new bootstrap.Carousel(albumCard.querySelector(`#albumCarousel-${albumId}`));

    // Initialize the carousel
    const albumCarousel = albumCard.querySelector(`#albumCarousel-${albumId}`);
    new bootstrap.Carousel(albumCarousel);

    // Target the correct "Previous" and "Next" buttons
    const prevButton = albumCard.querySelector(`#albumCarousel-${albumId} .carousel-control-prev`);
    const nextButton = albumCard.querySelector(`#albumCarousel-${albumId} .carousel-control-next`)

    if (prevButton && nextButton) {
      prevButton.addEventListener('click', () => {
        carousel.prev();
      });
      nextButton.addEventListener('click', () => {
        carousel.next();
      });
    }
  }

  //view album 
  viewAlbumButtons.forEach(button => {
    button.addEventListener('click', event => {
      const albumId = button.dataset.albumId;
      fetch(`/fetchAlbumImages?albumId=${albumId}`)
        .then(response => response.json())
        .then(albumImages => {
          albumImagesCarouselInner.innerHTML = ''; // Clear previous images

          albumImages.forEach((imageSrc, index) => {
            const carouselItem = document.createElement('div');
            carouselItem.className = 'carousel-item';
            if (index === 0) {
              carouselItem.classList.add('active');
            }
            const img = document.createElement('img');
            img.src = `data/uploads/${imageSrc}`;
            img.className = 'd-block w-100';
            carouselItem.appendChild(img);
            albumImagesCarouselInner.appendChild(carouselItem);
          });

          albumImagesModal.show();
        })
        .catch(error => console.error('Error fetching album images:', error));
    });
  });

  // Function to display available images to add to album
  function displayAvailableImages() {
    fetch('/fetchImages')
      .then(response => response.json())
      .then(images => {
        albumImageSelect.innerHTML = ''; // Clear existing options
        images.forEach(image => {
          const option = document.createElement('option');
          option.value = image.fileName;
          option.textContent = image.fileName;
          albumImageSelect.appendChild(option);
        });
      })
      .catch(error => console.error('Error fetching images:', error));
  }

  // Handle form submission to update album
  editAlbumForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const albumId = editAlbumForm.dataset.albumId;
    if (!albumId) {
      console.error('Album ID is missing');
      return;
    }
    const albumName = document.getElementById('editAlbumName').value;
    const albumDescription = document.getElementById('editAlbumDescription').value;
    const albumImages = Array.from(albumImagesContainer.querySelectorAll('.album-image')).map(img => img.dataset.fileName);

    fetch(`/editAlbum/${albumId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ albumName, albumDescription, albumImages }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.error('Error updating album:', data.error);
        } else {
          console.log('Album updated successfully:', data);
          // Close the modal and refresh the album list if needed
          new bootstrap.Modal(editAlbumPopup).hide();
        }
      })
      .catch(error => console.error('Error updating album:', error));
  });

  // Event listener for adding new images to the album
  document.getElementById('addImageToAlbum').addEventListener('click', () => {
    const selectedImage = albumImageSelect.value;
    if (selectedImage) {
      const imgElement = document.createElement('img');
      imgElement.src = `data/uploads/${selectedImage}`;
      imgElement.classList.add('album-image');
      imgElement.dataset.fileName = selectedImage;
      albumImagesContainer.appendChild(imgElement);

      // Add remove button
      const removeButton = document.createElement('button');
      removeButton.textContent = 'Remove';
      removeButton.addEventListener('click', () => {
        albumImagesContainer.removeChild(imgElement);
      });
      imgElement.appendChild(removeButton);
    }
  });

  // Fetch and display album details when edit button is clicked
  document.querySelectorAll('.edit-album-button').forEach(button => {
    button.addEventListener('click', (event) => {
      const albumCard = event.target.closest('.album-card');
      if (albumCard) {
        const albumIdInput = albumCard.querySelector('#albumId');
        if (albumIdInput) {
          const albumId = albumIdInput.value;
          console.log('Album ID:', albumId);  // Debugging line to check if album ID is correctly fetched
          if (albumId) {
            editAlbumForm.dataset.albumId = albumId;
            fetchAlbumDetails(albumId);
            displayAvailableImages();
            new bootstrap.Modal(editAlbumPopup).show();
          } else {
            console.error('Album ID is empty in the hidden input');
          }
        } else {
          console.error('Hidden input with album ID not found in album card');
        }
      } else {
        console.error('Album card not found');
      }
    });
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