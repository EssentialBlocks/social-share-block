# Social Share Block — Compatibility Report

**Plugin:** Social Share Block (`social-share-block`)
**Version:** 2.0.3 → 2.5.0
**Branch:** `social-share-block-dev` (branched off `master`)
**Date of pass:** 2026-08-10
**Nothing committed or pushed — working tree left dirty for review.**

> **Version note.** The compatibility pass originally bumped 2.0.3 → 2.0.4. On user
> instruction the version was set to 1.5.0, then to **2.5.0**, which is what ships.
> The intermediate 1.5.0 value would have been a downgrade from the shipped 2.0.3 and
> was unshippable; 2.5.0 resolves that — it sorts above 2.0.3, so wordpress.org will
> offer it to existing installs. Note that 2.5.0 is a **minor** bump rather than the
> patch-level bump a compatibility-only pass would normally carry.

---

## 1. Detected original PHP / WP baseline

### PHP — detected floor: **7.4**

| Evidence | File:line | Implies |
|---|---|---|
| `...$args` variadics in `get_instance( ...$args )` | `includes/font-loader.php:21` | PHP 5.6+ |
| `new static( ...$args )` argument unpacking | `includes/font-loader.php:23` | PHP 5.6+ |
| `[]` short array syntax throughout | many | PHP 5.4+ |
| `str_contains()` | `includes/helpers.php:47` | PHP 8.0 function — but WP core polyfills it since **WP 5.9**, so it is safe on PHP 7.4 under a WP 6.0 floor |
| No typed properties, no arrow fns, no `match`, no ctor promotion, no enums | — | code does not itself require > 7.4 |

Highest *hard* PHP requirement in the plugin's own code is **5.6**. The `str_contains()`
call would be a fatal on PHP 7.4 if WordPress did not ship a polyfill; it does (WP 5.9+),
so it is not a blocker at the declared floor.

### WordPress — detected floor: **5.8**

| Evidence | File:line | Implies |
|---|---|---|
| `register_block_type()` given a **path** | `social-share-block.php:132` | WP 5.8+ |
| `block.json` + path registration | `block.json` | WP 5.5+ |
| `get_block_wrapper_attributes()` | `social-share-block.php:170` | WP 5.6+ |
| `render_block` filter | `includes/font-loader.php:31` | WP 5.0+ |
| `site-editor.php` / `gutenberg-edit-site` handling | `includes/helpers.php:47` | WP 5.9-era |
| explicit `<= 5.6` guard for the pre-5.7 registration form | `includes/helpers.php:137` | code was written to also run on WP 5.0–5.6 |

### Declared values before this pass

| Field | Main plugin file | readme.txt |
|---|---|---|
| `Requires PHP` | *absent* | *absent* |
| `Requires at least` | *absent* | 5.0 |
| `Tested up to` | *absent* | 6.5 |
| `Stable tag` | — | 2.0.3 |

**Disagreement:** the main plugin file declared **nothing at all** — no `Requires PHP`,
no `Requires at least`, no `Tested up to`. readme.txt claimed WP 5.0, but the code
uses `register_block_type( $path )` which is WP 5.8+; the `<= 5.6` fallback at
`helpers.php:137` was the only thing keeping the WP 5.0 claim even partly honest.

---

## 2. Chosen floor

| | Detected original | Policy minimum | **Declared** |
|---|---|---|---|
| PHP | 5.6 (code) / 7.4 effective | 7.4 | **7.4** — policy minimum won |
| WP | 5.8 | 6.0 | **6.0** — policy minimum won |

No user override was requested, so the standard PHP 7.4 / WP 6.0 policy minimum applies.

---

## 3. Target range

Verified against live sources on **2026-08-10**:

- `https://www.php.net/releases/index.php?json&max=3` → latest stable **PHP 8.5.9**;
  actively supported branches: 8.2, 8.3, 8.4, 8.5.
- `https://api.wordpress.org/core/version-check/1.7/` → latest stable **WordPress 7.0.3**.

**Target range: PHP 7.4 → 8.5, WordPress 6.0 → 7.0.**

Per-version checklist covered: PHP 7.4, 8.0, 8.1, 8.2, 8.3, 8.4, 8.5 —
WordPress 6.0, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 7.0.

---

## 4. Issue table

