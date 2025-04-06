document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const verticalNav = document.querySelector('.vertical-nav');
    const navItems = document.querySelectorAll('.nav-item');
    const mainContent = document.querySelector('.main-content') || document.body;

    // Toggle mobile navigation
    hamburgerMenu.addEventListener('click', function() {
        verticalNav.classList.toggle('mobile-open');
        
        // Toggle hamburger icon between menu and close
        const icon = this.querySelector('i');
        icon.classList.toggle('bx-menu');
        icon.classList.toggle('bx-x');
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', function(e) {
        if (!verticalNav.contains(e.target) && !hamburgerMenu.contains(e.target)) {
            verticalNav.classList.remove('mobile-open');
            const icon = hamburgerMenu.querySelector('i');
            icon.classList.remove('bx-x');
            icon.classList.add('bx-menu');
        }
    });

    // Set active nav item
    function setActiveItem() {
        const sections = document.querySelectorAll('[data-section]');
        let currentSection = '';
        
        // Find which section is in view
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= (sectionTop - 100) && 
                window.scrollY < (sectionTop + sectionHeight - 100)) {
                currentSection = section.getAttribute('data-section');
            }
        });

        // Update active class
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === currentSection) {
                item.classList.add('active');
            }
        });
    }

    // Smooth scrolling for nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 20,
                    behavior: 'smooth'
                });

                // Update URL without page reload
                history.pushState(null, null, targetId);
            }
        });
    });

    // Toggle collapsed state (desktop only)
    function handleNavCollapse() {
        if (window.innerWidth > 992) {
            const isCollapsed = localStorage.getItem('navCollapsed') === 'true';
            document.body.classList.toggle('nav-collapsed', isCollapsed);
            
            // Add tooltips if collapsed
            if (isCollapsed) {
                navItems.forEach(item => {
                    const text = item.querySelector('.nav-text').textContent;
                    if (!item.querySelector('.tooltip')) {
                        const tooltip = document.createElement('span');
                        tooltip.className = 'tooltip';
                        tooltip.textContent = text;
                        item.appendChild(tooltip);
                    }
                });
            }
        }
    }

    // Toggle nav collapse (desktop only)
    document.querySelector('.nav-header').addEventListener('click', function() {
        if (window.innerWidth > 992) {
            const isCollapsing = !document.body.classList.contains('nav-collapsed');
            document.body.classList.toggle('nav-collapsed');
            localStorage.setItem('navCollapsed', isCollapsing);
            handleNavCollapse();
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992) {
            verticalNav.classList.remove('mobile-open');
            hamburgerMenu.querySelector('i').classList.remove('bx-x');
            hamburgerMenu.querySelector('i').classList.add('bx-menu');
        }
        handleNavCollapse();
    });

    // Initialize
    handleNavCollapse();
    setActiveItem();
    window.addEventListener('scroll', setActiveItem);

    // Close mobile nav when a nav item is clicked
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 992) {
                verticalNav.classList.remove('mobile-open');
                hamburgerMenu.querySelector('i').classList.remove('bx-x');
                hamburgerMenu.querySelector('i').classList.add('bx-menu');
            }
        });
    });
});