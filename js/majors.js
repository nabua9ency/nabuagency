

document.addEventListener("DOMContentLoaded", () => {
    const majorsContainer = document.getElementById("majors-container");
    const searchInput = document.getElementById("major-search");
    
    
    if (!majorsContainer) return;

    let allMajors = [];
    let currentLanguage = document.documentElement.getAttribute('lang') || 'ar';
    
    
    const whatsappLink = "https://wa.me/message/MKQ5H6XTA3RKH1"; 

    
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


    
    function renderMajors(majorsList) {
        majorsContainer.innerHTML = ""; 

        if (majorsList.length === 0) {
            majorsContainer.innerHTML = `<p style="text-align:center; padding: 2rem;">لا توجد تخصصات مطابقة لبحثك.</p>`;
            return;
        }

        majorsList.forEach(major => {
            
            const majorTitle = major.title[currentLanguage] || major.title['en'];

            
            const card = document.createElement("div");
            card.className = "major-card glass-card";
            
            card.innerHTML = `
                <div class="major-header">
                    <h3 class="major-title">${majorTitle}</h3>
                    <span class="major-badge">${major.degree === 'bachelor' ? getLocalizedString('bachelor') : getLocalizedString('associate')}</span>
                </div>
                <div class="major-details">
                    <p><i class="fa-regular fa-clock"></i> <span>${getLocalizedString('duration')}</span>: <strong>${major.duration} ${getLocalizedString('years')}</strong></p>
                    <p><i class="fa-solid fa-language"></i> <span>${getLocalizedString('language')}</span>: <strong>${major.language}</strong></p>
                </div>
                <a href="${whatsappLink}" target="_blank" class="btn btn-whatsapp apply-btn">
                    <i class="fa-brands fa-whatsapp"></i> <span data-i18n="apply_whatsapp">${getLocalizedString('apply')}</span>
                </a>
            `;

            majorsContainer.appendChild(card);
        });
    }


    
    function filterMajors() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";

        const filtered = allMajors.filter(major => {
            
            const matchesSearch = 
                major.title.ar.toLowerCase().includes(searchTerm) ||
                major.title.en.toLowerCase().includes(searchTerm) ||
                major.title.tr.toLowerCase().includes(searchTerm);

            return matchesSearch;
        });

        renderMajors(filtered);
    }

    
    if (searchInput) searchInput.addEventListener("input", filterMajors);


    
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

    
    window.addEventListener('languageChanged', (e) => {
        currentLanguage = e.detail.lang;
        renderMajors(allMajors); 
    });
});