/* ── BOOKING CALCULATOR ── */

const RATES = {
  adult: 70,
  child: 50,
  infant: 0,
};

const steppers = document.querySelectorAll('.stepper-btn');
const inputs = {
  adult: document.getElementById('guests-adult'),
  child: document.getElementById('guests-child'),
  infant: document.getElementById('guests-infant'),
};
const lines = {
  adult: document.getElementById('line-adult'),
  child: document.getElementById('line-child'),
  infant: document.getElementById('line-infant'),
};
const qtyEls = {
  adult: document.getElementById('qty-adult'),
  child: document.getElementById('qty-child'),
  infant: document.getElementById('qty-infant'),
};
const priceEls = {
  adult: document.getElementById('price-adult'),
  child: document.getElementById('price-child'),
};

function getValues() {
  return {
    adult: parseInt(inputs.adult.value, 10) || 0,
    child: parseInt(inputs.child.value, 10) || 0,
    infant: parseInt(inputs.infant.value, 10) || 0,
  };
}

function updateSummary() {
  const v = getValues();
  let total = 0;

  ['adult', 'child', 'infant'].forEach((key) => {
    const count = v[key];
    if (count > 0) {
      lines[key].style.display = 'flex';
      qtyEls[key].textContent = 'x' + count;
      if (key !== 'infant') {
        const subtotal = count * RATES[key];
        priceEls[key].textContent = '₱' + subtotal;
        total += subtotal;
      }
    } else {
      lines[key].style.display = 'none';
    }
  });

  document.getElementById('total-amount').textContent = '₱' + total;
  document.getElementById('dp-amount').textContent = '₱' + Math.ceil(total / 2);
}

// Stepper buttons
steppers.forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    const dir = parseInt(btn.dataset.dir, 10);
    const current = parseInt(target.value, 10) || 0;
    const next = Math.max(0, current + dir);
    target.value = next;
    updateSummary();
  });
});

// Direct input changes (in case readonly is bypassed)
Object.values(inputs).forEach((el) => {
  el.addEventListener('input', updateSummary);
});

// Set default date to tomorrow
(function setDefaultDate() {
  const dateInput = document.getElementById('booking-date');
  if (dateInput) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const y = tomorrow.getFullYear();
    const m = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const d = String(tomorrow.getDate()).padStart(2, '0');
    dateInput.value = y + '-' + m + '-' + d;
  }
})();

// ─── BLOCKED DATES ───
let blockedDates = [];

// Create warning element
const dateInput = document.getElementById('booking-date');
const dateWarning = document.createElement('p');
dateWarning.className = 'booking-note date-blocked-warning';
dateWarning.style.cssText = 'color: #b91c1c; margin-top: 8px; display: none;';
dateWarning.textContent = '❌ This date is fully booked. Please select another date.';
dateInput?.parentNode?.appendChild(dateWarning);

function isDateBlocked(dateStr) {
  return blockedDates.includes(dateStr);
}

function checkDateAvailability() {
  if (!dateInput) return;
  const val = dateInput.value;
  if (isDateBlocked(val)) {
    dateWarning.style.display = 'block';
    dateInput.style.borderColor = '#b91c1c';
  } else {
    dateWarning.style.display = 'none';
    dateInput.style.borderColor = '';
  }
}

// Fetch blocked dates from JSON file (works on Vercel)
fetch('blocked-dates.json')
  .then(r => r.json())
  .then(data => {
    blockedDates = data;
    window.__blockedDates = data; // share with payment-modal.js
    checkDateAvailability();
  })
  .catch(() => {}); // silently fail if file doesn't exist

// Validate date on change
dateInput?.addEventListener('change', checkDateAvailability);
dateInput?.addEventListener('input', checkDateAvailability);

// ─── PH MOBILE NUMBER VALIDATION (real-time feedback) ───
function isValidPHMobile(num) {
  if (!num) return false;
  const cleaned = num.replace(/\s/g, '');
  if (cleaned.startsWith('09')) {
    return cleaned.length === 11 && /^\d{11}$/.test(cleaned);
  }
  if (cleaned.startsWith('+63')) {
    return cleaned.length === 13 && /^\+63\d{10}$/.test(cleaned);
  }
  return false;
}

const mobileInput = document.getElementById('guest-mobile');
mobileInput?.addEventListener('input', () => {
  const val = mobileInput.value.trim();
  if (!val) {
    mobileInput.style.borderColor = '';
    return;
  }
  if (isValidPHMobile(val)) {
    mobileInput.style.borderColor = '#16a34a'; // green — valid
  } else {
    mobileInput.style.borderColor = '#b91c1c'; // red — invalid
  }
});

// Dev notice dismiss
document.querySelector('.dev-notice-close')?.addEventListener('click', () => {
  document.querySelector('.dev-notice')?.classList.add('hidden');
  document.body.classList.add('dev-notice-dismissed');
});

// Payment button — handled by payment-modal.js