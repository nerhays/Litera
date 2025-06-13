const track = document.getElementById("carouselTrack");
const dotsContainer = document.getElementById("carouselDots");
const slides = document.querySelectorAll(".carousel-slide");
let currentIndex = 0;

slides.forEach((_, idx) => {
  const dot = document.createElement("span");
  dot.addEventListener("click", () => {
    currentIndex = idx;
    updateCarousel();
  });
  dotsContainer.appendChild(dot);
});

function updateCarousel() {
  const slideWidth = slides[0].clientWidth;
  track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

  [...dotsContainer.children].forEach((dot) => dot.classList.remove("active"));
  dotsContainer.children[currentIndex].classList.add("active");
}

function moveSlide(dir) {
  currentIndex = (currentIndex + dir + slides.length) % slides.length;
  updateCarousel();
}

setInterval(() => moveSlide(1), 5000);

updateCarousel();

fetch("../template/navbar.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("navbar").innerHTML = data;
    updateNavbarLoginStatus();
  });

fetch("../template/footer.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("footer").innerHTML = data;
  });

// Register
function register() {
  const username = document.getElementById("reg-username").value;
  const password = document.getElementById("reg-password").value;

  if (!username || !password) {
    document.getElementById("reg-message").textContent = "Semua field wajib diisi!";
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const exists = users.find((user) => user.username === username);

  if (exists) {
    document.getElementById("reg-message").textContent = "Username sudah digunakan.";
    return;
  }

  // Tambahkan user dengan role 'user'
  users.push({ username, password, role: "user" });
  localStorage.setItem("users", JSON.stringify(users));
  document.getElementById("reg-message").style.color = "green";
  document.getElementById("reg-message").textContent = "Berhasil mendaftar. Silakan login.";
}

// Login
function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.username === username && u.password === password);

  if (user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));

    // Redirect sesuai role
    if (user.role === "admin") {
      window.location.href = "admin/dashboardadmin.html";
    } else {
      window.location.href = "index.html";
    }
  } else {
    document.getElementById("login-message").textContent = "Username atau password salah!";
  }
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "../index.html";
}

function updateNavbarLoginStatus() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const navbar = document.getElementById("navbar-user");

  if (!navbar) return;

  if (user) {
    navbar.innerHTML = `
    <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="kategoriDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false"> Kategori </a>
          <ul class="dropdown-menu" aria-labelledby="kategoriDropdown">
            <li><a class="dropdown-item" href="../produk/katalog.html?kategori=all">Semua Kategori</a></li>
            <li><a class="dropdown-item" href="../produk/katalog.html?kategori=Fiksi">Fiksi</a></li>
            <li><a class="dropdown-item" href="../produk/katalog.html?kategori=Nonfiksi">Non-Fiksi</a></li>
            <li><a class="dropdown-item" href="../produk/katalog.html?kategori=Teknologi">Teknologi</a></li>
            <li><a class="dropdown-item" href="../produk/katalog.html?kategori=Pendidikan">Pendidikan</a></li>
            <li><a class="dropdown-item" href="../produk/katalog.html?kategori=Novel">Novel</a></li>
          </ul>
        </li>
        <li class="nav-item ms-3">
          <a href="../transaksi/keranjang.html" class="nav-link position-relative">
            <i class="bi bi-cart3 fs-5"></i>
          </a>
        </li>
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
          <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="profile" width="30" height="30" class="rounded-circle me-2">
          <span>${user.username}</span>
        </a>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a class="dropdown-item" href="../transaksi/history.html" ">History Transaksi</li>
          <li><a class="dropdown-item" href="../produk/favorite.html" ">Favorite Buku</li>
          <li><a class="dropdown-item" href="#" onclick="logout()">Logout</a></li>
        </ul>
      </li>
    `;
  } else {
    navbar.innerHTML += `
      <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="kategoriDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false"> Kategori </a>
          <ul class="dropdown-menu" aria-labelledby="kategoriDropdown">
            <li><a class="dropdown-item" href="../produk/katalog.html?kategori=all">Semua Kategori</a></li>
            <li><a class="dropdown-item" href="../produk/katalog.html?kategori=Fiksi">Fiksi</a></li>
            <li><a class="dropdown-item" href="../produk/katalog.html?kategori=Nonfiksi">Non-Fiksi</a></li>
            <li><a class="dropdown-item" href="../produk/katalog.html?kategori=Teknologi">Teknologi</a></li>
            <li><a class="dropdown-item" href="../produk/katalog.html?kategori=Pendidikan">Pendidikan</a></li>
            <li><a class="dropdown-item" href="../produk/katalog.html?kategori=Novel">Novel</a></li>
          </ul>
        </li>
        <li class="nav-item ms-3">
          <a href="../login.html" class="nav-link position-relative">
            <i class="bi bi-cart3 fs-5"></i>
          </a>
        </li>
        <li class="nav-item ms-3">
          <a href="../login.html" class="btn btn-dark">Login</a>
        </li>
    `;
  }
}

window.onload = function () {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const adminExists = users.some((user) => user.username === "admin@gmail.com");

  if (!adminExists) {
    users.push({ username: "admin@gmail.com", password: "admin123", role: "admin" });
    localStorage.setItem("users", JSON.stringify(users));
    console.log("Admin dummy account created: admin@gmail.com / admin123");
  }
};
