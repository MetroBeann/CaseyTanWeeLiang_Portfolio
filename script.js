// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeBlob();
    initializeNavigation();
    initializeCards();
    initializeAIChat();
    initializeCRUD();
    initializeAuth();
    initializeSlideshows(); // Changed to use the new slideshow function
    initializeScrollEffects();
    initializeContactForm();
    initializeProjectFilter();
});

/**
 * Interactive blob animation with cursor tracking
 */
function initializeBlob() {
    const blob = document.getElementById("blob");
    if (!blob) return;

    // Optimize performance by using requestAnimationFrame
    let lastX = 0;
    let lastY = 0;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    
    document.body.addEventListener('pointermove', event => {
        const { clientX, clientY } = event;
        targetX = clientX;
        targetY = clientY;
    });
    
    function animateBlob() {
        // Smooth transition with easing
        lastX = lastX + (targetX - lastX) * 0.05;
        lastY = lastY + (targetY - lastY) * 0.05;
        
        blob.style.left = `${lastX}px`;
        blob.style.top = `${lastY}px`;
        
        requestAnimationFrame(animateBlob);
    }
    
    animateBlob();
}

/**
 * Navigation functionality including mobile menu and scroll effects
 */
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const backToTopBtn = document.getElementById('back-to-top');
    
    // Mobile menu toggle
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
    
    // Scroll effects
    window.addEventListener('scroll', () => {
        // Navbar effect
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        // Back to top button
        if (backToTopBtn) {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    });
    
    // Back to top functionality
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Card flipping and interaction effects
 */
function initializeCards() {
    const cards = document.querySelectorAll('.card');
    
    // Enhanced card flipping with keyboard accessibility
    cards.forEach((card) => {
        // Mouse events
        card.addEventListener('mouseenter', () => {
            card.classList.add('flipped');
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('flipped');
        });
        
        // Keyboard accessibility
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.classList.toggle('flipped');
            }
        });
    });
    
    // Replace textarea with paragraphs for better accessibility
    document.querySelectorAll('.card-back textarea').forEach(textarea => {
        const content = textarea.value;
        const paragraph = document.createElement('p');
        paragraph.className = 'skill-description';
        paragraph.textContent = content;
        textarea.parentNode.replaceChild(paragraph, textarea);
    });
}

/**
 * Project filtering functionality
 */
function initializeProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (!filterButtons.length || !projectCards.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            // Filter projects
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = '';
                    // Add animation
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/**
 * AI Chat functionality with enhanced UI and error handling
 */
function initializeAIChat() {
    const aiChatCard = document.querySelector('.ai-chat-card');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    
    if (!aiChatCard || !chatMessages || !userInput || !sendButton) return;
    
    const API_KEY = 'AIzaSyD_lmumCJCHUx3mqR0HnnM0dyirHT5lPIU';
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        // Display user message
        displayMessage('User', message, 'user');
        userInput.value = '';
        
        // Show loading indicator
        const loadingMessage = document.createElement('div');
        loadingMessage.textContent = 'AI is thinking...';
        loadingMessage.dataset.role = 'ai';
        loadingMessage.id = 'loading-message';
        chatMessages.appendChild(loadingMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        try {
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: message }] }]
                })
            });
            
            // Remove loading indicator
            document.getElementById('loading-message')?.remove();
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const data = await response.json();
            if (data.candidates && data.candidates.length > 0) {
                const aiResponse = data.candidates[0].content.parts[0].text;
                displayMessage('Gemini', aiResponse, 'ai');
            } else {
                throw new Error('No response from AI');
            }
        } catch (error) {
            console.error('Error:', error);
            // Remove loading indicator if it still exists
            document.getElementById('loading-message')?.remove();
            displayMessage('AI', 'Sorry, I encountered an error. Please try again.', 'ai');
        }
    }
    
    function displayMessage(sender, message, role) {
        const messageElement = document.createElement('div');
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        messageElement.dataset.role = role;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    // Prevent card from flipping when interacting with chat
    aiChatCard.querySelector('.card-back').addEventListener('mouseenter', (e) => {
        e.stopPropagation();
    });
    
    // Welcome message
    setTimeout(() => {
        displayMessage('Gemini', 'Hello! How can I assist you today?', 'ai');
    }, 1000);
}

