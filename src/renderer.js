// Variables iniciales del temporizador y configuración por defecto
let totalSeconds = 25 * 60; // Tiempo total en segundos (25 minutos)
let intervalId = null;      // Identificador del intervalo, se usa para pausar el temporizador
let endTime = null;         // Marca de tiempo objetivo, evita el drift del setInterval
let cyclesRemaining = 2;    // Ciclos restantes por completar
let isBreak = false;        // Indica si estamos en un periodo de descanso
let workMinutes = 25;       // Duración del trabajo en minutos
let breakMinutes = 5;       // Duración del descanso en minutos
let completedCycles = 0;    // Ciclos completados
let totalCycles = 2;        // Ciclos totales definidos por el usuario

// Referencias a elementos del DOM
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const hoursSelect = document.getElementById('hoursSelect');
const setTimeBtn = document.getElementById('setTimeBtn');
const workInput = document.getElementById('workDuration');
const breakInput = document.getElementById('breakDuration');
const cycleCounter = document.getElementById('cycleCounter');
const progressBar = document.getElementById('progressBar');
const modeLabel = document.getElementById('modeLabel');
const toast = document.getElementById('toast');

const clickSound = document.getElementById('clickSound');
const alertSound = document.getElementById('alertSound');

let toastTimeout = null;

// Muestra una notificación no bloqueante dentro de la app
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('visible');
  }, 4000);
}

// Cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
  // Agrega efecto de sonido a todos los botones principales
  [startBtn, pauseBtn, resetBtn, setTimeBtn].forEach(btn => {
    btn.addEventListener('click', () => {
      if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.volume = 0.5;
        clickSound.play();
      }
    });
  });

  // Muestra el tiempo y contador inicial al cargar
  updateDisplay();
  updateCycleCounter();
  updateModeLabel();
});

// Actualiza el texto del temporizador en pantalla
function updateDisplay() {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  timerDisplay.textContent =
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Actualiza la visualización de ciclos y barra de progreso
function updateCycleCounter() {
  cycleCounter.textContent = `Cycles completed: ${completedCycles}`;
  const percent = (completedCycles / totalCycles) * 100;
  progressBar.style.width = `${percent}%`;

  const cycleTotal = document.getElementById('cycleTotal');
  if (cycleTotal) {
    cycleTotal.textContent = `Total cycles: ${totalCycles}`;
  }
}

// Actualiza el indicador del modo actual (trabajo / descanso / completo)
function updateModeLabel() {
  if (!modeLabel) return;

  if (completedCycles >= totalCycles) {
    modeLabel.textContent = 'Session complete';
    modeLabel.className = 'done';
    return;
  }

  if (isBreak) {
    modeLabel.textContent = 'Break';
    modeLabel.className = 'break';
  } else {
    modeLabel.textContent = 'Deep work';
    modeLabel.className = 'work';
  }
}

// Aplica los ajustes personalizados del Pomodoro
function setPomodoroSettings(hours, work, rest) {
  workMinutes = work;
  breakMinutes = rest;

  // Calcula cuántos ciclos entran en el tiempo total definido
  const cycleDuration = workMinutes + breakMinutes; // en minutos
  const cyclesPerHour = 60 / cycleDuration;
  totalCycles = Math.floor(hours * cyclesPerHour);

  // Reinicia los contadores y establece nuevo tiempo inicial
  cyclesRemaining = totalCycles;
  isBreak = false;
  completedCycles = 0;
  totalSeconds = workMinutes * 60;

  updateDisplay();
  updateCycleCounter();
  updateModeLabel();
}

// Reproduce el sonido de alerta
function playAlertSound() {
  if (!alertSound) return;
  alertSound.currentTime = 0;
  alertSound.volume = 0.4;
  alertSound.play();
}

// Calcula el tiempo restante usando la marca de tiempo objetivo
function computeRemaining() {
  if (endTime === null) return totalSeconds;
  const remaining = Math.ceil((endTime - Date.now()) / 1000);
  return Math.max(0, remaining);
}

// Inicia el temporizador si no está corriendo
function startTimer() {
  if (intervalId) return; // Evita múltiples temporizadores activos
  if (totalSeconds <= 0) return;

  endTime = Date.now() + totalSeconds * 1000;
  intervalId = setInterval(tick, 250);
}

// Tick basado en tiempo real: evita el drift acumulado del setInterval
function tick() {
  totalSeconds = computeRemaining();
  updateDisplay();

  if (totalSeconds <= 0) {
    clearInterval(intervalId);
    intervalId = null;
    endTime = null;
    handleCycleEnd();
  }
}

// Gestiona el cambio entre trabajo, descanso y fin de sesión
function handleCycleEnd() {
  playAlertSound();

  if (isBreak) {
    // Terminó un descanso → empieza trabajo
    cyclesRemaining--;
    completedCycles++;
    updateCycleCounter();

    if (cyclesRemaining === 0) {
      showToast('✅ ¡Terminaste todos los ciclos! ¡Buen trabajo!');
      updateModeLabel();
      return;
    }

    isBreak = false;
    totalSeconds = workMinutes * 60;
    showToast('🎯 ¡Hora de trabajar!');
  } else {
    // Terminó trabajo → empieza descanso
    isBreak = true;
    totalSeconds = breakMinutes * 60;
    showToast('☕ ¡Descanso!');
  }

  updateDisplay();
  updateModeLabel();
  startTimer(); // Reinicia el ciclo siguiente automáticamente
}

// Pausa el temporizador
function pauseTimer() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    totalSeconds = computeRemaining();
    endTime = null;
    updateDisplay();
  }
}

