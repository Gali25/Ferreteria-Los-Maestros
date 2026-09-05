function obtenerProductosAdmin() {
  return JSON.parse(localStorage.getItem("productos")) || [];
}

function guardarProductosAdmin(productos) {
  localStorage.setItem("productos", JSON.stringify(productos));
}

function generarCodigoProducto(productos) {
  const numero = productos.length + 1;
  return "PROD" + String(numero).padStart(3, "0");
}

function renderizarTablaAdmin() {
  const tbody = document.getElementById("tbody-productos");
  if (!tbody) return;

  const productos = obtenerProductosAdmin();
  tbody.innerHTML = "";

  productos.forEach(p => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td><img src="${p.imagen}" alt="${p.nombre}" style="width:60px;height:60px;object-fit:contain;"></td>
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>${p.categoria}</td>
      <td>$${Number(p.precio).toLocaleString("es-CL")}</td>
      <td>${p.stock}</td>
      <td><button type="button" onclick="eliminarProductoAdmin('${p.id}')">Eliminar</button></td>
    `;
    tbody.appendChild(fila);
  });
}

function eliminarProductoAdmin(id) {
  let productos = obtenerProductosAdmin();
  productos = productos.filter(p => p.id !== id);
  guardarProductosAdmin(productos);
  renderizarTablaAdmin();
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarTablaAdmin();

  const formProducto = document.getElementById("form-producto-admin");
  if (formProducto) {
    formProducto.addEventListener("submit", (e) => {
      e.preventDefault();

      const nombre = document.getElementById("nombre-prod").value.trim();
      const categoria = document.getElementById("cat-prod").value.trim();
      const precio = parseInt(document.getElementById("precio-prod").value, 10);
      const stock = parseInt(document.getElementById("stock-prod").value, 10);
      const imagenIngresada = document.getElementById("imagen-prod").value.trim();

      if (!nombre || !categoria || isNaN(precio) || precio < 0 || isNaN(stock) || stock < 0) {
        alert("Por favor completa todos los campos con valores válidos.");
        return;
      }

      const productos = obtenerProductosAdmin();
      const nuevoProducto = {
        id: generarCodigoProducto(productos),
        nombre,
        categoria,
        subcategoria: "",
        precio,
        stock,
        imagen: imagenIngresada || "https://via.placeholder.com/200?text=" + encodeURIComponent(nombre)
      };

      productos.push(nuevoProducto);
      guardarProductosAdmin(productos);
      renderizarTablaAdmin();
      formProducto.reset();
    });
  }
});
