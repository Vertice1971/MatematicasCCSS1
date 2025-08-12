// visual.js
// Módulo de utilidades gráficas para intervalos y entornos

(function() {
  'use strict';

  /**
   * Dibuja un intervalo o entorno en el canvas especificado.
   * @param {HTMLCanvasElement} canvas – El canvas donde dibujar.
   * @param {number|null} a – Extremo izquierdo (null para infinitos o entornos).
   * @param {number|null} b – Extremo derecho (null para infinitos o entornos).
   * @param {boolean} leftClosed – Si el extremo izquierdo está cerrado.
   * @param {boolean} rightClosed – Si el extremo derecho está cerrado.
   * @param {number|null} [center=null] – Centro del entorno (opcional).
   * @param {number|null} [radius=null] – Radio del entorno (opcional).
   * @param {boolean} [isReduced=false] – Si el entorno es reducido (excluye el centro).
   */
  function drawInterval(canvas, a, b, leftClosed, rightClosed, center = null, radius = null, isReduced = false) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const margin = 40;
    const lineY = canvas.height / 2;
    const lineWidth = canvas.width - 2 * margin;

    // Línea base
    ctx.strokeStyle = '#34495e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(margin, lineY);
    ctx.lineTo(canvas.width - margin, lineY);
    ctx.stroke();

    // Intervalo finito
    if (a !== null && b !== null) {
      const range = b - a;
      const buffer = range * 0.2;
      const total = range + 2 * buffer;
      const startPos = margin + (buffer / total) * lineWidth;
      const endPos   = margin + ((buffer + range) / total) * lineWidth;

      ctx.strokeStyle = '#e74c3c';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(startPos, lineY);
      ctx.lineTo(endPos, lineY);
      ctx.stroke();

      drawPoint(ctx, startPos, lineY, leftClosed);
      drawPoint(ctx, endPos,   lineY, rightClosed);

      ctx.fillStyle = '#2c3e50';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(a.toString(), startPos, lineY + 25);
      ctx.fillText(b.toString(), endPos,   lineY + 25);
      return;
    }

    // Entorno centrado
    if (center !== null && radius !== null) {
      const centerPos = canvas.width / 2;
      const radiusPx  = (radius / 10) * lineWidth * 0.3;

      ctx.strokeStyle = '#4ecdc4';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(centerPos - radiusPx, lineY);
      ctx.lineTo(centerPos + radiusPx, lineY);
      ctx.stroke();

      drawPoint(ctx, centerPos,             lineY, !isReduced, '#4ecdc4');
      drawPoint(ctx, centerPos - radiusPx, lineY, false,      '#4ecdc4');
      drawPoint(ctx, centerPos + radiusPx, lineY, false,      '#4ecdc4');

      ctx.fillStyle = '#2c3e50';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText((center - radius).toString(), centerPos - radiusPx, lineY + 25);
      ctx.fillText(center.toString(),             centerPos,             lineY + 25);
      ctx.fillText((center + radius).toString(), centerPos + radiusPx, lineY + 25);
      return;
    }

    // Intervalo infinito a la derecha
    if (a !== null && b === null) {
      const pos = canvas.width * 0.3;
      ctx.strokeStyle = '#e74c3c';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(pos, lineY);
      ctx.lineTo(canvas.width - margin, lineY);
      ctx.stroke();

      drawPoint(ctx, pos, lineY, leftClosed);

      // Flecha final
      ctx.beginPath();
      ctx.moveTo(canvas.width - margin, lineY);
      ctx.lineTo(canvas.width - margin - 10, lineY - 5);
      ctx.lineTo(canvas.width - margin - 10, lineY + 5);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#2c3e50';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(a.toString(), pos, lineY + 25);
      return;
    }

    // Intervalo infinito a la izquierda
    if (a === null && b !== null) {
      const pos = canvas.width * 0.7;
      ctx.strokeStyle = '#e74c3c';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(margin, lineY);
      ctx.lineTo(pos,   lineY);
      ctx.stroke();

      drawPoint(ctx, pos, lineY, rightClosed);

      // Flecha inicial
      ctx.beginPath();
      ctx.moveTo(margin, lineY);
      ctx.lineTo(margin + 10, lineY - 5);
      ctx.lineTo(margin + 10, lineY + 5);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#2c3e50';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(b.toString(), pos, lineY + 25);
    }
  }

  /**
   * Dibuja un punto relleno o abierto.
   * @param {CanvasRenderingContext2D} ctx – Contexto 2D.
   * @param {number} x – Posición X.
   * @param {number} y – Posición Y.
   * @param {boolean} closed – Verdadero si es punto cerrado (relleno).
   * @param {string} [color='#e74c3c'] – Color del punto y borde.
   */
  function drawPoint(ctx, x, y, closed, color = '#e74c3c') {
    ctx.fillStyle   = closed ? color : 'white';
    ctx.strokeStyle = color;
    ctx.lineWidth   = 3;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2 * Math.PI);
    ctx.fill();
    if (!closed) ctx.stroke();
  }

  // Exponer globalmente
  window.drawInterval = drawInterval;
  window.drawPoint    = drawPoint;
})();
