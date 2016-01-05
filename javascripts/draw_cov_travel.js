
loadFunction = function() {

   // WebGL code
   var tr_canvas = document.getElementById("draw_cov_travel-gl");
   if(!tr_canvas) {
      alert("Impossible de récupérer le canvas");
   }

   var gl = initWebGL(tr_canvas);
   if (gl) {
      gl.viewport(0, 0, tr_canvas.width, tr_canvas.height);
      gl.clearColor(1.0, 1.0, 1.0, 1.0);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);

      // Geometry
      var vertices = [
          1.0,   1.0,  0.0,
         -1.0,   1.0,  0.0,
          1.0,  -1.0,  0.0,
         -1.0,  -1.0,  0.0
      ];
      var vBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

      // Create shaders
      var program = gl.createProgram();
      var fshader = loadFragmentShader(gl);
      var vshader = loadVertexShader(gl);

      if(vshader == null || fshader == null) {
         alert("Shaders are not compiled");
         return;
      }
      gl.attachShader(program, vshader);
      gl.attachShader(program, fshader);
      gl.linkProgram(program);

      if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
         alert("Unable to initialize the shader program.");
         return;
      }

      var distToLight = 0.0;

      draw = function() {
         gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
         gl.useProgram(program);

         var uniformResX = gl.getUniformLocation(program, "resX");
         gl.uniform1f(uniformResX, tr_canvas.width);
         var uniformResY = gl.getUniformLocation(program, "resY");
         gl.uniform1f(uniformResY, tr_canvas.height);
         var uniformDist = gl.getUniformLocation(program, "distToSource");
         gl.uniform1f(uniformDist, distToLight);

         var vPosAttribute = gl.getAttribLocation(program, "vertexPos");
         gl.enableVertexAttribArray(vPosAttribute);

         gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
         gl.vertexAttribPointer(vPosAttribute, 3, gl.FLOAT, false, 0, 0);
         gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      draw();

      // SVG drawing code
      var tr_svg = document.getElementById('draw_cov_travel-cv');
      var svg    = tr_svg.contentDocument;
      var cursor = svg.getElementById("cursor");
      var ray    = svg.getElementById("ray");
   
      var rayStart = ray.pathSegList.getItem(0);
      var rayEnd   = ray.pathSegList.getItem(1);
      var dirX = rayEnd.x - rayStart.x;
      var dirY = rayEnd.y - rayStart.y;
      var rayDirNorm = Math.sqrt(dirX*dirX + dirY*dirY);
      dirX /= rayDirNorm;
      dirY /= rayDirNorm;
   
      var currentX = 0;
      var currentY = 0;
      var curT = cursor.pathSegList.getItem(0);
      var isDown = false;
   
      svg.addEventListener('mousedown', function(evt) {
         isDown = true;
         currentX = evt.clientX;
         currentY = evt.clientY;
      }, false);
      svg.addEventListener('mouseup', function(evt) {
         isDown = false;
      }, false);
      svg.addEventListener('mouseout', function(evt) {
         isDown = false;
      }, false);
      svg.addEventListener('mousemove', function(evt) {
         if(isDown) {
            var deltaX = evt.clientX - currentX;
            var deltaY = evt.clientY - currentY;
            currentX = evt.clientX;
            currentY = evt.clientY;
   
            var rayStart = cursor.pathSegList.getItem(0);
            var rayEnd   = cursor.pathSegList.getItem(1);
            var dotProd  = deltaX*dirX + deltaY*dirY;
   
            var temp = distToLight + dotProd/200;
            if(temp > 0 && temp < 1.0) {
               distToLight = temp;
               rayStart.x += dotProd*dirX;
               rayStart.y += dotProd*dirY;
               rayEnd.x += dotProd*dirX;
               rayEnd.y += dotProd*dirY;
            }
         }
         draw();
      }, false);
   }
}

loadFragmentShader = function(gl) {

   // Fragment shader code
   var source = '' +
      'precision mediump float;' +
      '' +
      'uniform float resX;' +
      'uniform float resY;' +
      'uniform float distToSource;' +
      '' +
      'void main(void) {' +
      '  vec2 xu = 2.0*vec2(gl_FragCoord.x/resX - 0.5, gl_FragCoord.y/resY - 0.5);' +
      '  vec2 XU = vec2(xu.x - (distToSource*xu.y), xu.y);' +
      '  float light = exp(-0.5*(XU.x*XU.x)/0.01) + 0.1;' +
      '  gl_FragColor = vec4(light, light, light, 1.0);' +
      '}';

   var shader = gl.createShader(gl.FRAGMENT_SHADER);
   gl.shaderSource(shader, source);
   gl.compileShader(shader);
   if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert('An error occurred compiling the shaders: ' +
            gl.getShaderInfoLog(shader));
      return null;
   }
   return shader;
}

loadVertexShader = function(gl) {

   // Fragment shader code
   var source = '' +
      'attribute vec3 vertexPos;' +
      '' +
      'void main(void) {' +
      '  gl_Position = vec4(vertexPos, 1.0);' +
      '}';

   var shader = gl.createShader(gl.VERTEX_SHADER);
   gl.shaderSource(shader, source);
   gl.compileShader(shader);
   if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert('An error occurred compiling the shaders: ' +
            gl.getShaderInfoLog(shader));
      return null;
   }
   return shader;
}

if(addLoadEvent) {
   addLoadEvent(loadFunction);
} else {
   window.onload = loadFunction;
}
