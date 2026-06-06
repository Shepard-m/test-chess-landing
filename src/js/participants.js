document.querySelectorAll('[data-participants-slider]').forEach((slider) => {
  const section = slider.closest('.participants');
  const track = slider.querySelector('.participants__track');
  const slides = Array.from(slider.querySelectorAll('.participants__slide'));

  const prevButton = section.querySelector('.participants__button--prev');
  const nextButton = section.querySelector('.participants__button--next');

  const currentCounter = section.querySelector(
    '.participants__counter-current'
  );
  const totalCounter = section.querySelector('.participants__counter-total');

  let currentIndex = 0;
  let resizeRequest = null;

  if (!track || !slides.length || !prevButton || !nextButton) {
    return;
  }

  if (totalCounter) {
    totalCounter.textContent = `/ ${slides.length}`;
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

  function getMaxIndex() {
    return Math.max(0, slides.length - getVisibleCount());
  }

  function updateSlider() {
    const visibleCount = getVisibleCount();
    const maxIndex = getMaxIndex();

    currentIndex = Math.min(currentIndex, maxIndex);
    currentIndex = Math.max(currentIndex, 0);

    const offset = slides[currentIndex]?.offsetLeft || 0;

    track.style.transform = `translateX(-${offset}px)`;

    if (currentCounter) {
      currentCounter.textContent = Math.min(
        currentIndex + visibleCount,
        slides.length
      );
    }

    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === maxIndex;
  }

  prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      updateSlider();
    }
  });

  nextButton.addEventListener('click', () => {
    const maxIndex = getMaxIndex();

    if (currentIndex < maxIndex) {
      currentIndex += 1;
      updateSlider();
    }
  });

  window.addEventListener('resize', () => {
    if (resizeRequest) {
      cancelAnimationFrame(resizeRequest);
    }

    resizeRequest = requestAnimationFrame(updateSlider);
  });

  updateSlider();
});
