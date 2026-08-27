/**
 * Editor-side mirror of Social_Share_Helper::eb_social_share_name_link()
 * (includes/helpers.php).
 *
 * The frontend href is built in PHP; this exists only so the Inspector can show the author
 * what an item currently points at, as the pre-filled value of the "Override Link" field.
 * The two lists must stay in sync -- if a platform is added to one, add it to the other.
 *
 * The order of the tests matters and matches the PHP: `twitter` is checked before any
 * narrower match because the default icon is `fab fa-x-twitter`, which contains "twitter".
 *
 * One intentional difference: the PHP returns its URLs through `esc_url()`, which is
 * HTML-attribute escaping and turns `&` into `&#038;`. These are shown in a text input and
 * must stay raw, so the values here use plain `&`. That is not drift -- do not "fix" it.
 */

/**
 * `encodeURIComponent` leaves `!'()*` alone; PHP's `rawurlencode` does not. Encode them
 * too so the value shown in the editor is byte-identical to the href PHP will emit.
 *
 * @param {string} value
 * @return {string} percent-encoded value
 */
const rawurlencode = (value) =>
	encodeURIComponent(String(value ?? "")).replace(
		/[!'()*]/g,
		(char) => "%" + char.charCodeAt(0).toString(16).toUpperCase()
	);

/**
 * Build the share URL an icon resolves to when no override link is set.
 *
 * @param {string} icon      Font Awesome class string, e.g. "fab fa-facebook-f".
 * @param {string} postUrl   Permalink of the post being edited.
 * @param {string} postTitle Title of the post being edited.
 * @return {string} the share URL, or "" for a platform this block cannot generate one for.
 */
export const ebGetShareLink = (icon, postUrl, postTitle) => {
	if (typeof icon !== "string" || icon.length === 0) {
		return "";
	}

	const link = rawurlencode(postUrl);
	const title = rawurlencode(postTitle);

	if (/facebook/.test(icon)) {
		return `https://www.facebook.com/sharer/sharer.php?u=${link}`;
	}
	if (/linkedin/.test(icon)) {
		return `https://www.linkedin.com/shareArticle?title=${title}&url=${link}&mini=true`;
	}
	if (/twitter/.test(icon)) {
		return `https://twitter.com/share?text=${title}&url=${link}`;
	}
	if (/pinterest/.test(icon)) {
		return `https://pinterest.com/pin/create/button/?url=${link}`;
	}
	if (/reddit/.test(icon)) {
		return `https://www.reddit.com/submit?url=${link}&title=${title}`;
	}
	if (/tumblr/.test(icon)) {
		return `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${link}`;
	}
	if (/whatsapp/.test(icon)) {
		return `https://api.whatsapp.com/send?text=${title}%20${link}`;
	}
	if (/telegram/.test(icon)) {
		return `https://telegram.me/share/url?url=${link}&text=${title}`;
	}
	if (/pocket/.test(icon)) {
		return `https://getpocket.com/edit?url=${link}`;
	}
	if (/envelope/.test(icon)) {
		return `mailto:?subject=${title}&body=${link}`;
	}
	if (/xing/.test(icon)) {
		return `https://www.xing.com/spi/shares/new?url=${link}`;
	}
	if (/vk/.test(icon)) {
		return `https://vk.com/share.php?url=${link}`;
	}

	return "";
};
