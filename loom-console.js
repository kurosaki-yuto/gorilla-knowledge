document.querySelectorAll('article[data-videoid]').forEach(function(a) {
  var id = a.getAttribute('data-videoid');
  var title = a.querySelector('p, span, h3, h4');
  var t = title ? title.textContent.trim() : 'no-title';
  console.log(t + ' => https://www.loom.com/share/' + id);
});
