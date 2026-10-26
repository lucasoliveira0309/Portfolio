const cursor = document.getElementById('cursor');
const dot = cursor.querySelector('.dot');
const ring = cursor.querySelector('.ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function animCursor() {
  rx += (mx - rx) * .12;
  ry += (my - ry) * .12;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animCursor);
}
animCursor();

const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let W, H, pts = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function mkPt() {
  return {
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.4 + .4,
    vx: (Math.random() - .5) * .25,
    vy: (Math.random() - .5) * .25,
    o: Math.random() * .5 + .15
  };
}

function initPts() {
  pts = [];
  const n = Math.floor((W * H) / 12000);
  for (let i = 0; i < n; i++) pts.push(mkPt());
}

function drawPts() {
  ctx.clearRect(0, 0, W, H);
  pts.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(168,85,247,${p.o})`;
    ctx.fill();
  });

  pts.forEach(p => {
    const dx = p.x - mx, dy = p.y - my;
    const d = Math.sqrt(dx*dx + dy*dy);
    if (d < 130) {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y); ctx.lineTo(mx, my);
      ctx.strokeStyle = `rgba(168,85,247,${.18 * (1 - d/130)})`;
      ctx.lineWidth = .5;
      ctx.stroke();
    }
  });
  requestAnimationFrame(drawPts);
}

resize(); initPts(); drawPts();
window.addEventListener('resize', () => { resize(); initPts(); });

const reveals = document.querySelectorAll('.reveal');
const revObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); }
  });
}, { threshold: .12 });
reveals.forEach(el => revObs.observe(el));

window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  nav.style.background = window.scrollY > 60 ? 'rgba(8,6,20,.98)' : 'rgba(8,6,20,.7)';
});

document.getElementById('footer-year').textContent = new Date().getFullYear();

function calcularIdade(nascimento) {
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;
  return idade;
}

document.querySelectorAll('.idade').forEach(el => {
  el.textContent = calcularIdade(new Date(2007, 8, 3)); 
});

function toggleMenu() {
  const btn = document.getElementById('hamburger');
  const drawer = document.getElementById('mobileDrawer');
  btn.classList.toggle('open');
  drawer.classList.toggle('open');
}

function closeDrawer() {
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('mobileDrawer').classList.remove('open');
}

function closeMenu() { closeDrawer(); }

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      // 1. Fecha o menu mobile se estiver aberto
      document.getElementById('hamburger').classList.remove('open');
      document.getElementById('mobileDrawer').classList.remove('open');

      const headerOffset = 80; 
      const elementPosition = targetElement.getBoundingClientRect().top;
      const startPosition = window.scrollY;
      const distance = elementPosition - headerOffset;

      const duration = 1000; 
      let start = null;

      function easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
      }

      function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;

        const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);

        window.scrollTo(0, run);

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        } else {
          window.scrollTo(0, startPosition + distance);
        }
      }

      requestAnimationFrame(animation);
    }
  });
});
