document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            nav.classList.toggle('active');

            // Icon toggle
            const icon = mobileToggle.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('ri-menu-line');
                icon.classList.add('ri-close-line');
            } else {
                icon.classList.remove('ri-close-line');
                icon.classList.add('ri-menu-line');
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Close mobile menu if open
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('ri-close-line');
                icon.classList.add('ri-menu-line');
            }

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
            header.style.padding = '15px 0';
        } else {
            header.style.boxShadow = '0 1px 0 rgba(0,0,0,0.05)';
            header.style.padding = '20px 0';
        }
    });


    // Theme Toggle Logic with System and Time Detection
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    // Function to get preferred theme based on system and time
    function getPreferredTheme() {
        // Check if user has a saved preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }

        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            return 'dark';
        }

        // Check time of day (6 PM to 6 AM = dark mode)
        const hour = new Date().getHours();
        if (hour >= 18 || hour < 6) {
            return 'dark';
        }

        return 'light';
    }

    // Set initial theme
    const initialTheme = getPreferredTheme();
    document.documentElement.setAttribute('data-theme', initialTheme);
    if (initialTheme === 'dark') {
        themeIcon.classList.replace('ri-moon-line', 'ri-sun-line');
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            if (newTheme === 'dark') {
                themeIcon.classList.replace('ri-moon-line', 'ri-sun-line');
            } else {
                themeIcon.classList.replace('ri-sun-line', 'ri-moon-line');
            }
        }
    });

    themeToggle.addEventListener('click', () => {
        let theme = 'light';
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            themeIcon.classList.replace('ri-sun-line', 'ri-moon-line');
        } else {
            theme = 'dark';
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.classList.replace('ri-moon-line', 'ri-sun-line');
        }
        localStorage.setItem('theme', theme);
    });

    // Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Custom Circular Cursor for Hero Section
    const hero = document.querySelector('.hero');
    let customCursor = null;

    if (hero) {
        // Crear el cursor personalizado
        customCursor = document.createElement('div');

        // Función para actualizar el color según el tema
        const updateCursorColor = () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const bgColor = isDark ? '#FFFFFF' : '#5753a3';
            const pulseAnimation = isDark ? 'pulse-wave-dark 2s infinite' : 'pulse-wave 2s infinite';
            customCursor.style.backgroundColor = bgColor;
            customCursor.style.animation = pulseAnimation;
        };

        customCursor.className = 'custom-cursor';
        customCursor.style.cssText = `
            width: 24px;
            height: 24px;
            background-color: #5753a3;
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.15s ease, opacity 0.15s ease, background-color 0.5s ease;
            opacity: 0;
            transform: translate(-50%, -50%);
            animation: pulse-wave 2s infinite;
        `;
        document.body.appendChild(customCursor);

        // Actualizar color inicial
        updateCursorColor();

        // Observar cambios de tema
        const themeObserver = new MutationObserver(updateCursorColor);
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        // Actualizar posición del cursor
        hero.addEventListener('mousemove', (e) => {
            customCursor.style.left = e.clientX + 'px';
            customCursor.style.top = e.clientY + 'px';
            customCursor.style.opacity = '1';
        });

        // Ocultar cuando sale del hero
        hero.addEventListener('mouseleave', () => {
            customCursor.style.opacity = '0';
        });

        // Efecto de click (hacer más pequeño temporalmente)
        hero.addEventListener('mousedown', () => {
            customCursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
        });

        hero.addEventListener('mouseup', () => {
            customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    }

    // Canvas Blur Control - Simple y funcional
    const canvas = document.getElementById('bg-canvas');
    const heroSection = document.querySelector('.hero');

    if (canvas && heroSection) {
        // Reducir blur cuando el mouse está sobre el hero
        heroSection.addEventListener('mouseenter', () => {
            canvas.style.filter = 'blur(16px)';
        });

        // Restaurar blur cuando el mouse sale del hero
        heroSection.addEventListener('mouseleave', () => {
            canvas.style.filter = 'blur(8px)';
        });
    }

    // Service Tabs Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabDescriptions = document.querySelectorAll('.tab-description');

    if (tabBtns.length > 0 && tabContents.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons, contents, and descriptions
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                tabDescriptions.forEach(d => d.classList.remove('active'));

                // Add active class to clicked button
                btn.classList.add('active');

                // Show corresponding content
                const tabId = btn.getAttribute('data-tab');
                const content = document.getElementById(`${tabId}-content`);
                const description = document.getElementById(`${tabId}-description`);

                if (content) {
                    content.classList.add('active');
                }

                if (description) {
                    description.classList.add('active');
                }
            });
        });
    }
    // Message Character Counter
    const messageInput = document.getElementById('message');
    const charCountDisplay = document.querySelector('.char-count');

    if (messageInput && charCountDisplay) {
        messageInput.addEventListener('input', function () {
            const currentLength = this.value.length;
            const maxLength = this.getAttribute('maxlength') || 150;
            charCountDisplay.textContent = `${currentLength}/${maxLength}`;
        });
    }

    // Form Validation - Enable submit button only when all fields are filled and reCAPTCHA is completed
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm && submitBtn) {
        const nameInput = document.getElementById('name');
        const phoneInput = document.getElementById('phone');
        const emailInput = document.getElementById('email');
        const messageTextarea = document.getElementById('message');

        // Function to check if all fields are valid
        function validateForm() {
            const isNameValid = nameInput && nameInput.value.trim() !== '';
            const isPhoneValid = phoneInput && phoneInput.value.trim() !== '';
            const isEmailValid = emailInput && emailInput.value.trim() !== '' && emailInput.validity.valid;
            const isMessageValid = messageTextarea && messageTextarea.value.trim() !== '';

            // Check if reCAPTCHA is completed
            const recaptchaResponse = grecaptcha && grecaptcha.getResponse ? grecaptcha.getResponse() : '';
            const isRecaptchaValid = recaptchaResponse.length > 0;

            // Enable button only if all fields are valid AND reCAPTCHA is completed
            if (isNameValid && isPhoneValid && isEmailValid && isMessageValid && isRecaptchaValid) {
                submitBtn.disabled = false;
            } else {
                submitBtn.disabled = true;
            }
        }

        // Add event listeners to all form inputs
        if (nameInput) nameInput.addEventListener('input', validateForm);
        if (phoneInput) phoneInput.addEventListener('input', validateForm);
        if (emailInput) emailInput.addEventListener('input', validateForm);
        if (messageTextarea) messageTextarea.addEventListener('input', validateForm);

        // Restrict name input to letters and spaces only
        if (nameInput) {
            nameInput.addEventListener('input', function (e) {
                this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
            });
        }

        // Restrict phone input to numbers only
        if (phoneInput) {
            phoneInput.addEventListener('input', function (e) {
                this.value = this.value.replace(/[^0-9]/g, '');
            });
        }

        // reCAPTCHA callback
        window.onRecaptchaSuccess = function () {
            validateForm();
        };

        // Add callback to reCAPTCHA
        if (typeof grecaptcha !== 'undefined') {
            grecaptcha.ready(function () {
                validateForm();
            });
        }
    }

    // Mobile Carousel Functionality
    function initCarousel(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        // Check if we're on mobile
        if (window.innerWidth > 768) return;

        const items = container.children;
        if (items.length === 0) return;

        // Add smooth scroll behavior
        container.style.scrollBehavior = 'smooth';

        // Optional: Add scroll indicators
        let isScrolling;
        container.addEventListener('scroll', () => {
            window.clearTimeout(isScrolling);
            isScrolling = setTimeout(() => {
                // Scroll ended - could add visual feedback here
            }, 66);
        });
    }

    // Initialize carousels for different sections
    initCarousel('.stats-grid');
    initCarousel('.products-grid');
    initCarousel('.clients-grid');

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initCarousel('.stats-grid');
            initCarousel('.products-grid');
            initCarousel('.clients-grid');
            initClientsPagination(); // Re-init pagination on resize
        }, 250);
    });

    // Clients Pagination System for Mobile
    function initClientsPagination() {
        // Only run on mobile
        if (window.innerWidth > 768) return;

        const clientsGrid = document.querySelector('.clients-grid');
        const paginationContainer = document.querySelector('.clients-pagination');

        if (!clientsGrid || !paginationContainer) return;

        const allRows = Array.from(clientsGrid.querySelectorAll('.client-row'));
        const logosPerPage = 9; // 3x3 grid
        const totalLogos = allRows.reduce((sum, row) => sum + row.children.length, 0);
        const totalPages = Math.ceil(totalLogos / logosPerPage);

        let currentPage = 0;
        let autoRotateInterval = null;
        let pauseTimeout = null;

        // Create pagination dots
        paginationContainer.innerHTML = '';
        paginationContainer.style.display = 'flex';

        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('div');
            dot.className = 'pagination-dot';
            if (i === 0) dot.classList.add('active');

            dot.addEventListener('click', () => {
                goToPage(i);
                pauseAutoRotate();
            });

            paginationContainer.appendChild(dot);
        }

        const dots = paginationContainer.querySelectorAll('.pagination-dot');

        // Collect all logos into a flat array
        const allLogos = [];
        allRows.forEach(row => {
            Array.from(row.children).forEach(logo => {
                allLogos.push(logo.cloneNode(true));
            });
        });

        // Clear existing rows and create new pages
        clientsGrid.innerHTML = '';

        for (let page = 0; page < totalPages; page++) {
            const pageRow = document.createElement('div');
            pageRow.className = 'client-row';
            if (page === 0) pageRow.classList.add('active-page');

            const startIdx = page * logosPerPage;
            const endIdx = Math.min(startIdx + logosPerPage, allLogos.length);

            for (let i = startIdx; i < endIdx; i++) {
                pageRow.appendChild(allLogos[i].cloneNode(true));
            }

            clientsGrid.appendChild(pageRow);
        }

        const pageRows = clientsGrid.querySelectorAll('.client-row');

        function goToPage(pageIndex) {
            currentPage = pageIndex;

            // Update rows
            pageRows.forEach((row, idx) => {
                row.classList.toggle('active-page', idx === pageIndex);
            });

            // Update dots
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === pageIndex);
            });
        }

        function nextPage() {
            currentPage = (currentPage + 1) % totalPages;
            goToPage(currentPage);
        }

        function startAutoRotate() {
            stopAutoRotate();
            autoRotateInterval = setInterval(nextPage, 4000); // 4 seconds
        }

        function stopAutoRotate() {
            if (autoRotateInterval) {
                clearInterval(autoRotateInterval);
                autoRotateInterval = null;
            }
        }

        function pauseAutoRotate() {
            stopAutoRotate();

            // Clear any existing pause timeout
            if (pauseTimeout) {
                clearTimeout(pauseTimeout);
            }

            // Resume after 5 seconds
            pauseTimeout = setTimeout(() => {
                startAutoRotate();
            }, 5000);
        }

        // Start auto-rotation
        startAutoRotate();

        // Pause on hover (optional enhancement)
        clientsGrid.addEventListener('mouseenter', stopAutoRotate);
        clientsGrid.addEventListener('mouseleave', startAutoRotate);
    }

    // Initialize clients pagination
    initClientsPagination();
});
