#line 1
precision highp float;

#include "shaders/library/common.shader"
#include "shaders/library/brdf.shader"
#include "shaders/library/layer.shader"
#include "shaders/library/pivot.shader"
#line 8

// Uniform variables
uniform vec3   wi;
uniform int    u_ApproxMethod;
uniform int    u_CheckReference;
uniform float  u_Scale;
uniform float  u_Gamma;

/* Gamma transformation
 */
vec3 Gamma(vec3 R) {
    return exp(u_Gamma * log(u_Scale * R));
}
const float M_PI = 3.14159265358979323846;

void ComputeApproxRoughness(in vec3 wi, in vec3 wo, out float a, out float f) {

    // Set the initial values for the importance distribution
    a = 0.0;
    f = 1.0;

    // Temp variables
    float R12;
    vec3  wt, w, wto;

    // IOR ratio
    float eta1 = layers[0].n;
    float eta2 = layers[1].n;
    float ieta = eta1 / eta2;
    float eta  = eta2 / eta1;

    // Evaluate the Fresnel term for the transmitted rays
    Fresnel(wi, layers[0].n, layers[1].n, wt, R12);
    f *= abs(1.0 - R12);

    // First interface (between air [0] and first layer [1])
    // Scale the roughness for the transmission
    float r    = layers[1].a * 0.5*(eta*wt.z - wi.z)/(eta*wt.z);
    float s12  = sqr(r) / (2.0 - 2.0*sqr(r));
    a   += s12;

    // Convert back to roughness
    a  = sqrt(2.0 / ((1.0/a) + 2.0));
}

void ComputeRoughnessKulla(in vec3 wi, in vec3 wo, out float a, out float f) {

    // Set the initial values for the importance distribution
    a = 0.0;
    f = 1.0;

    // Temp variables
    float R12;
    vec3  wt, w, wto;

    // IOR ratio
    float eta1 = layers[0].n;
    float eta2 = layers[1].n;
    float ieta = eta1 / eta2;
    float eta  = eta2 / eta1;

    // Evaluate the Fresnel term for the transmitted rays
    Fresnel(wi, layers[0].n, layers[1].n, wt, R12);
    f *= abs(1.0 - R12);

    // Scale the roughness for the transmission
    a = sqrt(0.5*(eta - 1.0) / eta) * layers[1].a; // Using Kulla & Conty [2017] slide 39
}

void main(void) {

    // Get the omega_o direction from the vPos variable
    vec3 wo;
    wo.xy = vPos.xy;
    float sinTo = length(wo.xy);
    if(sinTo <= 1.0) {
        wo.z = sqrt(1.0 - sinTo*sinTo);
        vec3 wr = -reflect(wi, vec3(0.0, 0.0, 1.0));
        vec3 wt = SnellRefraction(wi, vec3(0.0, 0.0, 1.0), layers[0].n/layers[1].n);
        if(length(wt) <= 0.0001) {
            gl_FragColor = vec4(0, 0, 0, 1);
            return;
        }

        // Update the mean direction to match the off-specular direction
        float smoothness = 1.0 - layers[1].a;
        float lerpFactor = smoothness * (sqrt(smoothness) + layers[1].a);
        vec3  wa = lerpFactor*wt + (1.0-lerpFactor)*wi;
        wa.z = sqrt(1.0 - (wa.x*wa.x + wa.y+wa.y));

        vec3 R = vec3(0.0, 0.0, 0.0);

        const float thickness = 0.005;

        // Using covariance approximation for the resulting BRDF function.
        if(u_CheckReference == 0 &&  wo.y > thickness) {
            if(u_ApproxMethod == 0) {
                float a, f;
                ComputeApproxRoughness(wi, wo, a, f);

                float GGX_r;
                GGX_r  = GGX(-wt, wo, vec3(0.0, 0.0, 1.0), max(a, 1.0E-5));
                R     += f * GGX_r * vec3(1.0, 1.0, 1.0);
            } else {
                float a, f;
                ComputeRoughnessKulla(wi, wo, a, f);

                float GGX_r;
                GGX_r  = GGX(-wt, wo, vec3(0.0, 0.0, 1.0), max(a, 1.0E-5));
                R     += f * GGX_r * vec3(1.0, 1.0, 1.0);
            }
        } else if(u_CheckReference == 0 &&  wo.y > -thickness) {
            R += vec3(1.0, 0.0, 0.0);        
        } else {
            /* Perform random evaluation of the layered structure using 'wiT' and 'woT'
            * as the incoming and outgoing directions.
            */
            float GGX_t; vec3  wO;
            wO.xy =  wo.xy;
            wO.z  = -wo.z;
            GGX_t = GGX_T(wi, wO, vec3(0.0, 0.0, 1.0), layers[0].n, layers[1].n, max(layers[1].a, 1.0E-5));
            R += GGX_t * vec3(1.0, 1.0, 1.0);

        }

        gl_FragColor.xyz = Gamma(R);
        gl_FragColor.w   = 1.0;

        // Display helpers that show the incoming ray and the purely reflected
        // ray using circles.
        float dist;
        wt.z = sqrt(1.0 - sqr(length(wt.xy)));
        dist = dot(wo, wt);
        if(dist > 0.9995) {
            gl_FragColor.xyz = vec3(0.0, 0.0, 1.0);
        }
        // dist = dot(wo, wr);
        // if(dist  > 0.9995) {
        //     gl_FragColor.xyz = vec3(0.0, 1.0, 0.0);
        // }
        dist = dot(wo, wi);
        if(dist  > 0.9995) {
            gl_FragColor.xyz = vec3(1.0, 0.0, 0.0);
        }
        // dist = dot(wo, wa);
        // if(dist  > 0.9995) {
        //     gl_FragColor.xyz = vec3(1.0, 0.0, 1.0);
        // }
        
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    }
}