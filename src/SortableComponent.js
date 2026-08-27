import React from "react";
/**
 * Drag and drop is provided by @dnd-kit.
 *
 * This list used to be built on `react-sortable-hoc`, which was abandoned in 2022 and
 * positions its items through `ReactDOM.findDOMNode` -- an API React removes in 19. Its
 * declared peer range (`react ^16 || ^17`) also conflicted with the React 18 that WordPress
 * ships, which is why the repo carried a `legacy-peer-deps` npm workaround just to install.
 *
 * @dnd-kit is hooks-based, needs no `findDOMNode`, and its peer range is `react >=16.8`, so
 * the workaround is gone. The public surface of this file is unchanged: the same props go in,
 * the same `onSortEnd({ oldIndex, newIndex })` comes out, and the markup and class names are
 * identical so the existing stylesheet still applies.
 */
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	restrictToParentElement,
	restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TextControl, ToggleControl } from "@wordpress/components";

const { ColorControl } = window.EBSocialShareControls;

import { __ } from "@wordpress/i18n";

/**
 * Profiles carry no stable identifier of their own -- `icon` can legitimately repeat when the
 * same network is added twice -- so the sort id is derived from the position. Offset by one
 * because @dnd-kit treats a falsy id as "no active item", which would make the first row
 * undraggable.
 */
const toSortableId = (index) => index + 1;
const fromSortableId = (id) => Number(id) - 1;

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

/**
 * The handle is the only drag affordance, matching the previous `useDragHandle` behaviour:
 * @dnd-kit's listeners are attached here and nowhere else, so clicking the icon container
 * still just expands the item's settings.
 */
const DragHandle = ({ attributes, listeners, setActivatorNodeRef }) => (
	<span
		className="drag-handle"
		ref={setActivatorNodeRef}
		{...attributes}
		{...listeners}
	>
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
);

const SortableItem = ({
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
}) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		setActivatorNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: toSortableId(position) });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		...(isDragging ? { opacity: 0.6, position: "relative", zIndex: 1 } : {}),
	};

	return (
		<li className="drag-helper" ref={setNodeRef} style={style}>
			<span className="profile-wrapper">
				<span
					className="profile-icon-container"
					onClick={() => onProfileClick(profile.icon)}
				>
					<span className={`${profile.icon}`} />
					<span className="selected-profile-icon">{profile.icon}</span>
				</span>
				<DragHandle
					attributes={attributes}
					listeners={listeners}
					setActivatorNodeRef={setActivatorNodeRef}
				/>
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
	);
};

const SortableComponent = ({ profiles, onSortEnd, ...rest }) => {
	/**
	 * A pointer has to travel 5px before a drag starts, so a plain click on the handle still
	 * reaches the element underneath instead of being swallowed by the drag sensor.
	 */
	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	if (profiles.length === 0) return <ul />;

	const items = profiles.map((profile, index) => toSortableId(index));

	const handleDragEnd = ({ active, over }) => {
		if (!over || active.id === over.id) return;

		onSortEnd({
			oldIndex: fromSortableId(active.id),
			newIndex: fromSortableId(over.id),
		});
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			modifiers={[restrictToVerticalAxis, restrictToParentElement]}
			onDragEnd={handleDragEnd}
		>
			<SortableContext items={items} strategy={verticalListSortingStrategy}>
				<ul>
					{profiles.map((profile, index) => (
						<SortableItem
							profile={profile}
							key={index}
							{...rest}
							position={index}
						/>
					))}
				</ul>
			</SortableContext>
		</DndContext>
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
