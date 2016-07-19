data = {};

function getData(ctx, id) {
   if(data[ctx]) {
      return data[ctx][id];
   } else {
      return undefined;
   }
}

function setData(ctx, id, dat) {
   if(data[ctx] == undefined) {
      data[ctx] = [];
   }

   data[ctx][id] = dat;
}

const loadSVG = function(uri, elem, call) {
   var base = getData("general", "baseurl");
   if(base == undefined) {
      base = "";
   }
   Snap.load(base + uri, function (f) {
      var s = Snap(elem);
      s.append(f);

      if(call != undefined && call != null) { call(s); }
   });
}

const loadElementFromSVG = function(uri, svgid, elem, call) {
   Snap.load(getData("general", "baseurl") + uri, function (f) {
      var s = Snap(svgid);
      s.append(f.select("defs"));
      s.append(f.select(elem));

      if(call != undefined && call != null) { call(s); }
   });
}

const loadImageSVG = function(uri, elem, width, height, id) {
      var snap  = Snap(elem);
      var group = snap.g();
      group.image(getData("general", "baseurl") + uri, 0, 0, width, height);
      group.attr({id: id});
}


/* Manipulate SVG elements using snap */

const CenterElement = function(snap, element) {
   var gbox = snap.getBBox();
   var ebox = element.getBBox();

   // Calculate the shift in x and y to center the element in the snap
   var x = gbox.width - ebox.cx;
   var y = gbox.height - ebox.cy;

   // Shift using the compound transform
   var tr = Snap.matrix().translate(x, y);
   element.transform(tr.add(element.transform().localMatrix));
}


/* Signal processing example: Nyquist rate */

var filterNyquist01 = function(snap, coeffs, shifts, x0, y0, w, h, bwCut, orient, style) {
   var arrow = snap.polygon([0,5, 4,5, 2,0, 0,5]).attr({fill: '#000'}).transform('r90');
   var bar = snap.path("M -5.0,-5.0 L -5.0,5.0 L 5.0,5.0 L 5.0,-5.0 L -5.0,-5.0 z").attr({fill: '#f00'});
   var marker = arrow.marker(0,0, 5,5, 0,2.5).attr({id: "marker"});
   var endB = bar.marker(0,0, 5,5, 2.5,2.5).attr({id: "endB"});
   var curveC = "M" + x0 + " " + y0;
   var curve = (x0+0.5*w) + " " + (y0-coeffs[0]*h);
   var N = coeffs.length;
   for(var i=1; i<N; i++) {
      var dx  = i / (N-1);
      var dy  = (i < bwCut) ? coeffs[i] : 0;//Math.random() /(1.0+10*Math.pow(dx-0.5, 2));
      // if(Math.abs(dx-0.5) < 0.001) { dy = 1; }
      // var exp = (Math.exp(-0.5 * sigma * Math.pow(dx - 0.5, 2)));
      var xi = x0 + w*dx;
      var yi = y0 - h*dy;//exp;

      //curveC += " " + xi + " " + (y0-h*exp*dy);
      curve   = (x0+0.5*w*(1-dx)) + " " + yi + " " + curve + " " + (x0+0.5*w*(1+dx)) + " " + yi;
   }
   curve = "M " + curve;
   var pathC = snap.path(curve).attr({fillOpacity: 0, stroke: "#0000ff", strokeWidth: 2});

   // Frame
   var absc1 = snap.line(x0, y0, x0+w, y0);
   absc1.attr({stroke: "#000000", strokeWidth: 2, markerEnd: marker});
   var ord1 = snap.line(x0+w/2, y0, x0+w/2, y0-h-20);
   ord1.attr({stroke: "#000000", strokeWidth: 2, markerEnd: marker});
   var textA = snap.text(x0+w/2+10, y0+30, "Fourier transform").attr({fill: "#000000", fontSize: "0.6em", textAnchor: "middle"});

   // Bandwidth
   var bwX0  = x0+0.5*w*(1 - bwCut/(coeffs.length-1));
   var bwW   = w*bwCut/(coeffs.length-1);
   var textB = snap.text(bwX0+0.75*bwW, y0-h/2-15, "Bandwidth").attr({fill: "#ff0000", fontSize: "0.5em", textAnchor: "middle"});
   var bandP = snap.path("M " + (x0+w/2) + " " + (y0-h/2) + " " + (bwX0+bwW) + " " + (y0-h/2));
   bandP.attr({strokeWidth: 2, stroke: "#ff0000", markerEnd: endB, markerStart: endB});

   var box  = snap.rect(bwX0, y0-h, bwW, h).attr({fill: "#aaaaaa", fillOpacity: 0.3});

   var cutBwDrag = function(dx, dy, x, y, event) {
      var nBwW = bwW + dx;
      bwCut = Math.min(Math.max(nBwW*(coeffs.length-1) / w, 0), coeffs.length);

      snap.clear();
      filterNyquist01(snap, coeffs, shifts, 420, 420, 380, 380, bwCut);
      samplingNyquist01(snap, coeffs, shifts, 0, 420, 380, 380, bwCut);
   }

   box.drag(cutBwDrag);

   var grou = snap.g(box, pathC, absc1, ord1, textA, textB, bandP);
   return grou;
}

const evalSignalNyquist01 = function(coeffs, shifts, bwCut, dx) {
   var dy = 0;
   for(var k=0; k<Math.min(bwCut, coeffs.length); k++) {
      dy += coeffs[k] * Math.cos(2 * 3.14 * k * (dx + shifts[k]));
   }
   return dy;
}

const samplingNyquist01 = function(snap, coeffs, shifts, x0, y0, w, h, bwCut) {

   // Frame
   var absc1 = snap.line(x0, y0, x0+w, y0);
   absc1.attr({stroke: "#000000", strokeWidth: 2, markerEnd: snap.select("#marker")});
   var ord1 = snap.line(x0+w/2, y0, x0+w/2, y0-h-20);
   ord1.attr({stroke: "#000000", strokeWidth: 2, markerEnd: snap.select("#marker")});
   var textA = snap.text(x0+w/2+10, y0+30, "Signal").attr({fill: "#000000", fontSize: "0.6em", textAnchor: "middle"});

   // Norm of the signal, needed to scale done the diagram
   var ymax = 0;
   for(var i=0; i<coeffs.length; i++) {
      ymax += coeffs[i]*coeffs[i];
   }
   ymax = Math.sqrt(ymax);

   // Signal
   var curve = "M";
   const N  = 200;
   var   P  = new Array();
   for(var i=0; i<N; ++i) {
      var dx = i / (N-1);
      var dy = evalSignalNyquist01(coeffs, shifts, bwCut, dx);
      var xi = x0 + w*dx;
      var yi = y0 - 0.5*h - 0.5*h*(1-dy)/ymax;

      curve += " " + xi + " " + (yi);
      P.push(xi);
      P.push(yi);
   }
   var path = snap.polyline(P);
   path.attr({fillOpacity: 0, stroke: "#0000ff", strokeWidth: 2});

   // Sampling of the signal
   var Ns = bwCut; // Number of samples
   for(var k=0; k<=Ns; k++) {
      var dx = k/(Ns);
      var x  = x0+w*dx
      var dy = evalSignalNyquist01(coeffs, shifts, bwCut, dx);
      var y  = y0 - 0.5*h - 0.5*h*(1-dy)/ymax;


      if(k == Ns/2+1) {
         var dk  = w/Ns;
         var dy2 = evalSignalNyquist01(coeffs, shifts, bwCut, dx+dk);
         var y2  = y0 - 0.5*h - 0.5*h*(1-dy2)/ymax;
         snap.polyline([x, y0, x, y0-h-10]).attr({opacity: 0.5, stroke: "#0000ff", strokeWidth: 2});
         snap.polyline([x+dk, y0, x+dk, y0-h-10]).attr({opacity: 0.5, stroke: "#0000ff", strokeWidth: 2});
         snap.polyline([x, y0-h, x+dk, y0-h]).attr({opacity: 0.5, stroke: "#0000ff", strokeWidth: 2});
         snap.text(x+dk/2, y0-h-10, "d").attr({textAnchor: "middle", fontSize: "0.6em"});
      }

      snap.circle(x, y, 5).attr({fill: "#ffffff", fillOpacity: 0, stroke: "#ff0000", strokeWidth: 2});
   }
}

