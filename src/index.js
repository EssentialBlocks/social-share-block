import { registerBlockType } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
import "./style.scss";

import Edit from "./edit";
import save from "./save";

registerBlockType("block/social", {
	title: __("Social", "block"),
	description: __("", "block"),
	category: "widgets",
	edit: Edit,
	save,
});
