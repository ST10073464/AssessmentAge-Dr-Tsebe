(() => {
  'use strict';

  const el = id => document.getElementById(id);
  const dob = el('dob');
  const test = el('testDate');
  const method = el('method');
  const dayMs = 86400000;
  let current = null;

  el('year').textContent = new Date().getFullYear();

  const pad = value => String(value).padStart(2, '0');
  const localToday = () => {
    const date = new Date();
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
  };

  function validDate(year, month, day) {
    if (!Number.isInteger(year) || year < 1000 || year > 9999 || month < 1 || month > 12) return null;
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
    if (day < 1 || day > daysInMonth) return null;
    return { y: year, m: month, d: day, ts: Date.UTC(year, month - 1, day) };
  }

  function parseDate(value) {
    const text = value.trim();
    let match = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (match) return validDate(Number(match[3]), Number(match[2]), Number(match[1]));

    match = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) return validDate(Number(match[1]), Number(match[2]), Number(match[3]));

    match = text.match(/^(\d{4})(\d{2})(\d{2})$/);
    if (match) return validDate(Number(match[1]), Number(match[2]), Number(match[3]));
    return null;
  }

  function displayDateDigits(rawDigits) {
    const digits = rawDigits.slice(0, 8);
    if (digits.length === 8) {
      const yearFirst = validDate(Number(digits.slice(0, 4)), Number(digits.slice(4, 6)), Number(digits.slice(6, 8)));
      if (yearFirst) return `${pad(yearFirst.d)}/${pad(yearFirst.m)}/${yearFirst.y}`;
    }
    const dayFirst = digits.slice(0, 2);
    const month = digits.slice(2, 4);
    const year = digits.slice(4, 8);
    return [dayFirst, month, year].filter((part, index) => part || index === 0).join('/');
  }

  function formatDateInput(event) {
    const input = event.currentTarget;
    const caret = input.selectionStart ?? input.value.length;
    const digitsBeforeCaret = input.value.slice(0, caret).replace(/\D/g, '').length;
    const formatted = displayDateDigits(input.value.replace(/\D/g, ''));
    input.value = formatted;

    let position = 0;
    let seenDigits = 0;
    while (position < formatted.length && seenDigits < digitsBeforeCaret) {
      if (/\d/.test(formatted[position])) seenDigits++;
      position++;
    }
    input.setSelectionRange(position, position);
    recalculate();
  }

  function clampDay(year, month, day) {
    return Math.min(day, new Date(Date.UTC(year, month, 0)).getUTCDate());
  }

  function calendarAge(birth, assessment) {
    let months = (assessment.y - birth.y) * 12 + (assessment.m - birth.m);
    function anniversary(monthCount) {
      const total = birth.y * 12 + (birth.m - 1) + monthCount;
      const year = Math.floor(total / 12);
      const month = (total % 12) + 1;
      return Date.UTC(year, month - 1, clampDay(year, month, birth.d));
    }
    if (anniversary(months) > assessment.ts) months--;
    return {
      y: Math.floor(months / 12),
      m: months % 12,
      d: Math.round((assessment.ts - anniversary(months)) / dayMs)
    };
  }

  function thirtyDayAge(birth, assessment) {
    let y = assessment.y - birth.y;
    let m = assessment.m - birth.m;
    let d = assessment.d - birth.d;
    if (d < 0) { d += 30; m--; }
    if (m < 0) { m += 12; y--; }
    return { y, m, d };
  }

  function recalculate() {
    el('copied').textContent = '';
    el('error').textContent = '';
    const birth = parseDate(dob.value);
    const assessment = parseDate(test.value);
    current = null;

    if (dob.value && !birth && dob.value.replace(/\D/g, '').length >= 8) {
      el('error').textContent = 'Enter a real date of birth in DD/MM/YYYY format.';
    } else if (test.value && !assessment && test.value.replace(/\D/g, '').length >= 8) {
      el('error').textContent = 'Enter a real assessment date in DD/MM/YYYY format.';
    } else if (birth && assessment && assessment.ts < birth.ts) {
      el('error').textContent = 'The assessment date cannot be before the date of birth.';
    } else if (birth && assessment) {
      current = (method.value === 'thirty' ? thirtyDayAge : calendarAge)(birth, assessment);
      if (current.y < 0 || current.m < 0 || current.d < 0 || (current.d >= 30 && method.value === 'thirty')) {
        el('error').textContent = 'This date pair cannot be represented reliably with 30-day month borrowing. Choose calendar age or follow the assessment manual.';
        current = null;
      }
    }

    for (const key of ['years', 'months', 'days']) {
      const resultKey = { years: 'y', months: 'm', days: 'd' }[key];
      el(key).textContent = current ? current[resultKey] : '—';
    }
    el('resultDetails').textContent = current
      ? `${current.y} years, ${current.m} months and ${current.d} days — report notation: ${current.y};${pad(current.m)};${pad(current.d)}.`
      : 'Enter both dates to calculate chronological age.';
    el('methodUsed').textContent = current
      ? `Calculation used: ${method.value === 'thirty' ? '30-day month borrowing' : 'calendar age (elapsed calendar months)'}.`
      : '';
    el('copy').disabled = !current;
    el('methodHelp').textContent = method.value === 'thirty'
      ? 'Uses a 30-day borrowed month. Only choose this if the assessment manual specifies it.'
      : 'Counts complete calendar months, then remaining days. Short-month anniversaries are adjusted to that month’s last day.';
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    field.style.pointerEvents = 'none';
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    return copied ? Promise.resolve() : Promise.reject(new Error('Clipboard unavailable'));
  }

  dob.addEventListener('input', formatDateInput);
  test.addEventListener('input', formatDateInput);
  method.addEventListener('change', recalculate);
  document.querySelectorAll('[data-picker]').forEach(button => {
    button.addEventListener('click', () => {
      const picker = el(button.dataset.picker);
      const target = picker.id === 'dobCalendar' ? dob : test;
      const selected = parseDate(target.value);
      picker.value = selected ? `${selected.y}-${pad(selected.m)}-${pad(selected.d)}` : '';
      try {
        if (typeof picker.showPicker === 'function') picker.showPicker();
        else { picker.focus(); picker.click(); }
      } catch {
        picker.focus();
        picker.click();
      }
    });
  });
  el('dobCalendar').addEventListener('change', event => {
    const selected = parseDate(event.currentTarget.value);
    if (selected) dob.value = `${pad(selected.d)}/${pad(selected.m)}/${selected.y}`;
    recalculate();
  });
  el('testCalendar').addEventListener('change', event => {
    const selected = parseDate(event.currentTarget.value);
    if (selected) test.value = `${pad(selected.d)}/${pad(selected.m)}/${selected.y}`;
    recalculate();
  });
  el('today').addEventListener('click', () => {
    test.value = localToday();
    const selected = parseDate(test.value);
    el('testCalendar').value = `${selected.y}-${pad(selected.m)}-${pad(selected.d)}`;
    recalculate();
  });
  el('clear').addEventListener('click', () => {
    dob.value = '';
    test.value = '';
    el('dobCalendar').value = '';
    el('testCalendar').value = '';
    recalculate();
    dob.focus();
  });
  el('copy').addEventListener('click', async () => {
    if (!current) return;
    const report = `Chronological age on assessment date: ${current.y} years, ${current.m} months, ${current.d} days (${current.y};${pad(current.m)};${pad(current.d)}). Calculation: ${method.value === 'thirty' ? '30-day month borrowing' : 'calendar months'}.`;
    try {
      await copyText(report);
      el('copied').textContent = 'Copied to clipboard.';
    } catch {
      el('copied').textContent = 'Copy is unavailable in this browser. Select and copy the result above.';
    }
  });

  test.value = localToday();
  const today = parseDate(test.value);
  el('testCalendar').value = `${today.y}-${pad(today.m)}-${pad(today.d)}`;
  recalculate();
})();