// Reinicia todos los valores usando inputs actuales
function resetTimer() {
  pauseTimer();
  const hours = parseInt(hoursSelect.value);
  const work = parseInt(workInput.value);
  const rest = parseInt(breakInput.value);
  setPomodoroSettings(hours, work, rest);
}

// Al hacer clic en "Aplicar", valida e instala nueva configuración
setTimeBtn.addEventListener('click', () => {
  const hours = parseInt(hoursSelect.value);
  const work = parseInt(workInput.value);
  const rest = parseInt(breakInput.value);

  // Validación de entradas
  if (
    isNaN(hours) || hours < 1 || hours > 8 ||
    isNaN(work) || work < 1 || work > 90 ||
    isNaN(rest) || rest < 1 || rest > 30
  ) {
    showToast('⚠️ Verifica los valores: horas 1–8, trabajo 1–90 min, descanso 1–30 min.');
    return;
  }

  pauseTimer();
  setPomodoroSettings(hours, work, rest);
});

// Eventos de los botones principales
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// ---------- Controles de la barra de título ----------
const winMinBtn = document.getElementById('winMinimize');
const winMaxBtn = document.getElementById('winMaximize');
const winCloseBtn = document.getElementById('winClose');
const winMaxIcon = document.getElementById('winMaxIcon');
const winRestoreIcon = document.getElementById('winRestoreIcon');

if (window.focusdeckWindow) {
  winMinBtn?.addEventListener('click', () => window.focusdeckWindow.minimize());
  winMaxBtn?.addEventListener('click', () => window.focusdeckWindow.toggleMaximize());
  winCloseBtn?.addEventListener('click', () => window.focusdeckWindow.close());

  // Alterna el ícono entre maximizar (□) y restaurar (❐) según el estado real.
  window.focusdeckWindow.onMaximizedChange((isMax) => {
    if (winMaxIcon) winMaxIcon.style.display = isMax ? 'none' : 'block';
    if (winRestoreIcon) winRestoreIcon.style.display = isMax ? 'block' : 'none';
    winMaxBtn?.setAttribute('aria-label', isMax ? 'Restore' : 'Maximize');
    winMaxBtn?.setAttribute('title', isMax ? 'Restore' : 'Maximize');
  });
}

// ---------- Modo cine para YouTube ----------
const cinemaBtn = document.getElementById('cinemaBtn');
const webview = document.querySelector('webview');
let isCinema = false;

// Aplica o revierte el modo cine dentro del webview
function injectCinemaStyle() {
  const jsCode = `
    (function () {
      const ID = 'cinema-style';
      const WRAP_ID = 'cinema-fixed-wrap';

      // Eliminar estilos anteriores
      document.getElementById(ID)?.remove();

      // Cancela reintentos pendientes del toggle anterior
      if (window.__cinemaRetry) {
        clearTimeout(window.__cinemaRetry);
        window.__cinemaRetry = null;
      }

      function applyWrapper() {
        if (document.getElementById(WRAP_ID)) return;

        const mp = document.querySelector('#movie_player');
        if (!mp) {
          // El reproductor aún no carga; reintenta hasta que exista.
          window.__cinemaRetry = setTimeout(applyWrapper, 1000);
          return;
        }

        const w = document.createElement('div');
        w.id = WRAP_ID;
        w.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; display:flex; align-items:center; justify-content:center; z-index:9999; background:black; pointer-events:none;';
        mp.parentNode.insertBefore(w, mp);
        w.appendChild(mp);
        mp.style.pointerEvents = 'auto';
      }

      if (${isCinema}) {
        // Estilos CSS
        const style = document.createElement('style');
        style.id = ID;
        style.textContent = \`
          #masthead-container, ytd-masthead, ytd-app[role="main"] > tp-yt-app-drawer, ytd-mini-guide-renderer,
          ytd-merch-shelf-renderer, ytd-video-secondary-info-renderer, ytd-comments,
          ytd-watch-next-secondary-results-renderer, #chat, #panels, ytd-watch-metadata,
          #info, #meta, ytd-engagement-panel-section-list-renderer, tp-yt-paper-tabs,
          ytd-reel-shelf-renderer, #below {
            display: none !important;
          }

          ytd-app, html, body {
            overflow: hidden !important;
            max-height: 100vh !important;
            background: black !important;
          }

          #movie_player {
            width: 100% !important;
            height: auto !important;
            aspect-ratio: 16 / 9 !important;
          }
        \`;
        document.head.appendChild(style);
        applyWrapper();
      } else {
        // Revertir: devolver el reproductor a su lugar original
        const w = document.getElementById(WRAP_ID);
        if (w) {
          const mp = w.querySelector('#movie_player');
          const target = document.querySelector('ytd-player #container');
          if (mp && target) target.appendChild(mp);
          w.remove();
        }
      }
    })();
  `;

  webview.executeJavaScript(jsCode).catch(err => {
    console.error('Error aplicando modo cine:', err);
  });
}

cinemaBtn.addEventListener('click', () => {
  if (!webview) return;

  isCinema = !isCinema;
  cinemaBtn.textContent = isCinema ? '🔙' : '🎬';
  injectCinemaStyle();
});

// Al terminar de cargar la página, reaplica el modo cine si está activo.
// Así se evita esperar un "did-finish-load" que podría nunca llegar.
webview.addEventListener('did-finish-load', () => {
  if (isCinema) injectCinemaStyle();
});
