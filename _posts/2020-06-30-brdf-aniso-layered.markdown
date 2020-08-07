---
layout: publication
date:   2020-06-30
title:  "Rendering Layered Materials with Anisotropic Interfaces"
authors: [
    {name: "Philippe Weier"},
    {name: "Laurent Belcour"}
]
journal: "Journal of Computer Graphics Techniques (JCGT)"
categories: [
    "research",
    "publication"
]
tags: [
    "published",
    "Appearance Modeling and Rendering",
]
thumbnail: "/data/images/thumbnail_anisoLayered.png"
materials: [
    { type: "pdf", name: "paper", url: "http://jcgt.org/published/0009/02/03/paper.pdf" },
    { type: "zip", name: "code", url: "http://jcgt.org/published/0009/02/03/mitsuba_supplemental.zip" },
    { type: "zip", name: "supp. html", url: "http://jcgt.org/published/0009/02/03/html_supplemental.zip" },
    #{ type: "slides", name: "slides", url: "" },
]
---

<!-- <div style="position:relative;width:100%;">
    <span style="position:absolute;left: 7%;">frame 1</span>
    <span style="position:absolute;left:24%;">frame 72</span>
    <span style="position:absolute;left:40%;">frame 144</span>
    <span style="position:absolute;left:57%;">frame 216</span>
    <span style="position:absolute;left:73%;">frame 288</span>
    <span style="position:absolute;left:90%;">frame 360</span>    
</div>
<object style="width:100%;" data="{{ site.url | append: site.baseurl }}/data/svg/animation_bluenoise.svg" type="image/svg+xml"></object>
<div style="position:relative;width:100%;">
    <span style="position:absolute; font-size:0.8em; top:-25px; left: 40px;">inset</span>
    <span style="position:absolute; font-size:0.8em; top:-25px; left:160px;">FFT</span>

    <span style="position:absolute; font-size:0.8em; top:-25px; left:280px;">inset</span>
    <span style="position:absolute; font-size:0.8em; top:-25px; left:400px;">FFT</span>

    <span style="position:absolute; font-size:0.8em; top:-25px; left:520px;">inset</span>
    <span style="position:absolute; font-size:0.8em; top:-25px; left:640px;">FFT</span>
    
    <span style="position:absolute; font-size:0.8em; top:-25px; left:760px;">inset</span>
    <span style="position:absolute; font-size:0.8em; top:-25px; left:880px;">FFT</span>        

    <span style="position:absolute; font-size:0.8em; top:-25px; left:1000px;">inset</span>
    <span style="position:absolute; font-size:0.8em; top:-25px; left:1120px;">FFT</span>  

    <span style="position:absolute; font-size:0.8em; top:-25px; left:1240px;">inset</span>
    <span style="position:absolute; font-size:0.8em; top:-25px; left:1360px;">FFT</span>  
</div> -->
<center>
<img style="border:1px solid black;" src="{{ site.url | append: site.baseurl }}/data/images/teaser_BrdfAniso.jpg" width="60%">
</center><br />


<h4>Project Abstract</h4>

<strong>Method.</strong> We present a lightweight and efficient method to render layered materials with anisotropic interfaces. Our work extends our previously published statistical framework to handle anisotropic microfacet models. A key insight to our work is that when projected on the tangent plane, BRDF lobes from an anisotropic GGX distribution are well approximated by ellipsoidal distributions aligned with the tangent frame: its covariance matrix is diagonal in this space. We leverage this property and perform the isotropic layered algorithm on each anisotropy axis independently. We further update the mapping of roughness to directional variance and the evaluation of the average reflectance to account for anisotropy.

<strong>Validation</strong> We validated that our model was visualy close to the ground truth. See our supplemental material for all our results (warning: the archive is > 4GB).
<center>
<img src="{{ site.url | append: site.baseurl }}/data/images/layered_aniso-validation.jpg" width="60%"><br />
<div style="width:50%;">
    <em>Example of the validation of our layered model with respect to the ground truth when changing the roughness to the top dielectric layer.</em>
</div>
</center><br />
