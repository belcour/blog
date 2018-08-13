#line 1
precision highp float;

#include "shaders/library/common.shader"
#include "shaders/library/sh.shader"
#include "shaders/library/raytracing.shader"

#define NB_ZONALS 10

void Legendre_Fast(in float z, out float pOut[NB_ZONALS]) {
    pOut[0] = 1.0;
    pOut[1] = z;
    for(int i=2; i<NB_ZONALS; ++i) {
        pOut[i] = ((2.0*float(i)-1.0)*z*pOut[i-1] - (float(i)-1.0)*pOut[i-2]) / float(i);
    }
}

uniform int   u_Show;
uniform int   SH_l;
uniform int   SH_m;
uniform float u_Scale;
uniform float u_G;
uniform float u_SinTi;
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

    // Update sin(theta_i) sign and the direction of the
    // outgoing lobe.
    float sinTi = abs(u_SinTi);
    if(u_SinTi < 0.0) {
        rot[1][0] = 1.0;
    }

    // Apply local transform
    vec3 wo = rot * vNormal.xyz;
    vec3 wi = rot * u_wi;
    SH_Fast(wo, L, clm);

    float v = 0.0;
    // Use random number to defined clm
    if(u_Show == 0) {
        for(int i=0; i<S; ++i) {
            v += u_Rng[i] * clm[i];
        }

    // Use the HG expansion to SH
    } else if(u_Show == 1) {
        for(int l=0; l<=L; ++l) {
            v += pow(u_G, float(l)) * clm[l*(l+1)];
        }

    // Use MERL database coefficients
    } else if(u_Show == 2) {
        for(int i=0; i<S; ++i) {
            // clm_i coefficient
            float clm_i = clm[i];

            // Zonal filter
            float b = floor(sqrt(float(i)));
            float f = exp(- (b*b)/float(L*L));
            clm_i *= f;
            
            // Multiply by the data coeff
            vec2 uv = vec2((float(i)+0.01)/float(S), sinTi);
            v += texture2D(u_LuT, uv).r * clm_i;
        }
        v =  10.0 * max(v, 0.0) * max(vNormal.z, 0.0);

    // Use Spherical Harmonics basis
    } else if ( u_Show == 3 ) {
        for(int i=0; i<S; ++i) {
            if(i == SH_l) {
                v = 0.5*(clm[i] + 1.0);
            }
        }

    // Use cosine power basis
    } else if ( u_Show == 4 ) {
        // vec3 wi = vec3(u_SinTi, 0.0, sqrt(1.0-u_SinTi*u_SinTi));
        //wi = normalize(vec3(0.1, 0.5, 0.8));
        float dot_io = dot(normalize(wi), normalize(wo));
        float c_dot  = 1.0;
        for(int i=0; i<L; ++i) {
            if(i == SH_l) {
                v = 0.5*(c_dot/2.0+1.0);
            }
            c_dot *= dot_io;
        }

    // Zonal Harmonics
    } else if ( u_Show == 5 ) {

        // Evaluate Zonal Harmonics
        float dot_io = dot(normalize(wi), normalize(wo));
        float zl[NB_ZONALS];
        Legendre_Fast(dot_io, zl);

        // Select the correct ZH
        for(int i=0; i<L; ++i) {
            if(i == SH_l) {
                v = 0.5*(zl[i]/2.0+1.0);
            }
        }

    // Don't know what to do?
    } else {
        v = 1.0;
    }
    

    float c = u_Scale;
    if(intersectTriangle(vec3(0.0, 0.0, 0.0), vNormal, u_Plane[0], u_Plane[1], u_Plane[2]) ||
        intersectTriangle(vec3(0.0, 0.0, 0.0), vNormal, u_Plane[1], u_Plane[3], u_Plane[2])) {
        c = 1.0;
    }

    vec4 colormap = texture2D(u_ColorMap, vec2(v, 0.0));
    gl_FragColor = vec4(c,c,c,1)*vec4(colormap.xyz, 1.0);

    //gl_FragColor = 100.0*texture2D(u_LuT, 0.5*vPosition.xy + vec2(0.5, 0.5));
}