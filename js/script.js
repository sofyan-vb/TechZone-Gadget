// =========================================
//        SISTEM LOGIN & PROFIL OTOMATIS
// =========================================

const loginOverlay = document.getElementById('login-overlay');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username-input');
const genderInput = document.getElementById('gender-input');

const navAvatar = document.getElementById('nav-avatar');
const dropdownAvatar = document.getElementById('dropdown-avatar');
const userNameDisplay = document.getElementById('user-name-display');
const userEmailDisplay = document.getElementById('user-email-display');

function checkLoginStatus() {
    const user = localStorage.getItem('techzone_user');
    const gender = localStorage.getItem('techzone_gender');
    const email = localStorage.getItem('techzone_email'); // Ambil Email

    if (user && gender) {
        // Jika data ada, update UI
        updateProfileUI(user, gender, email);
        hideLoginOverlay();
    } else {
        showLoginOverlay();
    }
}

// 2. Fungsi Update UI Profil
function updateProfileUI(name, gender, email) {
    let avatarUrl = '';
    
    // Logika Avatar: Jika Gender 'google', pakai foto profil ala Google
    if (gender === 'google') {
        // Foto Placeholder Wanita/Pria random untuk simulasi Google
        avatarUrl = `https://avatar.iran.liara.run/public?username=${name}`; 
    } else if (gender === 'male') {
        avatarUrl = `https://avatar.iran.liara.run/public/boy?username=${name}`;
    } else {
        avatarUrl = `https://avatar.iran.liara.run/public/girl?username=${name}`;
    }

    // Update Gambar Avatar
    const imgTag = `<img src="${avatarUrl}" alt="User Avatar">`;
    if(navAvatar) navAvatar.innerHTML = imgTag;
    if(dropdownAvatar) dropdownAvatar.innerHTML = imgTag;

    // Update Nama & Email
    if(userNameDisplay) userNameDisplay.innerText = name;
    if(userEmailDisplay) userEmailDisplay.innerText = email ? email : "member@techzone.id";
}

// 3. Tampilkan/Sembunyikan Overlay
function showLoginOverlay() {
    loginOverlay.classList.add('active');
    document.body.classList.add('no-scroll');
}
function hideLoginOverlay() {
    loginOverlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

// 4. LOGIN MANUAL (Form Biasa)
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = usernameInput.value.trim();
        const gender = genderInput.value;

        if (name.length > 0 && gender) {
            // Simpan data
            saveLoginSession(name, gender, `${name.toLowerCase().replace(/\s/g, '')}@gmail.com`);
            
            // Animasi Loading
            const btn = loginForm.querySelector('.btn-login');
            btn.innerText = "Memproses...";
            setTimeout(() => {
                location.reload(); 
            }, 800);
        } else {
            alert("Harap lengkapi data!");
        }
    });
}

// 5. LOGIN DENGAN GOOGLE (Simulasi)
window.loginWithGoogle = function() {
    // Tombol Loading
    const btnGoogle = document.querySelector('.btn-google');
    const originalContent = btnGoogle.innerHTML;
    btnGoogle.innerHTML = "Menghubungkan ke Google...";
    
    setTimeout(() => {
        // Simulasi Data User Google
        const fakeGoogleName = "Sultan Gadget"; 
        const fakeGoogleEmail = "sultan.gadget@gmail.com";
        const fakeGender = "google"; // Kode khusus untuk avatar Google

        // Simpan Data
        saveLoginSession(fakeGoogleName, fakeGender, fakeGoogleEmail);
        
        // Notifikasi & Reload
        showToast("Login Google Berhasil!");
        setTimeout(() => {
            location.reload();
        }, 500);

    }, 1500); // Delay 1.5 detik agar terasa seperti loading asli
}

// Fungsi Simpan ke LocalStorage
function saveLoginSession(name, gender, email) {
    localStorage.setItem('techzone_user', name);
    localStorage.setItem('techzone_gender', gender);
    localStorage.setItem('techzone_email', email);
}

// 6. Fungsi Logout
window.logoutUser = function() {
    if(confirm("Yakin ingin keluar akun?")) {
        localStorage.clear(); // Hapus semua data login
        location.reload(); 
    }
}

// Jalankan saat load
document.addEventListener("DOMContentLoaded", () => {
    checkLoginStatus();
});

