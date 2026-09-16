document.addEventListener('DOMContentLoaded', () => {
  const galleryData = [
    { src: 'assets/gallery-1.jpg', alt: '' },
    { src: 'assets/gallery-2.jpg', alt: '' },
    { src: 'assets/gallery-3.jpg', alt: '' },
    { src: 'assets/gallery-4.jpg', alt: '' },
    { src: 'assets/gallery-5.jpg', alt: '' },
    { src: 'assets/gallery-6.jpg', alt: '' },
    { src: 'assets/gallery-7.jpg', alt: '' }
  ];

  const totalPhotos = galleryData.length;
  let activeIndex = 2;
  let isAnimating = false;

  const track = document.getElementById('galleryTrack');
  const btnUp = document.getElementById('btnUp');
  const btnDown = document.getElementById('btnDown');
  const viewport = document.getElementById('galleryViewport');

  const cardElements = galleryData.map((item, index) => {
    const card = document.createElement('div');
    card.className = 'photo-card slot-hidden';
    card.dataset.index = String(index);

    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.alt;
    img.loading = 'lazy';

    card.appendChild(img);
    track.appendChild(card);

    card.addEventListener('click', () => {
      if (activeIndex !== index && !isAnimating) {
        setActiveIndex(index);
      }
    });

    return card;
  });

  function renderGallery() {
    cardElements.forEach((card, index) => {
      let offset = index - activeIndex;
      if (offset > Math.floor(totalPhotos / 2)) {
        offset -= totalPhotos;
      } else if (offset < -Math.floor(totalPhotos / 2)) {
        offset += totalPhotos;
      }

      card.className = 'photo-card';

      if (offset === 0) {
        card.classList.add('slot-active');
      } else if (offset === -1) {
        card.classList.add('slot-prev');
      } else if (offset === 1) {
        card.classList.add('slot-next');
      } else if (offset === -2) {
        card.classList.add('slot-far-prev');
      } else if (offset === 2) {
        card.classList.add('slot-far-next');
      } else {
        card.classList.add('slot-hidden');
      }
    });
  }

  function setActiveIndex(newIndex) {
    if (isAnimating) return;
    isAnimating = true;
    activeIndex = (newIndex + totalPhotos) % totalPhotos;
    renderGallery();
    setTimeout(() => {
      isAnimating = false;
    }, 450);
  }

  btnUp.addEventListener('click', () => setActiveIndex(activeIndex - 1));
  btnDown.addEventListener('click', () => setActiveIndex(activeIndex + 1));

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(activeIndex - 1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(activeIndex + 1);
    }
  });

  let wheelTimeout = null;
  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (wheelTimeout || isAnimating) return;

    if (e.deltaY > 20) {
      setActiveIndex(activeIndex + 1);
    } else if (e.deltaY < -20) {
      setActiveIndex(activeIndex - 1);
    }

    wheelTimeout = setTimeout(() => {
      wheelTimeout = null;
    }, 300);
  }, { passive: false });

  renderGallery();
});
