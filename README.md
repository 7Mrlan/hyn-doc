# HYN Component Documentation

Standalone HYN component documentation and the source workspace for `@7mrlan/hyn-ui`.

- Public documentation: `https://7mrlan.github.io/hyn-doc/`
- Local development: `corepack pnpm@10.0.0 docs:dev`
- Local verification: `corepack pnpm@10.0.0 ui:typecheck`, `corepack pnpm@10.0.0 docs:typecheck`, and `corepack pnpm@10.0.0 docs:build`
- Documentation deployment: only pushes to `develop` run the GitHub Pages workflow.
- UI releases: push a `hyn-ui-v*` tag after a reviewed package version update. The package is published to GitHub Packages; consumers must provide a `read:packages` token outside repository files.

The docs app intentionally has no SSO router, store, proxy, API client, or authentication dependency. Interactive examples use deterministic local fixtures.
