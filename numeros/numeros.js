// Módulo "Números y abecedario"
// Genera las tarjetas desde arreglos y pronuncia las palabras con speechSynthesis.

// Números del 1 al 20
const numerosBasicos = [
  { numero: 1, palabra: "one" },
  { numero: 2, palabra: "two" },
  { numero: 3, palabra: "three" },
  { numero: 4, palabra: "four" },
  { numero: 5, palabra: "five" },
  { numero: 6, palabra: "six" },
  { numero: 7, palabra: "seven" },
  { numero: 8, palabra: "eight" },
  { numero: 9, palabra: "nine" },
  { numero: 10, palabra: "ten" },
  { numero: 11, palabra: "eleven" },
  { numero: 12, palabra: "twelve" },
  { numero: 13, palabra: "thirteen" },
  { numero: 14, palabra: "fourteen" },
  { numero: 15, palabra: "fifteen" },
  { numero: 16, palabra: "sixteen" },
  { numero: 17, palabra: "seventeen" },
  { numero: 18, palabra: "eighteen" },
  { numero: 19, palabra: "nineteen" },
  { numero: 20, palabra: "twenty" }
];

// Decenas del 30 al 100 (10 y 20 ya están en la lista anterior)
const decenas = [
  { numero: 30, palabra: "thirty" },
  { numero: 40, palabra: "forty" },
  { numero: 50, palabra: "fifty" },
  { numero: 60, palabra: "sixty" },
  { numero: 70, palabra: "seventy" },
  { numero: 80, palabra: "eighty" },
  { numero: 90, palabra: "ninety" },
  { numero: 100, palabra: "one hundred" }
];

const numeros = numerosBasicos.concat(decenas);

// Abecedario con palabra de ejemplo y emoji
const abecedario = [
  { letra: "A", palabra: "Apple", emoji: "🍎" },
  { letra: "B", palabra: "Ball", emoji: "⚽" },
  { letra: "C", palabra: "Cat", emoji: "🐱" },
  { letra: "D", palabra: "Dog", emoji: "🐶" },
  { letra: "E", palabra: "Elephant", emoji: "🐘" },
  { letra: "F", palabra: "Fish", emoji: "🐟" },
  { letra: "G", palabra: "Grapes", emoji: "🍇" },
  { letra: "H", palabra: "House", emoji: "🏠" },
  { letra: "I", palabra: "Ice cream", emoji: "🍦" },
  { letra: "J", palabra: "Juice", emoji: "🧃" },
  { letra: "K", palabra: "Key", emoji: "🔑" },
  { letra: "L", palabra: "Lion", emoji: "🦁" },
  { letra: "M", palabra: "Moon", emoji: "🌙" },
  { letra: "N", palabra: "Nose", emoji: "👃" },
  { letra: "O", palabra: "Orange", emoji: "🍊" },
  { letra: "P", palabra: "Pizza", emoji: "🍕" },
  { letra: "Q", palabra: "Queen", emoji: "👑" },
  { letra: "R", palabra: "Rabbit", emoji: "🐰" },
  { letra: "S", palabra: "Sun", emoji: "☀️" },
  { letra: "T", palabra: "Tree", emoji: "🌳" },
  { letra: "U", palabra: "Umbrella", emoji: "☂️" },
  { letra: "V", palabra: "Violin", emoji: "🎻" },
  { letra: "W", palabra: "Whale", emoji: "🐳" },
  { letra: "X", palabra: "Xylophone", emoji: "🎼" },
  { letra: "Y", palabra: "Yo-yo", emoji: "🪀" },
  { letra: "Z", palabra: "Zebra", emoji: "🦓" }
];

// ---------- Síntesis de voz ----------

const vozDisponible = "speechSynthesis" in window;
let vozIngles = null;

// Busca una voz en-US entre las instaladas en el navegador
function cargarVozIngles() {
  const voces = window.speechSynthesis.getVoices();
  vozIngles =
    voces.find((voz) => voz.lang === "en-US") ||
    voces.find((voz) => voz.lang.startsWith("en")) ||
    null;
}

if (vozDisponible) {
  cargarVozIngles();
  // Algunos navegadores cargan las voces de forma asíncrona
  window.speechSynthesis.addEventListener("voiceschanged", cargarVozIngles);
}

