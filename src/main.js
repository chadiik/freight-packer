import FreightPacker from './FreightPacker';

document.addEventListener('DOMContentLoaded', function() {
  var fp = new FreightPacker();
  
  document.addEventListener('mousedown', fp.Init.bind(fp));
});
