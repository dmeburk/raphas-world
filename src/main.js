import './style.css';

/* --- RAPHA'S WORLD MAIN APPLICATION SCRIPT --- */

// --- AUDIO SYNTHESIZER ENGINE (Web Audio API) ---
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Generate bleeps, bloops, lasers, and explosions on the fly!
function playSynthSound(type) {
  try {
    initAudio();
    const ctx = audioCtx;
    const dest = ctx.destination;

    // Trigger visualizer bar bouncing
    animateVisualizer();

    if (type === 'laser') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(dest);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(850, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.25);

      osc.start();
      osc.stop(ctx.currentTime + 0.26);

    } else if (type === 'jump') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(dest);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(650, ctx.currentTime + 0.16);

      gain.gain.setValueAtTime(0.22, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.16);

      osc.start();
      osc.stop(ctx.currentTime + 0.17);

    } else if (type === 'coin') {
      // Classic double-tone
      const playTone = (freq, start, dur) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(dest);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + start);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + start + dur);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + dur);
      };
      playTone(987.77, 0, 0.07); // B5
      playTone(1318.51, 0.08, 0.15); // E6

    } else if (type === 'powerup') {
      // Arpeggio
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4, E4, G4, C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(dest);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + (idx * 0.06));
        gain.gain.setValueAtTime(0.1, ctx.currentTime + (idx * 0.06));
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + (idx * 0.06) + 0.12);
        osc.start(ctx.currentTime + (idx * 0.06));
        osc.stop(ctx.currentTime + (idx * 0.06) + 0.13);
      });

    } else if (type === 'explosion') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(dest);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(30, ctx.currentTime + 0.45);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);

      osc.start();
      osc.stop(ctx.currentTime + 0.46);

    } else if (type === 'teleport') {
      // Fast pitch vibrato slide
      const osc = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const gain = ctx.createGain();

      lfo.frequency.value = 35; // Fast pitch bounce
      lfoGain.gain.value = 80;

      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      osc.connect(gain);
      gain.connect(dest);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      lfo.start();
      osc.start();
      lfo.stop(ctx.currentTime + 0.31);
      osc.stop(ctx.currentTime + 0.31);

    } else if (type.startsWith('melody')) {
      const notes = { melody1: 523.25, melody2: 659.25, melody3: 783.99 }; // C5, E5, G5
      const freq = notes[type] || 440;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(dest);

      osc.type = 'sine';
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc.start();
      osc.stop(ctx.currentTime + 0.32);

    } else if (type === 'giggle') {
      // Fast funny high pitch slide
      const playChirp = (start, pitch) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(dest);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(pitch, ctx.currentTime + start);
        osc.frequency.exponentialRampToValueAtTime(pitch * 1.5, ctx.currentTime + start + 0.08);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + start);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + start + 0.08);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + 0.09);
      };
      playChirp(0, 600);
      playChirp(0.06, 750);
      playChirp(0.12, 900);

    } else if (type === 'bleh') {
      // Disgusted sound for Broccoli
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(dest);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(45, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    }
  } catch (err) {
    console.warn("Audio Context init deferred: Needs user gesture first.", err);
  }
}

// Bouncing Soundboard Visualizer bars
function animateVisualizer() {
  const bars = document.querySelectorAll('.vis-bar');
  bars.forEach(bar => {
    const randomHeight = Math.floor(Math.random() * 32) + 8;
    bar.style.height = `${randomHeight}px`;
    setTimeout(() => {
      bar.style.height = '4px';
    }, 280);
  });
}


// --- ACTIVE THEME CONTROLLER ---
let activeTheme = 'space';
const themeButtons = document.querySelectorAll('.theme-btn');

themeButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const targetTheme = btn.getAttribute('data-theme');
    if (targetTheme === activeTheme) return;

    // Update active UI classes
    themeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Remove old theme and add new one
    document.body.className = '';
    document.body.classList.add(`theme-${targetTheme}`);
    activeTheme = targetTheme;

    // Clean drawing board color states to align with theme defaults
    resetCanvasColorDefaults();

    // Trigger theme sound effect
    playSynthSound('teleport');

    // Explode theme specific particles across center
    spawnThemeExplosion();
  });
});


// --- BACKGROUND PROMINENCE CONTROLLER ---
const bgButtons = document.querySelectorAll('.bg-btn');

bgButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetBg = btn.getAttribute('data-bg');
    
    // Update active UI classes
    bgButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Update data attribute on body
    document.body.setAttribute('data-bg', targetBg);
    
    // Trigger fun synth sound
    playSynthSound('coin');
    
    // Emit a small burst of particles for awesome dynamic feedback
    if (typeof spawnThemeExplosion === 'function') {
      spawnThemeExplosion();
    }
  });
});


// --- GLOBAL CANVAS PARTICLES & TRAIL SYSTEM ---
const particleCanvas = document.getElementById('global-particles');
const pCtx = particleCanvas.getContext('2d');
let particlesList = [];

