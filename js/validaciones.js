/* =============================================================
   Validaciones de formularios — Ferretería Los Maestros
   Incluye validación en tiempo real (input/blur) con mensajes
   de error y sugerencias dinámicas, según lo pedido en la pauta.
   ============================================================= */

const regionesComunas = {
  "Región de Coquimbo": ["La Serena", "Coquimbo", "Ovalle", "Vicuña"],
  "Región de Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué"],
  "Región Metropolitana": ["Santiago", "Maipú", "Huechuraba", "Puente Alto"]
};

const CORREOS_PERMITIDOS = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

/* ---------- Utilidades genéricas de validación visual ---------- */

function marcarCampo(input, mensaje) {
  const contenedor = input.closest(".form-field") || input.parentElement;
  const spanError = contenedor ? contenedor.querySelector(".mensaje-error") : null;

  if (mensaje) {
    input.classList.add("invalido");
    input.classList.remove("valido");
    if (spanError) spanError.textContent = mensaje;
  } else {
    input.classList.remove("invalido");
    input.classList.add("valido");
    if (spanError) spanError.textContent = "";
  }
  return !mensaje;
}

function mostrarAlertaFormulario(form, tipo, texto) {
  const alerta = form.querySelector(".form-alert");
  if (!alerta) return;
  alerta.textContent = texto;
  alerta.classList.remove("exito", "fracaso");
  alerta.classList.add(tipo);
}

/* ---------- Validadores individuales (reutilizables) ---------- */

function validarRequerido(input, etiqueta = "Este campo") {
  const valor = input.value.trim();
  if (!valor) return marcarCampo(input, `${etiqueta} es obligatorio.`);
  return marcarCampo(input, "");
}

function validarMax(input, max, etiqueta = "Este campo") {
  const valor = input.value.trim();
  if (valor.length > max) return marcarCampo(input, `${etiqueta} no puede superar ${max} caracteres.`);
  return marcarCampo(input, "");
}

/** Combina "requerido" + "largo máximo" en una sola validación/mensaje. */
function validarRequeridoYMax(input, max, etiqueta = "Este campo") {
  const valor = input.value.trim();
  if (!valor) return marcarCampo(input, `${etiqueta} es obligatorio.`);
  if (valor.length > max) return marcarCampo(input, `${etiqueta} no puede superar ${max} caracteres.`);
  return marcarCampo(input, "");
}

function validarCorreo(input, requerido = true) {
  const valor = input.value.trim();
  if (!valor) {
    if (requerido) return marcarCampo(input, "El correo es obligatorio.");
    return marcarCampo(input, "");
  }
  if (valor.length > 100) return marcarCampo(input, "El correo no puede superar 100 caracteres.");
  if (!CORREOS_PERMITIDOS.test(valor)) {
    return marcarCampo(input, "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.");
  }
  return marcarCampo(input, "");
}

function validarPassword(input) {
  const valor = input.value;
  if (!valor) return marcarCampo(input, "La contraseña es obligatoria.");
  if (valor.length < 4 || valor.length > 10) {
    return marcarCampo(input, "Debe tener entre 4 y 10 caracteres.");
  }
  return marcarCampo(input, "");
}

function validarConfirmPassword(inputPass, inputConfirm) {
  if (!inputConfirm.value) return marcarCampo(inputConfirm, "Confirma tu contraseña.");
  if (inputConfirm.value !== inputPass.value) {
    return marcarCampo(inputConfirm, "Las contraseñas no coinciden.");
  }
  return marcarCampo(inputConfirm, "");
}

function validarRut(rut) {
  if (!/^[0-9]+[0-9kK]{1}$/.test(rut)) return false;
  if (rut.length < 7 || rut.length > 9) return false;
  const dv = rut.slice(-1).toUpperCase();
  let cuerpo = rut.slice(0, -1);
  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += multiplo * parseInt(cuerpo.charAt(i));
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }
  const dvEsperado = 11 - (suma % 11);
  let dvCalc = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
  return dv === dvCalc;
}

