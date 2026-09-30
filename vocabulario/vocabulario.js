// ==========================================================
// Módulo: Vocabulario básico
// ==========================================================

// ---------- Datos: palabras por categoría ----------
const vocabulario = {
  colores: [
    { ingles: "red", espanol: "rojo", emoji: "🔴" },
    { ingles: "blue", espanol: "azul", emoji: "🔵" },
    { ingles: "green", espanol: "verde", emoji: "🟢" },
    { ingles: "yellow", espanol: "amarillo", emoji: "🟡" },
    { ingles: "orange", espanol: "naranja", emoji: "🟠" },
    { ingles: "purple", espanol: "morado", emoji: "🟣" },
    { ingles: "black", espanol: "negro", emoji: "⚫" },
    { ingles: "white", espanol: "blanco", emoji: "⚪" },
    { ingles: "brown", espanol: "marrón", emoji: "🟤" },
    { ingles: "pink", espanol: "rosado", emoji: "🌸" }
  ],
  animales: [
    { ingles: "dog", espanol: "perro", emoji: "🐶" },
    { ingles: "cat", espanol: "gato", emoji: "🐱" },
    { ingles: "bird", espanol: "pájaro", emoji: "🐦" },
    { ingles: "fish", espanol: "pez", emoji: "🐟" },
    { ingles: "horse", espanol: "caballo", emoji: "🐴" },
    { ingles: "cow", espanol: "vaca", emoji: "🐮" },
    { ingles: "rabbit", espanol: "conejo", emoji: "🐰" },
    { ingles: "lion", espanol: "león", emoji: "🦁" },
    { ingles: "elephant", espanol: "elefante", emoji: "🐘" },
    { ingles: "monkey", espanol: "mono", emoji: "🐵" }
  ],
  familia: [
    { ingles: "mother", espanol: "madre", emoji: "👩" },
    { ingles: "father", espanol: "padre", emoji: "👨" },
    { ingles: "sister", espanol: "hermana", emoji: "👧" },
    { ingles: "brother", espanol: "hermano", emoji: "👦" },
    { ingles: "grandmother", espanol: "abuela", emoji: "👵" },
    { ingles: "grandfather", espanol: "abuelo", emoji: "👴" },
    { ingles: "baby", espanol: "bebé", emoji: "👶" },
    { ingles: "uncle", espanol: "tío", emoji: "🧔" },
    { ingles: "aunt", espanol: "tía", emoji: "👩‍🦰" },
    { ingles: "family", espanol: "familia", emoji: "👨‍👩‍👧" }
  ]
};

const TOTAL_PREGUNTAS = 5;

// ---------- Referencias al DOM ----------
const contenedorTarjetas = document.getElementById("tarjetas");
const botonesCategoria = document.querySelectorAll("[data-categoria]");

const quizJuego = document.getElementById("quiz-juego");
const quizProgreso = document.getElementById("quiz-progreso");
const quizPalabra = document.getElementById("quiz-palabra");
const quizOpciones = document.getElementById("quiz-opciones");
const quizRetro = document.getElementById("quiz-retro");
const botonSiguiente = document.getElementById("quiz-siguiente");
const quizResultado = document.getElementById("quiz-resultado");
const quizPuntaje = document.getElementById("quiz-puntaje");
const quizMensaje = document.getElementById("quiz-mensaje");
const botonReiniciar = document.getElementById("quiz-reiniciar");

// ---------- Utilidades ----------

// Crea un elemento con clase y texto opcionales
function crearElemento(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);
  if (clase) elemento.className = clase;
  if (texto) elemento.textContent = texto;
  return elemento;
}

// Devuelve una copia de la lista mezclada (algoritmo Fisher-Yates)
function mezclar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// ==========================================================
// Tarjetas de vocabulario
// ==========================================================

// Crea una tarjeta que se voltea al hacer clic
function crearTarjeta(palabra) {
  const tarjeta = crearElemento("button", "tarjeta-voltear");
  tarjeta.type = "button";
  tarjeta.setAttribute("aria-pressed", "false");

  const interior = crearElemento("div", "tarjeta-interior");

  // Cara frontal: emoji y palabra en inglés
  const frente = crearElemento("div", "tarjeta cara cara-frente");
  const palabraIngles = crearElemento("span", "tarjeta-palabra", palabra.ingles);
  palabraIngles.lang = "en";
  frente.append(
    crearElemento("span", "vocab-emoji", palabra.emoji),
    palabraIngles,
    crearElemento("span", "tarjeta-pista", "Toca para voltear")
  );

  // Cara trasera: traducción al español
  const atras = crearElemento("div", "tarjeta cara cara-atras");
  atras.append(
    crearElemento("span", "vocab-emoji", palabra.emoji),
    crearElemento("span", "tarjeta-palabra", palabra.espanol)
  );

  interior.append(frente, atras);
  tarjeta.appendChild(interior);

  // Al hacer clic se alterna la clase que activa el giro en CSS
  tarjeta.addEventListener("click", () => {
    const volteada = tarjeta.classList.toggle("volteada");
    tarjeta.setAttribute("aria-pressed", String(volteada));
  });

  return tarjeta;
}

