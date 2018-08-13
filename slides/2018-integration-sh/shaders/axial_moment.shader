#line 1
precision highp float;

#include "shaders/library/common.shader"
#include "shaders/library/sh.shader"
#include "shaders/library/raytracing.shader"

uniform int   u_Show;
uniform int   SH_l;
uniform int   SH_m;
uniform float u_Scale;
uniform float u_G;
uniform vec3  u_wi;
uniform vec3  u_Plane[4];
uniform float u_Rng[100];
uniform sampler2D u_ColorMap;

varying vec3 vNormal;
varying vec4 vPosition;

const int L = 14;
const int S = (L+1)*(L+1);
const int T = 32;
uniform sampler2D u_LuT;

void main() {
    float clm[225];
    mat3 rot = mat3(
        0.0, 1.0, 0.0,
        -1.0, 0.0, 0.0,
        0.0, 0.0, 1.0
        );
    vec3 wo = rot * vNormal.xyz;
    SH_Fast(wo, L, clm);


    float v = 0.0;
    vec3 wi = rot*u_wi;
    float dot_io = dot(wi, wo);
    v += pow(dot_io, float(SH_l));

    float c = u_Scale;
    if(intersectTriangle(vec3(0.0, 0.0, 0.0), vNormal, u_Plane[0], u_Plane[1], u_Plane[2]) ||
       intersectTriangle(vec3(0.0, 0.0, 0.0), vNormal, u_Plane[1], u_Plane[3], u_Plane[2])) {
        c = 1.0;
    }

    vec4 colormap = texture2D(u_ColorMap, vec2(v, 0.0));
    gl_FragColor = vec4(c,c,c,1)*vec4(colormap.xyz, 1.0);

    //gl_FragColor = 100.0*texture2D(u_LuT, 0.5*vPosition.xy + vec2(0.5, 0.5));
}