function validarRutInput(input) {
  const valor = input.value.trim();
  if (!valor) return marcarCampo(input, "El RUN es obligatorio.");
  if (valor.length < 7 || valor.length > 9) return marcarCampo(input, "El RUN debe tener entre 7 y 9 caracteres.");
  if (!validarRut(valor)) return marcarCampo(input, "RUN inválido. Ej: 19011022K (sin puntos ni guion).");
  return marcarCampo(input, "");
}

/* ---------- Región / comuna dinámicas ---------- */

function inicializarRegionComuna() {
  const selectReg = document.getElementById("region");
  const selectCom = document.getElementById("comuna");
  if (!selectReg || !selectCom) return;

  Object.keys(regionesComunas).forEach(reg => {
    const opt = document.createElement("option");
    opt.value = reg;
    opt.textContent = reg;
    selectReg.appendChild(opt);
  });

  selectReg.addEventListener("change", (e) => {
    selectCom.innerHTML = "<option value=''>-- Seleccione la comuna --</option>";
    if (e.target.value) {
      regionesComunas[e.target.value].forEach(com => {
        const opt = document.createElement("option");
        opt.value = com;
        opt.textContent = com;
        selectCom.appendChild(opt);
      });
    }
    marcarCampo(selectReg, "");
  });
}

/* ---------- Formulario: Iniciar sesión ---------- */

function inicializarFormLogin() {
  const form = document.getElementById("form-login");
  if (!form) return;

  const email = document.getElementById("email");
  const password = document.getElementById("password");

  email.addEventListener("input", () => validarCorreo(email));
  password.addEventListener("input", () => validarPassword(password));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const okEmail = validarCorreo(email);
    const okPass = validarPassword(password);

    if (okEmail && okPass) {
      mostrarAlertaFormulario(form, "exito", "Inicio de sesión exitoso. Redirigiendo...");
    } else {
      mostrarAlertaFormulario(form, "fracaso", "Revisa los campos marcados en rojo.");
    }
  });
}

/* ---------- Formulario: Registro de usuario ---------- */

function inicializarFormRegistro() {
  const form = document.getElementById("form-registro");
  if (!form) return;

  const run = document.getElementById("run");
  const nombre = document.getElementById("nombre");
  const apellidos = document.getElementById("apellidos");
  const correo = document.getElementById("correo");
  const password = document.getElementById("password");
  const confirmar = document.getElementById("confirmar-password");
  const region = document.getElementById("region");
  const comuna = document.getElementById("comuna");
  const direccion = document.getElementById("direccion");

  run.addEventListener("input", () => validarRutInput(run));
  nombre.addEventListener("input", () => validarRequeridoYMax(nombre, 50, "El nombre"));
  apellidos.addEventListener("input", () => validarRequeridoYMax(apellidos, 100, "Los apellidos"));
  correo.addEventListener("input", () => validarCorreo(correo));
  if (password) password.addEventListener("input", () => validarPassword(password));
  if (confirmar) confirmar.addEventListener("input", () => validarConfirmPassword(password, confirmar));
  direccion.addEventListener("input", () => validarRequeridoYMax(direccion, 300, "La dirección"));
  region.addEventListener("change", () => validarRequerido(region, "La región"));
  comuna.addEventListener("change", () => validarRequerido(comuna, "La comuna"));

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const resultados = [
      validarRutInput(run),
      validarRequeridoYMax(nombre, 50, "El nombre"),
      validarRequeridoYMax(apellidos, 100, "Los apellidos"),
      validarCorreo(correo),
      password ? validarPassword(password) : true,
      confirmar ? validarConfirmPassword(password, confirmar) : true,
      validarRequerido(region, "La región"),
      validarRequerido(comuna, "La comuna"),
      validarRequeridoYMax(direccion, 300, "La dirección")
    ];

    if (resultados.every(Boolean)) {
      mostrarAlertaFormulario(form, "exito", "¡Registro exitoso! Ya puedes iniciar sesión.");
      form.reset();
      document.querySelectorAll("#form-registro .valido").forEach(el => el.classList.remove("valido"));
    } else {
      mostrarAlertaFormulario(form, "fracaso", "Revisa los campos marcados en rojo antes de continuar.");
    }
  });
}

