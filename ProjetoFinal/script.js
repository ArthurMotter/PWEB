const albumsButton = document.getElementById('albums-button');
const photosButton = document.getElementById('photos-button');
const cards = document.querySelectorAll('.col'); // Select all card containers

albumsButton.addEventListener('click', () => {
  cards.forEach(card => {
    if (card.dataset.type === 'album') {
      card.style.display = 'block'; // Show albums
    } else {
      card.style.display = 'none'; // Hide photos
    }
  });
});

photosButton.addEventListener('click', () => {
  cards.forEach(card => {
    if (card.dataset.type === 'photo') {
      card.style.display = 'block'; // Show photos
    } else {
      card.style.display = 'none'; // Hide albums
    }
  });
});

// Initial display (show albums by default, for example):
cards.forEach(card => {
  if (card.dataset.type === 'album') {
    card.style.display = 'block';
  } else {
    card.style.display = 'none';
  }
});