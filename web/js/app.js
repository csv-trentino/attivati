document.addEventListener('DOMContentLoaded', function(){
  var el = document.querySelector('.c-d-number');

  if(el){
    var startNumber = parseInt(el.textContent, 10);
    var now = new Date();
    var target = new Date(2025, 11, 5, 0, 0, 0);
    var diffMs = target.getTime() - now.getTime();
    var diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if(diffDays < 0) diffDays = 0;

    var finalNumber = -diffDays;

    if(startNumber != finalNumber){
      var current = startNumber;
      var direction = finalNumber > startNumber ? 1 : -1;
      var totalSteps = Math.abs(finalNumber - startNumber);
      var step = 0;

      function animate(){
        if(current == finalNumber) return;

        current += direction;
        step++;
        el.textContent = current;

        var progress = step / totalSteps;
        var speed = 30 + progress * 200;

        setTimeout(animate, speed);
      }

      animate();
    }
  }

  var img = document.querySelector('.image-sect img');

  if(img){
    if(window.innerWidth < 768){
      img.src = 'images/guys_mobile.jpg';
    }
  }

  var items = document.querySelectorAll('.backgrounds i');
  var num = document.querySelector('.c-d-number');

  if(items.length > 0){
    var index = 0;

    function activate(){
      items.forEach(function(e){
        e.classList.remove('active');
      });

      items[index].classList.add('active');
      if(num)num.className = 'c-d-number color-' + index;

      index++;
      if(index >= items.length) index = 0;

      setTimeout(activate, 3000);
    }

    activate();
  }
});
