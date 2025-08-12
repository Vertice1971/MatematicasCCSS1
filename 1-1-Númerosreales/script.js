// script.js

const ejemplosNumeros = {
  naturales: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 30, 40, 50, 60, 100
  ],
  enteros: [
    -30, -25, -20, -15, -10, -9, -8, -7, -6, -5,
    -4, -3, -2, -1, 0, -26, -27, -28, -29, -31,
    -32, -33, -34, -35, -36, -37, -38, -39, -41, -42
  ],
  racionales: [
    { display: '1/2', value: 0.5 },
    { display: '3/4', value: 0.75 },
    { display: '2/5', value: 0.4 },
    { display: '7/8', value: 0.875 },
    { display: '1/3', value: 0.333 },
    { display: '5/6', value: 0.833 },
    { display: '-3/5', value: -0.6 },
    { display: '4/5', value: 0.8 },
    { display: '9/10', value: 0.9 },
    { display: '11/20', value: 0.55 },
    { display: '13/25', value: 0.52 },
    { display: '2/3', value: 0.666 },
    { display: '-2/3', value: -0.666 },
    { display: '6/7', value: 0.857 },
    { display: '7/9', value: 0.777 },
    { display: '5/8', value: 0.625 },
    { display: '3/10', value: 0.3 },
    { display: '1/5', value: 0.2 },
    { display: '4/9', value: 0.444 },
    { display: '8/9', value: 0.888 },
    { display: '5/4', value: 1.25 },
    { display: '-7/10', value: -0.7 },
    { display: '3/2', value: 1.5 },
    { display: '10/3', value: 3.333 },
    { display: '15/4', value: 3.75 },
    { display: '12/5', value: 2.4 },
    { display: '16/7', value: 2.2857 },
    { display: '9/4', value: 2.25 },
    { display: '-1/4', value: -0.25 },
    { display: '-11/6', value: -1.833 }
  ],
  irracionales: [
    { display: 'π', value: Math.PI },
    { display: '√2', value: Math.SQRT2 },
    { display: '√3', value: Math.sqrt(3) },
    { display: '√5', value: Math.sqrt(5) },
    { display: '√7', value: Math.sqrt(7) },
    { display: '√11', value: Math.sqrt(11) },
    { display: '√13', value: Math.sqrt(13) },
    { display: '√17', value: Math.sqrt(17) },
    { display: '√19', value: Math.sqrt(19) },
    { display: '√23', value: Math.sqrt(23) },
    { display: 'e', value: Math.E },
    { display: 'φ', value: (1 + Math.sqrt(5)) / 2 },
    { display: 'π/2', value: Math.PI / 2 },
    { display: 'π/3', value: Math.PI / 3 },
    { display: 'π/4', value: Math.PI / 4 },
    { display: 'π/6', value: Math.PI / 6 },
    { display: 'ln(2)', value: Math.log(2) },
    { display: 'ln(10)', value: Math.log(10) },
    { display: 'log₂(3)', value: Math.log2(3) },
    { display: 'log₁₀(7)', value: Math.log10(7) },
    { display: 'e^π', value: Math.exp(Math.PI) },
    { display: 'π^e', value: Math.pow(Math.PI, Math.E) },
    { display: '2^√2', value: Math.pow(2, Math.SQRT2) },
    { display: '√(2+√3)', value: Math.sqrt(2 + Math.sqrt(3)) },
    { display: 'arcsin(1/2)', value: Math.asin(0.5) },
    { display: 'arctan(1)', value: Math.atan(1) },
    { display: 'tan(1)', value: Math.tan(1) },
    { display: 'sin(1)', value: Math.sin(1) },
    { display: 'cos(1)', value: Math.cos(1) },
    { display: '√π', value: Math.sqrt(Math.PI) }
  ]
};

const tipos = ['naturales','enteros','racionales','irracionales'];
let numeroActual = null;

