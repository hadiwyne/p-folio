document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Initialize theme
    initTheme();
    
    // Initialize smooth scrolling
    initSmoothScroll();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Render projects and filters
    renderProjects();
    renderFilters();
    
    // Render experiences
    renderExperiences();
    
    // Initialize scroll animations
    initScrollAnimations();
});

// Theme Toggle
function initTheme() {
    const themeToggle = document.getElementById('darkmode-toggle');
    const html = document.documentElement;
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    
    if (themeToggle) {
        themeToggle.checked = savedTheme === 'dark';
        
        themeToggle.addEventListener('change', function() {
            const newTheme = this.checked ? 'dark' : 'light';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

// Smooth scroll
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link, .cta-button');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href;
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetSection.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    const navMenu = document.getElementById('nav-menu');
                    const hamburger = document.getElementById('hamburger');
                    if (navMenu && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        hamburger.classList.remove('active');
                    }
                }
            }
        });
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }
}

// Render experiences
function renderExperiences() {
    const experiencesList = document.getElementById('experiences-list');
    
    if (!experiencesList || !window.experiencesData) {
        console.error('Experiences list or data not found');
        return;
    }
    
    experiencesList.innerHTML = '';
    
    window.experiencesData.forEach(experience => {
        const experienceItem = createExperienceItem(experience);
        experiencesList.appendChild(experienceItem);
    });
    
    setTimeout(() => {
        initScrollAnimations();
    }, 100);
}

function createExperienceItem(experience) {
    const item = document.createElement('div');
    item.className = 'experience-item';
    
    item.innerHTML = `
        <div class="experience-dot"></div>
        <div class="experience-content">
            <div class="experience-period">${experience.period}</div>
            <div class="experience-company">${experience.company}</div>
            <div class="experience-designation">${experience.designation}</div>
        </div>
    `;
    
    return item;
}

// Render Projects
function renderProjects(filterCategory = 'all') {
    const projectsGrid = document.getElementById('projects-grid');
    
    if (!projectsGrid || !window.projectsData) {
        console.error('Projects grid or data not found');
        return;
    }
    
    projectsGrid.innerHTML = '';
    
    const filteredProjects = filterCategory === 'all' 
        ? window.projectsData 
        : window.projectsData.filter(project => project.category === filterCategory);
    
    filteredProjects.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
    });
    setTimeout(() => {
        initScrollAnimations();
    }, 100);
}

// Create Project Card
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    const technologiesHTML = project.technologies
        .map(tech => `<span class="tech-tag">${tech}</span>`)
        .join('');
    
    const linksHTML = `
        <div class="project-links">
            ${project.link !== '#' ? `<a href="${project.link}" class="project-link" target="_blank" rel="noopener noreferrer">View Project</a>` : ''}
        </div>
    `;
    
    card.innerHTML = `
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <div class="project-technologies">
            ${technologiesHTML}
        </div>
        ${linksHTML}
    `;
    
    return card;
}

// Filter Buttons
function renderFilters() {
    const filtersContainer = document.getElementById('project-filters');
    
    if (!filtersContainer || !window.projectsData) {
        return;
    }
    
    const categories = ['all', ...new Set(window.projectsData.map(p => p.category))];
    
    const existingFilters = filtersContainer.querySelectorAll('.filter-btn:not([data-filter="all"])');
    existingFilters.forEach(btn => btn.remove());
    
    categories.forEach(category => {
        if (category === 'all') {
            const allBtn = filtersContainer.querySelector('[data-filter="all"]');
            if (allBtn) {
                allBtn.classList.add('active');
            }
        } else {
            const filterBtn = document.createElement('button');
            filterBtn.className = 'filter-btn';
            filterBtn.setAttribute('data-filter', category);
            filterBtn.textContent = category;
            filtersContainer.appendChild(filterBtn);
        }
    });
    
    const filterButtons = filtersContainer.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filterCategory = this.getAttribute('data-filter');
            renderProjects(filterCategory);
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const projectCards = document.querySelectorAll('.project-card:not(.fade-in)');
    projectCards.forEach(card => {
        observer.observe(card);
    });
    
    const experienceItems = document.querySelectorAll('.experience-item:not(.fade-in)');
    experienceItems.forEach(item => {
        observer.observe(item);
    });
}

// Window resize for mobile menu
window.addEventListener('resize', function() {
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
    }
});

