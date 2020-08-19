---
layout: publication
date:   2020-08-26
title:  "Bringing an Accurate Fresnel to Real-Time Rendering: a Preintegrable Decomposition"
authors: [
            { name: "Laurent Belcour" },
            { name: "Megane Bati", affiliation: "IOGS" },
            { name: "Pascal Barla", affiliation: "Inria" }
        ]
journal: "ACM SIGGRAPH Talk and Course"
categories: [
    "research",
    "publication"
]
tags: [
    "published",
    "Appearance Modeling and Rendering",
]
thumbnail: "/data/images/thumbnail_BrdfFresnelDecompo.png"
materials: [
    { type: "html", name: "course webpage", url: "https://blog.selfshadow.com/publications/s2020-shading-course/" },
    { type: "pdf", name: "abstract", url: "https://hal.inria.fr/hal-02883680v1/document" },
    { type: "pdf", name: "supp. pdf", url: "https://hal.inria.fr/hal-02883680v2/file/pdf_supplemental.pdf" },
    { type: "zip", name: "code", url: "https://hal.inria.fr/hal-02883680v2/file/code_mitsuba.zip" },
    { type: "html", name: "notebook", url: "https://nbviewer.jupyter.org/github/belcour/sig2020_fresnel_decomposition/blob/master/notebook.ipynb"},
    { type: "slides", name: "slides", url: "https://belcour.github.io/blog/slides/2020-brdf-fresnel-decompo/index.html"},   
]
---

<img width="100%" style="border:solid 1px black;" src="{{ site.url | append: site.baseurl }}/data/images/teaser_BrdfFresnelDecompo.svg" />

[Fresnel equations](https://en.wikipedia.org/wiki/Fresnel_equations) describe the amount of light reflected by a planar surface and are basic components of microfacet models that drive physically based shading today. However, real-time constraints prevent us from using the accurate form of Fresnel equations in game engines and force us to use [Schlick's approximation](https://en.wikipedia.org/wiki/Schlick%27s_approximation). In this work, we provide a framework to build accurate Fresnel models that are compatible with real-time constraints. We show that our method permits to use parameterization for Fresnel that are traditionally restricted to offline rendering engines in real-time game engines (such as [Ole Gulbrandsen's parameterisation](http://jcgt.org/published/0003/04/03/)). We further show that our framework can be used to rectify non-linearity in such parameterizations to produce better artist friendly Fresnel models.