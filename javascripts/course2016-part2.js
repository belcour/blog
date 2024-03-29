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

if(!loadSVG) {
   loadSVG = function(uri, elem, call) {
      Snap.load(uri, function (f) {
         var s = Snap(elem);
         s.append(f);

         if(call) { call(s); }
      });
   }
}
/*
 * Labels can be set to define the subscript for sub-space with the
 * following structure:
 * 
 *  labels : {
 *      x: "x",
 *      u: "u"
 *  }
 *
 */
function CreateFrame(snap, posX, posY, width, height, labels) {
   var arrowUp = snap.polygon([0,5, 4,5, 2,0, 0,5]).attr({fill: '#000'}).transform('r90');
   var arrowDw = snap.polygon([0,5, 4,5, 2,0, 0,5]).attr({fill: '#000'}).transform('r-90');
   var markerUp = arrowUp.marker(0,0, 5,5, 2.5,2.5);
   var markerDw = arrowDw.marker(0,0, 5,5, 2.5,2.5);

   var strokeWidth = (width<120) ? 1.5 : 1.0;
   strokeWidth += "px";

   var px = -0.5*width;
   var py = -0.5*height;
   var wx = 0.5*width;
   var wy = 0.5*height;
   var rect = snap.rect(px, py, width, height).attr({ fill: "#ffffff", stroke: "#000000", strokeWidth: strokeWidth })
   var lin1 = snap.polyline(-0.55*width, +0.0*height, +0.6*width, +0*height).attr({ stroke: "#000000", strokeWidth: strokeWidth, markerEnd: markerUp })
   var lin2 = snap.polyline(+0.0*height, -0.6*width, +0.0*height, +0.55*width).attr({ stroke: "#000000", strokeWidth: strokeWidth, markerStart: markerDw })

   var xlabel = "x", 
       ulabel = "u";
   if(labels != undefined) {
       xlabel = labels.x;
       ulabel = labels.u;
   }

   var p = (width < 120) ? 0.11*width : 0.09*width;
   var tex1 = snap.text(+0.60*width, -0.05*height, ["Ω", xlabel]).attr({ fontFamily: "Times New Roman", fontSize: p+"px", textAnchor: "middle"})
   var tex2 = snap.text(+0.10*width, -0.56*height, ["Ω", ulabel]).attr({ fontFamily: "Times New Roman", fontSize: p+"px", textAnchor: "middle"})

   var elems = [];
   elems = tex1.selectAll("tspan");
   elems[1].attr({baselineShift: "-10%", fontSize: "0.7em"});
   elems = tex2.selectAll("tspan");
   elems[1].attr({baselineShift: "-10%", fontSize: "0.7em"});

   var g = snap.g(rect, lin1, lin2, tex1, tex2);
   g.transform(Snap.matrix(1,0,0,1,posX, posY));
   return g;
}

/* Create a Covariance footprint (an ellipsoid) that fits into the provided 
 * frame (see CreateFrame).
 */
function CreateCovariance(snap, frame, matrix) {
   var elem = frame.select("rect");
   if(elem == undefined) { elem = frame; }
   var Tr = elem.transform().diffMatrix;
   var BB = elem.getBBox();
   var cx = BB.cx;
   var cy = BB.cy;
   var wx = 0.5*elem.getBBox().height;
   var wy = 0.5*elem.getBBox().width;
   //var tmatrix = Snap.matrix(1, 0, 0, 1, wx, wy);
   var tmatrix = Snap.matrix(1, 0, 0, 1, 0, 0);   
   if(matrix) {
      tmatrix.add(matrix);
   }
   var cov = snap.circle(cx, cy, wx).transform(tmatrix);
   cov.attr({id: "circle", stroke: "#0000ff",
             fillOpacity: 0,
             strokeWidth: 2,
             strokeDasharray: "1,4",
             strokeLinecap: "round",
             "vector-effect": "non-scaling-stroke"});
    frame.append(cov);
    return cov;
}

