// =======================================================
//           SCROLL SPY (NAVIGASI NYALA OTOMATIS)
// =======================================================

window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar-nav a');

    let currentSection = '';

    sections.forEach(section => {
     
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - 150)) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        
        
        if (link.getAttribute('href').includes(currentSection)) {
            if (currentSection !== '') { 
                link.classList.add('active');
            }
        }
    });
});


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
    const navEntry = performance.getEntriesByType("navigation")[0];
    const isRefresh = (navEntry && navEntry.type === 'reload');

    if (isRefresh) {
        console.log("Terdeteksi Refresh: Menghapus sesi login...");
        sessionStorage.removeItem('techzone_user');
        sessionStorage.removeItem('techzone_gender');
        sessionStorage.removeItem('techzone_email');
    }

    const savedUser = sessionStorage.getItem('techzone_user');
    const savedGender = sessionStorage.getItem('techzone_gender');
    const savedEmail = sessionStorage.getItem('techzone_email');

    if (savedUser && savedUser !== 'null' && savedUser !== '') {
        
        console.log("Sesi aktif ditemukan, login otomatis.");
        updateProfileUI(savedUser, savedGender, savedEmail);
        
        const overlay = document.getElementById('login-overlay');
        if (overlay) overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');

    } else {
       
        console.log("Sesi kosong, memunculkan login...");
        
        if (typeof updateProfileUI === "function") {
             updateProfileUI("Guest", "", ""); 
        }

        showLoginOverlay();
    }
}


function updateProfileUI(name, gender, email) {
    
    let avatarUrl = '';

    if (gender === 'male' || gender === 'google') {
        avatarUrl = `https://api.dicebear.com/9.x/micah/png?seed=Felix&backgroundColor=b6e3f4&radius=50`; 
    } else if (gender === 'female') {
        
        avatarUrl = `https://api.dicebear.com/9.x/micah/png?seed=Jessica&backgroundColor=ffdfbf&radius=50`;
    } else {
        
        avatarUrl = `https://api.dicebear.com/9.x/micah/png?seed=Guest&radius=50`;
    }

    const imgTag = `<img src="${avatarUrl}" alt="User Avatar" style="width:100%; height:100%; object-fit:cover; border: 2px solid #fff;">`;
    
    if(navAvatar) {
        navAvatar.innerHTML = imgTag;
        navAvatar.style.padding = "0"; 
        navAvatar.style.overflow = "hidden";
        navAvatar.style.borderRadius = "50%"; 
    }
    
    if(dropdownAvatar) {
        dropdownAvatar.innerHTML = imgTag;
        dropdownAvatar.style.padding = "0"; 
        dropdownAvatar.style.overflow = "hidden";
        dropdownAvatar.style.borderRadius = "50%";
    }

    if(userNameDisplay) userNameDisplay.innerText = name;
    if(userEmailDisplay) userEmailDisplay.innerText = email ? email : "member@techzone.id";
}


function showLoginOverlay() {
    loginOverlay.classList.add('active');
    document.body.classList.add('no-scroll');
}
function hideLoginOverlay() {
    loginOverlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
}


if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = usernameInput.value.trim();
        const gender = genderInput.value;

        if (name.length > 0 && gender) {
        
            saveLoginSession(name, gender, `${name.toLowerCase().replace(/\s/g, '')}@gmail.com`);
            
            const btn = loginForm.querySelector('.btn-login');
            btn.innerText = "Berhasil Masuk!";
            
            setTimeout(() => {
                hideLoginOverlay();      
                updateProfileUI(name, gender, `${name.toLowerCase().replace(/\s/g, '')}@gmail.com`); // Update avatar
                btn.innerText = "MASUK SEKARANG"; 
            }, 800);
            
        } else {
            alert("Harap lengkapi data!");
        }
    });
}


window.loginWithGoogle = function() {
    const btnGoogle = document.querySelector('.btn-google');
    btnGoogle.innerHTML = "Menghubungkan...";
    
    setTimeout(() => {
        const fakeName = "Sultan Gadget"; 
        const fakeGender = "male"; 
        const fakeEmail = "sultan@google.com";

        saveLoginSession(fakeName, fakeGender, fakeEmail);
  
        hideLoginOverlay();
        updateProfileUI(fakeName, fakeGender, fakeEmail);
        showToast("Login Google Berhasil!");
        
        btnGoogle.innerHTML = `<img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"> Masuk dengan Google`;

    }, 1000); 
}


function saveLoginSession(name, gender, email) {
    sessionStorage.setItem('techzone_user', name);
    sessionStorage.setItem('techzone_gender', gender);
    sessionStorage.setItem('techzone_email', email);
}


window.logoutUser = function() {
    if(confirm("Yakin ingin keluar akun?")) {
        sessionStorage.clear();
        location.reload(); 
    }
}