// =======================================================
//                  SETUP MENU & NAVIGASI
// =======================================================
const navbarNav = document.querySelector('.navbar-nav');
const hamburger = document.querySelector('#hamburger-menu');

if (hamburger) {
    hamburger.onclick = (e) => {
        navbarNav.classList.toggle('active');
        e.preventDefault(); 
    };
}

document.addEventListener('click', function(e) {
    if (hamburger && !hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
        navbarNav.classList.remove('active');
    }
});

// =======================================================
//           LOGIKA KERANJANG (CART SYSTEM)
// =======================================================

const cartModal = document.querySelector('#shopping-cart-modal');
const cartBtn = document.querySelector('#shopping-cart');
const closeBtn = document.querySelector('#close-cart');
const cartContainer = document.querySelector('#cart-items-content');

let cart = [];


document.addEventListener('click', function(e) {
    const targetBtn = e.target.closest('.add-to-cart-btn');

    if(targetBtn && !targetBtn.classList.contains('active')) {
        e.preventDefault();
        
        const name = targetBtn.getAttribute('data-name');
        const price = parseFloat(targetBtn.getAttribute('data-price'));

        firstAddToCart(name, price);
    }
});


function firstAddToCart(name, price) {
    cart.push({ name: name, price: price, qty: 1 });
    showToast("Pesanan masuk keranjang");
    
    renderCart();
    updateAllButtons();
}


window.increaseItem = function(name) {
    const item = cart.find(c => c.name === name);
    if(item) {
        item.qty++;
        showToast("Pesanan ditambahkan");
        
        renderCart();
        updateAllButtons();
    }
}


window.decreaseItem = function(name) {
    const itemIndex = cart.findIndex(c => c.name === name);
    if(itemIndex !== -1) {
        const item = cart[itemIndex];
        
        if(item.qty > 1) {
            item.qty--;

        } else {
            cart.splice(itemIndex, 1);
            showToast("Pesanan dihapus dari keranjang");
        }
        
        renderCart();
        updateAllButtons();
    }
}


function updateAllButtons() {
    const buttons = document.querySelectorAll('.add-to-cart-btn');

    buttons.forEach(btn => {
        const name = btn.getAttribute('data-name');
        const item = cart.find(c => c.name === name);

        if (item) {
            btn.classList.add('active');
            
            btn.innerHTML = `
            <span class="qty-btn" onclick="event.preventDefault(); decreaseItem('${name}'); event.stopPropagation();">-</span>
            <span class="qty-number">${item.qty}</span>
            <span class="qty-btn" onclick="event.preventDefault(); increaseItem('${name}'); event.stopPropagation();">+</span>
        `;
        } else {
           
            btn.classList.remove('active');
            btn.innerHTML = `<i data-feather="shopping-cart"></i> + Keranjang`;
        }
    });
    
    if (typeof feather !== 'undefined') feather.replace();
}


function showToast(msg) {
    const toastBox = document.getElementById('toast-box');
    if (!toastBox) return;

    const toast = document.createElement('div');
    toast.classList.add('toast');
    
    let icon = 'check-circle';
    if(msg.includes('dihapus')) icon = 'trash-2';
    
    toast.innerHTML = `<i data-feather="${icon}"></i> ${msg}`;
    
    toastBox.appendChild(toast);
    if (typeof feather !== 'undefined') feather.replace();

    setTimeout(() => {
        toast.remove();
    }, 3000); 
}

