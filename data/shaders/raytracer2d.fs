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
bool intersectPlane(vec2 p1, vec2 p2, vec2 org, vec2 dir,
                    float& t, vec2& n, float& r) {
   return false;
}

void intersectLight(vec2 p1, vec2 p2, vec2 org, vec2 dir,
                    float& t, vec2& n, vec3& rgb) {

   vec2 d = p2-p1;
   vec2 nn = vec2(d.y, -d.x);

   float dotDN = dot(dir, n);
   if(dotDN == 0.0) return;

   float tt = (dot(org, p1) - dot(dir, p1)) / dotDN;
   vec2  dd = org + tt*dir - p1;
   float dotDD = dot(d, dd);
   float dotD  = dot(d, d);
   if(tt > 0.0 && tt < t && dotDD > 0 && dotDD < dotD) {
      t = tt;
      n = nn;
      rgb = vec3(1,1,1);
   }
}

// Send a ray using its origin 'org' and direction 'dir' Return a R,G,B vector
// that contains the outputed radiance. During parsing of this shader, the
// string 'intersect' should be replaced by call to intersection functions
// and update the boolean 'hit', the intersection distance 't', the normal
// at the intersection position 'n' and the roughness 's'.
//
vec3 raytrace(vec2 org, vec2 dir) {

   // Variables
   bool  hit = false;
   vec2  p, n;
   float s;
   float t = 1.0E8;

   vec3 rgb = vec3(0,0,0);

//#intersect
   intersectLight(vec2(-2, -0.5), vec2(-2, 0.5), org, dir, t, n, rgb);

   if(reshoot) {
      // Compute the reflected ray
      vec2 r = 2*dot(n, dir)*dir + dir;

      // Sample a new direction
      float pdf;
      vec2 d = sampleDirection(r, s, pdf);

      // Continue ray tracing
      return rgb * raytrace(p, d) / pdf;
   } else {
      return rgb;
   }
}


void main(void) {
   vec2 xu = 2.0*vec2(gl_FragCoord.x/resX - 0.5,
                      gl_FragCoord.y/resY - 0.5);

   vec2 org = origin + xu.x*up;
   vec2 dir = direction + xu.u*up;
   dir /= length(dir);

   gl_FragColor = vec4(raytrace(org, dir), 1.0);
}
