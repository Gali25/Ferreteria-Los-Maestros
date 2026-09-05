document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("detalle-producto");
  if (!contenedor) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const productos = JSON.parse(localStorage.getItem("productos")) || [];
  const producto = productos.find(p => p.id === id);

  if (!producto) {
    contenedor.innerHTML = `
      <div class="carrito-vacio">
        <p>No encontramos ese producto.</p>
        <a href="catalogo.html" class="btn" style="display:inline-block;margin-top:12px;">Volver al catálogo</a>
      </div>`;
    document.getElementById("relacionados-wrapper").style.display = "none";
    return;
  }

  document.title = `Ferretería Los Maestros - ${producto.nombre}`;

  const alertaStock = (producto.stockCritico !== undefined && producto.stock <= producto.stockCritico)
    ? `<p class="stock-info stock-critico">⚠ Stock bajo: quedan ${producto.stock} unidades</p>`
    : `<p class="stock-info">Stock disponible: ${producto.stock} unidades</p>`;

  contenedor.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:start;">
      <div class="hero-image" style="background:#fff;border:1px solid var(--color-border);">
        <img src="${producto.imagen}" alt="${producto.nombre}" style="max-height:320px;">
      </div>
      <div>
        <span class="categoria-tag">${producto.subcategoria || producto.categoria}</span>
        <h1 class="page-title" style="margin-top:10px;">${producto.nombre}</h1>
        <p class="precio" style="font-size:1.6rem;">$${Number(producto.precio).toLocaleString("es-CL")}</p>
        ${alertaStock}
        <p style="margin:16px 0;color:var(--color-text-muted);">${producto.descripcion || "Producto disponible en nuestra ferretería. Consulta por retiro o despacho."}</p>

        <div class="form-field" style="max-width:160px;">
          <label for="cantidad-detalle">Cantidad</label>
          <input type="number" id="cantidad-detalle" value="1" min="1" max="${Math.max(producto.stock, 1)}">
        </div>

        <button type="button" id="btn-agregar-detalle" style="margin-top:10px;">Añadir a la cotización</button>
      </div>
    </div>
  `;

  document.getElementById("btn-agregar-detalle").addEventListener("click", () => {
    const cantidadInput = document.getElementById("cantidad-detalle");
    let cantidad = parseInt(cantidadInput.value, 10);
    if (isNaN(cantidad) || cantidad < 1) cantidad = 1;

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const existente = carrito.find(item => item.id === producto.id);

    if (existente) {
      existente.cantidad += cantidad;
    } else {
      carrito.push({ ...producto, cantidad });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    if (typeof actualizarContadorCarrito === "function") actualizarContadorCarrito();
    alert(`${producto.nombre} (x${cantidad}) fue añadido a la cotización.`);
  });

  // Productos relacionados: misma subcategoría, excluyendo el actual.
  const relacionadosContenedor = document.getElementById("contenedor-relacionados");
  const relacionados = productos.filter(p =>
    p.id !== producto.id && (p.subcategoria === producto.subcategoria || p.categoria === producto.categoria)
  );

  if (relacionados.length === 0) {
    document.getElementById("relacionados-wrapper").style.display = "none";
  } else {
    relacionadosContenedor.innerHTML = relacionados.map(p => `
      <div class="card-producto">
        <a href="detalle-producto.html?id=${encodeURIComponent(p.id)}" style="text-decoration:none;color:inherit;">
          <img src="${p.imagen}" alt="${p.nombre}">
          <span class="categoria-tag">${p.subcategoria || p.categoria}</span>
          <h3>${p.nombre}</h3>
          <p class="precio">$${Number(p.precio).toLocaleString("es-CL")}</p>
        </a>
      </div>
    `).join("");
  }
});
