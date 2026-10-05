document.documentElement.classList.add('js');

const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

const setHeader = () => header?.classList.toggle('scrolled', window.scrollY > 16);
setHeader();
addEventListener('scroll', setHeader, { passive: true });

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  navLinks.classList.toggle('open', !open);
  document.body.style.overflow = open ? '' : 'hidden';
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navLinks?.classList.contains('open')) {
    menuButton.click();
    menuButton.focus();
  }
});

navLinks?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  if (navLinks.classList.contains('open')) menuButton.click();
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .13 });
document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));

document.querySelectorAll('.faq-question').forEach((button) => {
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
  });
});

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const media = document.querySelector('.hero-media');
  addEventListener('pointermove', (event) => {
    if (!media || innerWidth < 900) return;
    const x = (event.clientX / innerWidth - .5) * 10;
    const y = (event.clientY / innerHeight - .5) * 8;
    media.style.transform = `perspective(1100px) rotateY(${x}deg) rotateX(${-y}deg)`;
  }, { passive: true });
  addEventListener('pointerleave', () => { if (media) media.style.transform = ''; });
}

document.body.classList.add('page-ready');

const enquiryForm = document.querySelector('#whatsapp-enquiry');
enquiryForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  for (const input of enquiryForm.querySelectorAll('input[required], textarea[required]')) {
    input.setCustomValidity(input.value.trim() ? '' : 'Please enter this information.');
    input.addEventListener('input', () => input.setCustomValidity(''), { once: true });
  }
  if (!enquiryForm.reportValidity()) return;
  const fields = new FormData(enquiryForm);
  const text = `Hello Sakhi, I would like to enquire about a salon visit.\nName: ${fields.get('name').trim()}\nEnquiry: ${fields.get('service')}\n${fields.get('time').trim() ? `Preferred time: ${fields.get('time').trim()}\n` : ''}Message: ${fields.get('message').trim()}`;
  const url = `https://wa.me/919804068895?text=${encodeURIComponent(text)}`;
  const opened = window.open(url, '_blank', 'noopener,noreferrer');
  document.querySelector('#enquiry-feedback').textContent = 'Continue in WhatsApp to review and send your enquiry. If it did not open, use the WhatsApp link above.';
});
