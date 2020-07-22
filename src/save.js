/**
 * Internal dependencies
 */
import RenderProfileIcons from "./RenderProfileIcons";

const Save = ({ attributes }) => {
	const {
		profiles,
		fontSize,
		iconSpacing,
		iconAlign,
		iconColor,
		backgroundColor,
		borderRadius,
		customColor,
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
		radiusUnit
	} = attributes;

	const profileStyles = {
		container: {
			margin: `${marginTop || 0}${marginUnit} ${marginRight ||
				0}${marginUnit} ${marginBottom || 0}${marginUnit} ${marginLeft ||
				0}${marginUnit}`,
			padding: `${paddingTop || 10}${paddingUnit} ${paddingRight ||
				10}${paddingUnit} ${paddingBottom || 10}${paddingUnit} ${paddingLeft ||
				10}${paddingUnit}`,
			fontSize: `${fontSize || 32}${fontSizeUnit}`,
			justifyContent: iconAlign,
			background: containerBackground
		},
		iconWrapper: {
			display: "flex", // ? Add this line to fix hover.css icon displacement issue
			background: customColor ? backgroundColor : undefined,
			color: customColor ? iconColor || "#0073aa" : undefined,
			borderRadius: `${borderRadius || 0}${radiusUnit}`,
			marginRight: `${iconSpacing || 8}${iconSpacingUnit}`,
			padding: `${iconPadding || 32}${iconPaddingUnit}`,
			border: `${borderSize || 0}px  ${borderType} ${borderColor || "#000000"}`,
			boxShadow: `${boxHOffset || 0}px  ${boxVOffset || 0}px ${shadowBlur ||
				0}px ${shadowSpread || 0}px ${boxShadowColor || "#000000"}`,
			textDecoration: "none"
		},
		iconStyle: {
			textShadow: `${textHOffset || 0}px ${textVOffset || 0}px ${shadowRadius ||
				0}px ${textShadowColor || "#000000"}`
		}
	};

	return (
		<div
			className="eb-social-container"
			data-hover-animation={hoverAnimation}
			data-profiles={profilesString}
		>
			<RenderProfileIcons
				profiles={profiles}
				customColor={customColor}
				profileStyles={profileStyles}
				hoverAnimation={hoverAnimation}
			/>
		</div>
	);
};

export default Save;
