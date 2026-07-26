

document.addEventListener("DOMContentLoaded", () => {
    
    
    
    
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


    
    
    
    const yearElement = document.getElementById("copyright-year");
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    
    
    
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
});