function resizeParticleCanvas() {
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeParticleCanvas);
resizeParticleCanvas();

class Particle {
  constructor(x, y, isExplosion = false) {
    this.x = x;
    this.y = y;
    this.theme = activeTheme;
    this.isExplosion = isExplosion;

    // Physics
    const speedScale = isExplosion ? 6 : 1.2;
    this.vx = (Math.random() - 0.5) * speedScale;
    this.vy = isExplosion ? (Math.random() - 0.5) * speedScale : Math.random() * -0.5 - 0.2; // float up gently
    this.gravity = isExplosion ? 0.08 : 0;

    this.alpha = 1;
    this.decay = Math.random() * 0.015 + 0.01;
    this.size = Math.random() * 8 + 4;
    this.angle = Math.random() * 360;
    this.spin = (Math.random() - 0.5) * 4;

    // Theme Customizations
    if (this.theme === 'space') {
      this.color = Math.random() > 0.5 ? '#06b6d4' : '#a855f7'; // cyan/purple
    } else if (this.theme === 'dino') {
      this.color = Math.random() > 0.5 ? '#84cc16' : '#f97316'; // lime/orange
    } else if (this.theme === 'arcade') {
      this.color = Math.random() > 0.5 ? '#ec4899' : '#facc15'; // magenta/yellow
      this.size = Math.random() * 6 + 4; // blocky
    } else if (this.theme === 'magic') {
      this.color = Math.random() > 0.5 ? '#f472b6' : '#2dd4bf'; // pink/teal
    }
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.isExplosion) {
      this.vy += this.gravity; // apply gravity to explosion bits
    }
    this.angle += this.spin;
    this.alpha -= this.decay;
  }

  draw() {
    pCtx.save();
    pCtx.globalAlpha = this.alpha;
    pCtx.translate(this.x, this.y);
    pCtx.rotate((this.angle * Math.PI) / 180);

    pCtx.fillStyle = this.color;
    pCtx.shadowBlur = this.isExplosion ? 10 : 4;
    pCtx.shadowColor = this.color;

    if (this.theme === 'space') {
      // Draw 4-point Star
      pCtx.beginPath();
      pCtx.moveTo(0, -this.size);
      pCtx.lineTo(this.size * 0.3, -this.size * 0.3);
      pCtx.lineTo(this.size, 0);
      pCtx.lineTo(this.size * 0.3, this.size * 0.3);
      pCtx.lineTo(0, this.size);
      pCtx.lineTo(-this.size * 0.3, this.size * 0.3);
      pCtx.lineTo(-this.size, 0);
      pCtx.lineTo(-this.size * 0.3, -this.size * 0.3);
      pCtx.closePath();
      pCtx.fill();
    } else if (this.theme === 'dino') {
      // Draw simple curved leaf shape
      pCtx.beginPath();
      pCtx.ellipse(0, 0, this.size * 0.8, this.size * 0.4, 0, 0, 2 * Math.PI);
      pCtx.closePath();
      pCtx.fill();
    } else if (this.theme === 'arcade') {
      // Draw crispy digital square
      pCtx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
    } else if (this.theme === 'magic') {
      // Draw glowing sparkling bubble or ring
      pCtx.beginPath();
      pCtx.arc(0, 0, this.size * 0.7, 0, 2 * Math.PI);
      pCtx.closePath();
      pCtx.fill();
      // Draw small center point
      pCtx.fillStyle = '#ffffff';
      pCtx.beginPath();
      pCtx.arc(0, 0, this.size * 0.2, 0, 2 * Math.PI);
      pCtx.closePath();
      pCtx.fill();
    }

    pCtx.restore();
  }
}

// Particle Loop Animation Frame
function updateParticles() {
  pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

  for (let i = particlesList.length - 1; i >= 0; i--) {
    const p = particlesList[i];
    p.update();
    if (p.alpha <= 0) {
      particlesList.splice(i, 1);
    } else {
      p.draw();
    }
  }

  requestAnimationFrame(updateParticles);
}
requestAnimationFrame(updateParticles);

// Spawn a trail particle on mouse movement
window.addEventListener('mousemove', (e) => {
  if (Math.random() < 0.22) { // limit volume
    particlesList.push(new Particle(e.clientX, e.clientY));
  }
});

// Mobile Touch support for cursor trails
window.addEventListener('touchmove', (e) => {
  if (e.touches.length > 0 && Math.random() < 0.22) {
    particlesList.push(new Particle(e.touches[0].clientX, e.touches[0].clientY));
  }
});

// Screen explosion when transitioning themes
function spawnThemeExplosion() {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  for (let i = 0; i < 45; i++) {
    particlesList.push(new Particle(centerX, centerY, true));
  }
}

