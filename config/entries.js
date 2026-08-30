/**
 * Controls bundle for the Social Share block.
 *
 * This file is the entry point the shared `controls` submodule builds into
 * `dist/modules.js`, which is exposed on `window.EBSocialShareControls`.
 *
 * Only the controls and helpers this block actually consumes are exported.
 * Nothing here may reach `controls/src/index.js` — that barrel re-exports every
 * control in Essential Blocks (query loops, AI image generation, the template
 * browser, the image component, ...), and because the package does not declare
 * `sideEffects: false` webpack cannot tree-shake any of it back out. Importing a
 * single name from it costs ~550 KB of unrelated controls in the bundle.
 */

import "../controls/src/backend.scss";

//Controls used by src/inspector.js, src/shareButtons.js and src/components/social-links.js
export { default as ResponsiveDimensionsControl } from "../controls/src/controls/dimensions-control-v2";
export { default as TypographyDropdown } from "../controls/src/controls/typography-control-v2";
export { default as ColorControl } from "../controls/src/controls/color-control";
export { default as BorderShadowControl } from "../controls/src/controls/border-shadow-control";
export { default as BackgroundControl } from "../controls/src/controls/background-control";
export { default as ResponsiveRangeController } from "../controls/src/controls/responsive-range-control";
export { EBIconPicker, EBDisplayIcon } from "../controls/src/controls/icon-picker";

//Registers the shared `blocks.registerBlockType` / `editor.BlockEdit` filters the Advanced tab reads
import "../controls/src/group-controls";
export { default as AdvancedControls } from "../controls/src/group-controls/components/advanced-controls";

//Helper functions used by src/attributes.js, src/style.js, src/edit.js and src/index.js
export {
	softMinifyCssStrings,
	generateTypographyStyles,
	generateDimensionsControlStyles,
	generateBorderShadowStyles,
	generateBackgroundControlStyles,
	generateResponsiveRangeStyles,
	duplicateBlockIdFix,
	generateTypographyAttributes,
	generateDimensionsAttributes,
	generateBackgroundAttributes,
	generateBorderShadowAttributes,
	generateResponsiveRangeAttributes,
	ebConditionalRegisterBlockType,
	StyleComponent
} from "../controls/src/helpers";
