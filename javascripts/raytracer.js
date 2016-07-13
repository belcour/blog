/////////////////
/// Math code ///
/////////////////

function dot(p1, p2) {
   return p1.x*p2.x + p1.y*p2.y;
}

function add(p1, p2) {
   return {x: (p1.x+p2.x), y: (p1.y+p2.y)};
}

function sub(p1, p2) {
   return {x: (p1.x-p2.x), y: (p1.y-p2.y)};
}

function mul(t, vec) {
   return {x: t*vec.x, y: t*vec.y};
}

function revert(n) {
   return {x: -n.x, y: -n.y };
}

function normalize(d) {
   var norm = Math.sqrt(d.x*d.x + d.y*d.y);
   return {x: d.x/norm, y: d.y/norm};
}


///////////////////////////
/// Scene specific code ///
///////////////////////////

function createScene() {
   var scene = {};
   return scene;
}

// A object needs to be created using the following concept:
//
//    object:
//    {
//       t:  [int] // 1='sphere', 0='plane'
//
//       /* for planes */
//       p1: { x: [float], y: [float] }
//       p2: { x: [float], y: [float] }
//
//       /* for spheres */
//       c:  {x: [float], y: [float]}
//       r: [float]
//
//       L:  [float] // Emission [optional]
//       E:  [float] // Exponent [optional]
//    }
//
function addObject(scene, object) {
   if(object.p1 == null || object.p2 == null) {
      console.log("Error: object is incorrect");
      return;
   }
   if(object.L == null && object.E == null) {
      console.log("Error: object is incorrect: no emission or exponent.");
      return;
   }

   if(scene.objects == null) {
      scene.objects = [object];
   } else {
      scene.objects.push(object);
   }
}

// A camera needs to be created using the following concept:
//    camera:
//    {
//       o:  { x: [float], y: [float] }
//       d:  { x: [float], y: [float] }
//       up: { x: [float], y: [float] }
//    }
function addCamera(scene, camera) {
   if(!camera.o || !camera.d || !camera.up) {
      console.log("Error: object camera is incorrect: " + camera);
      return;
   }

   scene.camera = camera;
}

/* Intersection function with an object, return a 'hit' object containing
 * the principal information regarding the intersection (if exists).
 *
 *    hit:
 *    {
 *       hit: [bool],
 *       t: [float]
 *       p: { x: [float], y: [float] },
 *       n: { x: [float], y: [float] }
 *    }
 */
function intersectPlane(ray, object) {
   var hit = {};
   hit.hit = false;

   var p1 = object.p1;
   var p2 = object.p2;

   var d  = sub(p2, p1);
   var nn = (d.x != 0.0) ? normalize({x: d.y, y: -d.x})
                         : normalize({x: -d.y, y: d.x});

   var dotDN = dot(ray.d, nn);
   if(dotDN == 0.0) {
       return hit;
   } else if(dotDN > 0.0) {
       nn = revert(nn);
   }

   var tt = dot(sub(p1, ray.o), nn) / dot(ray.d, nn);
   if(tt <= 0.0 || tt >= 1.0E8) {
       return hit;
   }

   var p  = add(ray.o, mul(tt, ray.d));
   var dd = sub(p, p1);
   var dotDD = dot(d, dd);
   var dotD  = dot(d, d);
   if(dotDD > 0.0 && dotDD < dotD) {
      hit.hit = true;
      hit.t = tt;
      hit.p = p;
      hit.n = nn;
   }
   return hit;
}

/* Intersection function with a sphere. Returns a 'hit' objects
 * containing the principal informatiopn regarding the intersection
 * (if it exists).
 */
function intersectSphere(ray, object) {
   var hit = {}
   hit.hit = false;

   // Solve the quadratic form
   var a = Math.sqrt(dot(ray.d, ray.d));
   var b = 2*dot(ray.d, sub(ray.o,object.c));
   var c = dot(sub(ray.o,object.c), sub(ray.o,object.c)) - object.r*object.r;
   var D = b*b - 4*a*c;
   if(D >= 0.0) { // Got a hit!
      hit.hit = true;
      hit.t = (Math.sqrt(D)-b) / (2*a);
      hit.p = add(ray.o, mul(hit.t,ray.d));
      hit.n = normalize(sub(hit.p, object.c));
   }

   return hit;
}