// Fullscreen Level-up Confetti blast
function triggerConfettiBlast() {
  const leftX = window.innerWidth * 0.15;
  const rightX = window.innerWidth * 0.85;
  const bottomY = window.innerHeight * 0.9;

  // Blast left side
  for (let i = 0; i < 35; i++) {
    const p = new Particle(leftX, bottomY, true);
    p.vx = Math.random() * 6 + 2; // blast rightward
    p.vy = Math.random() * -12 - 4; // upwards
    particlesList.push(p);
  }
  // Blast right side
  for (let i = 0; i < 35; i++) {
    const p = new Particle(rightX, bottomY, true);
    p.vx = Math.random() * -6 - 2; // blast leftward
    p.vy = Math.random() * -12 - 4; // upwards
    particlesList.push(p);
  }
}


// --- HERO CHARACTER LEVEL-UP MECHANIC ---
const levelUpBtn = document.getElementById('level-up-btn');
const powerLevelVal = document.getElementById('power-level');

levelUpBtn.addEventListener('click', () => {
  playSynthSound('powerup');
  triggerConfettiBlast();

  // Increment power level text
  let currentPower = parseInt(powerLevelVal.textContent);
  currentPower += Math.floor(Math.random() * 500) + 150;
  powerLevelVal.textContent = currentPower;

  // Add neon screen-glowing animation effect on text
  powerLevelVal.classList.add('text-glow');
  setTimeout(() => {
    powerLevelVal.classList.remove('text-glow');
  }, 1000);
});


// --- SOUNDBOARD INTERACTIVE BUTTONS & KEYS ---
const soundPads = document.querySelectorAll('.sound-pad');

soundPads.forEach(pad => {
  pad.addEventListener('click', () => {
    const soundType = pad.getAttribute('data-sound');
    playSynthSound(soundType);
  });
});

// Bind keys 1-9 to trigger pads
window.addEventListener('keydown', (e) => {
  const key = e.key;
  if (['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(key)) {
    const pad = document.querySelector(`.sound-pad[data-key="${key}"]`);
    if (pad) {
      pad.classList.add('pad-active');
      const soundType = pad.getAttribute('data-sound');
      playSynthSound(soundType);
      setTimeout(() => {
        pad.classList.remove('pad-active');
      }, 150);
    }
  }
});


// --- ASTRO-BUDDY PET VIRTUAL INTERACTION ---
const petSvg = document.getElementById('virtual-pet');
const petBodyGroup = document.getElementById('pet-body-group');
const pupilL = document.getElementById('pupil-l');
const pupilR = document.getElementById('pupil-r');
const petMouth = document.getElementById('pet-mouth');
const treatButtons = document.querySelectorAll('.treat-btn');

// Calculate eye tracking of the cursor
window.addEventListener('mousemove', (e) => {
  const rect = petSvg.getBoundingClientRect();
  const petCenterX = rect.left + rect.width / 2;
  const petCenterY = rect.top + rect.height / 2;

  const dx = e.clientX - petCenterX;
  const dy = e.clientY - petCenterY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Bounds limit for pupils
  const maxDistance = 3.5;
  const angle = Math.atan2(dy, dx);

  const pupilOffsetX = Math.cos(angle) * Math.min(dist * 0.05, maxDistance);
  const pupilOffsetY = Math.sin(angle) * Math.min(dist * 0.05, maxDistance);

  // Update SVG pupil positions
  pupilL.setAttribute('cx', 38 + pupilOffsetX);
  pupilL.setAttribute('cy', 45 + pupilOffsetY);
  pupilR.setAttribute('cx', 62 + pupilOffsetX);
  pupilR.setAttribute('cy', 45 + pupilOffsetY);
});

// Tap pet to execute spin animations
petSvg.addEventListener('click', () => {
  playSynthSound('giggle');
  petBodyGroup.classList.remove('pet-spin');
  void petBodyGroup.offsetWidth; // Trigger reflow to restart CSS keyframes
  petBodyGroup.classList.add('pet-spin');
  setTimeout(() => {
    petBodyGroup.classList.remove('pet-spin');
  }, 800);
});

// Feeding treats states
treatButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const food = btn.getAttribute('data-food');

    if (food === 'pizza') {
      playSynthSound('coin');
      // Happy eyes + open mouth
      petMouth.setAttribute('d', 'M 42 58 Q 50 68 58 58'); // Deep happy smile
      petBodyGroup.classList.add('pet-wiggle');
      setTimeout(() => {
        petMouth.setAttribute('d', 'M 44 58 Q 50 58 56 58'); // back to normal
        petBodyGroup.classList.remove('pet-wiggle');
      }, 1500);

    } else if (food === 'cookie') {
      playSynthSound('jump');
      // Fun spin
      petMouth.setAttribute('d', 'M 46 58 Q 50 64 54 58'); // Tiny cute smile
      petBodyGroup.classList.add('pet-spin');
      setTimeout(() => {
        petMouth.setAttribute('d', 'M 44 58 Q 50 58 56 58');
        petBodyGroup.classList.remove('pet-spin');
      }, 800);

    } else if (food === 'broccoli') {
      playSynthSound('bleh');
      // Sad broccoli mouth morph + funny shake
      petMouth.setAttribute('d', 'M 44 64 Q 50 54 56 64'); // Sad morph frown
      petBodyGroup.classList.add('pet-wiggle');
      setTimeout(() => {
        petMouth.setAttribute('d', 'M 44 58 Q 50 58 56 58');
        petBodyGroup.classList.remove('pet-wiggle');
      }, 1800);
    }
  });
});


