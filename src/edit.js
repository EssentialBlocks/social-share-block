/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { useEffect } from "@wordpress/element";
import { useBlockProps } from "@wordpress/block-editor";

/**
 * Internal dependencies
 */

import SocialLinks from "./components/social-links";
import blockAttributes from "./attributes";

const {
	duplicateBlockIdFix,
	EBDisplayIcon,
	withBlockContext
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
		// The key must be `blockPrefix`. `duplicateBlockIdFix` renamed this parameter from
		// `BLOCK_PREFIX` and this call site was never updated, so the helper read `undefined`
		// and every block was assigned the id "undefined-<random>" — which then landed in the
		// markup, the generated CSS selectors and the saved post content.
		duplicateBlockIdFix({
			blockPrefix: "eb-social-share",
			blockId,
			setAttributes,
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

/**
 * The controls in the Inspector are context-driven: `ResponsiveRangeController`,
 * `ResponsiveDimensionsControl`, `ColorControl`, `TypographyDropdown`,
 * `BorderShadowControl`, `BackgroundControl` and `AdvancedControls` all read through
 * `useBlockAttributes()` and write through `useBlockSetAttributes()`. Neither hook takes a
 * prop -- they read a React context that only this HOC provides.
 *
 * Without it `useBlockSetAttributes()` resolves to DEFAULT_SET_ATTRIBUTES_CONTEXT, which is
 * `() => {}`, so every slider and colour swatch in the Style tab moved on screen and threw
 * the value away. The `resRequiredProps` object the Inspector still passes is the older API
 * these controls no longer accept, and was silently ignored.
 *
 * The argument is the registered attribute definitions: controls read
 * `objAttributes[name].default` through `useBlockDefaultAttributes()` to implement "reset".
 */
export default withBlockContext(blockAttributes)(Edit);