const createNyquist01 = function(snap) {

   // Initial bwCut
   var bwCut  = 10;

   // Create the function using random cosines
   var N = 20;
   var coeffs = new Array();
   var shifts = new Array();
   coeffs.push(1);
   shifts.push(0);
   for(var k=1; k<N; k++) {
      shifts.push(Math.random());
      // if(k < bwCut) {
         coeffs.push(Math.random() / (k));
      // } else {
      //    coeffs.push(0);
      // }
   }

   filterNyquist01(snap, coeffs, shifts, 420, 420, 380, 380, bwCut);
   samplingNyquist01(snap, coeffs, shifts, 0, 420, 380, 380, bwCut);
}

/* Fourier Transform part */

const createFourierTransform01 = function(snap) {
      // Position of the input image
      var bbox    = snap.select("#image").getBBox();
      var img_cnv = document.getElementById("fourier-transform-01-img");
      var img_ctx = img_cnv.getContext('2d');
      img_cnv.style.width  = bbox.width + "px";
      img_cnv.style.height = bbox.height + "px";
      img_cnv.style.left   = bbox.x + "px";
      img_cnv.style.top    = bbox.y + "px";
      img_cnv.style.backgroundColor = "#F0F";

      // Reconstructed image
      var rec_cnv = document.getElementById("fourier-transform-01-rec");
      var rec_ctx = rec_cnv.getContext('2d');
      rec_cnv.style.width  = bbox.width + "px";
      rec_cnv.style.height = bbox.height + "px";
      rec_cnv.style.left   = bbox.x + "px";
      rec_cnv.style.top    = bbox.y + "px";
      rec_cnv.style.backgroundColor = "#F0F";
      rec_ctx.fillStyle = '#ffffff';
      rec_ctx.fillRect(0, 0, rec_ctx.canvas.width, rec_ctx.canvas.height);

      // Position of the fourier spectrum
      var bbox    = snap.select("#fourier").getBBox();
      var fft_cnv = document.getElementById("fourier-transform-01-fft");
      var fft_ctx = fft_cnv.getContext('2d');
      fft_cnv.style.width  = bbox.width + "px";
      fft_cnv.style.height = bbox.height + "px";
      fft_cnv.style.left   = bbox.x + "px";
      fft_cnv.style.top    = bbox.y + "px";
      fft_cnv.style.backgroundColor = "#FFF";
      fft_ctx.fillStyle = '#ffffff';
      fft_ctx.fillRect(0, 0, fft_ctx.canvas.width, fft_ctx.canvas.height);

      // Load the image and display it
      const h = 128, w = 128;
      var image   = new Image(w, h);
      image.src = getData("general", "baseurl") + getData("fft01", "img-url");
      image.addEventListener('load', function() {
            img_ctx.drawImage(image, 0, 0, w, h);

            var updateFilter = function(radius) {
                  // Compute the FFT of the image
                  FFT.init(w);
                  FrequencyFilter.init(w);
                  SpectrumViewer.init(fft_ctx);
                  var src = img_ctx.getImageData(0, 0, w, h);
                  var dat = src.data;
                  var re = [], im = [];
                  for(var y=0; y<h; y++) {
                        var i = y*w;
                        for(var x=0; x<w; x++) {
                        var L = dat[(i << 2) + (x << 2) + 0]
                              + dat[(i << 2) + (x << 2) + 1]
                              + dat[(i << 2) + (x << 2) + 2];
                        re[i + x] = L / 3.0;
                        im[i + x] = 0.0;
                        }
                  }
                  FFT.fft2d(re, im);
                  FrequencyFilter.swap(re, im);

                  // Draw spectrum
                  SpectrumViewer.render(re, im, false, 100);

                  FrequencyFilter.LPF(re, im, radius);
                  FrequencyFilter.swap(re, im);
                  FFT.ifft2d(re, im);
                  for(var y=0; y<h; y++) {
                        var i = y*w;
                        for(var x=0; x<w; x++) {
                              var val = re[i + x];
                              val = val > 255 ? 255 : val < 0 ? 0 : val;
                              var p   = (i << 2) + (x << 2);
                              dat[p] = dat[p + 1] = dat[p + 2] = val;
                        }
                  }
                  rec_ctx.putImageData(src, 0, 0);
                  rec_cnv.style.zIndex = "2";
            }

            updateFilter(200);
            snap.select("#zone0").attr({opacity: 0, fillOpacity: 0, stroke: "#ffffff", strokeWidth: "1px", strokeDasharray: "1,2", strokeLinecap: "round"});
            snap.select("#zone1").attr({opacity: 0, fillOpacity: 0, stroke: "#ffffff", strokeWidth: "1px", strokeDasharray: "1,2", strokeLinecap: "round"});
            snap.select("#zone2").attr({opacity: 0, fillOpacity: 0, stroke: "#ffffff", strokeWidth: "1px", strokeDasharray: "1,2", strokeLinecap: "round"});

            snap.select("#zone0").node.onclick = function() {
                  updateFilter(4);
                  snap.select("#zone0").attr({stroke: "#ff0000"});
                  snap.select("#zone1").attr({stroke: "#ffffff"});
                  snap.select("#zone2").attr({stroke: "#ffffff"});
            };
            snap.select("#zone1").node.onclick = function() {
                  updateFilter(40);
                  snap.select("#zone0").attr({stroke: "#ffffff"});
                  snap.select("#zone1").attr({stroke: "#ff0000"});
                  snap.select("#zone2").attr({stroke: "#ffffff"});
            };
            snap.select("#zone2").node.onclick = function() {
                  updateFilter(128);
                  snap.select("#zone0").attr({stroke: "#ffffff"});
                  snap.select("#zone1").attr({stroke: "#ffffff"});
                  snap.select("#zone2").attr({stroke: "#ff0000"});
            };
      });
}

var showZonesFourierTransform01 = function(offset) {
      var snap = Snap("#fourier-transform-01-svg")
      if(offset > 0) {
            snap.select("#zone0").attr({opacity: 0.7, fillOpacity: 0.3});
            snap.select("#zone1").attr({opacity: 0.7, fillOpacity: 0.3});
            snap.select("#zone2").attr({opacity: 0.7, fillOpacity: 0.3});
      } else {
            snap.select("#zone0").attr({opacity: 0, fillOpacity: 0});
            snap.select("#zone1").attr({opacity: 0, fillOpacity: 0});
            snap.select("#zone2").attr({opacity: 0, fillOpacity: 0});
      }
}


