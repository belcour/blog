---
layout: publication
date:   2027-07-03
title:  "Neural Texture Compression using Hypernetworks"
authors: [
    {name: "Laurent Belcour"}
]
journal: "EGSR 2027"
categories: [
    "research",
    "publication"
]
tags: [
    "published",
    "Appearance Modeling and Rendering",
]
thumbnail: "/data/images/thumbnail_Hypernetwork.png"
materials: [
    { type: "pdf", name: "paper", url: "https://arxiv.org/pdf/2606.26913" },
    { type: "zip", name: "code", url: "https://github.com/belcour/egsr2026_hypernetwork" },
    { type: "video", name: "pres.", url: "https://www.youtube.com/watch?v=jXAhFuz9E9w&t=100s&pp=ygUUYmVsY291ciBoeXBlcm5ldHdvcmvSBwkJmQsBhyohjO8%3D"},
]
---

## Abstract

Recent work on neural texture compression has demonstrated that it is possible to learn small, per-material texture representations (composed of latent textures and a small Multi-Layer Perceptron decoder) that can be decoded in real-time during shading to reproduce the input to a physically based shading model. However, existing methods require performing gradient-descent optimization per material for a given MLP and latent configuration. In this work, we train a single hypernetwork that outputs both the latent features and the MLP's weights and biases. Though the solution space is high-dimensional, this approach produces results comparable in quality to the current reference neural texture compressors. We further extend this approach to infer multiple decoders at once or even produce decoders that learn super-resolution.