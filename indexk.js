
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

// NAVBAR 
document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('a[data-page]');
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            const scrollTarget = this.getAttribute('data-scroll');
            showPage(page);

            // Scroll to specific section if data-scroll attribute exists
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