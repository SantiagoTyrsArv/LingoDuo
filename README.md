# English Fácil 🇬🇧

Sitio web educativo para aprender inglés básico paso a paso, con ejercicios interactivos, tarjetas y pronunciación en voz alta. Está hecho solo con **HTML, CSS y JavaScript**, sin frameworks ni dependencias.

> Proyecto de Software Colaborativo

---

## 📑 Tabla de contenido

- [Cómo ejecutar el proyecto](#-cómo-ejecutar-el-proyecto)
- [Estructura de carpetas](#-estructura-de-carpetas)
- [Secciones del sitio](#-secciones-del-sitio)
  - [Inicio (`index.html`)](#-inicio-indexhtml)
  - [Estilos comunes (`css/`)](#-estilos-comunes-css)
  - [Números y abecedario (`numeros/`)](#-números-y-abecedario-numeros)
  - [Vocabulario (`vocabulario/`)](#-vocabulario-vocabulario)
  - [Verbo To Be (`tobe/`)](#-verbo-to-be-tobe)
- [Accesibilidad y diseño responsive](#-accesibilidad-y-diseño-responsive)
- [Tecnologías](#-tecnologías)
- [Integrantes](#-integrantes)

---

## 🚀 Cómo ejecutar el proyecto

No necesita instalación ni servidor de compilación.

1. Clona o descarga el repositorio.
2. Abre `index.html` en tu navegador.

También puedes servirlo localmente (recomendado para que la síntesis de voz funcione mejor):

```bash
# Con Python
python3 -m http.server 8000
# Luego abre http://localhost:8000
```

> 💡 La pronunciación usa la Web Speech API. Funciona mejor en **Chrome, Edge o Safari**.
> La fuente *Nunito* se carga desde Google Fonts; sin internet se usa una fuente del sistema.

---

## 📂 Estructura de carpetas

```
PROJECTENGLISH/
├── index.html                 # Página de inicio con acceso a los módulos
├── README.md
├── css/
│   └── estilos.css            # Estilos comunes a todo el sitio
├── numeros/
│   ├── numeros.html           # Módulo: Números y abecedario
│   ├── numeros.css
│   └── numeros.js
├── vocabulario/
│   ├── vocabulario.html       # Módulo: Vocabulario básico + mini-quiz
│   ├── vocabulario.css
│   └── vocabulario.js
└── tobe/
    ├── tobe.html              # Módulo: Verbo To Be
    ├── tobe.css
    └── tobe.js
```

Cada módulo vive en su propia carpeta con tres archivos (HTML, CSS y JS). Todas las páginas cargan primero `css/estilos.css` y después la hoja de estilos propia del módulo.

---

## 🧭 Secciones del sitio

### 🏠 Inicio (`index.html`)

Página principal del sitio.

- **Encabezado común** con el título *English Fácil* y el menú de navegación hacia todos los módulos (compartido por todas las páginas).
- **Bienvenida** con una breve descripción del sitio.
- **Tarjetas de acceso** a cada módulo:
  | Tarjeta | Descripción |
  |---|---|
  | 🔢 Números y abecedario | Números del 1 al 20, decenas hasta el 100 y letras de la A a la Z |
  | 📚 Vocabulario | Palabras básicas del día a día por categorías |
  | 🧩 Verbo To Be | Práctica de *am*, *is* y *are* en afirmativa, negativa y preguntas |
- **Pie de página** con el nombre del proyecto y sus integrantes.

---

### 🎨 Estilos comunes (`css/`)

**`estilos.css`** define la identidad visual compartida por todo el sitio:

- **Variables CSS** (`:root`): paleta de colores (primario morado `#6558d3`, secundario amarillo `#ffbd59`), colores de acierto/error, radios de borde y sombras.
- **Tipografía**: fuente *Nunito* (Google Fonts) con respaldo del sistema.
- **Componentes reutilizables**:
  - `.encabezado` y `.menu` — cabecera con degradado y navegación (resalta la página actual con `aria-current="page"`).
  - `.contenedor` — ancho máximo del contenido.
  - `.grilla` y `.tarjeta` — cuadrícula de tarjetas con efecto *hover*.
  - `.boton` y `.boton-secundario` — botones principal y secundario.
  - `.correcto` / `.incorrecto` — estados de retroalimentación en ejercicios.
  - `.pie` e `.integrantes` — pie de página.
- **Responsive** (`max-width: 520px`) y soporte para **`prefers-reduced-motion`**.

---

### 🔢 Números y abecedario (`numeros/`)

Módulo para aprender y **escuchar** números y letras en inglés.

**Contenido**

- **Números**: del 1 al 20 (*one* … *twenty*) y las decenas del 30 al 100 (*thirty* … *one hundred*) — 28 tarjetas.
- **Abecedario**: las 26 letras (mayúscula y minúscula), cada una con una palabra de ejemplo y un emoji (A → *Apple* 🍎, B → *Ball* ⚽, … Z → *Zebra* 🦓).

**Funcionamiento (`numeros.js`)**

- Las tarjetas se generan dinámicamente a partir de arreglos de datos (`numerosBasicos`, `decenas`, `abecedario`).
- Dos botones permiten **alternar** entre la sección *Numbers* y *The Alphabet*.
- Cada tarjeta tiene un botón **🔊 Escuchar** que pronuncia la palabra con `speechSynthesis`:
  - Busca una voz en inglés (`en-US`) y habla a velocidad reducida (`rate = 0.85`).
  - En las letras pronuncia la letra y la palabra (por ejemplo: *"A. Apple"*).
  - La tarjeta se resalta (`.hablando`) mientras suena.
- Si el navegador no soporta síntesis de voz, se desactivan los botones y se muestra un aviso.

---

### 📚 Vocabulario (`vocabulario/`)

Módulo de vocabulario básico con tarjetas giratorias y un mini-quiz.

**Categorías (10 palabras cada una)**

| Categoría | Ejemplos |
|---|---|
| 🎨 Colores | red → rojo, blue → azul, green → verde… |
| 🐾 Animales | dog → perro, cat → gato, lion → león… |
| 👨‍👩‍👧 Familia | mother → madre, brother → hermano, uncle → tío… |

**Tarjetas de vocabulario**

- Al elegir una categoría se muestran sus tarjetas.
- Cada tarjeta muestra el emoji y la palabra en inglés; al hacer clic **se voltea en 3D** y muestra la traducción al español.

**Mini-quiz (`vocabulario.js`)**

- 5 preguntas aleatorias tomadas de todas las categorías: *"¿Qué significa **dog**?"*.
- 4 opciones por pregunta; los distractores salen de la **misma categoría** para aumentar el reto (mezcla con el algoritmo Fisher-Yates).
- Retroalimentación inmediata: marca la respuesta correcta y la incorrecta elegida.
- Resultado final con puntaje y mensaje según el desempeño, y botón para **reiniciar** con preguntas nuevas.

---

### 🧩 Verbo To Be (`tobe/`)

Lección de gramática de nivel inicial sobre el verbo *to be* (ser / estar).

**01 · Conjugación**
Tabla con cada pronombre, su forma del verbo, un ejemplo y su traducción:

| Pronombre | To be | Ejemplo |
|---|---|---|
| I | am | I am happy. |
| You | are | You are a student. |
| He / She / It | is | She is at home. |
| We / They | are | They are friends. |

**02 · Así se forman las oraciones**
Pestañas interactivas con la estructura y 4 ejemplos de cada tipo, coloreando sujeto, verbo, negación y complemento:

- **Afirmativa**: Sujeto + am/is/are + complemento → *He is tall.*
- **Negativa**: Sujeto + am/is/are + not + complemento → *She is not my sister.*
- **Interrogativa**: Am/Is/Are + sujeto + complemento + ? → *Are you okay?*

**03 · ¡Te toca practicar!**
Ejercicio de 8 oraciones para completar con *am*, *is* o *are* mediante listas desplegables.

**Funcionamiento (`tobe.js`)**

- Pestañas accesibles con navegación por teclado (flechas ← →, `Home` y `End`).
- **Verificar respuestas**: califica cada oración, muestra la respuesta correcta en las fallidas y da un puntaje final con un mensaje motivador.
- **Reiniciar**: limpia todas las respuestas y resultados.

---

## ♿ Accesibilidad y diseño responsive

- Uso de HTML semántico (`header`, `nav`, `main`, `section`, `footer`) y atributos ARIA (`aria-current`, `aria-pressed`, `aria-live`, `role="tablist"`, etc.).
- Atributo `lang="en"` en las palabras en inglés para que los lectores de pantalla las pronuncien correctamente.
- Retroalimentación anunciada con regiones `aria-live`.
- Diseño adaptable a móviles mediante media queries en cada hoja de estilos.
- Respeta la preferencia del sistema de **reducir movimiento**.

---

## 🛠️ Tecnologías

- **HTML5**
- **CSS3** (variables, Grid, Flexbox, transformaciones 3D)
- **JavaScript** (vanilla, manipulación del DOM)
- **Web Speech API** (`speechSynthesis`) para la pronunciación
- **Google Fonts** (Nunito)

---

## 👥 Integrantes

- Santiago Felipe Arevalo Bastidas
- Steven Alejandro Ortega Riascos
- Jose Luis Burbano Buchelly
