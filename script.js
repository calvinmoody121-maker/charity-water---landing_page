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

  // =========================================================================
  // Magnetic Navbar: Tracks scroll and magnetically travels downwards
  // =========================================================================
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    let isTicking = false;
    let lastScrollY = window.scrollY;

    const handleMagneticScroll = () => {
      const currentScrollY = window.scrollY;

      // When the user scrolls down anywhere past the top, magnetize the top bar
      if (currentScrollY > 12) {
        navbar.classList.add('navbar--magnet');
      } else {
        navbar.classList.remove('navbar--magnet');
      }

      lastScrollY = currentScrollY;
      isTicking = false;
    };

    window.addEventListener('scroll', () => {
      if (!isTicking) {
        window.requestAnimationFrame(handleMagneticScroll);
        isTicking = true;
      }
    }, { passive: true });

    // Initial check on page load
    handleMagneticScroll();
  }

  // =========================================================================
  // Elevate Impact: Animate Charts and Infographics when scrolled into view
  // =========================================================================
  const animatedElements = document.querySelectorAll('.stat-card, .story-item');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          
          // Animate donut chart stroke if inside card
          const donutSlices = entry.target.querySelectorAll('.donut-slice');
          donutSlices.forEach(slice => {
            slice.style.transition = 'stroke-dasharray 1.2s cubic-bezier(0.16, 1, 0.3, 1), stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
          });

          // Animate bar graph heights
          const bars = entry.target.querySelectorAll('.graph-bar');
          bars.forEach((bar, idx) => {
            bar.style.transition = `height 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.15}s, y 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.15}s`;
          });

          // Animate progress meter
          const meterFill = entry.target.querySelector('.meter-fill');
          if (meterFill) {
            meterFill.style.transition = 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
          }

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    animatedElements.forEach(el => observer.observe(el));
  } else {
    animatedElements.forEach(el => el.classList.add('in-view'));
  }
});

