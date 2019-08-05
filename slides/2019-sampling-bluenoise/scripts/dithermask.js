/* Compute the cost function for a window around pixel_i where
    * the central value (at pixel_i) is base_value. This allows to
    * swap between the mutated cost and the non-mutated cost.
    */
function computeCost(image, width, height, pixel_i, base_value) {
    var window = 3;
    var cost   = 0.0;
    for(var di=-window; di<=window; di++)
        for(var dj=-window; dj<=window; dj++)
        {
            if(di == 0 && dj == 0) continue;
            var i = pixel_i[0] + di;
            var j = pixel_i[1] + dj;
            if(i < 0 || j < 0 || i >= width || j >= height) continue;
            // i = (i<0) ? (i+width)  : (i % width);
            // j = (j<0) ? (j+height) : (j % height);

            var index = i + j*width;
            var pixel_dist  = Math.exp(- 0.5 * (di*di + dj*dj) / (2.1*2.1));
            var sample_dist = Math.exp(- 0.5 * ( Math.pow(image[index] - base_value, 2) ) );

            cost += pixel_dist*sample_dist;
        }
    return cost;
}

/* Mutate pixels from the dither image and the scrambling image */
function mutatePixelsValues(image, width, height, depth, pixel_i, pixel_j) {
    var id_i = (pixel_i[1]*width + pixel_i[0]);
    var id_j = (pixel_j[1]*width + pixel_j[0]);
    for(var d=0; d<depth; ++d) {
        var value_i = image[depth*id_i + d];
        var value_j = image[depth*id_j + d];
        image[depth*id_i + d] = value_j;
        image[depth*id_j + d] = value_i;
    }
}

var simulatedAnnealingTemp = 1.0;
function optimizeScrambleMask(image, mask, width, height, nb_mutations) {
    var nb_accept = 0;
    for(var mutation=0; mutation<nb_mutations; ++mutation) {
        var pixel_i = [Math.floor(Math.random() * width), Math.floor(Math.random() * height)];
        var pixel_j = [Math.floor(Math.random() * width), Math.floor(Math.random() * height)];

        var value_i = image[pixel_i[0] + pixel_i[1]*width];
        var value_j = image[pixel_j[0] + pixel_j[1]*width];
        if(Math.abs(value_i - value_j) < 10) { continue; }

        var costBefore = 0;
        costBefore += computeCost(image, width, height, pixel_i, value_i);
        costBefore += computeCost(image, width, height, pixel_j, value_j);

        var costAfter = 0;
        costAfter += computeCost(image, width, height, pixel_i, value_j);
        costAfter += computeCost(image, width, height, pixel_j, value_i);

        // var energy = Math.exp(simulatedAnnealingTemp * (costBefore - costAfter));
        // simulatedAnnealingTemp *= 1.001;
        if(costBefore > costAfter) {
            nb_accept++;
            mutatePixelsValues(image, width, height, 1, pixel_i, pixel_j);
            mutatePixelsValues(mask,  width, height, 2, pixel_i, pixel_j);
        }
    }
    return image;
    // console.log('Accepted ' + nb_accept + ' mutations');
}
function optimizeScrambleMaskWithTarget(image, mask, target, width, height, nb_mutations) {
    for(var mutation=0; mutation<nb_mutations; ++mutation) {
        var pixel_i = [Math.floor(Math.random() * width), Math.floor(Math.random() * height)];
        var pixel_j = [Math.floor(Math.random() * width), Math.floor(Math.random() * height)];

        var value_i = image[pixel_i[0] + pixel_i[1]*width];
        var value_j = image[pixel_j[0] + pixel_j[1]*width];
        var target_i = target[pixel_i[0] + pixel_i[1]*width];
        var target_j = target[pixel_j[0] + pixel_j[1]*width];

        var costBefore = 0;
        costBefore += Math.abs(value_i - target_i);
        costBefore += Math.abs(value_j - target_j);

        var costAfter = 0;
        costAfter += Math.abs(value_i - target_j);
        costAfter += Math.abs(value_j - target_i);

        // var energy = Math.exp(simulatedAnnealingTemp * (costBefore - costAfter));
        // simulatedAnnealingTemp *= 1.001;
        if(costBefore > costAfter) {
        // if( ( Math.sign(target_i - target_j) != Math.sign(value_i - value_j) ) &&
        //     ( Math.sign(target_i - target_j) == Math.sign(value_j - value_i) ) ) {
            // nb_accept++;
            mutatePixelsValues(image, width, height, 1, pixel_i, pixel_j);
            mutatePixelsValues(mask,  width, height, 2, pixel_i, pixel_j);
        }
    }
    return image;
    // console.log('Accepted ' + nb_accept + ' mutations');
}

/* Given an input image and output image, optimize a copy of it for nb_mutations
 * and return the result.
 */
function updateScrambleMasks(images, masks, width, height, nb_mutations) {
    // Allocate new buffer
    var length    = width*height;
    var old_image = images[0];
    var new_image = images[1];
    var old_mask  = masks[0];
    var new_mask  = masks[1];

    // For each image in the array, mutate it by swapping
    // the pixel positions such that is mimize the error
    // function.
    for(var i=0; i<length; ++i) {
        new_image[i]    = old_image[i];
        new_mask[2*i+0] = old_mask[2*i+0];
        new_mask[2*i+1] = old_mask[2*i+1];
    }
    optimizeScrambleMask(new_image, new_mask, width, height, nb_mutations);
}

/* Given an input image and output image, optimize a copy of it for nb_mutations
 * and return the result.
 */
function updateScrambleMasksWithTarget(image, mask, target, width, height, nb_mutations) {
    optimizeScrambleMaskWithTarget(image, mask, target, width, height, nb_mutations);
}

/* Given an image data (Uint8Array), write it down in
    * a canvas
    */
function renderImageInCanvas(image, canvas_id, width, height, depth) {
    var cnv = document.getElementById(canvas_id);
    var ctx = cnv.getContext('2d');
    var img = ctx.createImageData(width, height);
    for(var j=0; j<height; ++j)
        for(var i=0; i<width; ++i) {
            var id = j*width + i;
            if(depth == 1) {
                img.data[4*id + 0]  = image[id];
                img.data[4*id + 1]  = image[id];
                img.data[4*id + 2]  = image[id];
            } else if(depth == 2) {
                img.data[4*id + 0]  = image[2*id+0];
                img.data[4*id + 1]  = image[2*id+1];
                img.data[4*id + 2]  = 0;
            } else if(depth == 3) {
                img.data[4*id + 0]  = image[3*id+0];
                img.data[4*id + 1]  = image[3*id+1];
                img.data[4*id + 2]  = image[3*id+2];
            }
            img.data[4*id + 3]  = 255;
        }
    ctx.putImageData(img, 0, 0);
}

var renders;
var masks;
var target;

function initMaskAndRender(width, height) {
    var length  = width*height;
    // var input   = new Uint8Array(length);
    renders = [new Uint8Array(length), new Uint8Array(length)];
    // var i_mask  = new Uint8Array(2*length);
    masks   = [new Uint8Array(2*length), new Uint8Array(2*length)];

    for(var i=0; i<length; ++i) {
        renders[0][i] = Math.floor(255 * Math.random());
        // input[i] = renders[0][i];
        masks[0][2*i+0] = Math.floor(255 * Math.random());
        masks[0][2*i+1] = Math.floor(255 * Math.random());
        // i_mask[2*i+0] = masks[0][2*i+0];
        // i_mask[2*i+1] = masks[0][2*i+1];
    }
}