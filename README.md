# Social Share Block

Share your posts and pages instantly on popular social platforms in one click, straight from a Gutenberg block.

A WordPress block plugin by [WPDeveloper](https://wpdeveloper.com), part of the Essential Blocks family.

## Features

- Direct share to Facebook, X/Twitter, LinkedIn, Pinterest, Reddit, WhatsApp, Telegram, Tumblr, Pocket, VK, Xing and email
- Add as many custom platform icons as you like, and reorder them by drag and drop
- Floating share bar with a scroll-aware layout
- Custom shapes, alignments, hover effects, spacing, borders and shadows
- Fully responsive, with independent desktop / tablet / mobile controls
- No configuration required

## Requirements

| | |
|---|---|
| WordPress | 6.0 or newer |
| PHP | 7.4 or newer |
| Tested up to | WordPress 7.0, PHP 8.5 |

## Installation

**From the block editor**

1. Open the WordPress block editor
2. Search for "Social Share Block"
3. Install in one click

**Manually**

1. Upload the `social-share-block` folder to `wp-content/plugins/`
2. Activate the plugin through the *Plugins* menu
3. See the [documentation](https://essential-blocks.com/docs/)

## Development

This repository uses **git submodules**. Clone with them, or the plugin will not work:

```bash
git clone --recurse-submodules git@github.com:EssentialBlocks/social-share-block.git
```

Already cloned without them:

```bash
git submodule update --init --recursive
```

> [!IMPORTANT]
> `lib/style-handler` is not optional. Every layout, size, spacing and responsive rule
> for this block is generated into the `blockMeta` attribute and written to a per-post
> stylesheet by `EbStyleHandler`. Without the submodule the block renders completely
> unstyled on the frontend.

### Build

```bash
npm install
npm run build
```

Outputs `dist/index.js`, `dist/frontend/index.js` and `dist/style.css`.

> [!NOTE]
> `dist/modules.js` — the shared controls bundle — is built from the `controls`
> submodule, not by the root build, and is committed as an artifact.

### Package a release

Requires [WP-CLI](https://wp-cli.org) with the `dist-archive` command:

```bash
wp package install wp-cli/dist-archive-command
wp dist-archive . ../social-share-block.zip
```

Packaging honours `.distignore`. Note that its font exclusion rules are
**path-anchored on purpose** — several Font Awesome filenames appear in more
than one directory, and a bare-basename rule would strip fonts the plugin needs.

## Branches

| Branch | Purpose |
|---|---|
| `master` | Stable, released code |
| `latest` | Staging for the next release |
| `dev` | Active development |

## Contributors

- [@RahatSheikhLeon](https://github.com/RahatSheikhLeon)
- [WPDeveloper](https://github.com/EssentialBlocks) team — wpdevteam, re_enter_rupok, Asif2BD, alam789, fencermonir

## Support and documentation

- [Documentation](https://essential-blocks.com/docs/)
- [Issue tracker](https://github.com/EssentialBlocks/social-share-block/issues)
- [Support forum](https://wordpress.org/support/plugin/social-share-block)

## License

GPL-3.0-or-later. See [LICENSE](https://www.gnu.org/licenses/gpl-3.0.html).
