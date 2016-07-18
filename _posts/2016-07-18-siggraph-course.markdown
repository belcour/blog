---
layout: post
title:  "SIGGRAPH 2016 Course: Frequency Analysis of Light Transport"
date:   2016-07-18
categories: course
permalink: siggraph-2016-course.html
published: true
javascripts:
  - utils
  - snap.svg
  - fft
  - course2016-part1
---

<center style="font-size:2em;">
<div style="position:relative;width:512px;height:512px;margin:0;">
<img id="local-analysis-01-img" src="{{ site.url | append: site.baseurl }}/data/images/dragon-01.png" width="512" height="512" style="border-width:0px;position:absolute;z-index:-1;margin:0px;top:0;left:0;" />
<svg viewBox="0 0 512 512" style="width:512px;height:512px;position:absolute;z-index:1;top:0;left:0;overflow:visible;" id="local-analysis-01"></svg>
<canvas id="local-analysis-01-fft1" width="128" height="128" style="background-color:#FFF;border-width:0px;position:absolute;z-index:3;margin:0px;top:0;left:0;"></canvas>
<canvas id="local-analysis-01-fft2" width="128" height="128" style="background-color:#FFF;border-width:0px;position:absolute;z-index:3;margin:0px;top:0;left:0;"></canvas>
</div>
</center>

<script type="text/javascript">
document.getElementById("local-analysis-01-img").onload = function() {
   var inset1 = {size:32, x:150, y:200, color: "#aa0000", canvas: "local-analysis-01-fft1"};
   var inset2 = {size:32, x:220, y:340, color: "#00aa00", canvas: "local-analysis-01-fft2"};
   var windw1 = {size: 150, x:-150, y:-10};
   var windw2 = {size: 150, x: 350, y:400};

   localAnalysisCreateInset("#local-analysis-01", "local-analysis-01-img", inset1, windw1);
   localAnalysisCreateInset("#local-analysis-01", "local-analysis-01-img", inset2, windw2);
}

</script><br /><br />

#### Course description

Frequency Analysis of Light Transport expresses Physically Based Rendering (PBR) using signal processing tools. It is thus tailored to predict sampling rate, perform denoising, perform anti-aliasing, etc. Many method have been proposed to deal with specific cases of light transport (motion, lenses, etc). This course aims to introduce concepts and present practical application scenarios of frequency analysis of light transport in a unified context. To ease the understanding of theoretical elements, frequency analysis will be introduced in pair with an implementation.

#### Schedule

**Wednesday, 27 August 9am - 10:30am, Room 303 A-C**

 + ` 9:00` - Introduction
 + ` 9:10` - Concepts and Implementation
 + ` 9:40` - Applications of Frequency Analysis
 + `10:25` - Conclusion

<!--
 + ` 9:00` - Introduction ([slides][slides-part0])
 + ` 9:10` - Concepts and Implementation ([notes][notes-part1], [slides][slides-part1])
 + ` 9:40` - Applications of Frequency Analysis ([notes][notes-part2], [slides][slides-part2])
 + `10:25` - Conclusion ([slides][slides-part3])
-->


#### Additional materials

Source code available on github [here][source-code].


[notes-part1]:  {{ site.url | append: site.baseurl }}/course/2016/08/25/siggraph-course-part1.html
[notes-part2]:  {{ site.url | append: site.baseurl }}/course/2016/08/25/siggraph-course-part2.html
[slides-part0]: {{ site.url | append: site.baseurl }}/slides/2016-course/part0.html
[slides-part1]: {{ site.url | append: site.baseurl }}/slides/2016-course/part1.html
[slides-part2]: {{ site.url | append: site.baseurl }}/slides/2016-course/part2.html
[slides-part3]: {{ site.url | append: site.baseurl }}/slides/2016-course/part3.html
[source-code]:  https://github.com/belcour/CovarianceTracing
