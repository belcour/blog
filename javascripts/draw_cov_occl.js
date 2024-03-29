loadFunctionOcclusion = function () {

    // WebGL code
    var occl_canvas = document.getElementById("draw_cov_occl-gl");
    if (!occl_canvas) {
        alert("Impossible de récupérer le canvas");
    }

    var h = 128, w = 128;
    occl_canvas.width = w;
    occl_canvas.height = h;

    var fourier_bt_press = false;
    function render_fourier_occl() {
        FFT.init(w);
        FrequencyFilter.init(w);
        var src = occl_canvas.getContext('2d').getImageData(0, 0, w, h);
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

        var occl_spectrum = document.querySelector('#draw_cov_occl-gl').getContext('2d');
        SpectrumViewer.init(occl_spectrum);
        SpectrumViewer.render(re, im, false, 10);
    }
    //*     
    var scene = createScene();
    addObject(scene, { p1: { x: 10.0, y: -1000 }, p2: { x: 10.0, y: 1000 }, L: 1.0 });

    addObject(scene, { p1: { x: 1.0, y: 0.0 }, p2: { x: 2.0, y: 0.0 }, L: 0.0 });
    addObject(scene, { p1: { x: 2.0, y: 0.0 }, p2: { x: 2.0, y: 2.0 }, L: 0.0 });
    addObject(scene, { p1: { x: 2.0, y: 2.0 }, p2: { x: 1.0, y: 2.0 }, L: 0.0 });
    addObject(scene, { p1: { x: 1.0, y: 2.0 }, p2: { x: 1.0, y: 0.0 }, L: 0.0 });

    addCamera(scene, { o: { x: -0.5, y: 0.0 }, d: { x: 1.0, y: 0.0 }, up: { x: 0.0, y: 1.0 } });

    var distToLight  = 2.1;
    scene.camera.o.x = distToLight;

    render(occl_canvas, scene, 0);
    if (fourier_bt_press) {
        render_fourier_occl();
    }

    var button = document.getElementById("draw_cov_occl_bt");
    button.onclick = function () {
        fourier_bt_press = !fourier_bt_press;
        render(occl_canvas, scene, 0);
        if (fourier_bt_press) {
            button.textContent = "inverse Fourier Transform";
            render_fourier_occl();
        } else {
            button.textContent = "Fourier Transform";
        }
    };

    // SVG drawing code
    var svg      = Snap('#draw_cov_occl-cv');
    var ray      = svg.select('#ray');
    var rayNorm  = ray.getTotalLength();
    var rayStart = ray.getPointAtLength(0);
    var rayEnd   = ray.getPointAtLength(rayNorm);
    var dirX     = (rayEnd.x - rayStart.x) / rayNorm;
    var dirY     = (rayEnd.y - rayStart.y) / rayNorm;

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

            var temp = distToLight - dotProd / 200;
            if (temp > 0 && temp <= 2.1) {
                distToLight = temp;
                var matrix = cursor.transform().localMatrix.translate(dotProd*dirX, dotProd*dirY);
                cursor.transform(matrix);
            }

            scene.camera.o.x = distToLight;
            render(occl_canvas, scene, 0);
            if (fourier_bt_press) {
                render_fourier_occl();
            }
        }

        // Update current position
        currentX = evt.clientX;
        currentY = evt.clientY;
    });
    


    // // SVG drawing code
    // var occl_svg = document.getElementById('draw_cov_occl-cv');
    // var svg = occl_svg.contentDocument;
    // var cursor = svg.getElementById("cursor");
    // var ray = svg.getElementById("ray");

    // var rayStart = ray.pathSegList.getItem(0);
    // var rayEnd = ray.pathSegList.getItem(1);
    // var dirX = rayEnd.x - rayStart.x;
    // var dirY = rayEnd.y - rayStart.y;
    // var rayDirNorm = Math.sqrt(dirX * dirX + dirY * dirY);
    // dirX /= rayDirNorm;
    // dirY /= rayDirNorm;

    // var currentX = 0;
    // var currentY = 0;
    // var isDown = false;

    // svg.addEventListener('mousemove', function (evt) {
    //     // If the main button is pressed, translate the cursor handle and
    //     // refresh the raytracer.
    //     if (evt.buttons == 1 || evt.button == 1) {
    //         var deltaX = evt.clientX - currentX;
    //         var deltaY = evt.clientY - currentY;

    //         var rayStart = cursor.pathSegList.getItem(0);
    //         var rayEnd = cursor.pathSegList.getItem(1);
    //         var dotProd = deltaX * dirX + deltaY * dirY;

    //         var temp = distToLight + dotProd / 200;
    //         if (temp > 0 && temp < 1.0) {
    //             distToLight = temp;
    //             rayStart.x += dotProd * dirX;
    //             rayStart.y += dotProd * dirY;
    //             rayEnd.x += dotProd * dirX;
    //             rayEnd.y += dotProd * dirY;
    //         }

    //         scene.camera.o.x = -distToLight;
    //         render(occl_canvas, scene, 0);
    //         if (fourier_bt_press) {
    //             render_fourier_occl();
    //         }
    //     }

    //     currentX = evt.clientX;
    //     currentY = evt.clientY;
    // }, false);
}

addLoadEvent(loadFunctionOcclusion);
