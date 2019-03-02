'use strict';

var request = function (url, cb) {
  var xhr = new XMLHttpRequest();

  xhr.open('get', url, true);
  xhr.onload = function () {
    if (xhr.status !== 200) {
      return cb && cb(xhr.status);
    }
    cb && cb(null, xhr.response);
  };

  xhr.send();
};

var social = function (container) {
  var handleRequestCallback = function (child, err, svg) {
    child.innerHTML = (svg || '');
  };

  [].forEach.call(container.children, function (child) {
    request('img/' + child.className + '.svg', handleRequestCallback.bind(null, child));
  });
};

var main = function () {
  social(document.getElementsByClassName('social')[0]);
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
