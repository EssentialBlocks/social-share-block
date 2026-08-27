/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { useEffect } from "@wordpress/element";
import { useBlockProps } from "@wordpress/block-editor";
import { select } from "@wordpress/data";

/**
 * Internal dependencies
 */

import SocialLinks from "./components/social-links";

const {
	duplicateBlockIdFix,
	EBDisplayIcon
} = window.EBSocialShareControls;

import classnames from "classnames";
import Inspector from "./inspector";
import Style from "./style";

function Edit(props) {
	const {
		attributes,
		setAttributes,
		className,
		clientId,
		isSelected,
		name
	} = props;
	const {
		resOption,
		blockId,
		blockMeta,
		socialDetails,
		profilesOnly = [],
		icnEffect,
		classHook,
		showTitle,
		iconShape,
		isFloating,
		cover
	} = attributes;

	//
	useEffect(() => {
		const newProfiles = socialDetails.map((profile) => ({
			...profile,
			isExpanded: false,
		}));

		setAttributes({ socialDetails: newProfiles });

		if (socialDetails.length > 0) return;

		const newSclDtails = [
			{
				icon: "fab fa-facebook-f",
				iconText: __("Facebook", "essential-blocks"),
				isExpanded: false,
			},
			{
				icon: "fab fa-x-twitter",
				iconText: __("Twitter", "essential-blocks"),
				isExpanded: false,
			},
			{
				icon: "fab fa-linkedin-in",
				iconText: __("Linkedin", "essential-blocks"),
				isExpanded: false,
			},
			{
				icon: "fab fa-whatsapp",
				iconText: __("WhatsApp", "essential-blocks"),
				isExpanded: false,
			},
		];

		setAttributes({ socialDetails: newSclDtails });
	}, []);

	//
	useEffect(() => {
		// `profilesOnly` is the attribute the PHP render callback reads, so every key the
		// frontend needs has to be projected here -- `linkOpenNewTab` was previously dropped.
		const profilesOnly = socialDetails.map(
			({ icon, link, iconText, linkOpenNewTab }) => ({
				icon,
				link,
				iconText,
				linkOpenNewTab,
			})
		);

		setAttributes({ profilesOnly });
	}, [socialDetails]);

	// this useEffect is for creating a unique blockId for each block's unique className
	useEffect(() => {
		/**
		 * `duplicateBlockIdFix` in the pinned controls build takes `BLOCK_PREFIX` (not
		 * `blockPrefix`) and finds duplicates through `select("core/block-editor").getBlocks()`,
		 * so it needs the store's `select` handed to it. Miss either one and the block dies on
		 * mount: without `select` the helper calls `undefined("core/block-editor")` inside this
		 * effect, which surfaces as "This block has encountered an error and cannot be
		 * previewed."; without `BLOCK_PREFIX` every block is assigned the id
		 * "undefined-<random>", which then lands in the markup, the generated CSS selectors and
		 * the saved post content.
		 */
		duplicateBlockIdFix({
			BLOCK_PREFIX: "eb-social-share",
			blockId,
			setAttributes,
			select,
			clientId,
		});
	}, []);

	const blockProps = useBlockProps({
		className: classnames(className, `eb-guten-block-main-parent-wrapper`),
	});

	return cover.length ? (
		<div>
			<img src={cover} alt="table of content" style={{ maxWidth: "100%" }} />
		</div>
	) : (
		<>
			{isSelected && (
				<Inspector
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			)}
			<div {...blockProps}>
				<Style {...props} />

				<div
					className={`eb-parent-wrapper eb-parent-${blockId} ${classHook}`}
				>
					<div
						className={`${blockId} eb-social-share-wrapper${isFloating ? " eb-social-share-floating" : ""
							}${isFloating && "circular" == iconShape
								? " eb-social-share-circular"
								: ""
							}`}
					>
						<SocialLinks
							profilesOnly={profilesOnly}
							icnEffect={icnEffect}
							showTitle={showTitle}
						/>
					</div>
				</div>
			</div>
		</>
	);
}

export default Edit;
