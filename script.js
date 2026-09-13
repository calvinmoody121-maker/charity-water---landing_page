/**
 * charity: water Landing Page Interactive Logic
 * Controls the vertical rotating photo gallery, story popover, and modal dialogs.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Gallery photo dataset with objective action descriptions only
  const galleryData = [
    {
      id: 'apple',
      src: 'assets/images/photo-apple.jpg',
      alt: 'Hand washing a green apple under clean running water',
      title: 'Washing Fresh Fruit',
      desc: 'A person is holding a green apple with both hands, washing it under a stream of clean running water.'
    },
    {
      id: 'drinking',
      src: 'assets/images/photo-drinking.png',
      alt: 'Person drinking clean water cupped in hands from a tap',
      title: 'Drinking Clean Water',
      desc: 'A person is cupping their hands together under a brass tap to drink clean flowing water.'
    },
    {
      id: 'landscape',
      src: 'assets/images/photo-landscape.jpg',
      alt: 'Person carrying a yellow jerry can on back across landscape',
      title: 'Carrying Water Container',
      desc: 'A person with a white head covering is walking across an open landscape carrying a yellow jerry can strapped to their back.'
    },
    {
      id: 'trail',
      src: 'assets/images/photo-trail.jpg',
      alt: 'Two people carrying baskets along a dirt path',
      title: 'Walking on Mountain Trail',
      desc: 'Two people carrying large woven baskets on their backs are walking along a dirt path through mist and green vegetation.'
    },
    {
      id: 'garden',
      src: 'assets/images/photo-garden.png',
      alt: 'Woman harvesting leafy greens in garden',
      title: 'Harvesting Crops',
      desc: 'A woman wearing a sun hat and reflective vest is smiling while harvesting leafy green vegetables in a garden.'
    },
    {
      id: 'handwash',
      src: 'assets/images/photo-handwash.jpg',
      alt: 'Person washing hands under a tap into a basin',
      title: 'Washing Hands',
      desc: 'A person wearing a patterned head covering and red bangles is lathering and washing their hands under running water into a basin.'
    },
    {
      id: 'well',
      src: 'assets/images/photo-well.jpg',
      alt: 'Person standing on logs lowering container into well',
      title: 'Collecting Water from Well',
      desc: 'A person is standing on wooden logs over an open well, lowering a yellow container attached to a rope to draw water.'
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
    btnConfirmAction.textContent = 'Thank You for Donating!';
    btnConfirmAction.style.backgroundColor = '#005599';
    setTimeout(() => {
      closeModal();
      btnConfirmAction.textContent = 'Donate Today';
      btnConfirmAction.style.backgroundColor = '';
    }, 1800);
  });

  // Initial render
  renderGallery();
});

