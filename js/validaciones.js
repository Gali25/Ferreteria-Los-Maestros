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