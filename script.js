// Initialize Lucide icons
lucide.createIcons();

// Add scroll effect to navbar
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.padding = '0.5rem 2rem';
        navbar.style.background = 'rgba(7, 7, 7, 0.95)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
    } else {
        navbar.style.padding = '1rem 2rem';
        navbar.style.background = 'rgba(7, 7, 7, 0.85)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .step, .booking-content h2, .setup-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
});

// Load Gallery
async function loadGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    if (!galleryGrid) return;

    try {
        const res = await fetch('/api/gallery');
        if (!res.ok) throw new Error('API Error');
        const data = await res.json();
        
        if (data.length === 0) {
            galleryGrid.innerHTML = '<p style="text-align:center; grid-column: 1 / -1; color: var(--text-muted);">Todavía no hay fotos de eventos. ¡Pronto subiremos!</p>';
            return;
        }

        galleryGrid.innerHTML = data.map(item => {
            if (item.type === 'video') {
                return `
                <div class="gallery-item">
                    <video src="${item.url}" muted loop autoplay playsinline></video>
                </div>`;
            } else {
                return `
                <div class="gallery-item">
                    <img src="${item.url}" alt="Evento El Viejo Gamer" loading="lazy">
                </div>`;
            }
        }).join('');
    } catch (e) {
        galleryGrid.innerHTML = '<p style="text-align:center; grid-column: 1 / -1; color: #ef4444;">No se pudo cargar la galería estática.</p>';
    }
}
document.addEventListener('DOMContentLoaded', loadGallery);
