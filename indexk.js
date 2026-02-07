
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page-container');
    pages.forEach(page => page.classList.remove('active'));

    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        window.location.hash = pageId; // Update URL
    }

    // Set active nav link (underline CTA green)
    document.querySelectorAll('.navbar a[data-page]').forEach(function (link) {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });
}

function switchTab(tabId, clickedElement) {
    // Hide all tab panes
    const tabPanes = document.querySelectorAll('#products .tab-pane, #solutions #products .tab-pane');
    tabPanes.forEach(pane => pane.classList.remove('active'));

    // Hide all tab buttons
    const tabBtns = document.querySelectorAll('#products .tab-btn, #solutions #products .tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));

    // Show selected tab
    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.add('active');
    }

    // Activate button
    if (clickedElement) {
        clickedElement.classList.add('active');
    } else if (event && event.target) {
        event.target.classList.add('active');
    }
}

// Navbar hamburger toggle
document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navbar-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (toggle && navMenu) {
        toggle.addEventListener('click', function () {
            const isOpen = navbar.classList.toggle('open');
            toggle.setAttribute('aria-expanded', isOpen);
            toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
            document.body.style.overflow = isOpen ? 'hidden' : '';
            if (!isOpen) {
                document.querySelectorAll('.navbar .dropdown.open').forEach(function (d) {
                    d.classList.remove('open');
                });
            }
        });
    }

    // Mobile: click dropdown toggle to expand/collapse submenu
    document.querySelectorAll('.navbar .dropdown-toggle').forEach(function (toggleBtn) {
        toggleBtn.addEventListener('click', function (e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                var dropdown = this.closest('.dropdown');
                if (dropdown) {
                    dropdown.classList.toggle('open');
                }
            }
        });
    });

    const links = document.querySelectorAll('a[data-page]');
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            const scrollTarget = this.getAttribute('data-scroll');
            showPage(page);

            // Close mobile menu when a link is clicked
            if (navbar && navbar.classList.contains('open')) {
                navbar.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.setAttribute('aria-label', 'Open menu');
                document.body.style.overflow = '';
            }

            if (scrollTarget) {
                setTimeout(() => {
                    const targetElement = document.getElementById(scrollTarget);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 300);
            }
        });
    });

    // Initial Load / Hash Change
    function handleHash() {
        const hash = window.location.hash.slice(1) || 'home';
        showPage(hash);
    }
    window.addEventListener('hashchange', handleHash);
    handleHash(); // Initial

    window.addEventListener('resize', function () {
        if (window.innerWidth > 768 && navbar && navbar.classList.contains('open')) {
            navbar.classList.remove('open');
            if (toggle) {
                toggle.setAttribute('aria-expanded', 'false');
                toggle.setAttribute('aria-label', 'Open menu');
            }
            document.body.style.overflow = '';
        }
    });

    // Form Submissions (basic, no backend)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Form submitted! (Demo - add backend later)');
            this.reset();
        });
    });
});