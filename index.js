'use strict';

const $ = document.querySelector.bind(document);

const onWindowScroll = ({ logo, scheme }) => {
  scheme
    .from_hue(window.scrollY)
    .scheme('analogic')
    .variation('soft');
  const colors = scheme.colors();

  logo.style.background = `linear-gradient(#${colors[0]},#${colors[3]})`;

  // fixed header
  const classList = $('header').classList;
  const fixedClass = 'header-fixed';
  const containClass = classList.contains(fixedClass);
  if (window.scrollY > 200) {
    if (!containClass) classList.add(fixedClass);
  } else {
    if (containClass) classList.remove(fixedClass);
  }
};

const colorLogo = () => {
  const scheme = new ColorScheme();
  const logo = $('.logo');
  const fakeEvent = { path: [null, { scrollY: 0 }] };
  const callOnWindowScrollOnFirstLoad = onWindowScroll;

  callOnWindowScrollOnFirstLoad({ logo, scheme });
  document.addEventListener('scroll', () => onWindowScroll({ logo, scheme }));
};

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
  fetch('./SPONSORS.md')
    .then(response => response.text())
    .then(markdown => {
      container.innerHTML += snarkdown(markdown);
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
  replaceSocialIcons($('section.social'));
  buildSchedule($('div.LimaJS-schedule'))
    .then(content => {
      addToCalendarLink({ container: $('a.add-to-calendar'), content });
      return content;
    })
    .then(
      content =>
        buildRegistrationButton(content.link, $('[data-js="registration-button"]')) || content,
    )
    .then(content => buildScheduleTitle(content));
  buildSponsors($('div.sponsors'));
  colorLogo();
};

window.addEventListener('load', main);

//
// Google analytics tracker
//
(function(l, i, m, a, _, j, s) {
  l['GoogleAnalyticsObject'] = _;
  (l[_] =
    l[_] ||
    function() {
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
