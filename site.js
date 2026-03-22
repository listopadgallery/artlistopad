(function () {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-button');
  const mobilePanel = document.querySelector('.mobile-panel');
  const soundButton = document.querySelectorAll('.sound-toggle');
  let audioCtx = null;
  let masterGain = null;
  let oscillators = [];
  let soundOn = false;

  function setHeaderState() {
    if (!header) return;
    if (window.scrollY > 10) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }

  function updateSoundUi() {
    document.querySelectorAll('.sound-state').forEach((el) => {
      el.textContent = soundOn ? 'On' : 'Off';
    });
    document.querySelectorAll('.sound-toggle').forEach((el) => {
      el.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
    });
  }

  function startSound() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      audioCtx = new AC();
      masterGain = audioCtx.createGain();
      masterGain.gain.value = 0.015;
      masterGain.connect(audioCtx.destination);

      const freqs = [196, 246.94, 329.63];
      oscillators = freqs.map((f, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = i === 1 ? 'triangle' : 'sine';
        osc.frequency.value = f;
        gain.gain.value = i === 1 ? 0.04 : 0.025;
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();
        return { osc, gain };
      });
    }

    if (audioCtx.state === 'suspended') audioCtx.resume();
    soundOn = true;
    updateSoundUi();
  }

  function stopSound() {
    if (audioCtx && audioCtx.state === 'running') audioCtx.suspend();
    soundOn = false;
    updateSoundUi();
  }

  function toggleSound() {
    if (soundOn) stopSound();
    else startSound();
  }

  window.addEventListener('scroll', setHeaderState, { passive: true });
  setHeaderState();

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      const open = mobilePanel.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobilePanel.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', function () {
        mobilePanel.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
      });
    });
  }

  soundButton.forEach((btn) => btn.addEventListener('click', toggleSound));
  updateSoundUi();
})();
