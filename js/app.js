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
    
    let allProjectsData = []; // To store projects globally after fetching

    const loadProjects = () => {
        const projectsGallery = document.getElementById('projects-gallery');
        const galleryLoader = document.getElementById('gallery-loader');
        if (!projectsGallery || !galleryLoader) return;

        // Fetch projects from the JSON file
        fetch('projects.json?v=' + new Date().getTime()) // Appending timestamp to avoid cache
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(projects => {
                allProjectsData = projects.sort((a, b) => b.id - a.id); // Store and sort projects, newest first
                galleryLoader.style.display = 'none';
                
                allProjectsData.forEach(project => {
                    const card = document.createElement('div');
                    card.className = 'project-card';
                    card.dataset.projectId = project.id;
                    card.setAttribute('data-aos', 'fade-up');
                    card.innerHTML = `
                        <img src="${project.thumbnailUrl}" alt="${project.title}" class="project-card__image" onerror="this.style.display='none'">
                        <div class="project-card__overlay">
                            <h3 class="project-card__title">${project.title}</h3>
                            <p class="project-card__category">${project.category}</p>
                        </div>
                    `;
                    projectsGallery.appendChild(card);
                });
            })
            .catch(error => {
                console.error('Error fetching projects:', error);
                galleryLoader.textContent = 'Could not load projects.';
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
        const carousel = modalBody.querySelector('.modal-carousel');
        const track = modalBody.querySelector('.modal-carousel__track');
        if (!carousel || !track) return;

        const slides = Array.from(track.children);
        const nextButton = modalBody.querySelector('.modal-carousel__btn--next');
        const prevButton = modalBody.querySelector('.modal-carousel__btn--prev');
        
        if (slides.length <= 1) {
            if(nextButton) nextButton.style.display = 'none';
            if(prevButton) prevButton.style.display = 'none';
            return;
        }

        let currentIndex = 0;

        const moveToSlide = (targetIndex) => {
            // La clave está aquí: Usamos un porcentaje para el movimiento,
            // que es mucho más preciso que los píxeles calculados.
            track.style.transform = 'translateX(-' + (targetIndex * 100) + '%)';
            currentIndex = targetIndex;
        };

        // Re-calculamos el tamaño al cambiar el tamaño de la ventana para responsive
        window.addEventListener('resize', () => moveToSlide(currentIndex));

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
        const project = allProjectsData.find(p => p.id === projectId);
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