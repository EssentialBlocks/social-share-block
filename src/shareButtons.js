import { useState } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import SortableComponent from "./SortableComponent";
import { __ } from "@wordpress/i18n";
import { ebGetShareLink } from "./constants/shareLinks";
const { EBIconPicker } = window.EBSocialShareControls;

export default function SocialProfiles({
    onProfileAdd,
    profiles: propProfiles,
}) {
    /**
     * The `socialDetails` attribute is the single source of truth -- this component holds no
     * copy of it.
     *
     * It used to seed `useState(propProfiles || [])`, which reads the prop once on mount and
     * never again. On a freshly inserted block that prop is still the `[]` default (Edit only
     * writes the four starter profiles in its own mount effect), so the panel stayed empty
     * while the canvas showed four icons -- and the first icon added overwrote them. Existing
     * blocks fared no better: after an undo the fields kept showing values the attribute no
     * longer had. Reading the prop directly removes the whole class of bug.
     */
    const profiles = Array.isArray(propProfiles) ? propProfiles : [];

    /**
     * Which item's settings panel is open. Local on purpose: expanding a panel is a viewing
     * preference, so it must not mark the post dirty. (The legacy `isExpanded` key is still
     * written by Edit/Inspector on mount and simply ignored here.)
     */
    const [selectedIcon, setSelectedIcon] = useState(null);

    /**
     * Used to pre-fill the "Override Link" field with the URL an item resolves to today, so
     * an author can see and edit it rather than guess. Mirrors what the render callback
     * computes; see src/constants/shareLinks.js.
     */
    const { postUrl, postTitle } = useSelect((select) => {
        const editor = select("core/editor");

        return {
            postUrl: editor?.getPermalink?.() || "",
            postTitle: editor?.getEditedPostAttribute?.("title") || "",
        };
    }, []);

    const getDefaultLink = (icon) => ebGetShareLink(icon, postUrl, postTitle);

    /**
     * Replace one profile without mutating it. The previous handlers did
     * `newProfiles[index].link = value` -- the array was copied but the profile object was
     * not, so the write landed on the very object held by the block-editor store and by
     * earlier undo-history entries, corrupting them.
     */
    const updateProfile = (index, patch) => {
        const newProfiles = profiles.map((profile, i) =>
            i === index ? { ...profile, ...patch } : profile
        );

        onProfileAdd(newProfiles);
    };

    const onSelectIcon = (selectedIcon) => {
        // When a social profile icon is selected, store it in state and pass it
        // to the callback function

        if (selectedIcon) {
            // `link` and `linkOpenNewTab` are deliberately not seeded: an absent `link` means
            // "no override" and an absent `linkOpenNewTab` means "new tab", which is exactly
            // what a new item should be, in the same shape as the starter profiles in Edit.
            const newProfiles = [...profiles, { icon: selectedIcon }];

            setSelectedIcon(selectedIcon);
            onProfileAdd(newProfiles);
        }
    };

    const onDeleteProfile = (position) => {
        // Remove clicked social profile, store rest of the
        // profiles in state, and pass deleted profile name to the callback function
        onProfileAdd(profiles.filter((profile, i) => i !== position));
    };

    const onProfileClick = (icon) => {
        // Accordion: clicking the open item closes it, clicking another switches to it.
        // Purely local -- no attribute is written, so browsing the panel leaves the post clean.
        setSelectedIcon((current) => (current === icon ? null : icon));
    };

    const onIconTextChange = (iconText, index) => {
        updateProfile(index, { iconText: iconText });
    };

    const onLinkChange = (link, index) => {
        updateProfile(index, { link: link });
    };

    const onLinkTargetChange = (linkOpenNewTab, index) => {
        updateProfile(index, { linkOpenNewTab: linkOpenNewTab });
    };

    const onSortEnd = ({ oldIndex, newIndex }) => {
        // Rearrange profiles array after drag and drop, pass
        // updated array to edit view
        const newProfiles = [...profiles];
        newProfiles.splice(newIndex, 0, newProfiles.splice(oldIndex, 1)[0]);

        onProfileAdd(newProfiles);
    };

    const onColorChange = (color, index) => {
        updateProfile(index, { color: color });
    };

    const onBackgroundColorChange = (bgColor, index) => {
        updateProfile(index, { backgroundColor: bgColor });
    };

    const onSeparatorColorChange = (separatorColor, index) => {
        updateProfile(index, { separatorColor: separatorColor });
    };

    return (
        <div>
            <style>{`

      li.drag-helper .iconLbl{
        color: #5f5f5f;
        padding-bottom: 5px;
        display: block;
      }

      li.drag-helper .input_wrapp{
        display: flex;
        align-items:center;
      }

      li.drag-helper .save-button{
        margin:0;
        padding: 4px;
        cursor:pointer;
      }

      li.drag-helper .social-link-input{
        margin: 0;
        flex: 1;
        padding: 0px 5px;
      }

      .socialBarsLabel{
        display:block;
        padding: 15px 0 5px;
        cursor:default;
      }


      `}</style>

            <EBIconPicker
                // icons={{ fontAwesome: iconList }}
                // disableDashicon={true}
                value={selectedIcon || null}
                onChange={onSelectIcon}
                title={__("Social Media", "essential-blocks")}
            />

            {profiles.length > 0 && (
                <label className="socialBarsLabel">
                    <i>
                        {__(
                            "Click on the social bars below to expand more options",
                            "essential-blocks"
                        )}
                    </i>
                </label>
            )}

            <SortableComponent
                profiles={profiles}
                onProfileClick={onProfileClick}
                onDeleteProfile={onDeleteProfile}
                selectedIcon={selectedIcon}
                getDefaultLink={getDefaultLink}
                onIconTextChange={onIconTextChange}
                onLinkChange={onLinkChange}
                onLinkTargetChange={onLinkTargetChange}
                onProfileAdd={onProfileAdd}
                onSortEnd={onSortEnd}
                onColorChange={onColorChange}
                onBackgroundColorChange={onBackgroundColorChange}
                onSeparatorColorChange={onSeparatorColorChange}
            />
        </div>
    );
}
