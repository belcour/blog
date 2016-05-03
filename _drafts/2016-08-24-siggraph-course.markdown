---
layout: post
title:  "SIGGRAPH 2016 Course: Frequency Analysis of Light Transport"
date:   2016-08-24
categories: course
permalink: siggraph-2016-course.html
published: true
javascripts:
  - utils
---

<center>
<img src="{{ site.url | append: site.baseurl }}/data/images/cover_course_2016.jpg" height="200px" >
</center><br />


#### Course description

Frequency Analysis of Light Transport expresses Physically Based Rendering (PBR) using signal processing tools. It is thus tailored to predict sampling rate, perform denoising, perform anti-aliasing, etc. Many method have been proposed to deal with specific cases of light transport (motion, lenses, etc). This course aims to introduce concepts and present practical application scenarios of frequency analysis of light transport in a unified context. To ease the understanding of theoretical elements, frequency analysis will be introduced in pair with an implementation.

#### Syllabus

**Saturday, 24 August 8:30am - 10am, Room #$D**

 + `8:30` - Introduction
 + `8:45` - Concepts and Implementation ([notes][notes-part1], [slides][slides-part1])
 + `9:15` - Applications of Frequency Analysis ([notes][notes-part2], [slides][slides-part2])
 + `9:45` - Conclusion

#### Additional materials

Source code available on github [here][source-code].


[notes-part1]:  {{ site.url | append: site.baseurl }}/course/2016/08/25/siggraph-course-part1.html
[notes-part2]:  {{ site.url | append: site.baseurl }}/course/2016/08/25/siggraph-course-part2.html
[slides-part1]: {{ site.url | append: site.baseurl }}/slides/siggraph-2016-part1.html
[slides-part2]: {{ site.url | append: site.baseurl }}/slides/siggraph-2016-part2.html
[source-code]:  https://github.com/belcour/CovarianceTracing