function CreateBacket(snap, p1, p2, dwidth, dspacing) {
   var dx =  0.1*(p2.y-p1.y)
   var dy = -0.1*(p2.x-p1.x)
   var nd = Math.sqrt(dx*dx+dy*dy)
   var dsx = dx*dspacing/nd;
   var dsy = dy*dspacing/nd;
   console.log(nd)
   dx *= dwidth/nd
   dy *= dwidth/nd
   var cx = 0.5*(p1.x+p2.x) + 1.5*dx
   var cy = 0.5*(p1.y+p2.y) + 1.5*dy
   var ax = 0.55*p1.x+0.45*p2.x + 0.5*dx
   var ay = 0.55*p1.y+0.45*p2.y + 0.5*dy
   var bx = 0.45*p1.x+0.55*p2.x + 0.5*dx
   var by = 0.45*p1.y+0.55*p2.y + 0.5*dy

   return snap.path("M" + (p1.x+dsy) + " " + (p1.y+dsy) + " C " +
                     " " + (p1.x+1.4*dx) + " " + (p1.y+1.4*dy) +
                     " " + ax + " " + ay +
                    " " + cx + " " + cy +
                     " " + bx + " " + by +
                     " " + (p2.x+1.4*dx) + " " + (p2.y+1.4*dy) +
                    " " + (p2.x+dsx) + " " + (p2.y+dsy)
                    ).attr({ stroke: "#000000", fillOpacity: 0, strokeWidth: "2px"});
}

var createGaussian = function(snap, x0, y0, w, h, sigma, orient, style) {
    var curve = "M" + x0 + " " + y0;
    for(var i=0; i<100; ++i) {
        var dx = i / 99;
        if(orient == "vertical") {
        var yi = y0 + h*dx;
        var xi = x0 + w*(Math.exp(-0.5 * sigma * Math.pow(dx - 0.5, 2)));
        } else {
        var xi = x0 + w*dx;
        var yi = y0 + h*(Math.exp(-0.5 * sigma * Math.pow(dx - 0.5, 2)));
        }
        curve += " " + xi + " " + yi;
    }
    var path = snap.path(curve).attr({fillOpacity: 0, stroke: "#ff0000", strokeWidth: 2});
    if(style) { path.attr( style ); }
    var absc;
    if(orient == "vertical") {
        absc = snap.line(x0, y0, x0, y0+h);
    } else {
        absc = snap.line(x0, y0, x0+w, y0);
    }
    absc.attr({stroke: "#000000", strokeWidth: 2, markerEnd: snap.select("#marker")});
    var grou = snap.g(path, absc);
    return grou;
}

const getFocalPointExample01 = function(x1, y1, lens) {

   const lLength = lens.getTotalLength();
   const lPoint  = lens.getPointAtLength(0.5 * lLength);
   const lTr     = lens.transform().diffMatrix;
   var x2 = lTr.x(lPoint.x, lPoint.y);
   var y2 = lTr.y(lPoint.x, lPoint.y);

   var dx = x2-x1;
   var dy = y2-y1;
   var dn = Math.sqrt(dx*dx + dy*dy);

   var f0 = getData("example01", "f0");

   var xf = x1 + dx*f0/dn;
   var yf = y1 + dy*f0/dn;

   return {x: xf, y: yf};
}

const getIntersectionWithPlaneExample01 = function(x1, y1, x2, y2, plane) {
   const fBB   = plane.getBBox();
   const fTr   = plane.transform().diffMatrix;

   // Compute the intersection with the plane
   var dx = x2-x1;
   var dy = y2-y1;
   var dn = Math.sqrt(dx*dx + dy*dy);
   var fy = fTr.y(fBB.x, fBB.y);
   var dd = (fy-y1) * dn / dy;
   var x3 = x1+dx*dd/dn;
   var y3 = y1+dy*dd/dn;

   return {x : x3, y: y3};
}

const getHitPointExample01 = function(x1, y1, x2, y2, lens, plane) {
   pf = getFocalPointExample01(x1, y1, lens);
   var px = pf.x;
   var py = pf.y;

   var p3 = getIntersectionWithPlaneExample01(x2, y2, px, py, plane);
   return {x: p3.x, y: p3.y};
}