// --- NEON BRUSH MAGIC SKETCHPAD ---
const sketchpad = document.getElementById('sketchpad');
const sCtx = sketchpad.getContext('2d');
const colorDots = document.querySelectorAll('.color-dot');
const clearBtn = document.getElementById('clear-sketchpad');
const brushSizeInput = document.getElementById('brush-size');
const toolBrush = document.getElementById('tool-brush');
const toolSpray = document.getElementById('tool-spray');
const toolEraser = document.getElementById('tool-eraser');

let drawing = false;
let currentBrushColor = 'rainbow'; // default
let currentTool = 'brush'; // brush, spray, eraser
let rainbowHue = 0;

function resizeSketchpad() {
  // Save current drawings before resize
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = sketchpad.width;
  tempCanvas.height = sketchpad.height;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(sketchpad, 0, 0);

  // Resize canvas according to container
  const rect = sketchpad.parentElement.getBoundingClientRect();
  sketchpad.width = rect.width;
  sketchpad.height = rect.height;

  // Redraw previous paint
  sCtx.drawImage(tempCanvas, 0, 0);
  initCanvasProperties();
}

function initCanvasProperties() {
  sCtx.lineCap = 'round';
  sCtx.lineJoin = 'round';
}

window.addEventListener('resize', resizeSketchpad);
// Wait briefly for CSS layout grids to settle before measuring dimensions
setTimeout(resizeSketchpad, 100);

// Set default palette highlights based on active themes
function resetCanvasColorDefaults() {
  // Update palette matching theme values
  const activeDot = document.querySelector('.color-dot.active');
  if (activeDot && activeDot.getAttribute('data-color') === 'rainbow') return;
  // If not rainbow, auto-adapt dots or clear colors safely
}

// Set Active Color Selection
colorDots.forEach(dot => {
  dot.addEventListener('click', () => {
    colorDots.forEach(d => d.classList.remove('active'));
    dot.classList.add('active');
    currentBrushColor = dot.getAttribute('data-color');
    
    // De-activate eraser if selecting color
    if (currentTool === 'eraser') {
      setActiveTool('brush');
    }
  });
});

// Set Active Tools
function setActiveTool(tool) {
  currentTool = tool;
  toolBrush.classList.remove('active');
  toolSpray.classList.remove('active');
  toolEraser.classList.remove('active');

  if (tool === 'brush') toolBrush.classList.add('active');
  if (tool === 'spray') toolSpray.classList.add('active');
  if (tool === 'eraser') toolEraser.classList.add('active');
}

toolBrush.addEventListener('click', () => setActiveTool('brush'));
toolSpray.addEventListener('click', () => setActiveTool('spray'));
toolEraser.addEventListener('click', () => setActiveTool('eraser'));

// Drawing Event Listeners
sketchpad.addEventListener('mousedown', startDrawing);
sketchpad.addEventListener('mousemove', draw);
window.addEventListener('mouseup', stopDrawing);

sketchpad.addEventListener('touchstart', (e) => {
  e.preventDefault();
  startDrawing(e.touches[0]);
});
sketchpad.addEventListener('touchmove', (e) => {
  e.preventDefault();
  draw(e.touches[0]);
});
window.addEventListener('touchend', stopDrawing);