| # | File:line | Issue | Breaks on | Severity |
|---|---|---|---|---|
| 1 | `social-share-block.php:25` | `require_once` of `lib/style-handler/style-handler.php` — a **git submodule that is currently uninitialised/empty** in this checkout. Unconditional require of a missing file. | Any PHP / any WP — **fatal, plugin cannot load** | **Critical** |
| 2 | `social-share-block.php:1-14` | No `if ( ! defined( 'ABSPATH' ) ) exit;` guard in the main plugin file | Any — direct file access | High |
| 3 | `social-share-block.php` header | No `Requires PHP`, no `Requires at least`, no `Tested up to` — WP cannot block installs on unsupported stacks | All | High |
| 4 | `social-share-block.php:163` (orig) | `$blockId = $attributes['blockId'];` — unguarded array access | PHP 8.0+ `Warning: Undefined array key` | Medium |
| 5 | `social-share-block.php:182` (orig) | `$post->ID` read with no null check; `$post` is null on non-singular / template-part / widget contexts | PHP 8.0+ `Warning: Attempt to read property "ID" on null` | Medium |
| 6 | `social-share-block.php:177` (orig) | `preg_match( …, $profile['icon'], … )` — `$profile['icon']` may be unset/null | PHP 8.1+ deprecation (null to non-nullable internal param); PHP 8.0+ undefined-key warning | Medium |
| 7 | `social-share-block.php:182` (orig) | `href=<?php … ?>` — **unquoted HTML attribute**, and the helper returned `null` for unrecognised icons. Output became `href= target="_blank"`, which browsers parse as `href="target=_blank"` — a broken link, not the intended empty one. | All versions — real markup bug | High |
| 8 | `social-share-block.php:101,116` (orig) | `filemtime()` on `dist/style.css` with no existence check | PHP 8.0+ warning + `false` version arg if build output is absent | Medium |
| 9 | `social-share-block.php:121` (orig) | `require` of `dist/frontend/index.asset.php` unguarded | Fatal if build output absent | Medium |
| 10 | `social-share-block.php:29-31` (orig) | `define()` with no `defined()` guard — re-definition notice if `init` runs twice (WP-CLI, some test harnesses) | PHP 8.0+ notice | Low |
| 11 | `includes/helpers.php:49` (orig) | `include_once` used to read `dist/modules.asset.php` — returns `true`, not the array, on any repeat include. `$controls_dependencies['dependencies']` then reads an offset on `bool`, and `array_merge()` receives a non-array. | PHP 7.4/8.0 warning → **PHP 8.0+ `TypeError` fatal** in `array_merge()` | High |
| 12 | `includes/helpers.php:47` (orig) | `$_SERVER['QUERY_STRING']` used unsanitised and unslashed | All — hygiene / WPCS violation | Medium |
| 13 | `includes/helpers.php:78` (orig) | `wp_register_style()` passed `SOCIAL_SHARE_BLOCKS_ADMIN_URL` (a URL) as the `$ver` argument | All — emits a full URL into the `?ver=` query string | Low |
| 14 | `includes/helpers.php:87` (orig) | `$controls_dependencies['version']` unguarded array access (same root cause as #11) | PHP 8.0+ warning | Medium |
| 15 | `includes/helpers.php:104` (orig) | `eb_social_share_name_link()` documented `@return string` but had two paths returning `null` implicitly | All — feeds #7 | Medium |
| 16 | `includes/helpers.php:60` | `'eb_wp_version' => (float) get_bloginfo('version')` — float cast of a WP version string. `"6.10"` casts to `6.1`, i.e. *lower* than `"6.9"` → `6.9`. | Any WP x.10+ release | Medium — **flagged, not auto-fixed** (see §7) |
| 17 | `includes/helpers.php:137` | `(float) get_bloginfo('version') <= 5.6` — same float-cast defect, and now a **dead branch** under the WP 6.0 floor | Dead code | — (see §5) |
| 18 | `includes/post-meta.php:12` | `add_filter( 'init', … )` used to register an action callback | All — works, but wrong API and the return value is discarded | Low |
| 19 | `includes/font-loader.php:52` (orig) | `$block['blockName']` unguarded array access inside the `render_block` filter | PHP 8.0+ `Warning: Undefined array key` | Medium |
| 20 | `includes/font-loader.php:70` (orig) | `$googleFontFamily[$attributes[$key]]` — uses an attribute **value** as an array key without checking it is scalar | PHP 8.0+ `TypeError: Illegal offset type` if any `*FontFamily` attribute is an array/object | High |
| 21 | `social-share-block.php:35` | `throw new Error(…)` when `dist/index.asset.php` is missing — an uncaught fatal on `init` | All | Medium — **flagged, not auto-fixed** (see §7) |
| 22 | `block.json` | No `apiVersion` key → block registers as **API v1**. Current is v3 (WP 6.3+). | Not broken, but v1 is legacy | Low — **flagged, not auto-fixed** (see §7) |
| 23 | `includes/helpers.php:110-133` | Share URLs concatenate `$post_title` / `$post_link` into query strings **without `urlencode()`/`rawurlencode()`**. A title containing `&`, `#` or `?` corrupts the outbound share URL. | All | Medium — **flagged, not auto-fixed** (see §7) |
| 24 | `includes/font-loader.php:105` | Google Fonts **v1** API (`//fonts.googleapis.com/css`, pipe-delimited families). Still served, but superseded by `css2`. | Not broken | Low — informational |

### Checks performed that found nothing

- No `mysql_*`, `create_function()`, `each()`, `money_format()`, `ereg*`, `split()`,
  `strftime()`, `utf8_encode/decode`, `FILTER_SANITIZE_STRING`, `${var}` interpolation.
- No curly-brace string/array offsets (`$s{0}`).
- No implicit-nullable parameters (`f( int $x = null )`) — the PHP 8.4 deprecation.
- No dynamic property creation on non-`#[AllowDynamicProperties]` classes (PHP 8.2).
- No `ArrayAccess` / `Iterator` / `JsonSerializable` implementations, so no
  `#[\ReturnTypeWillChange]` needed (PHP 8.1).
- No `$wpdb` usage at all → no `prepare()` or `%i` concerns.
- No `register_rest_route()` → the WP 5.5 mandatory `permission_callback` rule does not apply.
- No jQuery usage anywhere in `assets/js` or `src` → no jQuery 3.x / Migrate removals
  (`.live()`, `.size()`, `$.browser`, `$.parseJSON`, `$.trim`, etc.).
- No `load_plugin_textdomain()` call, so the WP 6.7 "translation loaded too early" notice
  cannot be triggered.
- All global functions, classes and constants are prefixed
  (`Social_Share_*`, `eb_social_share_*`, `SOCIAL_SHARE_BLOCKS_*`,
  `create_block_social_share_block_init`) → no redeclare-fatal risk.
- `includes/*.php` all carry the `ABSPATH` guard (only the main file lacked one).

---

## 5. Dead version-check branches (floor raise 5.8 → 6.0)

Exactly one version-gated branch exists in the plugin's PHP.

| File | Line | Condition | What the branch does | Single remaining reachable path if removed |
|---|---|---|---|---|
| `includes/helpers.php` | 137 | `(float) get_bloginfo('version') <= 5.6` | Returns the **block name string** (`'social-share-block/social-share'`) instead of the block directory path, because `register_block_type()` did not accept a path before WP 5.7. | `get_block_register_path()` collapses to `return $blockPath;`. The call site at `social-share-block.php:132` becomes `register_block_type( SOCIAL_SHARE_BLOCKS_ADMIN_PATH, [ … ] )` and the helper method can be deleted entirely. |

Under a WP 6.0 floor this condition is permanently false, so the `return $blockname;`
branch is unreachable.

> **Status: AWAITING DECISION.** Nothing was removed. Per the standing rule, dead
> version-check branches are never deleted automatically — the decision to strip a
> legacy fallback is separate from the decision to raise the declared floor.

Note: this branch also contains the float-cast defect described in issue #16 — but
because it is dead under the chosen floor, it is not worth fixing in place. Either
remove it or leave it; patching it would be patching unreachable code.

No other version gates exist: no `version_compare()`, no `PHP_VERSION_ID`, no
`$wp_version`, no `phpversion()`, no `is_php_version_compatible()` /
`is_wp_version_compatible()`, no `MIN_PHP`-style constants, and no
admin-notice-then-`return` bail-out guard in the main plugin file.

---

## 6. Fixes applied

| Issue | File | Fix |
|---|---|---|
| 1 | `social-share-block.php` | Wrapped the style-handler require in `file_exists()` — an uninitialised submodule now degrades silently instead of fataling |
| 2 | `social-share-block.php` | Added `if ( ! defined( 'ABSPATH' ) ) { exit; }` |
| 3 | `social-share-block.php` | Added `Requires at least: 6.0`, `Requires PHP: 7.4`, `Tested up to: 7.0` to the header |
| 4 | `social-share-block.php` | `$blockId = isset( $attributes['blockId'] ) ? … : '';`; also normalised `$attributes` to an array up front |
| 5 | `social-share-block.php` | Introduced `$post_id = isset( $post->ID ) ? $post->ID : 0;` and used it in the share-link call. `get_the_title(0)` / `get_the_permalink(0)` fall back to the global post exactly as `null` previously did — identical output, no warning |
| 6 | `social-share-block.php` | `$profileIcon = isset( $profile['icon'] ) ? (string) $profile['icon'] : '';` used for both `preg_match()` and the icon class; `$matches` pre-initialised |
| 7 | `social-share-block.php` | `href` now quoted and wrapped in `esc_url()` |
| 8 | `social-share-block.php` | `filemtime()` guarded by `file_exists()`, falling back to `SOCIAL_SHARE_BLOCKS_VERSION` |
| 9 | `social-share-block.php` | Frontend asset `require` guarded by `file_exists()`; `dependencies` / `version` read defensively |
| 10 | `social-share-block.php` | All three `define()` calls wrapped in `! defined()` |
| 11 | `includes/helpers.php` | `include_once` → `include`, guarded by `file_exists()`, result normalised to an array; `dependencies` and `version` extracted into `$controls_deps` / `$controls_version` with defaults |
| 12 | `includes/helpers.php` | `sanitize_text_field( wp_unslash( $_SERVER['QUERY_STRING'] ) )`, hoisted into `$query_string` |
| 13 | `includes/helpers.php` | `$ver` for `essential-blocks-iconpicker-css` changed from the plugin URL to `SOCIAL_SHARE_BLOCKS_VERSION` |
| 14 | `includes/helpers.php` | Uses `$controls_version` |
| 15 | `includes/helpers.php` | `eb_social_share_name_link()` now returns `''` on both fall-through paths; `$icon_text` coerced to string |
| 18 | `includes/post-meta.php` | `add_filter( 'init', … )` → `add_action( 'init', … )` |
| 19 | `includes/font-loader.php` | `$block` and `$block['attrs']` type-checked; `blockName` read via `isset()` |
| 20 | `includes/font-loader.php` | `get_fonts_family()` skips any `*FontFamily` attribute whose value is not a string before using it as an array key; `$attributes` / `$keys` cast to array |
| — | `readme.txt` | `Requires at least: 6.0`, `Tested up to: 7.0`, added `Requires PHP: 7.4`, `Stable tag: 2.5.0`, new changelog entry |
| — | `package.json` | `version` 2.0.3 → 2.5.0 |
| — | `social-share-block.php` | `Version:` header and `SOCIAL_SHARE_BLOCKS_VERSION` bumped to 2.5.0 |

Every applied fix is defensive-guard-only. None changes rendered markup, saved
attributes, option names, hook names, handle names or the public API — with the
single deliberate exception of issue #7, where the `href` attribute is now quoted.
That correction is intentional: the previous unquoted form produced a genuinely
broken link for any icon the helper did not recognise.

---

## 7. Flagged — NOT auto-fixed (need your decision)

**A. `(float) get_bloginfo('version')` localized as `eb_wp_version`** — `helpers.php:60`

The bundled editor script consumes this as a number: `dist/modules.js` does
`n >= 5.8 ? registerBlockType({name, ...}) : registerBlockType(name, ...)`.
Passing a string would break that comparison, so the float cast cannot simply be
dropped. The cast is ordering-incorrect (`"6.10"` → `6.1`), but across the entire
declared WP 6.0 → 7.0 range every possible cast result is still `>= 5.8`, so the
gate is permanently true and the defect is currently **inert**.

*Recommendation:* leave it for now, or send a correctly-ordered numeric
(`major + minor/100`). Changing it alters the value handed to JS, so it is your call.

**B. `throw new Error(…)` on missing build output** — `social-share-block.php:35`

An uncaught `Error` on `init` white-screens the whole site if `dist/` was not built.
*Recommendation:* replace with an `admin_notices` warning and an early `return`.
Not done — it changes the failure behaviour users see.

**C. `block.json` has no `apiVersion`** — the block registers as API **v1**

v2 arrived in WP 5.6, v3 in WP 6.3. Moving to v2/v3 changes the editor wrapper
markup (`useBlockProps`) and would require matching `src/edit.js` / `src/save.js`
changes plus a rebuild, and would invalidate existing saved block markup.
*Recommendation:* schedule as its own task, not part of a compatibility pass.

**D. Share URLs are not URL-encoded** — `helpers.php:110-133` — **RESOLVED**

Fixed in the functional bug pass (see §11). Both interpolated values now go through
`rawurlencode()`.

**E. Dead branch at `helpers.php:137`** — see §5, awaiting a remove / keep /
keep-with-comment decision.

---

## 8. Old-vs-new conflicts

None. Nothing in the plugin needed a construct that PHP 7.4 lacks or that PHP 8.5
rejects, and no WordPress API in use was added after 6.0 or removed before 7.0.
`str_contains()` is the only near-miss, and WP core's polyfill (5.9+) covers it
comfortably below the 6.0 floor.

No new compatibility shims were written — under a 7.4 / 6.0 floor, `??`,
short arrays, typed properties and `array_key_first/last` are all safe outright.
The guards added above are null/existence checks, not version shims.

---

## 9. Final declared compatibility range

| Field | Main plugin file | readme.txt |
|---|---|---|
| `Requires PHP` | 7.4 | 7.4 |
| `Requires at least` | 6.0 | 6.0 |
| `Tested up to` | 7.0 | 7.0 |
| `Version` / `Stable tag` | 2.5.0 | 2.5.0 |

`package.json` version and `SOCIAL_SHARE_BLOCKS_VERSION` are both in sync at 2.5.0.
There is no `composer.json` in this plugin.

---

## 10. Verification

**`php -l` — full sweep, PHP 8.5.8 (CLI), all files, `node_modules` excluded:**

```
No syntax errors detected in ./social-share-block.php
No syntax errors detected in ./dist/index.asset.php
No syntax errors detected in ./dist/frontend.asset.php
No syntax errors detected in ./dist/modules.asset.php
No syntax errors detected in ./includes/post-meta.php
No syntax errors detected in ./includes/font-loader.php
No syntax errors detected in ./includes/helpers.php
No syntax errors detected in ./dist/frontend/index.asset.php
```

**phpcs:** not installed on this machine (`phpcs: command not found`). Skipped — no
global tooling was installed. Run `phpcs --standard=WordPress` against
`social-share-block.php` and `includes/` if WPCS is available in your environment.

**Not verified:** no runtime testing was performed against a live WordPress install
on any version in the range. All findings are static.

**Git state:** work is on branch `social-share-block-dev`, created from `master`
(which already contained everything on `latest`). Nothing committed, nothing pushed.

---

## 11. Functional bug pass — frontend broken + admin issues

Separate investigation, same branch. Scope: why the block renders wrong on the frontend
and what is degraded in the editor.

### 11.1 Root cause of the broken frontend

**The `lib/style-handler` git submodule was never initialised in this checkout.**

Nearly all of this block's CSS is *generated*, not shipped:

1. `src/style.js` builds desktop/tab/mobile CSS strings from the block attributes.
2. `StyleComponent` (from the `controls` package) stores them in the **`blockMeta`**
   block attribute and renders a `<style>` tag **in the editor only**.
3. On the frontend, `EbStyleHandler` (`lib/style-handler/style-handler.php`) parses
   `blockMeta` out of the saved post content, writes
   `wp-content/uploads/eb-style/eb-style-<postID>.min.css`, and enqueues it on
   `wp_enqueue_scripts`.

Step 3 never happened, because the file did not exist. `dist/style.css` — the only
stylesheet that *did* load — contains nothing but the brand background colours and
`.social-icon{font-style:normal}`. Every rule for layout, flex direction, alignment,
icon size, padding, margin, gap, border, shadow, hover state, floating-bar positioning
and all responsive behaviour lives in the generated file. Without it the block renders
as a plain vertical bulleted list with black boxes.

This is the same **Critical** item as §4 #1. Before the compatibility pass the
unconditional `require_once` made it a hard fatal; the `file_exists()` guard stopped the
fatal but left the block silently unstyled — which is the reported symptom.

*Fixed by* `git submodule update --init --recursive` (both `controls` and
`lib/style-handler` are now populated), plus an `admin_notices` warning so a build
packaged without the submodule fails loudly instead of silently.

### 11.2 Other frontend defects

| # | File:line | Defect | Effect |
|---|---|---|---|
| F2 | `social-share-block.php` render callback | Missing space between `eb-parent-<blockId>` and `<classHook>`, so they concatenated into one bogus class. The editor emits them space-separated. | `.eb-parent-<blockId>` never matched on the frontend. Broke the generated animation CSS (`body:not(.wp-admin) .eb-parent-<id>.eb_animation{…}`) and any custom class added via `classHook`. Editor/frontend divergence. |
| F3 | `social-share-block.php` | `wp_enqueue_style('essential-blocks-hover-css', …, ['wp-editor'])` ran unconditionally on `init` | Loaded hover CSS **and the entire block-editor stylesheet** on every frontend page of the site, block present or not. |
| F4 | `src/style.js:303` | Hardcoded block id `eb-social-share-qier2p8` in the floating-mode rule that suppresses the entry animation | Rule matched exactly one developer's local block and nobody else's. Floating share bars kept animating when they should not. |
| F5 | `helpers.php` | `$post_title` / `$post_link` interpolated raw into share query strings | A title containing `&`, `?`, `#` or `%` truncated the shared text on X, LinkedIn, Reddit, WhatsApp, Telegram and `mailto:`. |
| F6 | `social-share-block.php` | `wp_kses_data( get_block_wrapper_attributes() )` | Wrong helper for an already-escaped attribute string. |

### 11.3 Root cause of the admin/editor issues

**`EssentialBlocksLocalize` was missing keys the bundled controls package requires.**
PHP localized only `eb_wp_version` and `rest_rootURL`.

| Missing key | Consumer | Effect |
|---|---|---|
| `fontAwesome` | `controls/src/controls/icon-picker/index.js:5` — `EssentialBlocksLocalize.fontAwesome == "true"` | `undefined` → **Font Awesome disabled in the icon picker**, and `disableFontAwesome:true` blanks any existing `fab fa-*` value. Every social profile showed an empty icon in the editor. This block's entire default set is Font Awesome, so it hit every user. |
| `responsiveBreakpoints` | `controls/src/helpers/StyleComponent.js:57,64` | Emitted `@media all and (max-width: undefinedpx)` → **all tablet and mobile rules invalid in the editor preview**. Responsive preview simply did nothing. |
| `googleFont` | typography font picker `isDisabled` | Inert today (`"false" === undefined` is false) but fragile. |
| `image_url` | `src/index.js` inserter `example.cover` | Resolved to `undefined/block-preview/social-share.jpg` → broken image as the block's inserter preview. |

Note the frontend reads breakpoints from `get_option('eb_settings')['responsiveBreakpoints']`
(default 1024/767) via `EbStyleHandlerParseCss`. The new PHP helper mirrors that exactly,
so editor and frontend media queries now agree.

### 11.4 Fixes applied

| Ref | Fix |
|---|---|
| 11.1 | Submodules initialised; `admin_notices` error when `style-handler.php` is absent |
| F2 | Space restored between `eb-parent-<blockId>` and `classHook`, matching the editor |
| F3 | `wp_enqueue_style` → `wp_register_style`, `wp-editor` dependency dropped. Both the editor style and the frontend style already list this handle as a dependency, so it still loads exactly where the block or editor needs it — just no longer site-wide |
| F4 | Hardcoded id replaced with the live `${blockId}` |
| F5 | `rawurlencode()` on title and permalink |
| F6 | `wp_kses_data()` removed; core already escapes `get_block_wrapper_attributes()` |
| 11.3 | `fontAwesome`, `googleFont`, `responsiveBreakpoints` added to the localize array; new `Social_Share_Helper::get_responsive_breakpoints()` mirrors the style handler's option read |
| 11.3 | `src/index.js` now uses the existing-but-unimported `src/example.js`, so the inserter preview renders the real block instead of a missing image. `image_url` deliberately not added — its only consumer is gone and this plugin ships no `assets/images` |

`dist/index.js` + `dist/index.asset.php` rebuilt via `npm run build` (webpack 5.77,
compiled successfully). `dist/modules.js`, `dist/style.css` and `dist/frontend/index.js`
are byte-identical — no controls source changed, so nothing else needed regenerating.

### 11.5 Build issues found

- `npm install` **fails out of the box**: `react-sortable-hoc@2` (used by the profile
  reorder UI) declares a `react ^16 || ^17` peer while the `@wordpress/*` packages need
  react 18. Fixed with an `.npmrc` setting `legacy-peer-deps=true`.
- `webpack.config.js` requires `mini-css-extract-plugin`, which was never a declared
  dependency — it only resolved transitively through `@wordpress/scripts`. Now declared.
- The root build does **not** produce `dist/modules.js`, `dist/modules.css` or
  `dist/style-modules.css`. Those come from `controls/webpack.config.js` (global name
  `EBSocialShareControls`, from `config/controlname.json`). **Still unresolved:** building
  the `controls` submodule fails — after `npm install`, webpack dies with
  `MODULE_NOT_FOUND` for `ajv` inside `ajv-keywords`. That is dependency rot inside the
  `controls` repo and cannot be fixed from this plugin. A `build:controls` script was
  written and then removed rather than ship a command that errors. **`dist/modules.js`
  currently cannot be regenerated** — it is a committed artifact only.

### 11.6 Flagged, not fixed

- **`react-sortable-hoc` is unmaintained** (last release 2020) and relies on
  `findDOMNode`, which React 19 removes. WordPress is moving toward React 19; when it
  lands, the drag-to-reorder profile list in the inspector will break. Replacing it is a
  feature-level change, not a bug fix.
- **`DOMNodeInserted`** in `assets/js/eb-animation-load.js` — mutation events were removed
  in Chrome 127 (2024), so that admin listener is dead code on current browsers. It only
  affects live animation preview in the editor.
- Items A, B, C and E from §7 are unchanged and still awaiting a decision.

### 11.7 Verification

- `php -l` clean across all plugin PHP files on PHP 8.5.8.
- `npm run build` — webpack compiled successfully; verified the hardcoded block id and the
  broken preview-cover URL are gone from `dist/index.js`, and that the emitted selector is
  now built from the live block id.
- Render callback exercised through a stubbed harness on PHP 8.5 with `E_ALL`: correct
  class output (space restored, animation classes intact), floating + circular modifiers
  correct, and **no warnings or deprecations** for a null `$post`, a missing `blockId`, a
  missing `icon` key or an unrecognised network.
- Share-URL generation verified against a faithful port of `esc_url()`'s display-context
  behaviour: `&`, `?`, `#`, `%` and `:` are now percent-encoded inside parameter values
  while real separators are preserved.
- **Not done: no browser testing in the WordPress admin or on the frontend.** The Local
  site (`eb-plugin-imp.local`) is not running — its database is down and the site returns
  no response — so the editor and frontend were never loaded. Every finding above is from
  static analysis plus the harnesses described. This is the main outstanding gap.

---

## 12. Floating layout — only 3 of 6 items visible

**Verdict: a bug, not an intentional limitation.** Two defects compounding.

### 12.1 The "Floating Height" control was never wired up

`src/inspector.js:356-371` renders a **Floating Height** `ResponsiveRangeController`
(`min=0, max=2000, step=1`) and `src/style.js` reads it via
`generateResponsiveRangeStyles({ controlName: rangeFloatingHeight })`.

But `src/attributes.js` **never registered those attributes**. It imported
`rangeFloatingWidth` and generated its responsive range attributes, and simply omitted
`rangeFloatingHeight`. Confirmed in the shipped bundle: the `"floatingWidth"` constant
appeared in four places (definition, attribute generation, inspector control, style
generator) while `"floatingHeight"` appeared in only three — the attribute-generation
call was missing.

Consequence: Gutenberg drops values for unregistered attributes, so the control could
never persist anything. `floatingHeightDesktop/Tab/Mobile` were always empty strings and
the style generator always took its hardcoded fallback branch.

The `max={2000}` ceiling on the control is direct evidence the 200px was never meant as a
cap — the UI advertises heights up to 2000px.

### 12.2 The fallback clipped the list with the scrollbar hidden

```css
.<blockId>.eb-social-share-wrapper.eb-social-share-floating ul.eb-social-shares {
    position: fixed; top: 35%; transform: translate(0, -50px);
    overflow: auto;
    -ms-overflow-style: none;   /* IE and Edge */
    scrollbar-width: none;      /* Firefox */
    max-height: 200px;          /* hardcoded fallback */
}
ul.eb-social-shares::-webkit-scrollbar { display: none; }
```

`max-height: 200px` + `overflow: auto` + the scrollbar hidden three different ways.
With stock defaults each item is about **56px** (16px text + 10/10 padding + 10/10 margin):

| | |
|---|---|
| 6 items | ~336px of content |
| old cap | 200px → **3.6 items** → 3 fully visible |

Items 4-6 were scrolled out of view with no scrollbar, so they read as missing rather
than clipped. That matches the report exactly.

### 12.3 Fixes

| File | Fix |
|---|---|
| `src/attributes.js` | Import `rangeFloatingHeight` and add `generateResponsiveRangeAttributes(rangeFloatingHeight, { noUnits: true })`, mirroring the width. Deliberately **no** `defaultRange` — unset now means "size to the viewport" rather than a fixed pixel height. The Floating Height control is functional for the first time. |
| `src/style.js` | The three `"200px"` fallbacks (desktop/tab/mobile) become `calc(65vh + 50px)`. The list is fixed at `top:35%` shifted up 50px, so `65vh + 50px` is exactly the space between its top edge and the bottom of the viewport — the largest value that cannot run off-screen. |

Resulting default capacity, still scrolling only when the list genuinely exceeds the
viewport:

| Viewport height | Cap | Items |
|---|---|---|
| 1080px | 752px | ~13 |
| 900px | 635px | ~11 |
| 768px | 549px | ~9 |
| 667px | 484px | ~8 |

Six items now fit on every common screen size, and an explicit Floating Height still
overrides the fallback.

### 12.4 Verification

- `npm run build` — webpack compiled successfully; `dist/index.js` + `dist/index.asset.php`
  are the only changed artifacts.
- Bundle inspected: `"floatingHeight"` now has the same **four** usages as
  `"floatingWidth"`, including the previously missing attribute-generation call.
- No `200px` literal remains anywhere in `dist/index.js`; `calc(65vh + 50px)` is present.
- **Not browser-tested** — the Local site is still down. See §11.7.

### 12.5 Important: existing posts must be re-saved

`blockMeta` (the generated CSS) is serialised into **post content** and is only recomputed
by `StyleComponent` while the block is open in the editor. The frontend style handler just
reads whatever `blockMeta` was saved. So an already-published post keeps its old
`max-height:200px` CSS until the post is opened in the editor and updated. Rebuilding the
plugin alone does not retro-fix existing content.

### 12.6 Flagged, not fixed

- The scrollbar is hidden by three separate rules. With the new cap it should rarely
  engage, but when a list does overflow there is still no visual affordance that more
  items exist. Making it visible is a design decision.
- `ul.eb-social-shares::-webkit-scrollbar { display: none; }` is written **unscoped** —
  no `blockId` prefix — inside per-block generated CSS, so it leaks to every social-share
  list on the page. Harmless today (the rule is identical for every instance) but wrong.

---

## 13. Style tab → "Size" control had no effect

**Verdict: a bug.** The inspector advertises the control unconditionally; the style
generator only honoured it in two narrow cases, neither of which is the default.

### 13.1 Cause

`src/inspector.js:290-301` renders the **Size** `ResponsiveRangeController`
(`rangeIconSize`, `min=5, max=300`) with **no condition** on it. Note the contrast with the
Typography control immediately above it at line 275, which *is* wrapped in `{showTitle && …}`.

`src/style.js` then referenced `iconSize` in only three places, every one of them gated:

| Where | Rule | Gate |
|---|---|---|
| `li a` | `font-size: <iconSize>` | only on the `!showTitle` branch of `${showTitle ? titleTypography : …}` |
| `.eb-social-share-icon` | `width` | selector requires `.eb-social-share-floating` |
| `.eb-social-share-icon` | `width`, `height` | wrapped in `${!showTitle ? … : ""}` |

Block defaults are `showTitle: true` and `isFloating: false`. In that configuration — the
out-of-the-box state — **not one of the three rules applies**, so moving the Size slider
changed nothing.

It was worse than a no-op. With `showTitle` on, the icon took its size by *inheritance*
from `li a`, which carries the **Title typography**. And `generateTypographyStyles` only
emits `font-size` when the user has explicitly set one (`hasVal(fontSize)`), so on a stock
block `li a` had no font-size at all and the icons simply rendered at whatever the theme
inherited. The icon glyph was effectively controlled by the *label's* typography control,
never by the control literally labelled "Size".

### 13.2 Fix

`src/style.js` — one unconditional rule added per breakpoint, immediately before the
existing `!showTitle` block:

```css
.<blockId>.eb-social-share-wrapper ul.eb-social-shares li a .eb-social-share-icon {
    font-size: <iconSize>;
}
```

The icons are icon-font glyphs (Font Awesome `<i>`, or a dashicon `<span>`), so `font-size`
is the property that scales them. Setting it **directly on the icon** rather than on the
anchor also decouples the two concerns cleanly:

- **Size** → the icon glyph
- **Title typography** → the `.eb-social-share-text` label, still via `li a`

A directly-set property always beats an inherited one, so this holds regardless of what the
typography control emits.

Deliberately left alone: the `width`/`height` rules stay gated on `!showTitle`. Those exist
to force a square box for the circular shape; applying them unconditionally would change
layout for title-bearing blocks, which is not what was reported.

### 13.3 Cascade check

Nothing competes for `font-size` on `.eb-social-share-icon`:

- The floating rule uses a higher-specificity selector but sets only `width` / `text-align`.
- The `!showTitle` rule shares this selector but sets only `width` / `height` / `text-align`.
- Font Awesome 6.5.1 does not set `font-size` on `.fa` / `.fab` / `.fas` / `.far`.
- `hover-min.css` does not set `font-size` on `.hvr-icon`.
- `dist/style.css` never mentions `.eb-social-share-icon`.

### 13.4 Verification

- `npm run build` — compiled successfully; `dist/index.js` + `dist/index.asset.php` only.
- Bundle inspected: the unconditional icon `font-size` rule is emitted **3 times**
  (desktop / tab / mobile), each built from the live `blockId` and the responsive size value.
- **Not browser-tested** — the Local site is still down. See §11.7.

### 13.5 Behaviour change worth knowing

On a block where the user had set an explicit **Title font size**, the icon previously
inherited that value. It now follows **Size** (default 16px) instead. That is the intended
separation and the only way the Size control can work, but such blocks will render icons at
a different size than before. Blocks on default typography are unaffected.

As in §12.5, existing posts keep their old generated CSS until reopened and updated in the
editor.
