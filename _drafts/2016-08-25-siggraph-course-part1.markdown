---
layout: post
title:  "SIGGRAPH 2016 Course: Part 1"
date:   2016-08-25
categories: course
published: true
javascripts:
  - utils
  - raytracer
  - fft
  - snap.svg
---

<div style="width:100%;"><a style="float:left;" href="{{site.url | append: site.baseurl }}/siggraph-2016-course.html">&larr; Intro</a><a style="float:right;" href="{{ site.url | append: site.baseurl }}/course/2016/08/25/siggraph-course-part2.html">Part 2 &rarr;</a></div><br />

<!--
<center style="color:#EE0000;"><span>This webpage does not correctly render on Chrome yet. It has been tested on Firefox and Safari.</span><br /><span> If you have trouble with it, please send me a note!</span>
</center><br />
-->

This course note is the first part of the [2016 SIGGRAPH course][course-main] on Frequency Analysis of Light Transport. Additional material such as slides and source code are available in the [main page][course-main]. **Note:** most of the diagrams and figure are *interactive* (but not all of them). Please feel unashamed to click on them!


#### Introduction

The idea of Frequency Analysis of Light Transport as sketched by [Durand and colleagues [2005]][durand2005] is that many tools used in rendering are better understood using a **signal processing** approach. Not only can we explain phenomena such as soft shadows and glossy reflections, but we can also improve existing algorithms. For example, Frequency Analysis enables to improve denoising  and adaptive sampling algorithms, density estimation or antialiasing.

**Signal processing** uses an alternative representation of a signal which: its **Fourier transform**. A Fourier transform describes a signal in terms of amplitude with respect to frequency instead of the traditional view (we call *the primal*) that describes a signal in terms of amplitude with respect to coordinates.

<center>
<div style="position:relative;width:600px;height:300px;">
<canvas id="fourier-transform-01-fft" width="128px" height="128px" style="position:absolute;background-color:#FFF;z-index:1;"></canvas>
<canvas id="fourier-transform-01-img" width="128px" height="128px" style="position:absolute;background-color:#FFF;z-index:1;"></canvas>
<canvas id="fourier-transform-01-rec" width="128px" height="128px" style="position:absolute;background-color:#FFF;z-index:0;"></canvas>
<svg id="fourier-transform-01-svg" width="600px" height="300px" style="position:relative;z-index:3;"></svg>
</div><br />
<div style="width:600px;"><em>The Fourier transform of a signal describes its content with respect to variations and not positions. A fourier spectrum restricted to the center of the Fourier domain smooth. As we incorporate more elements far away from the center, the image becomes sharper. Click on areas to remove frequency content above a level.</em></div>
</center>
<script type="text/javascript" >
var s = Snap('#fourier-transform-01-svg');
Snap.load("{{ site.url | append: site.baseurl }}/data/svg/course-fourier01.svg", function (f) {
      s.append(f);
      
      // Position of the input image
      var bbox    = Snap("#image").getBBox();
      var img_cnv = document.getElementById("fourier-transform-01-img");
      var img_ctx = img_cnv.getContext('2d');
      img_cnv.style.width  = bbox.width + "px";
      img_cnv.style.height = bbox.height + "px";
      img_cnv.style.left   = bbox.x + "px";
      img_cnv.style.top    = bbox.y + "px";
      img_cnv.style.backgroundColor = "#F0F";
      
      // Reconstructed image
      var rec_cnv = document.getElementById("fourier-transform-01-rec");
      var rec_ctx = rec_cnv.getContext('2d');
      rec_cnv.style.width  = bbox.width + "px";
      rec_cnv.style.height = bbox.height + "px";
      rec_cnv.style.left   = bbox.x + "px";
      rec_cnv.style.top    = bbox.y + "px";
      rec_cnv.style.backgroundColor = "#F0F";
      rec_ctx.fillStyle = '#ffffff';
      rec_ctx.fillRect(0, 0, rec_ctx.canvas.width, rec_ctx.canvas.height);
      
      // Position of the fourier spectrum
      var bbox    = Snap("#fourier").getBBox();
      var fft_cnv = document.getElementById("fourier-transform-01-fft");
      var fft_ctx = fft_cnv.getContext('2d');
      fft_cnv.style.width  = bbox.width + "px";
      fft_cnv.style.height = bbox.height + "px";
      fft_cnv.style.left   = bbox.x + "px";
      fft_cnv.style.top    = bbox.y + "px";
      fft_cnv.style.backgroundColor = "#FFF";
      fft_ctx.fillStyle = '#ffffff';
      fft_ctx.fillRect(0, 0, fft_ctx.canvas.width, fft_ctx.canvas.height);
      
      // Load the image and display it
      const h = 128, w = 128;
      var image   = new Image(w, h);
      image.src = "{{ site.url | append: site.baseurl }}/data/images/lena.jpg";
      image.addEventListener('load', function() {
            img_ctx.drawImage(image, 0, 0, w, h);
            
            var updateFilter = function(radius) {
                  // Compute the FFT of the image
                  FFT.init(w);
                  FrequencyFilter.init(w);
                  SpectrumViewer.init(fft_ctx);
                  var src = img_ctx.getImageData(0, 0, w, h);
                  var dat = src.data;
                  var re = [], im = [];
                  for(var y=0; y<h; y++) {
                        var i = y*w;
                        for(var x=0; x<w; x++) {
                        var L = dat[(i << 2) + (x << 2) + 0] 
                              + dat[(i << 2) + (x << 2) + 1]
                              + dat[(i << 2) + (x << 2) + 2];
                        re[i + x] = L / 3.0;
                        im[i + x] = 0.0;
                        }
                  }
                  FFT.fft2d(re, im);
                  FrequencyFilter.swap(re, im);
                  
                  // Draw spectrum
                  SpectrumViewer.render(re, im, true);

                  FrequencyFilter.LPF(re, im, radius);
                  FrequencyFilter.swap(re, im);
                  FFT.ifft2d(re, im);
                  for(var y=0; y<h; y++) {
                        var i = y*w;
                        for(var x=0; x<w; x++) {
                              var val = re[i + x];
                              val = val > 255 ? 255 : val < 0 ? 0 : val;
                              var p   = (i << 2) + (x << 2);
                              dat[p] = dat[p + 1] = dat[p + 2] = val;
                        }
                  }
                  rec_ctx.putImageData(src, 0, 0);
                  rec_cnv.style.zIndex = "2";
            }
            
            updateFilter(200);
            
            Snap("#zone0").node.onclick = function() { 
                  updateFilter(4);
            };
            Snap("#zone1").node.onclick = function() { 
                  updateFilter(40);
            };
            Snap("#zone2").node.onclick = function() { 
                  updateFilter(128);
            };
      });
});
</script><br />

