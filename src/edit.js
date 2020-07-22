/**
 * WordPress dependencies
 */

const { __ } = wp.i18n;
const { Component } = wp.element;

/**
 * Internal dependencies
 */
import Inspector from "./inspector";
import RenderProfileIcons from "./RenderProfileIcons";

class Edit extends Component {
	componentDidMount = () => {
		let profilesString = this.props.attributes.profilesString || "";
		let profiles = this.getProfilesList();

		this.props.setAttributes({ profiles, profilesString });
	};

	generateProfileString = profiles => {
		// generate profile string from profile object to store in data-attribute
		// example: profiles= [ {icon: "facebook", link:"https://fb.com/test"} ]
		//       => profilesString = "facebook https://fb.com/test"
		let profilesString = "";
		profiles.map(profile => {
			profilesString = profilesString + `${profile.icon} ${profile.link},`;
		});

		// Remove last comma from string
		profilesString = profilesString.replace(/,\s*$/, "");

		return profilesString;
	};

	onProfilesAdd = profiles => {
		let profilesString = this.generateProfileString(profiles);
		this.props.setAttributes({ profiles, profilesString });
	};

	getProfile = item => {
		item = item.split(" ");
		let profile = {};
		profile.icon = item[0];
		profile.link = item[1] ? item[1] : "";

		return profile;
	};

	getProfilesList = () => {
		let profiles = [];
		let profilesString = this.props.attributes.profilesString;
		let profilesList = profilesString ? profilesString.split(",") : [];

		profilesList.length &&
			profilesList.map(item => profiles.push(this.getProfile(item)));

		return profiles;
	};

	render = () => {
		const { isSelected, attributes, setAttributes } = this.props;
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
				padding: `${paddingTop || 0}${paddingUnit} ${paddingRight ||
					0}${paddingUnit} ${paddingBottom || 0}${paddingUnit} ${paddingLeft ||
					0}${paddingUnit}`,
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
				border: `${borderSize || 0}px  ${borderType} ${borderColor ||
					"#000000"}`,
				boxShadow: `${boxHOffset || 0}px ${boxVOffset || 0}px ${shadowBlur ||
					0}px ${shadowSpread || 0}px ${boxShadowColor || "#000000"}`
			},
			iconStyle: {
				fontWeight: "normal",
				textShadow: `${textHOffset || 0}px ${textVOffset ||
					0}px ${shadowRadius || 0}px ${textShadowColor || "#000000"}`
			}
		};

		return [
			isSelected && (
				<Inspector
					attributes={attributes}
					setAttributes={setAttributes}
					onProfilesAdd={this.onProfilesAdd}
					getProfilesList={this.getProfilesList}
				/>
			),
			//Edit view Here
			<div className="eb-social-container">
				<RenderProfileIcons
					profiles={profiles}
					customColor={customColor}
					profileStyles={{
						...profileStyles,
						display: profilesString ? "block" : "none"
					}}
					hoverAnimation={hoverAnimation}
				/>
				<p style={{ display: profilesString ? "none" : "block" }}>Add Icon</p>
			</div>
		];
	};
}

export default Edit;
