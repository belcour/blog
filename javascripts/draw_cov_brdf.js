loadFunctionBrdf = function() {

   // WebGL code
   var canvas = document.getElementById("draw_cov_brdf-gl");
   if(!canvas) {
      alert("Impossible de récupérer le canvas");
   }

//    getShader = function(id, gl, replacement=null) {
//       // Load the DOM element containing the shader using the provided 'id'
//       var shaderDOM = document.getElementById(id);
//       if (!shaderDOM) {
//          console.log("Unable to access DOM element '" + id + "'");
//          return null;
//       }

//       // Load the shader source
//       var shaderSrc = '';
//       var currChild = shaderDOM.firstChild;
//       while(currChild) {
//          if(currChild.nodeType == currChild.TEXT_NODE) {
//             shaderSrc += currChild.textContent;
//          }
//          currChild = currChild.nextSibling;
//       }
//       if(replacement)
//         shaderSrc = shaderSrc.replace(/\#intersect/g, replacement);

//       // Create a shader using the GL context
//       var shader;
//       if (shaderDOM.type == "x-shader/x-fragment") {
//          shader = gl.createShader(gl.FRAGMENT_SHADER);
//       } else if (shaderDOM.type == "x-shader/x-vertex") {
//          shader = gl.createShader(gl.VERTEX_SHADER);
//       } else {
//          console.log("Do not handle " + shaderDOM.type + " as a shader");
//       }
//       gl.shaderSource(shader, shaderSrc);
//       gl.compileShader(shader);

//       if (shader && !gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
//          console.log(gl.getShaderInfoLog(shader));
//       }
//       return shader;
//    }

   createProgram = function(gl, vShader, fShader) {
      var program = gl.createProgram();
      gl.attachShader(program, vShader);
      gl.attachShader(program, fShader);
      gl.linkProgram(program);
      gl.useProgram(program);

      var vPos = gl.getAttribLocation(program, "vertexPos");
      gl.enableVertexAttribArray(vPos);

      return program;
   }

   var gl = initWebGL(canvas);
   if (gl) {
       
      // Light and geometry
      var intersectStr = "   float scale = 1.0E2;\n" + 
                         "   intersectPlane(vec2(-10.0, 0.0), vec2(10.0, 0.0), o, d, t, n, p);\n" + 
                         "   intersectLight(vec2(-1.0, 0.5), vec2(-0.5, 1.0), scale, o, d, t, n, rgb);\n";

      // Load the vertex and pixel shaders
      var vShader = getShader('raytracer2d-vs', gl);
      var fShader = getShader('raytracer2d-fs', gl, intersectStr);
      if(!vShader || !fShader) { return; }
      var program = createProgram(gl, vShader, fShader);
      if(!program) { return; }
      gl.useProgram(program);

      gl.viewport(0, 0, canvas.width, canvas.height);
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

      drawBRDF = function() {
         gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
         gl.useProgram(program);

         var uniformResX = gl.getUniformLocation(program, "resX");
         gl.uniform1f(uniformResX, canvas.width);
         var uniformResY = gl.getUniformLocation(program, "resY");
         gl.uniform1f(uniformResY, canvas.height);
         
         var uniformOrg = gl.getUniformLocation(program, "origin");
         gl.uniform2f(uniformOrg, 0.75, 0.75);
         var uniformDir = gl.getUniformLocation(program, "direction");
         gl.uniform2f(uniformDir, -0.75, -0.75);
         var uniformUp  = gl.getUniformLocation(program, "up");
         gl.uniform2f(uniformUp,  0.75, -0.75);

         var vPosAttribute = gl.getAttribLocation(program, "vertexPos");
         gl.enableVertexAttribArray(vPosAttribute);

         gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
         gl.vertexAttribPointer(vPosAttribute, 3, gl.FLOAT, false, 0, 0);
         gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      drawBRDF();
   } else {
      console.log("Unable to init WebGL context");
   }
}

addLoadEvent(loadFunctionBrdf);
