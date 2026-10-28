(() => {
  'use strict';
  const measurementId = window.HAIL_MARY_CONFIG?.measurementId || '';
  const consentPanel = document.querySelector('#consent');
  const form = document.querySelector('#signup-form');
  const email = document.querySelector('#email');
  const success = document.querySelector('#success');
  const consentKey = 'hail-mary-analytics-consent';
  let enabled = false;
  let started = false;
  let completed = false;
  let preference;
  try { preference = localStorage.getItem(consentKey); } catch {}
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  function enableAnalytics() {
    if (enabled || !/^G-[A-Z0-9]+$/.test(measurementId)) return;
    enabled = true;
    window['ga-disable-' + measurementId] = false;
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
    document.head.appendChild(script);
    gtag('js', new Date());
    gtag('config', measurementId, { allow_google_signals: false, allow_ad_personalization_signals: false, page_location: location.origin + location.pathname });
  }
  function track(name, parameters = {}) {
    if (enabled) gtag('event', name, { ...parameters, demo: true });
  }
  function chooseConsent(allow) {
    try { localStorage.setItem(consentKey, allow ? 'granted' : 'denied'); } catch {}
    consentPanel.hidden = true;
    if (allow) enableAnalytics();
    else { window['ga-disable-' + measurementId] = true; enabled = false; }
  }
  if (preference === 'granted') enableAnalytics();
  else if (!preference && measurementId) consentPanel.hidden = false;
  document.querySelector('#accept').addEventListener('click', () => chooseConsent(true));
  document.querySelector('#decline').addEventListener('click', () => chooseConsent(false));
  document.querySelector('#privacy').addEventListener('click', () => { consentPanel.hidden = false; });
  email.addEventListener('input', () => {
    if (!started) { track('form_start', { form_id: 'crew_signup' }); started = true; }
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity() || completed) return;
    completed = true;
    track('sign_up', { method: 'demo_email_form' });
    email.value = '';
    form.hidden = true;
    success.hidden = false;
    document.body.classList.add('celebrate');
    success.focus();
  });
  document.querySelector('#reset').addEventListener('click', () => {
    completed = false; started = false;
    success.hidden = true; form.hidden = false;
    document.body.classList.remove('celebrate');
    email.focus();
  });
})();
