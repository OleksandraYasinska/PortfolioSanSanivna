/**
 * animations.js - Складна анімація за допомогою GSAP
 */

document.addEventListener('DOMContentLoaded', () => {
    // Реєструємо плагін ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Створюємо об'єкт для адаптивних анімацій
    let mm = gsap.matchMedia();

    // ==========================================
    // 1. Анімація Hero Section (Intro)
    // ==========================================
    const heroTL = gsap.timeline({ defaults: { ease: "power4.out" } });

    heroTL
        .from('.hero__name', { y: 60, opacity: 0, duration: 1.2, delay: 0.5 })
        .from('.hero__role', { y: 40, opacity: 0, duration: 1 }, "-=0.8")
        .from('.hero__desc', { y: 30, opacity: 0, duration: 1 }, "-=0.8")
        .from('.hero__cta', { scale: 0.9, opacity: 0, duration: 0.8 }, "-=0.5")
        // Анімація хедера в кінці, щоб він не зникав назавжди, якщо щось піде не так
        .from('.header', { y: -100, opacity: 0, duration: 1, clearProps: "all" }, "-=1");

    // ==========================================
    // 2. Анімація секції About
    // ==========================================
    gsap.from('.about__image-wrapper', {
        scrollTrigger: {
            trigger: '.about',
            start: "top 70%",
            toggleActions: "play none none none"
        },
        x: -100,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out"
    });

    gsap.from('.about__text p', {
        scrollTrigger: {
            trigger: '.about',
            start: "top 70%",
        },
        x: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out"
    });

    // ==========================================
    // 3. Анімація Навичок (ВИПРАВЛЕНО)
    // ==========================================

    const skillCards = gsap.utils.toArray('.skill-card');

    skillCards.forEach((card) => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: card,
                start: "top 90%", 
                toggleActions: "play none none none",
                once: true 
            }
        });

        tl.fromTo(card, 
            { 
                opacity: 0, 
                y: 60,               
                filter: "blur(10px)", 
                scale: 0.95          
            }, 
            {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                scale: 1,
                duration: 1.2,
                ease: "expo.out",
                onComplete: () => {
                    /**
                     * ВИДАЛЯЄМО transform, filter та scale, 
                     * але ЗАЛИШАЄМО opacity: 1, щоб картка не зникла!
                     */
                    gsap.set(card, { clearProps: "transform,filter,scale" });
                }
            }
        );

        // Анімуємо внутрішній вміст
        tl.from(card.children, {
            opacity: 0,
            y: 20,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=0.8");
    });

    // ==========================================
    // 4. Мобільне меню (ВИПРАВЛЕНО)
    // ==========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const menuLinks = document.querySelectorAll('.nav__link');
    let menuItemsTL;

    // Використовуємо matchMedia, щоб анімація приховування 
    // посилань НЕ спрацьовувала на десктопі
    mm.add("(max-width: 768px)", () => {
        menuItemsTL = gsap.timeline({ paused: true });
        
        menuItemsTL.from(menuLinks, {
            x: 50,
            opacity: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: "power2.out",
            immediateRender: false // ВАЖЛИВО: не рендерити стан 0 до запуску
        });

        const handleMenuAnim = () => {
            // Чекаємо мить, поки клас додасться в main.js
            setTimeout(() => {
                const isOpen = document.querySelector('.header').classList.contains('nav-open');
                if (isOpen) {
                    menuItemsTL.play();
                } else {
                    menuItemsTL.reverse();
                }
            }, 10);
        };

        menuToggle.addEventListener('click', handleMenuAnim);
        
        // Очищення при виході з мобільної версії
        return () => {
            if(menuItemsTL) menuItemsTL.kill();
            gsap.set(menuLinks, { clearProps: "all" });
            menuToggle.removeEventListener('click', handleMenuAnim);
        };
    });

    // ==========================================
    // 5. Reveal заголовків
    // ==========================================
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: "top 90%",
            },
            y: 30,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });
    });
});

/**
 * Покращена анімація проектів з ефектом блюру та ScrollTrigger
 */
function animateProjectCards() {
    const projectCards = gsap.utils.toArray('.project-card');
    
    if (projectCards.length === 0) return;

    projectCards.forEach((card, index) => {
        // Створюємо окрему анімацію для кожної картки
        gsap.fromTo(card, 
            { 
                opacity: 0, 
                y: 80,             // Починаємо трохи нижче
                filter: "blur(15px)", 
                scale: 0.92        // Легке зменшення на старті
            }, 
            {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                scale: 1,
                duration: 1.4,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%", // Починати анімацію, коли картка з'явиться на 85% висоти екрану
                    toggleActions: "play none none none",
                    once: true
                },
                // Після завершення очищуємо трансформи, щоб не заважати CSS-ховеру
                onComplete: () => {
                    gsap.set(card, { clearProps: "filter,transform" });
                }
            }
        );

        // Додаткова анімація вмісту всередині картки (теги, заголовок, опис)
        const infoElements = card.querySelectorAll('.project-card__tags, h3, p, .project-card__links');
        gsap.from(infoElements, {
            scrollTrigger: {
                trigger: card,
                start: "top 80%",
            },
            opacity: 0,
            y: 20,
            duration: 1,
            stagger: 0.15,
            ease: "power2.out",
            delay: 0.2 // Починаємо після того, як сама картка трохи проявиться
        });
    });
}