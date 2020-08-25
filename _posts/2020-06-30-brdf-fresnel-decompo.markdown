---
layout: publication
date:   2020-08-26
title:  "Bringing an Accurate Fresnel to Real-Time Rendering: a Preintegrable Decomposition"
authors: [
            { name: "Laurent Belcour" },
            { name: "Megane Bati", affiliation: "IOGS" },
            { name: "Pascal Barla", affiliation: "Inria" }
        ]
journal: "ACM SIGGRAPH 2020 Talks and Courses"
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
    { type: "latex", name: "bib", url: "https://hal.inria.fr/hal-02883680v2/bibtex" },
    { type: "pdf", name: "abstract", url: "https://hal.inria.fr/hal-02883680v1/document" },
    { type: "pdf", name: "supp. pdf", url: "https://hal.inria.fr/hal-02883680v2/file/pdf_supplemental.pdf" },
    { type: "zip", name: "code", url: "https://hal.inria.fr/hal-02883680v2/file/code_mitsuba.zip" },
    { type: "html", name: "notebook", url: "https://nbviewer.jupyter.org/github/belcour/sig2020_fresnel_decomposition/blob/master/notebook.ipynb"},
    { type: "slides", name: "slides", url: "https://belcour.github.io/blog/slides/2020-brdf-fresnel-decompo/index.html"},   
]
---

<img width="100%" style="border:solid 1px black;" src="{{ site.url | append: site.baseurl }}/data/images/teaser_BrdfFresnelDecompo.svg" />

[Fresnel equations](https://en.wikipedia.org/wiki/Fresnel_equations) describe the amount of light reflected by a planar surface and are basic components of microfacet models that drive physically based shading today. However, real-time constraints prevent us from using the accurate form of Fresnel equations in game engines and force us to use [Schlick's approximation](https://en.wikipedia.org/wiki/Schlick%27s_approximation). In this work, we provide a framework to build accurate Fresnel models that are compatible with real-time constraints. We show that our method permits to use parameterizations for Fresnel that are traditionally restricted to offline rendering engines in real-time game engines (such as [Ole Gulbrandsen's parameterization](http://jcgt.org/published/0003/04/03/)). We further show that our framework can be used to rectify non-linearities in such parameterizations to produce better artist friendly Fresnel models.

<p>
Here is a comparison of how close we can get to Fresnel equations with our decomposition compared to Schlick's approximation:
<center>
<img id="img1" width="25%" style="border:solid 1px black;" src="{{ site.url | append: site.baseurl }}/data/images/brdf-fresnel-decompo/ours_vs_ref.gif" />
<img id="img2" width="25%" style="border:solid 1px black;" src="{{ site.url | append: site.baseurl }}/data/images/brdf-fresnel-decompo/schlick_vs_ref.gif" />
</center>
<script>
document.getElementById('img1').src = "{{ site.url | append: site.baseurl }}/data/images/brdf-fresnel-decompo/ours_vs_ref.gif";
document.getElementById('img2').src = "{{ site.url | append: site.baseurl }}/data/images/brdf-fresnel-decompo/schlick_vs_ref.gif";
</script>
</p>

<p>
Our solution is quite easy to integrate in a modern game engine since it only requires to change the split-sum LUT (RG texture) that is tailored to Schlick Fresnel with a new RGBA LUT. Here are the different color channels of this LUT:
<center>
<img width="15%" style="border:solid 1px black;" src="{{ site.url | append: site.baseurl }}/slides/2020-brdf-fresnel-decompo/img/realtime/FGD_r.png" />
<img width="15%" style="border:solid 1px black;" src="{{ site.url | append: site.baseurl }}/slides/2020-brdf-fresnel-decompo/img/realtime/FGD_ours_g.png" />
<img width="15%" style="border:solid 1px black;" src="{{ site.url | append: site.baseurl }}/slides/2020-brdf-fresnel-decompo/img/realtime/FGD_ours_b.png" />
<img width="15%" style="border:solid 1px black;" src="{{ site.url | append: site.baseurl }}/slides/2020-brdf-fresnel-decompo/img/realtime/FGD_ours_a.png" />
</center>
</p>

<p>
We tested the integration of this new Fresnel model in <a href="https://unity.com/srp/High-Definition-Render-Pipeline">Unity HDRP</a> with minimal changes to the Lit shader.
<center>
    <video style="border:1px solid black; width:75%;" controls src="{{ site.url | append: site.baseurl }}/slides/2020-brdf-fresnel-decompo/videos/editing_clip.mp4" />
</center>
</p>

<p>
<strong>Thanks to:</strong> <a href="https://twitter.com/thomasdeliot">Thomas Deliot</a> for the Unity prototype. Eric Heitz, Jonathan Dupuy, and Kenneth Vanhoey for feedbacks. Naty Hoffman, Stephen Hill, Emmanuel Turquin, and Sebastien Lagarde for discussions on Fresnel. <a href="https://www.blendswap.com/blend/11086">Studio</a> and <a href="https://www.blendswap.com/blend/18023">shader ball</a> assets available at <a href="https://www.blendswap.com/">blendswap</a>.
</p>