Mathematically, the Fourier transform of a signal $$f(\mathbf{x})$$ where $$\mathbf{x} = [x_1, \cdots, x_N] \in \mathbb{R}^N$$ is:

$$ \mathcal{F}\left[ f \right](\mathbf{\Omega}) = \int_{\mathbb{R}^N} f(\mathbf{x}) e^{i 2 \pi \mathbf{\Omega}^T \mathbf{x}} \mbox{d}\mathbf{x}.$$

Here, variable $$\mathbf{\Omega} = [\Omega_1, \cdots, \Omega_N] \in \mathbb{R}^N$$ describes the frequency domain coordinates.

The Fourier transform has many interesting properties that we will uncover as we need them. For more information about it, you can go to its [wikipedia page][wiki-fourier]. The next step is to specify how the Fourier transform is applied in rendering.


### Fourier Transform of Radiance

    TODO:
     + Freq. Analysis in pixel space is not interesting
     + Need to go back to how a pixel's value is computed: Radiance 
     + Freq. Analysis of the [Rendering Equation][kajiya1986].
     + Need schematic with dragon scene here.


#### Bandwidth

The **bandwidth** of a signal is its Fourier transform's extent. Mathematically, the bandwidth is the minimum support of the signal's Fourier transform. It provides information on the necessary sampling pattern to either [reconstruct it][shannon1949] or to [integrate it][durand2011]. Intuitively, it gives the maximum amount of relative variation a signal has. This is enough to predict the maximum distance between samples for perfect sampling. This is however assuming that the bandwidth is finite (or distance between samples would be zero). 

**Covariance Tracing** is a method to evaluate the bandwidth of the *local radiance* around a given light path. Knowing the bandwidth of the radiance enable a lot of applications (see <a href="#citations">[1-3]</a>). This document present the idea of covariance tracing and frequency analysis in a progressive way.

For simplicity, we will illustrate the different concepts using 2D light transport.


### Local Fourier Transform

      + Localisation needed to have a fine analysis
      + Need windowing W
      + Redefine a local Fourier Transform


#### What is covariance?

In the following, we will talk about covariance referring to the covariance of the Fourier transform of the radiance function. The covariance is a matrix describing the orientation and spread of a signal. Covariance gives us an indication on the bandwidth of the signal and enable to work with signals having infinite bandwidth.

$$\Sigma_{i,j} = \int_{\mathbb{R}^N} \Omega_i \, \Omega_j \; \mathcal{F_l}[f](\mathbf{\Omega}) \; \mbox{d}\mathbf{\Omega}$$

