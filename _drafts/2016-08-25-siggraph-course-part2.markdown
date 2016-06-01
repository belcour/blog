---
layout: post
title:  "SIGGRAPH 2016 Course: Part 2"
date:   2016-08-25
categories: course
published: true
javascripts:
  - utils
  - snap.svg
---

<div style="width:100%;"><a style="float:left;" href="{{site.url | append: site.baseurl }}/course/2016/08/25/siggraph-course-part1.html">&larr; Part 1</a></div><br />

This course note is the second set of the [2016 SIGGRAPH course][course-main] on Frequency Analysis of Light Transport. If you haven't check the [previous part][course-part1], I recommand you do so.

### Representations of the Fourier Spectrum

Most of the application we will review here rely on different representation of the spectrum. Since it is not possible to compute it exactly, we always rely on approximation. The covariance is one of many representation that we can use.

<center>
<object type="image/svg+xml" data="{{ site.url | append: site.baseurl }}/data/svg/course-representation01.svg" width="100%" id="course-representation01"></object><br />
</center><br />

For example it is possible to extract the **axis aligned bounding box** of the spectrum $$[B_x, B_u]$$ as done by Metha et al. [[2012][mehta2012],[2013][metha2013],[2014][metha2014]] and Yan et al. [[2015][yan2015]]. Note that this correspond to the bandwidth of the spectrum. It is possible to be less conservative when the spectrum has an infinite bandwidth but not much energy in the tail of the distribution using a percentile of the spectrum as done by Bagher et al. [[2011][bagher2011]].

