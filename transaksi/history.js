// history.js
const historyContainer = document.getElementById("history-list");
const history = JSON.parse(localStorage.getItem("historyTransaksi")) || [];

if (history.length === 0) {
  historyContainer.innerHTML = "<p>Belum ada transaksi.</p>";
} else {
  history.forEach((transaksi) => {
    let itemList = transaksi.items
      .map(
        (item) => `
      <li>${item.nama} (${item.jumlah}x) - Rp${(item.harga * item.jumlah).toLocaleString("id-ID")}</li>
    `
      )
      .join("");

    historyContainer.innerHTML += `
      <div class="card mb-3">
        <div class="card-header">
          <strong>Nama Pembeli:</strong> ${transaksi.namaPembeli} <br />
          <strong>Tanggal:</strong> ${transaksi.tanggal} <br />
          <strong>Total:</strong> Rp${transaksi.total.toLocaleString("id-ID")}
        </div>
        <div class="card-body">
          <ul>${itemList}</ul>
        </div>
      </div>
    `;
  });
}