Since we are interested by 2D light transport, we will use a 2D matrix. The complete formulation of covariance tracing involves a 5D matrix (2D in space, 2D in angles and  1D in time).

     cov = { sxx, sxy;
             syx, syy };

where `sxx` and `syy` are the variance (or squared standard deviation) of the signal along the x (and respectively y) axis of our domain. `sxy = syx` is the correlation of the signal with respect to axis x and y. A covariance matrix is symmetric and this property can be used for efficient implementation.


#### Ray Local Space

In order to describe the radiance for small perturbation of a given ray, we need a parametrization of this local space. We will use the tangential space defined by the ray. This space can be defined using a two plane parametrization.

<center>
<object type="image/svg+xml" data="{{ site.url | append: site.baseurl }}/data/svg/cov_twoplanes.svg" width="604px" id="draw_cov_twoplanes"></object><br />
<div style="width:600px;"><em><a name="figure1">Fig.1 -</a> The local tangent frame of a 2D ray is described by a two plane parametrization. The first plane describes the relative position and the second plane the relative direction. Click over the \((\delta x, \delta u)\) space to change the ray.</em></div>
</center><br />

<script src="{{ site.url | append: site.baseurl }}/javascripts/draw_cov_twoplanes.js" type="text/javascript">
</script>

Mathematically, we express positions and directions as perturbations of the main position (resp. direction) along the tangent plane of the ray:

$$\mathbf{x} = \mathbf{x}_0 + \delta \mathbf{x}$$

$$\pmb{\omega} = \frac{\pmb{\omega}_0 + \delta \mathbf{u}}{|| \pmb{\omega}_0 + \delta \mathbf{u} ||}$$

Now that we have this parametrization, we can express the radiance in that space: $$L(\mathbf{x}_0 + \delta \mathbf{x}, \pmb{\omega}_0 + \delta \mathbf{u} )$$. But remember that we are interested by its Fourier transform. While local radiance is parametrized in 2D by the couple $$(\delta{x},\delta{y})$$, it is parametrized by the couple $$(\Omega_x,\Omega_u)$$ in the Fourier domain.

The next step is to express radiance transport equations in this space and to convert them using the Fourier transform.


#### Radiance Operators in Local Space

Expressing the [rendering equation][kajiya1986] or the [radiative transfer equation][ishimaru19XX] in local coordinates is not possible since they rely on global coordinates. Instead, we look at solutions of those equations for simple cases (operators) that correspond to transport evaluated during path tracing. We will need to describe several transport operators such as *travel in free space, reflection, refraction, etc.*.

<center>
<div style="position:relative;width:600px;height:300px;">
<object type="image/svg+xml" data="{{ site.url | append: site.baseurl }}/data/svg/cov_path.svg" width="600px" id="draw_cov_path-cv" style="position:absolute;top:0px;left:0px;"></object></div><br />
<div style="width:600px;"><em><a name="figure2">Fig.2 -</a> Frequency analysis of light transport builds from light to sensor (left to right) by concatenating atomic operators. 
Those atomic operators correspond to specific elements of light transport such as transport \(T_d\), scattering \(B_\rho\), etc. For our implementation, we are interested on the 
effect those operators have on the covariance matrix \(\Sigma\).</em></div>
</center><br />

Remember that we are not interested in the resulting radiance, but to its Fourier transform. What we really want is **how an operator affects the Fourier spectrum**. Fortunately, under a first order assumption (equivalent to paraxial optics), we can formulate analytically how operators modify it. Furthermore, we will have the same analytical formulation for the covariance matrix.


### The travel operator

**The travel operator** is the simplest of all. It describes the local radiance given that we now the local radiance from a previous position along the ray. Using the tangent plane formulation described earlier, we can update the local position of a ray after a travel of length `d`. Only the spatial component of the ray will be updated since the ray's direction remains fixed.

<center>
<div style="position:relative;width:600px;height:300px;">
<canvas id="draw_cov_travel-gl" style="position:absolute;left:335px;top:28px;width:241px;height:241px;background-color:#FFF;border:0px"></canvas>
<object type="image/svg+xml" data="{{ site.url | append: site.baseurl }}/data/svg/cov_travel.svg" width="600px" id="draw_cov_travel-cv" style="position:absolute;top:0px;left:0px;"></object>
<button id="draw_cov_travel_bt" type="button" style="position:absolute;left:400px;top:290px;">Fourier Transform!</button>
</div><br />
<div style="width:600px;"><em><a name="figure3">Fig.3 -</a> The travel operator. Given a diffuse light source with in the tangent plane of the ray, the local radiance at any point along the ray is the initial local radiance sheared by the distance to the source. Use the mouse to move the plane.</em></div>
</center><br />

