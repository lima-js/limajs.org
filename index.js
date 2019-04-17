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

var request = function(url, cb) {
  var xhr = new XMLHttpRequest();

  xhr.open('get', url, true);

  xhr.onload = function() {
    if (xhr.status !== 200) {
      return cb && cb(xhr.status);
    }

    cb && cb(null, xhr.response);
  };

  xhr.send();
};

var social = function(container) {
  var handleRequestCallback = function(child, err, svg) {
    child.innerHTML = svg || '';
  };

  [].forEach.call(container.children, function(child) {
    request('images/icons/' + child.className + '.svg', handleRequestCallback.bind(null, child));
  });
};

var main = function(container) {
  social(document.getElementsByClassName('social')[0]);
  colorLogo();
};

window.addEventListener('load', main);
