const container = document.getElementById("admin-history-list");
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const filterBtn = document.getElementById("filterBtn");
const resetBtn = document.getElementById("resetBtn");
const searchInput = document.getElementById("searchInput");

let history = JSON.parse(localStorage.getItem("historyTransaksi")) || [];

function parseDate(str) {
  if (!str) return null;

  if (str.includes(",") && str.includes("/")) {
    const [datePart] = str.split(",");
    const [d, m, y] = datePart.trim().split("/");
    return new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}T00:00:00`);
  } else if (str.includes("/")) {
    const [d, m, y] = str.split("/");
    return new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}T00:00:00`);
  } else if (str.includes("-")) {
    return new Date(`${str}T00:00:00`);
  }

  return new Date(str);
}

function filterHistory() {
  let start = startDateInput.value ? parseDate(startDateInput.value) : null;
  let end = endDateInput.value ? parseDate(endDateInput.value) : null;
  const searchText = searchInput.value.toLowerCase();

  if (start && end && end < start) {
    alert("Tanggal akhir harus setelah tanggal awal!");
    return;
  }

  let filtered = history.filter((transaksi) => {
    const tgl = parseDate(transaksi.tanggal);
    if (!tgl) return false;
    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(0, 0, 0, 0);
    tgl.setHours(0, 0, 0, 0);

    if (start && tgl < start) return false;
    if (end && tgl > end) return false;
    if (searchText) {
      const itemsStr = transaksi.items.map((item) => item.nama.toLowerCase()).join(" ");
      const namaPembeliStr = (transaksi.namaPembeli || "").toLowerCase();
      const tanggalStr = (transaksi.tanggal || "").toLowerCase();

      if (!itemsStr.includes(searchText) && !namaPembeliStr.includes(searchText) && !tanggalStr.includes(searchText)) {
        return false;
      }
    }

    return true;
  });

  render(filtered);
}

function getWeekOfMonth(date) {
  const day = date.getDate();
  return Math.ceil(day / 7);
}

function render(data) {
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = "<p class='text-muted'>Belum ada transaksi.</p>";
    return;
  }

  data.forEach((transaksi, i) => {
    let itemList = transaksi.items.map((item) => `<li>${item.nama} (${item.jumlah}x) - Rp${(item.harga * item.jumlah).toLocaleString("id-ID")}</li>`).join("");

    container.innerHTML += `
      <div class="card mb-2" data-index="${i}">
        <div class="card-header d-flex justify-content-between align-items-center">
          <div>
            <strong>Nama Pembeli:</strong> ${transaksi.namaPembeli} <br />
            <small><strong>Tanggal:</strong> ${transaksi.tanggal}</small><br />
            <small><strong>Total:</strong> Rp${transaksi.total.toLocaleString("id-ID")}</small>
          </div>
          <button class="btn btn-sm btn-danger btn-delete" data-index="${i}" title="Hapus transaksi">
            <i class="bi bi-trash"></i>
          </button>
        </div>
        <div class="card-body p-2">
          <ul>${itemList}</ul>
        </div>
      </div>
    `;
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = e.currentTarget.getAttribute("data-index");
      if (confirm("Yakin ingin menghapus transaksi ini?")) {
        history.splice(idx, 1);
        localStorage.setItem("historyTransaksi", JSON.stringify(history));
        filterHistory();
      }
    });
  });
}

filterBtn.addEventListener("click", filterHistory);
resetBtn.addEventListener("click", () => {
  startDateInput.value = "";
  endDateInput.value = "";
  searchInput.value = "";
  render(history);
});
render(history);
