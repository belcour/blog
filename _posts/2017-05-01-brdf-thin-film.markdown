---
layout: publication
date: 2017-05-01
title: "A Practical Extension to Microfacet Theory for the Modeling of Varying Iridescence"
authors: [
   { name: "Laurent Belcour" },
   { name: "Pascal Barla", "affiliation": "Inria" },
]
journal: "ACM Transactions on Graphics (proc. of SIGGRAPH 2017)"
categories: [
    "research",
    "publication"
]
tags: [
    "published",
    "Appearance Modeling and Rendering",
]
thumbnail: "/data/images/thumbnail_Irid.png"
materials: [
   { type: "pdf", name: "paper", url: "https://hal.inria.fr/hal-01518344/document"},
   { type: "latex", name: "bib", url: "https://hal.inria.fr/hal-01518344/bibtex"},
   { type: "pdf", name: "supp. pdf", url: "https://hal.inria.fr/hal-01518344v2/file/supp-mat-small%20%281%29.pdf" },
   { type: "zip", name: "code", url: "https://hal.inria.fr/hal-01518344v2/file/supplemental-code%20%282%29.zip" },
   { type: "video", name: "video", url: "https://youtu.be/4nKb9hRYbPA" },
   { type: "slides", name: "slides", url: "https://belcour.github.io/blog/slides/2017-brdf-thin-film/slides.html" },
]
---

<img src="{{ site.url | append: site.baseurl }}/data/images/brdf-thin-film-header.png" />
<div style="position:relative;width:100%;">
    <span style="position:absolute;z-index:1;margin:0px;top:-34pt;left:1.5%;">Classical microfacets</span>
    <span style="position:absolute;z-index:1;margin:0px;top:-34pt;left:38.5%;">Iridescent microfacets</span>
    <span style="position:absolute;z-index:1;margin:0px;top:-34pt;left:75.5%;">Goniochromatic effects</span>
</div>

<strong>Project Abstract</strong>

Thin film iridescence permits to reproduce the appearance of leather. However, this theory requires spectral rendering engines (such as Maxwell Render) to correctly integrate the change of appearance with respect to viewpoint (known as goniochromatism). This is due to aliasing in the spectral domain as real-time renderers only work with three components (RGB) for the entire range of visible light. In this work, we show how to anti-alias a thin-film model, how to incorporate it in microfacet theory, and how to integrate it in a real-time rendering engine. This widens the range of reproducible appearances with microfacet models.

<strong>Implementations</strong>

This work is used in Unity's <a href="https://blogs.unity3d.com/2018/03/16/the-high-definition-render-pipeline-focused-on-visual-quality/">HD rendering pipeline</a>. Also, this work was implemented by users of <a href="https://github.com/cCharkes/Iridescence">Unity</a>, <a href="http://polycount.com/discussion/comment/2604578/#Comment_2604578">Unreal</a>, and <a href="https://blenderartists.org/forum/showthread.php?433309-Micro-angle-dependent-Roughness-amp-Iridescence/page14">Blender</a>.
