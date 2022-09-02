// Update dev server used by CRA to add headers needed to enable SharedArrayBuffer
// needs to be in /src/setupProxy otherwise it's not picked up
module.exports = function (app) {
  app.use((req, res, next) => {
    res.set({
      'X-CLACKS-OVERHEAD': 'GNU Terry Pratchett',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    });
    next();
  });
};
