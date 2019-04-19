'use strict';

const onWindowScroll = ({ event, logo, scheme }) => {
  scheme
    .from_hue(event.path[1].scrollY)
    .scheme('analogic')
    .variation('soft');
  const colors = scheme.colors();

  logo.style.background = `linear-gradient(#${colors[0]},#${colors[3]})`;
};

const colorLogo = () => {
  const scheme = new ColorScheme();
  const logo = document.querySelector('.logo');
  const fakeEvent = { path: [null, { scrollY: 0 }] };

  onWindowScroll({ event: fakeEvent, logo, scheme });
  document.addEventListener('scroll', event => onWindowScroll({ event, logo, scheme }));
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

const buildSchedule = container => {
  fetch('./SCHEDULE.md')
    .then(response => response.text())
    .then(markdown => {
      container.innerHTML += snarkdown(markdown);
    });
};

const main = () => {
  replaceSocialIcons(document.querySelector('section.social'));
  buildSchedule(document.querySelector('div.LimaJS-schedule'));
  colorLogo();
};

window.addEventListener('load', main);
