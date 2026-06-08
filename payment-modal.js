/* ── GCash Payment Modal ── */

(function () {
  'use strict';

  // ─── CONFIG ───
  // 👇 Replace with your actual GCash details
  const GCASH = {
    name: 'Villa Cornitz Resort',
    number: '0917 XXX XXXX',
    qrImage: '', // e.g. 'assets/gcash-qr.png' — leave empty for placeholder
  };

  // ─── EMAILJS ───
  const EMAILJS = {
    serviceId: 'service_7sww3a5',
    templateId: 'template_ls39wnx',
    publicKey: 'skve6ApDka5ebcaY4',
  };
  emailjs.init(EMAILJS.publicKey);

  // ─── BUILD MODAL HTML ───
  const modalHTML = `
    <div class="payment-overlay" id="payment-overlay">
      <div class="payment-modal">
        <button class="payment-close" id="payment-close" aria-label="Close">&times;</button>

        <!-- Payment step -->
        <div class="payment-form-step">
          <div class="payment-modal-title">Payment</div>
          <h3 class="payment-modal-heading">Complete Your Booking</h3>

          <!-- Booking recap -->
          <div class="payment-recap" id="payment-recap">
            <div class="payment-recap-row">
              <span>Date</span>
              <span id="recap-date">—</span>
            </div>
            <div class="payment-recap-row">
              <span>Guests</span>
              <span id="recap-guests">—</span>
            </div>
            <div class="payment-recap-divider"></div>
            <div class="payment-recap-total">
              <span>Total</span>
              <span id="recap-total">₱0</span>
            </div>
            <div class="payment-recap-dp">
              <span>50% Downpayment</span>
              <span id="recap-dp">₱0</span>
            </div>
          </div>

          <!-- GCash QR -->
          <div class="payment-qr-section">
            <div class="payment-qr-label">Scan to Pay via GCash</div>
            <div class="payment-qr-placeholder" id="payment-qr-box">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="square">
                <rect x="2" y="2" width="8" height="8"/>
                <rect x="14" y="2" width="8" height="8"/>
                <rect x="2" y="14" width="8" height="8"/>
                <rect x="14" y="14" width="8" height="8"/>
                <line x1="6" y1="6" x2="6" y2="6.01" stroke-width="2"/>
                <line x1="18" y1="6" x2="18" y2="6.01" stroke-width="2"/>
                <line x1="6" y1="18" x2="6" y2="18.01" stroke-width="2"/>
                <line x1="18" y1="18" x2="18" y2="18.01" stroke-width="2"/>
              </svg>
              <span>Replace with your QR</span>
            </div>
            <div class="payment-qr-account">
              Send to: <strong id="gcash-name">${GCASH.name}</strong>
            </div>
            <div class="payment-qr-account">
              GCash: <strong id="gcash-number">${GCASH.number}</strong>
            </div>
            <div class="payment-qr-note">
              After sending payment via GCash, enter the <strong>reference number</strong> below to confirm.
            </div>
          </div>

          <!-- Reference number -->
          <div class="payment-ref-group">
            <label for="payment-ref">GCash Reference Number</label>
            <input
              type="text"
              id="payment-ref"
              class="payment-ref-input"
              placeholder="e.g. 1234 5678 9012 3456"
              autocomplete="off"
            />
          </div>

          <!-- Actions -->
          <div class="payment-actions">
            <button class="payment-btn-primary" id="payment-submit">I've Sent Payment</button>
            <button class="payment-btn-secondary" id="payment-cancel">Cancel Booking</button>
          </div>
        </div>

        <!-- Success step -->
        <div class="payment-success">
          <div class="payment-success-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h3 class="payment-success-heading">Booking Submitted!</h3>
          <p class="payment-success-body" id="payment-success-msg">
            Your booking request has been received.
            We will verify your payment and confirm your reservation shortly.
          </p>
          <button class="payment-btn-primary" id="payment-done">Done</button>
        </div>
      </div>
    </div>
  `;

  // ─── INJECT MODAL INTO PAGE ───
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // ─── DOM REFS ───
  const overlay = document.getElementById('payment-overlay');
  const closeBtn = document.getElementById('payment-close');
  const cancelBtn = document.getElementById('payment-cancel');
  const submitBtn = document.getElementById('payment-submit');
  const doneBtn = document.getElementById('payment-done');
  const refInput = document.getElementById('payment-ref');
  const recapDate = document.getElementById('recap-date');
  const recapGuests = document.getElementById('recap-guests');
  const recapTotal = document.getElementById('recap-total');
  const recapDp = document.getElementById('recap-dp');

  // ─── REPLACE QR PLACEHOLDER WITH REAL IMAGE (if configured) ───
  if (GCASH.qrImage) {
    const box = document.getElementById('payment-qr-box');
    box.innerHTML = `<img src="${GCASH.qrImage}" alt="GCash QR Code" style="width:100%;height:100%;object-fit:contain;" />`;
  }

  // ─── HELPERS ───
  function getBookingData() {
    const dateEl = document.getElementById('booking-date');
    const adultEl = document.getElementById('guests-adult');
    const childEl = document.getElementById('guests-child');
    const infantEl = document.getElementById('guests-infant');
    const nameEl = document.getElementById('guest-name');
    const mobileEl = document.getElementById('guest-mobile');
    const totalEl = document.getElementById('total-amount');
    const dpEl = document.getElementById('dp-amount');

    return {
      date: dateEl ? dateEl.value : '—',
      adults: parseInt(adultEl?.value, 10) || 0,
      children: parseInt(childEl?.value, 10) || 0,
      infants: parseInt(infantEl?.value, 10) || 0,
      name: nameEl?.value.trim() || '',
      mobile: mobileEl?.value.trim() || '',
      total: totalEl?.textContent || '₱0',
      downpayment: dpEl?.textContent || '₱0',
    };
  }

  function formatGuests(data) {
    const parts = [];
    if (data.adults) parts.push(`${data.adults} Adult${data.adults > 1 ? 's' : ''}`);
    if (data.children) parts.push(`${data.children} Child${data.children > 1 ? 'ren' : ''}`);
    if (data.infants) parts.push(`${data.infants} Infant${data.infants > 1 ? 's' : ''}`);
    return parts.length ? parts.join(', ') : 'None';
  }

  // ─── OPEN MODAL ───
  function openModal() {
    const data = getBookingData();

    // Validate first
    if (!data.name) {
      alert('Please enter your full name.');
      document.getElementById('guest-name')?.focus();
      return false;
    }
    if (!data.mobile) {
      alert('Please enter your mobile number.');
      document.getElementById('guest-mobile')?.focus();
      return false;
    }
    if (data.adults + data.children + data.infants === 0) {
      alert('Please add at least one guest.');
      return false;
    }

    // Fill recap
    recapDate.textContent = data.date ? new Date(data.date + 'T12:00:00').toLocaleDateString('en-PH', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    }) : '—';
    recapGuests.textContent = formatGuests(data);
    recapTotal.textContent = data.total;
    recapDp.textContent = data.downpayment;

    // Reset
    refInput.value = '';
    submitBtn.disabled = false;
    overlay.classList.remove('success');

    // Show
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    return true;
  }

  // ─── CLOSE MODAL ───
  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ─── SUBMIT PAYMENT ───
  function submitPayment() {
    const ref = refInput.value.trim();
    if (!ref) {
      alert('Please enter the GCash reference number from your payment.');
      refInput.focus();
      return;
    }

    const data = getBookingData();
    const submittedAt = new Date().toISOString();

    // Disable button to prevent double-submit
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // Send email via EmailJS
    emailjs
      .send(EMAILJS.serviceId, EMAILJS.templateId, {
        name: data.name,
        mobile: data.mobile,
        date: data.date,
        adults: data.adults,
        children: data.children,
        infants: data.infants,
        total: data.total,
        downpayment: data.downpayment,
        reference: ref,
        submittedAt: submittedAt,
      })
      .then(
        () => {
          // Save to localStorage
          const payload = { ...data, reference: ref, submittedAt };
          const history = JSON.parse(localStorage.getItem('vc_bookings') || '[]');
          history.push(payload);
          localStorage.setItem('vc_bookings', JSON.stringify(history));

          showSuccess(data, ref);
        },
        (err) => {
          console.error('EmailJS error:', err);
          // Still save locally & show success even if email fails
          const payload = { ...data, reference: ref, submittedAt };
          const history = JSON.parse(localStorage.getItem('vc_bookings') || '[]');
          history.push(payload);
          localStorage.setItem('vc_bookings', JSON.stringify(history));

          showSuccess(data, ref);
        }
      );
  }

  function showSuccess(data, ref) {
    const msg =
      `Thank you, ${data.name}! Your downpayment of ${data.downpayment} is being verified.\n\n` +
      `Ref. No.: ${ref}\n\n` +
      `We will confirm your reservation for ${data.date} shortly.`;
    document.getElementById('payment-success-msg').textContent = msg;
    overlay.classList.add('success');
    submitBtn.disabled = false;
    submitBtn.textContent = "I've Sent Payment";
  }

  // ─── EVENTS ───

  // Hook into the existing "Proceed to Payment" button
  document.addEventListener('click', (e) => {
    const payBtn = e.target.closest('#pay-btn');
    if (payBtn) {
      e.preventDefault();
      openModal();
    }
  });

  // Close / cancel
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  // Click backdrop to close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
  });

  // Submit
  submitBtn.addEventListener('click', submitPayment);

  // Allow Enter key on ref input
  refInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitPayment();
  });

  // Done → close
  doneBtn.addEventListener('click', () => {
    closeModal();
    // Optionally redirect to home or reset form
    // window.location.href = 'index.html';
  });

})();