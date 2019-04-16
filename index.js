'use strict';

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
};

window.addEventListener('load', main);
