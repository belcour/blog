precision mediump float;

#define M_PI 3.1415926535897932384626433832795

// This shader requires to provide multiple uniform elements. It needs to know
// the size in pixel (resX, resY) of the render target. It also need to know
// where the sensor is in the space 'origin'. It assumes that the sensor is
// looking in a direction 'direction' with up vector 'up'. Note, 'up' can be
// scaled to account for the size of the sensor. However, 'direction' and 'up'
// need to always to orthogonal.
//
uniform float resX, resY;
uniform vec2  origin, direction, up;
uniform float exponent;

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
vec3 raytrace(in vec2 org, in vec2 dir, in vec2 e) {

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
      
      // Sample phong
      vec2 r = d - 2.0*dot(d, n)*n;
      vec2 b = (r.x != 0.0) ? vec2(r.y, -r.x) : vec2(-r.y, r.x);
      float dy = pow(1.0 - e.x, 1.0/(exponent+1.0));
      float dx = ((e.y > 0.5) ? -1.0 : 1.0) * sqrt(1.0-dy*dy);
      d = dy*r + dx*b;

      o   = p + 1.0E-8*d;
   }
   return color;
}

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v)
  {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
// First corner
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

// Other corners
  vec2 i1;
  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
  //i1.y = 1.0 - i1.x;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  // x0 = x0 - 0.0 + 0.0 * C.xx ;
  // x1 = x0 - i1 + 1.0 * C.xx ;
  // x2 = x0 - 1.0 + 2.0 * C.xx ;
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

// Permutations
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

// Gradients: 41 points uniformly over a line, mapped onto a diamond.
// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

// Normalise gradients implicitly by scaling m
// Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

// Compute final noise value at P
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float random(float u) {
    return snoise(vec2(u, 0.0));
}

void main(void) {
   vec2 xu = 0.5*vec2(gl_FragCoord.x/resX - 0.5,
                  gl_FragCoord.y/resY - 0.5);

   vec2 org = origin + xu.x*up;
   vec2 dir = normalize(normalize(direction) + xu.y*up);
   vec3 color = vec3(0.0,0.0,0.0);
   const int I = 16;
   const int J = 16;

   for(int i=0; i<I; ++i) {
       for(int j=0; j<J; ++j) {
            float u = float(i) / float(I-1);
            float v = float(j) / float(J-1);
            vec2 e = vec2(u, v);
            color += raytrace(org, dir, e);
       }
   }
   gl_FragColor = vec4(color / float(I*J),1.0);
}
