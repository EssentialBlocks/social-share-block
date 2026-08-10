<?php

/**
 * Load google fonts.
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

class Social_Share_Helper
{

    private static $instance;

    /**
     * Registers the plugin.
     */
    public static function register()
    {
        if (null === self::$instance) {
            self::$instance = new self;
        }
        return self::$instance;
    }

    /**
     * The Constructor.
     */
    public function __construct()
    {
        add_action('admin_enqueue_scripts', array($this, 'enqueues'));
    }

    /**
     * Load fonts.
     *
     * @access public
     */
    public function enqueues($hook)
    {
        global $pagenow;

        $query_string = isset($_SERVER['QUERY_STRING']) ? sanitize_text_field(wp_unslash($_SERVER['QUERY_STRING'])) : '';

        /**
         * Only for Admin Add/Edit Pages
         */
        if ($hook == 'post-new.php' || $hook == 'post.php' || $hook == 'site-editor.php' || ($pagenow == 'themes.php' && !empty($query_string) && str_contains($query_string, 'gutenberg-edit-site'))) {

            $controls_asset_path = SOCIAL_SHARE_BLOCKS_ADMIN_PATH . '/dist/modules.asset.php';
            // `include_once` returns bool on a repeat include, so always read the file fresh.
            $controls_dependencies = file_exists($controls_asset_path) ? include $controls_asset_path : [];
            $controls_dependencies = is_array($controls_dependencies) ? $controls_dependencies : [];

            $controls_deps    = isset($controls_dependencies['dependencies']) && is_array($controls_dependencies['dependencies']) ? $controls_dependencies['dependencies'] : [];
            $controls_version = isset($controls_dependencies['version']) ? $controls_dependencies['version'] : SOCIAL_SHARE_BLOCKS_VERSION;

            wp_register_script(
                "eb-social-share-blocks-controls-util",
                SOCIAL_SHARE_BLOCKS_ADMIN_URL . 'dist/modules.js',
                array_merge($controls_deps, ['lodash']),
                $controls_version,
                true
            );

            $eb_settings = get_option('eb_settings', []);
            $eb_settings = is_array($eb_settings) ? $eb_settings : [];

            /**
             * The bundled controls package reads these keys off `EssentialBlocksLocalize`.
             * Every one of them must be present or the editor silently degrades:
             *  - fontAwesome           : icon-picker disables Font Awesome (and blanks existing
             *                            `fab fa-*` values) unless this equals the string "true".
             *  - responsiveBreakpoints : StyleComponent builds `@media (max-width: {n}px)` from
             *                            this; a missing value emits `undefinedpx` and kills every
             *                            tablet/mobile rule in the editor preview.
             *  - googleFont            : toggles the typography font picker.
             */
            wp_localize_script('eb-social-share-blocks-controls-util', 'EssentialBlocksLocalize', array(
                'eb_wp_version' => (float) get_bloginfo('version'),
                'rest_rootURL' => get_rest_url(),
                'fontAwesome' => !empty($eb_settings['fontAwesome']) ? $eb_settings['fontAwesome'] : 'true',
                'googleFont' => !empty($eb_settings['googleFont']) ? $eb_settings['googleFont'] : 'true',
                'responsiveBreakpoints' => self::get_responsive_breakpoints(),
            ));

            if ($hook == 'post-new.php' || $hook == 'post.php') {
                wp_localize_script('eb-social-share-blocks-controls-util', 'eb_conditional_localize', array(
                    'editor_type' => 'edit-post'
                ));
            } else if ($hook == 'site-editor.php' || $pagenow == 'themes.php') {
                wp_localize_script('eb-social-share-blocks-controls-util', 'eb_conditional_localize', array(
                    'editor_type' => 'edit-site'
                ));
            }

			wp_register_style(
				'essential-blocks-iconpicker-css',
				SOCIAL_SHARE_BLOCKS_ADMIN_URL . 'dist/style-modules.css',
				[],
				SOCIAL_SHARE_BLOCKS_VERSION,
				'all'
			);


            wp_enqueue_style(
                'essential-blocks-editor-css',
                SOCIAL_SHARE_BLOCKS_ADMIN_URL . 'dist/modules.css',
                array('essential-blocks-iconpicker-css','fontawesome-frontend-css'),
                $controls_version,
                'all'
            );
        }
    }
    /**
     * Responsive breakpoints used by the editor style generator.
     *
     * Mirrors EbStyleHandlerParseCss::get_responsive_breakpoints() so the media queries
     * rendered in the editor match the ones written into the generated frontend CSS.
     * Read-only on purpose — the style handler owns writing the default back to the option.
     *
     * @return array{tablet:int,mobile:int}
     */
    public static function get_responsive_breakpoints()
    {
        $defaults = array('tablet' => 1024, 'mobile' => 767);

        $settings = get_option('eb_settings', []);
        if (!is_array($settings) || !isset($settings['responsiveBreakpoints'])) {
            return $defaults;
        }

        $breakpoints = $settings['responsiveBreakpoints'];
        if (is_string($breakpoints)) {
            if (strlen($breakpoints) === 0) {
                return $defaults;
            }
            $breakpoints = json_decode(html_entity_decode(stripslashes($breakpoints)), true);
        }
        $breakpoints = (array) $breakpoints;

        return array(
            'tablet' => isset($breakpoints['tablet']) ? (int) $breakpoints['tablet'] : $defaults['tablet'],
            'mobile' => isset($breakpoints['mobile']) ? (int) $breakpoints['mobile'] : $defaults['mobile'],
        );
    }

    /**
     * Get Social Shareable link
     *
     * @param int $id current post/page id
     * @param string $icon_text icon text to find the icon name
     *
     * @return string shareable link
     */
    public static function eb_social_share_name_link($id, $icon_text)
    {
        $icon_text = is_string($icon_text) ? $icon_text : '';

        if (empty($icon_text)) {
            return '';
        }

        /**
         * Both values land inside query-string parameters, so they must be percent-encoded.
         * Interpolated raw, a title containing "&", "?" or "#" is read as a parameter
         * separator by the receiving network and the shared text is silently truncated.
         */
        $post_title = rawurlencode((string) get_the_title($id));
        $post_link = rawurlencode((string) get_the_permalink($id));

        if (preg_match('/facebook/', $icon_text)) {
            return esc_url('https://www.facebook.com/sharer/sharer.php?u=' . $post_link);
        } elseif (preg_match('/linkedin/', $icon_text)) {
            return esc_url('https://www.linkedin.com/shareArticle?title=' . $post_title . "&url=" . $post_link . '&mini=true');
        } elseif (preg_match('/twitter/', $icon_text)) {
            return esc_url("https://twitter.com/share?text=" . $post_title . "&url=" . $post_link);
        } elseif (preg_match('/pinterest/', $icon_text)) {
            return esc_url('https://pinterest.com/pin/create/button/?url=' . $post_link);
        } elseif (preg_match('/reddit/', $icon_text)) {
            return esc_url('https://www.reddit.com/submit?url=' . $post_link . "&title=" . $post_title);
        } elseif (preg_match('/tumblr/', $icon_text)) {
            return esc_url('https://www.tumblr.com/widgets/share/tool?canonicalUrl=' . $post_link);
        } elseif (preg_match('/whatsapp/', $icon_text)) {
            return esc_url('https://api.whatsapp.com/send?text=' . $post_title . "%20" . $post_link);
        } elseif (preg_match('/telegram/', $icon_text)) {
            return esc_url('https://telegram.me/share/url?url=' . $post_link . '&text=' . $post_title);
        } elseif (preg_match('/pocket/', $icon_text)) {
            return esc_url('https://getpocket.com/edit?url=' . $post_link);
        } elseif (preg_match('/envelope/', $icon_text)) {
            return esc_url('mailto:?subject=' . $post_title . '&body=' . $post_link);
        } elseif (preg_match('/xing/', $icon_text)) {
            return esc_url('https://www.xing.com/spi/shares/new?url=' . $post_link);
        } elseif (preg_match('/vk/', $icon_text)) {
            return esc_url('https://vk.com/share.php?url=' . $post_link);
        }

        return '';
    }
    public static function get_block_register_path($blockname, $blockPath)
    {
        if ((float) get_bloginfo('version') <= 5.6) {
            return $blockname;
        } else {
            return $blockPath;
        }
    }
}
Social_Share_Helper::register();