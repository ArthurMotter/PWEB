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
  const selectedImagesContainer = document.getElementById('selectedImagesContainer');

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

      // **Call displayAvaliableImages() after fetching albums**
      displayAvaliableImages();
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
    displayAvaliableImages();
    new bootstrap.Modal(createAlbumPopup).show();
  });

  // Function to display available images for adding to albums
  function displayAvaliableImages(excludeImages = [], selectElementId = 'albumImageSelect') {
    const albumImageSelect = document.getElementById(selectElementId);
    albumImageSelect.innerHTML = ''; // Clear existing options

    fetch('/fetchImages')
      .then(response => response.json())
      .then(images => {
        // Create a Set to store unique image filenames
        const uniqueImages = new Set(excludeImages);

        images.forEach(image => {
          // Only add images that are not already in the uniqueImages Set
          if (!uniqueImages.has(image.fileName)) {
            const option = document.createElement('option');
            option.value = image.fileName;
            option.textContent = image.fileName;
            albumImageSelect.appendChild(option);

            // Add the image to the Set to ensure uniqueness
            uniqueImages.add(image.fileName);
          }
        });
      })
      .catch(error => console.error('Error fetching images:', error));
  }

  // Function to handle adding images to the selected images container
  function addImageToContainer(imageName, containerId) {
    const container = document.getElementById(containerId);
    const imageDiv = document.createElement('div');
    imageDiv.classList.add('selected-image-container'); // Add a class for styling
    imageDiv.innerHTML = `
    <img src="data/uploads/${imageName}" alt="${imageName}" class="selected-image">
    <button type="button" class="btn btn-danger btn-sm remove-image" data-image-name="${imageName}">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
      </svg>
    </button>
  `;
    container.appendChild(imageDiv);

    // Add event listener to the remove button
    const removeButton = imageDiv.querySelector('.remove-image');
    removeButton.addEventListener('click', () => {
      const imageNameToRemove = removeButton.dataset.imageName;
      container.removeChild(imageDiv);

      // Also remove the image from the albumImageSelect (dropdown)
      const optionToRemove = albumImageSelect.querySelector(`option[value="${imageNameToRemove}"]`);
      if (optionToRemove) {
        albumImageSelect.remove(optionToRemove.index);
      }
    });
  }

  // Add event listener for the "Add Image" button in the create album modal
  document.getElementById('albumImageSelect').addEventListener('change', (event) => {
    const selectedImage = event.target.value;
    if (selectedImage) {
      addImageToContainer(selectedImage, 'selectedImagesContainer');
    }
  });

  // Create Album functionality
  createAlbumForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const albumName = document.getElementById('albumName').value;
    const albumDescription = document.getElementById('albumDescription').value;
    // Get selected image filenames
    const selectedImageElements = selectedImagesContainer.querySelectorAll('.selected-image');
    const albumImages = Array.from(selectedImageElements).map(image => image.src.split('/').pop());

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
        albumImages: albumImages, // Pass the array of image filenames
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
    selectedImagesContainer.innerHTML = ''; // Clear selected images
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
    const hiddenalbumId = newCard.querySelector('#albumId');
    //document.getElementById
    hiddenalbumId.value = albumId; // Set the album ID in the hidden input

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
            document.getElementById('editAlbumName').value = album.albumName;
            console.log(albumName);
            document.getElementById('editAlbumDescription').value = album.albumDescription;
            console.log(albumDescription);

            // Open the edit album popup
            new bootstrap.Modal(editAlbumPopup).show();

            // Set the album ID on the modal form (before showing the modal)
            editAlbumForm.dataset.albumId = albumId;
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

  // Function to fetch and display album details for editing
  function fetchAlbumDetails(albumId) {
    console.log("Fetching details for album ID:", albumId); // Check if correct album ID is passed

    fetch(`/fetchAlbum?albumId=${albumId}`)
      .then(response => response.json())
      .then(album => {
        console.log("Fetched album data:", album); // Check fetched album data
        document.getElementById('editAlbumName').value = album.albumName;
        document.getElementById('editAlbumDescription').value = album.albumDescription;

        // Clear any existing images in the container
        albumImagesContainer.innerHTML = '';

        // Display existing album images 
        displayAlbumImages(album.albumImages);
        console.log("Dropdown element:", document.getElementById('editAlbumImageSelect')); // Check if dropdown is found
        displayAvaliableImages([], 'editAlbumImageSelect');
      })
      .catch(error => console.error('Error fetching album details:', error));
  }

  // Function to display album images in the edit album modal
  function displayAlbumImages(images) {
    albumImagesContainer.innerHTML = ''; // Clear existing images
    images.forEach(image => {
      addImageToContainer(image, 'albumImagesContainer');
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

  // Handle form submission to update album
  editAlbumForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const albumId = editAlbumForm.dataset.albumId;
    const albumName = document.getElementById('editAlbumName').value;
    const albumDescription = document.getElementById('editAlbumDescription').value;

    // Get existing images from the albumImagesContainer
    const existingAlbumImages = Array.from(albumImagesContainer.querySelectorAll('.selected-image')).map(img => img.src.split('/').pop());

    // Get NEWLY selected images from the dropdown 
    const newAlbumImages = Array.from(document.getElementById('editAlbumImageSelect').selectedOptions).map(option => option.value);

    fetch(`/editAlbum/${albumId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        albumName,
        albumDescription,
        albumImages: newAlbumImages // Send ONLY the new images
      }),
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

  // Event Delegation for "Edit Album" buttons:
  document.addEventListener('click', function (event) {
    if (event.target.classList.contains('edit-album-button')) {
      const button = event.target;

      // Get the album ID - adjust the selector if needed
      const albumCard = button.closest('.card');
      const albumIdInput = albumCard.querySelector('#albumId');
      const albumId = albumIdInput ? albumIdInput.value : null;

      if (albumId) {
        console.log("Edit button clicked, album ID:", albumId);
        editAlbumForm.dataset.albumId = albumId;
        fetchAlbumDetails(albumId);

        // Show the Edit Album modal 
        new bootstrap.Modal(editAlbumPopup).show();
      } else {
        console.error('Album ID not found for Edit Album button');
      }
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
          console.log('Album ID:', albumId);
          if (albumId) {
            console.log("Edit button clicked, album ID:", albumId); // Add this line

            editAlbumForm.dataset.albumId = albumId;
            fetchAlbumDetails(albumId); // Fetch details first

            // Now show the modal 
            new bootstrap.Modal(editAlbumPopup).show();

            // Populate the dropdown AFTER the modal is shown
            displayAvaliableImages([], 'editAlbumImageSelect');
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