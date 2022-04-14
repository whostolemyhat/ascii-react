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

## Converting images
The basis of the app is taking the image file and loading it into a `canvas` element, which allows us to get an array of all the pixels in the image so we can iterate through them in the conversion process (see the image to text algorithm). It also means we can show a nice preview of the image, since it's already loaded into the page - just create an `<img />` element and set the src to use the uploaded image.


The image is then converted via a simple script run in a worker thread (which I'll explain further in a bit), which passes event updates to update the progress bar. Once conversion is complete, the converted image is passed as a string to a `<div>` element to display.

The various stages of the process are flagged in the app's state so different components can be shown - for instance the upload form initially, the progress bar and preview image while conversion is taking place, then the results page once everything is complete.

### Aside: Image to text algorithm
The image to text conversion algorithm is actually pretty simple - in pseudo-code:
- Create a list of text characters; pick ones which cover a different amount of space. For instance `.` and `#` cover little and a lot of space respectively, but `c` and `e` are very similar.
- Iterate through every pixel in the image.
- For each pixel, check how light or dark the colours are (the [luminance of the pixel](http://cs.stackexchange.com/questions/11876/how-do-i-compute-the-luminance-of-a-pixel)).
- Match up the luminance of the pixel with characters - light pixels should take up very little space and allow a lot of the background colour through, so a character like `.` would be good.

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
Once I'd set up the worker script, and could convert a file I'd uploaded, I needed a way to display progress information and the result to the user. I was working on a project in my day job which used [Redux](http://redux.js.org/index.html) as the store; since I wasn't familiar with how Redux worked, having only used Flux implementations with React, I decided to use Redux as the store.

Having used Redux in a project from scratch, I really like how it treats state as immutable in components, so you always know where the internal state will change. However, it was a bit confusing initially trying to work out where props and state were being set, and how to pass data around the app. Overall I really like Redux, especially for a small app like this.

## Future changes
I think the only major feature to add in the future is an option to download the converted image as an image file - at the moment only text or HTML is possible. To get an image download I'd need to load the converted string back into a canvas element, plot out all the characters in the correct position then use the [`toDataURL`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL) method to get an image file.

Another potential improvement in the future is to pass the data to a server-side programme written in C++ or similar to speed up the conversion process. Node seems to have [pretty good FFI hooks](https://github.com/node-ffi/node-ffi/wiki/Node-FFI-Tutorial), so connecting the front- and backend seems relatively straightforward.

[Visit asciiPicture.com to convert images to ascii art!](https://www.asciipicture.com)