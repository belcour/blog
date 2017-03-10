loadFunctionTravel = function () {

    var tr_canvas = document.getElementById("draw_cov_travel-gl");
    if (!tr_canvas) {
        alert("Impossible de récupérer le canvas");
    }

    var h = 128, w = 128;
    tr_canvas.width = w;
    tr_canvas.height = h;

    var fourier_bt_press = false;
    function render_fourier_travel() {
        FFT.init(w);
        FrequencyFilter.init(w);
        var src = tr_canvas.getContext('2d').getImageData(0, 0, w, h);
        var dat = src.data;
        var re = [], im = [];
        for (var y = 0; y < h; y++) {
            var i = y * w;
            for (var x = 0; x < w; x++) {
                var W = 0.25 * (1.0 - Math.cos(2.0 * Math.PI * y / (h - 1))) * (1.0 - Math.cos(2.0 * Math.PI * x / (w - 1)));
                var L = dat[(i << 2) + (x << 2) + 0]
                    + dat[(i << 2) + (x << 2) + 1]
                    + dat[(i << 2) + (x << 2) + 2];
                re[i + x] = W * L;
                im[i + x] = 0.0;
            }
        }
        FFT.fft2d(re, im);
        FrequencyFilter.swap(re, im);

        var tr_spectrum = document.querySelector('#draw_cov_travel-gl').getContext('2d');
        SpectrumViewer.init(tr_spectrum);
        SpectrumViewer.render(re, im, false, 5);
    }

    var scene = createScene();
    addObject(scene, { p1: { x: 1.0, y: -0.5 }, p2: { x: 1.0, y: 0.5 }, L: 1.0 });
    addCamera(scene, { o: { x: -0.5, y: 0.0 }, d: { x: 1.0, y: 0.0 }, up: { x: 0.0, y: 1.0 } });

    var distToLight = 0.0;
    scene.camera.o.x = -distToLight;

    render(tr_canvas, scene, 0);
    if (fourier_bt_press) {
        render_fourier_travel();
    }

    var button = document.getElementById("draw_cov_travel_bt");
    button.onclick = function () {
        fourier_bt_press = !fourier_bt_press;
        render(tr_canvas, scene, 0);
        if (fourier_bt_press) {
            button.textContent = "inverse Fourier Transform";
            render_fourier_travel();
        } else {
            button.textContent = "Fourier Transform";
        }
    };


    // SVG drawing code
    var svg      = Snap('#draw_cov_travel-cv');
    var ray      = svg.select('#ray');
    var rayStart = ray.getPointAtLength(0);
    var rayEnd   = ray.getPointAtLength(ray.getTotalLength());
    var dirX = rayEnd.x - rayStart.x;
    var dirY = rayEnd.y - rayStart.y;
    var rayDirNorm = Math.sqrt(dirX * dirX + dirY * dirY);
    dirX /= rayDirNorm;
    dirY /= rayDirNorm;

    // Current position in the SVG element
    var currentX = 0;
    var currentY = 0;

    // Add a mousemove handler to animate the SVG element
    svg.mousemove(function (evt) {
        // If the main button is pressed, translate the cursor handle and
        // refresh the raytracer.
        if (evt.buttons == 1 || evt.button == 1) {
            var deltaX = evt.clientX - currentX;
            var deltaY = evt.clientY - currentY;

            var cursor = svg.select('#cursor');
            var dotProd  = deltaX * dirX + deltaY * dirY;

            var temp = distToLight + dotProd / 200;
            if (temp > 0 && temp < 1.0) {
                distToLight = temp;
                var matrix = cursor.transform().localMatrix.translate(dotProd*dirX, dotProd*dirY);
                cursor.transform(matrix);
            }

            scene.camera.o.x = -5 * distToLight;
            render(tr_canvas, scene, 0);
            if (fourier_bt_press) {
                render_fourier_travel();
            }
        }

        // Update current position
        currentX = evt.clientX;
        currentY = evt.clientY;
    });
}

addLoadEvent(loadFunctionTravel);
