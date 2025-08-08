// ===== DOM refs
const form = document.getElementById('uploadForm');
const btn = document.getElementById('btn');
const preview = document.getElementById('preview');
const predictionsDiv = document.getElementById('predictions');
const errorDiv = document.getElementById('error');
const chartWrap = document.getElementById('chartWrap');
const chartCanvas = document.getElementById('predChart');
const input = document.getElementById('imageFile');
const fileNameEl = document.getElementById('fileName');
const dropzone = document.getElementById('dropzone');
const resultsArea = document.getElementById('resultsArea'); // le <main> des résultats (si présent)
let chartInstance = null;

// Randomise le motif de patounes à chaque chargement
(function randomizePaws() {
  const hasPaws = document.body.classList.contains('patoune-bg');
  if (!hasPaws) return;

  // Taille des empreintes (plus grand = plus espacé)
  const size = Math.floor(120 + Math.random() * 120); // 120–240px

  // Rotation du motif pour la diagonale aléatoire
  const rot = (Math.random() * 30 - 15).toFixed(2); // -15 à +15 deg

  // Décalage aléatoire pour casser l’alignement
  const posX = Math.floor(Math.random() * 200 - 100); // -100 à +100 px
  const posY = Math.floor(Math.random() * 200 - 100); // -100 à +100 px

  const root = document.documentElement; // :root
  root.style.setProperty('--paw-size', `${size}px`);
  root.style.setProperty('--paw-rot', `${rot}deg`);
  root.style.setProperty('--paw-pos-x', `${posX}px`);
  root.style.setProperty('--paw-pos-y', `${posY}px`);
})();


// ===== Utils
function formatLabel(raw) {
  const afterDash = raw.split('-')[1] || raw;
  const spaced = afterDash.replace(/_/g, ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function resetUI() {
  errorDiv.textContent = '';
  predictionsDiv.innerHTML = '';
  chartWrap && (chartWrap.style.display = 'none');
  resultsArea && (resultsArea.style.display = 'none');
  if (chartInstance) { chartInstance.destroy(); chartInstance = null; }
}

function renderChips(labels, scores) {
  predictionsDiv.innerHTML = '';
  labels.forEach((lbl, i) => {
    const p = document.createElement('div');
    p.className = 'chip';
    p.textContent = `${lbl} → ${scores[i].toFixed(2)}%`;
    predictionsDiv.appendChild(p);
  });
}

function renderChart(labels, scores) {
  if (!window.Chart) return;
  if (chartWrap) chartWrap.style.display = 'block';
  const ctx = chartCanvas.getContext('2d');
  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data: scores,
        borderWidth: 2,
        borderColor: '#fff',
        backgroundColor: ['#42a5f5', '#ff6f91', '#ffb74d']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: { callbacks: { label: t => `${t.label}: ${t.parsed}%` } }
      }
    }
  });
}

// ===== Fancy input (nom + drag&drop)
if (input && fileNameEl) {
  input.addEventListener('change', () => {
    fileNameEl.textContent = input.files[0] ? input.files[0].name : 'Aucun fichier choisi';
  });
}
if (dropzone) {
  ['dragenter','dragover'].forEach(evt =>
    dropzone.addEventListener(evt, e => { e.preventDefault(); e.stopPropagation(); dropzone.classList.add('dragover'); })
  );
  ['dragleave','drop'].forEach(evt =>
    dropzone.addEventListener(evt, e => { e.preventDefault(); e.stopPropagation(); dropzone.classList.remove('dragover'); })
  );
  dropzone.addEventListener('drop', e => {
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) { input.files = e.dataTransfer.files; fileNameEl.textContent = file.name; }
  });
}

// ===== Submit
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  resetUI();

  const file = input.files[0];
  if (!file) { errorDiv.textContent = 'Aucune image sélectionnée.'; return; }

  const reader = new FileReader();
  reader.onload = () => { preview.src = reader.result; preview.style.display = 'block'; };
  reader.readAsDataURL(file);

  document.body.classList.add('loading');
  btn.textContent = 'Prédiction en cours...';

  try {
    const formData = new FormData();
    formData.append('file', file);

    const resp = await fetch('/predict', { method: 'POST', body: formData });
    if (!resp.ok) {
      let msg = `Erreur serveur (${resp.status})`;
      try { const ejson = await resp.json(); if (ejson.error) msg = ejson.error; } catch {}
      throw new Error(msg);
    }

    const data = await resp.json();
    const predictions = Array.isArray(data) ? data : (data.predictions || []);
    if (!predictions.length) { errorDiv.textContent = 'Pas de prédictions retournées.'; return; }

    const labelsClean = predictions.map(p => formatLabel(p.label));
    const scoresPct = predictions.map(p => +(p.score * 100).toFixed(2));

    // Affiche la zone résultats (si tu utilises <main id="resultsArea">)
    if (resultsArea) resultsArea.style.display = 'grid';

    renderChips(labelsClean, scoresPct);
    renderChart(labelsClean, scoresPct);
  } catch (err) {
    errorDiv.textContent = err.message || 'Erreur inconnue.';
  } finally {
    document.body.classList.remove('loading');
    btn.textContent = 'Prédire';
  }
});

// Démarrage: cacher la zone résultats si présente
resultsArea && (resultsArea.style.display = 'none');
