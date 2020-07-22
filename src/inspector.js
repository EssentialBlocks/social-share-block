/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { InspectorControls, PanelColorSettings } from "@wordpress/block-editor";
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
	BaseControl,
	Button,
	ButtonGroup,
} from "@wordpress/components";

/**
 * Internal dependencies
 */
import {
	ICON_SHAPE,
	ICON_ALIGN,
	BORDER_TYPES,
	HOVER_ANIMATION,
} from "./constants";
import DealSocialProfiles from "../util/social-profiles/DealSocialProfiles";
import IconList from "../util/social-profiles/IconList";
import DimensionsControl from "../util/dimensions-control";
import UnitControl from "../util/unit-control";
import ColorControl from "../util/color-control";

const Inspector = ({
	attributes,
	setAttributes,
	onProfilesAdd,
	getProfilesList,
}) => {
	const {
		profiles,
		fontSize,
		iconSpacing,
		iconAlign,
		iconColor,
		backgroundColor,
		borderRadius,
		customColor,
		iconShape,
		iconPadding,
		borderSize,
		borderType,
		borderColor,
		hoverAnimation,
		boxHOffset,
		boxVOffset,
		shadowBlur,
		shadowSpread,
		boxShadowColor,
		textHOffset,
		textVOffset,
		shadowRadius,
		textShadowColor,
		profilesString,
		containerBackground,
		marginTop,
		marginRight,
		marginBottom,
		marginLeft,
		paddingTop,
		paddingRight,
		paddingBottom,
		paddingLeft,
		marginUnit,
		paddingUnit,
		fontSizeUnit,
		iconSpacingUnit,
		iconPaddingUnit,
		radiusUnit,
	} = attributes;

	const onShapeChange = (value) => {
		switch (value) {
			case "rounded":
				setAttributes({
					iconShape: value,
					borderRadius: 10,
					radiusUnit: "px",
				});
				break;

			case "circular":
				setAttributes({
					iconShape: value,
					borderRadius: 50,
					radiusUnit: "%",
				});
				break;

			case "square":
				setAttributes({
					iconShape: value,
					borderRadius: 0,
					radiusUnit: "px",
				});
				break;

			default:
				break;
		}
	};

	return (
		<InspectorControls key="controls">
			<PanelBody title={__("Social Setting")}>
				<DealSocialProfiles
					iconList={IconList}
					profiles={getProfilesList()}
					onProfileAdd={(profiles) => onProfilesAdd(profiles)}
				/>
			</PanelBody>

			<PanelBody title={__("Icon Settings")} initialOpen={false}>
				<BaseControl label={__("Icon Shape")}>
					<ButtonGroup>
						{ICON_SHAPE.map((item) => (
							<Button
								style={{ zIndex: 0 }} // ? Add this style to fix icon list and primary button issue
								isLarge
								isSecondary={iconShape !== item.value}
								isPrimary={iconShape === item.value}
								onClick={() => onShapeChange(item.value)}
							>
								{item.label}
							</Button>
						))}
					</ButtonGroup>
				</BaseControl>

				<SelectControl
					label={__("Alignment")}
					value={iconAlign}
					options={ICON_ALIGN}
					onChange={(newAlign) => setAttributes({ iconAlign: newAlign })}
				/>

				<UnitControl
					selectedUnit={fontSizeUnit}
					unitTypes={[
						{ label: "px", value: "px" },
						{ label: "em", value: "em" },
						{ label: "%", value: "%" },
					]}
					onClick={(fontSizeUnit) => setAttributes({ fontSizeUnit })}
				/>

				<RangeControl
					label={__("Font Size")}
					value={fontSize}
					allowReset
					onChange={(fontSize) => setAttributes({ fontSize })}
					min={8}
					max={100}
				/>

				<UnitControl
					selectedUnit={iconSpacingUnit}
					unitTypes={[
						{ label: "px", value: "px" },
						{ label: "em", value: "em" },
						{ label: "%", value: "%" },
					]}
					onClick={(iconSpacingUnit) => setAttributes({ iconSpacingUnit })}
				/>

				<RangeControl
					label={__("Spacing")}
					value={iconSpacing}
					allowReset
					onChange={(newSize) => setAttributes({ iconSpacing: newSize })}
					min={8}
					max={100}
				/>

				<UnitControl
					selectedUnit={iconPaddingUnit}
					unitTypes={[
						{ label: "px", value: "px" },
						{ label: "em", value: "em" },
						{ label: "%", value: "%" },
					]}
					onClick={(iconPaddingUnit) => setAttributes({ iconPaddingUnit })}
				/>

				<RangeControl
					label={__("Icon Size")}
					value={iconPadding}
					allowReset
					onChange={(newValue) => setAttributes({ iconPadding: newValue })}
					min={0}
					max={100}
				/>

				<ToggleControl
					label={__("Custom Colors")}
					checked={customColor}
					onChange={() => setAttributes({ customColor: !customColor })}
				/>
			</PanelBody>

			{customColor && (
				<PanelColorSettings
					title={__("Colors")}
					initialOpen={false}
					colorSettings={[
						{
							value: iconColor,
							onChange: (newColor) => setAttributes({ iconColor: newColor }),
							label: __("Icon Color"),
						},
						{
							value: backgroundColor,
							onChange: (newColor) =>
								setAttributes({
									backgroundColor: newColor,
								}),
							label: __("Icon Background"),
						},
						{
							value: containerBackground,
							onChange: (newColor) =>
								setAttributes({
									containerBackground: newColor,
								}),
							label: __("Container Background"),
						},
					]}
				/>
			)}

			<PanelBody title={__("Border Settings")} initialOpen={false}>
				<ColorControl
					label={__("Border Color")}
					color={borderColor}
					onChange={(borderColor) => setAttributes({ borderColor })}
				/>

				<SelectControl
					label={__("Border Type")}
					value={borderType}
					options={BORDER_TYPES}
					onChange={(newStyle) => setAttributes({ borderType: newStyle })}
				/>

				<RangeControl
					label={__("Border Size")}
					value={borderSize}
					allowReset
					onChange={(newSize) => setAttributes({ borderSize: newSize })}
					min={0}
					max={100}
				/>

				<UnitControl
					selectedUnit={radiusUnit}
					unitTypes={[
						{ label: "px", value: "px" },
						{ label: "%", value: "%" },
					]}
					onClick={(radiusUnit) => setAttributes({ radiusUnit })}
				/>

				<RangeControl
					label={__("Border Radius")}
					value={borderRadius}
					allowReset
					onChange={(newValue) => setAttributes({ borderRadius: newValue })}
					min={0}
					max={100}
				/>
			</PanelBody>

			<PanelBody title={__("Hover")} initialOpen={false}>
				<SelectControl
					label={__("Hover Animation")}
					value={hoverAnimation}
					options={HOVER_ANIMATION}
					onChange={(newValue) => setAttributes({ hoverAnimation: newValue })}
				/>
			</PanelBody>

			<PanelBody title={__("Box Shadow")} initialOpen={false}>
				<ColorControl
					label={__("Shadow Color")}
					color={boxShadowColor}
					onChange={(boxShadowColor) => setAttributes({ boxShadowColor })}
				/>

				<RangeControl
					label={__("Horizontal Offset")}
					value={boxHOffset}
					allowReset
					onChange={(newValue) => setAttributes({ boxHOffset: newValue })}
					min={0}
					max={100}
				/>

				<RangeControl
					label={__("Vertical Offset")}
					value={boxVOffset}
					allowReset
					onChange={(newValue) => setAttributes({ boxVOffset: newValue })}
					min={0}
					max={100}
				/>

				<RangeControl
					label={__("Shadow Blur")}
					value={shadowBlur}
					allowReset
					onChange={(newValue) => setAttributes({ shadowBlur: newValue })}
					min={0}
					max={100}
				/>

				<RangeControl
					label={__("Shadow Spread")}
					value={shadowSpread}
					allowReset
					onChange={(newValue) => setAttributes({ shadowSpread: newValue })}
					min={0}
					max={100}
				/>
			</PanelBody>

			<PanelBody title={__("Text Shadow")} initialOpen={false}>
				<ColorControl
					label={__("Shadow Color")}
					color={textShadowColor}
					onChange={(textShadowColor) => setAttributes({ textShadowColor })}
				/>

				<RangeControl
					label={__("Horizontal Offset")}
					value={textHOffset}
					allowReset
					onChange={(newValue) => setAttributes({ textHOffset: newValue })}
					min={0}
					max={100}
				/>

				<RangeControl
					label={__("Vertical Offset")}
					value={textVOffset}
					allowReset
					onChange={(newValue) => setAttributes({ textVOffset: newValue })}
					min={0}
					max={100}
				/>

				<RangeControl
					label={__("Shadow Radius")}
					value={shadowRadius}
					allowReset
					onChange={(newValue) => setAttributes({ shadowRadius: newValue })}
					min={0}
					max={100}
				/>
			</PanelBody>

			<PanelBody title={__("Margin & Padding")} initialOpen={false}>
				<UnitControl
					selectedUnit={marginUnit}
					unitTypes={[
						{ label: "px", value: "px" },
						{ label: "em", value: "em" },
						{ label: "%", value: "%" },
					]}
					onClick={(marginUnit) => setAttributes({ marginUnit })}
				/>

				<DimensionsControl
					label={__("Margin")}
					top={marginTop}
					right={marginRight}
					bottom={marginBottom}
					left={marginLeft}
					onChange={({ top, right, bottom, left }) =>
						setAttributes({
							marginTop: top,
							marginRight: right,
							marginBottom: bottom,
							marginLeft: left,
						})
					}
				/>

				<UnitControl
					selectedUnit={paddingUnit}
					unitTypes={[
						{ label: "px", value: "px" },
						{ label: "em", value: "em" },
						{ label: "%", value: "%" },
					]}
					onClick={(paddingUnit) => setAttributes({ paddingUnit })}
				/>

				<DimensionsControl
					label={__("Padding")}
					top={paddingTop}
					right={paddingRight}
					bottom={paddingBottom}
					left={paddingLeft}
					onChange={({ top, right, bottom, left }) =>
						setAttributes({
							paddingTop: top,
							paddingRight: right,
							paddingBottom: bottom,
							paddingLeft: left,
						})
					}
				/>
			</PanelBody>
		</InspectorControls>
	);
};

export default Inspector;
