const params = new URLSearchParams(window.location.search);
const id = params.get("id");

console.log("URL:", window.location.href);
console.log("ID recibido:", id);

let autosData = [];

// =========================
// VALIDACIÓN DE ID
// =========================
if (!id) {
  document.body.innerHTML = `
    <div class="text-center mt-5">
      <h2>Falta ID del auto</h2>
      <p>Ejemplo: auto7.html?id=1</p>
    </div>
  `;
}

// =========================
// CARGAR JSON
// =========================
fetch("../data/cars.json")
  .then(res => {
    if (!res.ok) throw new Error("No se pudo cargar cars.json");
    return res.json();
  })
  .then(data => {
    autosData = data;

    // FIX FINAL ROBUSTO
    const auto = autosData.find(a => String(a.id) === String(id));

    if (!auto) {
      document.body.innerHTML = `
        <div class="text-center mt-5">
          <h2>Auto no encontrado</h2>
          <p>Revisa el ID en la URL: ?id=1</p>
        </div>
      `;
      return;
    }

    renderAuto(auto);
  })
  .catch(err => {
    console.error("Error cargando JSON:", err);
    document.body.innerHTML = `
      <div class="text-center mt-5">
        <h2>Error cargando datos</h2>
      </div>
    `;
  });


// =========================
// RENDER AUTO
// =========================
function renderAuto(auto) {

  document.getElementById("titulo").textContent = auto.card.titulo;
  document.getElementById("precio").textContent = auto.card.precio;
  document.getElementById("descripcion").textContent =
    auto.detalle?.descripcion || auto.card.descripcion;

  // WHATSAPP
  document.getElementById("whatsapp").href =
    `https://wa.me/525512345678?text=Interesado%20en%20${encodeURIComponent(auto.card.titulo)}`;

  // IMÁGENES SEGURAS
  const imgs =
    auto.detalle?.galeria?.length
      ? auto.detalle.galeria
      : [auto.card.imagen];

  // CARRUSEL
  document.getElementById("carouselInner").innerHTML = imgs
    .map((img, i) => `
      <div class="carousel-item ${i === 0 ? "active" : ""}">
        <img src="../${img}" class="d-block w-100">
      </div>
    `).join("");

  // GALERÍA
  document.getElementById("galeria").innerHTML = imgs
    .map(img => `
      <img src="../${img}" onclick="openImg(this)">
    `).join("");

  // SPECS
  const f = auto.detalle?.ficha || {};

  document.getElementById("specs").innerHTML = `
    <div class="col-6"><div class="spec-card">Motor<br>${f.Motor || "-"}</div></div>
    <div class="col-6"><div class="spec-card">Potencia<br>${f.Potencia || "-"}</div></div>
    <div class="col-6"><div class="spec-card">Transmisión<br>${f.Transmisión || "-"}</div></div>
    <div class="col-6"><div class="spec-card">Año<br>${f.Año || "-"}</div></div>
  `;

  // FICHA ORDENADA (TU DISEÑO ORIGINAL RESPETADO)
  document.getElementById("ficha").innerHTML = `
    <div class="ficha-item"><span>Marca</span><h5>${f.Marca || "-"}</h5></div>
    <div class="ficha-item"><span>Modelo</span><h5>${f.Modelo || "-"}</h5></div>
    <div class="ficha-item"><span>Año</span><h5>${f.Año || "-"}</h5></div>
    <div class="ficha-item"><span>Kilometraje</span><h5>${f.Kilometraje || "-"}</h5></div>
    <div class="ficha-item"><span>Motor</span><h5>${f.Motor || "-"}</h5></div>
    <div class="ficha-item"><span>Transmisión</span><h5>${f.Transmisión || "-"}</h5></div>
    <div class="ficha-item"><span>Combustible</span><h5>${f.Combustible || "-"}</h5></div>
    <div class="ficha-item"><span>Puertas</span><h5>${f.Puertas || "-"}</h5></div>
  `;
}


// =========================
// MODAL
// =========================
function openImg(img) {
  document.getElementById("modal").style.display = "flex";
  document.getElementById("img").src = img.src;
}

function closeImg() {
  document.getElementById("modal").style.display = "none";
}