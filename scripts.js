document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  // Handle Contact Form Submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Simulate API request processing
    status.style.color = "#60a5fa";
    status.textContent = "Sending message...";

    setTimeout(() => {
      status.style.color = "#34d399";
      status.textContent = "Thank you! Your message has been received.";
      form.reset();
    }, 1200);
  });
});

const canvas = document.getElementById('wave-canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Configuration options
const config = {
  gridSpacing: 30,       // Distance between grid dots in pixels
  dotRadius: 1.5,        // Size of each dot
  mouseRadius: 120,      // Area of effect around the mouse
  dotColor: 'rgba(255, 255, 255, 0.3)', // Default dot color
  activeColor: 'rgba(56, 189, 248, 0.8)', // Color when pushed/active
  isMobile: 'ontouchstart' in window || navigator.maxTouchPoints > 0
};

let dots = [];
const mouse = { x: -1000, y: -1000, active: false };
let frame = 0;

// Dot Class definition
class Dot {
  constructor(x, y) {
    this.baseX = x;
    this.baseY = y;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
  }

  update() {
    if (config.isMobile) {
      // Mobile Behavior: Continuous organic wave drift using sine math
      const waveX = Math.sin(frame * 0.03 + this.baseY * 0.01) * 8;
      const waveY = Math.cos(frame * 0.02 + this.baseX * 0.01) * 8;
      this.x = this.baseX + waveX;
      this.y = this.baseY + waveY;
    } else {
      // Desktop Behavior: React to mouse positions
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < config.mouseRadius && mouse.active) {
        // Calculate force inversely proportional to distance
        let force = (config.mouseRadius - distance) / config.mouseRadius;
        let angle = Math.atan2(dy, dx);
        
        // Push dots away from the mouse cursor
        let targetX = this.x - Math.cos(angle) * force * 20;
        let targetY = this.y - Math.sin(angle) * force * 20;
        
        this.vx += (targetX - this.x) * 0.2;
        this.vy += (targetY - this.y) * 0.2;
      }

      // Physics easing to pull dots back to original grid positions
      this.vx += (this.baseX - this.x) * 0.08;
      this.vy += (this.baseY - this.y) * 0.08;

      // Friction to stabilize movements
      this.vx *= 0.85;
      this.vy *= 0.85;

      this.x += this.vx;
      this.y += this.vy;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, config.dotRadius, 0, Math.PI * 2);
    
    // Dynamically change color depth if the dot is pushed far from base
    const distFromBase = Math.hypot(this.x - this.baseX, this.y - this.baseY);
    ctx.fillStyle = distFromBase > 1.5 ? config.activeColor : config.dotColor;
    
    ctx.fill();
  }
}

// Generate the matrix grid points
function initGrid() {
  dots = [];
  for (let x = config.gridSpacing / 2; x < width; x += config.gridSpacing) {
    for (let y = config.gridSpacing / 2; y < height; y += config.gridSpacing) {
      dots.push(new Dot(x, y));
    }
  }
}

// Event Listeners for Desktop Interaction
if (!config.isMobile) {
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });
}

// Responsive resize cleanup
window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  initGrid();
});

// Primary Loop Execution
function animate() {
  ctx.clearRect(0, 0, width, height);
  frame++;

  for (let i = 0; i < dots.length; i++) {
    dots[i].update();
    dots[i].draw();
  }

  requestAnimationFrame(animate);
}

// Run
initGrid();
animate();