document.addEventListener("DOMContentLoaded", () => {
    checkLoginStatus();
});


// =======================================================
//           LOGIKA PROFIL & RIWAYAT PESANAN
// =======================================================

window.openProfileModal = function() {
    const modal = document.getElementById('profile-modal');
    const nameInput = document.getElementById('edit-name');
    const emailInput = document.getElementById('edit-email');
    const avatarContainer = document.getElementById('profile-modal-avatar');
    
    const currentName = sessionStorage.getItem('techzone_user') || 'Guest';
    const currentEmail = sessionStorage.getItem('techzone_email') || 'user@techzone.id';
    const currentGender = sessionStorage.getItem('techzone_gender');

    nameInput.value = currentName;
    emailInput.value = currentEmail;

    
    let avatarUrl = '';

    if (currentGender === 'male' || currentGender === 'google') {
         avatarUrl = `https://api.dicebear.com/9.x/micah/png?seed=Felix&backgroundColor=b6e3f4&radius=50`; 
    } else if (currentGender === 'female') {
        avatarUrl = `https://api.dicebear.com/9.x/micah/png?seed=Jessica&backgroundColor=ffdfbf&radius=50`;
    } else {
        avatarUrl = `https://api.dicebear.com/9.x/micah/png?seed=Guest&radius=50`;
    }
    

    avatarContainer.innerHTML = `<img src="${avatarUrl}" alt="Profile" style="width:100%; height:100%; object-fit:cover;">`;
    
    avatarContainer.style.width = "100px";
    avatarContainer.style.height = "100px";
    avatarContainer.style.overflow = "hidden";
    avatarContainer.style.borderRadius = "50%";
    avatarContainer.style.border = "4px solid #f0f0f0";
    avatarContainer.style.padding = "0";
    avatarContainer.style.margin = "0 auto 15px auto"; 

    const userDropdown = document.getElementById('user-dropdown');
    if(userDropdown) userDropdown.classList.remove('active');
    
    modal.style.display = 'flex';
}

const editProfileForm = document.getElementById('edit-profile-form');
if (editProfileForm) {
    editProfileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newName = document.getElementById('edit-name').value;
        sessionStorage.setItem('techzone_user', newName);
        const gender = sessionStorage.getItem('techzone_gender');
        const email = sessionStorage.getItem('techzone_email');
    
        if (typeof updateProfileUI === "function") {
            updateProfileUI(newName, gender, email);
        }

        alert("Profil berhasil diperbarui!");
        closeUserModals();
    });
}

window.openOrdersModal = function() {
    const modal = document.getElementById('orders-modal');
    const listContainer = document.getElementById('order-history-list');
    const history = JSON.parse(localStorage.getItem('techzone_order_history')) || [];
    const userDropdown = document.getElementById('user-dropdown');
    if(userDropdown) userDropdown.classList.remove('active');

    
    if (history.length === 0) {
        listContainer.innerHTML = `
            <div style="text-align:center; padding: 3rem 1rem;">
                <i data-feather="package" style="width:60px; height:60px; color:#333; margin-bottom:15px;"></i>
                
                <h4 style="color:#fff; margin-bottom:5px;">Belum ada riwayat pesanan</h4>
                <p style="color:#888; font-size:0.9rem;">Yuk mulai belanja gadget impianmu!</p>
                
                <a href="products.html" onclick="closeUserModals()" class="btn-shop-now">
                    <i data-feather="shopping-bag"></i> Belanja Sekarang
                </a>
            </div>`;
    } else {
        let html = '';
       
        history.reverse().forEach(order => {
            html += `
            <div style="background: #fff; border: 1px solid #e0e0e0; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #eee; padding-bottom:8px; margin-bottom:10px;">
                    <strong style="color: #333;">${order.id}</strong>
                    <span style="font-size:0.8rem; color:#888;">${order.date}</span>
                </div>
                <div style="font-size: 0.9rem; color: #444; margin-bottom: 10px;">
                    ${order.items.map(item => `<div style="margin-bottom:2px;">• ${item.name} <span style="color:#888;">(x${item.qty})</span></div>`).join('')}
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #ddd; padding-top: 8px;">
                    <span style="font-size: 0.8rem; background: #e8f5e9; color: #2e7d32; padding: 3px 8px; border-radius: 4px;">${order.method}</span>
                    <strong style="color: #000;">IDR ${order.total.toLocaleString('id-ID')}</strong>
                </div>
            </div>`;
        });
        listContainer.innerHTML = html;
    }

    modal.style.display = 'flex';
    if (typeof feather !== 'undefined') feather.replace();
}