const updatePathExample01 = function(x, u) {
   const snap = Snap("#example01-svg");

   const pixels  = snap.select("#pixels");
   const pLength = pixels.getTotalLength();
   const pPoint  = pixels.getPointAtLength(x * pLength);
   const pTr     = pixels.transform().diffMatrix;
   var x1 = pTr.x(pPoint.x, pPoint.y);
   var y1 = pTr.y(pPoint.x, pPoint.y);

   const lens    = snap.select("#lens");
   const lLength = lens.getTotalLength();
   const lPoint  = lens.getPointAtLength(u * lLength);
   const lTr     = lens.transform().diffMatrix;
   var x2 = lTr.x(lPoint.x, lPoint.y);
   var y2 = lTr.y(lPoint.x, lPoint.y);

   const plane    = snap.select("#plane");
   var p3 = getHitPointExample01(x1, y1, x2, y2, lens, plane);
   var x3 = p3.x;
   var y3 = p3.y;

   var v1 = snap.select("#vertex01");
   v1.attr({cx : x1, cy: y1});

   var v2 = snap.select("#vertex02");
   v2.attr({cx : x2, cy: y2});

   var v3 = snap.select("#vertex03");
   v3.attr({cx : x3, cy: y3});

   var path = snap.select("#lightpath");
   path.attr({d: "M " + x1 + " " + y1 + " " + x2 + " " + y2 + " " + x3 + " " + y3})
}

function adaptiveSamplingRandomSamples(snap) {
   const box1 = snap.select("#samplespace");
   const BB1  = box1.getBBox();
   const tr1  = box1.transform().diffMatrix;

   var g = snap.g().attr({ id: "samples" });
   for(var i=0; i<5; i++) {
      for(var j=0; j<5; j++) {
         var ex = (i + Math.random()) / 5;
         var eu = (j + Math.random()) / 5;

         var x = BB1.x + ex*BB1.width;
         var y = BB1.y + eu*BB1.height;

         var c = snap.circle(tr1.x(x, y), tr1.y(x, y), 3).attr({fill: "#ff0000", ex: ex, eu: eu});
         c.mouseover(function (e) {
            e.target.setAttribute("fill", "#00ff00");
            var ex = e.target.getAttribute("ex");
            var eu = e.target.getAttribute("eu");
            updatePathExample01(ex, eu);

            var lastElem = getData("example01", "lastElem")
            if(lastElem) {
               lastElem.setAttribute("fill", "#ff0000");
            }
            setData("example01", "lastElem", e.target);
         });

         g.append(c);
      }
   }
}

function adaptiveSamplingStructuredSamples(snap) {
   const box1 = snap.select("#samplespace");
   const BB1  = box1.getBBox();
   const tr1  = box1.transform().diffMatrix;

   var Ns = [5,3,2,4,8,7,2,1];

   var g1 = snap.g().attr({ id: "samples", opacity: 0 });
   var g2 = snap.g().attr({ id: "mainsamples" });
   for(var i=0; i<5; i++) {

       // Coordinates of a point
      var ex = (i + Math.random()) / 5;
      ex = ex*ex;
      var x = BB1.x + ex*BB1.width;
      var eu = 0.52;
      var y = BB1.y + eu*BB1.height; 
      var n  = Ns[Math.floor(ex*5)];//8*Math.random();
      console.log(ex, n);

      // Add the sample
      var c = snap.circle(tr1.x(x, y), tr1.y(x, y), 3).attr({fill: "#0000ff", ex: ex, eu: eu});
      g2.append(c);

      for(var j=0; j<n; j++) {

         eu = (j + Math.random()) / (n+1);
         y = BB1.y + eu*BB1.height;

         c = snap.circle(tr1.x(x, y), tr1.y(x, y), 3).attr({fill: "#ff0000", ex: ex, eu: eu});
         c.mouseover(function (e) {
            e.target.setAttribute("fill", "#00ff00");
            var ex = e.target.getAttribute("ex");
            var eu = e.target.getAttribute("eu");
            updatePathExample01(ex, eu);

            var lastElem = getData("example01", "lastElem")
            if(lastElem) {
               lastElem.setAttribute("fill", "#ff0000");
            }
            setData("example01", "lastElem", e.target);
         });

         g1.append(c);
      }
   }

   snap.g(g1, g2).attr({id: 'totalsamples'});
}

