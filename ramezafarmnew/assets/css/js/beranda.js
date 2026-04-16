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


/* ================= TESTIMONI ================= */

        // Open Review Modal
        function openReviewModal() {
            document.getElementById('reviewModal').classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Close Review Modal
        function closeReviewModal() {
            document.getElementById('reviewModal').classList.remove('active');
            document.body.style.overflow = 'auto';
            document.getElementById('reviewForm').reset();
            document.getElementById('imagePreview').classList.remove('active');
            document.getElementById('fileName').textContent = 'Belum ada file dipilih';
            document.getElementById('charCount').textContent = '0';
            clearErrors();
        }

        // Close Success Modal
        function closeSuccessModal() {
            document.getElementById('successModal').classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        // Close modal when clicking overlay
        document.getElementById('reviewModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeReviewModal();
            }
        });

        document.getElementById('successModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeSuccessModal();
            }
        });

        // Preview Image
        function previewImage(input) {
            const preview = document.getElementById('imagePreview');
            const fileName = document.getElementById('fileName');
            
            if (input.files && input.files[0]) {
                const file = input.files[0];
                
                // Validate file size (2MB)
                if (file.size > 2 * 1024 * 1024) {
                    alert('Ukuran file terlalu besar! Maksimal 2MB');
                    input.value = '';
                    return;
                }
                
                // Validate file type
                if (!file.type.match('image.*')) {
                    alert('File harus berupa gambar!');
                    input.value = '';
                    return;
                }
                
                fileName.textContent = file.name;
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                    preview.classList.add('active');
                };
                reader.readAsDataURL(file);
            }
        }

        // Character Counter
        document.getElementById('reviewText').addEventListener('input', function() {
            const charCount = this.value.length;
            document.getElementById('charCount').textContent = charCount;
            
            if (charCount > 500) {
                this.value = this.value.substring(0, 500);
                document.getElementById('charCount').textContent = 500;
            }
        });

        // Star Rating Text Update
        document.querySelectorAll('input[name="rating"]').forEach(radio => {
            radio.addEventListener('change', function() {
                const ratingText = document.getElementById('ratingText');
                const ratings = {
                    '5': 'Sangat Puas! ⭐⭐⭐⭐⭐',
                    '4': 'Puas ⭐⭐⭐⭐',
                    '3': 'Cukup ⭐⭐⭐',
                    '2': 'Kurang ⭐⭐',
                    '1': 'Tidak Puas ⭐'
                };
                ratingText.textContent = ratings[this.value];
            });
        });

        // Form Validation
        function clearErrors() {
            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
            document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(el => {
                el.style.borderColor = '#e5e7eb';
            });
        }

        function showError(fieldId, message) {
            const errorEl = document.getElementById(fieldId + 'Error');
            const inputEl = document.getElementById(fieldId);
            if (errorEl) errorEl.textContent = message;
            if (inputEl) inputEl.style.borderColor = '#ef4444';
        }

        function validateForm() {
            clearErrors();
            let isValid = true;

            // Validate Name
            const name = document.getElementById('reviewerName').value.trim();
            if (name.length < 3) {
                showError('reviewerName', 'Nama minimal 3 karakter');
                isValid = false;
            }

            // Validate Role
            const role = document.getElementById('reviewerRole').value.trim();
            if (!role) {
                showError('reviewerRole', 'Pekerjaan/Status wajib diisi');
                isValid = false;
            }

            // Validate Email
            const email = document.getElementById('reviewerEmail').value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showError('reviewerEmail', 'Format email tidak valid');
                isValid = false;
            }

            // Validate Phone (if filled)
            const phone = document.getElementById('reviewerPhone').value.trim();
            if (phone && !/^[0-9]{10,13}$/.test(phone)) {
                showError('reviewerPhone', 'Nomor telepon harus 10-13 digit');
                isValid = false;
            }

            // Validate Rating
            const rating = document.querySelector('input[name="rating"]:checked');
            if (!rating) {
                showError('rating', 'Pilih rating Anda');
                isValid = false;
            }

            // Validate Product
            const product = document.getElementById('productReviewed').value;
            if (!product) {
                showError('productReviewed', 'Pilih produk yang direview');
                isValid = false;
            }

            // Validate Review Text
            const reviewText = document.getElementById('reviewText').value.trim();
            if (reviewText.length < 20) {
                showError('reviewText', 'Ulasan minimal 20 karakter');
                isValid = false;
            }

            return isValid;
        }

        // Form Submit Handler
        document.getElementById('reviewForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validateForm()) {
                return;
            }

            const submitBtn = document.getElementById('submitBtn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoader = submitBtn.querySelector('.btn-loader');
            
            // Show loading state
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'flex';

            // Prepare form data
            const formData = new FormData(this);

            try {
                // GANTI URL INI DENGAN ENDPOINT BACKEND ANDA
                const response = await fetch('/api/submit-review', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    // Success
                    closeReviewModal();
                    document.getElementById('successModal').classList.add('active');
                    this.reset();
                    document.getElementById('charCount').textContent = '0';
                    document.getElementById('imagePreview').classList.remove('active');
                    document.getElementById('fileName').textContent = 'Belum ada file dipilih';
                } else {
                    // Error from server
                    const error = await response.json();
                    alert('Terjadi kesalahan: ' + (error.message || 'Gagal mengirim ulasan'));
                }
            } catch (error) {
                // Network error
                console.error('Error:', error);
                alert('Terjadi kesalahan koneksi. Silakan coba lagi.');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                btnText.style.display = 'inline';
                btnLoader.style.display = 'none';
            }
        });

        // Helpful button interaction
        document.addEventListener('DOMContentLoaded', function() {
            const helpfulButtons = document.querySelectorAll('.helpful-btn');
            helpfulButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const countSpan = this.querySelector('span:last-child');
                    const currentCount = parseInt(countSpan.textContent.match(/\d+/)[0]);
                    countSpan.textContent = `Membantu (${currentCount + 1})`;
                    
                    this.style.background = '#fef3c7';
                    this.style.borderColor = '#fbbf24';
                    this.style.color = '#92400e';
                    
                    this.disabled = true;
                    this.style.cursor = 'default';
                });
            });
        });