window.finishOrder = function() {
 
    let totalAmount = 0;
    cart.forEach(item => totalAmount += (item.price * item.qty));
    const orderId = document.getElementById('nota-id').innerText;
    const method = document.getElementById('nota-method').innerText;
    const date = document.getElementById('nota-date').innerText;

   
    const newOrder = {
        id: orderId,
        date: date,
        items: [...cart], 
        total: totalAmount,
        method: method
    };

  
    const currentHistory = JSON.parse(localStorage.getItem('techzone_order_history')) || [];
    currentHistory.push(newOrder);
    localStorage.setItem('techzone_order_history', JSON.stringify(currentHistory));

  
    alert("Pesanan Selesai! Riwayat tersimpan.");

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

window.closeUserModals = function() {
    const pModal = document.getElementById('profile-modal');
    const oModal = document.getElementById('orders-modal');
    if(pModal) pModal.style.display = 'none';
    if(oModal) oModal.style.display = 'none';
}

// =========================================
//       LOGIKA PENCARIAN TERPISAH 
// =========================================

document.addEventListener("DOMContentLoaded", () => {
   
    const heroInput = document.getElementById('hero-search-input'); 
    const heroBtn = document.getElementById('hero-search-btn');
    const catalogInput = document.getElementById('catalog-search-input'); 
    const catalogBtn = document.getElementById('catalog-search-btn');

    let originalIndexContent = "";
    const indexContainer = document.querySelector('#products .row');
    if (indexContainer) {
        originalIndexContent = indexContainer.innerHTML;
    }

    // -----------------------------------------------------
    //          LOGIKA PENCARIAN DI HOME (INDEX)
    // -----------------------------------------------------
    function searchOnHome() {
        if (!heroInput || !indexContainer) return;
        
        const query = heroInput.value.toLowerCase().trim();
        
        indexContainer.innerHTML = originalIndexContent;
        feather.replace(); 
        
        if (query === "") {
            updateAllButtons();
            return;
        }

        let foundCount = 0;
        const productCards = indexContainer.querySelectorAll('.product-card');

        productCards.forEach(card => {
            const title = card.querySelector('h3').innerText.toLowerCase();
            if (title.includes(query)) {
                card.style.display = 'block'; 
                foundCount++;
            } else {
                card.style.display = 'none'; 
            }
        });

        if (foundCount === 0) {
            indexContainer.innerHTML = `
            <div style="width:100%; text-align:center; padding:4rem 1rem; color:#888; grid-column: 1 / -1;">
                <i data-feather="search" style="width:60px; height:60px; margin-bottom:1rem; opacity:0.5;"></i>
                <h3 style="color:#fff; margin-bottom:0.5rem;">Yah, Produk Tidak Ditemukan</h3>
                <p style="margin-bottom:1.5rem;">Kami tidak menemukan produk dengan kata kunci "<strong>${query}</strong>" di halaman utama.</p>
                
                <button onclick="resetHomeSearch()" style="padding:10px 25px; background:var(--primary); color:#000; border:none; border-radius:50px; font-weight:bold; cursor:pointer;">
                    <i data-feather="refresh-ccw" style="width:14px; height:14px; margin-right:5px;"></i> Tampilkan Semua Produk
                </button>
            </div>`;
            feather.replace();
        }

        const productsSection = document.getElementById('products');
        if(productsSection) productsSection.scrollIntoView({ behavior: 'smooth' });
        
        updateAllButtons();
    }

    
    window.resetHomeSearch = function() {
        if(heroInput) heroInput.value = "";
        indexContainer.innerHTML = originalIndexContent;
        feather.replace();
        updateAllButtons();
    }


    if (heroBtn) { heroBtn.addEventListener('click', (e) => { e.preventDefault(); searchOnHome(); }); }
    if (heroInput) { heroInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); searchOnHome(); } }); }


    // -----------------------------------------------------
    //       LOGIKA PENCARIAN DI KATALOG (PRODUCTS)
    // -----------------------------------------------------
    function searchInCatalog() {
        if (!catalogInput) return;
        
        const query = catalogInput.value.toLowerCase().trim();
        const productCards = document.querySelectorAll('.product-item');
        let found = false;

        if(query === "") {
             productCards.forEach(card => card.style.display = 'block');
             return;
        }

        productCards.forEach(card => {
            const title = card.querySelector('h3').innerText.toLowerCase();
            if (title.includes(query)) {
                card.style.display = 'block';
                card.style.animation = 'none'; 
                card.offsetHeight; 
                card.style.animation = 'fadeUp 0.5s ease forwards';
                found = true;
            } else {
                card.style.display = 'none';
            }
        });
        
        if(found) {
            const grid = document.querySelector('.product-grid');
            if(grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    if (catalogBtn) { catalogBtn.addEventListener('click', (e) => { e.preventDefault(); searchInCatalog(); }); }
    if (catalogInput) { catalogInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); searchInCatalog(); } }); }
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
//           LOGIKA DROPDOWN PROFIL USER
// =======================================================

