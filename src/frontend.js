document.addEventListener("DOMContentLoaded", function (event) {
	const socialShareLinks = document.querySelectorAll(
		".eb-social-share-wrapper"
	);

	if (!socialShareLinks) return;

	socialShareLinks.forEach(function (socialShareLink) {
		const links = socialShareLink.querySelectorAll("ul.eb-social-shares li a");
		for (let i = 0; i < links.length; i++) {
			/**
			 * No click handler on purpose.
			 *
			 * This used to call `e.preventDefault()` and force every href through
			 * `window.open(link, "", "width=500,height=400,...")`, which is what produced
			 * the small detached browser window -- and it did so for every icon, so the
			 * per-item "Open in new tab" setting could never take effect. Navigation is
			 * now left to the anchor itself: the render callback emits `target="_blank"`
			 * or `target="_self"` from that setting, which is all the browser needs.
			 */

			links[i].addEventListener("mouseenter", function (e) {
				e.preventDefault();
				links[i].classList.add("eb-slide-out");
			});

			links[i].addEventListener("mouseleave", function (e) {
				e.preventDefault();
				links[i].classList.remove("eb-slide-out");
			});
		}
	});
});