/* Rendering Equation part */

var renderingEquation00Step01 = function(offset) {
   var snap = Snap("#rendering-equation-00");
   if(offset > 0) {
      snap.select("#eye").attr({  opacity: 1.0});
      snap.select("#eyeT").attr({ opacity: 1.0});
   } else {
      snap.select("#eye").attr({  opacity: 0.0});
      snap.select("#eyeT").attr({ opacity: 0.0});
   }
}
var renderingEquation00Step02 = function(offset) {
   var snap = Snap("#rendering-equation-00");
   if(offset > 0) {
      snap.select("#light").attr({  opacity: 1.0});
      snap.select("#lightT").attr({ opacity: 1.0});
   } else {
      snap.select("#light").attr({  opacity: 0.0});
      snap.select("#lightT").attr({ opacity: 0.0});
   }
}
var renderingEquation00Step03 = function(offset) {
   var snap = Snap("#rendering-equation-00");
   if(offset > 0) {
      snap.select("#geometry").attr({  opacity: 1.0});
      snap.select("#geomT").attr({ opacity: 1.0});
   } else {
      snap.select("#geometry").attr({  opacity: 0.0});
      snap.select("#geomT").attr({ opacity: 0.0});
   }
}
var renderingEquation00Step04 = function(offset) {
   var snap = Snap("#rendering-equation-00");
   if(offset > 0) {
      snap.select("#material").attr({  opacity: 1.0});
      snap.select("#matT").attr({ opacity: 1.0});
   } else {
      snap.select("#material").attr({  opacity: 0.0});
      snap.select("#matT").attr({ opacity: 0.0});
   }
}

var renderingEquation01Step00 = function(snap) {
   snap.select("feGaussianBlur").attr({ id: "feGaussianBlur00", stdDeviation: 0 });
   snap.select("#equation").attr({opacity: 0});
   snap.select("#inset").attr({opacity: 0});

   var eye  = snap.select("#eye").attr({opacity: 0});
   var eyeT = snap.text(120, 450, "eye").attr({ id: "eyeT", fontWeight: "bold", textAnchor: "middle", fontSize: "0.9em" }).attr({opacity: 0});
   //eye.insert(eyeT);

   var light  = snap.select("#light").attr({opacity: 0});
   var lightT = snap.text(850, 200, "light").attr({ id: "lightT", fontWeight: "bold", fill: "#ffd932", textAnchor: "middle", fontSize: "0.9em" }).attr({opacity: 0});

   var geom  = snap.select("#geometry").attr({opacity: 0});
   var geomT = snap.text(900, 640, "geometry").attr({ id: "geomT", fontWeight: "bold", textAnchor: "middle", fontSize: "0.9em" }).attr({opacity: 0});

   var mat  = snap.select("#material").attr({opacity: 0});
   var matT = snap.text(780, 350, "material").attr({ id: "matT", fontWeight: "bold", textAnchor: "middle", fontSize: "0.9em" }).attr({opacity: 0});
}
var renderingEquation01Step01 = function(snap) {

   // Change the filter and opacity
   //snap.select("filter7119").attr({ id: "fileRE01" });
   snap.select("feGaussianBlur").attr({ stdDeviation: 10 });
   snap.select("#background").attr({ opacity: 0.1});

   // Inset elements
   snap.select("#inset").attr({opacity: 0});
   snap.select("#indirect").attr({opacity: 0});

   // Add labels
   var t1 = snap.text(125, 420, "outgoing radiance").attr({ fill: "#008000", fontSize: "0.6em"});
   var r1 = snap.rect(140, 325, 145, 60).attr({stroke: "#008000", fillOpacity: 0, strokeWidth: "2px"});
   snap.g(t1, r1).attr({id : "radiance", opacity: 0});

   var t2 = snap.text(313, 300, "emitted radiance").attr({ fill: "#FFD700", fontSize: "0.6em"});
   var r2 = snap.rect(325, 325, 155, 60).attr({stroke: "#FFD700", fillOpacity: 0, strokeWidth: "2px"});
   snap.g(t2, r2).attr({id : "emission", opacity: 0});

   var t3 = snap.text(740, 300, "reflected radiance").attr({ fill: "#008000", fontSize: "0.6em"});
   var r3 = snap.rect(520, 310, 620, 100).attr({stroke: "#008000", fillOpacity: 0, strokeWidth: "2px"});
   snap.g(t3, r3).attr({id : "reflected", opacity: 0});

   var t4 = snap.text(615, 300, "material").attr({ fill: "#A52A2A", id: "material", fontSize: "0.6em"});
   var r4 = snap.rect(570, 325, 185, 60).attr({stroke: "#A52A2A", fillOpacity: 0, strokeWidth: "2px"});
   snap.g(t4, r4).attr({id : "materialInset", opacity: 0});
}
var renderingEquation01Step02 = function(offset) {
   var snap      = Snap("#rendering-equation-01");
   var inset     = snap.select("#inset");
   var radiance  = snap.select("#radiance");
   if(offset > 0) {
      Snap.animate(0, 1, function( value ) { inset.attr({ opacity: value})}, 500);
      Snap.animate(0, 1, function( value ) { radiance.attr({ opacity: value})}, 500);
   } else {
      Snap.animate(1, 0, function( value ) { inset.attr({ opacity: value})}, 500);
      Snap.animate(1, 0, function( value ) { radiance.attr({ opacity: value})}, 500);
   }
}

var renderingEquation01Step03 = function(offset) {
   var snap   = Snap("#rendering-equation-01");
   var label1 = snap.select("#emission");
   var label2 = snap.select("#radiance");
   if(offset > 0) {
      Snap.animate(0, 1, function( value ) { label1.attr({ opacity: value})}, 500);
      Snap.animate(1, 0, function( value ) { label2.attr({ opacity: value})}, 500);
   } else {
      Snap.animate(1, 0, function( value ) { label1.attr({ opacity: value})}, 500);
      Snap.animate(0, 1, function( value ) { label2.attr({ opacity: value})}, 500);
   }
}

var renderingEquation01Step04 = function(offset) {
   var snap   = Snap("#rendering-equation-01");
   var label1 = snap.select("#reflected");
   var label2 = snap.select("#emission");
   var elem   = snap.select("#indirect");
   if(offset > 0) {
      Snap.animate(0, 1, function( value ) { label1.attr({ opacity: value})}, 500);
      Snap.animate(0, 1, function( value ) { elem.attr({ opacity: value})}, 500);
      Snap.animate(1, 0, function( value ) { label2.attr({ opacity: value})}, 500);
   } else {
      Snap.animate(1, 0, function( value ) { label1.attr({ opacity: value})}, 500);
      Snap.animate(1, 0, function( value ) { elem.attr({ opacity: value})}, 500);
      Snap.animate(0, 1, function( value ) { label2.attr({ opacity: value})}, 500);
   }
}

