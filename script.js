(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('#nav-links');

  menuButton?.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    navLinks.classList.toggle('open', !isOpen);
  });

  navLinks?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuButton?.setAttribute('aria-expanded', 'false');
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    observer.observe(element);
  });

  document.querySelector('#year').textContent = new Date().getFullYear();

  const schedule = {
    0: { open: 12, close: 16, label: 'Sunday' },
    1: null,
    2: null,
    3: { open: 11, close: 20, label: 'Wednesday' },
    4: { open: 11, close: 20, label: 'Thursday' },
    5: { open: 11, close: 21, label: 'Friday' },
    6: { open: 12, close: 21, label: 'Saturday' }
  };

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Indiana/Indianapolis',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  }).formatToParts(new Date());

  const getPart = (type) => parts.find((part) => part.type === type)?.value;
  const dayLookup = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const day = dayLookup[getPart('weekday')];
  const hour = Number(getPart('hour')) % 24;
  const minute = Number(getPart('minute'));
  const nowMinutes = hour * 60 + minute;
  const today = schedule[day];
  const status = document.querySelector('#open-status');
  const dot = document.querySelector('.status-dot');

  document.querySelector(`[data-day="${day}"]`)?.classList.add('today');

  const formatHour = (hourValue) => {
    const suffix = hourValue >= 12 ? 'PM' : 'AM';
    const display = hourValue % 12 || 12;
    return `${display} ${suffix}`;
  };

  if (today && nowMinutes >= today.open * 60 && nowMinutes < today.close * 60) {
    status.textContent = `Open now · closes at ${formatHour(today.close)}`;
  } else {
    dot?.classList.add('closed');
    let nextDay = day;
    let daysAhead = 0;
    do {
      nextDay = (nextDay + 1) % 7;
      daysAhead += 1;
    } while (!schedule[nextDay] && daysAhead < 8);

    const next = schedule[nextDay];
    const prefix = daysAhead === 1 ? 'tomorrow' : `on ${next.label}`;
    status.textContent = `Closed now · opens ${prefix} at ${formatHour(next.open)}`;
  }
})();
