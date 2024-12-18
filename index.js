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

const fetchEvents = () =>
  new Promise((resolve, reject) => {
    const callbackId = `__callback__${Date.now()}`;
    const script = document.createElement('script');
    window[callbackId] = resolve;

    script.src = `//api.meetup.com/LimaJS/events?callback=${callbackId}`;
    script.onerror = reject;
    document.body.appendChild(script);
  });

const buildRegistrationButton = (link = '#', container) => {
  container.setAttribute('href', link);
};

const buildScheduleTitle = ({ time, venue: { lat, lon, name } }) => {
  const container = $('[data-js="section-title"]');
  const venue = container.querySelector('.venue');
  const month = container.querySelector('.month');
  const monthFromDate = new Date(time).toLocaleDateString('es', { month: 'long' });
  const gMapsFromLatLong = `//maps.google.com/?q=${lat},${lon}`;

  venue.innerText = name;
  venue.setAttribute('href', gMapsFromLatLong);
  month.innerText = monthFromDate;
};

const buildSchedule = container =>
  fetchEvents()
    .then(({ data: content }) => {
      container.innerHTML += snarkdown(content[0].description);
      return content[0];
    })
    .catch(console.error.bind(console));

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

const addToCalendarLink = ({ container, content: { time, duration } }) => {
  const baseURL = 'https://calendar.google.com/calendar/r/eventedit';
  const eventName = 'Lima JS';
  const startDateTime = formatDateTimeToGCalendar(new Date(time));
  const endDateTime = formatDateTimeToGCalendar(new Date(time + duration));
  const link = `${baseURL}?text=${eventName}&dates=${startDateTime}/${endDateTime}`;

  container.setAttribute('href', link);
};

const main = () => {
  replaceSocialIcons($('div.social'));
  replaceSocialIcons($('div.social-footer'));
  buildSchedule($('div.LimaJS-schedule'))
    .then(content => {
      addToCalendarLink({ container: $('a.add-to-calendar'), content });
      return content;
    })
    .then(content =>
      buildRegistrationButton(content.link, $('[data-js="registration-button"]')) || content,
    )
    .then(content => buildScheduleTitle(content));
  buildSponsors($('div.sponsors'));
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
