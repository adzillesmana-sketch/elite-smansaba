const roster = [
  { role: "WAKIL KETUA", people: [{ name: "Farhansyah", className: "XI-C1" }, { name: "M. Fharel Hafizh", className: "XI-C1" }] },
  { role: "SEKRETARIS", people: [{ name: "Kaeyla Putri Alifah", className: "XI-A1", position: "SEKRETARIS 1", photo: "assets/foto_kaeyla_putri_alifah.png" }, { name: "Dwi Ramadan", className: "XI-E3" }] },
  { role: "BENDAHARA", people: [{ name: "Dwi Chantica Ramadani", className: "XI-A2", position: "BENDAHARA 1", photo: "assets/foto_dwi_chantica.png" }, { name: "Fajri Zulk(a)rnaen", className: "XI-C1" }] },
  { role: "KOORDINATOR CABOR", people: [{ name: "Avara Althafunnisa", className: "XI-A1", photo: "assets/foto_avara_althafunnisa.png" }, { name: "Wizna Sukmana", className: "XI-E4" }, { name: "Dea Herlina", className: "XI-E3" }, { name: "Putri Komala Sari", className: "XI-D1", position: "KOORDINATOR SILAT PUTRI", photo: "assets/foto_putri_komala_sari.png" }, { name: "Reyhan Dayana", className: "XI-C2" }] },
  { role: "SEKSI HUMAS", people: [{ name: "Rafa Ramadhan", className: "XI-B1" }, { name: "Reisya First Dilia", className: "XI-B2" }] },
  { role: "SEKSI PDD", people: [{ name: "Nazril Zaenal A'rofi", className: "XI-A1" }, { name: "Chika Aulia", className: "XI-E2" }, { name: "Aldi Ermawan", className: "XI-B1" }, { name: "Nikeisha Khansa Fathiya", className: "XI-B2" }] },
  { role: "SEKSI SARPRAS", people: [{ name: "Gema Ari Maulana", className: "XI-B2" }, { name: "Aditya Dwi Anggara", className: "XI-C1" }, { name: "Yozitozu", className: "XI-A2" }] }
];

const rosterFlat = [
  { id: "insan", name: "Insan Fadilah", role: "Ketua Umum", className: "XI-A1", photo: true },
  ...roster.flatMap((group) => group.people.map((person, index) => ({
    ...person, id: `${group.role.toLowerCase().replaceAll(" ", "-")}-${index}`, role: person.position || group.role
  })))
];
const storageKeys = { classes: "elite-classes-v1", announcements: "elite-announcements-v1" };
const readStored = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};
let classOverrides = readStored(storageKeys.classes, {});
let announcements = readStored(storageKeys.announcements, []);

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[char]);
const initials = (name) => name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
const currentClass = (person) => classOverrides[person.id] || person.className;
const renderRoster = () => {
  const container = document.querySelector("#roster");
  container.innerHTML = roster.map((group) => `
    <section class="roster-group">
      <h3>${escapeHtml(group.role)}</h3>
      ${group.people.map((person, index) => {
        const id = `${group.role.toLowerCase().replaceAll(" ", "-")}-${index}`;
        const avatar = person.photo
          ? `<img class="person-photo" src="${escapeHtml(person.photo)}" alt="Foto ${escapeHtml(person.name)}">`
          : `<span class="person-placeholder" aria-hidden="true">${escapeHtml(initials(person.name))}</span>`;
        return `<button class="person-card" type="button" data-person-id="${id}" aria-label="Lihat profil ${escapeHtml(person.name)}">
          ${avatar}
          <span class="person-info"><span class="person-role">${escapeHtml(person.position || group.role)}</span><strong>${escapeHtml(person.name)}</strong><small>${escapeHtml(currentClass({ ...person, id }))}</small></span><span class="person-arrow" aria-hidden="true">↗</span>
        </button>`;
      }).join("")}
    </section>`).join("");
};
const renderMemberOptions = () => {
  const select = document.querySelector("#member-select");
  select.innerHTML = rosterFlat.map((person) => `<option value="${escapeHtml(person.id)}">${escapeHtml(person.name)} — ${escapeHtml(person.role)}</option>`).join("");
  select.dispatchEvent(new Event("change"));
};
const showToast = (message) => {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
};
const profileDialog = document.querySelector("#profile-dialog");
document.addEventListener("click", (event) => {
  const card = event.target.closest("[data-person-id]");
  if (!card) return;
  const person = rosterFlat.find((entry) => entry.id === card.dataset.personId);
  if (!person) return;
  const photo = person.photo
    ? `<img class="person-photo" src="${escapeHtml(person.photo)}" alt="Foto ${escapeHtml(person.name)}">`
    : `<span class="person-placeholder" aria-hidden="true">${escapeHtml(initials(person.name))}</span>`;
  document.querySelector("#profile-content").innerHTML = `${photo}<p class="eyebrow">${escapeHtml(person.role)}</p><h2>${escapeHtml(person.name)}</h2><p>Kelas ${escapeHtml(currentClass(person))}. Tahun kepengurusan ELITE 2026/2027.</p>${person.photo ? `<p>Foto ini digunakan khusus untuk ${escapeHtml(person.role)}.</p>` : ""}`;
  profileDialog.showModal();
});
document.querySelectorAll(".dialog-close").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
document.querySelectorAll("dialog").forEach((dialog) => dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
}));

