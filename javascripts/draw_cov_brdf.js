loadFunctionBrdf = function() {

   // WebGL code
   var canvas = document.getElementById("draw_cov_brdf-gl");
   if(!canvas) {
      alert("Impossible de récupérer le canvas");
   }

   var gl = initWebGL(canvas);
   if (gl) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(1.0, 1.0, 1.0, 1.0);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
   }
}

addLoadEvent(loadFunctionBrdf);
