/* Return Here guides: small, optional enhancements. Runs in the browser; nothing is sent anywhere. */
(() => {
  document.documentElement.classList.add('js');

  /* Put the visitor's own store first, as the landing page does. */
  const ua = navigator.userAgent || '';
  const isIOS = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  const mine = isIOS ? 'ios' : /Android/.test(ua) ? 'android' : null;
  if (mine) {
    document.querySelectorAll('.store-buttons').forEach((group) => {
      const own = group.querySelector('[data-store="' + mine + '"]');
      const other = group.querySelector('[data-store]:not([data-store="' + mine + '"])');
      if (!own || !other) return;
      group.prepend(own);
      own.classList.replace('button-outline', 'button-primary');
      other.classList.replace('button-primary', 'button-outline');
    });
  }

  /* Breathing pacer: four seconds in, four seconds out, three times. */
  const pacer = document.querySelector('[data-pacer]');
  if (pacer) {
    const button = pacer.querySelector('.pacer-button');
    const status = pacer.querySelector('.pacer-status');
    const ROUNDS = 3;
    let timers = [];
    const stop = (message) => {
      timers.forEach(window.clearTimeout);
      timers = [];
      button.classList.remove('is-inhale', 'is-exhale');
      button.textContent = 'Begin';
      status.textContent = message || '';
    };
    const start = () => {
      stop();
      button.textContent = 'Stop';
      for (let round = 0; round < ROUNDS; round += 1) {
        timers.push(window.setTimeout(() => {
          button.classList.remove('is-exhale');
          button.classList.add('is-inhale');
          status.textContent = 'Breathe in.';
        }, round * 8000 + 50));
        timers.push(window.setTimeout(() => {
          button.classList.replace('is-inhale', 'is-exhale');
          status.textContent = 'Breathe out.';
        }, round * 8000 + 4000));
      }
      timers.push(window.setTimeout(() => stop('Now name the one next thing.'), ROUNDS * 8000));
    };
    button.addEventListener('click', () => (timers.length ? stop() : start()));
    document.addEventListener('visibilitychange', () => { if (document.hidden && timers.length) stop(); });
  }

  /* Phrase player: recordings from the app, in its four voices. */
  const player = document.querySelector('[data-player]');
  if (player) {
    const audio = new Audio();
    audio.preload = 'none';
    const voices = player.querySelectorAll('[data-voice]');
    const clips = player.querySelectorAll('[data-clip]');
    let voice = 'willow';
    let playing = null;
    let playbackToken = 0;
    const label = (clip, on) => {
      const hidden = clip.querySelector('.visually-hidden');
      if (hidden) hidden.textContent = on ? 'Stop' : 'Play';
    };
    const mark = (clip) => {
      if (playing) { playing.classList.remove('is-playing'); label(playing, false); }
      playing = clip;
      if (clip) { clip.classList.add('is-playing'); label(clip, true); }
    };
    const stop = () => { playbackToken += 1; audio.pause(); mark(null); };
    const play = (clip) => {
      const token = ++playbackToken;
      audio.pause();
      audio.src = '/assets/audio/' + voice + '-' + clip.dataset.clip + '.mp3';
      mark(clip);
      const attempt = audio.play();
      if (attempt) attempt.catch(() => { if (token === playbackToken) mark(null); });
    };
    audio.addEventListener('ended', () => mark(null));
    clips.forEach((clip) => clip.addEventListener('click', () => (playing === clip ? stop() : play(clip))));
    voices.forEach((button) => button.addEventListener('click', () => {
      voice = button.dataset.voice;
      voices.forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
      if (playing) play(playing);
    }));
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  }
})();
