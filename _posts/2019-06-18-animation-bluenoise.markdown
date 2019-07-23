---
layout: post
title:  "Distributing Monte Carlo Errors as a Blue Noise in Screen Space by Permuting Pixel Seeds Between Frames"
author: "Eric Heitz, Laurent Belcour"
journal: "Eurographics Symposium on Rendering (EGSR) 2019"
date:   2019-06-18
categories: research
published: true
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


<span>
<a href="https://drive.google.com/open?id=1znhbmKGeHphfae1tz3YnroOzOA5-sYcd"><img src="{{ site.url | append: site.baseurl }}/data/images/icon_pdf.png" height="32px">paper</a> &nbsp;
<!-- <a href="https://hal.archives-ouvertes.fr/hal-02150657/document"><img src="{{ site.url | append: site.baseurl }}/data/images/icon_pdf.png" height="32px">paper</a> &nbsp; -->
<!-- <a href="https://hal.archives-ouvertes.fr/hal-02150657/file/samplerCPP.zip"><img src="{{ site.url | append: site.baseurl }}/data/images/icon_zip.png" height="32px"/>supp. code</a> &nbsp;-->
<a href="{{ site.url | append: site.baseurl }}/supp/2019-animation-bluenoise/index.html"><img src="{{ site.url | append: site.baseurl }}/data/images/icon_zip.png" height="32px">supp. material</a> &nbsp;
<!--<a href="https://hal.archives-ouvertes.fr/hal-02150657/bibtex"><img src="{{ site.url | append: site.baseurl }}/data/images/icon_latex.png" height="32px">bib</a> &nbsp;
<a href="https://hal.archives-ouvertes.fr/hal-02150657/file/samplerBlueNoiseErrors2019_video.mp4">
<img src="{{ site.url | append: site.baseurl }}/data/images/icon_video.png" height="32px">video</a> &nbsp; -->
<!-- <a href="https://belcour.github.io/blog/slides/2018-brdf-realtime-layered/slides.html"><img src="{{ site.url | append: site.baseurl }}/data/images/icon_slides.png" height="32px">slides</a> -->
</span><br />


<h4>Project Abstract</h4>

Recent work has shown that distributing Monte Carlo errors as a blue noise in screen space improves the perceptual quality of rendered images. However, obtaining such distributions remains an open problem with high sample counts and high-dimensional rendering integrals. In this paper, we introduce a temporal algorithm that aims at overcoming these limitations. Our algorithm is applicable whenever multiple frames are rendered, typically for animated sequences or interactive applications. Our algorithm locally permutes the pixel sequences (represented by their seeds) to improve the error distribution across frames. Our approach works regardless of the sample count or the dimensionality and significantly improves the images in low-varying screen-space regions under coherent motion. Furthermore, it adds negligible overhead compared to the rendering times. Note: our supplemental material provides more results with interactive comparisons against previous work.
