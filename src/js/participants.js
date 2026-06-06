document.querySelectorAll('[data-participants-slider]').forEach((slider) => {
  const AUTO_DELAY = 4000;

  const section = slider.closest('.participants');
  const track = slider.querySelector('.participants__track');
  const originalSlides = Array.from(
    slider.querySelectorAll('.participants__slide')
  );

  const prevButton = section.querySelector('.participants__button--prev');
  const nextButton = section.querySelector('.participants__button--next');

  const currentCounter = section.querySelector(
    '.participants__counter-current'
  );
  const totalCounter = section.querySelector('.participants__counter-total');

  let slides = [];
  let visibleCount = 1;
  let currentIndex = 0;
  let currentRealIndex = 0;
  let autoTimer = null;
  let resizeRequest = null;
  let transitionFallback = null;
  let isAnimating = false;

  if (!track || !originalSlides.length || !prevButton || !nextButton) {
    return;
  }

  const totalSlides = originalSlides.length;

  if (totalCounter) {
    totalCounter.textContent = `/ ${totalSlides}`;
  }

  function getVisibleCount() {
    return (
      Number.parseInt(
        getComputedStyle(section).getPropertyValue(
          '--participants-visible-count'
        ),
        10
      ) || 1
    );
  }

  function getStep() {
    return visibleCount;
  }

  function createClone(slide) {
    const clone = slide.cloneNode(true);

    clone.dataset.participantsClone = 'true';
    clone.setAttribute('aria-hidden', 'true');

    return clone;
  }

  function removeClones() {
    track.querySelectorAll('[data-participants-clone]').forEach((clone) => {
      clone.remove();
    });
  }

  function setPosition(index, withTransition = true) {
    const slide = slides[index];

    if (!slide) {
      return;
    }

    if (!withTransition) {
      track.style.transition = 'none';
    } else {
      track.style.transition = '';
    }

    track.style.transform = `translate3d(-${slide.offsetLeft}px, 0, 0)`;

    if (!withTransition) {
      track.offsetHeight;
      track.style.transition = '';
    }
  }

  function updateCounter() {
    if (!currentCounter) {
      return;
    }

    currentCounter.textContent =
      ((currentRealIndex + visibleCount - 1) % totalSlides) + 1;
  }

  function updateButtons() {
    const isStatic = totalSlides <= visibleCount;

    prevButton.disabled = isStatic;
    nextButton.disabled = isStatic;
  }

  function setupSlider() {
    removeClones();

    visibleCount = Math.min(getVisibleCount(), totalSlides);

    if (totalSlides <= visibleCount) {
      slides = originalSlides;
      currentIndex = 0;
      currentRealIndex = 0;

      setPosition(currentIndex, false);
      updateCounter();
      updateButtons();
      stopAuto();

      return;
    }

    const beforeClones = originalSlides.slice(-visibleCount).map(createClone);

    const afterClones = originalSlides.slice(0, visibleCount).map(createClone);

    track.prepend(...beforeClones);
    track.append(...afterClones);

    slides = Array.from(track.querySelectorAll('.participants__slide'));

    currentRealIndex = currentRealIndex % totalSlides;
    currentIndex = visibleCount + currentRealIndex;

    setPosition(currentIndex, false);
    updateCounter();
    updateButtons();
    startAuto();
  }

  function finishTransition() {
    if (!isAnimating) {
      return;
    }

    clearTimeout(transitionFallback);
    transitionFallback = null;

    if (currentIndex >= totalSlides + visibleCount) {
      currentIndex -= totalSlides;
      setPosition(currentIndex, false);
    }

    if (currentIndex < visibleCount) {
      currentIndex += totalSlides;
      setPosition(currentIndex, false);
    }

    isAnimating = false;
  }

  function goNext() {
    if (isAnimating || totalSlides <= visibleCount) {
      return;
    }

    const step = getStep();

    isAnimating = true;
    currentRealIndex = (currentRealIndex + step) % totalSlides;
    currentIndex += step;

    setPosition(currentIndex);
    updateCounter();

    transitionFallback = setTimeout(finishTransition, 500);
  }

  function goPrev() {
    if (isAnimating || totalSlides <= visibleCount) {
      return;
    }

    const step = getStep();

    isAnimating = true;
    currentRealIndex = (currentRealIndex - step + totalSlides) % totalSlides;
    currentIndex -= step;

    setPosition(currentIndex);
    updateCounter();

    transitionFallback = setTimeout(finishTransition, 500);
  }

  function startAuto() {
    stopAuto();

    if (totalSlides <= visibleCount) {
      return;
    }

    autoTimer = setInterval(goNext, AUTO_DELAY);
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  prevButton.addEventListener('click', () => {
    goPrev();
    startAuto();
  });

  nextButton.addEventListener('click', () => {
    goNext();
    startAuto();
  });

  track.addEventListener('transitionend', (event) => {
    if (event.target === track && event.propertyName === 'transform') {
      finishTransition();
    }
  });

  slider.addEventListener('mouseenter', stopAuto);
  slider.addEventListener('mouseleave', startAuto);
  slider.addEventListener('focusin', stopAuto);
  slider.addEventListener('focusout', startAuto);

  window.addEventListener('resize', () => {
    if (resizeRequest) {
      cancelAnimationFrame(resizeRequest);
    }

    resizeRequest = requestAnimationFrame(() => {
      isAnimating = false;
      clearTimeout(transitionFallback);
      setupSlider();
    });
  });

  setupSlider();
});