/**
 * CRUD functionality with improved UI and validation
 */
function initializeCRUD() {
    const form = document.getElementById('crud-form');
    const dataContainer = document.getElementById('data-container');
    let editingEntry = null;
    
    if (!form || !dataContainer) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        
        if (!firstName || !lastName) {
            alert('Please fill out both fields');
            return;
        }
        
        if (editingEntry) {
            updateEntry(editingEntry, firstName, lastName);
        } else {
            createEntry(firstName, lastName);
        }
        
        form.reset();
        editingEntry = null;
        document.getElementById('submit-btn').textContent = 'Submit';
    });
    
    function createEntry(firstName, lastName) {
        const dataEntry = document.createElement('div');
        dataEntry.classList.add('data-entry');
        dataEntry.innerHTML = `
            <span>First Name: ${firstName} Last Name: ${lastName}</span>
            <div>
                <button class="edit-btn" aria-label="Edit entry">Edit</button>
                <button class="delete-btn" aria-label="Delete entry">Delete</button>
            </div>
        `;
        
        dataContainer.appendChild(dataEntry);
        
        // Add event listeners to new buttons
        dataEntry.querySelector('.edit-btn').addEventListener('click', () => editEntry(dataEntry, firstName, lastName));
        dataEntry.querySelector('.delete-btn').addEventListener('click', () => deleteEntry(dataEntry));
        
        // Announce to screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.style.position = 'absolute';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        announcement.textContent = `Entry created for ${firstName} ${lastName}`;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    function editEntry(entry, firstName, lastName) {
        editingEntry = entry;
        document.getElementById('first-name').value = firstName;
        document.getElementById('last-name').value = lastName;
        document.getElementById('submit-btn').textContent = 'Update';
        
        // Focus on first input field
        document.getElementById('first-name').focus();
    }
    
    function updateEntry(entry, firstName, lastName) {
        entry.querySelector('span').textContent = `First Name: ${firstName} Last Name: ${lastName}`;
        editingEntry = null;
        document.getElementById('submit-btn').textContent = 'Submit';
        
        // Announce to screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.style.position = 'absolute';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        announcement.textContent = `Entry updated for ${firstName} ${lastName}`;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    function deleteEntry(entry) {
        if (confirm('Are you sure you want to delete this entry?')) {
            const text = entry.querySelector('span').textContent;
            entry.remove();
            
            // Announce to screen readers
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.style.position = 'absolute';
            announcement.style.width = '1px';
            announcement.style.height = '1px';
            announcement.style.overflow = 'hidden';
            announcement.textContent = `Entry deleted: ${text}`;
            document.body.appendChild(announcement);
            
            setTimeout(() => {
                document.body.removeChild(announcement);
            }, 1000);
        }
    }
}

/**
 * Authentication functionality with improved validation and security
 */
function initializeAuth() {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const authMessage = document.getElementById('auth-message');
    
    if (!registerForm || !loginForm || !authMessage) return;
    
    const registerButton = document.getElementById('register-button');
    const loginButton = document.getElementById('login-button');
    
    registerButton.addEventListener('click', function() {
        const username = document.getElementById('register-username').value.trim();
        const password = document.getElementById('register-password').value;
        
        if (!username || !password) {
            authMessage.textContent = 'Please enter both username and password.';
            authMessage.style.color = '#ea4335';
            return;
        }
        
        if (password.length < 6) {
            authMessage.textContent = 'Password must be at least 6 characters long.';
            authMessage.style.color = '#ea4335';
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        
        if (users[username]) {
            authMessage.textContent = 'Username already exists!';
            authMessage.style.color = '#ea4335';
        } else {
            // In a real app, you would hash the password
            users[username] = password;
            localStorage.setItem('users', JSON.stringify(users));
            authMessage.textContent = 'Registration successful!';
            authMessage.style.color = '#34a853';
            
            // Clear form
            document.getElementById('register-username').value = '';
            document.getElementById('register-password').value = '';
        }
    });
    
    loginButton.addEventListener('click', function() {
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        
        if (!username || !password) {
            authMessage.textContent = 'Please enter both username and password.';
            authMessage.style.color = '#ea4335';
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        
        if (users[username] === password) {
            authMessage.textContent = 'Login successful!';
            authMessage.style.color = '#34a853';
            
            // Clear form
            document.getElementById('login-username').value = '';
            document.getElementById('login-password').value = '';
        } else {
            authMessage.textContent = 'Invalid username or password.';
            authMessage.style.color = '#ea4335';
        }
    });
    
    // Add enter key support for forms
    document.getElementById('register-password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            registerButton.click();
        }
    });
    
    document.getElementById('login-password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginButton.click();
        }
    });
}

