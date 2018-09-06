Files description:

FreightPacker-dev-dependencies.js: Separate dependencies for development (separate to minimize build time)
FreightPacker-dev.js: API without dependencies

FreightPacker.js: UMD build, includes everything
FreightPacker-loader.js: A build that imports 'FreightPacker.js' and loads the example, src at: ./src/loader.js