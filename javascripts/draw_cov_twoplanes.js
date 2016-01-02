function clamp(x, a, b) {
   return Math.min(Math.max(x, a), b);
}

var lastX = 0;
var lastU = 0;

function drawing(ctx, pos) {
   // Draw the rectangle in the right side of the screen
   var recX = 350;
   var recY = 25;
   var recU = 200;
   var recV = 200;
   ctx.strokeRect(recX, recY, recU, recV);

   ctx.moveTo(recX - 10, recY + 0.5*recV);
   ctx.lineTo(recX + recU + 10, recY + 0.5*recV);
   ctx.stroke();
   context.font = '10pt Time Sans MS';
   context.fillStyle = 'black';
   context.fillText('x', recX + recU + 15, recY + 0.5*recV + 3);

   ctx.moveTo(recX + 0.5*recU, recY - 10);
   ctx.lineTo(recX + 0.5*recU, recY + recV + 10);
   ctx.stroke();
   context.fillText('u', recX + 0.5*recU - 3, recY - 15);

   // Get the cursor position in the box

   var posInRecX = clamp(pos.x, recX, recX + recU) - (recX + 0.5*recU);
   var posInRecU = clamp(pos.y, recY, recY + recV) - (recY + 0.5*recV);
   if(pos.x < recX || pos.x > recX+recU || pos.y < recY || pos.y > recY+recV) {
      posInRecX = lastX;
      posInRecU = lastU;
   } else {
      lastX = posInRecX;
      lastU = posInRecU;
   }
   ctx.beginPath();
   ctx.arc(recX + 0.5*recU + posInRecX, recY + 0.5*recV + posInRecU, 3, 0, 2*Math.PI);
   ctx.fill();

   // Convert the cursor position to ray direction and draw the ray
   var spaceScale = 100;
   var x = spaceScale*(posInRecX / recU);
   var u = spaceScale*(posInRecU / recV);
   var orgX = 50;
   var orgY = 125 - x;
   var dirX = spaceScale;
   var dirY = u;
   var norm = Math.sqrt(dirX*dirX + dirY*dirY);

   var posX = orgX + 0.5*spaceScale*dirX/norm;
   var posY = orgY + 0.5*spaceScale*dirY/norm;

   // Main ray
   ctx.moveTo(25, recY + 0.5*recV);
   ctx.lineTo(25+1.3*recU, recY + 0.5*recV);
   ctx.stroke();
   context.fillText('main ray', 1.3*recU, recY + 0.5*recV + 15);

   // 'x' coordinate
   ctx.moveTo(50, recY);
   ctx.lineTo(50, recY + recV);
   ctx.stroke();
   context.fillText('x', 47, recY - 10);

   // 'u' coordinate
   ctx.moveTo(50 + spaceScale, recY);
   ctx.lineTo(50 + spaceScale, recY + recV);
   ctx.stroke();
   context.fillText('u', 47 + spaceScale, recY - 10);

   // Draw the sub-ray
   ctx.moveTo(orgX, orgY);
   ctx.lineTo(posX, posY);
   ctx.stroke();

   // Draw the position on the two 'x' and 'u' plane
   ctx.fillStyle = "#000000";
   ctx.beginPath();
   ctx.arc(orgX, orgY, 3, 0, 2*Math.PI);
   ctx.fill();
   ctx.beginPath();
   ctx.arc(orgX + dirX, orgY + dirY, 3, 0, 2*Math.PI);
   ctx.stroke();
}

function updateDrawing(canvas, mousePos) {
  var context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawing(context, mousePos);
}
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

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
