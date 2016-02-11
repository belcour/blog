// 'addLoadEvent' enables to add another load function when 'window.onload'
// is called. However, this function is only defined when this script is
// inlined. It is better to check whether this function exists or not before
// calling it:
//
//    if(addLoadEvent) addLoadEvent(new_function);
//
addLoadEvent = function(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      if (oldonload) {
        oldonload();
      }
      func();
    }
  }
}

// 'initWebGL' creates a webgl context in 'canvas'
//
initWebGL = function(canvas) {

   if(canvas == null) {
      alert("Incorrect passed canvas.");
   }

   var gl = null;
   try {
      gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
   } catch(e) {}

   if (!gl) {
      alert("Could not init WebGL context.");
   }

   return gl;
}

// 'getShader' loads a shader from a text <script> element in the DOM
// at using its id: 'id'. It creates a shader from it and compiles it
// using the 'gl' context. A replacement string can be provided to
// change some part of the shader.
// 
getShader = function(id, gl, replacement) {
    // Load the DOM element containing the shader using the provided 'id'
    var shaderDOM = document.getElementById(id);
    if (!shaderDOM) {
        console.log("Unable to access DOM element '" + id + "'");
        return null;
    }

    // Load the shader source
    var shaderSrc = '';
    var currChild = shaderDOM.firstChild;
    while(currChild) {
        if(currChild.nodeType == currChild.TEXT_NODE) {
        shaderSrc += currChild.textContent;
        }
        currChild = currChild.nextSibling;
    }
    if(replacement)
    shaderSrc = shaderSrc.replace(/\#intersect/g, replacement);

    // Create a shader using the GL context
    var shader;
    if (shaderDOM.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderDOM.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        console.log("Do not handle " + shaderDOM.type + " as a shader");
    }
    gl.shaderSource(shader, shaderSrc);
    gl.compileShader(shader);

    if (shader && !gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(shader));
    }
    return shader;
}