import {
    rangeIconSize,
    rangeIconDistance,
    rangeIconRowGap,
    sclDeviderPosRight,
    rangeIconMargin,
    rangeIconHeight,
    rangeIconWidth,
    rangeFloatingWidth,
    rangeFloatingHeight,
} from "./constants/rangeNames";

import {
    iconsPadding,
    tmbWrapMarginConst,
    tmbWrapPaddingConst,
} from "./constants/dimensionsConstants";

import { WrpBgConst } from "./constants/backgroundsConstants";

import { TITLE_TYPOGRAPHY } from "./constants/typographyPrefixConstants";

import {
    WrpBdShadowConst,
    prefixSocialBdShadow,
} from "./constants/borderShadowConstants";

const {
    softMinifyCssStrings,
    generateBackgroundControlStyles,
    generateDimensionsControlStyles,
    generateBorderShadowStyles,
    generateResponsiveRangeStyles,
    generateTypographyStyles,
    StyleComponent
} = window.EBSocialShareControls;

export default function Style(props) {
    const { attributes, setAttributes, name } = props;
    const {
        resOption,
        blockId,
        blockMeta,
        socialDetails,
        iconsJustify,
        iconsVAlign,
        isIconsDevider,
        icnsDevideColor = "#cacaca",
        icnSepW = 1,
        icnSepH = 30,
        hvIcnColor,
        hvIcnBgc,
        textShadowColor,
        textHOffset,
        textVOffset,
        blurRadius,
        classHook,
        showTitle,
        iconShape,
        isFloating,
    } = attributes;

    //
    // styling codes start from here
    //

    /**
     * "Size" (Style tab). Applied as `font-size` straight onto `.eb-social-share-icon` at
     * every breakpoint, unconditionally — the icons are icon-font glyphs, so font-size is
     * what scales them.
     *
     * It used to reach the icon only via `li a`, and only on the `!showTitle` branch, so with
     * titles on (the default) the control did nothing at all. Titles are still sized by the
     * Title typography control on `li a`; setting font-size directly on the icon keeps the
     * two independent instead of letting the label's typography drive the glyph.
     */
    const {
        rangeStylesDesktop: iconSizeDesktop,
        rangeStylesTab: iconSizeTab,
        rangeStylesMobile: iconSizeMobile,
    } = generateResponsiveRangeStyles({
        controlName: rangeIconSize,
        customUnit: "px",
        property: null,
        attributes,
    });

    const {
        rangeStylesDesktop: iconMarginDesktop,
        rangeStylesTab: iconMarginTab,
        rangeStylesMobile: iconMarginMobile,
    } = generateResponsiveRangeStyles({
        controlName: rangeIconMargin,
        customUnit: "px",
        property: null,
        attributes,
    });

    const {
        rangeStylesDesktop: iconHeightDesktop,
        rangeStylesTab: iconHeightTab,
        rangeStylesMobile: iconHeightMobile,
    } = generateResponsiveRangeStyles({
        controlName: rangeIconHeight,
        customUnit: "px",
        property: null,
        attributes,
    });

    const {
        rangeStylesDesktop: iconWidthDesktop,
        rangeStylesTab: iconWidthTab,
        rangeStylesMobile: iconWidthMobile,
    } = generateResponsiveRangeStyles({
        controlName: rangeIconWidth,
        customUnit: "px",
        property: null,
        attributes,
    });

    const {
        rangeStylesDesktop: floatingWidthDesktop,
        rangeStylesTab: floatingWidthTab,
        rangeStylesMobile: floatingWidthMobile,
    } = generateResponsiveRangeStyles({
        controlName: rangeFloatingWidth,
        customUnit: "px",
        property: null,
        attributes,
    });

    /**
     * Floating Height. When unset these come back empty and the floating list falls back to
     * `calc(65vh + 50px)` below — the list is fixed at top:35% shifted up 50px, so that is
     * exactly the room between its top edge and the bottom of the viewport. Every configured
     * item stays visible, and it still scrolls rather than running off-screen once the list
     * genuinely outgrows the viewport. The old hardcoded 200px fallback clipped everything
     * past roughly three items, with the scrollbar hidden so there was no sign of it.
     */
    const {
        rangeStylesDesktop: floatingHeightDesktop,
        rangeStylesTab: floatingHeightTab,
        rangeStylesMobile: floatingHeightMobile,
    } = generateResponsiveRangeStyles({
        controlName: rangeFloatingHeight,
        customUnit: "px",
        property: null,
        attributes,
    });

    const {
        rangeStylesDesktop: iconSpaceDesktop,
        rangeStylesTab: iconSpaceTab,
        rangeStylesMobile: iconSpaceMobile,
    } = generateResponsiveRangeStyles({
        controlName: rangeIconDistance,
        customUnit: "px",
        property: "column-gap",
        attributes,
    });

    const {
        rangeStylesDesktop: iconRowGapDesktop,
        rangeStylesTab: iconRowGapTab,
        rangeStylesMobile: iconRowGapMobile,
    } = generateResponsiveRangeStyles({
        controlName: rangeIconRowGap,
        customUnit: "px",
        property: "row-gap",
        attributes,
    });

    const {
        rangeStylesDesktop: sSepPosRightDesktop,
        rangeStylesTab: sSepPosRightTab,
        rangeStylesMobile: sSepPosRightMobile,
    } = generateResponsiveRangeStyles({
        controlName: sclDeviderPosRight,
        property: "margin-right",
        attributes,
    });

    // styles related to generateResponsiveRangeStyles end

    // styles related to generateBackgroundControlStyles start ⬇

    const {
        backgroundStylesDesktop: wrpBackgroundStylesDesktop,
        hoverBackgroundStylesDesktop: wrpHoverBackgroundStylesDesktop,
        backgroundStylesTab: wrpBackgroundStylesTab,
        hoverBackgroundStylesTab: wrpHoverBackgroundStylesTab,
        backgroundStylesMobile: wrpBackgroundStylesMobile,
        hoverBackgroundStylesMobile: wrpHoverBackgroundStylesMobile,
        overlayStylesDesktop: wrpOverlayStylesDesktop,
        hoverOverlayStylesDesktop: wrpHoverOverlayStylesDesktop,
        overlayStylesTab: wrpOverlayStylesTab,
        hoverOverlayStylesTab: wrpHoverOverlayStylesTab,
        overlayStylesMobile: wrpOverlayStylesMobile,
        hoverOverlayStylesMobile: wrpHoverOverlayStylesMobile,
        bgTransitionStyle: wrpBgTransitionStyle,
        ovlTransitionStyle: wrpOvlTransitionStyle,
    } = generateBackgroundControlStyles({
        attributes,
        controlName: WrpBgConst,
    });

    // styles related to generateBackgroundControlStyles end

    // styles related to generateDimensionsControlStyles start ⬇
    // icon padding
    const {
        dimensionStylesDesktop: iconPaddingDesktop,
        dimensionStylesTab: iconPaddingTab,
        dimensionStylesMobile: iconPaddingMobile,
    } = generateDimensionsControlStyles({
        attributes,
        controlName: iconsPadding,
        styleFor: "padding",
    });

    const {
        dimensionStylesDesktop: wrpMarginDesktop,
        dimensionStylesTab: wrpMarginTab,
        dimensionStylesMobile: wrpMarginMobile,
    } = generateDimensionsControlStyles({
        attributes,
        controlName: tmbWrapMarginConst,
        styleFor: "margin",
    });

    const {
        dimensionStylesDesktop: wrpPaddingDesktop,
        dimensionStylesTab: wrpPaddingTab,
        dimensionStylesMobile: wrpPaddingMobile,
    } = generateDimensionsControlStyles({
        attributes,
        controlName: tmbWrapPaddingConst,
        styleFor: "padding",
    });

    // styles related to generateDimensionsControlStyles end

    // styles related to generateBorderShadowStyles start ⬇
    const {
        styesDesktop: wrpBdShdStyesDesktop,
        styesTab: wrpBdShdStyesTab,
        styesMobile: wrpBdShdStyesMobile,
        stylesHoverDesktop: wrpBdShdStylesHoverDesktop,
        stylesHoverTab: wrpBdShdStylesHoverTab,
        stylesHoverMobile: wrpBdShdStylesHoverMobile,
        transitionStyle: wrpBdShdTransitionStyle,
    } = generateBorderShadowStyles({
        controlName: WrpBdShadowConst,
        attributes,
        // noShadow: true,
        // noBorder: true,
    });

    const {
        styesDesktop: socialBdrShdwDesktop,
        styesTab: socialBdrShdwTab,
        styesMobile: socialBdrShdwMobile,
        stylesHoverDesktop: socialBdrShdwsHoverDesktop,
        stylesHoverTab: socialBdrShdwsHoverTab,
        stylesHoverMobile: socialBdrShdwsHoverMobile,
        transitionStyle: socialBdrShdwTransitionStyle,
    } = generateBorderShadowStyles({
        controlName: prefixSocialBdShadow,
        attributes,
        // noShadow: true,
        // noBorder: true,
    });

    const {
        typoStylesDesktop: titleTypographyDesktop,
        typoStylesTab: titleTypographyTab,
        typoStylesMobile: titleTypographyMobile,
    } = generateTypographyStyles({
        attributes,
        prefixConstant: TITLE_TYPOGRAPHY,
    });

    // styles related to generateBorderShadowStyles end

    /**
     * Per-item overrides for the shared divider colour.
     *
     * The divider is not an element -- it is the `:before` pseudo-element that the block-level
     * `isIconsDevider` rule below draws on every `li` that follows another one. This used to
     * target `a .social-icon-v-line`, a class that is not emitted by the editor preview
     * (src/components/social-links.js) or by the PHP render callback, so the rule matched
     * nothing and the Separator Color control had no effect anywhere.
     *
     * `li + li:nth-child(i + 2)` is the divider drawn immediately after item `i`, which is how
     * the control reads next to that item's own Icon/Background colours. The `li + li` prefix
     * makes it self-limiting: the first item has no divider before it, and the last item's
     * value simply matches nothing. It also raises specificity above the block-level rule
     * (0,4,4 vs 0,3,4), so the per-item colour wins regardless of the order the two are
     * emitted in.
     */
    const socialStyles = socialDetails.reduce(
        (acc, { backgroundColor, color, separatorColor }, i) => `
		${acc}

		${separatorColor
                ? `
				.${blockId}.eb-social-share-wrapper ul.eb-social-shares li + li:nth-child(${i + 2
                }):before {
					background-color: ${separatorColor};
				}
				`
                : ""
            }

		${backgroundColor || color
                ? `
				.${blockId}.eb-social-share-wrapper ul.eb-social-shares li:nth-child(${i + 1
                }) a {
					${backgroundColor ? `background: ${backgroundColor};` : ""}
					${color ? `color: ${color};` : ""}
				}
				`
                : ""
            }
		`,
        ""
    );

    /**
     * Floating-bar notes (all three breakpoints below follow the same rules):
     *
     * z-index — the bar is `position: fixed` but carried no stacking order, so it painted in
     * document order against every other positioned element on the page. Twenty Twenty-Five's
     * footer group (position: relative, z-index: auto, later in the DOM) covered the bar
     * outright and swallowed the pointer, so "mouseenter" never fired on the icons and no
     * label ever slid out. 999 sits above ordinary theme content and below the admin bar
     * (99999) and typical modal/consent overlays.
     *
     * Label sizing — the hover label is sized by its own content and revealed by animating
     * max-width, not width. Collapsing to `width: 0` and re-opening to a fixed pixel width
     * clipped every label longer than that width, and the ":before" separator eats a further
     * 21px of it, so "Facebook" and "WhatsApp" were cut off mid-word. max-width still
     * animates, while `width: max-content` keeps the drawer exactly as wide as its text.
     * "Floating Width" therefore acts as a cap rather than a forced width.
     *
     * Scroll-reveal animation — a floating bar must opt out of it entirely. When any
     * animation is picked, the shared controls emit
     * `body:not(.wp-admin) .eb-parent-<id>.eb_animation { visibility: hidden; opacity: 0 }`
     * and `eb-animation-load.js` only clears it by swapping `eb___animated` for
     * `eb__animated` once `isInViewport()` passes. That test reads the parent wrapper,
     * which for a floating bar is a zero-height box sitting at the block's position in
     * normal flow — usually far below the fold — while the bar itself is viewport-anchored
     * and should be on screen from the first paint. So the swap never fired, and the bar
     * stayed `visibility: hidden; opacity: 0` until the reader happened to scroll past the
     * block's document position, then faded in over the animation speed. Measured: still
     * invisible after 6s on load, revealed 641ms after a scroll to y=1000 and fully opaque
     * ~1.4s later. `body:not(.wp-admin)` is why the editor never showed this.
     *
     * The existing `animation-name: none` rule below only silenced the keyframes on the
     * already-swapped state, so it never reached the gate that precedes them. Overriding
     * the gate carries one more class than the generated rule and therefore wins on
     * specificity rather than source order.
     *
     * Background overlay (Advanced > Background > Enable Overlay) — two problems, both
     * only when floating. `generateBackgroundControlStyles` adds `position: relative;
     * z-index: 2` to its background output as soon as the overlay is switched on, so it
     * can host the `:before`. Injected into the floating list rule that lands *after*
     * `position: fixed; z-index: 999` and wins on source order, which quietly dropped the
     * bar out of fixed positioning and back into normal flow in the middle of the page.
     * The floating geometry is therefore re-asserted after the injected styles. The
     * overlay itself was also painted on `.eb-social-share-wrapper`, a full-width block
     * div rather than the bar, so the tint spanned the whole content column; when the bar
     * floats it now goes on the list, like every other relocated style. `position: fixed`
     * establishes a containing block just as `relative` does, so the inset-0 pseudo
     * element still resolves against the bar.
     *
     * Margin & padding (Advanced tab) — same relocation. Desktop gated them off with
     * `!isFloating` and emitted no replacement, while tab and mobile left them on the
     * wrapper ungated, so a floating bar got neither: the values were stored and then
     * dropped or applied to a zero-size box. They now ride along with the background
     * and border on `ul.eb-social-shares`, which is the box the reader actually sees.
     * Note the list carries a `margin:0; padding:0` reset from the shared
     * `div.eb-social-share-wrapper ul` rule; the relocated declarations sit on a
     * four-class selector and outrank it.
     *
     * Hover border & shadow — the normal border/shadow is relocated onto
     * `ul.eb-social-shares` when the bar floats, because the wrapper collapses to a
     * zero-size box once its only child is `position: fixed`. The hover half was never
     * relocated with it: desktop gated it off with `!isFloating` and emitted no
     * replacement, while tab and mobile left it on the wrapper ungated. Either way every
     * value from Advanced > Border & Shadow > Hover was computed, stored in `blockMeta`
     * and then dropped or aimed at an invisible element. Hover has to land on whichever
     * element carries the normal border, so each breakpoint now emits a floating-only
     * `ul.eb-social-shares:hover` rule and keeps `.wrapper:hover` for the non-floating
     * case. The floating list also picks up the transition the wrapper already had, so
     * the hover change eases in instead of snapping.
     */
    const wrapperStylesDesktop = `
	div.eb-social-share-wrapper ul {
		margin: 0;
		padding:0;
	}

	${isFloating
            ? `
	body:not(.wp-admin) .eb-parent-wrapper.eb-parent-${blockId}.eb_animation {
		visibility: visible;
		opacity: 1;
	}

	.eb-parent-wrapper.eb-parent-${blockId}.eb_animation.eb__animated {
		animation-name: none !important;
		-webkit-animation-name: none !important;
	}
	`
            : ""
        }

	.${blockId}.eb-social-share-wrapper {
		position:relative;
		${!isFloating ? wrpBackgroundStylesDesktop : ""}
		${!isFloating ? wrpMarginDesktop : ""}
		${!isFloating ? wrpPaddingDesktop : ""}
		${!isFloating ? wrpBdShdStyesDesktop : ""}
		transition: ${wrpBgTransitionStyle}, ${wrpBdShdTransitionStyle};
	}

	.${blockId}.eb-social-share-wrapper:hover{

		${wrpHoverBackgroundStylesDesktop}
		${!isFloating ? wrpBdShdStylesHoverDesktop : ""}
	}

	${!isFloating
            ? `
	.${blockId}.eb-social-share-wrapper:before{
		${wrpOverlayStylesDesktop}
		transition: ${wrpOvlTransitionStyle};
	}

	.${blockId}.eb-social-share-wrapper:hover:before{
		${wrpHoverOverlayStylesDesktop}
	}
	`
            : `
	.${blockId}.eb-social-share-wrapper.eb-social-share-floating ul.eb-social-shares:before{
		${wrpOverlayStylesDesktop}
		transition: ${wrpOvlTransitionStyle};
	}

	.${blockId}.eb-social-share-wrapper.eb-social-share-floating ul.eb-social-shares:hover:before{
		${wrpHoverOverlayStylesDesktop}
	}
	`
        }


	.${blockId}.eb-social-share-wrapper ul.eb-social-shares {
		list-style: none;
		flex-wrap: wrap;
		align-items: ${iconsVAlign || "center"};
		justify-content: ${iconsJustify};
		${iconSpaceDesktop}
		${iconRowGapDesktop}
		display: flex;
	}


	${socialStyles}


	${isIconsDevider
            ? `
		.${blockId}.eb-social-share-wrapper ul.eb-social-shares li{
			position:relative;
		}

		.${blockId}.eb-social-share-wrapper ul.eb-social-shares li + li:before {
			content: "";
			background-color: ${icnsDevideColor};
			height: ${icnSepH}px;
			width: ${icnSepW}px;
			position: absolute;
			top: 2px;
			right: 100%;
			${sSepPosRightDesktop}
		}

		`
            : ""
        }



	.${blockId}.eb-social-share-wrapper ul.eb-social-shares li a {
		box-sizing:border-box;
		text-decoration: none;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: ${iconMarginDesktop} 0;
		${textHOffset || textVOffset || blurRadius || textShadowColor
            ? `text-shadow: ${textHOffset || 0}px ${textVOffset || 0}px ${blurRadius || 0
            }px ${textShadowColor || "rgba(0,0,0,.5)"};`
            : ""
        }
		${iconShape !== "circular" ? iconPaddingDesktop : ""}
		${socialBdrShdwDesktop}
		transition: color 0.5s, background-color 0.5s, ${socialBdrShdwTransitionStyle};
		${iconShape === "circular" && iconHeightDesktop
            ? `height: ${iconHeightDesktop};`
            : ""
        }
		${iconShape === "circular" && iconWidthDesktop
            ? `width: ${iconWidthDesktop};`
            : ""
        }
		${showTitle ? titleTypographyDesktop : `font-size: ${iconSizeDesktop};`}
	}

	.${blockId}.eb-social-share-wrapper.eb-social-share-floating ul.eb-social-shares {
		display: inline-block;
		position: fixed;
		z-index: 999;
		left: 0;
		top: 35%;
		transform: translate(0, -50px);
		overflow: auto;
		-ms-overflow-style: none;  /* IE and Edge */
  		scrollbar-width: none;  /* Firefox */
		max-height: ${typeof floatingHeightDesktop === "string" &&
            floatingHeightDesktop.length !== 0
            ? floatingHeightDesktop
            : "calc(65vh + 50px)"
        };
		${isFloating ? wrpMarginDesktop : ""}
		${isFloating ? wrpPaddingDesktop : ""}
		${isFloating ? wrpBackgroundStylesDesktop : ""}
		${isFloating ? wrpBdShdStyesDesktop : ""}
		${isFloating
            ? `transition: ${wrpBgTransitionStyle}, ${wrpBdShdTransitionStyle};`
            : ""
        }
		${isFloating ? "position: fixed; z-index: 999;" : ""}
	}

	${isFloating
            ? `
	.${blockId}.eb-social-share-wrapper.eb-social-share-floating ul.eb-social-shares:hover {
		${wrpBdShdStylesHoverDesktop}
	}
	`
            : ""
        }

	ul.eb-social-shares::-webkit-scrollbar {
		display: none;
	}

	.${blockId}.eb-social-share-wrapper.eb-social-share-floating ul.eb-social-shares .eb-social-share-text {
		width: max-content;
		max-width: 0;
		overflow: hidden;
		white-space: nowrap;
		transition: all 0.4s;
	}

	.${blockId}.eb-social-share-wrapper.eb-social-share-floating ul.eb-social-shares li a .eb-social-share-icon {
		width: ${iconSizeDesktop};
		text-align: center;
	}

	.${blockId}.eb-social-share-wrapper ul.eb-social-shares li a .eb-social-share-icon {
		font-size: ${iconSizeDesktop};
	}

    ${!showTitle
            ? `.${blockId}.eb-social-share-wrapper ul.eb-social-shares li a .eb-social-share-icon {
		width: ${iconSizeDesktop};
        height: ${iconSizeDesktop};
		text-align: center;
	}`
            : ""
        }

	.${blockId}.eb-social-share-wrapper.eb-social-share-floating ul.eb-social-shares li a {
		display: inline-flex;
	}

	.${blockId}.eb-social-share-wrapper.eb-social-share-floating ul.eb-social-shares li a.eb-slide-out .eb-social-share-text {
		max-width: ${typeof floatingWidthDesktop === "string" &&
            floatingWidthDesktop.length !== 0
            ? floatingWidthDesktop
            : "300px"
        };
	}

	.${blockId}.eb-social-share-wrapper ul.eb-social-shares li:hover a {
		background:${hvIcnBgc};
		color:${hvIcnColor};
		${socialBdrShdwsHoverDesktop}
	}

	.${blockId}.eb-social-share-wrapper ul.eb-social-shares li span.eb-social-share-text:before {
		content: "";
		width: 1px;
		height: 20px;
		background-color: #fff;
		opacity: .5;
		display: inline-block;
		vertical-align: middle;
		margin: 0 10px;
	}

	.${blockId}.eb-social-share-wrapper.eb-social-share-floating.eb-social-share-circular ul.eb-social-shares li a.eb-slide-out {
		height: unset;
		width: unset;
		border-radius: ${iconHeightDesktop}
	}

	.${blockId}.eb-social-share-wrapper.eb-social-share-floating.eb-social-share-circular ul.eb-social-shares li a.eb-slide-out i {
		height: ${iconHeightDesktop};
		width: ${iconWidthDesktop};
		display: flex;
		align-items: center;
		justify-content: center;
	}
`;

    const wrapperStylesTab = `

	.${blockId}.eb-social-share-wrapper {
		${wrpBackgroundStylesTab}
		${!isFloating ? wrpMarginTab : ""}
		${!isFloating ? wrpPaddingTab : ""}
		${wrpBdShdStyesTab}
	}

	.${blockId}.eb-social-share-wrapper:hover{
		${wrpHoverBackgroundStylesTab}
		${!isFloating ? wrpBdShdStylesHoverTab : ""}

	}

	${!isFloating
            ? `
	.${blockId}.eb-social-share-wrapper:before{
		${wrpOverlayStylesTab}
	}

	.${blockId}.eb-social-share-wrapper:hover:before{
		${wrpHoverOverlayStylesTab}
	}
	`
            : `
	.${blockId}.eb-social-share-wrapper.eb-social-share-floating ul.eb-social-shares:before{
		${wrpOverlayStylesTab}
	}

	.${blockId}.eb-social-share-wrapper.eb-social-share-floating ul.eb-social-shares:hover:before{
		${wrpHoverOverlayStylesTab}
	}
	`
        }

	.${blockId}.eb-social-share-wrapper ul.eb-social-shares {
		${iconSpaceTab}
		${iconRowGapTab}
	}

	${isIconsDevider
            ? `
			.${blockId}.eb-social-share-wrapper ul.eb-social-shares li + li:before {
				${sSepPosRightTab}
			}
			`
            : ""
        }

	.${blockId}.eb-social-share-wrapper.eb-social-share-floating ul.eb-social-shares {
		max-height: ${typeof floatingHeightTab === "string" &&
            floatingHeightTab.length !== 0
            ? floatingHeightTab
            : "calc(65vh + 50px)"
        };
		${isFloating ? wrpMarginTab : ""}
		${isFloating ? wrpPaddingTab : ""}
		${isFloating ? wrpBackgroundStylesTab : ""}
		${isFloating ? wrpBdShdStyesTab : ""}
		${isFloating ? "position: fixed; z-index: 999;" : ""}
	}

	${isFloating
            ? `
	.${blockId}.eb-social-share-wrapper.eb-social-share-floating ul.eb-social-shares:hover {
		${wrpBdShdStylesHoverTab}
	}
	`
            : ""
        }

	.${blockId}.eb-social-share-wrapper.eb-social-share-floating ul.eb-social-shares li a.eb-slide-out .eb-social-share-text {
		max-width: ${typeof floatingWidthTab === "string" &&
            floatingWidthTab.length !== 0
            ? floatingWidthTab
            : "300px"
        };
	}

	.${blockId}.eb-social-share-wrapper ul.eb-social-shares li a {
		${showTitle ? titleTypographyTab : `font-size: ${iconSizeTab};`}
		${iconShape !== "circular" ? iconPaddingTab : ""}
		${socialBdrShdwTab}
		margin: ${iconMarginTab} 0;
		${iconShape === "circular" && iconHeightTab ? `height: ${iconHeightTab};` : ""}
		${iconShape === "circular" && iconWidthTab ? `width: ${iconWidthTab};` : ""}
	}

	.${blockId}.eb-social-share-wrapper ul.eb-social-shares li:hover a {
		${socialBdrShdwsHoverTab}
	}

	.${blockId}.eb-social-share-wrapper ul.eb-social-shares li a .eb-social-share-icon {
		font-size: ${iconSizeTab};
	}

    ${!showTitle
            ? `.${blockId}.eb-social-share-wrapper ul.eb-social-shares li a .eb-social-share-icon {
		width: ${iconSizeTab};
        height: ${iconSizeTab};
		text-align: center;
	}`
            : ""
        }

	`;

    const wrapperStylesMobile = `
	.${blockId}.eb-social-share-wrapper {
		${wrpBackgroundStylesMobile}
		${!isFloating ? wrpMarginMobile : ""}
		${!isFloating ? wrpPaddingMobile : ""}
		${wrpBdShdStyesMobile}
	}

	.${blockId}.eb-social-share-wrapper:hover{
		${wrpHoverBackgroundStylesMobile}
		${!isFloating ? wrpBdShdStylesHoverMobile : ""}

	}

	${!isFloating
            ? `
	.${blockId}.eb-social-share-wrapper:before{
		${wrpOverlayStylesMobile}
	}

	.${blockId}.eb-social-share-wrapper:hover:before{
		${wrpHoverOverlayStylesMobile}
	}
	`
            : `
	.${blockId}.eb-social-share-wrapper.eb-social-share-floating ul.eb-social-shares:before{
		${wrpOverlayStylesMobile}
	}

	.${blockId}.eb-social-share-wrapper.eb-social-share-floating ul.eb-social-shares:hover:before{
		${wrpHoverOverlayStylesMobile}
	}
	`
        }

	.${blockId}.eb-social-share-wrapper ul.eb-social-shares {
		${iconSpaceMobile}
		${iconRowGapMobile}
	}


	${isIconsDevider
            ? `
			.${blockId}.eb-social-share-wrapper ul.eb-social-shares li + li:before {
				${sSepPosRightMobile}
			}
			`
            : ""
        }

	.${blockId}.eb-social-share-wrapper.eb-social-share-floating ul.eb-social-shares {
		max-height: ${typeof floatingHeightMobile === "string" &&
            floatingHeightMobile.length !== 0
            ? floatingHeightMobile
            : "calc(65vh + 50px)"
        };
		${isFloating ? wrpMarginMobile : ""}
		${isFloating ? wrpPaddingMobile : ""}
		${isFloating ? wrpBackgroundStylesMobile : ""}
		${isFloating ? wrpBdShdStyesMobile : ""}
		${isFloating ? "position: fixed; z-index: 999;" : ""}
	}

	${isFloating
            ? `
	.${blockId}.eb-social-share-wrapper.eb-social-share-floating ul.eb-social-shares:hover {
		${wrpBdShdStylesHoverMobile}
	}
	`
            : ""
        }

	.${blockId}.eb-social-share-wrapper.eb-social-share-floating ul.eb-social-shares li a.eb-slide-out .eb-social-share-text {
		max-width: ${typeof floatingWidthMobile === "string" &&
            floatingWidthMobile.length !== 0
            ? floatingWidthMobile
            : "300px"
        };
	}

	.${blockId}.eb-social-share-wrapper ul.eb-social-shares li a {
		${showTitle ? titleTypographyMobile : `font-size: ${iconSizeMobile};`}
		${iconShape !== "circular" ? iconPaddingMobile : ""}
		${socialBdrShdwMobile}
		margin: ${iconMarginMobile} 0;
		${iconShape === "circular" && iconHeightMobile
            ? `height: ${iconHeightMobile};`
            : ""
        }
		${iconShape === "circular" && iconWidthMobile
            ? `width: ${iconWidthMobile};`
            : ""
        }
	}


	.${blockId}.eb-social-share-wrapper ul.eb-social-shares li:hover a {
		${socialBdrShdwsHoverMobile}
	}

	.${blockId}.eb-social-share-wrapper ul.eb-social-shares li a .eb-social-share-icon {
		font-size: ${iconSizeMobile};
	}

    ${!showTitle
            ? `.${blockId}.eb-social-share-wrapper ul.eb-social-shares li a .eb-social-share-icon {
		width: ${iconSizeMobile};
        height: ${iconSizeMobile};
		text-align: center;
	}`
            : ""
        }

	`;

    // all css styles for large screen width (desktop/laptop) in strings ⬇
    const desktopAllStyles = softMinifyCssStrings(`
		${wrapperStylesDesktop}
	`);

    // all css styles for Tab in strings ⬇
    const tabAllStyles = softMinifyCssStrings(`
		${wrapperStylesTab}
	`);

    // all css styles for Mobile in strings ⬇
    const mobileAllStyles = softMinifyCssStrings(`
		${wrapperStylesMobile}
	`);

    //
    // styling codes End here
    //

    return (
        <>
            <StyleComponent
                attributes={attributes}
                setAttributes={setAttributes}
                desktopAllStyles={desktopAllStyles}
                tabAllStyles={tabAllStyles}
                mobileAllStyles={mobileAllStyles}
                blockName={name}
            />
        </>
    );
}
