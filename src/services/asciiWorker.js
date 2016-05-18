console.log('worker script loaded');

function pixelToChar(pixel, mapLength) {
    const averageShade = Math.floor(pixel.r * 0.3 + pixel.b * 0.3 + pixel.g * 0.3);
    return Math.floor((255 - averageShade) * (mapLength / 256));
}

const charMap = [".", ",", ":", ";", "o", "x", "%", "#", "@"];

onmessage = function(e) {
    console.log('message received');
    console.log(e.data);
    console.log('posting');

    postMessage('hello');

    const pixels = e.data[0];

    const resolution = 1;
    const PIXEL_LENGTH = 4;
    const imgWidth = pixels.width * PIXEL_LENGTH;
    const rowPercent = 100 / pixels.height;
    let rowCount = 0;
    const data = pixels.data;
    const dataLength = data.length;
    let out = '';


    for(let i = 0; i < dataLength; i += PIXEL_LENGTH * resolution) {
        const pixel = {};
        pixel.r = data[i];
        pixel.g = data[i + 1];
        pixel.b = data[i + 2];
        pixel.a = data[i + 3];

        const char = charMap[ pixelToChar(pixel, charMap.length) ];
        out += char;

        if(i % imgWidth === 0 && i > 0) {
            out += '\r\n';
            postMessage({ type: 'progress', value: (rowCount * rowPercent) * resolution });
            rowCount++;

            // skip rows
            i += imgWidth * (resolution - 1);
        }
    }

    // return out;
    postMessage({ type: 'result', value: out });

}