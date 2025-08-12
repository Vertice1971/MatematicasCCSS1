// theory.js
(function() {
  'use strict';

  /**
   * Muestra la sección indicada y oculta las demás.
   * @param {string} screenId - ID de la sección a mostrar ('theory' o 'practice').
   */
  function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.toggle('active', screen.id === screenId);
    });
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-screen') === screenId);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Configurar botones de navegación
    document.querySelectorAll('.nav-btn').forEach(button => {
      button.addEventListener('click', () => {
        showScreen(button.getAttribute('data-screen'));
      });
    });
    // Mostrar teoría por defecto al cargar
    showScreen('theory');
  });
})();
