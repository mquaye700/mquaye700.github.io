const nav = document.getElementById('main-navigation');
const toggle = document.querySelector('.nav-toggle');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('closed');
  });
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 720 && nav.classList.contains('closed')) {
    nav.classList.remove('closed');
    toggle.setAttribute('aria-expanded', 'false');
  }
});
