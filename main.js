'use strict';

const $ = document.querySelectorAll.bind(document);

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

const loadPastMeetup = () => {
  const onAPIResponse = (error, data) => {
    if (error) {
      return;
    }
    $('iframe.past-video-iframe')[0].src = `//www.youtube.com/embed/${JSON.parse(data).videoId}`;
  }
  request('https://juanlajara.com/lima-js-youtube', onAPIResponse);
};

const setupPastMeetupClick = () => {
  const $watchPastVideo = $('button.watch-past-video')[0];
  const onWatchPastVideoClicked = event => {
    event.preventDefault();
    $('div.past-video')[0].classList.remove('hidden');
    $watchPastVideo.setAttribute('disabled', 'disabled');
    $watchPastVideo.classList.add('cursor-normal', 'no-action');
  }
  $watchPastVideo.addEventListener('click', onWatchPastVideoClicked);
}

var main = function (container) {

  social(document.getElementsByClassName('social')[0]);
  loadPastMeetup();
  setupPastMeetupClick();
};


window.addEventListener('load', main);


//
// Google analytics tracker
//
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-37026516-1', 'auto');
ga('send', 'pageview');
