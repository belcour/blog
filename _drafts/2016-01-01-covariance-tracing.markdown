---
layout: post
title:  "Introduction to Covariance Tracing"
date:   2016-01-01
categories: research
published: true
---

<strong>Covariance Tracing</strong> is a method to evaluate the bandwidth of the <em>local radiance</em> around a given light path. This document present the idea of covariance tracing and frequency analysis in a progressive manner.

For simplicity, we will illustrate the different concepts using 2D light transport.


#### What is covariance?

In the following, we will talk about covariance refering to the covariance of the Fourier transform of the radiance function. The covariance is a matrix describing the orientation and spread of a signal.

Since we are interested by 2D light transport, we will use a 2D matrix. The complete formulation of covariance tracing involves a 5D matrix (2D in space, 2D in angles and  1D in time).

     cov = { sxx, sxy;
             syx, syy };

where `sxx` and `syy` are the variance (or squared standard deviation) of the signal along the x (and respectively y) axis of our domain. `sxy = syx` is the correlation of the signal with respect to axis x and y. A covariance matrix is symmetric and this property can be used for efficient implementation.

#### Ray local space

In order to describe the radiance for small perturbation of a given ray, we need a parametrization of this local space. We will use the tangential space defined by the ray. This space can be defined using a two plane parametrization (see <a href="#figure1">Fig.1</a>).

<center>
<canvas id="myCanvas" width="600px" height="250px">
</canvas><br />
<div style="width:600px;"><em><a name="figure1">Fig.1 -</a> The local tangent frame of a 2D ray is described by a two plane parametrization. The first plane describes the relative position and the second plane the relative direction. Move the mouse over the (x,u) space to change the ray.</em></div>
</center><br />

<script type="text/javascript">
function clamp(x, a, b) {
   return Math.min(Math.max(x, a), b);
}

var lastX = 0;
var lastU = 0;

function drawing(ctx, pos) {
   // Draw the rectangle in the right side of the screen
   var recX = 350;
   var recY = 25;
   var recU = 200;
   var recV = 200;
   ctx.strokeRect(recX, recY, recU, recV);

   ctx.moveTo(recX - 10, recY + 0.5*recV);
   ctx.lineTo(recX + recU + 10, recY + 0.5*recV);
   ctx.stroke();
   context.font = '10pt Time Sans MS';
   context.fillStyle = 'black';
   context.fillText('x', recX + recU + 15, recY + 0.5*recV + 3);

   ctx.moveTo(recX + 0.5*recU, recY - 10);
   ctx.lineTo(recX + 0.5*recU, recY + recV + 10);
   ctx.stroke();
   context.fillText('u', recX + 0.5*recU - 3, recY - 15);

   // Get the cursor position in the box

   var posInRecX = clamp(pos.x, recX, recX + recU) - (recX + 0.5*recU);
   var posInRecU = clamp(pos.y, recY, recY + recV) - (recY + 0.5*recV);
   if(pos.x < recX || pos.x > recX+recU || pos.y < recY || pos.y > recY+recV) {
      posInRecX = lastX;
      posInRecU = lastU;
   } else {
      lastX = posInRecX;
      lastU = posInRecU;
   }
   ctx.beginPath();
   ctx.arc(recX + 0.5*recU + posInRecX, recY + 0.5*recV + posInRecU, 3, 0, 2*Math.PI);
   ctx.fill();

   // Convert the cursor position to ray direction and draw the ray
   var spaceScale = 100;
   var x = spaceScale*(posInRecX / recU);
   var u = spaceScale*(posInRecU / recV);
   var orgX = 50;
   var orgY = 125 - x;
   var dirX = spaceScale;
   var dirY = u;
   var norm = Math.sqrt(dirX*dirX + dirY*dirY);

   var posX = orgX + 0.5*spaceScale*dirX/norm;
   var posY = orgY + 0.5*spaceScale*dirY/norm;

   // Main ray
   ctx.moveTo(25, recY + 0.5*recV);
   ctx.lineTo(25+1.3*recU, recY + 0.5*recV);
   ctx.stroke();
   context.fillText('main ray', 1.3*recU, recY + 0.5*recV + 15);

   // 'x' coordinate
   ctx.moveTo(50, recY);
   ctx.lineTo(50, recY + recV);
   ctx.stroke();
   context.fillText('x', 47, recY - 10);

   // 'u' coordinate
   ctx.moveTo(50 + spaceScale, recY);
   ctx.lineTo(50 + spaceScale, recY + recV);
   ctx.stroke();
   context.fillText('u', 47 + spaceScale, recY - 10);

   // Draw the sub-ray
   ctx.moveTo(orgX, orgY);
   ctx.lineTo(posX, posY);
   ctx.stroke();

   // Draw the position on the two 'x' and 'u' plane
   ctx.fillStyle = "#000000";
   ctx.beginPath();
   ctx.arc(orgX, orgY, 3, 0, 2*Math.PI);
   ctx.fill();
   ctx.beginPath();
   ctx.arc(orgX + dirX, orgY + dirY, 3, 0, 2*Math.PI);
   ctx.stroke();
}

function updateDrawing(canvas, mousePos) {
  var context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawing(context, mousePos);
}
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

canvas.addEventListener('mousemove', function(evt) {
  var mousePos = getMousePos(canvas, evt);
  updateDrawing(canvas, mousePos);
}, false);

updateDrawing(canvas, {x:0, y:0});
</script>

Now that we have this parametrization, we can express the radiance in that space: $$L(x + \delta x, u + \delta u)$$. Note that the local $$(x, u)$$ coordinate in <a href="#figure1">Fig.1</a> is replaced by small values $$(\delta x, \delta u)$$. The next step is to express radiance transport equations in this space.

#### Radiance operators in local space

Expressing the rendering equation <a href="#RenderingEq">[1]</a> or the radiative transfer equation <a href="#RTE">[2]</a> in local coordinates is not possible since they rely on global coordinates. Instead, we look at solutions of those equations for simple cases (operators) that correspond to transport evaluated during path tracing. We will need to describe several transport operators such as <em>travel in free space, reflection, refraction, ...</em>

<strong>Travel operator</strong> is the simplest of all. It describe the local radiance given that we now the local radiance from a previous position along the ray.

      // Express the covariance after a travel of 'd' meters
      void travel(float d) {
         op = { 1, d;
                0, 1};
         cov = op' * cov * op;
      }
