import React from "react";
import PropTypes from "prop-types";
import {
  SortableContainer,
  SortableElement,
  SortableHandle
} from "react-sortable-hoc";

const TrashIcon = ({ position, onDeleteProfile }) => (
  <span
    className="fa fa-trash eb-delete-social"
    style={trashStyle}
    onClick={() => {
      onDeleteProfile(position);
    }}
  />
);

const DragHandle = SortableHandle(() => (
  <span className="fa fa-ellipsis-v drag-handle" />
));

const SortableItem = SortableElement(
  ({
    position,
    profile,
    onProfileClick,
    onDeleteProfile,
    selectedIcon,
    url,
    onUrlChange,
    onSubmit
  }) => (
    <li className="drag-helper">
      <span className="profile-wrapper">
        <DragHandle />
        <span
          className="profile-icon-container"
          onClick={() => onProfileClick(profile.icon)}
        >
          <span className={`fab fa-${profile.icon}`} />
          <span className="selected-profile-icon">{profile.icon}</span>
        </span>
        <TrashIcon position={position} onDeleteProfile={onDeleteProfile} />
      </span>

      {selectedIcon === profile.icon && profile.isExpanded && (
        <div className="link-form-wrapper">
          <input
            type="text"
            className="social-link-input"
            placeholder={`Enter ${profile.icon} link`}
            value={url}
            onChange={event => onUrlChange(event, profile.icon)}
          />
          <button
            className="save-button"
            onClick={() => onSubmit(profile.icon)}
          >
            Save
          </button>
        </div>
      )}
    </li>
  )
);

const SortableList = SortableContainer(props => {
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
  borderLeft: "1px solid gray",
  lineHeight: "2.5em",
  flex: 2,
  textAlign: "center"
};

SortableComponent.propTypes = {
  profiles: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    link: PropTypes.string,
    isExpanded: PropTypes.bool.isRequired
  }),
  onProfileClick: PropTypes.func.isRequired,
  onDeleteProfile: PropTypes.func.isRequired,
  selectedIcon: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  onUrlChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onProfileAdd: PropTypes.func.isRequired,
  onSortEnd: PropTypes.func.isRequired
};

export default SortableComponent;
