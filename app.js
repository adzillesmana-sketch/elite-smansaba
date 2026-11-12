const roster = [
  { role: "WAKIL KETUA", people: [{ name: "Farhansyah", className: "XI-C1" }, { name: "M. Fharel Hafizh", className: "XI-C1" }] },
  { role: "SEKRETARIS", people: [{ name: "Kaeyla Putri Alifah", className: "XI-A1", position: "SEKRETARIS 1", photo: "assets/foto_kaeyla_putri_alifah.png" }, { name: "Dwi Ramadan", className: "XI-E3" }] },
  { role: "BENDAHARA", people: [{ name: "Dwi Chantica Ramadani", className: "XI-A2", position: "BENDAHARA 1", photo: "assets/foto_dwi_chantica.png" }, { name: "Fajri Zulkarnaen", className: "XI-C1", photo: "assets/foto_fajri_zulkarnaen.jpeg" }] },
  { role: "KOORDINATOR CABOR", people: [{ name: "Avara Althafunnisa", className: "XI-A1", photo: "assets/foto_avara_althafunnisa.png" }, { name: "Wizna Sukmana", className: "XI-E4" }, { name: "Dea Herlina", className: "XI-E3", photo: "assets/foto_dea_herlina.jpeg" }, { name: "Putri Komala Sari", className: "XI-D1", position: "KOORDINATOR SILAT PUTRI", photo: "assets/foto_putri_komala_sari.png" }, { name: "Reyhan Dayana", className: "XI-C2", photo: "assets/foto_reyhan_dayana.jpeg" }] },
  { role: "SEKSI HUMAS", people: [{ name: "Rafa Ramadhan", className: "XI-B1", photo: "assets/foto_rafa_ramadhan.jpeg" }, { name: "Reisya First Dilia", className: "XI-B2", photo: "assets/foto_reisya_first_dilia.jpeg" }] },
  { role: "SEKSI PDD", people: [{ name: "Nazril Zaenal A'rofi", className: "XI-A1" }, { name: "Chika Aulia", className: "XI-E2", photo: "assets/foto_chika_aulia.jpeg" }, { name: "Aldi Ermawan", className: "XI-B1", photo: "assets/foto_aldi_ermawan.jpeg" }, { name: "Nikeisha Khansa Fathiya", className: "XI-B2" }] },
  { role: "SEKSI SARPRAS", people: [{ name: "Gema Ari Maulana", className: "XI-B2" }, { name: "Aditya Dwi Anggara", className: "XI-C1" }, { name: "Yozitozu", className: "XI-A2" }] }
];