var renderingEquation01Step05 = function(offset) {
   var snap   = Snap("#rendering-equation-01");
   var label1 = snap.select("#materialInset");
   var label2 = snap.select("#reflected");
   if(offset > 0) {
      Snap.animate(0, 1, function( value ) { label1.attr({ opacity: value})}, 500);
      Snap.animate(1, 0, function( value ) { label2.attr({ opacity: value})}, 500);
   } else {
      Snap.animate(1, 0, function( value ) { label1.attr({ opacity: value})}, 500);
      Snap.animate(0, 1, function( value ) { label2.attr({ opacity: value})}, 500);
   }
}

var blurRenderingEquation01 = function(offset) {
   var snap   = Snap("#rendering-equation-01");
   var filter = snap.select("#filter");
   var fchild = filter.node.firstChild;
   var dragon = snap.select("#dragon");
   if(offset > 0) {
      dragon.attr({filter: filter});
      Snap.animate(0, 10, function( value ) { fchild.attributes[0].value = value + ',' + value;  }, 500 );
      Snap.animate(1, 0.5, function( value ) { dragon.attr({ opacity: value})}, 500);
   } else {
      dragon.attr({filter: filter});
      Snap.animate(10, 0, function( value ) { fchild.attributes[0].value = value + ',' + value;  }, 500 );
      Snap.animate(0.5, 1, function( value ) { dragon.attr({ opacity: value})}, 500);
   }
}

var showRenderingEquation01 = function(offset) {
    var elem = document.getElementById("rendering-equation-01-tex");
    if(offset > 0) {
      elem.display = "none";
    } else {
      elem.display = "block";
    }
}


/* Local Fourier analysis */

var updateLocalAnalysis01 = function(inset) {
   var img     = document.getElementById("local-analysis-01-img");
   var fft_img = document.getElementById(inset.canvas);
   var fft_ctx = fft_img.getContext('2d');

   var scale = img.naturalHeight / img.height;
   var ffth  = fft_img.width;
   var fftw  = fft_img.height;

   fft_ctx.drawImage(img, scale*inset.x, scale*inset.y, scale*inset.size, scale*inset.size, 0, 0, fftw, ffth);

   // Compute the FFT of the image
   w = 128;
   FFT.init(w);
   FrequencyFilter.init(w);
   SpectrumViewer.init(fft_ctx);
   var src = fft_ctx.getImageData(0, 0, w, w);
   var dat = src.data;
   var re = [], im = [];
   for(var y=0; y<w; y++) {
         var i = y*w;
         for(var x=0; x<w; x++) {
            var W = 1.0;//Math.sin(Math.PI * y/(w-1)) * Math.sin(Math.PI * x/(w-1));
            var L = dat[(i << 2) + (x << 2) + 0]
                  + dat[(i << 2) + (x << 2) + 1]
                  + dat[(i << 2) + (x << 2) + 2];
            re[i + x] = W*L / 3.0;
            im[i + x] = 0.0;
         }
   }

   FFT.fft2d(re, im);
   FrequencyFilter.swap(re, im);

   // Draw spectrum
   SpectrumViewer.render(re, im, false, 100);
}

var localAnalysis01CreateInset = function(imgId, inset, window) {
   var img = document.getElementById(imgId);

   var snap   = Snap("#local-analysis-01");
   var size   = inset.size;
   var scale  = window.size/size;
   var border = 8 / scale;
   var gloBorder   = snap.rect(-border, -border, 2*size+ 4*border, size + 2*border).attr({fill: "#ffffff", stroke: "#333333", strokeWidth: "1px", "vector-effect": "non-scaling-stroke", opacity: 0.8});
   var text1 = snap.text(size/2, size+5, "local window").attr({textAnchor: "middle", fontSize: "0.1em", fill: "#000000"});
   var text2 = snap.text(3*size/2+2*border, size+5 , "Fourier transform").attr({textAnchor: "middle", fontSize: "0.1em", fill: "#000000"});
   var insetImg    = snap.image(img.src, -15, -15, img.width, img.height).attr({id: "image"});
   var insetRect   = snap.rect(0,0, size, size).attr({fill: "#ffffff"});
   var insetBorder = insetRect.clone().attr({fillOpacity: 0, stroke: inset.color, strokeWidth: "2px", "vector-effect": "non-scaling-stroke"});
   var imageRect   = insetBorder.clone();
   var fourBorder  = insetBorder.clone().transform(Snap.matrix().translate(size+2*border, 0));
   fourBorder.attr({stroke: "#000000"});
   //insetImg.transform(Snap.matrix(1,0,0,1,10,20));
   insetImg.attr({clip: insetRect});
   var t = Snap.matrix().translate(window.x, window.y);
   t.add(Snap.matrix().scale(scale));
   var group = snap.g(gloBorder, insetImg, insetBorder , fourBorder, text1, text2);
   group.transform(t);

   t = Snap.matrix().translate(inset.x, inset.y);
   setData("local-analysis", "inset-t", t);
   //globalT = t.clone();
   imageRect.transform(t)
   insetRect.transform(t);
   insetImg.transform(t.invert());

   if(inset.canvas) {
      var canvas = document.getElementById(inset.canvas);
      var bbox   = fourBorder.getBBox();
      var transf = fourBorder.transform().totalMatrix;
      //console.log(transf);console.log(fourBorder.transform());
      var x = transf.x(bbox.x, bbox.y) - (window.size+15);
      var y = transf.y(bbox.x, bbox.y);
      var w = window.size;
      var h = window.size;
      //console.log(bbox.x + " " + bbox.y + " " + x + " " + y + " " + w + " " + h);
      canvas.style.width  = w + "px";
      canvas.style.height = h + "px";
      canvas.style.left   = x + "px";
      canvas.style.top    = y + "px";
   }
   updateLocalAnalysis01(inset);

   function dragInset(dx, dy, x, y, event) {
      var t = getData("local-analysis", "inset-t").clone();
      var s = 1;//Reveal.getScale();
      t.add(Snap.matrix().translate(dx/s, dy/s));
      imageRect.transform(t);
      insetRect.transform(t);
      insetImg.transform(t.invert());
      newinset = {x: inset.x + dx, y: inset.y + dy, size: inset.size, canvas: inset.canvas};
      updateLocalAnalysis01(newinset);
   }
   function dragStart(x, y, event) {
      setData("local-analysis", "inset-t", imageRect.transform().localMatrix);
   }
   function dragEnd(x, y, event) {
   }
   imageRect.drag(dragInset, dragStart, dragEnd);
}


var updateLocalAnalysis = function(imgId, inset) {
   var img     = document.getElementById(imgId);
   var fft_img = document.getElementById(inset.canvas);
   var fft_ctx = fft_img.getContext('2d');

   var scale = img.naturalHeight / img.height;
   var ffth  = fft_img.width;
   var fftw  = fft_img.height;

   fft_ctx.drawImage(img, scale*inset.x, scale*inset.y, scale*inset.size, scale*inset.size, 0, 0, fftw, ffth);

   // Compute the FFT of the image
   w = 128;
   FFT.init(w);
   FrequencyFilter.init(w);
   SpectrumViewer.init(fft_ctx);
   var src = fft_ctx.getImageData(0, 0, w, w);
   var dat = src.data;
   var re = [], im = [];
   for(var y=0; y<w; y++) {
         var i = y*w;
         for(var x=0; x<w; x++) {
            var W = 1.0;//Math.sin(Math.PI * y/(w-1)) * Math.sin(Math.PI * x/(w-1));
            var L = dat[(i << 2) + (x << 2) + 0]
                  + dat[(i << 2) + (x << 2) + 1]
                  + dat[(i << 2) + (x << 2) + 2];
            re[i + x] = W*L / 3.0;
            im[i + x] = 0.0;
         }
   }

   FFT.fft2d(re, im);
   FrequencyFilter.swap(re, im);

   // Draw spectrum
   SpectrumViewer.render(re, im, false, 100);
}

