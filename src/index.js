import { registerBlockType } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
import "./style.scss";

import Edit from "./edit";
import save from "./save";
import icon from "./icon";
import attributes from "./attributes";

registerBlockType("block/social-share-block", {
	title: __("Social", "block"),
	description: __(
		"Enable one-click social sharing option to grow your audience",
		"block"
	),
	category: "widgets",
	icon,
	attributes,
	supports: {
		align: true,
	},
	edit: Edit,
	save,
});
