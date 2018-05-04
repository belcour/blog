---
layout: post
title:  "Efficient Rendering of Layered Materials using an Atomic Decomposition with Statistical Operators"
author: "Laurent Belcour"
journal: "ACM Transactions on Graphics (proc. of SIGGRAPH 2018)"
date:   2018-05-05
categories: research
published: true
---

<img src="{{ site.url | append: site.baseurl }}/data/svg/layered_teaser.svg" />

<span>
<a href="https://hal.inria.fr/hal-01785457/document"><img src="{{ site.url | append: site.baseurl }}/data/images/icon_pdf.png" height="32px">paper</a> &nbsp;
<a href="https://hal.inria.fr/hal-01785457/file/supp.pdf"><img src="{{ site.url | append: site.baseurl }}/data/images/icon_pdf.png" height="32px"/>supp. pdf</a> &nbsp;
<a href="https://hal.inria.fr/hal-01785457/file/suppl.zip">
<img src="{{ site.url | append: site.baseurl }}/data/images/icon_zip.png" height="32px">supp. code</a> &nbsp;
<a href="https://hal.inria.fr/hal-01785457/bibtex"><img src="{{ site.url | append: site.baseurl }}/data/images/icon_latex.png" height="32px">bib</a> &nbsp;
<a href="https://youtu.be/wM5E-NJtaug">
<img src="{{ site.url | append: site.baseurl }}/data/images/icon_video.png" height="32px">video</a> &nbsp;
<!-- <a href="https://belcour.github.io/blog/slides/2017-brdf-thin-film/slides.html"><img src="{{ site.url | append: site.baseurl }}/data/images/icon_slides.png" height="32px">slides</a> -->
</span><br />


<h4>Project Abstract</h4>

We derive a novel framework for the efficient analysis and computation of light transport within layered materials. Our derivation consists in two steps. First, we decompose light transport into a set of atomic operators that act on its directional statistics. Specifically, our operators consist of reflection, refraction, scattering, and absorption, whose combinations are sufficient to describe the statistics of light scattering multiple times within layered structures. We show that the first three directional moments (energy, mean and variance) already provide an accurate summary. Second, we extend the adding-doubling method to support arbitrary combinations of such operators efficiently. During shading, we map the directional moments to BSDF lobes. We validate that the resulting BSDF closely matches the ground truth in a lightweight and efficient form. Unlike previous methods we support an arbitraty number of textured layers, and demonstrate a practical and accurate rendering of layered materials with both an offline and real-time implementation that are free from per-material precomputation.