var localAnalysisCreateInset = function(snapId, imgId, inset, window) {
   var img = document.getElementById(imgId);

   var snap   = Snap(snapId);
   var size   = inset.size;
   var scale  = window.size/size;
   var border = 8 / scale;
   var gloBorder   = snap.rect(-border, -border, 2*size+ 4*border, size + 2*border).attr({fill: "#ffffff", stroke: "#333333", strokeWidth: "1px", "vector-effect": "non-scaling-stroke", opacity: 0.8});
   var text1 = snap.text(size/2, size+5, "local window").attr({textAnchor: "middle", fontSize: "0.1em", fill: "#000000"});
   var text2 = snap.text(3*size/2+2*border, size+5 , "Fourier transform").attr({textAnchor: "middle", fontSize: "0.1em", fill: "#000000"});
   var insetImg    = snap.image(img.src, 0, 0, img.width, img.height).attr({id: "image"});
   var insetRect   = snap.rect(0,0, size, size).attr({fill: "#ffffff"});
   var insetBorder = insetRect.clone().attr({fillOpacity: 0, stroke: inset.color, strokeWidth: "2px", "vector-effect": "non-scaling-stroke"});
   var imageRect   = insetBorder.clone();
   var fourBorder  = insetBorder.clone().transform(Snap.matrix().translate(size+2*border, 0));
   fourBorder.attr({stroke: "#000000"});
   //insetImg.transform(Snap.matrix(1,0,0,1,10,20));
   insetImg.attr({clip: insetRect});
   var t = Snap.matrix().translate(window.x, window.y);
   t.add(Snap.matrix().scale(scale));
   var group = snap.g(gloBorder, insetImg, insetBorder , fourBorder, text1, text2);
   group.transform(t);

   t = Snap.matrix().translate(inset.x, inset.y);
   setData(imgId, "inset-t", t);
   //globalT = t.clone();
   imageRect.transform(t)
   insetRect.transform(t);
   insetImg.transform(t.invert());

   if(inset.canvas) {
      var canvas = document.getElementById(inset.canvas);
      var bbox   = fourBorder.getBBox();
      var transf = fourBorder.transform().totalMatrix;
      //console.log(transf);console.log(fourBorder.transform());
      var x = transf.x(bbox.x, bbox.y) - (window.size+15);
      var y = transf.y(bbox.x, bbox.y);
      var w = window.size;
      var h = window.size;
      //console.log(bbox.x + " " + bbox.y + " " + x + " " + y + " " + w + " " + h);
      canvas.style.width  = w + "px";
      canvas.style.height = h + "px";
      canvas.style.left   = x + "px";
      canvas.style.top    = y + "px";
   }

   function dragInset(dx, dy, x, y, event) {
      var t = getData(imgId, "inset-t").clone();
      var s = 1;//Reveal.getScale();
      t.add(Snap.matrix().translate(dx/s, dy/s));
      imageRect.transform(t);
      insetRect.transform(t);
      insetImg.transform(t.invert());
      newinset = {x: inset.x + dx, y: inset.y + dy, size: inset.size, canvas: inset.canvas};
      updateLocalAnalysis(imgId, newinset);
   }
   function dragStart(x, y, event) {
      setData(imgId, "inset-t", imageRect.transform().localMatrix);
   }
   function dragEnd(x, y, event) {
   }
   imageRect.drag(dragInset, dragStart, dragEnd);

   updateLocalAnalysis(imgId, inset);
}

/* Decomposition of rendering into operators */

function renderingEquation04Step00(snap) {
   var layer = snap.select("#svg2")
   layer.attr({width: 1080})
   snap.select("#lens").attr({ opacity: 0 })
   snap.select("#path2-00").attr({ opacity: 0 })
   snap.select("#path2-01").attr({ opacity: 0 })

   var t1 = 0; // light
   var t2 = 335; // dragon
   var t3 = 1000; //sensor

   // Point at light
   var p = snap.select("#path1-00").getPointAtLength(t1);
   var c = snap.circle(p.x, p.y, 7).attr({ fill: "#ffffff", stroke: "#ff0000", strokeWidth: "4px", id: "cursor", filter: "drop-shadow( 2px 2px 2px #666 )"})
   snap.select("#lens").after(c);

   // Point at dragon
   p = snap.select("#path1-00").getPointAtLength(t2);
   c = snap.circle(p.x, p.y, 7).attr({ fill: "#ffffff", stroke: "#00aa00", strokeWidth: "4px", id: "cursor", filter: "drop-shadow( 2px 2px 2px #666 )"})
   snap.select("#lens").after(c);

   // var p1 = snap.select("#path1-00").getPointAtLength(t1);
   // var p2 = snap.select("#path1-00").getPointAtLength(t2);
   // c = CreateBacket(snap, p1, p2, 30, 10);
   // snap.select("#lens").after(c);

   // p1 = snap.select("#path1-00").getPointAtLength(t2);
   // p2 = snap.select("#path1-00").getPointAtLength(t3);
   // c = CreateBacket(snap, p1, p2, 30, 10);
   // snap.select("#lens").after(c);

   // var fourier = CreateFrame(snap, 1000, 100, 150, 150);
   // CreateCovariance(snap, fourier, Snap.matrix(0.9, 0, 0, 0.1, 0, 0));
}



/* Operators */

function AlignCanvasWithSVG(canvas, svg, offset) {
   var bbox   = svg.getBBox()
   var split  = svg.transform().diffMatrix.split();
   var width  = split.scalex * bbox.width;
   var height = split.scaley * bbox.height;
   var top    = svg.transform().diffMatrix.y(bbox.x, bbox.y);
   var left   = svg.transform().diffMatrix.x(bbox.x, bbox.y);
   if(offset) {
      top  += offset.x;
      left += offset.y;
   }

   canvas.style.top    = top    + "px";
   canvas.style.left   = left   + "px";
   canvas.style.width  = width  + "px";
   canvas.style.height = height + "px";
}

