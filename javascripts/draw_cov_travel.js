
loadFunction = function() {
   var tr_canvas = document.getElementById("draw_cov_travel");
   if(!tr_canvas) {
      alert("Impossible de récupérer le canvas");
   }

   initWebGL(tr_canvas);
   if (gl) {
      gl.clearColor(1.0, 1.0, 1.0, 1.0);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  }
}

initWebGL = function(canvas) {
   gl = null;
   try {
      gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
   } catch(e) {}

   if (!gl) {
      alert("Could not init WebGL context.");
   }
}

if(addLoadEvent) {
   addLoadEvent(loadFunction);
} else {
   window.onload = loadFunction;
}
