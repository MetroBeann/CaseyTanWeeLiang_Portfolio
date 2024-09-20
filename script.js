// Blob animation
const blob = document.getElementById("blob");
document.body.onpointermove = event => {
    const { clientX, clientY } = event;
    blob.animate({
        left: `${clientX}px`,
        top: `${clientY}px`
    }, { duration: 3000, fill: "forwards" });
}

// Card flipping
const cards = document.querySelectorAll('.card');
let isFlippingInProgress = false;
let lastMouseX = 0;

cards.forEach((card, index) => {
    card.addEventListener('mouseenter', (event) => {
        if (isFlippingInProgress) return;
        
        const direction = event.clientX > lastMouseX ? 1 : -1;
        lastMouseX = event.clientX;

        direction === 1 ? flipOpenSequence() : flipCloseSequence();
    });
});

function flipOpenSequence() {
    isFlippingInProgress = true;
    for (let i = 0; i < cards.length; i++) {
        setTimeout(() => {
            cards[i].classList.add('flipped');
            if (i === cards.length - 1) isFlippingInProgress = false;
        }, i * 50);
    }
}

function flipCloseSequence() {
    isFlippingInProgress = true;
    for (let i = cards.length - 1; i >= 0; i--) {
        setTimeout(() => {
            cards[i].classList.remove('flipped');
            if (i === 0) isFlippingInProgress = false;
        }, (cards.length - 1 - i) * 50);
    }
}

// AI Chat functionality
const aiChatCard = document.querySelector('.ai-chat-card');
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

const API_KEY = 'AIzaSyD_lmumCJCHUx3mqR0HnnM0dyirHT5lPIU';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

async function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        displayMessage('User', message);
        userInput.value = '';

        try {
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: message }] }]
                })
            });

            const data = await response.json();
            if (data.candidates && data.candidates.length > 0) {
                const aiResponse = data.candidates[0].content.parts[0].text;
                displayMessage('Gemini', aiResponse);
            } else {
                throw new Error('No response from AI');
            }
        } catch (error) {
            console.error('Error:', error);
            displayMessage('AI', 'Sorry, I encountered an error. Please try again.');
        }
    }
}

function displayMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    messageElement.style.textAlign = 'left';
    messageElement.style.width = '100%';
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

aiChatCard.addEventListener('mouseenter', (e) => e.stopPropagation());


// CRUD functionality
const form = document.getElementById('crud-form');
const dataContainer = document.getElementById('data-container');
let editingEntry = null;

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    
    editingEntry ? updateEntry(editingEntry, firstName, lastName) : createEntry(firstName, lastName);
    
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
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;
    
    dataContainer.appendChild(dataEntry);
    
    dataEntry.querySelector('.edit-btn').addEventListener('click', () => editEntry(dataEntry, firstName, lastName));
    dataEntry.querySelector('.delete-btn').addEventListener('click', () => deleteEntry(dataEntry));
}

function editEntry(entry, firstName, lastName) {
    editingEntry = entry;
    document.getElementById('first-name').value = firstName;
    document.getElementById('last-name').value = lastName;
    document.getElementById('submit-btn').textContent = 'Update';
}

function updateEntry(entry, firstName, lastName) {
    entry.querySelector('span').textContent = `First Name: ${firstName} Last Name: ${lastName}`;
    editingEntry = null;
    document.getElementById('submit-btn').textContent = 'Submit';
}

function deleteEntry(entry) {
    if (confirm('Are you sure you want to delete this entry?')) entry.remove();
}

// Authentication functionality
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const authMessage = document.getElementById('auth-message');

    if (registerForm && loginForm && authMessage) {
        const registerButton = document.getElementById('register-button');
        const loginButton = document.getElementById('login-button');

        registerButton.addEventListener('click', function() {
            const username = document.getElementById('register-username').value;
            const password = document.getElementById('register-password').value;

            if (username && password) {
                const users = JSON.parse(localStorage.getItem('users') || '{}');
                if (users[username]) {
                    authMessage.textContent = 'Username already exists!';
                } else {
                    users[username] = password;
                    localStorage.setItem('users', JSON.stringify(users));
                    authMessage.textContent = 'Registration successful!';
                }
            } else {
                authMessage.textContent = 'Please enter both username and password.';
            }
        });

        loginButton.addEventListener('click', function() {
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            if (username && password) {
                const users = JSON.parse(localStorage.getItem('users') || '{}');
                authMessage.textContent = users[username] === password ? 'Login successful!' : 'Invalid username or password.';
            } else {
                authMessage.textContent = 'Please enter both username and password.';
            }
        });
    }
});

// Slideshow functionality
document.addEventListener('DOMContentLoaded', () => {
    const slideshows = [
        { open: 'open-slideshow', overlay: 'slideshow-overlay', close: 'close-slideshow', prev: 'prev-slide', next: 'next-slide', slides: '.slideshow-slide' },
        { open: 'open-aws-slideshow', overlay: 'aws-slideshow-overlay', close: 'aws-close-slideshow', prev: 'aws-prev-slide', next: 'aws-next-slide', slides: '.aws-slideshow-slide' },
        { open: 'open-programming-slideshow', overlay: 'programming-slideshow-overlay', close: 'programming-close-slideshow', prev: 'programming-prev-slide', next: 'programming-next-slide', slides: '.programming-slideshow-slide' },
        { open: 'open-d4vd-slideshow', overlay: 'd4vd-slideshow-overlay', close: 'd4vd-close-slideshow', prev: 'd4vd-prev-slide', next: 'd4vd-next-slide', slides: '.d4vd-slideshow-slide' },
        { open: 'open-inflation-slideshow', overlay: 'inflation-slideshow-overlay', close: 'inflation-close-slideshow', prev: 'inflation-prev-slide', next: 'inflation-next-slide', slides: '.inflation-slideshow-slide' }
    ];

    slideshows.forEach(slideshow => setupSlideshow(slideshow));
});

function setupSlideshow({ open, overlay, close, prev, next, slides }) {
    const openBtn = document.getElementById(open);
    const overlayEl = document.getElementById(overlay);
    const closeBtn = document.getElementById(close);
    const prevBtn = document.getElementById(prev);
    const nextBtn = document.getElementById(next);
    const slideElements = document.querySelectorAll(slides);

    if (!openBtn || !overlayEl || !closeBtn || !prevBtn || !nextBtn || slideElements.length === 0) return;

    let currentSlide = 0;

    function showSlide(index) {
        slideElements.forEach(slide => slide.classList.remove('active'));
        slideElements[index].classList.add('active');
    }

    openBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        overlayEl.classList.remove('hidden');
        showSlide(currentSlide);
    });

    closeBtn.addEventListener('click', () => overlayEl.classList.add('hidden'));

    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slideElements.length) % slideElements.length;
        showSlide(currentSlide);
    });

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slideElements.length;
        showSlide(currentSlide);
    });

    overlayEl.addEventListener('click', (e) => {
        if (e.target === overlayEl) overlayEl.classList.add('hidden');
    });
}