---
layout: post
title:  "Introduction to Covariance Tracing"
date:   2016-01-01
categories: research
published: true
javascripts:
  - utils
---

<center style="color:#EE0000;">This webpage does not correctly render on Chrome yet. It has been fully tested on Firefox and Safari.
</center><br />

<strong>Covariance Tracing</strong> is a method to evaluate the bandwidth of the <em>local radiance</em> around a given light path. Knowing the bandwidth of the radiance enable a wide variety of applications (see <a href="#citations">[1-3]</a>). This document present the idea of covariance tracing and frequency analysis in a progressive manner.

For simplicity, we will illustrate the different concepts using 2D light transport.


#### Local Bandwidth

The bandwidth of a signal provides information on the necessary sampling pattern to either reconstruct it <a href="#citations">[4]</a> or integrate it <a href="#citations">[5]</a>. Intuitively, it tells us how far apart two samples should be. This is however assuming that the bandwidth is finite (or distance between samples would be zero). Mathematically, the bandwidth is the minimum support of the Fourier transform of the signal we are considering.


#### What is covariance?

In the following, we will talk about covariance referring to the covariance of the Fourier transform of the radiance function. The covariance is a matrix describing the orientation and spread of a signal. Covariance gives us an indication on the bandwidth of the signal and enable to work with signals having infinite bandwidth.

Since we are interested by 2D light transport, we will use a 2D matrix. The complete formulation of covariance tracing involves a 5D matrix (2D in space, 2D in angles and  1D in time).

     cov = { sxx, sxy;
             syx, syy };

where `sxx` and `syy` are the variance (or squared standard deviation) of the signal along the x (and respectively y) axis of our domain. `sxy = syx` is the correlation of the signal with respect to axis x and y. A covariance matrix is symmetric and this property can be used for efficient implementation.


#### Ray Local Space

In order to describe the radiance for small perturbation of a given ray, we need a parametrization of this local space. We will use the tangential space defined by the ray. This space can be defined using a two plane parametrization (see <a href="#figure1">Fig.1</a>).

<center>
<object type="image/svg+xml" data="{{ site.url | append: site.baseurl }}/data/svg/cov_twoplanes.svg" width="604px" id="draw_cov_twoplanes"></object><br />
<div style="width:600px;"><em><a name="figure1">Fig.1 -</a> The local tangent frame of a 2D ray is described by a two plane parametrization. The first plane describes the relative position and the second plane the relative direction. Click over the \((\delta x, \delta u)\) space to change the ray.</em></div>
</center><br />

<script src="{{ site.url | append: site.baseurl }}/javascripts/draw_cov_twoplanes.js" type="text/javascript">
</script>

