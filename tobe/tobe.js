const pestanas = [...document.querySelectorAll('[role="tab"]')];
const paneles = [...document.querySelectorAll('[role="tabpanel"]')];

function activarPestana(pestana, moverFoco = false) {
  pestanas.forEach((elemento) => {
    const activa = elemento === pestana;
    elemento.setAttribute('aria-selected', String(activa));
    elemento.tabIndex = activa ? 0 : -1;
  });

  paneles.forEach((panel) => {
    panel.hidden = panel.id !== pestana.getAttribute('aria-controls');
  });

  if (moverFoco) pestana.focus();
}

pestanas.forEach((pestana, indice) => {
  pestana.addEventListener('click', () => activarPestana(pestana));
  pestana.addEventListener('keydown', (evento) => {
    let siguiente = indice;

    if (evento.key === 'ArrowRight') siguiente = (indice + 1) % pestanas.length;
    else if (evento.key === 'ArrowLeft') siguiente = (indice - 1 + pestanas.length) % pestanas.length;
    else if (evento.key === 'Home') siguiente = 0;
    else if (evento.key === 'End') siguiente = pestanas.length - 1;
    else return;

    evento.preventDefault();
    activarPestana(pestanas[siguiente], true);
  });
});

const formulario = document.querySelector('#formulario-ejercicio');
const resultado = document.querySelector('#resultado');
const preguntas = [...formulario.querySelectorAll('.lista-ejercicio li')];

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  let aciertos = 0;

  preguntas.forEach((pregunta) => {
    const respuestaCorrecta = pregunta.dataset.answer;
    const selector = pregunta.querySelector('select');
    const mensaje = pregunta.querySelector('.retroalimentacion');
    const esCorrecta = selector.value === respuestaCorrecta;

    selector.classList.toggle('correcto', esCorrecta);
    selector.classList.toggle('incorrecto', !esCorrecta);
    selector.setAttribute('aria-invalid', String(!esCorrecta));
    mensaje.classList.toggle('correcto', esCorrecta);
    mensaje.classList.toggle('incorrecto', !esCorrecta);
    mensaje.textContent = esCorrecta ? '¡Correcto!' : `Respuesta: ${respuestaCorrecta}`;

    if (esCorrecta) aciertos += 1;
  });

  let mensajeResultado;
  if (aciertos === preguntas.length) mensajeResultado = '¡Excelente! Dominas am, is y are.';
  else if (aciertos >= 6) mensajeResultado = '¡Muy bien! Ya casi lo tienes.';
  else if (aciertos >= 3) mensajeResultado = '¡Buen avance! Repasa las formas y vuelve a intentarlo.';
  else mensajeResultado = '¡Cada intento cuenta! Revisa la tabla y prueba de nuevo.';

  resultado.textContent = `Puntaje: ${aciertos} de ${preguntas.length}. ${mensajeResultado}`;
  resultado.classList.remove('correcto', 'incorrecto');
  resultado.classList.add(aciertos >= 6 ? 'correcto' : 'incorrecto');
  resultado.hidden = false;
});

document.querySelector('#reiniciar').addEventListener('click', () => {
  preguntas.forEach((pregunta) => {
    const selector = pregunta.querySelector('select');
    const mensaje = pregunta.querySelector('.retroalimentacion');
    selector.selectedIndex = 0;
    selector.classList.remove('correcto', 'incorrecto');
    selector.removeAttribute('aria-invalid');
    mensaje.textContent = '';
    mensaje.classList.remove('correcto', 'incorrecto');
  });

  resultado.textContent = '';
  resultado.classList.remove('correcto', 'incorrecto');
  resultado.hidden = true;
});
