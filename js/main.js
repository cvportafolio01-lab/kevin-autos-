let autosData = [];

document.addEventListener("DOMContentLoaded", () => {

  const contenedor = document.getElementById("galeriaAutos");

  if (!contenedor) {
    console.error("No existe #galeriaAutos");
    return;
  }

  // =========================
  // CARGAR JSON
  // =========================
  fetch("../data/cars.json")
    .then(res => res.json())
    .then(data => {
      autosData = data;
      renderAutos(autosData, contenedor);
    });

  // =========================
  // FILTROS
  // =========================
  document.addEventListener("click", (e) => {

    const btn = e.target.closest("[data-filter]");
    if (!btn) return;

    const filtro = btn.dataset.filter;

    document.querySelectorAll("[data-filter]")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");

    if (filtro === "todos") {
      renderAutos(autosData, contenedor);
    } else {
      renderAutos(
        autosData.filter(a => a.categoria === filtro),
        contenedor
      );
    }
  });

});


// =========================
// RENDER
// =========================
function renderAutos(lista, contenedor) {

  const estilos = {
    sedan: "primary",
    suv: "success",
    deportivo: "danger",
    camioneta: "warning"
  };

  const html = lista.map(auto => {

    const color = estilos[auto.categoria] || "primary";
    const carouselId = `carouselAuto${auto.id}`;

    const imagenes = auto.detalle?.galeria?.length
      ? auto.detalle.galeria.slice(0, 3)
      : [auto.card.imagen];

    return `
      <div class="col-lg-4 col-md-6 auto-card" data-categoria="${auto.categoria}">

        <div class="card auto-tarjeta shadow-lg h-100">

          <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">

            <div class="carousel-inner">

              ${imagenes.map((img, i) => `
                <div class="carousel-item ${i === 0 ? "active" : ""}">
                  <img src="../${img}" class="d-block w-100">
                </div>
              `).join("")}

            </div>

            <button class="carousel-control-prev" type="button"
              data-bs-target="#${carouselId}" data-bs-slide="prev">
              <span class="carousel-control-prev-icon"></span>
            </button>

            <button class="carousel-control-next" type="button"
              data-bs-target="#${carouselId}" data-bs-slide="next">
              <span class="carousel-control-next-icon"></span>
            </button>

          </div>

          <div class="card-body">

            <span class="badge bg-${color} mb-2">
              ${auto.categoria.toUpperCase()}
            </span>

            <h3>${auto.card.titulo}</h3>

            <p>${auto.card.descripcion || ""}</p>

            <h4>${auto.card.precio}</h4>

          </div>

          <div class="card-footer bg-transparent border-0 p-3">

            <a href="auto7.html?id=${auto.id}"
              class="btn btn-${color} w-100">
              Ver Detalles
            </a>

          </div>

        </div>

      </div>
    `;
  }).join("");

  contenedor.innerHTML = html;

  // reiniciar carrusel
  document.querySelectorAll(".carousel").forEach(c => {
    new bootstrap.Carousel(c);
  });
}