<script src="{{ site.url | append: site.baseurl }}/javascripts/draw_cov_travel.js" type="text/javascript">
</script>

This operator shears the local radiance by the amount of traveled distance. The equivalent operator on the covariance matrix is also a shear which parameter is the traveled distance in meters. However, in the Fourier domain, the shear transfers spatial content to the angular domain. This is the opposite behaviour for radiance. It can be understood in the limit case where the travel distance is infinite. There, locally around the central direction of the ray, only radiance along the same direction remains. Thus the angular content is locally a dirac (a single direction) and the spatial content is locally a constant (same radiance for neighboring positions). 

A Matlab implementation of the operator is the following:

      // Express the covariance after a travel of 'd' meters
      function travel(d) {
         op = { 1, d;
                0, 1};
         cov = op' * cov * op;
      }


<h4>The projection operator</h4>
<strong>The projection operator</strong> enables to express the local radiance and the covariance in the tangent plane of objects. This is necessary to express the reflection or refraction of light on a planar surface. When the surface is non-planar, the <strong>curvature operator</strong> is applied after this operator.

      function project(cos) {
         op = {cos, 0;
                 0, 1};
         cov = op' * cov * op;
      }
      
 Intuitively, this operator scales the spatial frequency content to match the new frame. Imagine that the incoming radiance is unidirectional and which a structured pattern. If you account for the difference of travel with respect to the tangent plane, some ray will have to travel further than other. Thus the distance with respect to the central position will scale with respect to the angular difference between the incident local plane and the tangent plane and the structured pattern will be dilated. Dilatation of space reduces frequency in the Fourier domain, this is why we have a cosine scaling in the operator.


<h4>The BRDF operator</h4>
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

where `B` describe the angular blur of the BRDF. It is defined using the inverse of the absolute value of the BRDF's Hessian in the tangent plane of the reflected ray. For a Phong BRDF with exponent `e` with a reflected ray in the pure mirror direction, the matrix is defined as:

     B = { 0, 0;
           0, 4*pi^2/e};


<h4>The curvature operator</h4>
So far we have expressed how to trace the covariance of local radiance when light is reflected by planar objects. To incorporate the local variation of the object's surface into covariance tracing, we will enable to project the local radiance from the tangent plane to a first order approximation of the surface using its curvature.

      function curvature(k) {
         op = { 1, k;
                0, 1};
         cov = op' * cov * op;
      }


<h4>The visibility operator</h4>
Since we are studying local radiance, we need to account for the fact that part light might be occluded or that part of the light will not interact with an object. We account for those two effects by reducing the local window used for our frequency analysis until there is no more *near-hit* or *near-miss* rays. Applying a window to a signal means that we will convolve its Fourier spectrum by the window Fourier spectrum. In terms of covariance, this boils down to summing the covariance matrices.

       TODO:
        + Add schematic

We usually assumes that occluders are planar. In such case, we can perform the windowing on the spatial component only. If an occluder has non negligible depth, then we can slice it along its depth and apply multiple times the occlusion operator.

      function occlusion(w) {
         occ = {w, 0;
                0, 0};
         cov = cov + occ;
      }

In the [next section][course-part2], we will see how to pratically use the knowledge of the Fourer spectrum extents.
<br />

<div style="width:100%;"><a style="float:left;" href="{{site.url | append: site.baseurl }}/siggraph-course.html">&larr; Intro</a><a style="float:right;" href="{{ site.url | append: site.baseurl }}/course//2016/08/25/siggraph-course-part2.html">Part 2 &rarr;</a></div><br />
  
[shannon1949]: https://en.wikipedia.org/wiki/Nyquist–Shannon_sampling_theorem
[kajiya1986]: http://dl.acm.org/citation.cfm?id=280987&CFID=609795496&CFTOKEN=98285306
[durand2005]: http://portal.acm.org/citation.cfm?id=1186822.1073320
[durand2011]: http://dspace.mit.edu/handle/1721.1/67677

[course-main]:  {{ site.url | append: site.baseurl }}/siggraph-2016-course.html
[course-part1]: {{ site.url | append: site.baseurl }}/course/2016/08/25/siggraph-course-part1.html
[course-part2]: {{ site.url | append: site.baseurl }}/course/2016/08/25/siggraph-course-part2.html
[wiki-fourier]: https://en.wikipedia.org/wiki/Fourier_transform

<script src="{{ site.url | append: site.baseurl }}/javascripts/draw_cov_brdf.js" type="text/javascript"></script>
<script id="raytracer2d-fs"  type="x-shader/x-fragment">{% include shaders/raytracer2d.fs %}</script>
<script id="raytracer2d-vs"  type="x-shader/x-vertex">{% include shaders/raytracer2d.vs %}</script>

