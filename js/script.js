document.addEventListener('DOMContentLoaded', function() {
    // Menu mobile toggle
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav ul');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('show');
            document.body.classList.toggle('menu-open'); // Blocca lo scroll quando il menu è aperto
        });
    }

    // Chiudi menu quando si fa click su un link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                nav.classList.remove('show');
                document.body.classList.remove('menu-open');
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Animazione numeri nella sezione "Chi Siamo" (opzionale)
    const animateCounters = () => {
        const counters = document.querySelectorAll('.counter');
        if (counters.length === 0) return;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const count = +counter.innerText;
            const increment = target / 200;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(() => animateCounters(), 10);
            } else {
                counter.innerText = target;
            }
        });
    };

    // Effetto parallasse per hero section
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
        }
    });

    // Animazione fluida per scroll con ancoraggio
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Funzione per attivare il link della navbar in base alla sezione visibile
    function handleScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 200; // Offset per anticipare l'attivazione
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (navLink && scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                navLink.classList.add('active');
            }
        });
    }
    
    // Esegui la funzione al caricamento della pagina e durante lo scorrimento
    window.addEventListener('scroll', handleScrollSpy);
    handleScrollSpy(); // Esegui all'avvio per impostare il link attivo iniziale
});
