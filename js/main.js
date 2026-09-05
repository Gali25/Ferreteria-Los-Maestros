document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("contenedor-productos")) {
    renderizarCatalogo();
  }
  if (document.getElementById("contenedor-carrito")) {
    renderizarCarrito();
  }
  actualizarContadorCarrito();
});

function obtenerProductos() {
  return JSON.parse(localStorage.getItem("productos")) || [];
}

function renderizarCatalogo() {
  const contenedor = document.getElementById("contenedor-productos");
  const productos = obtenerProductos();
  contenedor.innerHTML = "";

  if (productos.length === 0) {
    contenedor.innerHTML = "<p>No hay productos disponibles por el momento.</p>";
    return;
  }

  productos.forEach(p => {
    const card = document.createElement("div");
    card.className = "card-producto";

    const alertaStock = (p.stockCritico !== undefined && p.stock <= p.stockCritico)
      ? `<p class="stock-info stock-critico">⚠ Stock bajo: quedan ${p.stock} unidades</p>`
      : `<p class="stock-info">Stock disponible: ${p.stock}</p>`;

    card.innerHTML = `
      <a href="detalle-producto.html?id=${encodeURIComponent(p.id)}" style="text-decoration:none;color:inherit;">
        <img src="${p.imagen}" alt="${p.nombre}" loading="lazy">
        <span class="categoria-tag">${p.subcategoria || p.categoria}</span>
        <h3>${p.nombre}</h3>
        <p class="precio">$${Number(p.precio).toLocaleString("es-CL")}</p>
        ${alertaStock}
      </a>
      <button type="button" onclick="agregarAlCarrito('${p.id}')">Agregar a cotización</button>
    `;
    contenedor.appendChild(card);
  });
}

function agregarAlCarrito(id) {
  const productos = obtenerProductos();
  const producto = productos.find(p => p.id === id);
  if (!producto) return;

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const existente = carrito.find(item => item.id === id);

  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
  renderizarCarrito();
  alert(`${producto.nombre} fue añadido a la cotización.`);
}

function cambiarCantidad(id, delta) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const item = carrito.find(i => i.id === id);
  if (!item) return;

  item.cantidad += delta;
  if (item.cantidad <= 0) {
    carrito = carrito.filter(i => i.id !== id);
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
  renderizarCarrito();
}

function eliminarDelCarrito(id) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito = carrito.filter(item => item.id !== id);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
  renderizarCarrito();
}

function renderizarCarrito() {
  const contenedor = document.getElementById("contenedor-carrito");
  if (!contenedor) return;

  const resumen = document.getElementById("resumen-total");
  const totalTexto = document.getElementById("total-carrito");
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  contenedor.innerHTML = "";

  if (carrito.length === 0) {
    contenedor.innerHTML = `
      <div class="carrito-vacio">
        <p>Tu cotización está vacía por ahora.</p>
        <a href="catalogo.html" class="btn" style="display:inline-block;margin-top:12px;">Ver catálogo</a>
      </div>`;
    if (resumen) resumen.style.display = "none";
    return;
  }

  let total = 0;
  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const div = document.createElement("div");
    div.className = "item-carrito";
    div.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}" style="width:64px;height:64px;object-fit:contain;background:#f7f8fa;border-radius:8px;">
      <div class="detalle-item" style="flex:1;">
        <h3>${item.nombre}</h3>
        <p>Precio unitario: $${Number(item.precio).toLocaleString("es-CL")}</p>
        <div style="display:flex;align-items:center;gap:8px;margin-top:6px;">
          <button type="button" onclick="cambiarCantidad('${item.id}', -1)" style="padding:4px 10px;">−</button>
          <span>${item.cantidad}</span>
          <button type="button" onclick="cambiarCantidad('${item.id}', 1)" style="padding:4px 10px;">+</button>
        </div>
      </div>
      <div style="text-align:right;">
        <p class="subtotal">$${subtotal.toLocaleString("es-CL")}</p>
        <button type="button" onclick="eliminarDelCarrito('${item.id}')" class="btn-outline" style="margin-top:8px;">Eliminar</button>
      </div>
    `;
    contenedor.appendChild(div);
  });

  if (resumen) resumen.style.display = "flex";
  if (totalTexto) totalTexto.textContent = `$${total.toLocaleString("es-CL")}`;
}

function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  document.querySelectorAll(".cart-count").forEach(el => {
    el.textContent = totalItems;
  });
}
