'use strict';

const social = (container) => {
  [].forEach.call(container.children, (child) => {
    fetch('img/' + child.className + '.svg')
      .then(response => response.text())
      .then(svg => { child.innerHTML = svg });
  });
};

const schedule = (container) => {
  fetch('./TALKS.md')
    .then(response => response.text())
    .then(markdown => { container.innerHTML += snarkdown(markdown) });
};

const main = () => {
  social(document.getElementsByClassName('social')[0]);
  schedule(document.getElementById('schedule'));
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