const createExample01 = function(snap) {

   // Set the focal length of the lens
   setData("example01", "f0", 10000);

   // Add moving elements
   const pixels  = snap.select("#pixels");
   const pLength = pixels.getTotalLength();
   const pPoint  = pixels.getPointAtLength(0.5 * pLength);
   const pTr     = pixels.transform().diffMatrix;
   var x1 = pTr.x(pPoint.x, pPoint.y);
   var y1 = pTr.y(pPoint.x, pPoint.y);

   const lens      = snap.select("#lens");
   const lLength = lens.getTotalLength();
   const lPoint  = lens.getPointAtLength(0.5 * lLength);
   const lTr     = lens.transform().diffMatrix;
   var x2 = lTr.x(lPoint.x, lPoint.y);
   var y2 = lTr.y(lPoint.x, lPoint.y);

   const plane = snap.select("#plane");
   const fBB   = plane.getBBox();
   const fTr   = plane.transform().diffMatrix;

   // Compute the intersection with the plane
   var p3 = getIntersectionWithPlaneExample01(x1, y1, x2, y2, plane);
   var x3 = p3.x;
   var y3 = p3.y;

   const path  = snap.path("M " + x1 + " " + y1 + " " + x2 + " " + y2 + " " + x3 + " " + y3).attr({fillOpacity: 0, stroke: "#ff0000", opacity: 0.5, id: "lightpath"});
   var c1 = snap.circle(x1, y1, 3).attr({fill: "#ffffff", stroke: "#ff0000", storkeSize: "2px", id: "vertex01"});
   var c2 = snap.circle(x2, y2, 3).attr({fill: "#ffffff", stroke: "#ff0000", storkeSize: "2px", id: "vertex02"});
   var c3 = snap.circle(x3, y3, 3).attr({fill: "#ffffff", stroke: "#ff0000", storkeSize: "2px", id: "vertex03"});
   snap.g(path, c1, c2, c3).attr({ id: "sample01" });

   var fourier = snap.select("#fourierDomain").attr({ opacity: 0});
   fourier = CreateFrame(snap, 670, 109, 173, 173);
   var cov     = CreateCovariance(snap, fourier, Snap.matrix(0.5, -0.1, 0, 0.1, 0, 0));
   cov.attr({ id: "covariance" });
   var rect   = snap.rect(583.5, 106, 173, 5).attr({ id: "bwbox", opacity: 0.0, fill: "#ff0000" });

   // Generate the samples within the sample space
   const box1 = snap.select("#samplespace");
   const BB1  = box1.getBBox();
   const tr1  = box1.transform().diffMatrix;

   const p00 = snap.select("#pixel00");
   const p01 = snap.select("#pixel01");
   const px0 = p00.transform().diffMatrix.x(p00.getBBox().x, p00.getBBox().y);
   const px1 = p01.transform().diffMatrix.x(p01.getBBox().x, p01.getBBox().y);
   snap.rect(px0, 0, px1-px0, BB1.height).attr({id: "integrationdomain", fill: "#ff0000", opacity: 0.5});

   // Add the samples
   adaptiveSamplingRandomSamples(snap);
   //adaptiveSamplingStructuredSamples(snap);

    // Update the caption
    console.log(snap.select("#fourierSpaceText").select("tspan").node.innerHTML = "Fourier Space (object)");

   setData("example01", "lastElem", undefined)
}

function adaptiveSampling01Step01(offset) {
    var snap = Snap("#example01-svg");
    var cov  = snap.select("#covariance");

    if(offset > 0) {
        var m1 = cov.transform().localMatrix;
        Snap.animate(0, 1, function(val) {
            var m2 = Snap.matrix(1,  val, 0, 1, 0, 0);
            cov.transform(m2.add(m1));
        }, 500);
        // Update the caption
        console.log(snap.select("#fourierSpaceText").select("tspan").node.innerHTML = "Fourier Space (lens)");
    } else {
        var m1 = cov.transform().localMatrix;
        Snap.animate(0, -1, function(val) {
            var m2 = Snap.matrix(1,  val, 0, 1, 0, 0);
            cov.transform(m2.add(m1));
        }, 500);
        // Update the caption
        console.log(snap.select("#fourierSpaceText").select("tspan").node.innerHTML = "Fourier Space (object)");
    }
}

function adaptiveSampling01Step02(offset) {
    var snap  = Snap("#example01-svg");
    var cov   = snap.select("#covariance");
    var shear = 0.5;
    if(offset > 0) {
        var m1 = cov.transform().localMatrix;
        Snap.animate(0, shear, function(val) {
            var m2 = Snap.matrix(1,  0, val, 1, 0, 0);
            cov.transform(m2.add(m1));
        }, 500);
        // Update the caption
        console.log(snap.select("#fourierSpaceText").select("tspan").node.innerHTML = "Fourier Space (image)");
    } else {
        var m1 = cov.transform().localMatrix;
        Snap.animate(0, -shear, function(val) {
            var m2 = Snap.matrix(1,  0, val, 1, 0, 0);
            cov.transform(m2.add(m1));
        }, 500);
        // Update the caption
        console.log(snap.select("#fourierSpaceText").select("tspan").node.innerHTML = "Fourier Space (lens)");
    }
}

