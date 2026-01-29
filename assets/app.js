const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const form = document.getElementById('waitlistForm');
const statusEl = document.getElementById('formStatus');

function setStatus(message, type) {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.style.color =
    type === 'ok' ? 'rgba(44, 234, 163, 0.95)' : type === 'err' ? 'rgba(255, 120, 120, 0.95)' : 'rgba(255,255,255,0.75)';
}

function getStored() {
  try {
    const raw = localStorage.getItem('hik_waitlist');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function store(email) {
  const current = getStored();
  const normalized = String(email).trim().toLowerCase();
  if (!normalized) return;

  const exists = current.some((x) => x.email === normalized);
  if (exists) return;

  current.unshift({ email: normalized, createdAt: new Date().toISOString() });
  localStorage.setItem('hik_waitlist', JSON.stringify(current));
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = /** @type {HTMLInputElement|null} */ (document.getElementById('email'));
    const value = email?.value ?? '';

    if (!value) {
      setStatus('Please enter an email address.', 'err');
      return;
    }

    store(value);
    if (email) email.value = '';
    setStatus('Thanks — you are on the waitlist (stored locally in this browser).', 'ok');
  });
}