const rosterFlat = [
  { id: "insan", name: "Insan Fadilah", role: "Ketua Umum", className: "XI-A1", photo: "assets/foto_insan_fadilah.png" },
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

const defaultAnnouncements = [
  {
    id: "ann-1",
    category: "PENTING",
    author: "Seksi Humas",
    title: "Naskah Resmi AD / ART Bab I Diterbitkan",
    text: "Anggaran Dasar dan Anggaran Rumah Tangga (AD/ART) ELITE Bab I hasil musyawarah resmi telah dapat diakses langsung pada menu navigasi AD / ART website.",
    date: "12 Nov 2026"
  },
  {
    id: "ann-2",
    category: "JADWAL",
    author: "Koordinator Cabor",
    title: "Koordinasi Jadwal Latihan 5 Cabang Olahraga",
    text: "Jadwal latihan untuk cabang Basket, Futsal, Bola Voli, Atletik, dan Pencak Silat sedang difinalisasi bersama pelatih dan pembina SMAN 1 Babakan.",
    date: "11 Nov 2026"
  }
];

let classOverrides = readStored(storageKeys.classes, {});
let announcements = readStored(storageKeys.announcements, defaultAnnouncements);

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
const makeWhatsAppShareUrl = (entry) => {
  const shareText = `📢 *PENGUMUMAN RESMI ELITE SMAN 1 BABAKAN*\n\n📌 *${entry.title}*\n🏷️ Kategori: [${entry.category || 'INFO'}]\n👤 Oleh: ${entry.author || 'Pengurus ELITE'}\n📅 Tanggal: ${entry.date}\n\n${entry.text}\n\n🌐 Baca selengkapnya di website resmi ELITE:\nhttps://adzillesmana-sketch.github.io/elite-smansaba/#updates`;
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
};

const renderAdminAnnouncementsList = () => {
  const listContainer = document.querySelector("#admin-announcements-list");
  if (!listContainer) return;
  if (!announcements.length) {
    listContainer.innerHTML = "<p class='admin-empty-note'>Tidak ada pengumuman tersimpan saat ini.</p>";
    return;
  }
  listContainer.innerHTML = announcements.slice().reverse().map((entry) => `
    <div class="admin-ann-item">
      <div class="admin-ann-info">
        <span class="announcement-badge badge-${escapeHtml((entry.category || 'INFO').toLowerCase())}">${escapeHtml(entry.category || 'INFO')}</span>
        <strong>${escapeHtml(entry.title)}</strong>
        <small>${escapeHtml(entry.author || 'Pengurus')} · ${escapeHtml(entry.date)}</small>
      </div>
      <button class="button-delete-ann" type="button" data-delete-announcement="${escapeHtml(entry.id)}" aria-label="Hapus pengumuman ${escapeHtml(entry.title)}">Hapus ×</button>
    </div>
  `).join("");
};

const renderAnnouncements = () => {
  const container = document.querySelector("#announcements");
  if (!container) return;
  if (!announcements.length) {
    container.innerHTML = "<div class='announcement-empty'><h3>Belum ada pengumuman.</h3><p>Informasi resmi organisasi akan muncul di sini.</p></div>";
    renderAdminAnnouncementsList();
    return;
  }
  container.innerHTML = announcements.slice().reverse().map((entry) => {
    const categoryClass = (entry.category || "INFO").toLowerCase();
    const waUrl = makeWhatsAppShareUrl(entry);
    return `
      <article class="announcement-item" data-announcement-id="${escapeHtml(entry.id)}">
        <div class="announcement-meta-top">
          <span class="announcement-badge badge-${escapeHtml(categoryClass)}">${escapeHtml(entry.category || "INFO")}</span>
          <span class="announcement-date">${escapeHtml(entry.date)}</span>
        </div>
        <h4 class="announcement-title">${escapeHtml(entry.title)}</h4>
        <span class="announcement-author">Oleh: ${escapeHtml(entry.author || "Pengurus ELITE")}</span>
        <p class="announcement-excerpt">${escapeHtml(entry.text)}</p>
        <div class="announcement-actions">
          <button class="announcement-view-btn" type="button" data-view-announcement="${escapeHtml(entry.id)}">Baca penuh ↗</button>
          <a class="announcement-wa-btn" href="${escapeHtml(waUrl)}" target="_blank" rel="noopener" title="Bagikan pengumuman ke grup WhatsApp">
            <span>💬</span> Bagikan ke WA
          </a>
        </div>
      </article>`;
  }).join("");
  renderAdminAnnouncementsList();
};

document.querySelector("#announcement-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const title = document.querySelector("#announcement-title").value.trim();
  const text = document.querySelector("#announcement-text").value.trim();
  const categorySelect = document.querySelector("#announcement-category");
  const authorSelect = document.querySelector("#announcement-author");
  const category = categorySelect ? categorySelect.value : "INFO";
  const author = authorSelect ? authorSelect.value : "Seksi Humas";
  if (!title || !text) return;
  const newAnnouncement = {
    id: `ann-${Date.now()}`,
    category,
    author,
    title,
    text,
    date: new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date())
  };
  announcements.push(newAnnouncement);
  localStorage.setItem(storageKeys.announcements, JSON.stringify(announcements));
  renderAnnouncements();
  event.currentTarget.reset();
  showToast("Pengumuman berhasil diterbitkan!");
});

document.querySelector("#admin-announcements-list")?.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-delete-announcement]");
  if (!btn) return;
  const id = btn.dataset.deleteAnnouncement;
  announcements = announcements.filter((a) => a.id !== id);
  localStorage.setItem(storageKeys.announcements, JSON.stringify(announcements));
  renderAnnouncements();
  showToast("Pengumuman berhasil dihapus.");
});