function adaptiveSampling01Step03(offset) {
    snap = Snap("#example01-svg");

    if(offset > 0) {
        snap.select("#samples").remove();
        snap.select("#integrationdomain").attr({ opacity: 0 });
        snap.select("#bwbox").attr({ opacity: 0.5 });
        adaptiveSamplingStructuredSamples(snap);
    } else {
        snap.select("#totalsamples").remove();
        snap.select("#integrationdomain").attr({ opacity: 0.5 });
        snap.select("#bwbox").attr({ opacity: 0.0 });
        adaptiveSamplingRandomSamples(snap);
    }
}

function adaptiveSampling01Step05(offset) {
    snap = Snap("#example01-svg");

    if(offset > 0) {
        snap.select("#samples").attr({ opacity: 1 });
    } else {
        snap.select("#samples").attr({ opacity: 0 });
    }
}


/* ANTIALIASING SECTION */

var antialiasingAppearance01Step00 = function(s) {
    // Add text
    s.text(5, 285, "eye").attr({fill: 'black', fontSize: '0.8em'});
    s.text(520, 50, "light").attr({fill: '#ffd527', fontSize: '0.8em'});
    s.text(340, 450, "geometry").attr({fill: 'black', fontSize: '0.8em'});
    s.text(650, 365, "material").attr({id: 'material', fill: 'black', fontSize: '0.8em'});

    // Animation
    s.select("#pixelfootprint").attr({class: "fragment", "data-fragment-index": 0});
    s.select("#zoom").attr({class: "fragment", "data-fragment-index": 1});
    s.select("#zoomeduv").attr({class: "fragment", "data-fragment-index": 1});
    s.select("#zoomedpixelfootprint").attr({class: "fragment", "data-fragment-index": 1});
    s.select("#zoomedborder").attr({class: "fragment", "data-fragment-index": 1});
    s.select("#zoomedmicrosurface").attr({class: "fragment", "data-fragment-index": 1});
    s.select("#material").attr({class: "fragment", "data-fragment-index": 1});
};

var antialiasingAppearance02Step00 = function(s) {
    // Add text
    s.text( 25, 310, "pixel").attr({opacity: 0.5, fill: 'black', fontSize: '0.8em'});
    s.text(310, 310, "material").attr({opacity: 0.5, fill: 'black', fontSize: '0.8em'});
    s.text(635, 310, "light").attr({opacity: 0.5, fill: 'black', fontSize: '0.8em'});

    // Animation
    s.select("#integral").attr({opacity: 1, class: "fragment", "data-fragment-index": 0});
    s.select("#light").transform(s.select("#light").transform() + "t15,0");
    s.select("#eq").attr({class: "fragment fade-out", "data-fragment-index": 0});
    s.select("#simeq").attr({opacity: 1, class: "fragment", "data-fragment-index": 0});
};

var antialiasingAppearance03Step00 = function (s) {
    // Add text
    s.text( 25, 310, "pixel").attr({opacity: 0.5, fill: 'black', fontSize: '0.6em'});
    s.text(300, 310, "kernel").attr({opacity: 0.5, fill: 'black', fontSize: '0.6em'});
    s.text(460, 310, "material").attr({opacity: 0.5, fill: 'black', fontSize: '0.6em'});
    s.text(680, 310, "light").attr({opacity: 0.5, fill: 'black', fontSize: '0.6em'});
};

