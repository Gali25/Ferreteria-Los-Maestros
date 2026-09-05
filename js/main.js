document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("contenedor-productos")) {
    renderizarCatalogo();
  }
  if (document.getElementById("contenedor-carrito")) {
    renderizarCarrito();
  }
});

function obtenerProductos() {
  return JSON.parse(localStorage.getItem("productos")) || [];
}

function renderizarCatalogo() {
  const contenedor = document.getElementById("contenedor-productos");
  const productos = obtenerProductos();
  contenedor.innerHTML = "";

  productos.forEach(p => {
    const card = document.createElement("div");
    card.className = "card-producto";
    card.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p>Categoría: ${p.categoria}</p>
      <p><strong>$${p.precio.toLocaleString("es-CL")}</strong></p>
      <p>Stock: ${p.stock}</p>
      <button onclick="agregarAlCarrito('${p.id}')">Agregar a Cotización</button>
    `;
    contenedor.appendChild(card);
  });
}

function agregarAlCarrito(id) {
  const productos = obtenerProductos();
  const producto = productos.find(p => p.id === id);
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const existente = carrito.find(item => item.id === id);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  alert(`${producto.nombre} fue añadido a la cotización.`);
}

function renderizarCarrito() {
  const contenedor = document.getElementById("contenedor-carrito");
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  contenedor.innerHTML = "";

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>No hay elementos seleccionados.</p>";
    document.getElementById("total-carrito").textContent = "Total: $0";
    return;
  }

  let total = 0;
  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const div = document.createElement("div");
    div.className = "card-producto";
    div.style.marginBottom = "10px";
    div.innerHTML = `
      <h3>${item.nombre}</h3>
      <p>Precio: $${item.precio.toLocaleString("es-CL")} | Cantidad: ${item.cantidad}</p>
      <p>Subtotal: $${subtotal.toLocaleString("es-CL")}</p>
      <button onclick="eliminarDelCarrito('${item.id}')">Eliminar</button>
    `;
    contenedor.appendChild(div);
  });

  document.getElementById("total-carrito").textContent = `Total: $${total.toLocaleString("es-CL")}`;
}

function eliminarDelCarrito(id) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito = carrito.filter(item => item.id !== id);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderizarCarrito();
}