Another interesting representation arise when we want to study a spectrum that summarize many of the same shear operator (see Egan et al. [[2009][egan2009],[2011][egan2011a],[2011][egan2011b]). For example blockers at different distance from us. The Fourier transform is then enclosed in a **wedge shape** defined by the min and max distance to the blockers.

Lastly, we can represent the spectrum using second order statistics such as the **covariance matrix** or its inverse known as the information matrix [[Belcour et al. 2013][belcour2013]].

I all those case, two methods are possible to determine the spectrum during rendering: either we can use a **closed form** method, or a **tracing** method. We will use a closed form method when the transport operators are known before hand (to study the last bounce with a BRDF assuming a directional light source for example). There, we determine the resulting spectrum by concatenating the operator and expressing them as a single expression. On the other hand, we will use the tracing method when the transport operators sequence is unknown (such as multiple bounces). There, we update the representation using the atomic operators as we perform rendering.


**Sheared filters -** It is to note that the wedge form produces the same filters as the covariance representation. Indeed, the resulting filter is the product of Gaussians along the various dimensions. But those Gaussian are correlated and can be expressed as a single Gaussian that would be resulting from the covariance analysis (see below).

Mathematically, the filter $$ h(\delta x, \delta y) $$ is expressed as [[Yan et al. 2015][yan2015]]:

$$
   h(x, y) = e^{- k_x (x - x_0)^2} e^{- k_y (y - y_0(x, x_0))^2},
$$

where $$y_0 = \eta (x - x_0)$$ is the sheared center of the second Gaussian. By expressing the product of those Gaussian, we can regroup the terms and express the filter using the following form:

$$
   h(x, y) = e^{- [x - x_0, y] \, \Sigma^{-1} \, [x - x_0, y]^T}, \; \mbox{where} \; \Sigma^{-1} = \left[\begin{array}{cc} k_x + k_y & \eta k_y \\ \eta k_y & k_y \end{array}\right].
$$

This form is a Gaussian that can be extracted using the covariance formulation. All the optimization procedure described by Yan et al. [[2015][yan2015]] to improve the efficiency of reconstruction can thus be applied to most of the anisotropic methods (Gaussian, Covariance).


### Adaptive Sampling & Reconstruction

Adaptive sampling & reconstruction use the Nyquist-Shannong sampling theorem to predict from the Fourier analysis a required sampling rate per pixel and an associated pixel filter (for example in Durand et al. [[2005][durand2005]], Soler et al. [[2009][soler2009]]). In some other cases, we adapt the required sampling rate for integration (to integrate motion for example, see Egan et al. [[2009][egan2009]] or Belcour et al. [[2013][belcour2013]]).

<center>
<div style="position:relative;width:100%">
<object width="100%" data="{{ site.url | append: site.baseurl }}/data/svg/course-applications01.svg" type="image/svg+xml"></object>
</div>
</center>

The sampling rate in image space is directly extracted from the bandwidth of the Fourier spectrum using the Nyquist rate: $$N = \frac{1}{2 B_i}$$.

**Note:** $$B_i$$ is the bandwidth in pixel space. To get it, we use the spatio-angular bandwidth $$[B_x, B_u]$$ and depending on the sensor type, we scale either the angular of the spatial component to convert frequency measured in $$m^{-1}$$ to $$\mbox{pixel}^{-1}$$. For the case of the pinehole camera, the convertion formula is:

$$ B_i = \frac{\tan(f_H)}{H} B_u, $$

where $$f_H$$ is the angular field of view in either width or height and $$H$$ is either the screen width of height in pixels.


**Image space vs XYUVT space reconstruction** - There exist two kind of reconstruction methods in the litterature: the one that perform a pixel filter on pixels (or the projected samples positions) [[Durand et al. 2005][durand2005], [Belcour et al. 2013][belcour2013]]; or the one that perform the reconstruction from the more global space of integration (we refer as *XYUVT* -for image, lens and time- here though it can cover some other integration domains) [[Egan et al. 2009][egan2009], [Egan et al. 2011][egan2011a], and others]. Because the later work on a high dimensional domain, the reconstruction cost has to be accounted. It can be reduced using the method of Yan et al. [[2015][yan2015]] that decompose the reconstruction into a set of 1D convolutions.

### Up-Sampling

Up-sampling is a particular case of adaptive sampling and reconstruction where shading samples are not evaluated at the same time, but in a hierarchical way (see Bagher et al. [[2011][bagher2011]]). The idea is to render an image using a *mipmap*, starting for the coarse scale to the finer scale and only computing pixels when the frequency content in it corresponds to the frequency content.

<center>
<div style="position:relative;width:100%">
<object width="100%" data="{{ site.url | append: site.baseurl }}/data/svg/course-applications02.svg" type="image/svg+xml"></object>
</div><br />
<div style="width:90%"><em>In up-sampling methods, the bandwidth of the Fourier spectrum is used to predict at what mipmap level a group pixel should be shaded. This strategy ensures that when merging the different levels, not pixel got unshaded. Image courtesy of Bagher et al. [2011]</em></div>
</center><br />

This technique corresponds to splating pixel samples on the screen relative their frequency content. Using a pixel hierarchy ensures that no pixel will be left unshaded.

Lehtinen et al. [[2011][lehtinen2011]] applied splatting to reconstruct defocus and motion blur from a small set of samples in screen space. In terms of frequency analysis, this work assumes that the samples are emitted by diffuse surfaces and reproject them along the sheared line defined by motion and lens. Here, instead of splatting on a pixel quad, samples are splatted along planes in the combined domain of image space, time and lens (called *XYUVT*).

### Density Estimation

Density estimation is a reconstruction method notoriously used in [Photon Mapping][jensen1995] and [Progressive Photon Mapping][hachisuka2009] to estimate approximately a density from a discrete set of samples. Traditionnaly, density estimation is done using a nearest neighbor search. Starting from a query point, all samples falling into a disk of radius $$r$$ around the query point are used to estimate the reflected radiance.

<center>
<div style="position:relative;width:100%">
<object width="100%" data="{{ site.url | append: site.baseurl }}/data/svg/course-applications03.svg" type="image/svg+xml"></object>
</div><br />
<div style="width:90%"><em>Adaptive density estimation use a different radius for each query point (black cross) to gather photons and avoid overblurring of some features. For example, the caustic generated by the glass sphere here would be overblurred by non-adaptive density estimation.</em></div>
</center><br />
<!--
$$E[S_N \star k] = f \star k$$
-->

Using Frequency Analysis, the radius using to gather samples can be adapted depending on the frequency content of samples aggregated. The optimal radius, for a threshold error $$\epsilon$$, is defined by:

$$r_{\mbox{opt}} = \sqrt{ \frac{2 \epsilon}{\alpha \nabla^2(L)} },$$

where $$\alpha$$ is a characteristic of the density estimation kernel and the Hessian of the radiance can be retreived from the Fourier transform.

This idea of adapting reconstruction kernels has been applied by Belcour et al. for surface based density [[2011][belcour2011]] and volumetric density estimation [[2014][belcour2014]]. Similarly, Kaplanyan and Dachsbacher [[2013][kaplanyan2013]] also used the Hessian of the radiance to adapt the gathering radius. However, they used a fixed kernel density estimation to approximate the Hessian in the first place.

[jensen1995]:    http://graphics.ucsd.edu/%7Ehenrik/papers/book/
[hachisuka2009]: http://www.ci.i.u-tokyo.ac.jp/~hachisuka/ppm.pdf

### Antialiasing

In some case, when we are rendering high frequency elements such as texture or envmaps and we have to average to get the resulting appearance, it is possible to use an antialiasing (or prefiltering) model to avoid super sampling. This problem has a vast history in graphics. For example, Greene and Heckbert [[1986][greene1986]] introduced elliptical filter to account for the pixel's projection in texture space.

An antialiasing reflectance model works as follow: given a kernel defined over a surface footprint (here $$ \mathcal{F} $$) we need to evaluate or approximate the integral of a spatially varying BSDF model over the spatially varying geometry (for example using a normal-map or a height-map). To do so, an antialiased BRDF model has an extra variable: the surface footprint.

<center>
<div style="position:relative;width:100%">
<object width="80%" data="{{ site.url | append: site.baseurl }}/data/svg/course-applications04.svg" type="image/svg+xml"></object>
</div>
<div style="width:90%"><em>Antialiased surface appearance approximate the integrated surface appearance of a high frequency surface. In this example case, a scratch normal map is averaged in the footprint \(\mathcal{F}\) to approximate the BRDF and avoid using supersampling to integrate it.</em></div>
</center><br />

In terms of Fourier analysis, evaluating the antialiased BRDF is equivalent to do a low-pass filter to the finest scale BRDF. Concretly, in the Fourier domain, we are removing high frequency part of the finest scale BRDF. The limit at which frequency are cut off is given by the kernel. It is said that **the kernel bandlimits the frequency content** of the BRDF.

It is possible to bandlimit other signals than the BRDF. For example, Krivanek and Colbert [[2008][krivanek2008]] showed that it was possible to bandlimit the envmap signal when doing importance sampling. They showed that the size of the kernel was directly linked to the importance function.

<!--
### Deconvolution

 + Looking at the work of [Zubiaga et al. 2015][zubiaga2015]
-->

[course-main]:  {{ site.url | append: site.baseurl }}/siggraph-2016-course.html
[course-part1]: {{ site.url | append: site.baseurl }}/course/2016/08/25/siggraph-course-part1.html
[course-part2]: {{ site.url | append: site.baseurl }}/course/2016/08/25/siggraph-course-part2.html

[greene1986]:   https://www.cs.cmu.edu/~ph/omni.ps.gz
[durand2005]:   http://people.csail.mit.edu/fredo/PUBLI/Fourier/
[soler2009]:    https://hal.inria.fr/inria-00345902
[egan2009]:     http://www.cs.columbia.edu/cg/mb/
[egan2011a]:    http://graphics.berkeley.edu/papers/Egan-PFF-2011-12/index.html
[egan2011b]:    http://graphics.berkeley.edu/papers/Egan-FAS-2011-04/index.html
[krivanek2008]: http://cgg.mff.cuni.cz/~jaroslav/papers/2008-egsr-fis/2008-egsr-fis-final-embedded.pdf
[belcour2011]:  https://hal.inria.fr/inria-00633940
[bagher2011]:   https://hal.inria.fr/hal-00652066
[lehtinen2011]: http://groups.csail.mit.edu/graphics/tlfr/
[mehta2012]:    http://graphics.berkeley.edu/papers/UdayMehta-AAF-2012-12/index.html
[belcour2013]:  https://hal.inria.fr/hal-00814164
[kaplanyan2013]:http://cg.ivd.kit.edu/english/APPM.php
[metha2013]:    http://graphics.berkeley.edu/papers/Udaymehta-IPB-2013-07/index.html
[metha2014]:    http://dl.acm.org/citation.cfm?id=2601113&CFID=610675972&CFTOKEN=79354783
[belcour2014]:  https://hal.inria.fr/hal-00957242
[yan2015]:      http://dl.acm.org/citation.cfm?id=2816814&CFID=610675972&CFTOKEN=79354783
[zubiaga2015]:  https://hal.inria.fr/hal-01164590
[belcour2016]:  https://hal.inria.fr/hal-01200710