var createFilter = function(snap, x0, y0, w, h, sigma, orient, style) {
    var arrow = snap.polygon([0,5, 4,5, 2,0, 0,5]).attr({fill: '#000'}).transform('r90');
    var marker = arrow.marker(0,0, 5,5, 0,2.5).attr({id: "marker"});
    var curveA = "M" + x0 + " " + y0;
    var curveB = "M" + x0 + " " + y0;
    var curveC = "M" + x0 + " " + y0;
    const N = 125;
    for(var i=0; i<N; ++i) {
        var dx  = i / (N-1);
        var dy  = Math.random() /(1.0+10*Math.pow(dx-0.5, 2));
        if(Math.abs(dx-0.5) < 0.001) { dy = 1; }
        var exp = (Math.exp(-0.5 * sigma * Math.pow(dx - 0.5, 2)));
        var xi = x0 + w*dx;
        var yi = y0 - h*exp;

        curveA += " " + xi + " " + yi;
        curveB += " " + xi + " " + (y0-h*dy);
        curveC += " " + xi + " " + (y0-h*exp*dy);
    }
    var pathA = snap.path(curveA).attr({fillOpacity: 0, stroke: "#ff0000", strokeWidth: 2});
    var pathB = snap.path(curveB).attr({fillOpacity: 0, stroke: "#00ee00", strokeWidth: 2});
    var pathC = snap.path(curveC).attr({fillOpacity: 0, stroke: "#0000ff", strokeWidth: 2});
    var absc1 = snap.line(x0, y0, x0+w, y0);
    absc1.attr({stroke: "#000000", strokeWidth: 2, markerEnd: marker});
    var ord1 = snap.line(x0+w/2, y0, x0+w/2, y0-h-20);
    ord1.attr({stroke: "#000000", strokeWidth: 2, markerEnd: marker});
    var textA = snap.text(x0+w, y0-h-30, "Kernel").attr({fill: "#ff0000", textAnchor: "end", fontSize: "0.6em"});
    var textA = snap.text(x0+w, y0-h-5, "Material").attr({fill: "#00ee00", textAnchor: "end", fontSize: "0.6em"});
    var textA = snap.text(x0+w, y0-h+20, "Antaliased material").attr({fill: "#0000ff", textAnchor: "end", fontSize: "0.6em"});
    var grou = snap.g(pathA, pathB, pathC, absc1, ord1);
    return grou;
}

var antialiasingAppearance06Step00 = function(s) {
    var layer = s.select("#layer3");
    layer.transform(Snap.matrix(1, 0, 0, 1, 1580, 0));

    // Covariance window
    var cx = 105, cy = 425, w = 170;
    var frame = CreateFrame(s, cx, cy, w, w);
    CreateCovariance(s, frame, Snap.matrix(0.9, 0, 0, 0.1, 0, 0));
    s.text(cx, cy+w/2+30, "Covariance").attr({fontSize: "0.6em", textAnchor: "middle"});
    var quad = s.paper.rect(cx-w/2, cy - 2, w, 4).attr({fillOpacity: 0.5, fill: "#ff0000"});

    // Plot the kernel
    var x0 = 255, y0 = 300, w = 300, h=100;
    var plot = createGaussian(s, x0, y0, w, h, 100, "horizontal");
    var text = s.paper.text(x0+w+50, y0+7, "kernel").attr({fill: "#ff0000", fontSize: "0.6em", textAnchor: "middle"});
    s.g(plot, text, quad).attr({id: "plot", opacity: 0});
};

var Cov03MoveCursor01 = function(offset) {
    var s = Snap("#cov03");
    var c = s.select("#cursor-3");

    const M = c.transform().localMatrix;
    const posX = 285;
    const posY = 165;
    if(offset > 0) {
        Snap.animate(0, 1, function(val) {
        c.transform(M);
        var temp = Snap.matrix(1, 0, 0, 1, val*posX, val*posY);
        c.transform(c.transform().localMatrix.add(temp));
        }, 500);
    } else {
        Snap.animate(0, 1, function(val) {
        c.transform(M);
        var temp = Snap.matrix(1, 0, 0, 1, -val*posX, -val*posY);
        c.transform(c.transform().localMatrix.add(temp));
        }, 500);
    }
}
var Cov03ShearCov = function(offset) {
    var s = Snap("#cov03");
    var c = s.select("#circle");

    const M = c.transform().localMatrix;
    const o = -5;
    if(offset > 0) {
        Snap.animate(0, -o, function(val) {
        c.transform(M);
        var temp = Snap.matrix(1, val, 0, 1, 0, 0);
        c.transform(c.transform().localMatrix.add(temp));
        }, 500);
    } else {
        Snap.animate(0, o, function(val) {
        c.transform(M);
        var temp = Snap.matrix(1, val, 0, 1, 0, 0);
        c.transform(c.transform().localMatrix.add(temp));
        }, 500);
    }
}

var Cov03DisplayKernel = function(offset) {
    var s = Snap("#cov03");
    var c = s.select("#plot");
    if(offset > 0) {
        c.animate({opacity: 1}, 500);
    } else {
        c.animate({opacity: 0}, 500);
    }
}