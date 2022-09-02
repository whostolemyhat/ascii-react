Code for [asciipicture.com](https://www.asciipicture.com).

Convert an image to text-based render using client-side web workers.

## Running

- `yarn && yarn start` will run the site locally on localhost:3000

## Notes

- `setupProxy.js` is used to add COOP and COEP headers to enable sharedbufferarray locally.
- Github Actions used for CI

## Links

https://developer.chrome.com/blog/transferable-objects-lightning-fast/
https://www.kevinhoyt.com/2018/10/31/transferable-imagedata/
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer
https://web.dev/coop-coep/

## TODO

- check error messages
- api/non-js fallback
- rm event emitter
- wasm