function renderCart() {
    // 1. Update Badge (Angka Merah)
    if (typeof updateCartBadge === "function") updateCartBadge(); 

    const cartContainer = document.querySelector('#cart-items-content');
    if(!cartContainer) return;

    let total = 0;
    let html = '';

    // --- KONDISI 1: KERANJANG KOSONG ---
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 1rem; text-align: center;">
                
                <i data-feather="shopping-cart" style="width: 80px; height: 80px; color: #555; margin-bottom: 1.5rem; opacity: 0.5;"></i>
                
                <h3 style="font-size: 1.5rem; margin: 0; color: inherit;">Keranjang Masih Kosong</h3>
                
            </div>
        `;
        updatePriceText(0);
        toggleCheckoutBtn(false); // Sembunyikan tombol checkout
    } 
    
    // --- KONDISI 2: ADA BARANG ---
    else {
        cart.forEach((item, index) => {
            let subtotal = item.price * item.qty;
            total += subtotal;

            html += `
                <div class="cart-item-row" style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 1rem; margin-bottom: 1rem; border-bottom: 1px solid #333;">
                    <div class="cart-item-info">
                        <h4 style="margin:0; font-size:1rem; color:#fff;">${item.name}</h4>
                        <span style="color:#aaa; font-size:0.9rem;">${item.qty} x IDR ${item.price.toLocaleString('id-ID')}</span>
                    </div>
                    <div class="cart-item-actions" style="text-align: right;">
                        <div class="cart-price" style="color: var(--primary, #00FFFF); font-weight: bold;">IDR ${subtotal.toLocaleString('id-ID')}</div>
                        <a href="javascript:void(0)" onclick="removeItemCart(${index})" style="color: #ff4d4d; font-size: 0.8rem; text-decoration: none; display: flex; align-items: center; justify-content: flex-end; gap: 5px; margin-top: 5px;">
                            <i data-feather="trash-2" style="width:14px; height:14px;"></i> Hapus
                        </a>
                    </div>
                </div>
            `;
        });

        cartContainer.innerHTML = html;
        updatePriceText(total);
        toggleCheckoutBtn(true); // Tampilkan tombol checkout
    }
    
    // PENTING: Refresh Icon agar muncul gambarnya
    if (typeof feather !== 'undefined') feather.replace();
}


function updatePriceText(amount) {
    const el = document.querySelector('#cart-total-price');
    if(el) el.innerText = `IDR ${amount.toLocaleString('id-ID')}`;
}

function toggleCheckoutBtn(show) {
    const existingBtn = document.querySelector('#btn-checkout-cart');
    if(show && !existingBtn) {
        const btn = document.createElement('button');
        btn.id = 'btn-checkout-cart';
        btn.innerText = 'CHECKOUT SEKARANG';
        btn.style = 'width: 100%; padding: 10px; background: #00FFFF; color: #000; border: none; font-weight: bold; margin-top: 1rem; cursor: pointer; border-radius: 5px;';
        btn.onclick = openCheckoutModal;
        cartContainer.parentElement.appendChild(btn);
    } else if (!show && existingBtn) {
        existingBtn.remove();
    }
}


window.removeItemCart = function(index) {
    cart.splice(index, 1);
    renderCart();
    updateAllButtons();
}


if(cartBtn) {
    cartBtn.onclick = (e) => {
        if(cartModal) cartModal.style.display = 'flex';
        renderCart();
        e.preventDefault();
    };
}
if (closeBtn) {
    closeBtn.onclick = (e) => {
        cartModal.style.display = 'none';
        e.preventDefault();
    };
}


const checkoutModal = document.getElementById('checkout-modal');
const closeCheckout = document.getElementById('close-checkout');

function openCheckoutModal() {
    cartModal.style.display = 'none';
    checkoutModal.style.display = 'flex';
    document.getElementById('payment-section').style.display = 'block';
    document.getElementById('bill-section').style.display = 'none';
}

if(closeCheckout) {
    closeCheckout.onclick = (e) => {
        checkoutModal.style.display = 'none';
        e.preventDefault();
    }
}

window.processPayment = function(method) {
    document.getElementById('payment-section').style.display = 'none';
    document.getElementById('bill-section').style.display = 'block';
    const date = new Date();
    document.getElementById('nota-date').innerText = `Tgl: ${date.toLocaleString('id-ID')}`;
    document.getElementById('nota-id').innerText = `Order ID: #TZ-${Math.floor(Math.random() * 100000)}`;
    document.getElementById('nota-method').innerText = method;

    let html = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.qty;
        html += `<div class="nota-item"><span>${item.name} (x${item.qty})</span><span>${(item.price * item.qty).toLocaleString('id-ID')}</span></div>`;
    });

    document.getElementById('nota-items').innerHTML = html;
    document.getElementById('nota-total-price').innerText = `IDR ${total.toLocaleString('id-ID')}`;
}

window.finishOrder = function() {
    alert("Terima kasih! Pesanan diproses.");
    cart = [];
    renderCart();
    updateAllButtons();
    checkoutModal.style.display = 'none';
}


window.addEventListener("load", function() {
    const loader = document.querySelector(".loader-wrapper");
    if(loader) setTimeout(() => loader.classList.add("fade-out"), 100);
});

