---
layout: post
title:  "Rendering Layered Materials with Anisotropic Interfaces"
author: "Philippe Weier, Laurent Belcour"
journal: "Journal of Computer Graphics Techniques (JCGT)"
date:   2020-06-30
categories: research
published: true
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
<img src="{{ site.url | append: site.baseurl }}/data/images/teaser_BrdfAniso.jpg" width="60%">
</center><br />

<span>
<a href="http://jcgt.org/published/0009/02/03/paper.pdf"><img src="{{ site.url | append: site.baseurl }}/data/images/icon_pdf.png" height="32px">paper</a> &nbsp;
<!-- <a href="https://hal.archives-ouvertes.fr/hal-02150657/document"><img src="{{ site.url | append: site.baseurl }}/data/images/icon_pdf.png" height="32px">paper</a> &nbsp; -->
<a href="http://jcgt.org/published/0009/02/03/mitsuba_supplemental.zip"><img src="{{ site.url | append: site.baseurl }}/data/images/icon_zip.png" height="32px"/>supp. code</a> &nbsp;
<a href="http://jcgt.org/published/0009/02/03/html_supplemental.zip"><img src="{{ site.url | append: site.baseurl }}/data/images/icon_zip.png" height="32px">supp. material</a> &nbsp;
<!-- <a href="https://drive.google.com/file/d/181AXka1ntceVsKIJ_ZD51V3iYeq2szYP/view?usp=sharing"><img src="{{ site.url | append: site.baseurl }}/data/images/icon_zip.png" height="32px">unity demo</a> &nbsp; -->
<a href="http://jcgt.org/published/0009/02/03/bibtex.bib"><img src="{{ site.url | append: site.baseurl }}/data/images/icon_latex.png" height="32px">bib</a> &nbsp;
<!--<a href="https://hal.archives-ouvertes.fr/hal-02150657/file/samplerBlueNoiseErrors2019_video.mp4">
<img src="{{ site.url | append: site.baseurl }}/data/images/icon_video.png" height="32px">video</a> &nbsp; -->
<!-- <a href="https://belcour.github.io/blog/slides/2018-brdf-realtime-layered/slides.html"><img src="{{ site.url | append: site.baseurl }}/data/images/icon_slides.png" height="32px">slides</a> -->
</span><br />


<h4>Project Abstract</h4>

<strong>Method.</strong><br /> 
We present a lightweight and efficient method to render layered materials with anisotropic interfaces. Our work extends our previously published statistical framework to handle anisotropic microfacet models. A key insight to our work is that when projected on the tangent plane, BRDF lobes from an anisotropic GGX distribution are well approximated by ellipsoidal distributions aligned with the tangent frame: its covariance matrix is diagonal in this space. We leverage this property and perform the isotropic layered algorithm on each anisotropy axis independently. We further update the mapping of roughness to directional variance and the evaluation of the average reflectance to account for anisotropy.

<strong>Validation</strong><br />
Using an extensive study, we validated that our model was visualy close to the ground truth. See our supplemental material results (warning: the archive is > 4GB).
<center>
<img src="{{ site.url | append: site.baseurl }}/data/images/layered_aniso-validation.jpg" width="60%"><br />
<div style="width:50%;">
    <em>Example of the validation of our layered model with respect to the ground truth when changing the roughness to the top dielectric layer.</em>
</div>
</center><br />
