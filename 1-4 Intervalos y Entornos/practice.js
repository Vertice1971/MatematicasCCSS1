// practice.js
(function() {
  'use strict';

  let stats = { correctas: 0, incorrectas: 0 };
  let currentQuestion = {};

  // Actualiza los contadores
  function updateStats() {
    const { correctas, incorrectas } = stats;
    document.getElementById('correctas').textContent = correctas;
    document.getElementById('incorrectas').textContent = incorrectas;
    const total = correctas + incorrectas;
    document.getElementById('porcentaje').textContent = total > 0
      ? Math.round((correctas / total) * 100) + '%'
      : '0%';
  }

  // Genera un intervalo aleatorio
  function generateRandomInterval() {
    const types = ['closed','open','semi-left','semi-right','inf-right','inf-left'];
    const type = types[Math.floor(Math.random() * types.length)];
    let a, b, leftClosed, rightClosed, notation, description;

    switch(type) {
      case 'closed':
        a = Math.floor(Math.random() * 10) - 3;
        b = a + Math.floor(Math.random() * 5) + 1;
        leftClosed = rightClosed = true;
        notation = `[${a},${b}]`;
        description = `Intervalo cerrado de ${a} a ${b}`;
        break;
      case 'open':
        a = Math.floor(Math.random() * 10) - 3;
        b = a + Math.floor(Math.random() * 5) + 1;
        leftClosed = rightClosed = false;
        notation = `(${a},${b})`;
        description = `Intervalo abierto de ${a} a ${b}`;
        break;
      case 'semi-left':
        a = Math.floor(Math.random() * 10) - 3;
        b = a + Math.floor(Math.random() * 5) + 1;
        leftClosed = true; rightClosed = false;
        notation = `[${a},${b})`;
        description = `Intervalo semiabierto de ${a} (incluido) a ${b}`;
        break;
      case 'semi-right':
        a = Math.floor(Math.random() * 10) - 3;
        b = a + Math.floor(Math.random() * 5) + 1;
        leftClosed = false; rightClosed = true;
        notation = `(${a},${b}]`;
        description = `Intervalo semiabierto de ${a} a ${b} (incluido)`;
        break;
      case 'inf-right':
        a = Math.floor(Math.random() * 10) - 3;
        leftClosed = Math.random() > 0.5;
        b = null; rightClosed = false;
        notation = leftClosed ? `[${a},+∞)` : `(${a},+∞)`;
        description = leftClosed ? `Números ≥ ${a}` : `Números > ${a}`;
        break;
      case 'inf-left':
        b = Math.floor(Math.random() * 10) - 3;
        rightClosed = Math.random() > 0.5;
        a = null; leftClosed = false;
        notation = rightClosed ? `(-∞,${b}]` : `(-∞,${b})`;
        description = rightClosed ? `Números ≤ ${b}` : `Números < ${b}`;
        break;
    }

    return { a, b, leftClosed, rightClosed, notation, description, type };
  }

  // Devuelve la selección correcta para comparar
  function getIntervalTypeFromQuestion() {
    switch(currentQuestion.type) {
      case 'closed':      return '[a,b]';
      case 'open':        return '(a,b)';
      case 'semi-left':   return '[a,b)';
      case 'semi-right':  return '(a,b]';
      case 'inf-right':   return currentQuestion.leftClosed ? '[a,inf)'  : '(a,inf)';
      case 'inf-left':    return currentQuestion.rightClosed? '(-inf,b]' : '(-inf,b)';
    }
  }

  // Presenta nueva pregunta de intervalo
  function newIntervalQuestion() {
    currentQuestion = generateRandomInterval();
    document.getElementById('interval-question').innerHTML =
      `<p><strong>Identifica este intervalo:</strong></p><p>Observa el gráfico y responde:</p>`;

    const canvas = document.getElementById('visualCanvas');
    window.drawInterval(
      canvas,
      currentQuestion.a,
      currentQuestion.b,
      currentQuestion.leftClosed,
      currentQuestion.rightClosed
    );
    document.getElementById('intervalType').value = '';
    document.getElementById('intervalNotation').value = '';
    document.getElementById('intervalResult').style.display = 'none';
  }

  // Comprueba respuesta de intervalo
  function checkInterval() {
    const selected = document.getElementById('intervalType').value;
    const notationIn = document.getElementById('intervalNotation').value.trim();
    const res = document.getElementById('intervalResult');

    if (!selected || !notationIn) {
      res.className = 'result incorrect';
      res.innerHTML = '⚠️ Por favor, completa ambos campos';
      res.style.display = 'block';
      return;
    }

    const correctType     = getIntervalTypeFromQuestion();
    const correctNotation = currentQuestion.notation;
    const okType     = selected === correctType;
    const okNotation = notationIn === correctNotation;

    if (okType && okNotation) {
      stats.correctas++;
      res.className = 'result correct';
      res.innerHTML = '✅ ¡Correcto! Excelente trabajo.';
    } else if (okType && !okNotation) {
      stats.incorrectas++;
      res.className = 'result incorrect';
      res.innerHTML = `⚠️ Has identificado bien el tipo de intervalo, pero la notación es incorrecta. La correcta era <strong>${correctNotation}</strong>.`;
    } else {
      stats.incorrectas++;
      res.className = 'result incorrect';

      // Mostrar texto descriptivo del tipo correcto
      const typeText = {
        '[a,b]': 'Cerrado [a,b]',
        '(a,b)': 'Abierto (a,b)',
        '[a,b)': 'Semiabierto [a,b)',
        '(a,b]': 'Semiabierto (a,b]',
        '[a,inf)': 'Cerrado al infinito [a,+∞)',
        '(a,inf)': 'Abierto al infinito (a,+∞)',
        '(-inf,b]': 'Del infinito cerrado (-∞,b]',
        '(-inf,b)': 'Del infinito abierto (-∞,b)'
      };

      const correctTypeKey = getIntervalTypeFromQuestion();
      const correctTypeLabel = typeText[correctTypeKey] || correctTypeKey;

      res.innerHTML = `
        ❌ Has identificado mal el tipo de intervalo.<br>
        ✅ Tipo correcto: <strong>${correctTypeLabel}</strong><br>
        ✅ Notación correcta: <strong>${correctNotation}</strong>
      `;
    }

    res.style.display = 'block';
    updateStats();
  }

  // Genera entorno en canvas
  function createEntorno() {
    const centro = parseFloat(document.getElementById('entornoCentro').value);
    const radio  = parseFloat(document.getElementById('entornoRadio').value);
    const tipo   = document.getElementById('entornoTipo').value;
    const res    = document.getElementById('entornoResult');

    if (isNaN(centro) || isNaN(radio)) {
      res.className = 'result incorrect';
      res.innerHTML = '⚠️ Introduce valores válidos para centro y radio.';
      res.style.display = 'block';
      return;
    }

    const isReduced = tipo === 'reducido';
    const canvas    = document.getElementById('entornoCanvas');
    window.drawInterval(canvas, null, null, false, false, centro, radio, isReduced);

    const notation = isReduced
      ? `E(${centro}, ${radio}) = (${centro - radio}, ${centro + radio}) \\ {${centro}}`
      : `E(${centro}, ${radio}) = (${centro - radio}, ${centro + radio})`;

    res.className = 'result correct';
    res.innerHTML = `🎨 Entorno ${tipo} generado: ${notation}`;
    res.style.display = 'block';
  }

  // Comprueba pertenencia
  function checkPertenencia() {
    const num  = parseFloat(document.getElementById('numeroComprobar').value);
    const izq  = parseFloat(document.getElementById('extremoIzq').value);
    const der  = parseFloat(document.getElementById('extremoDer').value);
    const lInc = document.getElementById('incluyeIzq').value === 'si';
    const rInc = document.getElementById('incluyeDer').value === 'si';
    const res  = document.getElementById('pertenenciaResult');

    if (isNaN(num) || isNaN(izq) || isNaN(der)) {
      res.className = 'result incorrect';
      res.innerHTML = '⚠️ Completa todos los campos numéricos.';
      res.style.display = 'block';
      return;
    }

    let pertenece = true;
    if (lInc ? num < izq : num <= izq) pertenece = false;
    if (rInc ? num > der : num >= der) pertenece = false;

    if (pertenece) {
      stats.correctas++;
      res.className = 'result correct';
      res.innerHTML = `✅ ${num} pertenece al intervalo.`;
    } else {
      stats.incorrectas++;
      res.className = 'result incorrect';
      res.innerHTML = `❌ ${num} no pertenece al intervalo.`;
    }

    res.style.display = 'block';
    updateStats();
  }

  // Inserta símbolos desde mini-teclado
  function setupSymbolKeyboard() {
    const notationInput = document.getElementById('intervalNotation');
    document.getElementById('symbolKeyboard').addEventListener('click', e => {
      if (e.target.classList.contains('key')) {
        const sym   = e.target.textContent;
        const start = notationInput.selectionStart;
        const end   = notationInput.selectionEnd;
        const val   = notationInput.value;
        notationInput.value = val.slice(0, start) + sym + val.slice(end);
        notationInput.focus();
        notationInput.setSelectionRange(start + 1, start + 1);
      }
    });
  }

  // Inicialización
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('newIntervalBtn').addEventListener('click', newIntervalQuestion);
    document.getElementById('checkIntervalBtn').addEventListener('click', checkInterval);
    document.getElementById('createEntornoBtn').addEventListener('click', createEntorno);
    document.getElementById('checkPertenenciaBtn').addEventListener('click', checkPertenencia);
    setupSymbolKeyboard();
    newIntervalQuestion();
    updateStats();
  });

})();