const memberSelect = document.querySelector("#member-select");
memberSelect.addEventListener("change", () => {
  const person = rosterFlat.find((entry) => entry.id === memberSelect.value);
  document.querySelector("#member-class").value = person ? currentClass(person) : "";
});
document.querySelector("#member-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const person = rosterFlat.find((entry) => entry.id === memberSelect.value);
  if (!person) return;
  classOverrides[person.id] = document.querySelector("#member-class").value.trim();
  localStorage.setItem(storageKeys.classes, JSON.stringify(classOverrides));
  renderRoster();
  showToast("Kelas pengurus diperbarui di browser ini.");
});
const renderAnnouncements = () => {
  const container = document.querySelector("#announcements");
  if (!announcements.length) {
    container.innerHTML = "<h3>Belum ada pengumuman.</h3><p>Informasi resmi organisasi akan muncul di sini.</p>";
    return;
  }
  container.innerHTML = announcements.slice().reverse().map((entry) => `<article class="announcement-entry"><h3>${escapeHtml(entry.title)}</h3><p>${escapeHtml(entry.text)}</p><small>${escapeHtml(entry.date)}</small></article>`).join("");
};
document.querySelector("#announcement-form").addEventListener("submit", (event) => {
  event.preventDefault();
  announcements.push({
    title: document.querySelector("#announcement-title").value.trim(),
    text: document.querySelector("#announcement-text").value.trim(),
    date: new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date())
  });
  localStorage.setItem(storageKeys.announcements, JSON.stringify(announcements));
  renderAnnouncements();
  event.currentTarget.reset();
  showToast("Pengumuman tersimpan di browser ini.");
});
document.querySelector("#reset-local").addEventListener("click", () => {
  localStorage.removeItem(storageKeys.classes);
  localStorage.removeItem(storageKeys.announcements);
  classOverrides = {};
  announcements = [];
  renderRoster();
  renderMemberOptions();
  renderAnnouncements();
  document.querySelector("#admin-status").textContent = "Perubahan lokal telah dihapus.";
});
document.querySelector("#member-form").addEventListener("submit", () => {
  document.querySelector("#admin-status").textContent = "Kelas tersimpan di browser ini.";
});
document.querySelector("#announcement-form").addEventListener("submit", () => {
  document.querySelector("#admin-status").textContent = "Pengumuman tersimpan di browser ini.";
});

const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");
menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  menuToggle.setAttribute("aria-label", expanded ? "Buka navigasi" : "Tutup navigasi");
  primaryNav.classList.toggle("is-open", !expanded);
});
primaryNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    primaryNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Buka navigasi");
  }
});

const presentationSection = document.querySelector("#commitment");
const presentationToggle = document.querySelector("#presentation-toggle");
const syncPresentationButton = () => {
  const isPresenting = presentationSection.classList.contains("is-presenting");
  presentationToggle.setAttribute("aria-pressed", String(isPresenting));
  presentationToggle.innerHTML = isPresenting
    ? '<span aria-hidden="true">×</span> Keluar dari layar penuh'
    : '<span aria-hidden="true">⛶</span> Tampilkan di layar';
};
presentationToggle.addEventListener("click", () => {
  const isPresenting = presentationSection.classList.toggle("is-presenting");
  document.body.classList.toggle("presentation-active", isPresenting);
  syncPresentationButton();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && presentationSection.classList.contains("is-presenting")) {
    presentationSection.classList.remove("is-presenting");
    document.body.classList.remove("presentation-active");
    syncPresentationButton();
  }
});

document.querySelectorAll(".filter-button").forEach((button) => button.addEventListener("click", () => {
  document.querySelectorAll(".filter-button").forEach((item) => item.classList.toggle("is-active", item === button));
  const filter = button.dataset.filter;
  document.querySelectorAll(".gallery-tile").forEach((tile) => {
    tile.hidden = filter !== "all" && tile.dataset.category !== filter;
  });
}));
const galleryDialog = document.querySelector("#gallery-dialog");
document.querySelector("#gallery-grid").addEventListener("click", (event) => {
  const tile = event.target.closest(".gallery-tile");
  if (!tile) return;
  const art = tile.querySelector(".gallery-art").cloneNode(true);
  document.querySelector("#gallery-dialog-content").replaceChildren(
    art,
    Object.assign(document.createElement("h3"), { textContent: tile.dataset.galleryTitle }),
    Object.assign(document.createElement("p"), { textContent: "Belum ada foto kegiatan resmi di kategori ini. Tambahkan dokumentasi yang telah mendapat izin melalui folder aset project." })
  );
  galleryDialog.showModal();
});

renderRoster();
renderMemberOptions();
renderAnnouncements();
