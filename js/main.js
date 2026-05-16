/* ============================================================
   TRITIMA ACHIGBU — main.js
   ============================================================ */

(function () {

  /* ── MOBILE NAV ─────────────────────────────────────────── */
  var hamburger     = document.getElementById('hamburger');
  var closeNav      = document.getElementById('closeNav');
  var mobileOverlay = document.getElementById('mobileOverlay');

  function openMenu()  {
    mobileOverlay.classList.add('open');
    mobileOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    mobileOverlay.classList.remove('open');
    mobileOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (hamburger)     hamburger.addEventListener('click', openMenu);
  if (closeNav)      closeNav.addEventListener('click', closeMenu);
  if (mobileOverlay) {
    mobileOverlay.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ── INTERACTIVE IMAGE CANVAS ───────────────────────────── */
  var lightbox     = document.getElementById('lightbox');
  var lbImg        = document.getElementById('lbImg');
  var lbClose      = document.getElementById('lbClose');
  var lbPrev       = document.getElementById('lbPrev');
  var lbNext       = document.getElementById('lbNext');
  var currentImgs  = [];
  var currentIndex = 0;

  /* One shared mousemove/touchmove handler — avoids stacking listeners */
  var activeImg    = null;
  var didMove      = false;
  var startMouseX  = 0;
  var startMouseY  = 0;
  var startLeft    = 0;
  var startTop     = 0;
  var activeImgSet = [];
  var activeIdx    = 0;

  document.querySelectorAll('.image-canvas').forEach(function (canvas) {
    var imgs = Array.from(canvas.querySelectorAll('.canvas-img'));

    imgs.forEach(function (img, idx) {

      function startDrag(clientX, clientY) {
        activeImg    = img;
        activeImgSet = imgs;
        activeIdx    = idx;
        didMove      = false;
        startMouseX  = clientX;
        startMouseY  = clientY;

        /* Convert any %-based position to px so drag arithmetic works */
        startLeft = img.offsetLeft;
        startTop  = img.offsetTop;
        img.style.left = startLeft + 'px';
        img.style.top  = startTop  + 'px';

        /* Keep existing rotation, just clear any non-rotate transforms */
        var rot = img.style.transform || 'rotate(0deg)';
        img.style.transform = rot;

        /* Bring to front */
        imgs.forEach(function (i) { i.style.zIndex = 1; });
        img.style.zIndex = 10;
      }

      img.addEventListener('mousedown', function (e) {
        e.preventDefault();
        startDrag(e.clientX, e.clientY);
      });

      img.addEventListener('touchstart', function (e) {
        startDrag(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: true });
    });
  });

  /* Global move */
  document.addEventListener('mousemove', function (e) {
    if (!activeImg) return;
    var dx = e.clientX - startMouseX;
    var dy = e.clientY - startMouseY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) didMove = true;
    activeImg.style.left = (startLeft + dx) + 'px';
    activeImg.style.top  = (startTop  + dy) + 'px';
  });

  document.addEventListener('touchmove', function (e) {
    if (!activeImg) return;
    var t  = e.touches[0];
    var dx = t.clientX - startMouseX;
    var dy = t.clientY - startMouseY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) didMove = true;
    activeImg.style.left = (startLeft + dx) + 'px';
    activeImg.style.top  = (startTop  + dy) + 'px';
  }, { passive: true });

  /* Global end */
  function endDrag() {
    if (!activeImg) return;
    if (!didMove) {
      currentImgs  = activeImgSet;
      currentIndex = activeIdx;
      openLightbox();
    }
    activeImg = null;
  }

  document.addEventListener('mouseup',  endDrag);
  document.addEventListener('touchend', endDrag);

  /* ── LIGHTBOX ───────────────────────────────────────────── */
  function openLightbox() {
    if (!lightbox) return;
    lbImg.src = currentImgs[currentIndex].src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  function prevImage() {
    currentIndex = (currentIndex - 1 + currentImgs.length) % currentImgs.length;
    lbImg.src = currentImgs[currentIndex].src;
  }
  function nextImage() {
    currentIndex = (currentIndex + 1) % currentImgs.length;
    lbImg.src = currentImgs[currentIndex].src;
  }

  if (lbClose)  lbClose.addEventListener('click', closeLightbox);
  if (lbPrev)   lbPrev.addEventListener('click',  prevImage);
  if (lbNext)   lbNext.addEventListener('click',  nextImage);
  if (lightbox) lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (mobileOverlay && mobileOverlay.classList.contains('open') && e.key === 'Escape') {
      closeMenu(); return;
    }
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowLeft')  prevImage();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'Escape')     closeLightbox();
  });

})();
