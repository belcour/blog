---
layout: post
title:  "Introduction to Covariance Tracing"
date:   2016-01-01
categories: research
published: true
---

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
<!--<canvas id="draw_cov_twoplanes" width="600px" height="250px">
</canvas><br />-->
<div style="width:600px;"><em><a name="figure1">Fig.1 -</a> The local tangent frame of a 2D ray is described by a two plane parametrization. The first plane describes the relative position and the second plane the relative direction. Click over the \((\delta x, \delta u)\) space to change the ray.</em></div>
</center><br />

<script src="{{ site.url | append: site.baseurl }}/javascripts/draw_cov_twoplanes.js" type="text/javascript">
</script>

Now that we have this parametrization, we can express the radiance in that space: $$L(x + \delta x, u + \delta u)$$. The next step is to express radiance transport equations in this space.


#### Radiance Operators in Local Space

Expressing the rendering equation <a href="#citations">[6]</a> or the radiative transfer equation <a href="#citations">[7]</a> in local coordinates is not possible since they rely on global coordinates. Instead, we look at solutions of those equations for simple cases (operators) that correspond to transport evaluated during path tracing. We will need to describe several transport operators such as <em>travel in free space, reflection, refraction, ...</em>

Remember that we are interested not in the resulting radiance, but to its covariance. What we really want is <strong>how an operator affects the covariance</strong>. Fortunately, under a first order assumption (equivalent to paraxial optics), we can formulate analytically how operators modify the covariance matrix.

<strong>Travel operator</strong> is the simplest of all. It describes the local radiance given that we now the local radiance from a previous position along the ray.

This operator shears the local radiance. The equivalent operator on the covariance matrix is also a shear which parameter is the traveled distance in meters. A Matlab implementation of the operator is the following:

      // Express the covariance after a travel of 'd' meters
      function travel(d) {
         op = { 1, d;
                0, 1};
         cov = op' * cov * op;
      }


#### Bibliography
<a name="citations"></a>

  1. 5D Covariance Tracing for Efficient Defocus and Motion Blur. Belcour <em>et al.</em> 2013. ACM TOG.
  2. Frequency Analysis of Light Scattering and Absorption. Belcour <em>et al.</em> 2014. ACM TOG.
  3. Antialiasing Complex Global Illumination Effects in Path-space. Belcour <em>et al.</em> 2015. Tech Report.
  4. Communication in the presence of noise. Shannon 1949. Proc. Institute of Radio Engineers.
  5. A Frequency Analysis of Monte-Carlo and other Numerical Integration Schemes. Durand 2011. Tech Report.
  6. The Rendering Equation. Kajiya 1986. ACM SIGGRAPH.
  7. Wave Propagation and Scattering in Random Media. Ishimaru 1999. John Wiley & Sons.
