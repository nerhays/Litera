const cartData = JSON.parse(localStorage.getItem("checkoutCart")) || [];

function tampilkanDetailPembayaran() {
  const container = document.getElementById("checkout-detail");

  if (cartData.length === 0) {
    container.innerHTML = "<p>Data keranjang kosong.</p>";
    return;
  }

  let total = 0;
  let html = "<ul class='list-group'>";
  cartData.forEach((item) => {
    const subtotal = item.harga * item.jumlah;
    total += subtotal;
    html += `<li class="list-group-item d-flex justify-content-between">
      <span>${item.nama} (${item.jumlah}x)</span>
      <span>Rp${subtotal.toLocaleString("id-ID")}</span>
    </li>`;
  });
  html += `<li class="list-group-item d-flex justify-content-between fw-bold">
    <span>Total</span><span>Rp${total.toLocaleString("id-ID")}</span>
  </li>`;
  html += "</ul>";

  container.innerHTML = html;
}

document.getElementById("form-pembayaran").addEventListener("submit", function (e) {
  e.preventDefault();

  const nama = document.getElementById("nama").value.trim();
  const metode = document.getElementById("metode").value;

  if (!nama || !metode) {
    alert("Harap lengkapi semua data pembayaran.");
    return;
  }

  const transaksiSebelumnya = JSON.parse(localStorage.getItem("historyTransaksi")) || [];
  const tanggal = new Date().toLocaleString("id-ID");

  const transaksiBaru = {
    id: Date.now(),
    namaPembeli: nama,
    metode: metode,
    tanggal: tanggal,
    items: cartData,
    total: cartData.reduce((acc, item) => acc + item.harga * item.jumlah, 0),
  };

  transaksiSebelumnya.push(transaksiBaru);
  localStorage.setItem("historyTransaksi", JSON.stringify(transaksiSebelumnya));
  localStorage.removeItem("cart");
  localStorage.removeItem("checkoutCart");

  alert("Pembayaran berhasil!");
  window.location.href = "history.html";
});

tampilkanDetailPembayaran();
