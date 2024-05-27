document.addEventListener('DOMContentLoaded', () => {
    // Your JavaScript code goes here
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
        albumsButton.style="background-color: #0055ff; width: 40%"
        photosButton.style="background-color: gray; width: 40%"
      });
      
      photosButton.addEventListener('click', () => {
        cards.forEach(card => {
          if (card.dataset.type === 'photo') {
            card.style.display = 'block'; // Show photos
          } else {
            card.style.display = 'none'; // Hide albums
          }
        });
        albumsButton.style="background-color: gray; width: 40%"
        photosButton.style="background-color: #0055ff; width: 40%"
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