function getMousePos(e) {
  const rect = sketchpad.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

function startDrawing(e) {
  initAudio();
  drawing = true;
  const pos = getMousePos(e);
  sCtx.beginPath();
  sCtx.moveTo(pos.x, pos.y);
  // Spawn initial dot
  draw(e);
}

function draw(e) {
  if (!drawing) return;
  const pos = getMousePos(e);
  const size = parseInt(brushSizeInput.value);

  sCtx.lineWidth = size;

  if (currentTool === 'eraser') {
    sCtx.strokeStyle = '#03020c'; // Matches Canvas wrapper background
    sCtx.shadowBlur = 0;
    sCtx.shadowColor = 'transparent';
    sCtx.lineTo(pos.x, pos.y);
    sCtx.stroke();
  } else if (currentTool === 'spray') {
    // Spray Paint Nozzle effect
    sCtx.fillStyle = currentBrushColor === 'rainbow' ? `hsl(${rainbowHue}, 100%, 65%)` : currentBrushColor;
    sCtx.shadowBlur = 0;
    const density = Math.min(size * 1.5, 30);
    for (let i = 0; i < density; i++) {
      const offsetX = (Math.random() - 0.5) * size * 1.8;
      const offsetY = (Math.random() - 0.5) * size * 1.8;
      sCtx.fillRect(pos.x + offsetX, pos.y + offsetY, 2, 2);
    }
    if (currentBrushColor === 'rainbow') {
      rainbowHue = (rainbowHue + 1) % 360;
    }
  } else {
    // Standard Neon Glow Brush
    let strokeCol = currentBrushColor;
    if (currentBrushColor === 'rainbow') {
      strokeCol = `hsl(${rainbowHue}, 100%, 65%)`;
      rainbowHue = (rainbowHue + 3) % 360;
    }
    sCtx.strokeStyle = strokeCol;
    sCtx.shadowBlur = size * 0.8;
    sCtx.shadowColor = strokeCol;

    sCtx.lineTo(pos.x, pos.y);
    sCtx.stroke();
    sCtx.beginPath();
    sCtx.moveTo(pos.x, pos.y);
  }
}

function stopDrawing() {
  if (!drawing) return;
  drawing = false;
  sCtx.beginPath();
}

// Clear screen overlay animation transition
clearBtn.addEventListener('click', () => {
  playSynthSound('laser');
  sCtx.fillStyle = '#03020c';
  sCtx.fillRect(0, 0, sketchpad.width, sketchpad.height);
});


// --- JOKE-O-MATIC INTERACTIVE DECK ---
const jokeCard = document.getElementById('joke-card');
const nextJokeBtn = document.getElementById('next-joke-btn');
const jokeSetup = document.getElementById('joke-setup');
const jokePunchline = document.getElementById('joke-punchline');

const jokes = [
  { s: "Why did the computer go to the doctor?", p: "Because it had a virus! 🦠" },
  { s: "Why did the dinosaur cross the road?", p: "Because the chicken wasn't born yet! 🦖" },
  { s: "What do you call a sleeping dinosaur?", p: "A dino-snore! 💤" },
  { s: "How do you make a tissue dance?", p: "Put a little boogie in it! 💃" },
  { s: "Why are astronaut computers so cool?", p: "They have a space bar! 🪐" },
  { s: "What does a volcano do when it's hungry?", p: "It erupts with lava cake! 🌋" },
  { s: "Why did the Lego man go to the doctor?", p: "He lost his head! 🧱" },
  { s: "What do you call an alien with 3 eyes?", p: "An aliiien! 👽" },
  { s: "What is a cat's favorite color?", p: "Purr-ple! 🐈‍⬛" },
  { s: "What do you get when you cross a dog and a laser?", p: "A glow-pointer! 🐕" }
];

let currentJokeIdx = 0;

jokeCard.addEventListener('click', () => {
  playSynthSound('jump');
  jokeCard.classList.toggle('flipped');
});

nextJokeBtn.addEventListener('click', () => {
  playSynthSound('laser');
  
  // Flip card back first if it was flipped
  jokeCard.classList.remove('flipped');

  // Load new random joke setup and punchline after transition completes
  setTimeout(() => {
    let nextIdx = currentJokeIdx;
    while (nextIdx === currentJokeIdx) {
      nextIdx = Math.floor(Math.random() * jokes.length);
    }
    currentJokeIdx = nextIdx;
    jokeSetup.textContent = jokes[currentJokeIdx].s;
    jokePunchline.textContent = jokes[currentJokeIdx].p;
  }, 250);
});


// --- ASTRO-CHOMP ARCADE SYSTEM (MINI-GAME) ---
const gameCanvas = document.getElementById('game-canvas');
const gCtx = gameCanvas.getContext('2d');
const gameOverlay = document.getElementById('game-overlay');
const startGameBtn = document.getElementById('start-game-btn');
const gameScoreVal = document.getElementById('game-score');
const gameHighVal = document.getElementById('game-high');
const overlayTitle = document.getElementById('overlay-title');
const overlayDesc = document.getElementById('overlay-desc');

let gameRunning = false;
let gameScore = 0;
let gameHighScore = parseInt(localStorage.getItem('raphas_game_high') || '0');
gameHighVal.textContent = gameHighScore;

let player = {
  x: 0,
  y: 0,
  width: 44,
  height: 44,
  speed: 7
};

let gameKeys = {};
let gameItems = [];
let gameObstacles = [];
let gameStars = []; // decorative bg stars
let gameSpawnTimer = 0;

function resizeGameCanvas() {
  const rect = gameCanvas.parentElement.getBoundingClientRect();
  gameCanvas.width = rect.width;
  gameCanvas.height = rect.height;
  player.y = gameCanvas.height - 65; // pin player to bottom area
  if (!gameRunning) {
    player.x = gameCanvas.width / 2 - player.width / 2;
  }
}
window.addEventListener('resize', resizeGameCanvas);
setTimeout(resizeGameCanvas, 100);

// Controls (arrows & mouse & mobile swipe)
window.addEventListener('keydown', (e) => {
  if (['ArrowLeft', 'ArrowRight', 'a', 'd', ' '].includes(e.key)) {
    gameKeys[e.key] = true;
    if (e.key === ' ' && !gameRunning) {
      triggerGameStart();
    }
  }
});
window.addEventListener('keyup', (e) => {
  if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(e.key)) {
    gameKeys[e.key] = false;
  }
});

