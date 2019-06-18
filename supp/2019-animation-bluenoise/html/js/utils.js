setNewSPP = function(id, spp) {
   $("#" + id + " img").each(function(){
      // var elem_id  = $(this).attr('id');
      var filename = $(this).attr('src');
      var newname = filename.replace(new RegExp("spp\=[0-9]+"), "spp="+spp);
      $(this).attr('src', newname);
   });
}


var updateLocalAnalysis = function(img, ref, inset, compute_fft=true) {

   inset.canvas.width = inset.size;
   inset.canvas.height = inset.size;

   var fft_img = document.getElementById(inset.canvas);
   var fft_ctx = fft_img.getContext('2d');


   var scale = 1.0;//img.naturalHeight / img.height;
   var ffth  = fft_img.width;
   var fftw  = fft_img.height;
   w = inset.size;

   fft_ctx.drawImage(ref, inset.x, inset.y, inset.size, inset.size, 0, 0, fftw, ffth);
   var src = fft_ctx.getImageData(0, 0, w, w);
   var dat = src.data;
   var R = [];
   for(var y=0; y<w; y++) {
      var i = y*w;
      for(var x=0; x<w; x++) {
         var L = dat[(i << 2) + (x << 2) + 0] + dat[(i << 2) + (x << 2) + 0] + dat[(i << 2) + (x << 2) + 0];
         R[i + x] = L;
      }
   }

   fft_ctx.drawImage(img, inset.x, inset.y, inset.size, inset.size, 0, 0, fftw, ffth);
   if(compute_fft == false) return;

   // Compute the FFT of the image
   FFT.init(w);
   FrequencyFilter.init(w);
   SpectrumViewer.init(fft_ctx);
   var src = fft_ctx.getImageData(0, 0, w, w);
   var dat = src.data;
   var re = [], im = [];
   var lmean = 0.0;
   var scale = 1.0/(1.0*w*w);
   for(var y=0; y<w; y++) {
         var i = y*w;
         for(var x=0; x<w; x++) {
            var W = 1.0;//Math.sin(Math.PI * y/(w-1)) * Math.sin(Math.PI * x/(w-1));
            var r = R[i+x];
            var L = dat[(i << 2) + (x << 2) + 0] + dat[(i << 2) + (x << 2) + 0] + dat[(i << 2) + (x << 2) + 0];
            // L = L;
            L = (L - r) + 255.0;

            lmean = lmean += L*scale

            re[i + x] = W*L;
            im[i + x] = 0.0;

            p = (i << 2) + (x << 2);
            dat[p + 0] = L;
            dat[p + 1] = L;
            dat[p + 2] = L;
         }
   }


   // fft_ctx.putImageData(src, 0, 0);

   for(var y=0; y<w; y++) {
      var i = y*w;
      for(var x=0; x<w; x++) {
         re[i+x] = re[i+x] - lmean;
      }
   }

   FFT.fft2d(re, im);
   FrequencyFilter.swap(re, im);

   // Draw spectrum
   SpectrumViewer.render(re, im, false, 1);
}

var localAnalysisCreateInset = function(snapId, imgId, inset, window) {
   var img = document.getElementById(imgId);

   var snap   = Snap(snapId);
   var size   = inset.size;
   var scale  = window.size/size;
   var border = 8 / scale;
   var gloBorder   = snap.rect(-border, -border, 2*size+ 4*border, size + 2*border).attr({fill: "#ffffff", stroke: "#333333", strokeWidth: "1px", "vector-effect": "non-scaling-stroke", opacity: 0.8});
   var text1 = snap.text(size/2, size+5, "local window").attr({textAnchor: "middle", fontSize: "0.1em", fill: "#000000"});
   var text2 = snap.text(3*size/2+2*border, size+5 , "Fourier transform").attr({textAnchor: "middle", fontSize: "0.1em", fill: "#000000"});
   var insetImg    = snap.image(img.src, 0, 0, img.width, img.height).attr({id: "image"});
   var insetRect   = snap.rect(0,0, size, size).attr({fill: "#ffffff"});
   var insetBorder = insetRect.clone().attr({fillOpacity: 0, stroke: inset.color, strokeWidth: "2px", "vector-effect": "non-scaling-stroke"});
   var imageRect   = insetBorder.clone();
   var fourBorder  = insetBorder.clone().transform(Snap.matrix().translate(size+2*border, 0));
   fourBorder.attr({stroke: "#000000"});
   //insetImg.transform(Snap.matrix(1,0,0,1,10,20));
   insetImg.attr({clip: insetRect});
   var t = Snap.matrix().translate(window.x, window.y);
   t.add(Snap.matrix().scale(scale));
   var group = snap.g(gloBorder, insetImg, insetBorder , fourBorder, text1, text2);
   group.transform(t);

   t = Snap.matrix().translate(inset.x, inset.y);
   setData(imgId, "inset-t", t);
   //globalT = t.clone();
   imageRect.transform(t)
   insetRect.transform(t);
   insetImg.transform(t.invert());

   if(inset.canvas) {
      var canvas = document.getElementById(inset.canvas);
      var bbox   = fourBorder.getBBox();
      var transf = fourBorder.transform().totalMatrix;
      var x = transf.x(bbox.x, bbox.y) - (window.size+15);
      var y = transf.y(bbox.x, bbox.y);
      var w = window.size;
      var h = window.size;
      canvas.style.width  = w + "px";
      canvas.style.height = h + "px";
      canvas.style.left   = x + "px";
      canvas.style.top    = y + "px";
   }

   function dragInset(dx, dy, x, y, event) {
      var t = getData(imgId, "inset-t").clone();
      var s = 1;//Reveal.getScale();
      t.add(Snap.matrix().translate(dx/s, dy/s));
      imageRect.transform(t);
      insetRect.transform(t);
      insetImg.transform(t.invert());
      newinset = {x: inset.x + dx, y: inset.y + dy, size: inset.size, canvas: inset.canvas};
      updateLocalAnalysis(imgId, newinset);
   }
   function dragStart(x, y, event) {
      setData(imgId, "inset-t", imageRect.transform().localMatrix);
   }
   function dragEnd(x, y, event) {
   }
   imageRect.drag(dragInset, dragStart, dragEnd);

   updateLocalAnalysis(imgId, inset);
}
