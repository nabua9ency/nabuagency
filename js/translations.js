

document.addEventListener("DOMContentLoaded", () => {
    const langSelect = document.getElementById("lang-select");
    const htmlElement = document.documentElement;

    
    const savedLang = localStorage.getItem("nabu_lang") || "ar";
    
    
    if (langSelect) {
        langSelect.value = savedLang;
    }

    
    loadLanguage(savedLang);

    
    if (langSelect) {
        langSelect.addEventListener("change", (e) => {
            const selectedLang = e.target.value;
            loadLanguage(selectedLang);
        });
    }

    
    function loadLanguage(lang) {
        fetch(`locales/${lang}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Could not load locales/${lang}.json`);
                }
                return response.json();
            })
            .then(translations => {
                
                htmlElement.setAttribute("lang", lang);
                if (lang === "ar") {
                    htmlElement.setAttribute("dir", "rtl");
                } else {
                    htmlElement.setAttribute("dir", "ltr");
                }

                
                localStorage.setItem("nabu_lang", lang);

                
                const elements = document.querySelectorAll("[data-i18n]");
                elements.forEach(el => {
                    const key = el.getAttribute("data-i18n");
                    if (translations[key]) {
                        
                        if (el.tagName.toLowerCase() === "input" && el.hasAttribute("placeholder")) {
                            el.setAttribute("placeholder", translations[key]);
                        } else {
                            el.textContent = translations[key];
                        }
                    }
                });

                
                const brandName = translations["brand_name"];
                if (brandName) {
                    const navbarBrand = document.getElementById("agency-name");
                    const footerBrand = document.getElementById("copyright-brand");
                    if (navbarBrand) navbarBrand.textContent = brandName;
                    if (footerBrand) footerBrand.textContent = brandName;
                }

                
                const langChangeEvent = new CustomEvent("languageChanged", { detail: { lang: lang } });
                window.dispatchEvent(langChangeEvent);
            })
            .catch(error => {
                console.error("Translation Error:", error);
            });
    }
});