// Follow mouse movements horizontally inside game screen
gameCanvas.addEventListener('mousemove', (e) => {
  if (!gameRunning) return;
  const rect = gameCanvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  player.x = mouseX - player.width / 2;
  keepPlayerInBounds();
});

// Touch swipe support for mobile
let touchStartX = 0;
gameCanvas.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
});
gameCanvas.addEventListener('touchmove', (e) => {
  if (!gameRunning) return;
  const rect = gameCanvas.getBoundingClientRect();
  const touchX = e.touches[0].clientX;
  player.x = (touchX - rect.left) - player.width / 2;
  keepPlayerInBounds();
});

function keepPlayerInBounds() {
  if (player.x < 0) player.x = 0;
  if (player.x > gameCanvas.width - player.width) player.x = gameCanvas.width - player.width;
}

startGameBtn.addEventListener('click', () => {
  triggerGameStart();
});

function triggerGameStart() {
  initAudio();
  playSynthSound('powerup');
  gameOverlay.classList.remove('active');
  gameRunning = true;
  gameScore = 0;
  gameScoreVal.textContent = 0;
  gameItems = [];
  gameObstacles = [];
  player.x = gameCanvas.width / 2 - player.width / 2;

  // Initialize background star field
  gameStars = [];
  for (let i = 0; i < 25; i++) {
    gameStars.push({
      x: Math.random() * gameCanvas.width,
      y: Math.random() * gameCanvas.height,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 0.8 + 0.2
    });
  }

  // Fire frame loops
  requestAnimationFrame(gameLoop);
}

function triggerGameOver() {
  playSynthSound('explosion');
  gameRunning = false;
  gameOverlay.classList.add('active');
  
  if (gameScore > gameHighScore) {
    gameHighScore = gameScore;
    localStorage.setItem('raphas_game_high', gameHighScore);
    gameHighVal.textContent = gameHighScore;
    overlayTitle.textContent = "NEW HIGH SCORE! 🎉";
    overlayDesc.textContent = `Whoa Rapha! You are a superstar! You scored ${gameScore} points!`;
  } else {
    overlayTitle.textContent = "GAME OVER!";
    overlayDesc.textContent = `Great try Rapha! You scored ${gameScore} points! Play again?`;
  }
  startGameBtn.textContent = "PLAY AGAIN! 🕹️";
}

