/* ================= PAGE TRANSITION ================= */
window.addEventListener("pageshow", () => {
    const transition = document.getElementById("page-transition");
    if(!transition) return;

    document.body.classList.add("fade-in");

    setTimeout(()=>{
        transition.style.opacity = "0";
        transition.style.pointerEvents = "none";
    }, 500);
});


/* ================= ABOUT REVEAL ================= */
window.addEventListener("load", () => {
    const reveals = document.querySelectorAll('.about-text, .about-image');

    reveals.forEach(el => {
        el.classList.add('show');
    });
});
function revealOnScroll(){
    const elements = document.querySelectorAll('.about-text, .about-image');

    elements.forEach(el=>{
        const top = el.getBoundingClientRect().top;
        const trigger = window.innerHeight * 0.85;

        if(top < trigger){
            el.classList.add("show");
        }
    });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

/* ================= IMAGE FLIP ================= */
const front = document.querySelector(".img-front");
const back  = document.querySelector(".img-back");

if(front && back){
    setInterval(()=>{
        front.classList.toggle("img-front");
        front.classList.toggle("img-back");

        back.classList.toggle("img-front");
        back.classList.toggle("img-back");
    }, 3500);
}


/* ================= PRODUK SCROLL ANIMATION ================= */
const cards = document.querySelectorAll('.produk-card');

if(cards.length){
    window.addEventListener('scroll', () => {
        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            if(cardTop < window.innerHeight - 100){
                card.style.opacity = 1;
                card.style.transform = "translateY(0)";
            }
        });
    });
}


/* ================= PRODUK SLIDER (AUTO, INFINITE + NAV) ================= */
const produkSlider = document.querySelector('.produk-slider');
const produkTrack = document.querySelector('.produk-track');
const produkItems = document.querySelectorAll('.produk-track .produk-item');
const produkNextBtn = document.querySelector('.produk-nav-btn--next');
const produkPrevBtn = document.querySelector('.produk-nav-btn--prev');

if (produkSlider && produkTrack && produkItems.length > 1) {
    const TRANSITION_MS = 850;
    const INTERVAL_MS = 3600;

    // Hitung step geser berdasarkan jarak nyata antar card (lebih halus & adaptif terhadap CSS)
    const computeStepWidth = () => {
        const first = produkItems[0];
        const second = produkItems[1];

        if (first && second) {
            const firstRect = first.getBoundingClientRect();
            const secondRect = second.getBoundingClientRect();
            const step = secondRect.left - firstRect.left;
            return step > 0 ? step : firstRect.width;
        }

        return first ? first.getBoundingClientRect().width : 0;
    };

    let itemWidth = computeStepWidth();
    let isAnimating = false;
    let autoTimer;

    // Matikan animasi CSS bawaan supaya tidak tabrakan dengan JS
    produkTrack.style.animation = 'none';

    window.addEventListener('resize', () => {
        itemWidth = computeStepWidth();
    });

    const slideNext = () => {
        if (isAnimating) return;
        isAnimating = true;

        const firstItem = produkTrack.firstElementChild;
        if (!firstItem) {
            isAnimating = false;
            return;
        }

        produkTrack.style.transition = `transform ${TRANSITION_MS}ms cubic-bezier(.25,.8,.25,1)`;
        produkTrack.style.transform = `translateX(-${itemWidth}px)`;

        const handleTransitionEnd = () => {
            produkTrack.style.transition = 'none';
            produkTrack.appendChild(firstItem);
            produkTrack.style.transform = 'translateX(0)';
            isAnimating = false;
        };

        produkTrack.addEventListener('transitionend', handleTransitionEnd, { once: true });
    };

    const slidePrev = () => {
        if (isAnimating) return;
        isAnimating = true;

        const lastItem = produkTrack.lastElementChild;
        if (!lastItem) {
            isAnimating = false;
            return;
        }

        // Siapkan posisi awal dengan kartu terakhir dipindah ke depan
        produkTrack.style.transition = 'none';
        produkTrack.prepend(lastItem);
        produkTrack.style.transform = `translateX(-${itemWidth}px)`;

        // Force reflow supaya browser menangkap posisi awal sebelum animasi
        void produkTrack.offsetWidth;

        produkTrack.style.transition = `transform ${TRANSITION_MS}ms cubic-bezier(.25,.8,.25,1)`;
        produkTrack.style.transform = 'translateX(0)';

        const handleTransitionEnd = () => {
            produkTrack.style.transition = 'none';
            isAnimating = false;
        };

        produkTrack.addEventListener('transitionend', handleTransitionEnd, { once: true });
    };

    const startAuto = () => {
        stopAuto();
        autoTimer = setInterval(slideNext, INTERVAL_MS);
    };

    const stopAuto = () => {
        if (autoTimer) {
            clearInterval(autoTimer);
            autoTimer = null;
        }
    };

    // Auto slide
    startAuto();

    // Pause saat hover, lanjut lagi saat mouse keluar
    produkSlider.addEventListener('mouseenter', stopAuto);
    produkSlider.addEventListener('mouseleave', startAuto);

    // Tombol navigasi
    if (produkNextBtn) {
        produkNextBtn.addEventListener('click', () => {
            stopAuto();
            slideNext();
            startAuto();
        });
    }

    if (produkPrevBtn) {
        produkPrevBtn.addEventListener('click', () => {
            stopAuto();
            slidePrev();
            startAuto();
        });
    }
}


