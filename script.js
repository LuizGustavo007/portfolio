document.addEventListener('DOMContentLoaded', () => {
    // 1. Menu Responsivo (Toggle)
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        const isMenuOpen = navLinks.classList.contains('open');
        menuToggle.setAttribute('aria-expanded', isMenuOpen);
        menuToggle.textContent = isMenuOpen ? '✕' : '☰'; // Muda o ícone
    });

    // 2. Efeito de Fade-In ao Scroll (Intersection Observer)
    const sections = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% da seção visível
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Executa o efeito apenas uma vez
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // 3. Destacar link da Navbar ao rolar (Scroll Spy)
    const updateActiveLink = () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Verifica se a seção está a uma certa distância do topo
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.querySelectorAll('a').forEach(a => {
            a.classList.remove('active');
            // Verifica o href (ex: #sobre) e o ID (ex: sobre)
            if (a.getAttribute('href').substring(1) === current) {
                a.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();

    // ----------------------------------------------------
    // *** 4. NOVO: Implementação da Rolagem Suave (Smooth Scroll) ***
    // ----------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Ignora links que são apenas "#" (para não quebrar a funcionalidade)
        if (anchor.getAttribute('href') === '#') return;

        anchor.addEventListener('click', function (e) {
            // 1. Previne o comportamento padrão (o "teleporte")
            e.preventDefault(); 

            // 2. Pega o ID do alvo (ex: #projetos)
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // 3. Usa scrollIntoView para a rolagem suave
                targetElement.scrollIntoView({
                    behavior: 'smooth', // A chave para a rolagem suave
                    block: 'start'      // Alinha o topo do elemento com o topo da viewport
                });

                // 4. Fecha o menu responsivo após o clique (melhora a usabilidade mobile)
                if (navLinks.classList.contains('open') && window.innerWidth <= 768) {
                    navLinks.classList.remove('open');
                    menuToggle.textContent = '☰';
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });
});