const dummyCart = JSON.parse(localStorage.getItem("cart")) || [];

function renderCart() {
  const cartTable = document.querySelector("#cart-items tbody");
  const totalDisplay = document.getElementById("total-harga");
  cartTable.innerHTML = "";
  let total = 0;

  dummyCart.forEach((item, index) => {
    const subtotal = item.harga * item.jumlah;
    total += subtotal;

    cartTable.innerHTML += `
      <tr>
        <td><img src="${item.gambar}" class="cart-item-img" /></td>
        <td>${item.nama}</td>
        <td>Rp${item.harga.toLocaleString("id-ID")}</td>
        <td>${item.jumlah}</td>
        <td>Rp${subtotal.toLocaleString("id-ID")}</td>
        <td><button class="btn btn-sm btn-danger" onclick="hapusItem(${index})">Hapus</button></td>
      </tr>
    `;
  });

  totalDisplay.textContent = `Rp${total.toLocaleString("id-ID")}`;
}

function hapusItem(index) {
  dummyCart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(dummyCart));
  renderCart();
}

function checkout() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Keranjang kosong!");
    return;
  }

  localStorage.setItem("checkoutCart", JSON.stringify(cart));
  window.location.href = "pembayaran.html";
}

renderCart();
