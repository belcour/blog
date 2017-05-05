---
layout: post
title:  "A Practical Extension to Microfacet Theory for the Modeling of Varying Iridescence"
author: "Laurent Belcour, Pascal Barla"
journal: "ACM Transactions on Graphics (proc. of SIGGRAPH 2017)"
date:   2017-05-01
categories: research
published: true
---

<img src="{{ site.url | append: site.baseurl }}/data/images/brdf-thin-film-header.png" />
<div style="position:relative;width:100%;">
    <span style="position:absolute;z-index:1;margin:0px;top:-34pt;left:1.5%;">Classical microfacets</span>
    <span style="position:absolute;z-index:1;margin:0px;top:-34pt;left:38.5%;">Iridescent microfacets</span>
    <span style="position:absolute;z-index:1;margin:0px;top:-34pt;left:75.5%;">Goniochromatic effects</span>
</div>
 
<span>&nbsp;
<a href="https://hal.inria.fr/hal-01200710/document"><img src="{{ site.url | append: site.baseurl }}/data/images/icon_pdf.png" height="32px">paper</a> &nbsp;
<a href="https://hal.inria.fr/hal-01200710/bibtex"><img src="{{ site.url | append: site.baseurl }}/data/images/icon_latex.png" height="32px">bib</a> &nbsp;
<a href="https://youtu.be/4nKb9hRYbPA">
<img src="{{ site.url | append: site.baseurl }}/data/images/icon_video.png" height="32px">video</a> &nbsp;
<a href="https://hal.archives-ouvertes.fr/hal-01518344/file/supplemental-code.zip">
<img src="{{ site.url | append: site.baseurl }}/data/images/icon_zip.png" height="32px">code</a>
</span><br />


<h4>Project Abstract</h4>

Microfacet theory is the principal model for reflectances in Computer Graphics and real-time rendering. However, this theory alone cannot simulate the full range of natural reflectance. For example (show in the figure above), greasy films on top of leather produce a very specific look that change with respect to the viewpoint (known as goniochromatism). Thin film iridescence theory can model such appearances but require spectral rendering engines (such as Maxwell Render) to correctly integrate goniochromatism. This is caused by aliasing in the spectral domain as real-time renderers only work with three components (RGB). In this work, we show how to anti-alias a thin-film model, how to incorporate it in microfacet theory, and how to integrate it in a real-time rendering engine. This widen the range of reproducible appearances with microfacet models.