function initZonas() {
  const juego = document.querySelector('#escena-practica .juego');
  const zonasContainer = document.createElement('div');
  zonasContainer.id = 'zonasNumericas';
  juego.insertBefore(zonasContainer, document.getElementById('numeroActual'));

  const configuracionZonas = [
    { clase: 'zona-irracional', tipo: 'irracionales', label: '𝕀' },
    { clase: 'zona-racional',    tipo: 'racionales',   label: 'ℚ' },
    { clase: 'zona-entero',      tipo: 'enteros',      label: 'ℤ' },
    { clase: 'zona-natural',     tipo: 'naturales',    label: 'ℕ' }
  ];

  configuracionZonas.forEach(cfg => {
    const zona = document.createElement('div');
    zona.className = cfg.clase;
    zona.dataset.tipo = cfg.tipo;
    zona.addEventListener('dragover', e => e.preventDefault());
    zona.addEventListener('drop', handleDrop);

    const etiqueta = document.createElement('div');
    etiqueta.className = 'zona-label';
    etiqueta.textContent = cfg.label;
    zona.appendChild(etiqueta);

    zonasContainer.appendChild(zona);
  });
}

function handleDragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.textContent);
}

function handleDrop(e) {
  e.preventDefault();
  const zona = e.currentTarget;
  const tipoZona = zona.dataset.tipo;
  const resultadoEl = document.getElementById('resultado');

  if (tipoZona === numeroActual.tipo) {
    resultadoEl.textContent = 'Correcto';
  } else {
    resultadoEl.textContent = 'Incorrecto. Debe ir en ' +
      numeroActual.tipo.charAt(0).toUpperCase() +
      numeroActual.tipo.slice(1);
  }

  const texto = e.dataTransfer.getData('text/plain');
  const ficha = document.createElement('div');
  ficha.className = 'ficha';
  ficha.textContent = texto;
  ficha.draggable = true;
  ficha.addEventListener('dragstart', handleDragStart);
  zona.appendChild(ficha);

  document.getElementById('siguienteBtn').disabled = false;
}

function nuevaPregunta() {
  tipos.forEach(t => {
    const zona = document.querySelector(`[data-tipo="${t}"]`);
    if (zona) zona.querySelectorAll('.ficha').forEach(f => f.remove());
  });
  document.getElementById('resultado').textContent = '';

  const tipo = tipos[Math.floor(Math.random() * tipos.length)];
  let candidato;

  if (tipo === 'naturales') {
    const lista = ejemplosNumeros.naturales;
    candidato = {
      display: lista[Math.floor(Math.random() * lista.length)],
      tipo
    };
  } else if (tipo === 'enteros') {
    const lista = ejemplosNumeros.enteros
      .filter(n => !ejemplosNumeros.naturales.includes(n));
    candidato = {
      display: lista[Math.floor(Math.random() * lista.length)],
      tipo
    };
  } else {
    const lista = ejemplosNumeros[tipo];
    const sel = lista[Math.floor(Math.random() * lista.length)];
    const usarDecimal = Math.random() < 0.5;
    const dec = sel.value.toFixed(4);
    const texto = usarDecimal
      ? (tipo === 'irracionales' ? `${dec}…` : dec)
      : sel.display;
    candidato = { display: texto, tipo };
  }

  numeroActual = candidato;
  const spawn = document.getElementById('numeroActual');
  spawn.innerHTML = '';

  const ficha = document.createElement('div');
  ficha.className = 'ficha';
  ficha.textContent = candidato.display;
  ficha.draggable = true;
  ficha.addEventListener('dragstart', handleDragStart);
  spawn.appendChild(ficha);

  document.getElementById('siguienteBtn').disabled = true;
}

function mostrarEscena(id) {
  document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

window.onload = () => {
  initZonas();
  mostrarEscena('escena-teoria');
  nuevaPregunta();

  document.getElementById('siguienteBtn')
    .addEventListener('click', nuevaPregunta);

  document.getElementById('teoriaBtn')
    .addEventListener('click', () => mostrarEscena('escena-teoria'));

  document.getElementById('practicaBtn')
    .addEventListener('click', () => mostrarEscena('escena-practica'));
};
