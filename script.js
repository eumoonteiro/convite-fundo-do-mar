// INTERAÇÃO DO CONVITE ANIMADO, SOM DO OCEANO & EFEITOS

document.addEventListener('DOMContentLoaded', () => {
  // Elementos do DOM
  const envelopeTrigger = document.getElementById('envelope-trigger');
  const envelopeBox = document.querySelector('.envelope-box');
  const envelopeScreen = document.getElementById('envelope-screen');
  const cardScreen = document.getElementById('invitation-card-screen');
  const btnBack = document.getElementById('btn-back');
  
  // Elementos de Áudio Ambiente
  const oceanAudio = document.getElementById('ocean-audio');
  const soundToggle = document.getElementById('sound-toggle');
  const iconSoundOn = document.querySelector('.icon-sound-on');
  const iconSoundOff = document.querySelector('.icon-sound-off');
  let isAudioPlaying = false;

  // Ajusta volume ambiente suave e baixo (25% do volume)
  if (oceanAudio) {
    oceanAudio.volume = 0.25;
  }

  // Toca o áudio com volume suavemente crescente
  function playOceanSound() {
    if (!oceanAudio) return;
    oceanAudio.play().then(() => {
      isAudioPlaying = true;
      if (soundToggle) soundToggle.classList.add('playing');
      if (iconSoundOn) iconSoundOn.classList.remove('hidden');
      if (iconSoundOff) iconSoundOff.classList.add('hidden');
    }).catch(err => {
      console.log('Autoplay com interação necessária:', err);
    });
  }

  function pauseOceanSound() {
    if (!oceanAudio) return;
    oceanAudio.pause();
    isAudioPlaying = false;
    if (soundToggle) soundToggle.classList.remove('playing');
    if (iconSoundOn) iconSoundOn.classList.add('hidden');
    if (iconSoundOff) iconSoundOff.classList.remove('hidden');
  }

  // Controle manual do botão de som
  if (soundToggle) {
    soundToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isAudioPlaying) {
        pauseOceanSound();
      } else {
        playOceanSound();
      }
    });
  }

  // 1. ANIMAÇÃO DE ABERTURA DO ENVELOPE
  if (envelopeTrigger) {
    envelopeTrigger.addEventListener('click', () => {
      // Inicia música ambiente suave de oceano no clique do envelope
      if (!isAudioPlaying) {
        playOceanSound();
      }

      // Abre a aba do envelope e sobe a carta
      envelopeBox.classList.add('open');

      // Dispara efeito de pequenas bolhas/brilhos
      createConfettiSplash();

      // Após a animação, transiciona para a tela do convite completo
      setTimeout(() => {
        envelopeScreen.classList.add('fade-out');
        
        setTimeout(() => {
          envelopeScreen.style.display = 'none';
          cardScreen.classList.remove('hidden');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 500);
      }, 950);
    });
  }

  // 2. BOTÃO FECHAR ENVELOPE (VOLTAR)
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      cardScreen.classList.add('hidden');
      envelopeScreen.style.display = 'flex';
      
      setTimeout(() => {
        envelopeScreen.classList.remove('fade-out');
        envelopeBox.classList.remove('open');
      }, 50);
    });
  }

  // 3. CANVAS DE BOLHAS SUBAQUÁTICAS
  initBubblesCanvas();

  // 4. CONTAGEM REGRESSIVA PARA 19/12
  initCountdown();
});

// CANVAS DE BOLHAS FLUTUANTES SUAVES
function initBubblesCanvas() {
  const canvas = document.getElementById('bubbles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const bubbles = [];
  const bubbleCount = 35;

  for (let i = 0; i < bubbleCount; i++) {
    bubbles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 5 + 2,
      speedY: Math.random() * 0.8 + 0.3,
      sway: Math.random() * 2,
      swaySpeed: Math.random() * 0.02 + 0.01,
      swayAngle: Math.random() * Math.PI * 2,
      alpha: Math.random() * 0.5 + 0.2
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let b of bubbles) {
      b.y -= b.speedY;
      b.swayAngle += b.swaySpeed;
      const currentX = b.x + Math.sin(b.swayAngle) * b.sway;

      // Desenha a bolha
      ctx.beginPath();
      ctx.arc(currentX, b.y, b.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha})`;
      ctx.fill();

      // Brilho da bolha
      ctx.beginPath();
      ctx.arc(currentX - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha + 0.3})`;
      ctx.fill();

      // Reseta ao sair do topo
      if (b.y < -20) {
        b.y = height + 10;
        b.x = Math.random() * width;
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

// CONTAGEM REGRESSIVA (19 de Dezembro às 12:30)
function initCountdown() {
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const now = new Date();
  let targetYear = now.getFullYear();
  let targetDate = new Date(targetYear, 11, 19, 12, 30, 0);

  if (now > targetDate) {
    targetYear++;
    targetDate = new Date(targetYear, 11, 19, 12, 30, 0);
  }

  function update() {
    const currentTime = new Date().getTime();
    const distance = targetDate.getTime() - currentTime;

    if (distance < 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = d < 10 ? '0' + d : d;
    hoursEl.textContent = h < 10 ? '0' + h : h;
    minutesEl.textContent = m < 10 ? '0' + m : m;
    secondsEl.textContent = s < 10 ? '0' + s : s;
  }

  update();
  setInterval(update, 1000);
}

// EFEITO DE PARTICULAS / BRILHO AO ABRIR O ENVELOPE
function createConfettiSplash() {
  const colors = ['#ffffff', '#bae6fd', '#38bdf8', '#cbd5e1'];
  for (let i = 0; i < 25; i++) {
    const dot = document.createElement('div');
    dot.className = 'burst-particle';
    dot.style.position = 'fixed';
    dot.style.width = Math.random() * 8 + 4 + 'px';
    dot.style.height = dot.style.width;
    dot.style.borderRadius = '50%';
    dot.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    dot.style.left = '50%';
    dot.style.top = '50%';
    dot.style.zIndex = '999';
    dot.style.pointerEvents = 'none';
    dot.style.boxShadow = '0 0 8px rgba(255,255,255,0.8)';
    
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 120 + 40;
    const destX = Math.cos(angle) * distance;
    const destY = Math.sin(angle) * distance;

    document.body.appendChild(dot);

    dot.animate([
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
      { transform: `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) scale(0)`, opacity: 0 }
    ], {
      duration: 800 + Math.random() * 400,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
      fill: 'forwards'
    });

    setTimeout(() => dot.remove(), 1200);
  }
}