// Muestra las tarjetas de la categoría elegida y marca el botón activo
function mostrarCategoria(categoria) {
  contenedorTarjetas.innerHTML = "";
  vocabulario[categoria].forEach((palabra) => {
    contenedorTarjetas.appendChild(crearTarjeta(palabra));
  });

  botonesCategoria.forEach((boton) => {
    const activo = boton.dataset.categoria === categoria;
    boton.className = activo ? "boton" : "boton-secundario";
    boton.setAttribute("aria-pressed", String(activo));
  });
}

botonesCategoria.forEach((boton) => {
  boton.addEventListener("click", () => mostrarCategoria(boton.dataset.categoria));
});

// ==========================================================
// Mini-quiz
// ==========================================================

let preguntas = [];
let indiceActual = 0;
let puntaje = 0;

// Elige palabras al azar de todas las categorías y arma 4 opciones por pregunta
function generarPreguntas() {
  const todas = Object.entries(vocabulario).flatMap(([categoria, palabras]) =>
    palabras.map((palabra) => ({ ...palabra, categoria }))
  );

  return mezclar(todas)
    .slice(0, TOTAL_PREGUNTAS)
    .map((palabra) => {
      // Las opciones incorrectas salen de la misma categoría para que sea un reto
      const distractores = mezclar(
        vocabulario[palabra.categoria].filter((otra) => otra.espanol !== palabra.espanol)
      )
        .slice(0, 3)
        .map((otra) => otra.espanol);

      return {
        palabra,
        opciones: mezclar([palabra.espanol, ...distractores])
      };
    });
}

// Pinta la pregunta actual en pantalla
function mostrarPregunta() {
  const pregunta = preguntas[indiceActual];

  quizProgreso.textContent = `Pregunta ${indiceActual + 1} de ${TOTAL_PREGUNTAS}`;
  quizPalabra.textContent = pregunta.palabra.ingles;
  quizRetro.textContent = "";
  botonSiguiente.hidden = true;
  quizOpciones.innerHTML = "";

  pregunta.opciones.forEach((opcion) => {
    const boton = crearElemento("button", "opcion", opcion);
    boton.type = "button";
    boton.addEventListener("click", () => responder(boton, pregunta));
    quizOpciones.appendChild(boton);
  });
}

// Revisa la respuesta, marca las opciones y actualiza el puntaje
function responder(botonElegido, pregunta) {
  const respuestaCorrecta = pregunta.palabra.espanol;
  const esCorrecta = botonElegido.textContent === respuestaCorrecta;

  // Se bloquean las opciones y siempre se resalta la correcta
  quizOpciones.querySelectorAll(".opcion").forEach((boton) => {
    boton.disabled = true;
    if (boton.textContent === respuestaCorrecta) {
      boton.classList.add("correcto");
    }
  });

  if (esCorrecta) {
    puntaje++;
    quizRetro.textContent = "¡Correcto! 🎉";
  } else {
    botonElegido.classList.add("incorrecto");
    quizRetro.textContent = `Incorrecto. "${pregunta.palabra.ingles}" significa "${respuestaCorrecta}".`;
  }

  const esUltima = indiceActual === TOTAL_PREGUNTAS - 1;
  botonSiguiente.textContent = esUltima ? "Ver resultado" : "Siguiente";
  botonSiguiente.hidden = false;
  botonSiguiente.focus();
}

// Muestra el puntaje final con un mensaje según el desempeño
function mostrarResultado() {
  quizJuego.hidden = true;
  quizResultado.hidden = false;
  quizPuntaje.textContent = `Obtuviste ${puntaje} de ${TOTAL_PREGUNTAS}`;

  if (puntaje === TOTAL_PREGUNTAS) {
    quizMensaje.textContent = "¡Perfecto! Dominas este vocabulario. 🏆";
  } else if (puntaje >= 3) {
    quizMensaje.textContent = "¡Muy bien! Sigue practicando. 💪";
  } else {
    quizMensaje.textContent = "Repasa las tarjetas e inténtalo de nuevo. 📚";
  }

  botonReiniciar.focus();
}

// Empieza (o reinicia) el quiz con preguntas nuevas
function iniciarQuiz() {
  preguntas = generarPreguntas();
  indiceActual = 0;
  puntaje = 0;
  quizResultado.hidden = true;
  quizJuego.hidden = false;
  mostrarPregunta();
}

botonSiguiente.addEventListener("click", () => {
  indiceActual++;
  if (indiceActual < TOTAL_PREGUNTAS) {
    mostrarPregunta();
  } else {
    mostrarResultado();
  }
});

botonReiniciar.addEventListener("click", iniciarQuiz);

// ---------- Inicio ----------
mostrarCategoria("colores");
iniciarQuiz();
