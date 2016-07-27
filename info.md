# Building asciiPicture.com

[asciiPicture.com](https://www.asciipicture.com) is a web app which converts images into text art, so the pixels of the picture are replaces with text characters - also known as ASCII art.

### Technologies used
- ES6
- React
- Redux
- Web workers
- Webpack

## First steps: file uploads

I initially started this project to play around with file uploads in React - how could I implement drag-and-drop uploading, what's the best way to show that a file was ready to upload and so on.

Once I had a solid implementation of file uploading (as seen in the [UploadForm component](https://github.com/whostolemyhat/ascii-react/blob/master/src/components/UploadForm/UploadForm.js) of the app) I then decided to do something with the file once uploaded. I chose to convert image files to ascii art since I'd recently seen a [great overview of the algorithm](http://stackoverflow.com/questions/32987103/image-to-ascii-art-conversion) on Stack Overflow, and had been playing around with [image to text conversion in Rust](https://github.com/whostolemyhat/ascii) to teach myself the Rust language.

### Aside: Image to text algorithm
The image to text conversion algorithm is actually pretty simple - in pseudo-code:
- Iterate through every pixel in the image.
- For each pixel, check how light or dark the colours are (the [luminance of the pixel](http://cs.stackexchange.com/questions/11876/how-do-i-compute-the-luminance-of-a-pixel)).
- Match up the luminance of the pixel with characters - light pixels should take up very little space and allow a lot of the background colour through, so a character like `.` would be good; dark pixels should let less of the background colour through, so a character like `#` would be better.
- Go through all the pixels and get a repres

## Workers
Once I started converting images, I quickly realised that using Javascript to convert the file in the browser was not a good way to do things - it took a very long time since every pixel in the image needed to be processed, and while the script was running, the entire page would be blocked due to Javascript being single-threaded. Additionaly, large images (where large could just mean a picture from a phone camera) tended to cause the page to hang or even crash due to the length of time it took.

To fix this problem, I decided to use a [web worker](http://www.html5rocks.com/en/tutorials/workers/basics/); these are a mechanism which allows Javascript to be run in a background thread, which would allow a long-running script like mine to be triggered without causing the page to become unresponsive. Ideal!

Web workers are interesting to work with, since you can only communicate with them via events, specifically `postMessage` and `onMessage`. All data needs to be passed between your main app and the worker via data in these events; you can't query the background worker directly, so if you need regular progress events, you need to make sure you send events with update messages.

Using a web worker with Webpack and ES6 was a bit of a pain too; you need to configure Webpack to split the worker script out from the rest of your code so it gets compiled into two different scripts:

```
webpackConfig.worker = {
  output: {
    filename: 'hash.worker.js',
    chunkFilename: '[id].hash.worker.js'
  }
}
```

([from the Webpack examples repo](https://github.com/webpack/webpack/tree/master/examples/web-worker)).

You also need to change the import syntax:

```import Worker from 'worker-loader!./asciiWorker';```

which tells Webpack that this is a worker script, and also includes the relative path to the worker script.

## Redux
Once I'd set up the worker script, and could convert a file I'd uploaded, I needed a way to display progress information and the result to the user. I was