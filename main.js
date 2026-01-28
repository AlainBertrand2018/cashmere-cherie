import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById('hero-canvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const frameCount = 232;
const currentFrame = index => (
    `/woman_in_cashmere_sequence/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
);

const images = [];
const airbnb = {
    frame: 0
};

let loadedCount = 0;
const loaderBar = document.getElementById('loader-bar');
const loaderPercentage = document.getElementById('loader-percentage');
const preloader = document.getElementById('preloader');

const updateProgress = () => {
    loadedCount++;
    const progress = Math.round((loadedCount / frameCount) * 100);
    loaderBar.style.width = `${progress}%`;
    loaderPercentage.textContent = `${progress}%`;

    if (loadedCount === frameCount) {
        setTimeout(() => {
            preloader.classList.add('loaded');
            // Trigger initial scroll animations
            ScrollTrigger.refresh();
            render();
        }, 500);
    }
};

for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.onload = updateProgress;
    img.onerror = updateProgress; // Avoid getting stuck if one image fails
    img.src = currentFrame(i);
    images.push(img);
}

gsap.to(airbnb, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
    },
    onUpdate: render
});

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    const img = images[airbnb.frame];

    // Center and cover
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
    } else {
        drawWidth = canvas.height * imgRatio;
        drawHeight = canvas.height;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
    }

    context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

// Parallax Effects
gsap.utils.toArray('.parallax-text').forEach(text => {
    const speed = text.getAttribute('data-speed');
    gsap.to(text, {
        y: (i, target) => -ScrollTrigger.maxScroll(window) * speed,
        ease: "none",
        scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom bottom",
            scrub: true
        }
    });
});

// Navbar Hide/Show
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const navbar = document.getElementById('navbar');

    if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    lastScroll = currentScroll;
});

// Reveal Sections
const revealSections = () => {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const revealTop = reveal.getBoundingClientRect().top;
        const revealPoint = 150;

        if (revealTop < windowHeight - revealPoint) {
            reveal.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealSections);
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
});

// Initialize
revealSections();

// Chatbot Logic
const chatTrigger = document.getElementById('chatbot-trigger');
const chatWindow = document.getElementById('chat-window');
const closeChat = document.getElementById('close-chat');
const sendMessage = document.getElementById('send-message');
const userInput = document.getElementById('user-input');
const chatMessages = document.getElementById('chat-messages');

const botResponses = {
    greetings: ["Hello. I am Kikyo. How may I assist you?", "Greetings. Looking for something specific in our collection?", "Welcome to Cashmere Cherie. I am here to help."],
    delivery: ["We offer free delivery all over the island, typically within 2-3 business days.", "Our delivery service is complimentary across the entire island."],
    shisha: ["Our shisha lounge is a sanctuary of repose. Would you like to know about our premium blends?", "The lounge opens at 6 PM daily. It features exclusive charcoal-aged blends."],
    cashmere: ["Our cashmere is sourced from the highest plateaus, ensuring unparalleled softess.", "We specialize in ultra-fine knitwear. Are you interested in our sweaters or scarves?"],
    default: ["That is intriguing. Would you like to speak with a human concierge, or shall I find more details on that for you?", "I am learning the nuances of your request. Could you elaborate?"]
};

const addMessage = (text, sender) => {
    const msg = document.createElement('div');
    msg.className = `message ${sender}-message`;
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
};

const handleChat = () => {
    const text = userInput.value.trim().toLowerCase();
    if (!text) return;

    addMessage(userInput.value, 'user');
    userInput.value = '';

    setTimeout(() => {
        let response = botResponses.default[Math.floor(Math.random() * botResponses.default.length)];

        if (text.includes('hello') || text.includes('hi')) response = botResponses.greetings[Math.floor(Math.random() * botResponses.greetings.length)];
        else if (text.includes('delivery') || text.includes('shipping')) response = botResponses.delivery[Math.floor(Math.random() * botResponses.delivery.length)];
        else if (text.includes('shisha') || text.includes('lounge')) response = botResponses.shisha[Math.floor(Math.random() * botResponses.shisha.length)];
        else if (text.includes('cashmere') || text.includes('knit') || text.includes('material')) response = botResponses.cashmere[Math.floor(Math.random() * botResponses.cashmere.length)];

        addMessage(response, 'bot');
    }, 1000);
};

chatTrigger.addEventListener('click', () => {
    chatWindow.classList.toggle('active');
});

closeChat.addEventListener('click', () => {
    chatWindow.classList.remove('active');
});

sendMessage.addEventListener('click', handleChat);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChat();
});
