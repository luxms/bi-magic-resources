const {normalizeResourceContent, equalContentBytes} = require('../lib/resource-content');

class NormalizeLineEndingsPlugin {
  apply(compiler) {
    const {Compilation, sources: {RawSource}} = compiler.webpack;
    compiler.hooks.thisCompilation.tap('NormalizeLineEndingsPlugin', compilation => {
      compilation.hooks.processAssets.tap({
        name: 'NormalizeLineEndingsPlugin',
        // Source maps must exist before normalization; content hashes are computed later.
        stage: Compilation.PROCESS_ASSETS_STAGE_DEV_TOOLING + 1,
      }, () => {
        for (const asset of compilation.getAssets()) {
          const original = asset.source.source();
          const normalized = normalizeResourceContent(asset.name, original);
          if (!equalContentBytes(original, normalized)) {
            compilation.updateAsset(asset.name, new RawSource(normalized));
          }
        }
      });
    });
  }
}

module.exports = NormalizeLineEndingsPlugin;
