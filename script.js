(() => {
  const scenes = [...document.querySelectorAll('.scene')];
  const toast = document.getElementById('toast');
  const soundToggle = document.getElementById('sound-toggle');
  const soundLabel = document.getElementById('sound-label');

  let musicOn = false, toastTimer;
  const soundtrack = new Audio('khuthi-piano.mp3');
  soundtrack.loop = true;
  soundtrack.preload = 'auto';
  soundtrack.volume = 0.42;
  
  function showScene(index) {
    scenes.forEach((scene, i) => {
      scene.hidden = i !== index;
      scene.classList.toggle('active', i === index);
    });
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
  document.querySelectorAll('[data-next]').forEach(button =>
    button.addEventListener('click', () => showScene(Number(button.dataset.next)))
  );
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3600);
  }

  // Original gentle ambient soundscape generated in-browser; no copyrighted audio file required.
  async function startMusic() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) { showToast('This browser does not support the ambient soundtrack.'); return; }
    if (!audioContext) {
      audioContext = new AudioCtx();
      masterGain = audioContext.createGain();
      masterGain.gain.value = 0.0001;
      masterGain.connect(audioContext.destination);
      [110, 164.81, 220, 261.63, 329.63].forEach((frequency, i) => {
        const oscillator = audioContext.createOscillator();
        const voiceGain = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        oscillator.type = i === 0 ? 'sine' : 'triangle';
        oscillator.frequency.value = frequency;
        filter.type = 'lowpass'; filter.frequency.value = 650;
        voiceGain.gain.value = i === 0 ? 0.30 : 0.10;
        oscillator.connect(filter); filter.connect(voiceGain); voiceGain.connect(masterGain);
        oscillator.start();
      });
      const lfo = audioContext.createOscillator();
      const lfoGain = audioContext.createGain();
      lfo.frequency.value = 0.08; lfoGain.gain.value = 0.025;
      lfo.connect(lfoGain); lfoGain.connect(masterGain.gain); lfo.start();
    }
    try {
      await audioContext.resume();
      musicOn = true;
      masterGain.gain.setTargetAtTime(0.18, audioContext.currentTime, 1.4);
      soundToggle.setAttribute('aria-pressed', 'true');
      soundLabel.textContent = 'Sound on';
    } catch { showToast('Tap the sound button once more to start the music.'); }
  }
  function stopMusic() {
    musicOn = false;
    if (audioContext && masterGain) masterGain.gain.setTargetAtTime(0.0001, audioContext.currentTime, 0.5);
    soundToggle.setAttribute('aria-pressed', 'false');
    soundLabel.textContent = 'Sound off';
  }
  soundToggle.addEventListener('click', () => musicOn ? stopMusic() : startMusic());

  document.getElementById('yes-btn').addEventListener('click', () => { showScene(4); launchHearts(); });
  document.getElementById('think-btn').addEventListener('click', () => showScene(5));
  document.getElementById('replay-btn').addEventListener('click', () => showScene(0));

  function launchHearts() {
    const symbols = ['♥', '✦', '♡'];
    for (let i = 0; i < 24; i++) {
      const heart = document.createElement('span');
      heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];

      heart.style.cssText = `position:fixed;z-index:15;left:${Math.random()*100}vw;top:105vh;color:${i%3===0?'#f3bdca':'#e8a6b8'};font-size:${12+Math.random()*18}px;pointer-events:none;transition:transform ${3+Math.random()*2}s linear,opacity 3s;opacity:.9;`;

      document.body.appendChild(heart);
      requestAnimationFrame(() => {
        heart.style.transform = `translateY(-${115+Math.random()*35}vh) rotate(${Math.random()*140-70}deg)`;
        heart.style.opacity = '0';
      });

      setTimeout(() => heart.remove(), 5500);
    }
  }
  const stars = document.getElementById('stars');
  for (let i = 0; i < 55; i++) {
    const star = document.createElement('i');
    star.className = 'star';
    star.style.left = (Math.random()*100) + '%';
    star.style.top = (Math.random()*100) + '%';
    star.style.setProperty('--duration', (3+Math.random()*5) + 's');
    star.style.setProperty('--delay', (Math.random()*5) + 's');
    stars.appendChild(star);
  }
})();
