document.addEventListener("DOMContentLoaded", () => {
    
    // --- Sidebar Logic ---
    const sidebar = document.getElementById("sidebar");
    const toggleSidebarBtn = document.getElementById("toggle-sidebar");
    const closeSidebarBtn = document.getElementById("close-sidebar");
    const overlay = document.getElementById("sidebar-overlay");

    const openSidebar = () => {
        sidebar.classList.add("active");
        overlay.classList.add("active");
        document.body.style.overflow = "hidden"; 
    };

    const closeSidebar = () => {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
        document.body.style.overflow = "auto"; 
    };

    if (toggleSidebarBtn) toggleSidebarBtn.addEventListener("click", openSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener("click", closeSidebar);
    if (overlay) overlay.addEventListener("click", closeSidebar);


    // --- Theme Toggle Logic ---
    const themeToggleBtn = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");
    const htmlElement = document.documentElement;
    
    const savedTheme = localStorage.getItem("nabu_theme") || "dark";
    htmlElement.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const currentTheme = htmlElement.getAttribute("data-theme");
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            
            htmlElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("nabu_theme", newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        if (theme === "dark") {
            themeIcon.classList.remove("fa-sun");
            themeIcon.classList.add("fa-moon");
        } else {
            themeIcon.classList.remove("fa-moon");
            themeIcon.classList.add("fa-sun");
        }
    }


    // --- Back to Top Logic ---
    const backToTopBtn = document.getElementById("back-to-top");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add("show");
        } else {
            backToTopBtn.classList.remove("show");
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth" 
            });
        });
    }


    // --- Copyright Year Logic ---
    const yearElement = document.getElementById("copyright-year");
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    // --- Hero Campus Carousel Logic ---
    const track = document.getElementById("carousel-track");
    const slides = document.querySelectorAll(".carousel-slide");
    const nextBtn = document.getElementById("next-slide");
    const prevBtn = document.getElementById("prev-slide");
    
    if (track && slides.length > 0) {
        let currentIndex = 0;

        const updateSlidePosition = () => {
            const isRTL = document.documentElement.dir === 'rtl';
            
            slides.forEach((slide, index) => {
                slide.classList.toggle("active", index === currentIndex);
            });

            if(isRTL) {
                track.style.transform = `translateX(${currentIndex * 100}%)`;
            } else {
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
            }
        };

        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
                updateSlidePosition();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
                updateSlidePosition();
            });
        }
        
        window.addEventListener('languageChanged', updateSlidePosition);
    }
    

    // --- 1. Infinite Scroll Reveal (Global Function) ---
    const revealOptions = {
        threshold: 0.15, 
        rootMargin: "0px 0px -50px 0px" 
    };

    // Attach it to the 'window' so majors.js can access it
    window.revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, revealOptions);

    window.observeReveals = function() {
        document.querySelectorAll('.reveal-on-scroll').forEach(el => {
            window.revealObserver.observe(el);
        });
    };

    // Run it immediately for static HTML elements
    window.observeReveals();
    
    
    // --- 2. Intersection Observer for Number Counters ---
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    const updateCount = () => {
                        const target = +counter.getAttribute('data-target');
                        const count = +counter.innerText.replace(/,/g, '');
                        const inc = Math.ceil(target / 80); 
                        
                        if (count < target) {
                            counter.innerText = (count + inc).toLocaleString();
                            setTimeout(updateCount, 30);
                        } else {
                            counter.innerText = target.toLocaleString();
                        }
                    };
                    updateCount();
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 }); 

    const statsSection = document.querySelector('.info-section');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }


    // --- 3. Testimonial Carousel Logic ---
    const testimTrack = document.getElementById('testimonial-track');
    const testimSlides = document.querySelectorAll('.testimonial-slide');
    const testimNextBtn = document.getElementById('next-testim');
    const testimPrevBtn = document.getElementById('prev-testim');
    
    if (testimTrack && testimSlides.length > 0) {
        let currentTestimIndex = 0;

        function updateTestimonialSlider() {
            // Check if site is RTL or LTR to slide in the correct direction
            const isRTL = document.documentElement.dir === 'rtl';
            const moveAmount = isRTL ? (currentTestimIndex * 100) : -(currentTestimIndex * 100);
            testimTrack.style.transform = `translateX(${moveAmount}%)`;
        }

        testimNextBtn.addEventListener('click', () => {
            currentTestimIndex = (currentTestimIndex + 1) % testimSlides.length;
            updateTestimonialSlider();
        });

        testimPrevBtn.addEventListener('click', () => {
            currentTestimIndex = (currentTestimIndex - 1 + testimSlides.length) % testimSlides.length;
            updateTestimonialSlider();
        });

        // Update direction if language changes dynamically
        window.addEventListener('languageChanged', updateTestimonialSlider);
    }
});