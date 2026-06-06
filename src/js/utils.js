(function () {
  const mq = window.matchMedia('(max-width: 760px)');

  function getVisibleParticipants() {
    const width = window.innerWidth;

    if (width <= 760) return 1;
    if (width <= 980) return 2;
    return 3;
  }

  function debounce(callback, delay = 150) {
    let timer = null;

    return function debounced(...args) {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => callback.apply(this, args), delay);
    };
  }

  window.AppUtils = {
    mq,
    getVisibleParticipants,
    debounce,
  };
}());
