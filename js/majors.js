/**
 * NABU Majors & Departments Logic
 * Fetches JSON data, renders cards, filters by search, and generates auto-WhatsApp messages.
 */

document.addEventListener("DOMContentLoaded", () => {
    const majorsContainer = document.getElementById("majors-container");
    const searchInput = document.getElementById("major-search");
    
    // Only run if we are on the majors page
    if (!majorsContainer) return;

    let allMajors = [];
    let currentLanguage = document.documentElement.getAttribute('lang') || 'ar';
    
    // NEW EGYPTIAN NUMBER (Note: The API requires no '+' symbol)
    const whatsappNumber = "201068200950"; 

    // 1. Fetch the data from the JSON file
    fetch('data/departments.json')
        .then(response => {
            if (!response.ok) throw new Error("Could not load departments data.");
            return response.json();
        })
        .then(data => {
            allMajors = data;
            renderMajors(allMajors);
        })
        .catch(error => {
            console.error("Error fetching majors:", error);
            majorsContainer.innerHTML = `<p style="text-align:center; padding: 2rem;">عذراً، لم نتمكن من تحميل التخصصات. يرجى المحاولة لاحقاً.</p>`;
        });


    // 2. Render the Major Cards
    function renderMajors(majorsList) {
        majorsContainer.innerHTML = ""; // Clear current cards

        if (majorsList.length === 0) {
            majorsContainer.innerHTML = `<p style="text-align:center; padding: 2rem;">لا توجد تخصصات مطابقة لبحثك.</p>`;
            return;
        }

        majorsList.forEach(major => {
            const majorTitle = major.title[currentLanguage] || major.title['en'];

            const card = document.createElement("div");
            card.className = "major-card glass-card";
            
            // CHANGED BACK TO <button> TO TRIGGER THE AUTO-MESSAGE
            card.innerHTML = `
                <div class="major-header">
                    <h3 class="major-title">${majorTitle}</h3>
                    <span class="major-badge">${major.degree === 'bachelor' ? getLocalizedString('bachelor') : getLocalizedString('associate')}</span>
                </div>
                <div class="major-details">
                    <p><i class="fa-regular fa-clock"></i> <span>${getLocalizedString('duration')}</span>: <strong>${major.duration} ${getLocalizedString('years')}</strong></p>
                    <p><i class="fa-solid fa-language"></i> <span>${getLocalizedString('language')}</span>: <strong>${major.language}</strong></p>
                </div>
                <button class="btn btn-whatsapp apply-btn" data-title="${majorTitle}">
                    <i class="fa-brands fa-whatsapp"></i> <span data-i18n="apply_whatsapp">${getLocalizedString('apply')}</span>
                </button>
            `;

            majorsContainer.appendChild(card);
        });

        // Attach WhatsApp event listeners to the new buttons
        attachWhatsAppListeners();
    }


    // 3. Filter and Search Logic
    function filterMajors() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";

        const filtered = allMajors.filter(major => {
            return major.title.ar.toLowerCase().includes(searchTerm) ||
                   major.title.en.toLowerCase().includes(searchTerm) ||
                   major.title.tr.toLowerCase().includes(searchTerm);
        });

        renderMajors(filtered);
    }

    if (searchInput) searchInput.addEventListener("input", filterMajors);


    // 4. RESTORED: Dynamic WhatsApp Link Generator
    function attachWhatsAppListeners() {
        const applyButtons = document.querySelectorAll(".apply-btn");
        
        applyButtons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                const title = e.currentTarget.getAttribute("data-title");
                
                // Formulate the message based on language
                let message = "";
                if (currentLanguage === "ar") {
                    message = `مرحباً فريق نابو، أريد التقديم على تخصص [ ${title} ] في جامعة كارابوك. يرجى تزويدي بالتفاصيل والأوراق المطلوبة.`;
                } else if (currentLanguage === "tr") {
                    message = `Merhaba NABU ekibi, Karabük Üniversitesi'nde [ ${title} ] bölümüne başvurmak istiyorum. Lütfen detayları paylaşır mısınız?`;
                } else {
                    message = `Hello NABU team, I want to apply for [ ${title} ] at Karabük University. Please provide the details and required documents.`;
                }

                // Generates the URL with the pre-filled text
                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, "_blank");
            });
        });
    }


    // 5. Helper function for basic UI localizations
    function getLocalizedString(key) {
        const uiDict = {
            'bachelor': { ar: 'بكالوريوس', en: "Bachelor's", tr: 'Lisans' },
            'associate': { ar: 'دبلوم', en: 'Associate', tr: 'Ön Lisans' },
            'years': { ar: 'سنوات', en: 'Years', tr: 'Yıl' },
            'apply': { ar: 'تقديم عبر الواتساب', en: 'Apply via WhatsApp', tr: 'WhatsApp ile Başvur' },
            'duration': { ar: 'المدة', en: 'Duration', tr: 'Süre' },
            'language': { ar: 'اللغة', en: 'Language', tr: 'Eğitim Dili' }
        };
        return uiDict[key][currentLanguage] || uiDict[key]['en'];
    }

    // 6. Listen for global language changes
    window.addEventListener('languageChanged', (e) => {
        currentLanguage = e.detail.lang;
        renderMajors(allMajors);
    });
});