window.transitionTo = function(url, duration = 1000) {
    const loader = document.querySelector(".loader-wrapper");
    if(loader) {
        loader.classList.remove("fade-out");
        setTimeout(() => window.location.href = url, duration);
    } else {
        window.location.href = url;
    }
}

if (typeof feather !== 'undefined') feather.replace();


// =======================================================
//               FITUR DOWNLOAD STRUK 
// =======================================================

window.downloadReceipt = function() {
    const receiptBox = document.querySelector('.nota-box');
    const btn = document.querySelector('.btn-download');  
    const icon = btn.querySelector('i');
    const text = btn.querySelector('span');

    const originalText = text.innerText;
    text.innerText = 'Memproses...';
    btn.style.opacity = '0.7';
    btn.style.cursor = 'wait';

    
    html2canvas(receiptBox, { scale: 2, backgroundColor: "#ffffff" }).then(canvas => {
       
        const link = document.createElement('a');
        link.download = `Struk-TechZone-${Math.floor(Math.random() * 99999)}.png`;
        link.href = canvas.toDataURL('image/png');
        
      
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        
        setTimeout(() => {
            text.innerText = originalText;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
            
           
            finishOrder();
        }, 800);
    });
}

window.finishOrder = function() {
  
    if (typeof showToast === "function") {
        showToast("Struk berhasil disimpan! Terima kasih.");
    } else {
        alert("Terima kasih! Pesanan selesai.");
    }
    
    
    cart = [];
    if (typeof renderCart === "function") renderCart();
    if (typeof updateAllButtons === "function") updateAllButtons();
    
    const checkoutModal = document.getElementById('checkout-modal');
    if(checkoutModal) checkoutModal.style.display = 'none';
    
    const paySection = document.getElementById('payment-section');
    const billSection = document.getElementById('bill-section');
    if(paySection) paySection.style.display = 'block';
    if(billSection) billSection.style.display = 'none';
}


// =========================================
//          LOGIKA FILTER KATEGORI
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Ambil semua elemen yang dibutuhkan
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productItems = document.querySelectorAll('.product-item');
    const backBtn = document.getElementById('back-to-home');

    // 2. Fungsi Filter
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Hapus class 'active' dari semua tombol
            filterButtons.forEach(b => b.classList.remove('active'));
            // Tambah class 'active' ke tombol yang diklik
            btn.classList.add('active');

            const categoryValue = btn.getAttribute('data-filter');

            productItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');

                if (categoryValue === 'all' || itemCategory === categoryValue) {
                    item.style.display = 'block';
                    // Reset animasi agar efek muncul ulang
                    item.style.animation = 'none';
                    item.offsetHeight; /* trigger reflow */
                    item.style.animation = 'fadeUp 0.5s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // 3. Fungsi Tombol Home (Menggunakan fungsi transitionTo dari script.js utama)
    if(backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Cek apakah fungsi transitionTo ada (dari script.js global)
            if (typeof transitionTo === "function") {
                transitionTo('index.html', 100);
            } else {
                window.location.href = 'index.html';
            }
        });
    }
});

// =======================================================
//           FITUR LIGHTBOX (ZOOM GAMBAR)
// =======================================================
const lightbox = document.getElementById('image-lightbox');
const lightboxImg = document.getElementById('lightbox-img');

window.openLightbox = function(element) {
    // Cari elemen gambar di dekat tombol mata yang diklik
    // Menggunakan closest untuk mencari container, lalu cari img di dalamnya
    const container = element.closest('.product-img-container');
    const img = container.querySelector('img');
    
    if (img && lightbox && lightboxImg) {
        lightbox.style.display = "flex";
        lightboxImg.src = img.src; // Ambil source gambar produk
    }
}

window.closeLightbox = function() {
    if(lightbox) lightbox.style.display = "none";
}

// Tutup jika klik area hitam (background)
if (lightbox) {
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}


// =======================================================
//           FITUR DETAIL PRODUK (POPUP SPEK)
// =======================================================

const detailModal = document.getElementById('product-detail-modal');

