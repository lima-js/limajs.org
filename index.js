'use strict';

const limaJS = {
  day: null,
  month: null,
};

const onWindowScroll = ({ logo, scheme }) => {
  scheme
    .from_hue(window.scrollY)
    .scheme('analogic')
    .variation('soft');
  const colors = scheme.colors();

  logo.style.background = `linear-gradient(#${colors[0]},#${colors[3]})`;
};

const colorLogo = () => {
  const scheme = new ColorScheme();
  const logo = document.querySelector('.logo');
  const fakeEvent = { path: [null, { scrollY: 0 }] };

  onWindowScroll({ logo, scheme });
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

const meetupDateFromMarkdown = markdown => {
  if (markdown.split('\n')[0].includes('###')) {
    limaJS.month = +markdown.split('\n')[0].split(' ')[1];
    limaJS.day = +markdown.split('\n')[1].split(' ')[1];
    const [, , ...markdownWithoutDate] = markdown.split('\n');
    document.querySelector('a.add-to-calendar').classList.remove('hidden');
    return markdownWithoutDate.join('\n');
  }
  return markdown;
};

const buildSchedule = container => {
  return fetch('./SCHEDULE.md')
    .then(response => response.text())
    .then(markdown => {
      container.innerHTML += snarkdown(meetupDateFromMarkdown(markdown));
    });
};

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

const addToCalendarLink = container => {
  const baseURL = 'https://calendar.google.com/calendar/r/eventedit';
  const eventName = 'Lima JS';
  const startDateTime = formatDateTimeToGCalendar(
    new Date(new Date().getUTCFullYear(), limaJS.month - 1, limaJS.day, 19, 0, 0),
  );
  const endDateTime = formatDateTimeToGCalendar(
    new Date(new Date().getUTCFullYear(), limaJS.month - 1, limaJS.day, 22, 0, 0),
  );
  const link = `${baseURL}?text=${eventName}&dates=${startDateTime}/${endDateTime}`;

  container.setAttribute('href', link);
};

const main = () => {
  replaceSocialIcons(document.querySelector('section.social'));
  buildSchedule(document.querySelector('div.LimaJS-schedule')).then(() => {
    addToCalendarLink(document.querySelector('a.add-to-calendar'));
  });
  buildSponsors(document.querySelector('div.sponsors'));
  colorLogo();
};

window.addEventListener('load', main);

//
// Google analytics tracker
//
(function(l,i,m,a,_,j,s){l['GoogleAnalyticsObject']=_;l[_]=l[_]||function(){
(l[_].q=l[_].q||[]).push(arguments)},l[_].l=1*new Date();j=i.createElement(m),
s=i.getElementsByTagName(m)[0];j.async=1;j.src=a;s.parentNode.insertBefore(j,s)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-37026516-1', 'auto');
ga('send', 'pageview');
