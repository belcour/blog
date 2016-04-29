
loadFunctionOcclusion = function() {

   // WebGL code
   var occl_canvas = document.getElementById("draw_cov_occl-gl");
   if(!occl_canvas) {
      alert("Impossible de récupérer le canvas");
   }

   var gl = initWebGL(occl_canvas);
   if (gl) {
      gl.viewport(0, 0, occl_canvas.width, occl_canvas.height);
      gl.clearColor(1.0, 1.0, 1.0, 1.0);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

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

      // Light and geometry
      var intersectStr = "   float scale = 1.0E2;\n" +
                         "   intersectPlane(vec2(0.0, -0.4), vec2(0.0, 0.4), o, d, t, n, p);\n" +
                         "   intersectLight(vec2(1.0E-3, -0.5), vec2(1.0E-3, 0.5), scale, org, dir, t, n, rgb);\n";

      // Create shaders
      var program = gl.createProgram();
      var vshader = getShader('raytracer2d-vs', gl);
      var fshader = getShader('raytracer2d-fs', gl, intersectStr);

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

      var distToLight = 1.1;

      drawOcclusion = function() {
         gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
         gl.useProgram(program);

         var uniformResX = gl.getUniformLocation(program, "resX");
         gl.uniform1f(uniformResX, occl_canvas.width);
         var uniformResY = gl.getUniformLocation(program, "resY");
         gl.uniform1f(uniformResY, occl_canvas.height);

         var uniformOrg = gl.getUniformLocation(program, "origin");
         gl.uniform2f(uniformOrg, -distToLight, 0.0);
         var uniformDir = gl.getUniformLocation(program, "direction");
         gl.uniform2f(uniformDir, 1.0, 0.0);
         var uniformUp  = gl.getUniformLocation(program, "up");
         gl.uniform2f(uniformUp,  0.0, 1.0);

         var vPosAttribute = gl.getAttribLocation(program, "vertexPos");
         gl.enableVertexAttribArray(vPosAttribute);

         gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
         gl.vertexAttribPointer(vPosAttribute, 3, gl.FLOAT, false, 0, 0);
         gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      drawOcclusion();

//      // SVG drawing code
//      var tr_svg = document.getElementById('draw_cov_occl-cv');
//      var svg    = tr_svg.contentDocument;
//      var cursor = svg.getElementById("cursor");
//      var ray    = svg.getElementById("ray");
//
//      var rayStart = ray.pathSegList.getItem(0);
//      var rayEnd   = ray.pathSegList.getItem(1);
//      var dirX = rayEnd.x - rayStart.x;
//      var dirY = rayEnd.y - rayStart.y;
//      var rayDirNorm = Math.sqrt(dirX*dirX + dirY*dirY);
//      dirX /= rayDirNorm;
//      dirY /= rayDirNorm;
//
//      var currentX = 0;
//      var currentY = 0;
//      var isDown = false;
//
//      svg.addEventListener('mousedown', function(evt) {
//         isDown = true;
//         currentX = evt.clientX;
//         currentY = evt.clientY;
//      }, false);
//      svg.addEventListener('mouseup', function(evt) {
//         isDown = false;
//      }, false);
//      svg.addEventListener('mouseout', function(evt) {
//         isDown = false;
//      }, false);
//      svg.addEventListener('mousemove', function(evt) {
//         if(isDown) {
//            var deltaX = evt.clientX - currentX;
//            var deltaY = evt.clientY - currentY;
//            currentX = evt.clientX;
//            currentY = evt.clientY;
//
//            var rayStart = cursor.pathSegList.getItem(0);
//            var rayEnd   = cursor.pathSegList.getItem(1);
//            var dotProd  = deltaX*dirX + deltaY*dirY;
//
//            var temp = distToLight + dotProd/200;
//            if(temp > 0 && temp < 1.0) {
//               distToLight = temp;
//               rayStart.x += dotProd*dirX;
//               rayStart.y += dotProd*dirY;
//               rayEnd.x += dotProd*dirX;
//               rayEnd.y += dotProd*dirY;
//            }
//         }
//         drawTravel();
//      }, false);
   }
}

addLoadEvent(loadFunctionOcclusion);
