function translateVertexNumber(path, idx, dX, dY) {
    var re = /([a-zA-Z ]+)([\-0-9\.]+),([\-0-9\.]+)/mg
    var result;
    for(var i=-1; i<idx; ++i) {
        result = re.exec(path);
    }

    if(result == null) {return path;}

    var x = parseFloat(result[2]) + dX;
    var y = parseFloat(result[3]) + dY;
    var rpl = result[1] + x.toString() + ',' + y.toString();
    var tmp = path.replace(result[0], rpl);
    return tmp;
}


var two_planes_canvas = document.getElementById('draw_cov_twoplanes');
two_planes_canvas.addEventListener("load", function(){
//    var svg    = two_planes_canvas.contentDocument;
//    if(!svg){ alert("Unable to access SVG element from 'draw_cov_twoplanes'"); }

   var snap   = Snap("#draw_cov_twoplanes");
   var ray    = snap.select("#ray");
   var rect   = snap.select("#rectangle");
   var cursor = snap.select("#cursor");

   var currentX = 0;
   var currentY = 0;
   var isDown = false;

   rect.node.addEventListener('mousedown', function(evt) {
      isDown = true;
      currentX = evt.clientX;
      currentY = evt.clientY;
   }, false);
   rect.node.addEventListener('mouseup', function(evt) {
      isDown = false;
   }, false);
   rect.node.addEventListener('mouseout', function(evt) {
      isDown = false;
   }, false);
   rect.node.addEventListener('mousemove', function(evt) {
      if(isDown) {

        var snap   = Snap("#draw_cov_twoplanes");
        var ray    = snap.select("#ray");
        var rect   = snap.select("#rectangle");
        var cursor = snap.select("#cursor");

         var transf = cursor.transform();
         var matrix = transf.localMatrix;

         var deltaX = evt.clientX - currentX;
         var deltaY = evt.clientY - currentY;
         currentX = evt.clientX;
         currentY = evt.clientY;

         // Translate the cursor
         matrix.translate(deltaX, deltaY);
         cursor.transform(matrix.toTransformString());

         // Change the position and orientation of the ray
         var pts = ray.attr('d');
         pts = translateVertexNumber(pts, 0, 0, deltaX);
         pts = translateVertexNumber(pts, 1, 0, deltaY);
         if(pts != '') {
            ray.attr({'d': pts});
         }
      }
   }, false);
}, false);