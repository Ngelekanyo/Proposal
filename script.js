(() => {
  const scenes = [...document.querySelectorAll('.scene')];

  let musicOn = false;
  const soundtrack = new Audio('khuthi-piano.mp3');
  soundtrack.loop = true;
  soundtrack.preload = 'auto';
  soundtrack.volume = 0.42;

  function showScene(index) {
    scenes.forEach((scene, i) => {
      scene.hidden = i !== index;
      scene.classList.toggle('active', i === index);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.querySelectorAll('[data-next]').forEach(button => {
    button.addEventListener('click', () => {
      showScene(Number(button.dataset.next));
    });
  });

  async function startMusic() {
    if (musicOn) return;
    try {
      await soundtrack.play();
      musicOn = true;
    } catch (error) {
      // Autoplay may require the visitor to interact first.
    }
  }

  // Try autoplay; retry after user interaction if blocked.
  startMusic();
  document.addEventListener('pointerdown', startMusic);
  document.addEventListener('keydown', startMusic);

  const yesButton = document.getElementById('yes-btn');
  if (yesButton) {
    yesButton.addEventListener('click', () => {
      showScene(4);
      launchHearts();
    });
  }

  const thinkButton = document.getElementById('think-btn');
  if (thinkButton) {
    thinkButton.addEventListener('click', () => showScene(5));
  }

  const replayButton = document.getElementById('replay-btn');
  if (replayButton) {
    replayButton.addEventListener('click', () => showScene(0));
  }

  function launchHearts() {
    const symbols = ['♥', '✦', '♡'];

    for (let i = 0; i < 24; i++) {
      const heart = document.createElement('span');
      heart.textContent =
        symbols[Math.floor(Math.random() * symbols.length)];

      heart.style.cssText =
        `position:fixed;z-index:15;left:${Math.random() * 100}vw;` +
        `top:105vh;color:${i % 3 === 0 ? '#f3bdca' : '#e8a6b8'};` +
        `font-size:${12 + Math.random() * 18}px;pointer-events:none;` +
        `transition:transform ${3 + Math.random() * 2}s linear,opacity 3s;` +
        `opacity:.9;`;

      document.body.appendChild(heart);

      requestAnimationFrame(() => {
        heart.style.transform =
          `translateY(-${115 + Math.random() * 35}vh) ` +
          `rotate(${Math.random() * 140 - 70}deg)`;
        heart.style.opacity = '0';
      });

      setTimeout(() => heart.remove(), 5500);
    }
  }

  const stars = document.getElementById('stars');

  if (stars) {
    for (let i = 0; i < 55; i++) {
      const star = document.createElement('i');
      star.className = 'star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.setProperty(
        '--duration', 3 + Math.random() * 5 + 's'
      );
      star.style.setProperty(
        '--delay', Math.random() * 5 + 's'
      );
      stars.appendChild(star);
    }
  }
})();
