/**
 * charity: water Landing Page Interactive Logic
 * Controls the vertical rotating photo gallery, story popover, and modal dialogs.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Gallery photo dataset with context and impact stories
  const galleryData = [
    {
      id: 'apple',
      src: 'assets/images/photo-apple.jpg',
      alt: 'Clean water washing fresh green apple',
      title: 'Nourishment & Health',
      desc: 'Access to safe, running water ensures clean food preparation and protects children from waterborne illnesses.',
      location: '📍 Tigray Region, Ethiopia'
    },
    {
      id: 'drinking',
      src: 'assets/images/photo-drinking.png',
      alt: 'Woman drinking clean water cupped in hands from brass tap',
      title: 'Dignity at the Tap',
      desc: 'Piped water tap stands bring clean, pure drinking water straight into village communities for the very first time.',
      location: '📍 Odisha, India'
    },
    {
      id: 'landscape',
      src: 'assets/images/photo-landscape.jpg',
      alt: 'Woman carrying yellow jerry can across hillside',
      title: 'Breaking the Walk for Water',
      desc: 'Women and children often spend up to 4 hours every day walking just to collect contaminated water.',
      location: '📍 Amhara, Ethiopia'
    },
    {
      id: 'trail',
      src: 'assets/images/photo-trail.jpg',
      alt: 'Two people carrying baskets on misty hill path',
      title: 'Transforming Remote Villages',
      desc: 'Clean water initiatives eliminate treacherous daily journeys and allow children to stay in school.',
      location: '📍 Helambu, Nepal'
    },
    {
      id: 'garden',
      src: 'assets/images/photo-garden.png',
      alt: 'Smiling woman farmer in lush green vegetable garden',
      title: 'Empowered Farming & Abundance',
      desc: 'Community-managed water wells irrigate crops and empower sustainable women-led agricultural cooperatives.',
      location: '📍 Mwenezi, Zimbabwe'
    },
    {
      id: 'handwash',
      src: 'assets/images/photo-handwash.jpg',
      alt: 'Hands washing under water tap into copper basin',
      title: 'Hygiene & Lifesaving Sanitation',
      desc: 'Reliable community water points supply clean water for handwashing stations, halting preventable disease.',
      location: '📍 Sindhupalchok, Nepal'
    },
    {
      id: 'well',
      src: 'assets/images/photo-well.jpg',
      alt: 'Feet on wooden logs lowering jerry can into well',
      title: 'The Challenge of Open Wells',
      desc: 'Unprotected dug wells are dangerous and susceptible to contamination before charity: water drilling teams arrive.',
      location: '📍 Wamba District, DRC'
    }
  ];

  const totalPhotos = galleryData.length;
  let activeIndex = 0; // Starts at photo-apple.jpg to match reference screenshot exactly
  let isAnimating = false;

  // DOM Elements
  const track = document.getElementById('galleryTrack');
  const btnUp = document.getElementById('btnUp');
  const btnDown = document.getElementById('btnDown');
  const btnInfo = document.getElementById('btnInfo');
  const infoPopover = document.getElementById('photoInfoPopover');
  const btnCloseInfo = document.getElementById('btnCloseInfo');
  const infoTitle = document.getElementById('infoTitle');
  const infoDesc = document.getElementById('infoDesc');
  const infoLocation = document.getElementById('infoLocation');

  // Modal elements
  const saveModal = document.getElementById('saveModal');
  const navSaveBtn = document.getElementById('navSaveBtn');
  const heroSaveBtn = document.getElementById('heroSaveBtn');
  const btnModalClose = document.getElementById('btnModalClose');
  const btnConfirmAction = document.getElementById('btnConfirmAction');

  // 1. Initialize Photo Cards in Track
  const cardElements = galleryData.map((item, index) => {
    const card = document.createElement('div');
    card.className = 'photo-card slot-hidden';
    card.dataset.index = index;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', item.title);

    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.alt;
    img.loading = 'lazy';

    card.appendChild(img);
    track.appendChild(card);

    // Clicking any card brings it to the active center
    card.addEventListener('click', () => {
      if (activeIndex !== index && !isAnimating) {
        setActiveIndex(index);
      }
    });

    // Keyboard support on card
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setActiveIndex(index);
      }
    });

    return card;
  });

  /**
   * Updates card positioning classes based on offset from activeIndex
   */
  function renderGallery() {
    cardElements.forEach((card, index) => {
      // Calculate shortest circular distance
      let offset = index - activeIndex;
      if (offset > Math.floor(totalPhotos / 2)) {
        offset -= totalPhotos;
      } else if (offset < -Math.floor(totalPhotos / 2)) {
        offset += totalPhotos;
      }

      // Reset slot classes
      card.className = 'photo-card';

      if (offset === 0) {
        card.classList.add('slot-active');
        card.setAttribute('aria-current', 'true');
      } else if (offset === -1) {
        card.classList.add('slot-prev');
        card.removeAttribute('aria-current');
      } else if (offset === 1) {
        card.classList.add('slot-next');
        card.removeAttribute('aria-current');
      } else if (offset === -2) {
        card.classList.add('slot-far-prev');
        card.removeAttribute('aria-current');
      } else if (offset === 2) {
        card.classList.add('slot-far-next');
        card.removeAttribute('aria-current');
      } else {
        card.classList.add('slot-hidden');
        card.removeAttribute('aria-current');
      }
    });

    // Update popover content for active image
    updatePopoverContent();
  }

  function updatePopoverContent() {
    const activeData = galleryData[activeIndex];
    infoTitle.textContent = activeData.title;
    infoDesc.textContent = activeData.desc;
    infoLocation.textContent = activeData.location;
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

  // Navigation handlers
  // In our vertical stack:
  // Up button shifts reel downward (bringing the card above into the center)
  btnUp.addEventListener('click', () => {
    setActiveIndex(activeIndex - 1);
  });

  // Down button shifts reel upward (bringing the card below into the center)
  btnDown.addEventListener('click', () => {
    setActiveIndex(activeIndex + 1);
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (document.activeElement && document.activeElement.tagName === 'INPUT') return;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(activeIndex - 1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(activeIndex + 1);
    } else if (e.key === 'Escape') {
      closeInfoPopover();
      closeModal();
    }
  });

  // Wheel scrolling inside gallery viewport
  const viewport = document.getElementById('galleryViewport');
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

  // Info Popover Toggle
  function toggleInfoPopover() {
    infoPopover.classList.toggle('active');
    infoPopover.setAttribute('aria-hidden', !infoPopover.classList.contains('active'));
  }

  function closeInfoPopover() {
    infoPopover.classList.remove('active');
    infoPopover.setAttribute('aria-hidden', 'true');
  }

  btnInfo.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleInfoPopover();
  });

  btnCloseInfo.addEventListener('click', () => {
    closeInfoPopover();
  });

  document.addEventListener('click', (e) => {
    if (!infoPopover.contains(e.target) && !btnInfo.contains(e.target)) {
      closeInfoPopover();
    }
  });

  // Save Modal Controls
  function openModal() {
    saveModal.classList.add('active');
    saveModal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    saveModal.classList.remove('active');
    saveModal.setAttribute('aria-hidden', 'true');
  }

  navSaveBtn.addEventListener('click', openModal);
  heroSaveBtn.addEventListener('click', openModal);
  btnModalClose.addEventListener('click', closeModal);

  saveModal.addEventListener('click', (e) => {
    if (e.target === saveModal) {
      closeModal();
    }
  });

  btnConfirmAction.addEventListener('click', () => {
    btnConfirmAction.textContent = 'Thank You for Saving Lives!';
    btnConfirmAction.style.backgroundColor = '#005599';
    setTimeout(() => {
      closeModal();
      btnConfirmAction.textContent = 'Give Clean Water';
      btnConfirmAction.style.backgroundColor = '';
    }, 1800);
  });

  // Initial render
  renderGallery();
});

