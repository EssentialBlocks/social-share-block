/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { SocialShareIcon } from "./icon";
import Edit from "./edit";
import attributes from "./attributes";
import example from "./example";
import "./style.scss";

import metadata from "../block.json";
const { ebConditionalRegisterBlockType } = EBSocialShareControls;

ebConditionalRegisterBlockType(metadata, {
    icon: SocialShareIcon,
    attributes,
    keywords: [
        __("social share", "essential-blocks"),
        __("icons", "essential-blocks"),
        __("eb essential", "essential-blocks"),
    ],
    edit: Edit,
    save: () => null,
    // Renders the real block as the inserter preview. The previous inline `example` pointed
    // `cover` at a block-preview image this plugin does not ship, which resolved to
    // "undefined/block-preview/social-share.jpg" and showed a broken image instead.
    example,
});
