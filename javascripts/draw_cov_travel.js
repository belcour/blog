
loadFunctionTravel = function() {

   // WebGL code
   var tr_canvas = document.getElementById("draw_cov_travel-gl");
   if(!tr_canvas) {
      alert("Impossible de récupérer le canvas");
   }

   var h = 64, w = 64;
   tr_canvas.width  = w;
   tr_canvas.height = h;

   scene = createScene();
   addObject(scene, {p1 : {x: 1.0, y: -0.5}, p2 : {x: 1.0, y: 0.5}, L : 1.0});
   addCamera(scene, {o: {x: -0.5, y: 0.0}, d: {x: 1.0, y: 0.0}, up : {x: 0.0, y:1.0}});

   var distToLight = 0.0;
   scene.camera.o.x = -distToLight;

   function render_fourier() {
      FFT.init(w);
      FrequencyFilter.init(w);
      var src = tr_canvas.getContext('2d').getImageData(0, 0, w, h);
      var dat = src.data;
      var re = [], im = [];
      for(var y=0; y<h; y++) {
         var i = y*w;
         for(var x=0; x<w; x++) {
            var W = Math.cos(Math.PI * (y/h-0.5)) * Math.cos(Math.PI * (x/w-0.5));
            var L = dat[(i << 2) + (x << 2) + 0] 
                  + dat[(i << 2) + (x << 2) + 1]
                  + dat[(i << 2) + (x << 2) + 2];
            re[i + x] = W*L;
            im[i + x] = 0.0;
         }
      }
      FFT.fft2d(re, im);
      FrequencyFilter.swap(re, im);

      var tr_spectrum = document.querySelector('#draw_cov_travel-gl').getContext('2d');
      SpectrumViewer.init(tr_spectrum);
      SpectrumViewer.render(re, im);
   }
   
   var fourier_bt_press = false;

   render(tr_canvas, scene, 0);
   if(fourier_bt_press) {
      render_fourier();
   }
   
   var button = document.getElementById("draw_cov_travel_bt");
   button.onclick = function() {
      fourier_bt_press = !fourier_bt_press;
      render(tr_canvas, scene, 0);
      if(fourier_bt_press) {
            render_fourier();
      }
   };


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
         scene.camera.o.x = -5*distToLight;
         render(tr_canvas, scene, 0);
         if(fourier_bt_press) {
            render_fourier();
         }
      }, false);
/*
   var gl = initWebGL(tr_canvas);
   if (gl) {
      gl.viewport(0, 0, tr_canvas.width, tr_canvas.height);
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

      var distToLight = 0.0;

      drawTravel = function() {
         gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
         gl.useProgram(program);

         var uniformResX = gl.getUniformLocation(program, "resX");
         gl.uniform1f(uniformResX, tr_canvas.width);
         var uniformResY = gl.getUniformLocation(program, "resY");
         gl.uniform1f(uniformResY, tr_canvas.height);

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
      drawTravel();

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
         drawTravel();
      }, false);
   }
*/
}

addLoadEvent(loadFunctionTravel);
