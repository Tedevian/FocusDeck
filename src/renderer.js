// Variables iniciales del temporizador y configuración por defecto
let totalSeconds = 25 * 60; // Tiempo total en segundos (25 minutos)
let intervalId = null;      // Identificador del intervalo, se usa para pausar el temporizador
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

const clickSound = document.getElementById('clickSound');
const alertSound = document.getElementById('alertSound');

// Cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
  // Agrega efecto de sonido a todos los botones principales
  [startBtn, pauseBtn, resetBtn, setTimeBtn].forEach(btn => {
    btn.addEventListener('click', () => {
      if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.volume = 0.2;
        clickSound.play();
      }
    });
  });

  // Muestra el tiempo y contador inicial al cargar
  updateDisplay();
  updateCycleCounter();
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
  cycleCounter.textContent = `Ciclos completados: ${completedCycles}`;
  const percent = (completedCycles / totalCycles) * 100;
  progressBar.style.width = `${percent}%`;

  const cycleTotal = document.getElementById('cycleTotal');
  if (cycleTotal) {
    cycleTotal.textContent = `Ciclos totales: ${totalCycles}`;
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
}

// Reproduce el sonido de alerta
function playAlertSound() {
  if (!alertSound) return;
  alertSound.currentTime = 0;
  alertSound.volume = 0.4;
  alertSound.play();
}

// Inicia el temporizador si no está corriendo
function startTimer() {
  if (intervalId) return; // Evita múltiples temporizadores activos

  intervalId = setInterval(() => {
    if (totalSeconds > 0) {
      totalSeconds--;
      updateDisplay();
    } else {
      // Fin del ciclo actual
      clearInterval(intervalId);
      intervalId = null;
      playAlertSound();

      if (isBreak) {
        // Terminó un descanso → empieza trabajo
        cyclesRemaining--;
        completedCycles++;
        updateCycleCounter();

        if (cyclesRemaining === 0) {
          alert('✅ ¡Terminaste todos los ciclos! ¡Buen trabajo!');
          return;
        }

        isBreak = false;
        totalSeconds = workMinutes * 60;
        alert('🎯 ¡Hora de trabajar!');
      } else {
        // Terminó trabajo → empieza descanso
        isBreak = true;
        totalSeconds = breakMinutes * 60;
        alert('☕ ¡Descanso!');
      }

      updateDisplay();
      startTimer(); // Reinicia el ciclo siguiente automáticamente
    }
  }, 1000); // Cada segundo
}

// Pausa el temporizador
function pauseTimer() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
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
    alert('Verifica los valores: horas 1–8, trabajo 1–90 min, descanso 1–30 min.');
    return;
  }

  pauseTimer();
  setPomodoroSettings(hours, work, rest);
});

// Eventos de los botones principales
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

