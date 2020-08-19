/* Create an animated canvas from a list of files
 */
function canvas2video(canvas_id, image_filenames)
{
    var images = new Array();
    for(var k=0; k<image_filenames.length; ++k)
    {
        images[k] = new Image();
        images[k].src = image_filenames[k];
    }

    /* Store the image list in the canvas */
    var canvas  = document.getElementById(canvas_id);
    canvas.images = images;
    // console.log(canvas);

    var context = canvas.getContext('2d', { alpha: false } );
    images[0].onload = function() {
        context.drawImage(canvas.images[0], 0, 0);
    };
    
    canvas.step  = 1;
    canvas.frame = 0;
    canvas.refresh = function()
    {
        canvas.frame = canvas.frame + canvas.step;
        if(frame == 0) {
            canvas.step = 1;
        } else if(canvas.frame == canvas.images.length-1) {
            canvas.step = -1;
        }
        canvas.frame = Math.min(canvas.frame, canvas.images.length-1)
        canvas.frame = Math.max(canvas.frame, 0);

        context.drawImage(canvas.images[canvas.frame], 0, 0, canvas.width, canvas.height);
    }
    // canvas.timerId = window.setInterval(canvas.refresh, 60);
    // window.clearInterval(timerId);
}

/* Create an animated canvas from a list of files
 * Use the selector to store the image
 */
function loadImagesInCanvas(canvas, filenames, selector)
{
    for(var k=0; k<filenames.length; ++k)
    {
        selector[k] = new Image();
        selector[k].src = filenames[k];
    }

    /* Store the image list in the canvas */
    var canvas = document.getElementById(canvas);
    
    var context = canvas.getContext('2d', { alpha: false } );
    selector[0].onload = function() {
        context.drawImage(selector[0], 0, 0);
    };
}

/* Create a comparison
 */
function video_comparison(canvas_id, image1_filenames, image2_filenames)
{
    var images1 = new Array();
    var images2 = new Array();
    var length  = Math.min(image1_filenames.length, image2_filenames.length);
    for(var k=0; k<length; ++k)
    {
        images1[k] = new Image();
        images1[k].src = image1_filenames[k];
        images2[k] = new Image();
        images2[k].src = image2_filenames[k];
    }

    /* Store the image list in the canvas */
    var canvas = document.getElementById(canvas_id);
    var width  = canvas.width;
    var height = canvas.height;
    canvas.images1 = images1;
    canvas.images2 = images2;
    canvas.slider  = canvas.width;

    var context = canvas.getContext('2d', { alpha: false } );
    canvas.images1[0].onload = function() {
        context.drawImage(canvas.images1[0], 0, 0);
    };

    var step  = 1;
    var frame = 0;
    canvas.refresh = function()
    {
        var x  = canvas.slider;
        var d  = canvas.width - canvas.slider;
        
        frame = frame + step;
        if(frame == 0) {
            step = 1;
        } else if(frame == canvas.images1.length-1) {
            step = -1;
        }
        frame = Math.min(frame, canvas.images1.length-1)
        frame = Math.max(frame, 0);

        context.clearRect(0, 0, canvas.width, canvas.height);
        if(x > 0) {
            context.drawImage(canvas.images1[frame], 0, 0, x, height, 0, 0, x, height);
        }
        if(x<canvas.width) {
            context.drawImage(canvas.images2[frame], x, 0, d, height, x, 0, d, height);
        }
        context.fillRect(x, 0, 1, height);
    }
    // canvas.timerId = window.setInterval(canvas.refresh, 60);
}


/* Create a comparison
 */
function ogg_comparison(canvas_id, video1_id, video2_id)
{
    /* Store the image list in the canvas */
    var canvas = document.getElementById(canvas_id);
    canvas.slider  = canvas.width;

    var video1  = document.getElementById(video1_id);
    var video2  = document.getElementById(video2_id);
    var context = canvas.getContext('2d', { alpha: false } );
    video1.onload = function() {
        context.drawImage(video1, 0, 0);
    };

    canvas.refresh = function()
    {
        var x  = canvas.slider;
        var d  = canvas.width - canvas.slider;

        context.clearRect(0, 0, canvas.width, canvas.height);
        if(x > 0) {
            context.drawImage(video1, 0, 0, x, canvas.height, 0, 0, x, canvas.height);
        }
        if(x<canvas.width) {
            context.drawImage(video2, x, 0, d, canvas.height, x, 0, d, canvas.height);
        }
        context.fillRect(x, 0, 1, canvas.height);
    }
    // canvas.timerId = window.setInterval(canvas.refresh, 60);
}


function list_files(basename, start=0, end=360)
{
    var filenames = new Array();
    for(var k=start; k<end; ++k)
    {
        var frame = ("000"+k).slice(-4);
        filenames[k-start] = basename.replace('0000', frame);
    }
    return filenames;
}