window.openDetail = function(element) {
    if(event) event.preventDefault();
    
    // 1. Ambil data dari atribut HTML tombol
    const title = element.getAttribute('data-title');
    const priceStr = element.getAttribute('data-price'); 
    const desc = element.getAttribute('data-desc');
    const specsRaw = element.getAttribute('data-specs'); 
    const imgSrc = element.getAttribute('data-img');
    
    // 2. Masukkan data ke elemen Popup
    document.getElementById('detail-title').innerText = title;
    document.getElementById('detail-price').innerText = `IDR ${priceStr}`;
    document.getElementById('detail-desc').innerText = desc;
    document.getElementById('detail-img').src = imgSrc;
    
    // 3. Proses List Spesifikasi
    const specsList = document.getElementById('detail-specs');
    specsList.innerHTML = ''; 
    
    if(specsRaw) {
        const specsArray = specsRaw.split(','); 
        specsArray.forEach(spec => {
            const li = document.createElement('li');
            li.innerText = spec.trim(); 
            specsList.appendChild(li);
        });
    }

    // --- BAGIAN YANG DIPERBAIKI ---
    // 4. Update Tombol agar Sinkron dengan Keranjang
    const modalCartBtn = document.getElementById('detail-cart-btn');
    
    // a. Clone tombol untuk menghapus event listener lama yang menumpuk
    const newBtn = modalCartBtn.cloneNode(true);
    modalCartBtn.parentNode.replaceChild(newBtn, modalCartBtn);

    // b. Tambahkan class 'add-to-cart-btn' agar terdeteksi oleh updateAllButtons()
    newBtn.classList.add('add-to-cart-btn');

    // c. Set Data Attributes agar logika global bisa membacanya
    newBtn.setAttribute('data-name', title);
    
    // Penting: Bersihkan titik pada harga agar terbaca sebagai angka oleh sistem global
    const cleanPrice = parseFloat(priceStr.replace(/\./g,''));
    newBtn.setAttribute('data-price', cleanPrice);

    // d. Panggil updateAllButtons() 
    // Ini akan otomatis mengecek: Apakah item ini ada di cart?
    // Jika YA: Tombol berubah jadi (- 1 +)
    // Jika TIDAK: Tombol berubah jadi (+ Keranjang)
    if (typeof updateAllButtons === "function") {
        updateAllButtons(); 
    }

    // 5. Tampilkan Modal
    detailModal.style.display = 'flex';
}

// Fungsi Tutup Modal
window.closeDetailModal = function() {
    if(detailModal) detailModal.style.display = 'none';
}

// Tutup jika klik area hitam di luar popup
if (detailModal) {
    detailModal.addEventListener('click', function(e) {
        if (e.target === detailModal) {
            closeDetailModal();
        }
    });
}


// ========================================
//   --- FUNGSI DOWNLOAD STRUK PRODUCTS ---
// ========================================

function downloadReceipt() {
    // 1. Cari elemen nota dan tombol
    const notaElement = document.querySelector('.nota-box');
    const btn = document.querySelector('.btn-download');
    
    // Cek apakah elemen ada
    if (!notaElement) {
        alert("Error: Elemen struk tidak ditemukan.");
        return;
    }

    // 2. Ubah teks tombol agar user tahu proses berjalan
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Sedang Menyimpan...';
    
    // 3. Gunakan html2canvas untuk screenshot
    html2canvas(notaElement, { scale: 2 }).then(canvas => {
        // Buat link download palsu
        const link = document.createElement('a');
        link.download = 'Struk-TechZone-' + Date.now() + '.jpg';
        link.href = canvas.toDataURL('image/jpeg');
        link.click();
        
        // Kembalikan teks tombol
        btn.innerHTML = originalText;

        // 4. Reset dan Reload halaman
        setTimeout(() => {
            alert("Terima kasih! Struk berhasil disimpan.");
            
            // Hapus data keranjang (Opsional, sesuaikan dengan logika penyimpanan Anda)
            // localStorage.removeItem('cart'); 
            
            location.reload(); 
        }, 1000);
    }).catch(err => {
        console.error("Gagal menyimpan struk:", err);
        alert("Maaf, gagal menyimpan struk. Pastikan koneksi internet lancar untuk memuat library.");
        btn.innerHTML = originalText;
    });
}


function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    // Hitung total semua barang (misal: 2 HP + 1 TWS = 3 item)
    const totalItems = cart.reduce((total, item) => total + item.qty, 0);

    if (badge) {
        badge.innerText = totalItems;
        // Jika ada barang, tampilkan badge. Jika 0, sembunyikan.
        if (totalItems > 0) {
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }
    }
}