/**
 * Improved Slideshow functionality
 * This function completely replaces the original initializeFixedSlideshows
 */
function initializeSlideshows() {
    const slideshowConfigs = [
        {
            openBtn: 'open-slideshow',
            overlay: 'slideshow-overlay',
            closeBtn: 'close-slideshow',
            prevBtn: 'prev-slide',
            nextBtn: 'next-slide',
            container: 'slideshow-container'
        },
        {
            openBtn: 'open-aws-slideshow',
            overlay: 'aws-slideshow-overlay',
            closeBtn: 'aws-close-slideshow',
            prevBtn: 'aws-prev-slide',
            nextBtn: 'aws-next-slide',
            container: 'aws-slideshow-container'
        },
        {
            openBtn: 'open-programming-slideshow',
            overlay: 'programming-slideshow-overlay',
            closeBtn: 'programming-close-slideshow',
            prevBtn: 'programming-prev-slide',
            nextBtn: 'programming-next-slide',
            container: 'programming-slideshow-container'
        },
        {
            openBtn: 'open-d4vd-slideshow',
            overlay: 'd4vd-slideshow-overlay',
            closeBtn: 'd4vd-close-slideshow',
            prevBtn: 'd4vd-prev-slide',
            nextBtn: 'd4vd-next-slide',
            container: 'd4vd-slideshow-container'
        },
        {
            openBtn: 'open-inflation-slideshow',
            overlay: 'inflation-slideshow-overlay',
            closeBtn: 'inflation-close-slideshow',
            prevBtn: 'inflation-prev-slide',
            nextBtn: 'inflation-next-slide',
            container: 'inflation-slideshow-container'
        },
        {
            openBtn: 'open-ad-distribution-slideshow',
            overlay: 'ad-distribution-slideshow-overlay',
            closeBtn: 'ad-distribution-close-slideshow',
            prevBtn: 'ad-distribution-prev-slide',
            nextBtn: 'ad-distribution-next-slide',
            container: 'ad-distribution-slideshow-container'
        },
        {
            openBtn: 'open-elderly-slideshow',
            overlay: 'elderly-slideshow-overlay',
            closeBtn: 'elderly-close-slideshow',
            prevBtn: 'elderly-prev-slide',
            nextBtn: 'elderly-next-slide',
            container: 'elderly-slideshow-container'
        },
        {
            openBtn: 'open-canva-slideshow',
            overlay: 'canva-slideshow-overlay',
            closeBtn: 'canva-close-slideshow',
            prevBtn: 'canva-prev-slide',
            nextBtn: 'canva-next-slide',
            container: 'canva-slideshow-container'
        },
        {
            openBtn: 'open-gait-slideshow',
            overlay: 'gait-slideshow-overlay',
            closeBtn: 'gait-close-slideshow',
            prevBtn: 'gait-prev-slide',
            nextBtn: 'gait-next-slide',
            container: 'gait-slideshow-container'
        },
        {
            openBtn: 'open-frailty-slideshow',
            overlay: 'frailty-slideshow-overlay',
            closeBtn: 'frailty-close-slideshow',
            prevBtn: 'frailty-prev-slide',
            nextBtn: 'frailty-next-slide',
            container: 'frailty-slideshow-container'
        },
        {
            openBtn: 'open-cloud-db-slideshow',
            overlay: 'cloud-db-slideshow-overlay',
            closeBtn: 'cloud-db-close-slideshow',
            prevBtn: 'cloud-db-prev-slide',
            nextBtn: 'cloud-db-next-slide',
            container: 'cloud-db-slideshow-container'
        }
    ];
    
    slideshowConfigs.forEach(config => {
        setupSlideshow(config);
    });
    
    function setupSlideshow(config) {
        const openBtn = document.getElementById(config.openBtn);
        const overlay = document.getElementById(config.overlay);
        const closeBtn = document.getElementById(config.closeBtn);
        const prevBtn = document.getElementById(config.prevBtn);
        const nextBtn = document.getElementById(config.nextBtn);
        const container = document.getElementById(config.container);
        
        if (!openBtn || !overlay || !closeBtn || !prevBtn || !nextBtn || !container) {
            console.warn(`Missing elements for slideshow: ${config.overlay}`);
            return;
        }
        
        const slides = container.querySelectorAll('.slideshow-slide');
        if (slides.length === 0) {
            console.warn(`No slides found for slideshow: ${config.overlay}`);
            return;
        }
        
        let currentIndex = 0;
        
        // Show specified slide and hide others
        function showSlide(index) {
            // Hide all slides
            slides.forEach(slide => {
                slide.style.display = 'none';
                slide.setAttribute('aria-hidden', 'true');
            });
            
            // Show the current slide
            slides[index].style.display = 'flex';
            slides[index].setAttribute('aria-hidden', 'false');
            
            // Update counters or indicators if they exist
            const counter = container.querySelector('.slideshow-counter');
            if (counter) {
                counter.textContent = `${index + 1} / ${slides.length}`;
            }
        }
        
        // Initialize by setting up the first slide
        showSlide(0);
        
        // Open slideshow
        openBtn.addEventListener('click', () => {
            overlay.classList.remove('hidden');
            overlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            currentIndex = 0; // Reset to first slide
            showSlide(currentIndex);
        });
        
        // Close slideshow
        closeBtn.addEventListener('click', () => {
            overlay.classList.add('hidden');
            overlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = ''; // Restore scrolling
        });
        
        // Navigate to previous slide
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            showSlide(currentIndex);
        });
        
        // Navigate to next slide
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        });
        
        // Close on click outside slideshow container
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                closeBtn.click();
            }
        });
        
        // Keyboard navigation
        overlay.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'Escape':
                    closeBtn.click();
                    break;
                case 'ArrowLeft':
                    prevBtn.click();
                    break;
                case 'ArrowRight':
                    nextBtn.click();
                    break;
            }
        });
    }
}

