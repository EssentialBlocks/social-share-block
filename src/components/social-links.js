const { EBDisplayIcon } = window.EBSocialShareControls;
export default function socialLinks({ profilesOnly, icnEffect, showTitle }) {
	/**
	 * No href/target here on purpose. This preview renders inside the editor canvas, which
	 * this block does not iframe (block.json declares no apiVersion), so a real href would
	 * be a live link: clicking an icon while editing would open a tab, or with _self
	 * navigate away from the unsaved post. The frontend anchor is built in PHP.
	 */
	return (
		<ul className="eb-social-shares">
			{profilesOnly.map(({ icon, iconText }, index) => (
				<li key={index}>
					<a
						className={`${((icon || " ").match(/fa-([\w\-]+)/i) || [" ", " "])[1]
							}-original ${icnEffect || " "}`}
						rel="noopener"
					>
						<EBDisplayIcon className={`hvr-icon eb-social-share-icon`} icon={icon} />
						{showTitle && iconText && (
							<>
								<span className="eb-social-share-text">{iconText}</span>
							</>
						)}
					</a>
				</li>
			))}
		</ul>
	);
}