const userBtn = document.getElementById('user-btn');
const userDropdown = document.getElementById('user-dropdown');

if (userBtn && userDropdown) {
    
    userBtn.addEventListener('click', function(e) {
        e.preventDefault(); 
        userDropdown.classList.toggle('active');
    });


    document.addEventListener('click', function(e) {
        if (!userBtn.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.classList.remove('active');
        }
    });
}


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
   
    if (typeof updateCartBadge === "function") updateCartBadge(); 

    const cartContainer = document.querySelector('#cart-items-content');
    if(!cartContainer) return;

    let total = 0;
    let html = '';

   
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 1rem; text-align: center;">
                
                <i data-feather="shopping-cart" style="width: 80px; height: 80px; color: #555; margin-bottom: 1.5rem; opacity: 0.5;"></i>
                
                <h3 style="font-size: 1.5rem; margin: 0; color: inherit;">Keranjang Masih Kosong</h3>
                
            </div>
        `;
        updatePriceText(0);
        toggleCheckoutBtn(false); 
    } 
    
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
        toggleCheckoutBtn(true); 
    }
    
    
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
//           LOGIKA FILTER KATEGORI 
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productItems = document.querySelectorAll('.product-item');
    const backBtn = document.getElementById('back-to-home');

    function runFilter(categoryValue) {
    
        filterButtons.forEach(b => {
            b.classList.remove('active');
            if(b.getAttribute('data-filter') === categoryValue) {
                b.classList.add('active');
            }
        });


        productItems.forEach(item => {
          
            const itemCategory = item.getAttribute('data-category');
            const cleanCategory = itemCategory ? itemCategory.trim() : '';

            if (categoryValue === 'all' || cleanCategory === categoryValue) {
               
                item.style.display = 'block';
                item.style.animation = 'none';
                item.offsetHeight; 
                item.style.animation = 'fadeUp 0.5s ease forwards';
            } else {
                
                item.style.cssText = 'display: none !important;'; 
              
            }
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); 
            const categoryValue = btn.getAttribute('data-filter');
            runFilter(categoryValue);
        });
    });

    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');

    if (filterParam) {
      
        setTimeout(() => runFilter(filterParam), 100);
    }

    if(backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof transitionTo === "function") {
                transitionTo('index.html', 100);
            } else {
                window.location.href = 'index.html';
            }
        });
    }
});


// =======================================================
//           FITUR DETAIL PRODUK (POPUP SPEK)
// =======================================================

const detailModal = document.getElementById('product-detail-modal');

window.openDetail = function(element) {
    if(event) event.preventDefault();
    
    const title = element.getAttribute('data-title');
    const priceStr = element.getAttribute('data-price'); 
    const desc = element.getAttribute('data-desc');
    const specsRaw = element.getAttribute('data-specs'); 
    const imgSrc = element.getAttribute('data-img');

    document.getElementById('detail-title').innerText = title;
    document.getElementById('detail-price').innerText = `IDR ${priceStr}`;
    document.getElementById('detail-desc').innerText = desc;
    document.getElementById('detail-img').src = imgSrc;
    
    
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

  
    const modalCartBtn = document.getElementById('detail-cart-btn');
    
    
    const newBtn = modalCartBtn.cloneNode(true);
    modalCartBtn.parentNode.replaceChild(newBtn, modalCartBtn);

    newBtn.classList.add('add-to-cart-btn');

    newBtn.setAttribute('data-name', title);
    
    const cleanPrice = parseFloat(priceStr.replace(/\./g,''));
    newBtn.setAttribute('data-price', cleanPrice);

    if (typeof updateAllButtons === "function") {
        updateAllButtons(); 
    }

 
    detailModal.style.display = 'flex';
}


window.closeDetailModal = function() {
    if(detailModal) detailModal.style.display = 'none';
}


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

    const notaElement = document.querySelector('.nota-box');
    const btn = document.querySelector('.btn-download');
    
   
    if (!notaElement) {
        alert("Error: Elemen struk tidak ditemukan.");
        return;
    }

    const originalText = btn.innerHTML;
    btn.innerHTML = 'Sedang Menyimpan...';
    
   
    html2canvas(notaElement, { scale: 2 }).then(canvas => {
        
        const link = document.createElement('a');
        link.download = 'Struk-TechZone-' + Date.now() + '.jpg';
        link.href = canvas.toDataURL('image/jpeg');
        link.click();
      
        btn.innerHTML = originalText;

      
        setTimeout(() => {
            alert("Terima kasih! Struk berhasil disimpan.");
            
           
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
    const totalItems = cart.reduce((total, item) => total + item.qty, 0);

    if (badge) {
        badge.innerText = totalItems;
       
        if (totalItems > 0) {
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }
    }
}


