document.querySelectorAll('.stages-slider').forEach((slider) => {
  const track = slider.querySelector('.stages-slider__track');
  const slides = Array.from(slider.querySelectorAll('.stages-slider__slide'));
  const prevButton = slider.querySelector('.stages-slider__button--prev');
  const nextButton = slider.querySelector('.stages-slider__button--next');
  const dotsContainer = slider.querySelector('.stages-slider__dots');

  let currentIndex = 0;

  if (
    !track ||
    !slides.length ||
    !prevButton ||
    !nextButton ||
    !dotsContainer
  ) {
    return;
  }

  dotsContainer.innerHTML = '';

  slides.forEach((_, index) => {
    const dot = document.createElement('button');

    dot.className = 'stages-slider__dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', `Перейти к слайду ${index + 1}`);

    dot.addEventListener('click', () => {
      currentIndex = index;
      updateSlider();
    });

    dotsContainer.append(dot);
  });

  const dots = Array.from(
    dotsContainer.querySelectorAll('.stages-slider__dot')
  );

  function updateSlider() {
    const maxIndex = slides.length - 1;

    currentIndex = Math.min(currentIndex, maxIndex);
    currentIndex = Math.max(currentIndex, 0);

    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === maxIndex;

    dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === currentIndex);
    });
  }

  prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      updateSlider();
    }
  });

  nextButton.addEventListener('click', () => {
    const maxIndex = slides.length - 1;

    if (currentIndex < maxIndex) {
      currentIndex += 1;
      updateSlider();
    }
  });

  updateSlider();
});