// Game Loop Frame
function gameLoop() {
  if (!gameRunning) return;

  // 1. UPDATE PHYSICS
  // Keyboard movements
  if (gameKeys['ArrowLeft'] || gameKeys['a']) {
    player.x -= player.speed;
  }
  if (gameKeys['ArrowRight'] || gameKeys['d']) {
    player.x += player.speed;
  }
  keepPlayerInBounds();

  // Scrolling star field
  gameStars.forEach(star => {
    star.y += star.speed;
    if (star.y > gameCanvas.height) {
      star.y = 0;
      star.x = Math.random() * gameCanvas.width;
    }
  });

  // Spawn items & obstacles
  gameSpawnTimer++;
  if (gameSpawnTimer > 35) { // every 35 frames
    gameSpawnTimer = 0;
    
    // Spawn pizza slice or shiny star randomly
    if (Math.random() < 0.65) {
      gameItems.push({
        x: Math.random() * (gameCanvas.width - 30),
        y: -30,
        size: 26,
        type: Math.random() > 0.4 ? 'pizza' : 'star',
        speed: Math.random() * 2.5 + 2,
        rot: 0,
        rotSpeed: (Math.random() - 0.5) * 0.05
      });
    } else {
      // Spawn asteroid or spooky broccoli!
      gameObstacles.push({
        x: Math.random() * (gameCanvas.width - 30),
        y: -30,
        size: 26,
        type: Math.random() > 0.35 ? 'rock' : 'broccoli',
        speed: Math.random() * 3 + 2.5,
        rot: 0,
        rotSpeed: (Math.random() - 0.5) * 0.08
      });
    }
  }

  // Fall Good Items
  for (let i = gameItems.length - 1; i >= 0; i--) {
    const item = gameItems[i];
    item.y += item.speed;
    item.rot += item.rotSpeed;

    // Check collision with player bounding box
    if (checkCollision(player, item)) {
      playSynthSound('coin');
      gameScore += 10;
      gameScoreVal.textContent = gameScore;
      gameItems.splice(i, 1);
      // Explode spark particles inside game canvas context!
      continue;
    }

    if (item.y > gameCanvas.height + 40) {
      gameItems.splice(i, 1);
    }
  }

  // Fall Spooky Obstacles
  for (let i = gameObstacles.length - 1; i >= 0; i--) {
    const obs = gameObstacles[i];
    obs.y += obs.speed;
    obs.rot += obs.rotSpeed;

    // Check collision with player
    if (checkCollision(player, obs)) {
      triggerGameOver();
      return;
    }

    if (obs.y > gameCanvas.height + 40) {
      gameObstacles.splice(i, 1);
    }
  }


  // 2. RENDER GRAPHICS
  gCtx.fillStyle = '#020108';
  gCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

  // Render Background stars
  gCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  gameStars.forEach(star => {
    gCtx.beginPath();
    gCtx.arc(star.x, star.y, star.size, 0, 2*Math.PI);
    gCtx.fill();
  });

  // Render Player Character (Cute Rocket or Dino Mouth)
  gCtx.save();
  gCtx.translate(player.x + player.width/2, player.y + player.height/2);
  gCtx.shadowBlur = 15;
  gCtx.shadowColor = 'var(--color-primary)';
  
  // Custom theme-based avatar drawing
  if (activeTheme === 'space') {
    // Cyber Rocket ship
    gCtx.fillStyle = '#a855f7';
    gCtx.beginPath();
    gCtx.moveTo(0, -player.height/2);
    gCtx.lineTo(player.width/2, player.height/3);
    gCtx.lineTo(-player.width/2, player.height/3);
    gCtx.closePath();
    gCtx.fill();
    // Fire trail
    gCtx.fillStyle = '#f97316';
    gCtx.beginPath();
    gCtx.moveTo(-player.width/4, player.height/3);
    gCtx.lineTo(0, player.height/2 + (Math.random()*6));
    gCtx.lineTo(player.width/4, player.height/3);
    gCtx.closePath();
    gCtx.fill();
  } else if (activeTheme === 'dino') {
    // Happy Dino Head
    gCtx.fillStyle = '#84cc16';
    gCtx.beginPath();
    gCtx.arc(0, 0, player.width/2, 0, 2*Math.PI);
    gCtx.fill();
    // Spine
    gCtx.fillStyle = '#ea580c';
    gCtx.fillRect(-player.width/2 - 2, -6, 6, 12);
    // Cute Eye
    gCtx.fillStyle = '#fff';
    gCtx.beginPath();
    gCtx.arc(5, -6, 5, 0, 2*Math.PI);
    gCtx.fill();
    gCtx.fillStyle = '#000';
    gCtx.beginPath();
    gCtx.arc(6, -6, 2, 0, 2*Math.PI);
    gCtx.fill();
  } else if (activeTheme === 'arcade') {
    // Retro Space Invader yellow sprite
    gCtx.fillStyle = '#facc15';
    gCtx.fillRect(-18, -14, 36, 6);
    gCtx.fillRect(-22, -8, 44, 10);
    gCtx.fillRect(-12, 2, 24, 8);
    gCtx.fillRect(-18, 10, 6, 8);
    gCtx.fillRect(12, 10, 6, 8);
  } else {
    // Sparkly fairy unicorn crown/star
    gCtx.fillStyle = '#f472b6';
    gCtx.beginPath();
    gCtx.arc(0, 0, player.width/2 - 4, 0, 2*Math.PI);
    gCtx.fill();
    gCtx.fillStyle = '#fff';
    gCtx.beginPath();
    gCtx.arc(-4, -4, 3, 0, 2*Math.PI);
    gCtx.arc(4, -4, 3, 0, 2*Math.PI);
    gCtx.fill();
  }
  gCtx.restore();

  // Render Good Falling Items
  gameItems.forEach(item => {
    gCtx.save();
    gCtx.translate(item.x + item.size/2, item.y + item.size/2);
    gCtx.rotate(item.rot);
    gCtx.shadowBlur = 10;
    
    if (item.type === 'pizza') {
      gCtx.shadowColor = '#eab308';
      // Triangle Crust
      gCtx.fillStyle = '#f97316';
      gCtx.beginPath();
      gCtx.moveTo(0, item.size/2);
      gCtx.lineTo(-item.size/2, -item.size/2);
      gCtx.lineTo(item.size/2, -item.size/2);
      gCtx.closePath();
      gCtx.fill();
      // Yellow Cheese overlay
      gCtx.fillStyle = '#facc15';
      gCtx.beginPath();
      gCtx.moveTo(0, item.size/3);
      gCtx.lineTo(-item.size/3, -item.size/3);
      gCtx.lineTo(item.size/3, -item.size/3);
      gCtx.closePath();
      gCtx.fill();
      // Pepperonis
      gCtx.fillStyle = '#ef4444';
      gCtx.beginPath();
      gCtx.arc(-2, -2, 2.5, 0, 2*Math.PI);
      gCtx.arc(2, -6, 2.5, 0, 2*Math.PI);
      gCtx.arc(0, 4, 2.5, 0, 2*Math.PI);
      gCtx.fill();
    } else {
      gCtx.shadowColor = '#38bdf8';
      // Star shape
      gCtx.fillStyle = '#38bdf8';
      gCtx.beginPath();
      for (let i = 0; i < 5; i++) {
        gCtx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * (item.size/2), -Math.sin((18 + i * 72) * Math.PI / 180) * (item.size/2));
        gCtx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * (item.size/4), -Math.sin((54 + i * 72) * Math.PI / 180) * (item.size/4));
      }
      gCtx.closePath();
      gCtx.fill();
    }
    gCtx.restore();
  });

  // Render Spooky Obstacles
  gameObstacles.forEach(obs => {
    gCtx.save();
    gCtx.translate(obs.x + obs.size/2, obs.y + obs.size/2);
    gCtx.rotate(obs.rot);
    gCtx.shadowBlur = 10;

    if (obs.type === 'broccoli') {
      gCtx.shadowColor = '#22c55e';
      // Broccoli top (3 connected green circles)
      gCtx.fillStyle = '#16a34a';
      gCtx.beginPath();
      gCtx.arc(-5, -3, 9, 0, 2*Math.PI);
      gCtx.arc(5, -3, 9, 0, 2*Math.PI);
      gCtx.arc(0, -9, 10, 0, 2*Math.PI);
      gCtx.fill();
      // Stem
      gCtx.fillStyle = '#4ade80';
      gCtx.fillRect(-4, 0, 8, 12);
    } else {
      gCtx.shadowColor = '#64748b';
      // Jagged gray asteroid
      gCtx.fillStyle = '#475569';
      gCtx.beginPath();
      gCtx.moveTo(0, -obs.size/2);
      gCtx.lineTo(obs.size/2 - 2, -obs.size/3);
      gCtx.lineTo(obs.size/2, obs.size/3);
      gCtx.lineTo(0, obs.size/2 - 1);
      gCtx.lineTo(-obs.size/2 + 3, obs.size/4);
      gCtx.lineTo(-obs.size/2, -obs.size/4);
      gCtx.closePath();
      gCtx.fill();
      // Crater details
      gCtx.fillStyle = '#334155';
      gCtx.beginPath();
      gCtx.arc(-4, -4, 2.5, 0, 2*Math.PI);
      gCtx.arc(3, 4, 3.5, 0, 2*Math.PI);
      gCtx.fill();
    }
    gCtx.restore();
  });

  requestAnimationFrame(gameLoop);
}

