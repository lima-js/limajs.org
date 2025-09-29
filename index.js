'use strict';

const $ = document.querySelector.bind(document);

const replaceSocialIcons = container => {
  [...container.children].forEach(child => {
    fetch('images/icons/' + child.className + '.svg')
      .then(response => response.text())
      .then(svg => {
        child.innerHTML = svg;
      });
  });
};

const buildSponsors = container => {
  fetch('./README.md')
    .then(response => response.text())
    .then(markdown => {
      const el = document.createElement('div');
      el.innerHTML = snarkdown(markdown);
      const sponsorLinks = [...el.querySelectorAll('.sponsor')];

      if (!sponsorLinks.length) {
        container.appendChild(Object.assign(document.createElement('p'), {
          textContent: 'En este momento no contamos con patrocinadores',
        }));
        return;
      }

      sponsorLinks.forEach((sponsorLink) => {
        sponsorLink.classList.add('item');
        container.appendChild(sponsorLink);
      });
    });
};

const parseDuration = (duration) => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);

  if (!match) {
    return 0;
  }

  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);

  return (hours * 60 + minutes) * 60 * 1000;
};

const formatDateTimeToGCalendar = dateTime => {
  return dateTime
    .toISOString()
    .split('-')
    .join('')
    .split(':')
    .join('')
    .split('.000')
    .join('');
};

const createAddToCalendarLink = (event) => {
  const baseURL = 'https://calendar.google.com/calendar/r/eventedit';
  const eventName = 'Lima JS';
  const dateTime = new Date(event.dateTime);
  const startDateTime = formatDateTimeToGCalendar(dateTime);
  const duration = parseDuration(event.duration);
  const endDateTime = formatDateTimeToGCalendar(new Date(+dateTime + duration));
  return `${baseURL}?text=${eventName}&dates=${startDateTime}/${endDateTime}`;
};

const buildUpcomingEvents = (container) => {
  return fetch('/data/upcoming-events.json')
    .then(resp => resp.json())
    .then((events) => {
      if (!events.length) {
        container.innerHTML = `
          <p>
            No hay eventos programados por el momento. Síguenos en nuestras
            redes sociales para estar al tanto de las novedades.
          </p>
        `;
        return;
      }

      container.innerHTML = '';

      events.forEach((event) => {
        const eventEl = document.createElement('div');
        eventEl.classList.add('event');
        eventEl.classList.add('panel');

        const contentBox = document.createElement('div');
        contentBox.classList.add('content-box');

        contentBox.innerHTML = `
          <h2>
            <a href="${event.eventUrl}" target="_blank">${event.title}</a>
          </h2>
          <p>
          <strong>Cuándo:</strong> ${
            new Date(event.dateTime).toLocaleString('es-PE', {
              timeZone: 'America/Lima',
              dateStyle: 'full',
              timeStyle: 'short',
            })
          }
          </p>
          <p><strong>Dónde:</strong> ${event.venues[0].name}</p>
          ${snarkdown(event.description)}
        `;

        const buttons = document.createElement('div');
        buttons.classList.add('buttons');

        buttons.innerHTML = `
          <a class="custom-button main" href="${event.eventUrl}">Registrarse</a>
          <a
            class="custom-button invert add-to-calendar"
            href="${createAddToCalendarLink(event)}"
          >
            Agregar a Calendario
          </a>
        `;

        eventEl.appendChild(contentBox);
        eventEl.appendChild(buttons);
        container.appendChild(eventEl);
      });
    })
    .catch(console.error.bind(console));
};

const main = () => {
  replaceSocialIcons($('div.social'));
  replaceSocialIcons($('div.social-footer'));
  buildSponsors($('div.sponsors'));
  buildUpcomingEvents($('.events'));
};

window.addEventListener('load', main);

(function (l, i, m, a, _, j, s) {
  l['GoogleAnalyticsObject'] = _;
  (l[_] =
    l[_] ||
    function () {
      (l[_].q = l[_].q || []).push(arguments);
    }),
    (l[_].l = 1 * new Date());
  (j = i.createElement(m)), (s = i.getElementsByTagName(m)[0]);
  j.async = 1;
  j.src = a;
  s.parentNode.insertBefore(j, s);
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-37026516-1', 'auto');
ga('send', 'pageview');
