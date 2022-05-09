---
layout: publication
date:   2022-04-13
title:  "Rendering Layered Materials with Diffuse Interfaces"
authors: [
    {name: "Heloise de Dinechin"},
    {name: "Laurent Belcour"}
]
journal: "I3D 2022"
categories: [
    "research",
    "publication"
]
tags: [
    "published",
    "Appearance Modeling and Rendering",
]
thumbnail: "/data/images/thumbnail_layeredDiffuse.png"
materials: [
    { type: "pdf", name: "paper", url: "https://arxiv.org/pdf/2203.11835" },
    { type: "zip", name: "supp. html", url: "https://belcour.github.io/blog/supp/2022-brdf-layered-diffuse/" },
    { type: "zip", name: "code", url: "https://drive.google.com/file/d/1L7pK4xvszQ04QQ6PAtA5jvyKZVnBZ_iz/view?usp=sharing" },
    { type: "video", name: "video", url: "https://youtu.be/P-wRgPe8sDs?t=9258"},
    #{ type: "slides", name: "slides", url: "" },
]
---

## Abstract

In this work, we introduce a novel method to render, in real-time, Lambertian surfaces with a rough dieletric coating. We show that the appearance of such configurations is faithfully represented with two microfacet lobes accounting for direct and indirect interactions respectively. We numerically fit these lobes based on the first order directional statistics (energy, mean and variance) of light transport using 5D tables and narrow them down to 2D + 1D with analytical forms and dimension reduction. We demonstrate the quality of our method by efficiently rendering rough plastics and ceramics, closely matching ground truth. In addition, we improve a state-of-the-art layered material model to include Lambertian interfaces.

## Teaser Video 
<center>
<iframe style="width:80%;" src="https://drive.google.com/file/d/1l_KyhcXGj61xPIbpU_DbCGgyCJqGtIQ4/preview" width="1280" height="720">
</iframe>
</center>