/**
 * Scroll effects for elements entering viewport
 */
function initializeScrollEffects() {
    const sections = document.querySelectorAll('.overview, .skills, .projects, .contact');
    const cards = document.querySelectorAll('.card, .cardOverview');
    const techIcons = document.querySelectorAll('.tech-icon');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Apply CSS classes for animation
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            animation: fadeInAnimation 0.8s ease forwards;
        }
        
        @keyframes fadeInAnimation {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .tech-icon.fade-in {
            animation: techIconAnimation 0.5s ease forwards;
            animation-delay: calc(var(--delay) * 0.1s);
        }
        
        @keyframes techIconAnimation {
            from {
                opacity: 0;
                transform: translateY(20px) scale(0.8);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        .overview, .skills, .projects, .contact,
        .card, .cardOverview, .tech-icon {
            opacity: 0;
        }
    `;
    
    document.head.appendChild(style);
    
    // Observe elements
    sections.forEach(section => {
        observer.observe(section);
    });
    
    cards.forEach(card => {
        observer.observe(card);
    });
    
    // Animate tech icons with sequential delay
    techIcons.forEach((icon, index) => {
        icon.style.setProperty('--delay', index);
        observer.observe(icon);
    });
}

/**
 * Contact form with validation and submission handling
 */
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nameInput = contactForm.querySelector('input[type="text"]');
        const emailInput = contactForm.querySelector('input[type="email"]');
        const messageInput = contactForm.querySelector('textarea');
        
        if (!nameInput || !emailInput || !messageInput) return;
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();
        
        // Validate form
        if (!name || !email || !message) {
            alert('Please fill out all fields');
            return;
        }
        
        if (!isValidEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // In a real implementation, you would send this data to a server
        // For now, we'll just simulate a successful submission
        
        // Show loading state
        const submitButton = contactForm.querySelector('button');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        setTimeout(() => {
            // Reset form
            contactForm.reset();
            
            // Show success message
            alert('Your message has been sent successfully!');
            
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 1500);
    });
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}