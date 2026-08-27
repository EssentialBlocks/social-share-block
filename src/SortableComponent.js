import React from "react";
import {
	SortableContainer,
	SortableElement,
	SortableHandle,
} from "react-sortable-hoc";
import { TextControl, ToggleControl } from "@wordpress/components";

const { ColorControl } = window.EBSocialShareControls;

import { __ } from "@wordpress/i18n";

const TrashIcon = ({ position, onDeleteProfile }) => (
	<span
		className="eb-social-delete-icon"
		style={trashStyle}
		onClick={() => onDeleteProfile(position)}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			x="0"
			y="0"
			enableBackground="new 0 0 512 512"
			version="1.1"
			viewBox="0 0 512 512"
			xmlSpace="preserve"
			style={{ width: 14 }}
		>
			<path
				d="M423.3 86.6H89c-16.8.1-32.2 9.3-40.1 24.1-7.9 14.8-7.1 32.7 2.2 46.8l37.2 55.6V456c0 30.9 25.1 56 56 56h223.9c30.9 0 56-25.1 56-56V213.1l37.2-56c9.1-14 9.8-31.8 1.9-46.5-8.1-14.7-23.4-23.9-40-24zm-198 347c0 13.9-11.3 25.2-25.2 25.2-13.9 0-25.2-11.3-25.2-25.2V220.9c0-13.9 11.3-25.2 25.2-25.2 13.9 0 25.2 11.3 25.2 25.2v212.7zm112 0c0 13.9-11.3 25.2-25.2 25.2-13.9 0-25.2-11.3-25.2-25.2V220.9c0-13.9 11.3-25.2 25.2-25.2 13.9 0 25.2 11.3 25.2 25.2v212.7zM325.8 19.4C309.9 7.1 290.2 0 269.3 0h-26.4c-20.9 0-40.6 7.1-56.5 19.4-11.2 8.7-20.5 20.1-26.9 33.4h193.1c-6.3-13.3-15.6-24.7-26.8-33.4z"
				style={{ fill: "#FF6464" }}
			></path>
		</svg>
	</span>
);

const DragHandle = SortableHandle(() => (
	<span className="drag-handle">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			x="0"
			y="0"
			enableBackground="new 0 0 512 512"
			version="1.1"
			viewBox="0 0 512 512"
			xmlSpace="preserve"
			style={{ height: 14 }}
		>
			<path
				d="M512 256L402.6 146.6 402.6 210.3 301 210.3 301 109.4 365.4 109.4 256 0 146.6 109.4 211 109.4 211 210.3 109.4 210.3 109.4 146.6 0 256 109.4 365.4 109.4 300.3 211 300.3 211 402.6 146.6 402.6 256 512 365.4 402.6 301 402.6 301 300.3 402.6 300.3 402.6 365.4z"
				style={{ fill: "#a9a9a9" }}
			></path>
		</svg>
	</span>
));

const SortableItem = SortableElement(
	({
		position,
		profile,
		onProfileClick,
		onDeleteProfile,
		onColorChange,
		selectedIcon,
		onIconTextChange,
		onLinkChange,
		onLinkTargetChange,
		getDefaultLink,
		onBackgroundColorChange,
		onSeparatorColorChange,
	}) => (
		<li className="drag-helper">
			<span className="profile-wrapper">
				<span
					className="profile-icon-container"
					onClick={() => onProfileClick(profile.icon)}
				>
					<span className={`${profile.icon}`} />
					<span className="selected-profile-icon">{profile.icon}</span>
				</span>
				<DragHandle />
				<TrashIcon position={position} onDeleteProfile={onDeleteProfile} />
			</span>

			{selectedIcon === profile.icon && (
				<div className="link-form-wrapper">
					<ColorControl
						label={__("Icon Color", "essential-blocks")}
						color={profile.color || ""}
						onChange={(color) => onColorChange(color, position)}
					/>
					<ColorControl
						label={__("Icon Background Color", "essential-blocks")}
						color={profile.backgroundColor}
						onChange={(value) => onBackgroundColorChange(value, position)}
					/>
					<ColorControl
						label={__("Separator Color", "essential-blocks")}
						color={profile.separatorColor}
						onChange={(value) => onSeparatorColorChange(value, position)}
					/>
					<TextControl
						label={__("Text", "essential-blocks")}
						className="social-share-name-input"
						value={profile.iconText || ""}
						onChange={(value) => onIconTextChange(value, position)}
					/>
					{/* `type="text"`, not `type="url"`: /contact, #section and mailto:
					    values are all accepted by esc_url() on render but are `:invalid`
					    for input[type=url], so the browser would flag a link that works.

					    Pre-filled with whatever the icon resolves to today, so the author
					    can edit the real value instead of guessing it. `undefined` means
					    "never touched" and shows that default; an empty string is a real
					    saved value meaning "cleared", and both fall back to the share URL
					    on the frontend. Unmapped platforms have no default, so the field
					    is simply empty. */}
					<TextControl
						label={__("Override Link", "essential-blocks")}
						className="social-share-link-input"
						type="text"
						placeholder={__(
							"https://example.com/your-profile",
							"essential-blocks"
						)}
						help={__(
							"Replace this to send the icon somewhere else. Clear it to share the current post.",
							"essential-blocks"
						)}
						value={
							profile.link !== undefined
								? profile.link
								: getDefaultLink(profile.icon)
						}
						onChange={(value) => onLinkChange(value, position)}
					/>
					{/* `!== false`, not truthiness: items saved before this field existed have
					    no `linkOpenNewTab` key, and the render callback used to hardcode
					    target="_blank". Defaulting an absent key to `true` keeps them there. */}
					<ToggleControl
						label={__("Open in new tab", "essential-blocks")}
						checked={profile.linkOpenNewTab !== false}
						onChange={(value) => onLinkTargetChange(value, position)}
					/>
				</div>
			)}
		</li>
	)
);

const SortableList = SortableContainer((props) => {
	const { profiles, ...rest } = props;

	return (
		<ul>
			{profiles.map((profile, index) => (
				<SortableItem
					profile={profile}
					key={index}
					{...rest}
					position={index}
					index={index}
				/>
			))}
		</ul>
	);
});

const SortableComponent = ({ profiles, onSortEnd, ...rest }) => {
	if (profiles.length === 0) return <ul />;

	return (
		<SortableList
			profiles={profiles}
			useDragHandle={true}
			onSortEnd={onSortEnd}
			{...rest}
		/>
	);
};

// Style objects
const trashStyle = {
	fontSize: 14,
	borderLeft: "1px solid #b4b4cb",
	lineHeight: "2.5em",
	flex: 2,
	textAlign: "center",
	display: "flex",
	justifyContent: "center",
};

export default SortableComponent;