Now that we have this parametrization, we can express the radiance in that space: $$L(x + \delta x, u + \delta u)$$. But instead of looking at the radiance, we will be interested by its [Fourier transform](http://en.wikipedia.org/wiki/Fourier_transform). While local radiance is parametrized in 2D by the couple $$(\delta{x},\delta{y})$$, it is parametrized by the couple $$(\Omega_x,\Omega_u)$$.

The next step is to express radiance transport equations in this space and to express the frequency equivalent of those equations.


#### Radiance Operators in Local Space

Expressing the rendering equation <a href="#citations">[6]</a> or the radiative transfer equation <a href="#citations">[7]</a> in local coordinates is not possible since they rely on global coordinates. Instead, we look at solutions of those equations for simple cases (operators) that correspond to transport evaluated during path tracing. We will need to describe several transport operators such as <em>travel in free space, reflection, refraction, etc.</em> (see <a href="#figure2">Fig.2</a>).

<center>
<div style="position:relative;width:600px;height:300px;">
<object type="image/svg+xml" data="{{ site.url | append: site.baseurl }}/data/svg/cov_path.svg" width="600px" id="draw_cov_path-cv" style="position:absolute;top:0px;left:0px;"></object></div><br />
<div style="width:600px;"><em><a name="figure2">Fig.2 -</a> Frequency analysis of light transport builds from light to sensor (left to right) by concatenating atomic operators. 
Those atomic operators correspond to specific elements of light transport such as transport \(T_d\), scattering \(B_\rho\), etc. For our implementation, we are interested on the 
effect those operators have on the covariance matrix \(\Sigma\).</em></div>
</center><br />

Remember that we are interested not in the resulting radiance, but to its covariance. What we really want is <strong>how an operator affects the covariance</strong>. Fortunately, under a first order assumption (equivalent to paraxial optics), we can formulate analytically how operators modify the covariance matrix.


<strong>The travel operator</strong> is the simplest of all. It describes the local radiance given that we now the local radiance from a previous position along the ray.

<center>
<div style="position:relative;width:600px;height:300px;">
<canvas id="draw_cov_travel-gl" style="position:absolute;left:335px;top:26px;width:243px;height:243px;background-color:#FFF;border:0px"></canvas>
<object type="image/svg+xml" data="{{ site.url | append: site.baseurl }}/data/svg/cov_travel.svg" width="600px" id="draw_cov_travel-cv" style="position:absolute;top:0px;left:0px;"></object></div><br />
<div style="width:600px;"><em><a name="figure3">Fig.3 -</a> The travel operator. Given a diffuse light source with Gaussian spread in the tangent plane of the ray, the local radiance at any point along the ray is the initial local radiance sheared by the distance to the source. Use the mouse to move the plane.</em></div>
</center><br />

<script src="{{ site.url | append: site.baseurl }}/javascripts/draw_cov_travel.js" type="text/javascript">
</script>

This operator shears the local radiance by the amount of traveled distance. The equivalent operator on the covariance matrix is also a shear which parameter is the traveled distance in meters. A Matlab implementation of the operator is the following:

      // Express the covariance after a travel of 'd' meters
      function travel(d) {
         op = { 1, d;
                0, 1};
         cov = op' * cov * op;
      }


<strong>The projection operator</strong> enables to express the local radiance and the covariance in the tangent plane of objects. This is necessary to express the reflection or refraction of light on a planar surface. When the surface is non-planar, the <strong>curvature operator</strong> has to be applied after this operator.

      function project(cos) {
         op = {cos, 0;
                 0, 1};
         cov = op' * cov * op;
      }


<strong>The BRDF operator</strong> describes how the roughness reduces the bandwidth of the reflected local radiance. This is well known that the BRDF can be thought as being a blurring filter (think of pre-filtered envmaps).

<center>
<div style="position:relative;width:600px;height:300px;">
<canvas id="draw_cov_brdf-gl" style="position:absolute;left:335px;top:26px;width:243px;height:243px;background-color:#FFF;border:0px"></canvas>
<object type="image/svg+xml" data="{{ site.url | append: site.baseurl }}/data/svg/cov_brdf.svg" width="600px" id="draw_cov_brdf-cv" style="position:absolute;top:0px;left:0px;"></object></div><br />
<div>BRDF exponent: 100 <input style="vertical-align: middle;" type="range" min="100" max="1000" value="1000" step="5" onchange="drawBRDF(this.value)" /> 1000</div>
<div style="width:600px;"><em><a name="figure4">Fig.4 -</a> The BRDF operator. In this case, we use as input a tight Gaussian cone light. The light's cone is blurred by the BRDF. Using the cursor, you can vary the phong exponent from 100 to 1000 and see the blurring effect.</em></div>
</center><br />

The BRDF operator is not easy to define using the covariance matrix. Intuitively, we want to express the covariance of the product of two signals using their respective covariance matrices. If we have no knowledge of the type of signals we are multiplying, then this product is undefined. However, in the case of Gaussians spectra the product is defined as the inverse of the sum of the inverse covariance matrices.

      function BRDF(B) {
         cov = inverse(inverse(cov) + B);
      }

where `B` describe the angular blur of the BRDF. It is defined using the absolute value of the BRDF's Hessian in the tangent plane of the reflected ray. For a Phong BRDF with exponnent `e`, the matrix is defined as:

     B = { 0, 0;
           0, 4*pi^2/e};

<strong>The curvature operator</strong>. So far we have expressed how to trace the covariance of local radiance when light is reflected by planar objects. To incorporate the the local variation of the object's surface into covariance tracing, we will enable to project the local radiance from the tangent plane to a first order approximation of the surface using its curvature.

      function curvature(k) {
         op = { 1, k;
                0, 1};
         cov = op' * cov * op;
      }

<strong>The visibility operator</strong>. Since we are studying local radiance, we need to account for the fact that part light might be occluded or that part of the light will not interact with an object. We account for those two effects by reducing the local window used for our frequency analysis until there is no more near-hit or near-miss rays. Applying a window to a signal means that we will convolve its Fourier spectrum by the window Fourier spectrum. In terms of covariance, this boils down to summing the covariance matrices.

We usualy assumes that occluders are planar. In such case, we can perform the windowing on the spatial component only. If an occluder has non negligeable depth, then we can slice it along its depth and apply multiple times the occlusion operator.

      function occlusion(w) {
         occ = {w, 0;
                0, 0};
         cov = cov + occ;
      }

<script src="{{ site.url | append: site.baseurl }}/javascripts/draw_cov_brdf.js" type="text/javascript"></script>
<script id="raytracer2d-fs"  type="x-shader/x-fragment">{% include shaders/raytracer2d.fs %}</script>
<script id="raytracer2d-vs"  type="x-shader/x-vertex">{% include shaders/raytracer2d.vs %}</script>

#### Bibliography
<a name="citations"></a>

  1. 5D Covariance Tracing for Efficient Defocus and Motion Blur. Belcour <em>et al.</em> 2013. ACM TOG.
  2. Frequency Analysis of Light Scattering and Absorption. Belcour <em>et al.</em> 2014. ACM TOG.
  3. Antialiasing Complex Global Illumination Effects in Path-space. Belcour <em>et al.</em> 2015. Tech Report.
  4. Communication in the presence of noise. Shannon 1949. Proc. Institute of Radio Engineers.
  5. A Frequency Analysis of Monte-Carlo and other Numerical Integration Schemes. Durand 2011. Tech Report.
  6. The Rendering Equation. Kajiya 1986. ACM SIGGRAPH.
  7. Wave Propagation and Scattering in Random Media. Ishimaru 1999. John Wiley & Sons.
