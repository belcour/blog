---
layout: post
title:  "A Low-Discrepancy Sampler that Distributes Monte Carlo Errors as a Blue Noise in Screen Space"
author: "Eric Heitz, Laurent Belcour, Victor Ostromoukhov, David Coeurjolly, and Jean-Claude Iehl"
journal: "ACM SIGGRAPH Talk 2019"
date:   2019-06-17
categories: research
published: true
---

<object style="width:100%;" data="{{ site.url | append: site.baseurl }}/data/svg/sampling_bluenoise.svg" type="image/svg+xml"></object>

<span>
<a href="https://hal.archives-ouvertes.fr/hal-02150657/document"><img src="{{ site.url | append: site.baseurl }}/data/images/icon_pdf.png" height="32px">paper</a> &nbsp;
<a href="https://hal.archives-ouvertes.fr/hal-02150657/file/samplerCPP.zip"><img src="{{ site.url | append: site.baseurl }}/data/images/icon_zip.png" height="32px"/>supp. code</a> &nbsp;
<a href="https://hal.archives-ouvertes.fr/hal-02150657/file/supplemental.zip"><img src="{{ site.url | append: site.baseurl }}/data/images/icon_zip.png" height="32px">supp. material</a> &nbsp;
<a href="{{ site.url | append: site.baseurl }}/supp/2019-sampling-bluenoise/index.html"><img src="{{ site.url | append: site.baseurl }}/data/images/icon_html.png" height="32px">supp. material</a> &nbsp;
<a href="https://hal.archives-ouvertes.fr/hal-02150657/bibtex"><img src="{{ site.url | append: site.baseurl }}/data/images/icon_latex.png" height="32px">bib</a> &nbsp;
<a href="https://hal.archives-ouvertes.fr/hal-02150657/file/samplerBlueNoiseErrors2019_video.mp4">
<img src="{{ site.url | append: site.baseurl }}/data/images/icon_video.png" height="32px">video</a> &nbsp;
<!-- <a href="https://belcour.github.io/blog/slides/2018-brdf-realtime-layered/slides.html"><img src="{{ site.url | append: site.baseurl }}/data/images/icon_slides.png" height="32px">slides</a> -->
</span><br />


<h4>Project Abstract</h4>

We introduce a sampler that generates per-pixel samples achieving high visual quality thanks to two key properties related to the Monte Carlo errors that it produces. First, the sequence of each pixel is an Owen-scrambled Sobol sequence that has state-of-the-art convergence properties. The Monte Carlo errors have thus low magnitudes. Second, these errors are distributed as a blue noise in screen space. This makes them visually even more acceptable. Our sam-pler is lightweight and fast. We implement it with a small texture and two xor operations. Our supplemental material provides comparisons against previous work for different scenes and sample counts. 