/* ================= HUBUNGI KAMI - FORM SUBMIT ================= */
function sendToWhatsApp() {
    const name    = document.getElementById('cfName').value.trim();
    const phone   = document.getElementById('cfPhone').value.trim();
    const email   = document.getElementById('cfEmail').value.trim();

    // Helper: highlight field error
    const setError = (id) => {
        const el = document.getElementById(id);
        el.style.borderColor = '#ef4444';
        el.style.boxShadow  = '0 0 0 3px rgba(239,68,68,0.15)';
        setTimeout(() => {
            el.style.borderColor = '';
            el.style.boxShadow   = '';
        }, 2500);
    };

    // Reset border semua field
    ['cfName','cfPhone','cfEmail'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.borderColor = '';
            el.style.boxShadow   = '';
        }
    });

    // Validasi satu per satu
    if (!name) {
        Swal.fire({
            icon: 'warning',
            title: 'Nama belum diisi!',
            text: 'Mohon masukkan nama lengkap Anda.',
            confirmButtonColor: '#1f6fd6',
            confirmButtonText: 'Oke',
        });
        setError('cfName');
        document.getElementById('cfName').focus();
        return;
    }

    if (!phone || !/^[0-9]{8,13}$/.test(phone.replace(/-/g,''))) {
        Swal.fire({
            icon: 'warning',
            title: 'Nomor WA tidak valid!',
            text: 'Masukkan nomor WhatsApp yang benar (tanpa +62).',
            confirmButtonColor: '#1f6fd6',
            confirmButtonText: 'Oke',
        });
        setError('cfPhone');
        document.getElementById('cfPhone').focus();
        return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        Swal.fire({
            icon: 'warning',
            title: 'Email tidak valid!',
            text: 'Masukkan alamat email yang benar.',
            confirmButtonColor: '#1f6fd6',
            confirmButtonText: 'Oke',
        });
        setError('cfEmail');
        document.getElementById('cfEmail').focus();
        return;
    }

    /* ── MODE TEST: langsung SweetAlert sukses ── */
    Swal.fire({
        icon: 'success',
        title: 'Pesan Terkirim! 🎉',
        html: `
            <p style="margin:0 0 10px">Terima kasih, <strong>${name}</strong>!</p>
            <p style="font-size:14px;color:#6b7280;margin:0">
                Kami akan segera menghubungi Anda melalui<br>
                WhatsApp atau Email yang Anda daftarkan.
            </p>
        `,
        confirmButtonColor: '#1f6fd6',
        confirmButtonText: '✓ Oke, Terima Kasih!',
        timer: 6000,
        timerProgressBar: true,
    }).then(() => {
        // Reset form setelah alert ditutup
        document.getElementById('cfName').value = '';
        document.getElementById('cfPhone').value = '';
        document.getElementById('cfEmail').value = '';
    });
}

// Event listener untuk form submit
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            sendToWhatsApp();
        });
    }
});
