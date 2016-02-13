precision mediump float;

// This shader requires to provide multiple uniform elements. It needs to know
// the size in pixel (resX, resY) of the render target. It also need to know
// where the sensor is in the space 'origin'. It assumes that the sensor is
// looking in a direction 'direction' with up vector 'up'. Note, 'up' can be
// scaled to account for the size of the sensor. However, 'direction' and 'up'
// need to always to orthogonal.
//
uniform float resX, resY;
uniform vec2  origin, direction, up;

// Compute the intersection between a ray and a 2d plane
void intersectPlane(in  vec2 p1, in  vec2 p2, in vec2 org, in vec2 dir,
                    inout float t, inout vec2  n, inout vec2 r) {
   vec2 d = p2-p1;
   vec2 nn = normalize((d.x != 0.0) ? vec2(d.y, -d.x) : vec2(-d.y, d.x));

   float dotDN = dot(dir, nn);
   if(dotDN == 0.0) {
       return;
   } else if(dotDN < 0.0) {
       nn = -nn;
   }

   float tt = dot(p1-org, nn) / dot(dir, nn);
   if(tt <= 0.0 || tt >= t) {
       return;
   } 
   
   vec2  p  = org + tt*dir;
   vec2  dd = p - p1;
   float dotDD = dot(d, dd);
   float dotD  = dot(d, d);
   if(dotDD > 0.0 && dotDD < dotD) {
      t = tt;
      n = nn;
      r = p;
   }
}

void intersectLight(in vec2 p1, in vec2 p2, float scale, in vec2 org, in vec2 dir,
                    inout float t, inout vec2 n, inout vec3 rgb) {

    vec2  p, nn;
    float tt = 1.0E8;
    intersectPlane(p1, p2, org, dir, tt, nn, p);
    if(tt > 0.0 && tt < 1.0E8) {
        rgb =  exp(- scale * pow(length(p - 0.5*(p1+p2)), 2.0)) * vec3(1.0,1.0,1.0);
        t = tt;
        n = nn;
    }
}

// Send a ray using its origin 'org' and direction 'dir' Return a R,G,B vector
// that contains the outputed radiance. During parsing of this shader, the
// string 'intersect' should be replaced by call to intersection functions
// and update the boolean 'hit', the intersection distance 't', the normal
// at the intersection position 'n' and the roughness 's'.
//
vec3 raytrace(in vec2 org, in vec2 dir) {

   // Resulting color and throughput
   vec3 color = vec3(0,0,0);
   vec3 tr    = vec3(1,1,1);
   vec2 o     = org;
   vec2 d     = dir;

   for(int depth=0; depth<2; ++depth) {
     
      // Variables
      vec2  p = vec2(0.0, 0.0);
      vec2  n = vec2(0.0, 1.0);
      float t = 1.0E9;
      vec3 rgb = vec3(0,0,0);
      
#intersect
	  
      // Accumulate the color value 
	  color += tr*rgb;

      // Reshoot part
      if(t <= 0.0 || t >= 1.0E8 || length(rgb) > 0.0) { break; }
      d   = d - 2.0*dot(d, n)*n;
      o   = p + 1.0E-8*d;
      tr *= 1.0;
   }
   return color;
}


void main(void) {
   vec2 xu = 0.5*vec2(gl_FragCoord.x/resX - 0.5,
                  gl_FragCoord.y/resY - 0.5);

   vec2 org = origin + xu.x*up;
   vec2 dir = normalize(normalize(direction) + xu.y*up);

   gl_FragColor = vec4(raytrace(org, dir), 1.0);
}
