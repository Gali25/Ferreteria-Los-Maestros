const productosIniciales = [
  { id: "MC001", nombre: "Cemento Polpaico gris 25 kg", categoria: "Mat. Construcción", subcategoria: "Cementos", precio: 5990, stock: 80, imagen: "images/productos/cemento-polpaico.avif" },
  { id: "MC002", nombre: "Cemento Melón blanco 25 kg", categoria: "Mat. Construcción", subcategoria: "Cementos", precio: 7490, stock: 40, imagen: "images/productos/cemento-melon.webp" },
  { id: "MC003", nombre: "Mortero cola cerámica 25 kg", categoria: "Mat. Construcción", subcategoria: "Morteros", precio: 5200, stock: 50, imagen: "images/productos/mortero-cola.webp" },
  { id: "MC004", nombre: "Mortero nivelador piso 25 kg", categoria: "Mat. Construcción", subcategoria: "Morteros", precio: 6490, stock: 30, imagen: "images/productos/mortero-nivelador.webp" },
  { id: "MC005", nombre: "Arena fina construcción 25 kg", categoria: "Mat. Construcción", subcategoria: "Áridos", precio: 1800, stock: 60, imagen: "images/productos/arena-fina.jpg" },
  { id: "MC006", nombre: "Ripio 25 kg", categoria: "Mat. Construcción", subcategoria: "Áridos", precio: 1500, stock: 60, imagen: "images/productos/ripio.jpg" }
];

localStorage.setItem("productos", JSON.stringify(productosIniciales));