---
layout: publication
date: 2019-06-17
title: "A Low-Discrepancy Sampler that Distributes Monte Carlo Errors as a Blue Noise in Screen Space"
authors: [
    {name: "Eric Heitz"},
    {name: "Laurent Belcour"},
    {name: "Victor Ostromoukhov"},
    {name: "David Coeurjolly"},
    {name: "Jean-Claude Iehl", "affiliation": "LIRIS"},
]
journal: "ACM SIGGRAPH Talk 2019"
categories: [
    "research",
    "publication"
]
tags: [
    "published",
    "(Quasi) Monte Carlo Rendering"
]
thumbnail: "/data/images/thumbnail_SamplingBlueNoise.png"
materials: [
   { type: "pdf", name: "paper", url: "https://hal.archives-ouvertes.fr/hal-02150657/document" },
   { type: "latex", name: "bib", url: "https://hal.archives-ouvertes.fr/hal-02150657/bibtex" },
   { type: "zip", name: "supp. code", url: "https://hal.archives-ouvertes.fr/hal-02150657/file/samplerCPP.zip" },
   { type: "zip", name: "supp. doc", url: "https://hal.archives-ouvertes.fr/hal-02150657/file/supplemental.zip" },
   { type: "zip", name: "unity demo", url: "https://drive.google.com/file/d/181AXka1ntceVsKIJ_ZD51V3iYeq2szYP/view?usp=sharing" },
   { type: "html", name: "supp. html", url: "/supp/2019-sampling-bluenoise/index.html" },
   { type: "video", name: "video", url: "https://hal.archives-ouvertes.fr/hal-02150657/file/samplerBlueNoiseErrors2019_video.mp4" },
   { type: "slides", name: "slides", url: "https://belcour.github.io/blog/slides/2019-sampling-bluenoise/index.html" },
]
---

<object style="width:100%;" data="{{ site.url | append: site.baseurl }}/data/svg/sampling_bluenoise.svg" type="image/svg+xml"></object>

<strong>Project Abstract</strong>

We introduce a sampler that generates per-pixel samples achieving high visual quality thanks to two key properties related to the Monte Carlo errors that it produces. First, the sequence of each pixel is an Owen-scrambled Sobol sequence that has state-of-the-art convergence properties. The Monte Carlo errors have thus low magnitudes. Second, these errors are distributed as a blue noise in screen space. This makes them visually even more acceptable. Our sam-pler is lightweight and fast. We implement it with a small texture and two xor operations. Our supplemental material provides comparisons against previous work for different scenes and sample counts. 
