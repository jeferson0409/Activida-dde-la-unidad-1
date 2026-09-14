/**
 * scripts.js
 * jQuery + Validación de formulario + Animaciones
 * Hoja de vida — Jeferson Franco
 */

$(document).ready(function () {

  /* ═══════════════════════════════════════════
     1. ANIMACIÓN DE ENTRADA (Fade-in al cargar)
  ═══════════════════════════════════════════ */
  $('main, header').hide().fadeIn(600);

  /* ═══════════════════════════════════════════
     2. HOVER EN TARJETAS stat-card (jQuery)
  ═══════════════════════════════════════════ */
  $('.stat-card, .elemento-tiempo').on('mouseenter', function () {
    $(this).stop(true, true).animate({ 'margin-top': '-6px' }, 200);
  }).on('mouseleave', function () {
    $(this).stop(true, true).animate({ 'margin-top': '0px' }, 200);
  });

  /* ═══════════════════════════════════════════
     3. CONTADOR ANIMADO DE ESTADÍSTICAS
  ═══════════════════════════════════════════ */
  function animarContadores() {
    $('.numero-dato[data-target]').each(function () {
      const $el = $(this);
      const target = parseInt($el.data('target'));
      $({ count: 0 }).animate({ count: target }, {
        duration: 1200,
        easing: 'swing',
        step: function () {
          $el.text(Math.floor(this.count));
        },
        complete: function () {
          $el.text(target);
        }
      });
    });
  }

  // Ejecutar cuando la banda de datos entre en la vista
  if ($('#stats').length) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animarContadores();
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(document.getElementById('stats'));
  }

  /* ═══════════════════════════════════════════
     4. ANIMACIÓN DE SCROLL (slide-up en elementos)
  ═══════════════════════════════════════════ */
  const fadeItems = document.querySelectorAll('[data-aos]');
  if (fadeItems.length) {
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    fadeItems.forEach(el => scrollObserver.observe(el));
  }

  /* ═══════════════════════════════════════════
     5. EFECTO TYPEWRITER EN h1 (página inicio)
  ═══════════════════════════════════════════ */
  const $span = $('h1 span').first();
  if ($span.length) {
    const words = ['software', 'soluciones', 'futuro'];
    let wi = 0;
    setInterval(function () {
      wi = (wi + 1) % words.length;
      $span.fadeOut(300, function () {
        $(this).text(words[wi]).fadeIn(300);
      });
    }, 3000);
  }

  /* ═══════════════════════════════════════════
     6. CONTADOR DE CARACTERES EN TEXTAREA
  ═══════════════════════════════════════════ */
  $('#mensaje').on('input', function () {
    const len = $(this).val().length;
    const max = 500;
    $('#contadorMensaje').text(len + ' / ' + max + ' caracteres');
    if (len > max) {
      $(this).val($(this).val().substring(0, max));
      $('#contadorMensaje').css('color', 'var(--accent-red)');
    } else {
      $('#contadorMensaje').css('color', 'var(--text-muted)');
    }
  });

  /* ═══════════════════════════════════════════
     7. VALIDACIÓN DEL FORMULARIO (JavaScript puro)
  ═══════════════════════════════════════════ */

  // Función de validación de email con regex
  function esEmailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Función de validación de teléfono (opcional, si ingresa algo)
  function esTelefonoValido(tel) {
    return /^[\d\s\+\-\(\)]{7,15}$/.test(tel);
  }

  // Muestra error en un campo
  function mostrarError(campoId, errorId, mensaje) {
    $('#' + campoId).addClass('campo-error').removeClass('campo-ok');
    $('#' + errorId).text(mensaje).slideDown(200);
  }

  // Limpia error de un campo
  function limpiarError(campoId, errorId) {
    $('#' + campoId).removeClass('campo-error').addClass('campo-ok');
    $('#' + errorId).text('').slideUp(150);
  }

  // Validación en tiempo real al salir del campo
  $('#nombre').on('blur', function () {
    const val = $(this).val().trim();
    if (val.length < 2) {
      mostrarError('nombre', 'errorNombre', 'El nombre debe tener al menos 2 caracteres.');
    } else {
      limpiarError('nombre', 'errorNombre');
    }
  });

  $('#email').on('blur', function () {
    const val = $(this).val().trim();
    if (!val) {
      mostrarError('email', 'errorEmail', 'El correo es obligatorio.');
    } else if (!esEmailValido(val)) {
      mostrarError('email', 'errorEmail', 'Ingresa un correo electrónico válido.');
    } else {
      limpiarError('email', 'errorEmail');
    }
  });

  $('#asunto').on('blur', function () {
    const val = $(this).val().trim();
    if (val.length < 3) {
      mostrarError('asunto', 'errorAsunto', 'El asunto debe tener al menos 3 caracteres.');
    } else {
      limpiarError('asunto', 'errorAsunto');
    }
  });

  $('#telefono').on('blur', function () {
    const val = $(this).val().trim();
    if (val && !esTelefonoValido(val)) {
      mostrarError('telefono', 'errorTelefono', 'Ingresa un número de teléfono válido.');
    } else {
      limpiarError('telefono', 'errorTelefono');
    }
  });

  $('#tipo').on('change', function () {
    if (!$(this).val()) {
      mostrarError('tipo', 'errorTipo', 'Selecciona el tipo de consulta.');
    } else {
      limpiarError('tipo', 'errorTipo');
    }
  });

  $('#mensaje').on('blur', function () {
    const val = $(this).val().trim();
    if (val.length < 10) {
      mostrarError('mensaje', 'errorMensaje', 'El mensaje debe tener al menos 10 caracteres.');
    } else {
      limpiarError('mensaje', 'errorMensaje');
    }
  });

  // ── ENVÍO DEL FORMULARIO ──
  $('#formContacto').on('submit', function (e) {
    e.preventDefault();
    let esValido = true;

    // Validar todos los campos al enviar
    const nombre = $('#nombre').val().trim();
    const email  = $('#email').val().trim();
    const asunto = $('#asunto').val().trim();
    const tel    = $('#telefono').val().trim();
    const tipo   = $('#tipo').val();
    const msg    = $('#mensaje').val().trim();
    const terms  = $('#terminos').is(':checked');

    if (nombre.length < 2) {
      mostrarError('nombre', 'errorNombre', 'El nombre debe tener al menos 2 caracteres.');
      esValido = false;
    } else {
      limpiarError('nombre', 'errorNombre');
    }

    if (!email) {
      mostrarError('email', 'errorEmail', 'El correo es obligatorio.');
      esValido = false;
    } else if (!esEmailValido(email)) {
      mostrarError('email', 'errorEmail', 'Ingresa un correo electrónico válido.');
      esValido = false;
    } else {
      limpiarError('email', 'errorEmail');
    }

    if (asunto.length < 3) {
      mostrarError('asunto', 'errorAsunto', 'El asunto debe tener al menos 3 caracteres.');
      esValido = false;
    } else {
      limpiarError('asunto', 'errorAsunto');
    }

    if (tel && !esTelefonoValido(tel)) {
      mostrarError('telefono', 'errorTelefono', 'Ingresa un número válido o deja vacío.');
      esValido = false;
    } else {
      limpiarError('telefono', 'errorTelefono');
    }

    if (!tipo) {
      mostrarError('tipo', 'errorTipo', 'Selecciona el tipo de consulta.');
      esValido = false;
    } else {
      limpiarError('tipo', 'errorTipo');
    }

    if (msg.length < 10) {
      mostrarError('mensaje', 'errorMensaje', 'El mensaje debe tener al menos 10 caracteres.');
      esValido = false;
    } else {
      limpiarError('mensaje', 'errorMensaje');
    }

    if (!terms) {
      $('#errorTerminos').text('Debes aceptar los términos para continuar.').slideDown(200);
      esValido = false;
    } else {
      $('#errorTerminos').text('').slideUp(150);
    }

    // Si todo es válido, simular envío
    if (esValido) {
      $('#textoBtn').hide();
      $('#loadingBtn').show();
      $('#btnEnviar').prop('disabled', true);

      // Simular petición asíncrona (1.5s)
      setTimeout(function () {
        $('#formContacto')[0].reset();
        $('#contadorMensaje').text('0 / 500 caracteres');
        $('.campo-ok').removeClass('campo-ok');
        $('#loadingBtn').hide();
        $('#textoBtn').show();
        $('#btnEnviar').prop('disabled', false);
        $('#alertaExito').slideDown(400).delay(5000).slideUp(400);
      }, 1500);
    } else {
      // Sacudir el botón si hay errores (efecto shake jQuery)
      $('#btnEnviar').addClass('btn-shake');
      setTimeout(() => $('#btnEnviar').removeClass('btn-shake'), 500);
      // Hacer scroll al primer error
      const $primerError = $('.campo-error').first();
      if ($primerError.length) {
        $('html, body').animate({ scrollTop: $primerError.offset().top - 120 }, 400);
      }
    }
  });

}); // fin document.ready