const announcementDialog = document.querySelector("#announcement-dialog");
document.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-view-announcement]");
  if (!btn) return;
  const id = btn.dataset.viewAnnouncement;
  const entry = announcements.find((a) => a.id === id);
  if (!entry) return;
  const waUrl = makeWhatsAppShareUrl(entry);
  const content = document.querySelector("#announcement-dialog-content");
  content.innerHTML = `
    <div class="ann-dialog-header">
      <span class="announcement-badge badge-${escapeHtml((entry.category || 'INFO').toLowerCase())}">${escapeHtml(entry.category || 'INFO')}</span>
      <span class="announcement-date">${escapeHtml(entry.date)}</span>
    </div>
    <h2>${escapeHtml(entry.title)}</h2>
    <p class="ann-dialog-author"><strong>Diumumkan oleh:</strong> ${escapeHtml(entry.author || 'Pengurus ELITE')}</p>
    <div class="ann-dialog-body">${escapeHtml(entry.text).replace(/\n/g, '<br>')}</div>
    <div class="ann-dialog-foot">
      <a class="button button-primary wa-share-btn" href="${escapeHtml(waUrl)}" target="_blank" rel="noopener">
        <span>💬</span> Bagikan ke Grup WhatsApp ↗
      </a>
    </div>
  `;
  announcementDialog.showModal();
});

document.querySelector("#reset-local").addEventListener("click", () => {
  localStorage.removeItem(storageKeys.classes);
  localStorage.removeItem(storageKeys.announcements);
  classOverrides = {};
  announcements = [...defaultAnnouncements];
  renderRoster();
  renderMemberOptions();
  renderAnnouncements();
  document.querySelector("#admin-status").textContent = "Data pengumuman dan kelas dikembalikan ke awal.";
});
document.querySelector("#member-form").addEventListener("submit", () => {
  document.querySelector("#admin-status").textContent = "Kelas tersimpan di browser ini.";
});
document.querySelector("#announcement-form").addEventListener("submit", () => {
  document.querySelector("#admin-status").textContent = "Pengumuman tersimpan dan diterbitkan di browser ini.";
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
const galleryPhotos = {
  atletik: [
    { src: "assets/foto_atletik_1.jpg", caption: "Tim Atletik ELITE – sesi foto bersama" },
    { src: "assets/foto_atletik_2.jpg", caption: "Sesi pemanasan pagi hari di area latihan" },
    { src: "assets/foto_atletik_3.jpg", caption: "Latihan peregangan dan fleksibilitas atlet" },
    { src: "assets/foto_atletik_4.jpg", caption: "Sesi latihan sore – pose tim di lapangan" },
    { src: "assets/foto_atletik_5.jpg", caption: "Tim atletik putri &amp; putra SMAN 1 Babakan" },
    { src: "assets/foto_atletik_6.jpg", caption: "Latihan di stadion atletik – tim putra" }
  ]
};

document.querySelector("#gallery-grid").addEventListener("click", (event) => {
  const tile = event.target.closest(".gallery-tile");
  if (!tile) return;
  const category = tile.dataset.category;
  const photos = galleryPhotos[category];
  const dialogContent = document.querySelector("#gallery-dialog-content");
  if (photos && photos.length) {
    dialogContent.innerHTML = `
      <h3 class="gallery-dialog-title">${escapeHtml(tile.dataset.galleryTitle)}</h3>
      <div class="gallery-photo-grid">
        ${photos.map((p) => `<div class="gallery-photo-item">
          <img src="${escapeHtml(p.src)}" alt="${escapeHtml(p.caption)}" loading="lazy">
          <span>${p.caption}</span>
        </div>`).join("")}
      </div>`;
  } else {
    const art = tile.querySelector(".gallery-art").cloneNode(true);
    dialogContent.replaceChildren(
      art,
      Object.assign(document.createElement("h3"), { textContent: tile.dataset.galleryTitle }),
      Object.assign(document.createElement("p"), { textContent: "Belum ada foto kegiatan resmi di kategori ini. Tambahkan dokumentasi yang telah mendapat izin melalui folder aset project." })
    );
  }
  galleryDialog.showModal();
});

document.querySelectorAll(".adart-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".adart-tab").forEach((t) => {
      const isActive = t === tab;
      t.classList.toggle("is-active", isActive);
      t.setAttribute("aria-selected", String(isActive));
    });
    const targetTab = tab.dataset.tab;
    const panelAd = document.querySelector("#panel-ad");
    const panelArt = document.querySelector("#panel-art");
    if (targetTab === "ad") {
      panelAd.hidden = false;
      panelAd.classList.add("is-active");
      panelArt.hidden = true;
      panelArt.classList.remove("is-active");
    } else {
      panelArt.hidden = false;
      panelArt.classList.add("is-active");
      panelAd.hidden = true;
      panelAd.classList.remove("is-active");
    }
  });
});

renderRoster();
renderMemberOptions();
renderAnnouncements();
