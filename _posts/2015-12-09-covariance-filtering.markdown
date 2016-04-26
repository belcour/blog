---
layout: post
title:  "Antialasing Appearance in Global Illumination Renderers"
author: "Laurent Belcour, Ling-Qi Yan, Ravi Ramamoorthi, and Derek Nowrouzezahrai"
journal: "University of Montréal Technical Report #1375"
date:   2015-12-09
categories: research
published: true
---

<span>&nbsp;
<a href="https://hal.inria.fr/hal-01200710/document"><img src="{{ site.url | append: site.baseurl }}/data/images/icon_pdf.png" height="32px">paper</a> &nbsp;
<a href="https://hal.inria.fr/hal-01200710/bibtex"><img src="{{ site.url | append: site.baseurl }}/data/images/icon_latex.png" height="32px">bib</a> &nbsp;
<a href="https://www.youtube.com/watch?v=lgldxBcuIj0">
<img src="{{ site.url | append: site.baseurl }}/data/images/icon_video.png" height="32px"> video</a>
</span>
 
<h4>Project Abstract</h4>
In Physically Based Rendering (PBR) detailed objects can show aliasing once rendered. Such aliasing can be avoided using super sampling, but this increases dramatically the rendering cost. Instead, it is preferable to antialias the appearance of objects. Bandlimiting appearance requires two elements: an appearance model compatible with bandlimiting (such as <a hef="http://www.csee.umbc.edu/~olano/papers/lean/">LEAN mapping</a>, <a href="https://hal.inria.fr/hal-00858220/en">LEADR mapping</a>, etc), and the ability to determine the appearance bandlimit before the evaluation of this appearance model.

We provide the first theoretical analysis of how to perform antialiasing in modern path tracing engines (hence supporting Bidirectional Path Tracing) and we provide a practical solution to determine the appearance bandlimit. While antialiased surface appearance models are now widely used in production, not much work has been done on the antialiasing kernel since the unidirectional works of <a href="https://graphics.stanford.edu/papers/trd/">Igehy [1999]</a> and <a hef="http://graphics.cs.kuleuven.be/publications/PATHDIFF/">Suykens and Willems [2001]</a>. Our work is also motivated by the increased adoption of bidirectional path tracers in production renderers (Weta’s Manuka, Pixar’s PRman). The core of our theoretical contribution is to show derive filtering footprints accounting for both eye path and light path’s frequency content. Practically, we use <a href="https://hal.inria.fr/hal-00814164">covariance tracing</a> to efficiently track down an approximation of the filtering footprint. Furthermore, we show that <strong>covariance tracing can replace ray differentials</strong> as it removes its limitations (specular interaction) while maintaining backward compatibility (to easy integration). We believe that <strong>our method should <em>in fine</em> replace completely ray differentials</strong> (removing an unnecessary conversion cost).

<h4>Video</h4>
<center>
<iframe width="560" height="315" src="https://www.youtube.com/embed/_Sh8xcspWG8" frameborder="0" allowfullscreen></iframe>
</center>

<!--
<h4>Slides</h4>
<center>
<iframe src="{{ site.url | append: site.baseurl }}/slides/pres.html" width="560px" height="315px">
</iframe>
</center>
-->
