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

for (let i = 0; i < frameCount; i++) {
    const img = new Image();
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
    onUpdate: render // use animation onUpdate instead of scrollTrigger's onUpdate
});

images[0].onload = render;

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