var travelOperator01Step00 = function(snap) {

   var svg2 = snap.select("#layer1")
   svg2.transform(Snap.matrix().scale(1.5).add(svg2.transform().localMatrix))

   // WebGL code
   var tr_canvas = document.getElementById("draw_cov_travel-gl");
   if(!tr_canvas) {
      alert("Impossible de récupérer le canvas");
   }
   var box  = snap.select("#rect4136")
   var bbox = box.getBBox()
   // var size = box.transform().diffMatrix.x(bbox.width, bbox.height) + "px"
   // tr_canvas.style.top    = (box.transform().diffMatrix.y(bbox.x, bbox.y)+1) + "px"
   // tr_canvas.style.left   = (box.transform().diffMatrix.x(bbox.x, bbox.y)-1) + "px"
   // tr_canvas.style.width  = size
   // tr_canvas.style.height = size
   AlignCanvasWithSVG(tr_canvas, box, {x: -1, y: 1});

   var h = 128, w = 128
   tr_canvas.width  = w
   tr_canvas.height = h

   var fourier_bt_press = false;
   function render_fourier_travel() {
      FFT.init(w);
      FrequencyFilter.init(w);
      var src = tr_canvas.getContext('2d').getImageData(0, 0, w, h);
      var dat = src.data;
      var re = [], im = [];
      for(var y=0; y<h; y++) {
         var i = y*w;
         for(var x=0; x<w; x++) {
            var W = 0.25 * (1.0 - Math.cos(2.0*Math.PI * y/(h-1))) * (1.0-Math.cos(2.0*Math.PI * x/(w-1)));
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
      SpectrumViewer.render(re, im, false, 15);
   }

   var scene = createScene();
   addObject(scene, {p1 : {x: 0.0, y: -0.5}, p2 : {x: 0.0, y: 0.5}, L : 1.0});
   addCamera(scene, {o: {x: 0.0, y: 0.0}, d: {x: 1.0, y: 0.0}, up : {x: 0.0, y:1.0}});

   var distToLight = 0.000001;
   scene.camera.o.x = -distToLight;

   render(tr_canvas, scene, 0);
   if(fourier_bt_press) {
      render_fourier_travel();
   }

   var text = snap.text(bbox.cx, bbox.y+bbox.height+40, "Apply Fourier Transform").attr({textAnchor: "middle", fontSize: "0.4em"});
   var tbb  = text.getBBox();
   var rect = snap.rect(tbb.x-10, tbb.y-10, tbb.width+20, tbb.height+20).attr({fill: "#999999", rx: 5, ry: 5/*, filter: "drop-shadow( 2px 2px 2px #666 )" */});
   var g    = snap.g(rect, text).click(function() {
      fourier_bt_press = !fourier_bt_press;
      render(tr_canvas, scene, 0);
      if(fourier_bt_press) {
            text.attr({text: "Apply inverse Fourier Transform"});
            var tbb  = text.getBBox();
            rect.attr({x: tbb.x-10, y: tbb.y-10, width: tbb.width+20, height: tbb.height+20});
            render_fourier_travel();
      } else {
            text.attr({text: "Apply Fourier Transform"});
            var tbb  = text.getBBox();
            rect.attr({x: tbb.x-10, y: tbb.y-10, width: tbb.width+20, height: tbb.height+20});
      }
   });
   snap.select("#layer1").append(g);

   // SVG drawing code
   var tr_svg = document.getElementById('draw_cov_travel-cv');
   var svg    = tr_svg;
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
         if(temp > 0.00001 && temp < 1.0) {
            distToLight = temp;
            rayStart.x += dotProd*dirX;
            rayStart.y += dotProd*dirY;
            rayEnd.x += dotProd*dirX;
            rayEnd.y += dotProd*dirY;
         }

         scene.camera.o.x = -5*distToLight;
         render(tr_canvas, scene, 0);
         if(fourier_bt_press) {
            render_fourier_travel();
         }
      }
   }, false);
}

var brdfOperator01Step00 = function(snap) {
   var svg2 = snap.select("#layer1")
   svg2.transform(Snap.matrix().scale(1.5).add(svg2.transform().localMatrix))

   // WebGL code
   var canvas = document.getElementById("draw_cov_brdf-gl");
   if(!canvas) {
      alert("Impossible de récupérer le canvas 'draw_cov_brdf-gl'");
   }

   // Align the rendering canvas with the axis-rectangle
   var box = snap.select("#rect4136");
   AlignCanvasWithSVG(canvas, box, {x: 0, y: 0});

   // Update the rendering resolution
   var image     = canvas.getContext('2d')
   canvas.width  = 128;
   canvas.height = 128;

   // Slider
   var slider = document.getElementById("draw_cov_brdf-slider");

   // Create the scene
   var scene = createScene();
   var lY = 1;
   var exponent = 1.0/slider.value;
   addObject(scene, {p1 : {x: -1.0, y: 0}, p2 : {x: 1.0, y: 0}, E : exponent});
   addObject(scene, {p1 : {x: -0.5, y: lY}, p2 : {x: 0.5, y: lY}, L : 1.0});
   addCamera(scene, {o: {x: 0.0, y: 1}, d: {x: 0.0, y: -1.0}, up : {x: 1.0, y:0.0}});

   // Display the Fourier transform or not?
   var fourier_bt_press = false;

   // Function to render the image and apply the Fourier transform if necessary
   function render_scene_brdf(canvas, scene) {
      for(var count=0; count<1; count++) {
         render(canvas, scene, count);
      }

      if(fourier_bt_press) {
         const w = canvas.width,
               h = canvas.width;
         FFT.init(w);
         FrequencyFilter.init(w);
         var src = canvas.getContext('2d').getImageData(0, 0, w, h);
         var dat = src.data;
         var re = [], im = [];
         for(var y=0; y<h; y++) {
            var i = y*w;
            for(var x=0; x<w; x++) {
               var W = 0.25 * (1.0 - Math.cos(2.0*Math.PI * y/(h-1))) * (1.0-Math.cos(2.0*Math.PI * x/(w-1)));
               var L = dat[(i << 2) + (x << 2) + 0]
                     + dat[(i << 2) + (x << 2) + 1]
                     + dat[(i << 2) + (x << 2) + 2];
               re[i + x] = W*L;
               im[i + x] = 0.0;
            }
         }
         FFT.fft2d(re, im);
         FrequencyFilter.swap(re, im);

         var tr_spectrum = document.querySelector('#draw_cov_brdf-gl').getContext('2d');
         SpectrumViewer.init(tr_spectrum);
         SpectrumViewer.render(re, im, false, 15);
      }
   }

   render_scene_brdf(canvas, scene);

   var bbox = box.getBBox();
   var text = snap.text(bbox.cx, bbox.y+bbox.height+40, "Apply Fourier Transform").attr({textAnchor: "middle", fontSize: "0.4em"});
   var tbb  = text.getBBox();
   var rect = snap.rect(tbb.x-10, tbb.y-10, tbb.width+20, tbb.height+20).attr({fill: "#999999", rx: 5, ry: 5 /*, filter: "drop-shadow( 2px 2px 2px #666 )" */});
   var g    = snap.g(rect, text).click(function() {
      fourier_bt_press = !fourier_bt_press;
      render_scene_brdf(canvas, scene);
      if(fourier_bt_press) {
            text.attr({text: "Apply inverse Fourier Transform"});
            var tbb  = text.getBBox();
            rect.attr({x: tbb.x-10, y: tbb.y-10, width: tbb.width+20, height: tbb.height+20});
      } else {
            text.attr({text: "Apply Fourier Transform"});
            var tbb  = text.getBBox();
            rect.attr({x: tbb.x-10, y: tbb.y-10, width: tbb.width+20, height: tbb.height+20});
      }
   });
   snap.select("#layer1").append(g);

   slider.onchange = function(value) {
      var canvas = document.getElementById("draw_cov_brdf-gl");
      // var scene  = createScene();
      scene.objects[0].E = 1.0/this.value;
      render_scene_brdf(canvas, scene);
   }
}