/* ---------- Formulario: Contacto ---------- */

function inicializarFormContacto() {
  const form = document.getElementById("form-contacto");
  if (!form) return;

  const nombre = document.getElementById("nombre-contacto");
  const correo = document.getElementById("correo-contacto");
  const mensaje = document.getElementById("mensaje-contacto");

  nombre.addEventListener("input", () => validarRequeridoYMax(nombre, 100, "El nombre"));
  correo.addEventListener("input", () => validarCorreo(correo, false));
  mensaje.addEventListener("input", () => validarRequeridoYMax(mensaje, 500, "El mensaje"));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const resultados = [
      validarRequeridoYMax(nombre, 100, "El nombre"),
      validarCorreo(correo, false),
      validarRequeridoYMax(mensaje, 500, "El mensaje")
    ];

    if (resultados.every(Boolean)) {
      mostrarAlertaFormulario(form, "exito", "¡Gracias! Tu mensaje fue enviado correctamente.");
      form.reset();
      document.querySelectorAll("#form-contacto .valido").forEach(el => el.classList.remove("valido"));
    } else {
      mostrarAlertaFormulario(form, "fracaso", "Revisa los campos marcados en rojo.");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  inicializarRegionComuna();
  inicializarFormLogin();
  inicializarFormRegistro();
  inicializarFormContacto();
});
const regionesComunas = {
  "Coquimbo": ["La Serena", "Coquimbo", "Ovalle"],
  "Valparaíso": ["Valparaíso", "Viña del Mar"],
  "Metropolitana": ["Santiago", "Maipú", "Huechuraba"]
};

document.addEventListener("DOMContentLoaded", () => {
  const selectReg = document.getElementById("region");
  if (selectReg) {
    Object.keys(regionesComunas).forEach(reg => {
      const opt = document.createElement("option");
      opt.value = reg;
      opt.textContent = reg;
      selectReg.appendChild(opt);
    });

    selectReg.addEventListener("change", (e) => {
      const selectCom = document.getElementById("comuna");
      selectCom.innerHTML = "<option value=''>Seleccione Comuna</option>";
      if (e.target.value) {
        regionesComunas[e.target.value].forEach(com => {
          const opt = document.createElement("option");
          opt.value = com;
          opt.textContent = com;
          selectCom.appendChild(opt);
        });
      }
    });
  }

  const formLogin = document.getElementById("form-login");
  if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const pass = document.getElementById("password").value;

      if (!email.includes("@") || email.length > 100) return alert("Correo inválido.");
      if (pass.length < 4 || pass.length > 10) return alert("La contraseña debe tener entre 4 y 10 caracteres.");

      alert("Inicio de sesión exitoso.");
    });
  }

  const formReg = document.getElementById("form-registro");
  if (formReg) {
    formReg.addEventListener("submit", (e) => {
      e.preventDefault();
      const run = document.getElementById("run").value;
      if (!validarRut(run)) return alert("RUN inválido (ej: 12345678K, sin puntos ni guion).");
      alert("Registro exitoso.");
    });
  }
});

function validarRut(rut) {
  if (!/^[0-9]+[0-9kK]{1}$/.test(rut)) return false;
  const dv = rut.slice(-1).toUpperCase();
  let cuerpo = rut.slice(0, -1);
  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += multiplo * parseInt(cuerpo.charAt(i));
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }
  const dvEsperado = 11 - (suma % 11);
  let dvCalc = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
  return dv === dvCalc;
}