/* Sample a 'Phong lobe from the incident direction 'wi', the normal 'n'
 * and the exponent 'exp'. This samples exactly the BRDF so there is no
 * need to multiply by it afterwards.
 */
function sample(wi, n, exp) {
   // Generate the reflected ray frame.
   var wr = sub(mul(2.0*dot(wi, n), n), wi);
   var tv = (wr.x != 0.0) ? normalize({x: wr.y, y: -wr.x})
                          : normalize({x: -wr.y, y: wr.x});

   var dy = Math.pow(1.0 - Math.random(), 1.0/(exp+1.0));
   var dx = ((Math.random() < 0.5) ? -1.0 : 1.0) * Math.sqrt(1.0-dy*dy);

   return add(mul(dy, wr), mul(dx, tv));
}

/* Ray tracing function.
 */
function raytrace(ray, scene, depth) {

   var hit = {};
   hit.k = -1;
   hit.t = 1.0E8;

   for(var k=0; k<scene.objects.length; k++) {
      var object = scene.objects[k];
      var tHit;
      if(object.t == 1) {
         tHit = intersectSphere(ray, object);
      } else {
         tHit = intersectPlane(ray, object);
      }

      if(tHit.hit && tHit.t < hit.t) {
         hit = tHit;
         hit.k = k;
      }
   }

   // Hit an object. Look for the radiance contribution. If none, shoot another
   // ray in the scene using a pseudo random number generator.
   if(hit.k >= 0 && depth < 2) {
      var object = scene.objects[hit.k];
      if(object.L != null) {
         return object.L;
      } else {
         if(object.E != null) {
            var wi = revert(ray.d);

            if(dot(wi, hit.n) <= 0) { return 0; }

            var wo = sample(wi, hit.n, object.E);
            var rray = { o: add(hit.p, mul(0.001, wo)), d: wo };
            return raytrace(rray, scene, depth+1);
         } else {
            return 0;
         }
      }

   // No object hit. Return zero.
   } else {
      return 0.0;
   }
}

/* Main render function. You need to pass a render target that can create a 2D
 * context and contains the definition of resolution ('width' and 'height').
 * The scene created and populated using this code. And a pass number. Passes
 * needs to be called progressively.
 */
function render(target, scene, pass) {
   // Create the target image
   var  ctx = target.getContext('2d');
   var data = ctx.getImageData(0, 0, target.width, target.height);

   const spp = 4;

   // Check for the scene validity
   if(!scene.camera || !scene.objects) {
      return;
   }

   var I = target.width;
   var J = target.height;
   for (var i = 0; i<I; i++) {
      for (var j = 0; j <J; j++) {

         index = (i + j * J) * 4;

         var radiance = 0;

         // Super sampling
         for (var ei=0; ei<spp; ei++) {
            for (var ej=0; ej<spp; ej++) {

               var x = 2.0*((i + (ei + 0.5)/spp) / I - 0.5);
               var y = 2.0*((j + (ej + 0.5)/spp) / J - 0.5);
               var ray = {
                  o: add(scene.camera.o, mul(x, scene.camera.up)),
                  d: normalize(add(scene.camera.d, mul(y, scene.camera.up)))
               };

               radiance += raytrace(ray, scene, 0) / (spp*spp);
            }
         }

         var w1 = pass / (pass+1);
         var w2 = 1.0  / (pass+1);

         data.data[index + 0] = w1*data.data[index + 0] + w2*radiance*255;
         data.data[index + 1] = w1*data.data[index + 1] + w2*radiance*255;
         data.data[index + 2] = w1*data.data[index + 2] + w2*radiance*255;
         data.data[index + 3] = 255;
      }
   }
   ctx.putImageData(data, 0, 0);
}
