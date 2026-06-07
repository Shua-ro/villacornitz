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

// Payment button (placeholder)
document.getElementById('pay-btn').addEventListener('click', () => {
  const v = getValues();
  const name = document.getElementById('guest-name').value.trim();
  const mobile = document.getElementById('guest-mobile').value.trim();

  if (!name) {
    alert('Please enter your full name.');
    document.getElementById('guest-name').focus();
    return;
  }
  if (!mobile) {
    alert('Please enter your mobile number.');
    document.getElementById('guest-mobile').focus();
    return;
  }
  if (v.adult + v.child + v.infant === 0) {
    alert('Please add at least one guest.');
    return;
  }

  alert(
    'Thank you, ' +
      name +
      '! Your booking request has been received.\n\n' +
      'We will contact you at ' +
      mobile +
      ' to confirm your reservation.'
  );
});