const layers = [...document.querySelectorAll('.cake-layer')];
const startBtn = document.getElementById('startBtn');
const knife = document.getElementById('knife');
const cakeStage = document.getElementById('cakeStage');
const messageModal = document.getElementById('messageModal');
const closeModal = document.getElementById('closeModal');
const topper = document.querySelector('.cake-topper');

let dragging = false;
let cutTriggered = false;
let knifeX = 0;
let knifeY = 0;

function playAssembly() {
  layers.forEach((layer, index) => {
    layer.style.animation = 'none';
    void layer.offsetWidth;
    layer.style.animation = '';
    layer.style.animationDelay = `${index * 600}ms`;
  });

  if (topper) {
    topper.style.opacity = '1';
    topper.style.transform = 'translateX(-50%) translateY(0) scale(1)';
  }

  setTimeout(() => {
    startBtn.classList.add('visible');
  }, 2200);
}

function resetScene() {
  dragging = false;
  cutTriggered = false;
  knifeX = 150;
  knifeY = 20;
  messageModal.classList.remove('visible');
  messageModal.setAttribute('aria-hidden', 'true');
  knife.classList.remove('ready', 'dragging');
  knife.style.left = '150px';
  knife.style.top = '20px';
  knife.style.transform = 'translateX(-50%) rotate(-10deg)';
  startBtn.classList.remove('visible');

  if (topper) {
    topper.style.opacity = '0';
    topper.style.transform = 'translateX(-50%) translateY(-30px) scale(0.94)';
  }

  playAssembly();
}

function showMessage() {
  if (cutTriggered) return;
  cutTriggered = true;
  messageModal.classList.add('visible');
  messageModal.setAttribute('aria-hidden', 'false');
  knife.classList.remove('dragging');
}

function updateKnifePosition(clientX, clientY) {
  const stageRect = cakeStage.getBoundingClientRect();
  const minX = 130;
  const maxX = stageRect.width - 130;
  const minY = 10;
  const maxY = stageRect.height - 40;

  const targetX = Math.min(Math.max(clientX - stageRect.left, minX), maxX);
  const targetY = Math.min(Math.max(clientY - stageRect.top, minY), maxY);

  knifeX += (targetX - knifeX) * 0.35;
  knifeY += (targetY - knifeY) * 0.35;

  knife.style.left = `${knifeX}px`;
  knife.style.top = `${knifeY}px`;

  const angle = Math.min(Math.max((knifeY - 120) / 12, -18), 30);
  knife.style.transform = `translateX(-50%) rotate(${angle}deg)`;

  if (knifeY > stageRect.height * 0.35 && knifeX > stageRect.width * 0.42 && !cutTriggered) {
    showMessage();
  }
}

startBtn.addEventListener('click', () => {
  startBtn.classList.remove('visible');
  knifeX = 150;
  knifeY = 20;
  knife.classList.add('ready');
  knife.style.left = '150px';
  knife.style.top = '20px';
  knife.style.transform = 'translateX(-50%) rotate(-10deg)';
  knife.focus();
});

knife.addEventListener('pointerdown', (event) => {
  if (!knife.classList.contains('ready')) return;
  dragging = true;
  knife.classList.add('dragging');
  knife.setPointerCapture(event.pointerId);
  updateKnifePosition(event.clientX, event.clientY);
});

knife.addEventListener('pointermove', (event) => {
  if (!dragging) return;
  updateKnifePosition(event.clientX, event.clientY);
});

knife.addEventListener('pointerup', () => {
  dragging = false;
  knife.classList.remove('dragging');
});

knife.addEventListener('pointercancel', () => {
  dragging = false;
  knife.classList.remove('dragging');
});

closeModal.addEventListener('click', resetScene);

knife.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    startBtn.click();
  }
});

playAssembly();