// Pronuncia un texto en inglés y resalta la tarjeta mientras suena
function pronunciar(texto, tarjeta) {
  if (!vozDisponible) return;

  // Detiene cualquier pronunciación anterior
  window.speechSynthesis.cancel();
  document.querySelectorAll(".hablando").forEach((el) => el.classList.remove("hablando"));

  const mensaje = new SpeechSynthesisUtterance(texto);
  mensaje.lang = "en-US";
  mensaje.rate = 0.85;
  if (vozIngles) mensaje.voice = vozIngles;

  tarjeta.classList.add("hablando");
  mensaje.onend = () => tarjeta.classList.remove("hablando");
  mensaje.onerror = () => tarjeta.classList.remove("hablando");

  window.speechSynthesis.speak(mensaje);
}

// ---------- Creación de tarjetas ----------

// Crea el botón "🔊 Escuchar" asociado a un texto
function crearBotonEscuchar(texto, tarjeta) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "boton boton-escuchar";
  boton.textContent = "🔊 Escuchar";
  boton.setAttribute("aria-label", "Escuchar " + texto);
  boton.disabled = !vozDisponible;
  boton.addEventListener("click", () => pronunciar(texto, tarjeta));
  return boton;
}

// Crea una tarjeta de número
function crearTarjetaNumero(item) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "tarjeta tarjeta-numero";

  const valor = document.createElement("span");
  valor.className = "valor";
  valor.textContent = item.numero;

  const palabra = document.createElement("p");
  palabra.className = "palabra";
  palabra.lang = "en";
  palabra.textContent = item.palabra;

  tarjeta.append(valor, palabra, crearBotonEscuchar(item.palabra, tarjeta));
  return tarjeta;
}

// Crea una tarjeta de letra
function crearTarjetaLetra(item) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "tarjeta tarjeta-letra";

  const valor = document.createElement("span");
  valor.className = "valor";
  valor.textContent = item.letra + " " + item.letra.toLowerCase();

  const emoji = document.createElement("span");
  emoji.className = "emoji";
  emoji.setAttribute("aria-hidden", "true");
  emoji.textContent = item.emoji;

  const palabra = document.createElement("p");
  palabra.className = "palabra";
  palabra.lang = "en";
  palabra.textContent = item.palabra;

  // Se pronuncia la letra seguida de la palabra: "A. Apple"
  const texto = item.letra + ". " + item.palabra;
  tarjeta.append(valor, emoji, palabra, crearBotonEscuchar(texto, tarjeta));
  return tarjeta;
}

// Llena una grilla con tarjetas a partir de un arreglo
function llenarGrilla(idGrilla, datos, crearTarjeta) {
  const grilla = document.getElementById(idGrilla);
  const fragmento = document.createDocumentFragment();
  datos.forEach((item) => fragmento.appendChild(crearTarjeta(item)));
  grilla.appendChild(fragmento);
}

// ---------- Alternar secciones ----------

function mostrarSeccion(nombre) {
  const esNumeros = nombre === "numeros";

  document.getElementById("seccion-numeros").hidden = !esNumeros;
  document.getElementById("seccion-abecedario").hidden = esNumeros;

  const btnNumeros = document.getElementById("btn-numeros");
  const btnAbecedario = document.getElementById("btn-abecedario");

  // El botón activo usa .boton y el inactivo .boton-secundario
  btnNumeros.className = esNumeros ? "boton" : "boton-secundario";
  btnAbecedario.className = esNumeros ? "boton-secundario" : "boton";
  btnNumeros.setAttribute("aria-pressed", esNumeros);
  btnAbecedario.setAttribute("aria-pressed", !esNumeros);

  if (vozDisponible) window.speechSynthesis.cancel();
}

// ---------- Inicio ----------

llenarGrilla("grilla-numeros", numeros, crearTarjetaNumero);
llenarGrilla("grilla-abecedario", abecedario, crearTarjetaLetra);

document.getElementById("btn-numeros").addEventListener("click", () => mostrarSeccion("numeros"));
document.getElementById("btn-abecedario").addEventListener("click", () => mostrarSeccion("abecedario"));

if (!vozDisponible) {
  document.getElementById("aviso-voz").hidden = false;
}
