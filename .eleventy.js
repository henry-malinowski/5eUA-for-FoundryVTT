const path = require('path');
const esbuild = require('esbuild');

module.exports = function (eleventyConfig) {
  const isProdBuild = process.env.ELEVENTY_ENV === 'production';
  const outputDir = isProdBuild ? '_site_prod' : '_site';

  if (!isProdBuild) {
    // Dev mode serves modular source assets directly for easier debugging.
    eleventyConfig.addPassthroughCopy('styles');
    eleventyConfig.addPassthroughCopy('scripts');
    eleventyConfig.addWatchTarget('styles/');
    eleventyConfig.addWatchTarget('scripts/');
  } else {
    // Production mode emits only bundled assets to avoid output ambiguity.
    eleventyConfig.on('eleventy.after', async () => {
      await esbuild.build({
        entryPoints: ['styles/style.css'],
        bundle: true,
        minify: true,
        loader: {
          '.woff2': 'copy',
          '.svg': 'copy',
          '.png': 'copy',
          '.jpg': 'copy',
          '.webp': 'copy',
        },
        outfile: path.join(outputDir, 'styles/style.css'),
      });

      await esbuild.build({
        entryPoints: ['scripts/app.js'],
        bundle: true,
        minify: true,
        outfile: path.join(outputDir, 'scripts/app.js'),
      });
    });
  }

  eleventyConfig.addPassthroughCopy('site.webmanifest');
  eleventyConfig.addPassthroughCopy('images');
  eleventyConfig.addPassthroughCopy('fonts');
  eleventyConfig.addWatchTarget('_data/modules/');
  eleventyConfig.ignores.add('index.html');

  return {
    dir: {
      input: '.',
      output: outputDir,
    },
  };
};
