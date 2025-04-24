// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const navButtons = document.querySelector('.nav-buttons');

    mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
    navLinks.classList.toggle('active');
    navButtons.classList.toggle('active');
});

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav-container')) {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            navButtons.classList.remove('active');
        }
    });

    // Close mobile menu when clicking on a link
    navLinks.addEventListener('click', function(event) {
        if (event.target.tagName === 'A') {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            navButtons.classList.remove('active');
        }
    });

    // Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                    behavior: 'smooth'
            });
        }
    });
});
});

// Create mobile menu container
const mobileMenu = document.createElement('div');
mobileMenu.className = 'mobile-menu';
document.body.appendChild(mobileMenu);

// Move nav elements to mobile menu when in mobile view
function updateMobileMenu() {
    if (window.innerWidth <= 768) {
        mobileMenu.appendChild(navLinks);
        mobileMenu.appendChild(navButtons);
    } else {
        const navContainer = document.querySelector('.nav-container');
        navContainer.insertBefore(mobileMenu, navContainer.querySelector('.mobile-menu-btn'));
    }
}

// Initial setup
updateMobileMenu();

// Update on resize
window.addEventListener('resize', updateMobileMenu);

// Chatbot Toggle
const chatbotToggle = document.querySelector('.chatbot-toggle');
const chatbotContainer = document.createElement('div');
chatbotContainer.className = 'chatbot-container';
chatbotContainer.style.display = 'none';

// Create chatbot interface
chatbotContainer.innerHTML = `
    <div class="chatbot-header">
        <h3>Banyan Claims Assistant</h3>
        <button class="close-chat">×</button>
    </div>
    <div class="chatbot-messages"></div>
    <div class="chatbot-input">
        <input type="text" placeholder="Type your message...">
        <button type="submit">Send</button>
    </div>
`;

document.querySelector('.chatbot').appendChild(chatbotContainer);

// Chatbot Functionality
chatbotToggle.addEventListener('click', () => {
    const isHidden = chatbotContainer.style.display === 'none';
    chatbotContainer.style.display = isHidden ? 'flex' : 'none';
    if (isHidden) {
        showWelcomeMessage();
    }
});

document.querySelector('.close-chat').addEventListener('click', () => {
    chatbotContainer.style.display = 'none';
});

// Welcome Message
function showWelcomeMessage() {
    const messagesContainer = document.querySelector('.chatbot-messages');
    const welcomeMessage = `
        <div class="bot-message">
            Hello! 👋 Welcome to Banyan Claims. How can I assist you today?
            <div class="quick-replies">
                <button>Submit a Claim</button>
                <button>Track My Claim</button>
                <button>Get Support</button>
            </div>
        </div>
    `;
    messagesContainer.innerHTML = welcomeMessage;

    // Add click handlers for quick reply buttons
    document.querySelectorAll('.quick-replies button').forEach(button => {
        button.addEventListener('click', function() {
            handleQuickReply(this.textContent);
        });
    });
}

// Handle Quick Replies
function handleQuickReply(reply) {
    const messagesContainer = document.querySelector('.chatbot-messages');
    
    // Add user message
    messagesContainer.innerHTML += `
        <div class="user-message">
            ${reply}
        </div>
    `;

    // Add bot response based on the quick reply
    let botResponse = '';
    switch(reply) {
        case 'Submit a Claim':
            botResponse = `
                To submit a claim, please follow these steps:
                1. Log in to your account
                2. Click on "Submit a Claim"
                3. Fill out the claim form
                4. Upload supporting documents
                
                Would you like me to guide you through the process?
            `;
            break;
        case 'Track My Claim':
            botResponse = `
                You can track your claim by:
                1. Logging into your account
                2. Going to "My Claims"
                3. Selecting the claim you want to track
                
                Do you need help logging in?
            `;
            break;
        case 'Get Support':
            botResponse = `
                I'm here to help! You can:
                - Call us at +234 XXX XXX XXXX
                - Email us at support@banyanclaims.com
                - Visit our office in Lagos
                
                What would you prefer?
            `;
            break;
    }

    setTimeout(() => {
        messagesContainer.innerHTML += `
            <div class="bot-message">
                ${botResponse}
            </div>
        `;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 500);
}

// Handle user input
const chatInput = document.querySelector('.chatbot-input input');
const chatSubmit = document.querySelector('.chatbot-input button');

function handleUserInput() {
    const message = chatInput.value.trim();
    if (message) {
        const messagesContainer = document.querySelector('.chatbot-messages');
        messagesContainer.innerHTML += `
            <div class="user-message">
                ${message}
            </div>
        `;
        chatInput.value = '';
        
        // Simple bot response - in a real application, this would be connected to a backend
        setTimeout(() => {
            messagesContainer.innerHTML += `
                <div class="bot-message">
                    Thank you for your message. One of our agents will assist you shortly. In the meantime, you can check our FAQ section for quick answers to common questions.
                </div>
            `;
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 500);
    }
}

chatSubmit.addEventListener('click', handleUserInput);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUserInput();
    }
});

// Add styles for the chatbot
const chatbotStyles = `
    .chatbot-container {
        position: fixed;
        bottom: 80px;
        right: 2rem;
        width: 300px;
        height: 400px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .chatbot-header {
        background: var(--color-primary);
        color: white;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .chatbot-header h3 {
        margin: 0;
        font-size: 1rem;
    }

    .close-chat {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
    }

    .chatbot-messages {
        flex: 1;
        padding: 1rem;
        overflow-y: auto;
    }

    .bot-message,
    .user-message {
        margin-bottom: 1rem;
        padding: 0.75rem;
        border-radius: 10px;
        max-width: 80%;
    }

    .bot-message {
        background: var(--color-gray);
        margin-right: auto;
    }

    .user-message {
        background: var(--color-primary);
        color: white;
        margin-left: auto;
    }

    .quick-replies {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }

    .quick-replies button {
        background: var(--color-secondary);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 15px;
        cursor: pointer;
        font-size: 0.8rem;
    }

    .chatbot-input {
        padding: 1rem;
        display: flex;
        gap: 0.5rem;
        border-top: 1px solid #eee;
    }

    .chatbot-input input {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 5px;
        outline: none;
    }

    .chatbot-input button {
        background: var(--color-secondary);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        cursor: pointer;
    }
`;

// Add chatbot styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = chatbotStyles;
document.head.appendChild(styleSheet);

// Header Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Add additional styles for mobile menu when active
const mobileStyles = `
    @media (max-width: 768px) {
        .nav-links.active,
        .nav-buttons.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            padding: 1rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .mobile-menu-btn.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }

        .mobile-menu-btn.active span:nth-child(2) {
            opacity: 0;
        }

        .mobile-menu-btn.active span:nth-child(3) {
            transform: rotate(-45deg) translate(5px, -5px);
        }

        .header.scrolled {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(5px);
        }
    }
`;

const mobileStyleSheet = document.createElement('style');
mobileStyleSheet.textContent = mobileStyles;
document.head.appendChild(mobileStyleSheet); 