var occlOperator01Step00 = function(snap) {
   // Scale the SVG
   var svg2 = snap.select("#layer1")
   svg2.transform(Snap.matrix().scale(1.5).add(svg2.transform().localMatrix))

   // WebGL code
   var canvas = document.getElementById("draw_cov_occl-gl");
   if(!canvas) {
      alert("Impossible de récupérer le canvas");
   }

   // Align the rendering canvas with the axis-rectangle
   var box = snap.select("#rect4136");
   AlignCanvasWithSVG(canvas, box, {x: 1, y: -1});

   // Fix the resolution of the image
   var h = 128, w = 128;
   canvas.width  = w;
   canvas.height = h;

   var scene = createScene();
   addObject(scene, {p1 : {x: 10.0, y: -1000}, p2 : {x: 10.0, y: 1000}, L : 1.0});

   // addObject(scene, {p1 : {x: 1.0, y: 0.0}, p2 : {x: 2.0, y: 0.0}, L : 0.0});
   // addObject(scene, {p1 : {x: 2.0, y: 0.0}, p2 : {x: 2.0, y: 2.0}, L : 0.0});
   // addObject(scene, {p1 : {x: 2.0, y: 2.0}, p2 : {x: 1.0, y: 2.0}, L : 0.0});
   // addObject(scene, {p1 : {x: 1.0, y: 2.0}, p2 : {x: 1.0, y: 0.0}, L : 0.0});
   var x = [-1.4142, 0.0, 1.4142, 0.0];
   var y = [0.0, 1.4142, 0.0, -1.4142];
   addObject(scene, {p1 : {x: x[0], y: y[0]}, p2 : {x: x[1], y: y[1]}, L : 0.0});
   addObject(scene, {p1 : {x: x[1], y: y[1]}, p2 : {x: x[2], y: y[2]}, L : 0.0});
   addObject(scene, {p1 : {x: x[2], y: y[2]}, p2 : {x: x[3], y: y[3]}, L : 0.0});
   addObject(scene, {p1 : {x: x[3], y: y[3]}, p2 : {x: x[0], y: y[0]}, L : 0.0});

   addCamera(scene, {o: {x: -0.5, y: 1.5}, d: {x: 1.0, y: 0.0}, up : {x: 0.0, y:1.0}});

   var distToLight = 1.3;
   scene.camera.o.x = distToLight;


   var fourier_bt_press = false;
   function render_fourier_occl() {
      FFT.init(w);
      FrequencyFilter.init(w);
      var src = canvas.getContext('2d').getImageData(0, 0, w, h);
      var dat = src.data;
      var re = [], im = [];
      for(var y=0; y<h; y++) {
         var i = y*w;
         for(var x=0; x<w; x++) {
            var W = 0.25 * (1.0 - Math.cos(2.0*Math.PI * y/(h-1))) * (1.0-Math.cos(2.0*Math.PI * x/(w-1)));
            var L = dat[(i << 2) + (x << 2) + 0]
                  + dat[(i << 2) + (x << 2) + 1]
                  + dat[(i << 2) + (x << 2) + 2];
            re[i + x] = W*L;
            im[i + x] = 0.0;
         }
      }
      FFT.fft2d(re, im);
      FrequencyFilter.swap(re, im);

      var occl_spectrum = document.querySelector('#draw_cov_occl-gl').getContext('2d');
      SpectrumViewer.init(occl_spectrum);
      SpectrumViewer.render(re, im, false, 10);
   }

   render(canvas, scene, 0);
   if(fourier_bt_press) {
      render_fourier_occl();
   }

   // Create the clickable button
   var bbox = box.getBBox();
   var text = snap.text(bbox.cx, bbox.y+bbox.height+40, "Apply Fourier Transform").attr({textAnchor: "middle", fontSize: "0.4em"});
   var tbb  = text.getBBox();
   var rect = snap.rect(tbb.x-10, tbb.y-10, tbb.width+20, tbb.height+20).attr({fill: "#999999", rx: 5, ry: 5/*, filter: "drop-shadow( 2px 2px 2px #666 )" */});
   var g    = snap.g(rect, text);


   g.click(function() {
      fourier_bt_press = !fourier_bt_press;
      render(canvas, scene, 0);
      if(fourier_bt_press) {
            text.attr({text: "Apply inverse Fourier Transform"});
            var tbb  = text.getBBox();
            rect.attr({x: tbb.x-10, y: tbb.y-10, width: tbb.width+20, height: tbb.height+20});
            render_fourier_occl();
      } else {
            text.attr({text: "Apply Fourier Transform"});
            var tbb  = text.getBBox();
            rect.attr({x: tbb.x-10, y: tbb.y-10, width: tbb.width+20, height: tbb.height+20});
      }
   });
   snap.select("#layer1").append(g);

   // SVG drawing code
   var occl_svg = document.getElementById('draw_cov_occl-cv');
   var svg    = occl_svg;
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

         var planeStart = cursor.pathSegList.getItem(0);
         var planeEnd   = cursor.pathSegList.getItem(1);
         var dotProd  = deltaX*dirX + deltaY*dirY;

         var temp = distToLight - dotProd/50;
         var xshift = dotProd*dirX;
         var yshift = dotProd*dirY;
         console.log(temp);
         if(planeStart.x+xshift >= rayStart.x && planeStart.x+xshift <= rayEnd.x) {
            distToLight   = temp;
            planeStart.x += xshift;
            planeStart.y += yshift;
            planeEnd.x   += xshift;
            planeEnd.y   += yshift;
         }

         scene.camera.o.x = distToLight;
         render(canvas, scene, 0);
         if(fourier_bt_press) {
            render_fourier_occl();
         }
      }
   }, false);
}




