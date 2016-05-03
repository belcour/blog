---
layout: post
title:  "SIGGRAPH 2016 Course: Part 2"
date:   2016-08-25
categories: course
published: true
javascripts:
  - utils
---

<div style="width:100%;"><a style="float:left;" href="{{site.url | append: site.baseurl }}/course/2016/08/25/siggraph-course-part1.html">&larr; Part 1</a></div><br />

This course note is the second set of the [2016 SIGGRAPH course][course-main] on Frequency Analysis of Light Transport. If you haven't check the [previous part][course-part1], I recommand you do so.

### Representations of the Fourier Spectrum

Most of the application we will review here rely on different representation of the spectrum. Since it is not possible to compute it exactly, we always rely on approximation. The covariance is one of many representation that we can use.

     + Wedge spectrum
     + Axis aligned spectrum
     + Gaussian spectrum
     + Sampled spectrum

### List of Applications

     + Adaptive Sampling
     + Denoising
     + Up-sampling
     + Antialiasing
     + Deconvolution

### Adaptive Sampling & Reconstruction

 + Looking at the work of [Durand et al. 2005][durand2005]
 + Looking at the work of [Soler et al. 2009][soler2009]
 + Looking at the work of [Egan et al. 2009][egan2009]
 + Looking at the work of [Belcour et al. 2013][belcour2013]
 + Looking at the work of [Lethinen et al. 2013][lethinen2013]

### Density Estimation

 + Looking at the work of [Belcour et al. 2011][belcour2011]
 + Looking at the work of [Belcour et al. 2014][belcour2014]

### Up-Sampling

 + Looking at the work of [Bagher et al. 2011][bagher2011]

### Antialiasing

 + Looking at the work of [Krivanek and Colbert][krivanek2008]
 + Looking at the work of [Belcour et al. 2016][belcour2016]

### Deconvolution

 + Looking at the work of [Zubiaga et al. 2015][zubiaga2015]

[course-main]:  {{ site.url | append: site.baseurl }}/siggraph-2016-course.html
[course-part1]: {{ site.url | append: site.baseurl }}/course/2016/08/25/siggraph-course-part1.html
[course-part2]: {{ site.url | append: site.baseurl }}/course/2016/08/25/siggraph-course-part2.html

[durand2005]:   http://hal.inria.fr/todo
[soler2009]:    http://hal.inria.fr/todo
[egan2009]:     http://hal.inria.fr/todo
[krivanek2008]: http://todo.com/
[belcour2011]:  http://hal.inria.fr/todo
[bagher2011]:   http://hal.inria.fr/todo
[belcour2013]:  http://hal.inria.fr/todo
[lethinen2013]: http://hal.inria.fr/todo
[belcour2014]:  http://hal.inria.fr/todo
[zubiaga2015]:  http://hal.inria.fr/todo
[belcour2016]:  http://hal.inria.fr/todo