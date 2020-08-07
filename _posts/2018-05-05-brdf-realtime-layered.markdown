---
layout: publication
date:   2018-05-05
title:  "Efficient Rendering of Layered Materials using an Atomic Decomposition with Statistical Operators"
authors: [
   { name: "Laurent Belcour" },
]
journal: "ACM Transactions on Graphics (proc. of SIGGRAPH 2018)"
categories: [
    "research",
    "publication"
]
tags: [
    "published",
    "Appearance Modeling and Rendering",
]
thumbnail: "/data/images/thumbnail_Layered.png"
materials: [
   { type: "pdf", name: "paper", url: "https://hal.archives-ouvertes.fr/hal-01785457/document"},
   { type: "latex", name: "bib", url: "https://hal.archives-ouvertes.fr/hal-01785457/bibtex"},
   { type: "supp. pdf", name: "paper", url: "https://hal.archives-ouvertes.fr/hal-01785457v2/file/suppl.pdf" },
   { type: "zip", name: "code", url: "https://hal.archives-ouvertes.fr/hal-01785457v3/file/suppl.zip" },
   { type: "video", name: "video", url: "https://youtu.be/wM5E-NJtaug" },
   { type: "slides", name: "slides", url: "https://belcour.github.io/blog/slides/2018-brdf-realtime-layered/slides.html" },
]
---

<img src="{{ site.url | append: site.baseurl }}/data/svg/layered_teaser.svg" />

<strong>Project Abstract</strong>

We derive a novel framework for the efficient analysis and computation of light transport within layered materials. Our derivation consists in two steps. First, we decompose light transport into a set of atomic operators that act on its directional statistics. Specifically, our operators consist of reflection, refraction, scattering, and absorption, whose combinations are sufficient to describe the statistics of light scattering multiple times within layered structures. We show that the first three directional moments (energy, mean and variance) already provide an accurate summary. Second, we extend the adding-doubling method to support arbitrary combinations of such operators efficiently. During shading, we map the directional moments to BSDF lobes. We validate that the resulting BSDF closely matches the ground truth in a lightweight and efficient form. Unlike previous methods we support an arbitrary number of textured layers, and demonstrate a practical and accurate rendering of layered materials with both an offline and real-time implementation that are free from per-material precomputation.