/* Curvature operators */
function curvOperator01Step00(snap) {
   var layer  = snap.select("#layer1");
   var r = 1000;
   var sphere = snap.circle(233, 480+r, 170+r).attr({fillOpacity: 0, stroke: "#333", strokeWidth: "4px", id: "sphere"});//snap.select("#sphere");
   var quad   = snap.rect(sphere.attr("cx")-150, 300, 300, 150).attr({fill: "#fff"});
   sphere.attr({clip: quad});

   var init   = parseFloat(sphere.attr("r"));
   var initcy = parseFloat(sphere.attr("cy"));

   // Raytracing code
   var canvas = document.getElementById("draw_cov_curv-cv");
   if(!canvas) {
   alert("Impossible de récupérer le canvas");
   }

   // Align the rendering canvas with the axis-rectangle
   var box = snap.select("#rect4136");
   AlignCanvasWithSVG(canvas, box, {x: .5, y: -.5});

   // Fix the resolution of the image
   var h = 128, w = 128;
   canvas.width  = w;
   canvas.height = h;

   // TODO create a real curved scene
   var scene = createScene();
   // addObject(scene, {p1 : {x: -1.0, y: 1.0}, p2 : {x: 1.0, y: 1.0}, L : 1.0});
   // addCamera(scene, { o  : {x:  0.0, y:  0.0}, 
   //                    d  : {x:  0.0, y:  1.0},
   //                    up : {x:  1.0, y:  0.0},
   //                    t  : {x:  1.0, y:  0.0},
   //                    r  : 100.0,
   //                    scale : 1.0});
   var lY = 5;
   var exponent = 1.0E8;
   //addObject(scene, {p1 : {x: -10.0, y: 0}, p2 : {x: 10.0, y: 0}, E : exponent});
   var r = 100;
   addObject(scene, {t: 1, c: {x: 0, y: -r}, r: r, E : exponent});
   addObject(scene, {p1 : {x: -1, y: lY}, p2 : {x: 1, y: lY}, L : 1.0});
   addCamera(scene, {o: {x: 0.0, y: 0.1}, d: {x: 0.0, y: -1.0}, up : {x: 1.0, y:0.0}, scale: 0.5});



   var fourier_bt_press = false;
   function render_fourier_curv() {
      FFT.init(w);
      FrequencyFilter.init(w);
      var src = canvas.getContext('2d').getImageData(0, 0, w, h);
      var dat = src.data;
      var re = [], im = [];
      for(var y=0; y<h; y++) {
         var i = y*w;
         for(var x=0; x<w; x++) {
            var W = 0.25 * (1.0 - Math.cos(2.0*Math.PI * y/(h-1))) * (1.0-Math.cos(2.0*Math.PI * x/(w-1)));
            var L = dat[(i << 2) + (x << 2) + 0]
                  + dat[(i << 2) + (x << 2) + 1]
                  + dat[(i << 2) + (x << 2) + 2];
            re[i + x] = W*L;
            im[i + x] = 0.0;
         }
      }
      FFT.fft2d(re, im);
      FrequencyFilter.swap(re, im);

      var occl_spectrum = document.querySelector('#draw_cov_curv-cv').getContext('2d');
      SpectrumViewer.init(occl_spectrum);
      SpectrumViewer.render(re, im, false, 10);
   }

   render(canvas, scene, 0);
   if(fourier_bt_press) {
      render_fourier_curv();
   }

   // Create the clickable button
   var bbox = box.getBBox();
   var text = snap.text(bbox.cx, bbox.y+bbox.height+60, "Apply Fourier Transform").attr({textAnchor: "middle", fontSize: "0.6em"});
   var tbb  = text.getBBox();
   var rect = snap.rect(tbb.x-10, tbb.y-10, tbb.width+20, tbb.height+20).attr({fill: "#999999", rx: 5, ry: 5/*, filter: "drop-shadow( 2px 2px 2px #666 )" */});
   var g    = snap.g(rect, text);


   g.click(function() {
      fourier_bt_press = !fourier_bt_press;
      render(canvas, scene, 0);
      if(fourier_bt_press) {
            text.attr({text: "Apply inverse Fourier Transform"});
            var tbb  = text.getBBox();
            rect.attr({x: tbb.x-10, y: tbb.y-10, width: tbb.width+20, height: tbb.height+20});
            render_fourier_curv();
      } else {
            text.attr({text: "Apply Fourier Transform"});
            var tbb  = text.getBBox();
            rect.attr({x: tbb.x-10, y: tbb.y-10, width: tbb.width+20, height: tbb.height+20});
      }
   });
   snap.select("#layer1").append(g);




   function dragInset(dx, dy, x, y, event) {
      var dr = 10*(dx-dy);
      var r  = init + dr;
      if(r > 140) {
         sphere.attr({r: r, cy: initcy+dr});

         scene.objects[0].c.y = -r / 100;
         scene.objects[0].r   =  r / 100;
         //scene.camera.r = r / 100.0;
         render(canvas, scene, 0);
         if(fourier_bt_press) {
            render_fourier_curv();
         }
      }
   }
   function dragStart(x, y, event) {
     init   = parseFloat(sphere.attr("r"));
     initcy = parseFloat(sphere.attr("cy"));
   }
   function dragEnd(x, y, event) {
   }
   snap.drag(dragInset, dragStart, dragEnd);

}




/* Curvature operators */
function bsdfOperator01Step00(snap) {
   var layer  = snap.select("#layer1");

   // Raytracing code
   var canvas = document.getElementById("draw_cov_bsdf-cv");
   if(!canvas) {
   alert("Impossible de récupérer le canvas");
   }

   // Align the rendering canvas with the axis-rectangle
   var box = snap.select("#rect4136");
   AlignCanvasWithSVG(canvas, box, {x: .5, y: -.5});

   // Fix the resolution of the image
   var h = 128, w = 128;
   canvas.width  = w;
   canvas.height = h;

   // TODO create a real transmitive material
   var scene = createScene();
   addObject(scene, {p1 : {x: -1, y: 5}, p2 : {x: 1, y: 5}, L : 1.0});
   addObject(scene, {i: 1, n: 1.0, p1 : {x: -10.0, y: 1}, p2 : {x: 10.0, y: 1}, E : 1000000.0});
   addCamera(scene, {o: {x: 0, y: 0}, d: {x: 0.0, y: 1.0}, up : {x: 1.0, y: 0.0}});

   var fourier_bt_press = false;

   // Function to render the image and apply the Fourier transform if necessary
   function render_scene_bsdf(canvas, scene) {
      render(canvas, scene, 0);

      if(fourier_bt_press) {
         const w = canvas.width,
               h = canvas.width;
         FFT.init(w);
         FrequencyFilter.init(w);
         var src = canvas.getContext('2d').getImageData(0, 0, w, h);
         var dat = src.data;
         var re = [], im = [];
         for(var y=0; y<h; y++) {
            var i = y*w;
            for(var x=0; x<w; x++) {
               var W = 0.25 * (1.0 - Math.cos(2.0*Math.PI * y/(h-1))) * (1.0-Math.cos(2.0*Math.PI * x/(w-1)));
               var L = dat[(i << 2) + (x << 2) + 0]
                     + dat[(i << 2) + (x << 2) + 1]
                     + dat[(i << 2) + (x << 2) + 2];
               re[i + x] = W*L;
               im[i + x] = 0.0;
            }
         }
         FFT.fft2d(re, im);
         FrequencyFilter.swap(re, im);

         var tr_spectrum = document.querySelector('#draw_cov_bsdf-cv').getContext('2d');
         SpectrumViewer.init(tr_spectrum);
         SpectrumViewer.render(re, im, false, 15);
      }
   }

   render_scene_bsdf(canvas, scene);

   var bbox = box.getBBox();
   var text = snap.text(bbox.cx, bbox.y+bbox.height+60, "Apply Fourier Transform").attr({textAnchor: "middle", fontSize: "0.6em"});
   var tbb  = text.getBBox();
   var rect = snap.rect(tbb.x-10, tbb.y-10, tbb.width+20, tbb.height+20).attr({fill: "#999999", rx: 5, ry: 5 /*, filter: "drop-shadow( 2px 2px 2px #666 )" */});
   var g    = snap.g(rect, text).click(function() {
      fourier_bt_press = !fourier_bt_press;
      render_scene_bsdf(canvas, scene);
      if(fourier_bt_press) {
            text.attr({text: "Apply inverse Fourier Transform"});
            var tbb  = text.getBBox();
            rect.attr({x: tbb.x-10, y: tbb.y-10, width: tbb.width+20, height: tbb.height+20});
      } else {
            text.attr({text: "Apply Fourier Transform"});
            var tbb  = text.getBBox();
            rect.attr({x: tbb.x-10, y: tbb.y-10, width: tbb.width+20, height: tbb.height+20});
      }
   });
   snap.select("#layer1").append(g);


   // Slider
   var slider = document.getElementById("draw_cov_bsdf-slider");
   slider.onchange = function(value) {
      scene.objects[1].n = this.value;
      render_scene_bsdf(canvas, scene, 0);
   }
}
