document.querySelectorAll('.marquee').forEach((marquee) => {
  const track = marquee.querySelector('.marquee__track');
  const group = marquee.querySelector('.marquee__group');

  if (!track || !group) {
    return;
  }

  function initMarquee() {
    track
      .querySelectorAll('.marquee__group[aria-hidden="true"]')
      .forEach((clone) => {
        clone.remove();
      });

    const baseItems = Array.from(group.children);

    baseItems.forEach((item) => {
      item.dataset.marqueeOriginal = 'true';
    });

    group
      .querySelectorAll('.marquee__item:not([data-marquee-original])')
      .forEach((item) => {
        item.remove();
      });

    while (group.scrollWidth < marquee.offsetWidth * 1.5) {
      baseItems.forEach((item) => {
        group.append(item.cloneNode(true));
      });
    }

    const cloneGroup = group.cloneNode(true);
    cloneGroup.setAttribute('aria-hidden', 'true');
    track.append(cloneGroup);
  }

  initMarquee();

  let resizeRequest = null;

  window.addEventListener('resize', () => {
    if (resizeRequest) {
      cancelAnimationFrame(resizeRequest);
    }

    resizeRequest = requestAnimationFrame(initMarquee);
  });
});
