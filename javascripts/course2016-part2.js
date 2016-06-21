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

function CreateFrame(snap, posX, posY, width, height) {
   var arrowUp = snap.polygon([0,5, 4,5, 2,0, 0,5]).attr({fill: '#000'}).transform('r90');
   var arrowDw = snap.polygon([0,5, 4,5, 2,0, 0,5]).attr({fill: '#000'}).transform('r-90');
   var markerUp = arrowUp.marker(0,0, 5,5, 2.5,2.5);
   var markerDw = arrowDw.marker(0,0, 5,5, 2.5,2.5);

   var rect = snap.rect(posX, posY, width, height).attr({ fill: "#ffffff", stroke: "#000000", strokeWidth: "2px" })
   var lin1 = snap.polyline(posX-0.05*width, posY+0.5*height, posX+1.1*width, posY+0.5*height).attr({ stroke: "#000000", strokeWidth: "2px", markerEnd: markerUp })
   var lin2 = snap.polyline(posX+0.5*height, posY-0.1*width, posX+0.5*height, posY+1.05*width).attr({ stroke: "#000000", strokeWidth: "2px", markerStart: markerDw })

   var p = 0.11*width;
   var tex1 = snap.text(posX+1.10*width, posY+0.45*height, ["Ω", "x"]).attr({ fontFamily: "Times New Roman", fontSize: p+"px", textAnchor: "middle"})
   var tex2 = snap.text(posX+0.61*width, posY-0.06*height, ["Ω", "u"]).attr({ fontFamily: "Times New Roman", fontSize: p+"px", textAnchor: "middle"})

   var elems = [];
   elems = tex1.selectAll("tspan");
   elems[1].attr({baselineShift: "-10%", fontSize: "0.7em"});
   elems = tex2.selectAll("tspan");
   elems[1].attr({baselineShift: "-10%", fontSize: "0.7em"});

   return rect
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

function CreateCovariance(snap, elem, matrix) {
   var Tr = elem.transform().diffMatrix;
   var BB = elem.getBBox();
   var cx = Tr.x(BB.cx, BB.cy);
   var cy = Tr.y(BB.cx, BB.cy);
   var wx = 0.5*(elem.getBBox().width + elem.getBBox().height);
   var tmatrix = Snap.matrix(1, 0, 0, 1, cx, cy);
   if(matrix) {
      tmatrix.add(matrix);
   }
   var cov = snap.circle(0, 0, 0.5*Tr.x(wx, 0)).transform(tmatrix);
   cov.attr({id: "circle", stroke: "#0000ff",
             fillOpacity: 0,
             strokeWidth: 2,
             strokeDasharray: "1,4",
             strokeLinecap: "round",
             "vector-effect": "non-scaling-stroke"});
    return cov;
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

const createExample01 = function(snap) {

   // Set the focal length of the lens
   setData("example01", "f0", 10000);

   // Add labels
   snap.text(150, 225, "Scene");
   snap.text(440, 225, "(xu) Samples").attr({textAnchor: "middle"});
   snap.text(670, 225, "Fourier domain at the sensor").attr({textAnchor: "middle"});

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
   snap.circle(x1, y1, 3).attr({fill: "#ffffff", stroke: "#ff0000", storkeSize: "2px", id: "vertex01"});
   snap.circle(x2, y2, 3).attr({fill: "#ffffff", stroke: "#ff0000", storkeSize: "2px", id: "vertex02"});
   snap.circle(x3, y3, 3).attr({fill: "#ffffff", stroke: "#ff0000", storkeSize: "2px", id: "vertex03"});


   const fourier = snap.select("#fourierdomain");
   const FBB     = fourier.getBBox();
   const FTr     = fourier.transform().diffMatrix;
   CreateCovariance(snap, fourier, Snap.matrix(1, -1, 0, 0.1, 0, 0));


   // Generate the samples within the sample space
   const box1 = snap.select("#samplespace");
   const BB1  = box1.getBBox();
   const tr1  = box1.transform().diffMatrix;

   const p00 = snap.select("#pixel00");
   const p01 = snap.select("#pixel01");
   const px0 = p00.transform().diffMatrix.x(p00.getBBox().x, p00.getBBox().y);
   const px1 = p01.transform().diffMatrix.x(p01.getBBox().x, p01.getBBox().y);
   snap.rect(px0, 0, px1-px0, BB1.height).attr({fill: "#ff0000", opacity: 0.5});

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
      }
   }

   setData("example01", "lastElem", undefined)
}