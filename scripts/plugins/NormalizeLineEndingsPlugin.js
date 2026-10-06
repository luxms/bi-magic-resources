const {normalizeResourceContent, equalContentBytes} = require('../lib/resource-content');

class NormalizeLineEndingsPlugin {
  apply(compiler) {
    const {Compilation, sources: {RawSource}} = compiler.webpack;
    compiler.hooks.thisCompilation.tap('NormalizeLineEndingsPlugin', compilation => {
      compilation.hooks.processAssets.tap({
        name: 'NormalizeLineEndingsPlugin',
        // Source maps and resources emitted by SourceArtifactsPlugin must exist before normalization.
        stage: Compilation.PROCESS_ASSETS_STAGE_REPORT + 1,
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
