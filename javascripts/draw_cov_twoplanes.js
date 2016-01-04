var canvas = document.getElementById('draw_cov_twoplanes');

canvas.addEventListener("load", function(){
   var svg    = canvas.contentDocument;
   var cursor = svg.getElementById("cursor");
   var rect   = svg.getElementById("rectangle");
   var ray    = svg.getElementById("ray");

   var currentX = 0;
   var currentY = 0;
   var curT = cursor.transform.baseVal.getItem(0);
   var isDown = false;

   rect.addEventListener('mousedown', function(evt) {
      isDown = true;
      currentX = evt.clientX;
      currentY = evt.clientY;
   }, false);
   rect.addEventListener('mouseup', function(evt) {
      isDown = false;
   }, false);
   rect.addEventListener('mouseout', function(evt) {
      isDown = false;
   }, false);
   rect.addEventListener('mousemove', function(evt) {
      if(isDown) {
         var transf = cursor.transform.baseVal.getItem(0);
         var matrix = transf.matrix;

         var deltaX = evt.clientX - currentX;
         var deltaY = evt.clientY - currentY;
         currentX = evt.clientX;
         currentY = evt.clientY;

         matrix = matrix.translate(deltaX, deltaY);
         transf.setMatrix(matrix);

         var rayStart = ray.pathSegList.getItem(0);
         var rayEnd   = ray.pathSegList.getItem(1);
         rayStart.y -= deltaX;
         rayEnd.y   += deltaY;
      }
   }, false);
}, false);

//updateDrawing(canvas, {x:0, y:0});
