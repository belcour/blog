---
layout: publication
date:   2019-06-18
title:  "Distributing Monte Carlo Errors as a Blue Noise in Screen Space by Permuting Pixel Seeds Between Frames"
authors: [
    {name: "Eric Heitz"},
    {name: "Laurent Belcour"}
]
journal: "Eurographics Symposium on Rendering (EGSR) 2019"
categories: [
    "research",
    "publication"
]
tags: [
    "published",
    "(Quasi) Monte Carlo Rendering"
]
thumbnail: "/data/images/thumbnail_AnimationBlueNoise.png"
materials: [
   { type: "pdf", name: "paper", url: "https://hal.archives-ouvertes.fr/hal-02158423/document" },
   { type: "zip", name: "supp. material", url: "{{ site.url | append: site.baseurl }}/supp/2019-animation-bluenoise/index.html" },
   { type: "zip", name: "demo", url: "https://drive.google.com/file/d/181AXka1ntceVsKIJ_ZD51V3iYeq2szYP/view?usp=sharing" },
   { type: "slides", name: "slides", url: "https://hal.archives-ouvertes.fr/hal-02158423/file/blueNoiseTemporal2019_slides.pdf" },
]
---

<div style="position:relative;width:100%;">
    <span style="position:absolute;left: 7%;">frame 1</span>
    <span style="position:absolute;left:24%;">frame 72</span>
    <span style="position:absolute;left:40%;">frame 144</span>
    <span style="position:absolute;left:57%;">frame 216</span>
    <span style="position:absolute;left:73%;">frame 288</span>
    <span style="position:absolute;left:90%;">frame 360</span>    
</div>
<object style="width:100%;" data="{{ site.url | append: site.baseurl }}/data/svg/animation_bluenoise.svg" type="image/svg+xml"></object>
<!--
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
</div>
-->

<strong>Project Abstract</strong>

Recent work has shown that distributing Monte Carlo errors as a blue noise in screen space improves the perceptual quality of rendered images. However, obtaining such distributions remains an open problem with high sample counts and high-dimensional rendering integrals. In this paper, we introduce a temporal algorithm that aims at overcoming these limitations. Our algorithm is applicable whenever multiple frames are rendered, typically for animated sequences or interactive applications. Our algorithm locally permutes the pixel sequences (represented by their seeds) to improve the error distribution across frames. Our approach works regardless of the sample count or the dimensionality and significantly improves the images in low-varying screen-space regions under coherent motion. Furthermore, it adds negligible overhead compared to the rendering times. Note: our supplemental material provides more results with interactive comparisons against previous work.
