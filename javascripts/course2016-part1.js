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
   Snap.load(getData("general", "baseurl") + uri, function (f) {
      var s = Snap(elem);
      s.append(f);

      if(call != undefined && call != null) { call(s); }
   });
}

const loadImageSVG = function(uri, elem, width, height, id) {
      var snap  = Snap(elem);
      var group = snap.g();
      group.image(getData("general", "baseurl") + uri, 0, 0, width, height);
      group.attr({id: id});
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

   updateLocalAnalysis01(inset);
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