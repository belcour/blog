
loadFunction = function() {
   var tr_canvas = document.getElementById("draw_cov_travel");
   if(!tr_canvas) {
      alert("Impossible de récupérer le canvas");
   }

   tr_canvas.style.background = "#FF0";
}

if(addLoadEvent) {
   addLoadEvent(loadFunction);
} else {
   window.onload = loadFunction;
}
