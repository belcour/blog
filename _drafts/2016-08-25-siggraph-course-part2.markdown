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



### Adaptive Sampling & Reconstruction

Adaptive sampling & reconstruction use the Nyquist-Shannong sampling theorem to predict from the Fourier analysis a required sampling rate per pixel and an associated pixel filter (for example in Durand et al. [[2005][durand2005]], Soler et al. [[2009][soler2009]]). In some other cases, we adapt the required sampling rate for integration (to integrate motion for example, see Egan et al. [[2009][egan2009]] or Belcour et al. [[2013][belcour2013]]).

<center>
<div style="position:relative;width:100%">
<object width="100%" data="{{ site.url | append: site.baseurl }}/data/svg/course-applications01.svg" type="image/svg+xml"></object>
</div>
</center>


### Up-Sampling

Up-sampling is a particular case of adaptive sampling and reconstruction where shading samples are not evaluated at the same time, but in a hierarchical way (see Bagher et al. [[2011][bagher2011]]). The idea is to render an image using a *mipmap*, starting for the coarse scale to the finer scale and only computing pixels when the frequency content in it corresponds to the frequency content.

<center>
<div style="position:relative;width:100%">
<object width="100%" data="{{ site.url | append: site.baseurl }}/data/svg/course-applications02.svg" type="image/svg+xml"></object>
</div><br />
<div style="width:90%"><em>In up-sampling methods, the bandwidth of the Fourier spectrum is used to predict at what mipmap level a group pixel should be shaded. This strategy ensures that when merging the different levels, not pixel got unshaded. Image courtesy of Bagher et al. [2011]</em></div>
</center><br />

This technique corresponds to splating pixel samples on the screen relative their frequency content. Using a pixel hierarchy ensures that no pixel will be left unshaded.

Lethinen et al. [[2012][lethinen2012]] applied splatting to reconstruct defocus and motion blur from a small set of samples in screen space. In terms of frequency analysis, this work assumes that the samples are emitted by diffuse surfaces and reproject them along the sheared line defined by motion and lens. Here, instead of splatting on a pixel quad, samples are splatted along planes in the combined domain of image space, time and lens (called *XYUVT*).

### Density Estimation

Density estimation is a reconstruction method notoriously used in [Photon Mapping][jensen1995] and [Progressive Photon Mapping][hachisuka2009] to estimate approximately a density from a discrete set of samples. Traditionnaly, density estimation is done using a nearest neighbor search. Starting from a query point, all samples falling into a disk of radius $$r$$ around the query point are used to estimate the reflected radiance.

    TODO: Add schema

<!--
$$E[S_N \star k] = f \star k$$
-->

Using Frequency Analysis, the radius using to gather samples can be adapted depending on the frequency content of samples aggregated. The optimal radius, for a threshold error $$\epsilon$$, is defined by:

$$r_{\mbox{opt}} = \sqrt{ \frac{2 \epsilon}{\alpha \nabla^2(L)} },$$

where $$\alpha$$ is a characteristic of the density estimation kernel and the Hessian of the radiance can be retreived from the Fourier transform.

This idea of adapting reconstruction kernels has been applied by Belcour et al. for surface based density [[2011][belcour2011]] and volumetric density estimation [[2014][belcour2014]]. Similarly, Kaplanyan and Dachsbacher [[2013][kaplanyan2013]] also used the Hessian of the radiance to adapt the gathering radius. However, they used a fixed kernel density estimation to approximate the Hessian in the first place.

[jensen1995]: http://photonmapping.org
[hachisuka2009]: http://todo.fr

### Antialiasing

In some case, when we are rendering high frequency elements such as texture or envmaps and we have to average to get the resulting appearance, it is possible to use an antialiasing (or prefiltering) model to avoid super sampling. This problem has a vast history in graphics.

    Add schema

 + Looking at the work of [Heckbert 1986][heckbert1986]
 + Looking at the work of [Krivanek and Colbert][krivanek2008]
 + Looking at the work of [Belcour et al. 2016][belcour2016]

### Deconvolution

 + Looking at the work of [Zubiaga et al. 2015][zubiaga2015]

[course-main]:  {{ site.url | append: site.baseurl }}/siggraph-2016-course.html
[course-part1]: {{ site.url | append: site.baseurl }}/course/2016/08/25/siggraph-course-part1.html
[course-part2]: {{ site.url | append: site.baseurl }}/course/2016/08/25/siggraph-course-part2.html

[heckbert1986]: http://tood.fr
[durand2005]:   http://hal.inria.fr/todo
[soler2009]:    http://hal.inria.fr/todo
[egan2009]:     http://www.cs.columbia.edu/cg/mb/
[egan2011a]:    http://graphics.berkeley.edu/papers/Egan-PFF-2011-12/index.html
[egan2011b]:    http://graphics.berkeley.edu/papers/Egan-FAS-2011-04/index.html
[krivanek2008]: http://todo.com/
[belcour2011]:  http://hal.inria.fr/todo
[bagher2011]:   http://hal.inria.fr/todo
[lethinen2012]: http://hal.inria.fr/todo
[mehta2012]:    http://graphics.berkeley.edu/papers/UdayMehta-AAF-2012-12/index.html
[belcour2013]:  http://hal.inria.fr/todo
[kaplanyan2013]:http://cg.ivd.kit.edu/english/APPM.php
[metha2013]:    http://graphics.berkeley.edu/papers/Udaymehta-IPB-2013-07/index.html
[metha2014]:    http://dl.acm.org/citation.cfm?id=2601113&CFID=610675972&CFTOKEN=79354783
[belcour2014]:  http://hal.inria.fr/todo
[yan2015]:      http://dl.acm.org/citation.cfm?id=2816814&CFID=610675972&CFTOKEN=79354783
[zubiaga2015]:  http://hal.inria.fr/todo
[belcour2016]:  http://hal.inria.fr/todo