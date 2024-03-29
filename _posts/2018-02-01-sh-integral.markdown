---
layout: publication
date: 2018-02-01
title: "Integrating Clipped Spherical Harmonics Expansions"
authors: [
   { name: "Laurent Belcour" },
   { name: "Guofu Xie", "affiliation": "UdeM" },
   { name: "Christophe Hery", "affiliation": "Pixar" },
   { name: "Mark Meyer", "affiliation": "Pixar" },
   { name: "Wojciech Jarosz", "affiliation": "Dartmouth College" },
   { name: "Derek Nowrouzezahrai", "affiliation": "UdeM" },
]
journal: "ACM Transactions on Graphics"
categories: [
    "research",
    "publication"
]
tags: [
    "published",
    "Appearance Modeling and Rendering",
]
thumbnail: "/data/images/thumbnail_SHInt.png"
materials: [
   { type: "pdf", name: "paper", url: "https://hal.inria.fr/hal-01695284/document"},
   { type: "latex", name: "bib", url: "https://hal.inria.fr/hal-01695284/bibtex"},
   { type: "zip", name: "code", url: "https://github.com/belcour/IntegralSH/" },
   { type: "slides", name: "slides", url: "https://belcour.github.io/blog/slides/2018-integration-sh/slides.html" },
]
---
<!-- <center><img src="{{ site.url | append: site.baseurl }}/data/images/shint/teaser.svg" /></center><br /> -->

<strong>Project Summary</strong>
Many applications in rendering rely on integrating functions over spherical polygons. We present a new numerical solution for computing the integral of spherical harmonics (SH) expansions clipped to polygonal domains. For example the appearance of a surface lit by a polygonal light source is defined as the integral of an hemispherical function, the Bidirectional Reflectance Distribution Function (BRDF), over the projected footprint of the light. Mathematically, we need to compute the integral of this hemispherical function in footprint of the polygon projected on the hemisphere.
<center><div style="font-size: 90%;">
    <table style="width:50%;">
        <tr>
            <td><img src="{{ site.url | append: site.baseurl }}/data/images/shint/brdf.gif" /></td>
            <td><img src="{{ site.url | append: site.baseurl }}/data/images/shint/brdf_int.gif" /></td>
        </tr>
        <tr style="text-align: center;">
            <td><em>Measured BRDF</em></td>
            <td><em>Integrating over area light</em></td>
        </tr>        
    </table>
</div></center><br />
However, such integral is usually not easy to do. We introduce an efficient way to compute the integral of Spherical Harmonics expansion. That is spherical function defined as the weighted sum of <a href="https://en.wikipedia.org/wiki/Spherical_harmonics">Spherical Harmonics</a> (SH).
<center><div style="font-size: 90%;">
    <img style="width:25%;" src="{{ site.url | append: site.baseurl }}/data/images/shint/sh.gif" />
    <br />
    <em>First elements of the SH basis</em>
</div></center><br />
Any spherical function can be decomposed in an infinite SH expansion. For computation reasons, we restrict ourselves to band-limited expansion, that is expansion with a finite sum. In such as case, we can evaluate the integral of the SH expansion over a polygonal footprint by decomposing each element of the SH basis into a weighted sum of cosine power. Cosine power are spherical function defined using the dot product with a unit direction raised to a power.
<center style="font-size: 90%;">
    <table style="width:75%;">
        <tr>
            <td><img  src="{{ site.url | append: site.baseurl }}/data/images/shint/cos1.gif" /></td>
            <td><img  src="{{ site.url | append: site.baseurl }}/data/images/shint/cos2.gif" /></td>
            <td><img  src="{{ site.url | append: site.baseurl }}/data/images/shint/cos3.gif" /></td>
        </tr>
    </table>
    <em>Three cosine power directions</em>
</center><br />
We can use <a href="https://dl.acm.org/citation.cfm?id=218467">Arvo's method</a> (<a href="http://www.cs.virginia.edu/~jdl/bib/appearance/analytic%20models/arvo95.pdf">pdf</a>) to evaluate the integral of each cosine power. We further improve the efficiency of this method by sharing directions in the cosine power basis and using intermediate computation of Arvo's method.
<center><div style="width:25%; font-size: 90%;">
    <img  src="{{ site.url | append: site.baseurl }}/data/images/shint/cos_int.gif" />
    <br />
    <em>Integrating cosine powers</em>
</div></center><br />
We apply our technique to problems in rendering, including surface and volume shading, hierarchical product importance sampling, and fast basis projection for interactive rendering. Moreover, we show how to handle general, non-polynomial integrands in a Monte Carlo setting using control variates. Our technique computes the integral of band-limited spherical functions with performance competitive to (or faster than) more general numerical integration methods for a broad class of problems, both in off-line and interactive rendering contexts.
