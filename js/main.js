/**
 * main.js - Основна логіка сайту
 */

const translations = {
    ua: {
        "nav.home": "Головна",
        "nav.about": "Про мене",
        "nav.projects": "Проєкти",
        "nav.contact": "Контакти",
        "hero.text": "Створюю сучасні веб-сторінки та інтерактивні веб-ігри з фокусом на анімацію та UX.",
        "hero.cta": "Дивитись роботи",
        "about.title": "Про мене",
        "about.text_1": "Привіт! Я Олександра, веб-розробниця, яка спеціалізується на створенні інтерактивного досвіду. Моя освіта в галузі інженерії програмного забезпечення дала мені міцний фундамент, але справжня пристрасть — це 'живий' фронтенд.",
        "about.text_2": "Я не просто пишу код — я створюю цифрові продукти, якими приємно користуватися. Використовую GSAP для складної анімації та Canvas для розробки легких, але захоплюючих ігор.",
        "about.text_3": "Вірю, що найкращі рішення народжуються на перетині технічної точності та художнього бачення. Постійно вивчаю нові технології, щоб кожен піксель на екрані мав своє значення.",
        "skills.title": "Навички",
        "projects.title": "Проєкти",
        "contact.title": "Зв'язок",
        "contact.subtitle": "Маєте ідею чи проект?",
        "contact.desc": "Завжди відкрита до нових можливостей та цікавих колаборацій. Напишіть мені!",
        "contact.email_btn": "Написати на пошту",
        "projects.loading": "Завантаження проектів...",
        "projects.error": "Не вдалося завантажити проєкти. Спробуйте пізніше."
    },
    en: {
        "nav.home": "Home",
        "nav.about": "About",
        "nav.projects": "Projects",
        "nav.contact": "Contact",
        "hero.text": "I create modern web pages and interactive web games with a focus on animation and UX.",
        "hero.cta": "View Works",
        "about.title": "About Me",
        "about.text_1": "Hi! I'm Alexandra, a web developer specializing in creating interactive experiences. My software engineering background gave me a solid foundation, but my true passion is 'live' frontend.",
        "about.text_2": "I don't just write code — I create digital products that are a joy to use. I use GSAP for complex animations and Canvas for developing lightweight yet engaging games.",
        "about.text_3": "I believe the best solutions are born at the intersection of technical precision and artistic vision. I'm constantly learning new technologies to make every pixel count.",
        "skills.title": "Skills",
        "projects.title": "Projects",
        "contact.title": "Contact",
        "contact.subtitle": "Have an idea or project?",
        "contact.desc": "I'm always open to new opportunities and interesting collaborations. Get in touch!",
        "contact.email_btn": "Send an Email",
        "projects.loading": "Loading projects...",
        "projects.error": "Failed to load projects. Please try again later."
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Елементи
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelectorAll('.nav__link');
    const langBtns = document.querySelectorAll('.lang-btn');
    const projectsContainer = document.getElementById('projects-container');
    
    let currentLang = localStorage.getItem('language') || 'ua';
    let sliderIntervals = []; // Для очищення таймерів при зміні мови

    // ==========================================
    // 1. Мобільне меню (Бургер)
    // ==========================================
    const toggleMenu = (forceClose = false) => {
        if (forceClose) {
            header.classList.remove('nav-open');
        } else {
            header.classList.toggle('nav-open');
        }
        document.body.style.overflow = header.classList.contains('nav-open') ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(true));
    });

    // ==========================================
    // 2. Логіка мов (i18n)
    // ==========================================
    function updateLanguage(lang) {
        currentLang = lang;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                const textTarget = el.querySelector('.contact__text') || el.querySelector('.btn-text span');
                if (textTarget) textTarget.textContent = translations[lang][key];
                else el.textContent = translations[lang][key];
            }
        });

        langBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
        localStorage.setItem('language', lang);
        
        loadProjects(); // Перевантажуємо проєкти
    }

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.lang !== currentLang) updateLanguage(btn.dataset.lang);
        });
    });

    // ==========================================
    // 3. Завантаження проєктів та Слайдер
    // ==========================================
    async function loadProjects() {
        if (!projectsContainer) return;
    
        sliderIntervals.forEach(clearInterval);
        sliderIntervals = [];
    
        try {
            projectsContainer.innerHTML = `<div class="loader">${translations[currentLang]['projects.loading']}</div>`;
    
            const response = await fetch('data/projects.json');
            const projects = await response.json();
            projectsContainer.innerHTML = ''; 
    
            projects.forEach((project) => {
                const card = document.createElement('div');
                card.className = 'project-card';
                
                const description = project.description[currentLang] || project.description['ua'];
                const tagsHTML = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    
                // Перевірка наявності зображень
                const images = project.images || (project.image ? [project.image] : []);
                
                let contentHTML = '';
                if (images.length > 0) {
                    const imagesMarkup = images.map(img => `<img src="${img}" alt="${project.title}">`).join('');
                    const dotsMarkup = images.length > 1 
                        ? `<div class="project-card__slider-dots">${images.map((_, i) => `<span class="dot ${i === 0 ? 'active' : ''}"></span>`).join('')}</div>`
                        : '';
                    
                    contentHTML = `
                        <div class="project-card__image">
                            <div class="project-card__slider-inner">
                                ${imagesMarkup}
                            </div>
                            ${dotsMarkup}
                        </div>`;
                } else {
                    contentHTML = `<div class="project-card__image"><div class="project-card__placeholder"></div></div>`;
                }
    
                card.innerHTML = `
                    ${contentHTML}
                    <div class="project-card__info">
                        <div class="project-card__tags">${tagsHTML}</div>
                        <h3>${project.title}</h3>
                        <p>${description}</p>
                        <div class="project-card__links">
                            <a href="${project.github}" target="_blank" class="btn-project btn-project--github">
                                <i class="fab fa-github"></i> GitHub
                            </a>
                            ${project.live ? `
                                <a href="${project.live}" target="_blank" class="btn-project btn-project--live">
                                    <i class="fas fa-external-link-alt"></i> Live Demo
                                </a>` : ''}
                        </div>
                    </div>
                `;
    
                projectsContainer.appendChild(card);
    
                if (images.length > 1) {
                    startVerticalSlider(card);
                }
            });
    
            if (typeof animateProjectCards === 'function') animateProjectCards();
    
        } catch (error) {
            console.error(error);
            projectsContainer.innerHTML = `<p class="error-msg">${translations[currentLang]['projects.error']}</p>`;
        }
    }
    
    function startVerticalSlider(card) {
        const inner = card.querySelector('.project-card__slider-inner');
        const dots = card.querySelectorAll('.dot');
        const totalImages = card.querySelectorAll('.project-card__slider-inner img').length;
        let current = 0;
    
        const interval = setInterval(() => {
            if(dots.length) dots[current].classList.remove('active');
            
            current = (current + 1) % totalImages;
            
            // Зсув на 100% висоти кожної картинки вгору
            inner.style.transform = `translateY(-${current * 100}%)`;
            
            if(dots.length) dots[current].classList.add('active');
        }, 4500); // Трохи повільніше для комфортного перегляду
    
        sliderIntervals.push(interval);
    }

    function startSlider(card) {
        const images = card.querySelectorAll('.project-card__image img');
        const dots = card.querySelectorAll('.dot');
        let current = 0;

        const interval = setInterval(() => {
            images[current].classList.remove('active');
            if(dots.length) dots[current].classList.remove('active');
            
            current = (current + 1) % images.length;
            
            images[current].classList.add('active');
            if(dots.length) dots[current].classList.add('active');
        }, 4000);

        sliderIntervals.push(interval);
    }

    // Ініціалізація при першому завантаженні
    updateLanguage(currentLang);
    
    // Рік у футері
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});