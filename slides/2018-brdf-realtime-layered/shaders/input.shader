#line 1
precision highp float;

#include "shaders/library/common.shader"
#include "shaders/library/random.shader"
#include "shaders/library/brdf.shader"
#line 7

// Uniform variables
uniform vec3   wi;
uniform float  u_Alpha;
uniform float  u_Scale;
uniform float  u_Gamma;

/* Gamma transformation
 */
vec3 Gamma(vec3 R) {
    return R;
    // return exp(u_Gamma * log(u_Scale * R));
}

/* Evaluate an emissive term
 */
vec3 Emission(vec3 w, float alpha) {
    return GGX(wi, w, vec3(0.0, 0.0, 1.0), alpha) * vec3(1,1,1);
}

void main(void) {

    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);

    // Get the omega_o direction from the vPos variable
    vec3 wo;
    wo.xy = vPos.xy;
    float sinTo = length(wo.xy);
    if(sinTo <= 1.0) {
        wo.z = sqrt(1.0 - sqr(sinTo));
        vec3 wr = -reflect(wi, vec3(0.0, 0.0, 1.0));

        gl_FragColor.xyz = vec3(0.0, 0.0, 0.0);//Gamma(GGX(wi, wo, vec3(0.0, 0.0, 1.0), u_Alpha) * vec3(1,1,1));
        gl_FragColor.w = 1.0;

        if(dot(wo, wi) > 0.9995) {
            gl_FragColor.xyz = vec3(1.0, 0.0, 0.0);
        }

        // if(dot(wo, wr) > 0.9995) {
        //     gl_FragColor.xyz = vec3(0.0, 1.0, 0.0);
        // }
    }
}