// Bounding box collision checking helper
function checkCollision(r1, r2) {
  // Center coordinates distance checking to make it extremely lenient for 7yo!
  const c1x = r1.x + r1.width / 2;
  const c1y = r1.y + r1.height / 2;
  const c2x = r2.x + r2.size / 2;
  const c2y = r2.y + r2.size / 2;

  const dx = c1x - c2x;
  const dy = c1y - c2y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Radius sum checking
  const r1Radius = Math.min(r1.width, r1.height) / 2.2;
  const r2Radius = r2.size / 2.2;

  return distance < (r1Radius + r2Radius);
}

// --- HERO MODAL INTERACTION ENGINE ---
const heroModal = document.getElementById('hero-modal');
const heroModalBtn = document.getElementById('hero-modal-btn');
const closeHeroModalBtn = document.getElementById('close-hero-modal');

if (heroModal && heroModalBtn && closeHeroModalBtn) {
  heroModalBtn.addEventListener('click', () => {
    initAudio();
    playSynthSound('powerup');
    heroModal.classList.add('active');
    triggerConfettiBlast();
  });

  closeHeroModalBtn.addEventListener('click', () => {
    playSynthSound('laser');
    heroModal.classList.remove('active');
  });

  // Close modal when clicking outside the content panel
  heroModal.addEventListener('click', (e) => {
    if (e.target === heroModal) {
      playSynthSound('laser');
      heroModal.classList.remove('active');
    }
  });
}

// --- BOAT MODAL INTERACTION ENGINE ---
const boatModal = document.getElementById('boat-modal');
const boatModalBtn = document.getElementById('boat-modal-btn');
const closeBoatModalBtn = document.getElementById('close-boat-modal');

if (boatModal && boatModalBtn && closeBoatModalBtn) {
  boatModalBtn.addEventListener('click', () => {
    initAudio();
    playSynthSound('powerup');
    boatModal.classList.add('active');
    triggerConfettiBlast();
  });

  closeBoatModalBtn.addEventListener('click', () => {
    playSynthSound('laser');
    boatModal.classList.remove('active');
  });

  boatModal.addEventListener('click', (e) => {
    if (e.target === boatModal) {
      playSynthSound('laser');
      boatModal.classList.remove('active');
    }
  });
}

