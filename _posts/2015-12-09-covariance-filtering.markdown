---
layout: post
title:  "Antialiasing in Path-space"
date:   2015-12-09
categories: research
published: true
---
Laurent Belcour, Ling-Qi Yan, Ravi Ramamoorthi, and Derek Nowrouzezahrai<br />
University of Montréal Technical Report #1375  <a href="https://hal.inria.fr/hal-01200710v1/document">paper</a> <a href="https://hal.inria.fr/hal-01200710v1/bibtex">bib</a> <a href="https://www.youtube.com/watch?v=lgldxBcuIj0">video</a>

<!--
#### Introduction
-->

In Physically Based Rendering (PBR) detailed objects can show aliasing once rendered. Such aliasing can be avoided using super sampling, but this increase dramatically the rendering cost. Instead, it is preferable to antialias the appearance of objects. Bandlimiting appearance requires two elements: an appearance model compatible with bandlimiting (such as <a hef="http://www.csee.umbc.edu/~olano/papers/lean/">LEAN mapping</a>, <a href="https://hal.inria.fr/hal-00858220/en">LEADR mapping</a>, etc), and the ability to determine the appearance bandlimit before the evaluation of this appearance model.

We provide the first theoretical analysis of how to perform antialiasing in modern path tracing engines (hence supporting Bidirectional Path Tracing) and we provide a practical solution to determine the appearance bandlimit. While antialiased surface appearance models are now widely used in production, not much work has been done on the antialiasing kernel since the unidirectional works of <a href="https://graphics.stanford.edu/papers/trd/">Igehy [1999]</a> and <a hef="http://graphics.cs.kuleuven.be/publications/PATHDIFF/">Suykens and Willems [2001]</a>. Our work is also motivated by the increased adoption of bidirectional path tracers in production renderers (Weta’s Manuka, Pixar’s PRman). The core of our theoretical contribution is to show derive filtering footprints accounting for both eye path and light path’s frequency content. Practically, we use <a href="https://hal.inria.fr/hal-00814164">covariance tracing</a> to efficiently track down an approximation of the filtering footprint. Furthermore, we show that <strong>covariance tracing can replace ray differentials</strong> as it removes its limitations (specular interaction) while maintaining backward compatibility (to easy integration). We believe that <strong>our method should <em>in fine</em> replace completely ray differentials</strong> (removing an unnecessary conversion cost).

Here is an overview of our method:
<center>
<iframe width="560" height="315" src="https://www.youtube.com/embed/_Sh8xcspWG8" frameborder="0" allowfullscreen></iframe>
</center>

<!--
#### Bandlimiting appearance

The appearance of object is usualy determined by a reflectance model. The simplest one being the Lambertian model (light is scattered uniformly in all directions). However, the reflectance model can have vary spatially when using texture for examples. This spatial variation of the material can produce aliasing (the signal varies too much inside a given pixel and one sample is not enough to represent its final value). Other materials can produce aliasing (such as glints) when viewed in the distance.

When an input signal can produce aliasing, it is necessary to bandlimit it before sampling. Bandlimiting is a technique from the signal processing litterature. Given a sampling rate (a sample every *x* units of measure - a pixel every *x* steraradian in our context), then signal processing predicts that the input signal should not have variations above a given threshold: *the sampling's bandwidth*.


#### Bandlimiting using the pixel footprint

In order to bandlimit the appearance of directly visible objects, a simple solution is to track the pixel geometry (or an approximation) throught the scene. This is done using **ray differentials**, a method estimating a first order approximation of the pixel geometry on surfaces.


#### Bandlimiting and Global Illumination

Unfortunately, the ray differential method is not generic enough to work with **Global Illumination** (GI) which simulates multiple bounces of light on surfaces. Ray differential simplify the material model to purely specular until the shaded surface. When dealing with GI, shaded surfaces can be evaluated after any kind of light/matter interaction, be it diffuse or specular. Once a non specular interaction is reached, ray differentials are undefined and correct bandlimiting of the appearance model is not possible with this technique. This is unfortunate as most of the appearance we deal in real life (and in CG) are not specular, but closer to diffuse.


#### Bandlimiting using Covariance Tracing

In order to perform bandlimiting for any light interaction along a light path, we track down the bandlimit of the pixel (determined by the sampling rate and reconstruction filter) along the path. Since bandwidths are defined in the Fourier domain, we can use **Covariance Tracing**, a method tracking an approximate bandwidth in the tangent plane of the ray.


#### R.F.A.Q. (Reviewers Frequently Ask those Questions)

**Can't ray differentials be used instead of covariance tracing?** No, not for non-specular indirect effects.

**Can't ray differentials be extended?** Sure, but it will sucks at it. Some people use the diffuse ray differential heuristics in contexts different from antialiasing appearance (in Progressive Photon Beams for example). Diffuse ray differential project the spatial componnent of the differential on further surfaces. This wouldn't work well for indirect bounces (see Figure).
-->
