// The 'DOMContentLoaded' event ensures the script runs only after the HTML is fully loaded.
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. CONFIGURATION & INITIALIZATION
    // ==========================================================================
    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
    });

    // ==========================================================================
    // 2. DOM ELEMENT SELECTORS
    // ==========================================================================
    const body = document.body;
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const projectModal = document.getElementById('project-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalBody = document.getElementById('modal-body');

    // ==========================================================================
    // 3. MOBILE MENU LOGIC
    // ==========================================================================
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => mobileMenu.classList.toggle('is-open'));
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => mobileMenu.classList.remove('is-open'));
        });
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 992) mobileMenu.classList.remove('is-open');
        });
    }

    // ==========================================================================
    // 4. PROJECT DATA & GALLERY LOGIC
    // ==========================================================================
    
    // --- REAL PROJECT DATA ---
    const projects = [
        { 
            id: 1,
            title: "Expansive Covered Deck", 
            category: "Deck, Siding & Windows", 
            thumbnailUrl: 'images/Deck-Siding-Windows/covered-composite-deck-A/covered-composite-deck-A-27-final-exterior-view.jpg',
            description: "A beautiful and expansive composite deck with a covered section, perfect for all-weather outdoor living. This project features custom wood paneling on the walls and ceiling of the covered area, creating a warm and inviting space.",
            media: [
                { type: 'image', url: 'images/Deck-Siding-Windows/covered-composite-deck-A/covered-composite-deck-A-01-framing-start.jpg' },
                { type: 'image', url: 'images/Deck-Siding-Windows/covered-composite-deck-A/covered-composite-deck-A-05-decking-and-roof.jpg' },
                { type: 'image', url: 'images/Deck-Siding-Windows/covered-composite-deck-A/covered-composite-deck-A-17-finished-decking.jpg' },
                { type: 'image', url: 'images/Deck-Siding-Windows/covered-composite-deck-A/covered-composite-deck-A-26-finished-wood-ceiling.jpg' },
                { type: 'image', url: 'images/Deck-Siding-Windows/covered-composite-deck-A/covered-composite-deck-A-27-final-exterior-view.jpg' }
            ]
        },
        { 
            id: 2,
            title: "Composite Deck Remodel", 
            category: "Deck, Siding & Windows", 
            thumbnailUrl: 'images/Deck-Siding-Windows/composite-deck-B/composite-deck-B-15-finished-deck-full-view.jpg',
            description: "Complete demolition and rebuild of an old deck using modern, low-maintenance composite materials. This project features stylish decorative metal balusters for a unique and elegant look.",
            media: [
                { type: 'video', url: 'videos/Deck-Siding-Windows/Deck-Remodelation/Deck-Renovation-before.mp4' },
                { type: 'image', url: 'images/Deck-Siding-Windows/composite-deck-B/composite-deck-B-03-demolition-complete.jpg' },
                { type: 'image', url: 'images/Deck-Siding-Windows/composite-deck-B/composite-deck-B-11-decorative-railing.jpg' },
                { type: 'image', url: 'images/Deck-Siding-Windows/composite-deck-B/composite-deck-B-13-finished-deck-front.jpg' },
                { type: 'video', url: 'videos/Deck-Siding-Windows/Deck-Remodelation/Deck-Renovation-after.mp4' }
            ]
        },
        { 
            id: 3,
            title: "Full Kitchen Remodel", 
            category: "Kitchen & Bathroom", 
            thumbnailUrl: 'images/Kitchen-and-Bathroom/kitchen-remodel-A/kitchen-remodel-A-05-after.jpg',
            description: "A stunning kitchen transformation featuring custom white cabinetry with bold red interiors, expansive butcher block countertops, and a classic farmhouse sink. This remodel combines timeless style with modern functionality.",
            media: [
                { type: 'image', url: 'images/Kitchen-and-Bathroom/kitchen-remodel-A/kitchen-remodel-A-01-before.jpg' },
                { type: 'image', url: 'images/Kitchen-and-Bathroom/kitchen-remodel-A/kitchen-remodel-A-04-in-progress.jpg' },
                { type: 'image', url: 'images/Kitchen-and-Bathroom/kitchen-remodel-A/kitchen-remodel-A-06-sink-detail.jpg' },
                { type: 'image', url: 'images/Kitchen-and-Bathroom/kitchen-remodel-A/kitchen-remodel-A-05-after.jpg' }
            ]
        },
        { 
            id: 4,
            title: "Hardwood Floor Refinishing", 
            category: "Painting & Finishing", 
            thumbnailUrl: 'images/Painting-and-Finishing/floor-refinishing-B/floor-refinishing-B-01-hardwood.jpg',
            description: "Expert sanding, staining, and sealing of existing hardwood floors to restore their natural beauty and shine. This process removes scratches and wear, giving the entire room a fresh, updated look.",
            media: [
                { type: 'video', url: 'videos/Painting-and-Finishing/floor-refinishing-B/1.mp4' },
                { type: 'image', url: 'images/Painting-and-Finishing/floor-refinishing-B/floor-refinishing-B-01-hardwood.jpg' },
                { type: 'image', url: 'images/Painting-and-Finishing/floor-refinishing-B/floor-refinishing-B-06-hardwood-kitchen-area.jpg' }
            ]
        },
        {
            id: 5,
            title: "Modern Bathroom Updates",
            category: "Kitchen & Bathroom",
            thumbnailUrl: 'images/Kitchen-and-Bathroom/bathroom-remodel-B/bathroom-remodel-B-01-double-vanity.jpg',
            description: "This project showcases two distinct bathroom updates. One features a sleek grey vanity with a warm butcher block top, while the other includes a spacious double vanity with a butcher block counter and modern lighting fixtures.",
            media: [
                { type: 'video', url: 'videos/Repairs-and-Installation/bathroom-demolition-before.mp4' },
                { type: 'video', url: 'videos/Kitchen-and-Bathroom/shower-tiling-after.mp4' },
                { type: 'image', url: 'images/Kitchen-and-Bathroom/bathroom-remodel-B/bathroom-remodel-B-02-single-vanity.jpg' },
                { type: 'image', url: 'images/Kitchen-and-Bathroom/bathroom-remodel-B/bathroom-remodel-B-01-double-vanity.jpg' }
            ]
        },
         { 
            id: 6,
            title: "Multi-Level Wood Deck", 
            category: "Deck, Siding & Windows", 
            thumbnailUrl: 'images/Deck-Siding-Windows/wood-deck-C/wood-deck-C-09-finished-railing.jpg',
            description: "A complex, multi-level wooden deck built on a sloped backyard. This project required extensive framing and structural work to create a safe and beautiful outdoor space with integrated stairs.",
            media: [
                { type: 'image', url: 'images/Deck-Siding-Windows/wood-deck-C/wood-deck-C-01-before.jpg' },
                { type: 'image', url: 'images/Deck-Siding-Windows/wood-deck-C/wood-deck-C-02-framing-start.jpg' },
                { type: 'image', url: 'images/Deck-Siding-Windows/wood-deck-C/wood-deck-C-06-new-stairs.jpg' },
                { type: 'image', url: 'images/Deck-Siding-Windows/wood-deck-C/wood-deck-C-08-decking-installed.jpg' },
                { type: 'image', url: 'images/Deck-Siding-Windows/wood-deck-C/wood-deck-C-10-finished-high-view.jpg' }
            ]
        }
    ];
    
    const loadProjects = () => {
        const projectsGallery = document.getElementById('projects-gallery');
        const galleryLoader = document.getElementById('gallery-loader');
        if (!projectsGallery || !galleryLoader) return;
        galleryLoader.style.display = 'none';
        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.dataset.projectId = project.id;
            card.setAttribute('data-aos', 'fade-up');
            card.innerHTML = `
                <img src="${project.thumbnailUrl}" alt="${project.title}" class="project-card__image">
                <div class="project-card__overlay">
                    <h3 class="project-card__title">${project.title}</h3>
                    <p class="project-card__category">${project.category}</p>
                </div>
            `;
            projectsGallery.appendChild(card);
        });
    };

    // ==========================================================================
    // 5. MODAL LOGIC
    // ==========================================================================
    const populateModal = (project) => {
        let mediaSlides = '';
        project.media.forEach(item => {
            if (item.type === 'image') {
                mediaSlides += `<div class="modal-carousel__slide"><img src="${item.url}" alt="${project.title}"></div>`;
            }
            if (item.type === 'video') {
                mediaSlides += `<div class="modal-carousel__slide"><video controls playsinline src="${item.url}"></video></div>`;
            }
        });

        modalBody.innerHTML = `
            <div class="modal-carousel">
                <div class="modal-carousel__track">${mediaSlides}</div>
                ${project.media.length > 1 ? `
                    <button class="modal-carousel__btn modal-carousel__btn--prev"><i data-lucide="chevron-left"></i></button>
                    <button class="modal-carousel__btn modal-carousel__btn--next"><i data-lucide="chevron-right"></i></button>
                ` : ''}
            </div>
            <div class="modal-details">
                <h3 class="modal-details__title">${project.title}</h3>
                <p class="modal-details__category">${project.category}</p>
                <p class="modal-details__description">${project.description}</p>
            </div>
        `;
        lucide.createIcons();
        setupCarousel();
    };

    const setupCarousel = () => {
        const track = modalBody.querySelector('.modal-carousel__track');
        if (!track) return;
        const slides = Array.from(track.children);
        const nextButton = modalBody.querySelector('.modal-carousel__btn--next');
        const prevButton = modalBody.querySelector('.modal-carousel__btn--prev');
        if (!nextButton) return;
        const slideWidth = slides[0].getBoundingClientRect().width;
        let currentIndex = 0;
        const moveToSlide = (targetIndex) => {
            track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
            currentIndex = targetIndex;
        };
        nextButton.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            moveToSlide(nextIndex);
        });
        prevButton.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            moveToSlide(prevIndex);
        });
    };

    const openModal = (projectId) => {
        const project = projects.find(p => p.id === projectId);
        if (project) {
            populateModal(project);
            projectModal.classList.add('is-visible');
            body.classList.add('modal-open');
        }
    };

    const closeModal = () => {
        projectModal.classList.remove('is-visible');
        body.classList.remove('modal-open');
        modalBody.innerHTML = '';
    };

    const projectsGallery = document.getElementById('projects-gallery');
    if (projectsGallery) {
        projectsGallery.addEventListener('click', e => {
            const card = e.target.closest('.project-card');
            if (card && card.dataset.projectId) {
                openModal(parseInt(card.dataset.projectId));
            }
        });
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (projectModal) {
        projectModal.addEventListener('click', e => {
            if (e.target === projectModal) closeModal();
        });
    }
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && projectModal.classList.contains('is-visible')) {
            closeModal();
        }
    });

    // ==========================================================================
    // 6. OTHER LOGIC (Reviews, etc.)
    // ==========================================================================
    const loadReviews = () => {
        const reviewsContainer = document.getElementById('reviews-container');
        const reviewsLoader = document.getElementById('reviews-loader');
        if(reviewsLoader) reviewsLoader.style.display = 'none';
        // You can add real reviews here later
    };
    
    // NOTE: The contact form logic has been removed from JS.
    // It is now handled directly by the form's `action` attribute in the HTML,
    // which will open the user's default email client.

    // ==========================================================================
    // 7. INITIALIZATION
    // ==========================================================================
    const init = () => {
        document.getElementById('year').textContent = new Date().getFullYear();
        loadProjects();
        loadReviews();
        lucide.createIcons();
    };

    init();
});
