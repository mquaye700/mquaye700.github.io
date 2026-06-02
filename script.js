const nav = document.getElementById('main-navigation');
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.site-nav a');

function toggleNav() {
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!expanded));
  nav.classList.toggle('closed');
}

if (toggle && nav) {
  toggle.addEventListener('click', toggleNav);
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 720 && !nav.classList.contains('closed')) {
      toggleNav();
    }
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 720 && nav.classList.contains('closed')) {
    nav.classList.remove('closed');
    toggle.setAttribute('aria-expanded', 'false');
  }
});

const revealItems = document.querySelectorAll('[data-reveal]');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('revealed'));
}
