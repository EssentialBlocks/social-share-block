<?php

    /**
     * Plugin Name:     Social Share Block
     * Description:     Share your posts & pages instantly on popular social platforms in one click from your website.
     * Version:         2.1.0
     * Author:          WPDeveloper
     * Author URI:         https://wpdeveloper.net
     * License:         GPL-3.0-or-later
     * License URI:     https://www.gnu.org/licenses/gpl-3.0.html
     * Text Domain:     social-share-block
     * Requires at least: 6.0
     * Requires PHP:   7.4
     * Tested up to:   7.1
     *
     * @package         social-share-block
     */

    // Exit if accessed directly.
    if ( ! defined( 'ABSPATH' ) ) {
        exit;
    }

    /**
     * Registers all block assets so that they can be enqueued through the block editor
     * in the corresponding context.
     *
     * @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/applying-styles-with-stylesheets/
     */

    require_once __DIR__ . '/includes/font-loader.php';
    require_once __DIR__ . '/includes/post-meta.php';
    require_once __DIR__ . '/includes/helpers.php';

    /**
     * The style handler ships as a git submodule (lib/style-handler).
     *
     * It is not optional: every layout, size, spacing, colour and responsive rule for the
     * block is generated into the `blockMeta` attribute and written to a per-post stylesheet
     * by EbStyleHandler. Without it the block renders completely unstyled on the frontend.
     * Requiring it unconditionally fataled when the submodule was left uninitialised, so guard
     * the require and make the failure visible instead of silent.
     */
    if ( file_exists( __DIR__ . '/lib/style-handler/style-handler.php' ) ) {
        require_once __DIR__ . '/lib/style-handler/style-handler.php';
    } else {
        add_action( 'admin_notices', 'social_share_block_missing_style_handler_notice' );
    }

    /**
     * Warn that the style-handler submodule is missing from this build.
     */
    function social_share_block_missing_style_handler_notice() {
        if ( ! current_user_can( 'activate_plugins' ) ) {
            return;
        }
        echo '<div class="notice notice-error"><p><strong>Social Share Block:</strong> ';
        echo esc_html__( 'the style-handler library is missing from this build, so blocks will render unstyled on the frontend. Re-package the plugin with its git submodules initialised (git submodule update --init --recursive).', 'social-share-block' );
        echo '</p></div>';
    }

    function create_block_social_share_block_init() {

        if ( ! defined( 'SOCIAL_SHARE_BLOCKS_VERSION' ) ) {
            define( 'SOCIAL_SHARE_BLOCKS_VERSION', "2.1.0" );
        }
        if ( ! defined( 'SOCIAL_SHARE_BLOCKS_ADMIN_URL' ) ) {
            define( 'SOCIAL_SHARE_BLOCKS_ADMIN_URL', plugin_dir_url( __FILE__ ) );
        }
        if ( ! defined( 'SOCIAL_SHARE_BLOCKS_ADMIN_PATH' ) ) {
            define( 'SOCIAL_SHARE_BLOCKS_ADMIN_PATH', dirname( __FILE__ ) );
        }

        $script_asset_path = SOCIAL_SHARE_BLOCKS_ADMIN_PATH . "/dist/index.asset.php";
        if ( ! file_exists( $script_asset_path ) ) {
            throw new Error(
                'You need to run `npm start` or `npm run build` for the "social-share-block/social-share" block first.'
            );
        }

        $index_js         = SOCIAL_SHARE_BLOCKS_ADMIN_URL . 'dist/index.js';
        $script_asset     = require $script_asset_path;
        $all_dependencies = array_merge( $script_asset['dependencies'], [
            'wp-blocks',
            'wp-i18n',
            'wp-element',
            'wp-block-editor',
            'eb-social-share-blocks-controls-util',
            'essential-blocks-eb-animation'
        ] );

        wp_register_script(
            'eb-social-share-block-editor',
            $index_js,
            $all_dependencies,
            $script_asset['version']
        );

        $load_animation_js = SOCIAL_SHARE_BLOCKS_ADMIN_URL . 'assets/js/eb-animation-load.js';
        wp_register_script(
            'essential-blocks-eb-animation',
            $load_animation_js,
            [],
            SOCIAL_SHARE_BLOCKS_VERSION,
            true
        );

        $animate_css = SOCIAL_SHARE_BLOCKS_ADMIN_URL . 'assets/css/animate.min.css';
        wp_register_style(
            'essential-blocks-animation',
            $animate_css,
            [],
            SOCIAL_SHARE_BLOCKS_VERSION
        );

        $fontpicker_theme = 'assets/css/fonticonpicker.base-theme.react.css';
        wp_register_style(
            'fontpicker-default-theme',
            plugins_url( $fontpicker_theme, __FILE__ ),
            []
        );

        $fontpicker_material_theme = 'assets/css/fonticonpicker.material-theme.react.css';
        wp_register_style(
            'fontpicker-matetial-theme',
            plugins_url( $fontpicker_material_theme, __FILE__ ),
            []
        );

        // Registered, not enqueued: both the editor style and the frontend style already
        // declare this as a dependency, so it loads exactly where it is needed. Enqueueing it
        // here put it on every page of the site, and the bogus `wp-editor` dependency dragged
        // the whole block-editor stylesheet onto the frontend with it.
        $hover_css = 'assets/css/hover-min.css';
        wp_register_style(
            'essential-blocks-hover-css',
            plugins_url( $hover_css, __FILE__ ),
            [],
            SOCIAL_SHARE_BLOCKS_VERSION
        );

        $editor_css      = 'dist/style.css';
        $editor_css_path = SOCIAL_SHARE_BLOCKS_ADMIN_PATH . "/$editor_css";
        wp_register_style(
            'eb-social-share-block-editor-style',
            plugins_url( $editor_css, __FILE__ ),
            [ 'fontpicker-default-theme', 'fontpicker-matetial-theme', 'essential-blocks-hover-css' ],
            file_exists( $editor_css_path ) ? filemtime( $editor_css_path ) : SOCIAL_SHARE_BLOCKS_VERSION
        );

        $fontawesome_css = 'assets/css/fontawesome/css/all.min.css';
        wp_register_style(
            'fontawesome-frontend-css',
            plugins_url( $fontawesome_css, __FILE__ ),
            []
        );

        $style_css = SOCIAL_SHARE_BLOCKS_ADMIN_URL . 'dist/style.css';
        wp_register_style(
            'create-block-social-share-block',
            $style_css,
            [ 'fontawesome-frontend-css', 'essential-blocks-animation', 'essential-blocks-hover-css' ],
            file_exists( $editor_css_path ) ? filemtime( $editor_css_path ) : SOCIAL_SHARE_BLOCKS_VERSION
        );

        //Frontend Style
        $frontend_js         = SOCIAL_SHARE_BLOCKS_ADMIN_URL . 'dist/frontend/index.js';
        $frontend_asset_path = SOCIAL_SHARE_BLOCKS_ADMIN_PATH . '/dist/frontend/index.asset.php';
        $frontend_asset      = file_exists( $frontend_asset_path ) ? require $frontend_asset_path : [];
        wp_register_script(
            'social-share-block-frontend-js',
            $frontend_js,
            isset( $frontend_asset['dependencies'] ) ? $frontend_asset['dependencies'] : [],
            isset( $frontend_asset['version'] ) ? $frontend_asset['version'] : SOCIAL_SHARE_BLOCKS_VERSION,
            true
        );

        /**
         * Idempotency guard for the block this plugin owns.
         *
         * It used to test `essential-blocks/social-share`, a name this plugin never registers.
         * That check could never match its own block, and when Essential Blocks was active it
         * matched *their* block and skipped registration entirely — stranding every
         * `social-share-block/social-share` already saved in post content as an unsupported
         * block. Guard on the name actually registered below, kept in one variable so the two
         * cannot drift apart again.
         */
        $block_name = 'social-share-block/social-share';

        if ( ! WP_Block_Type_Registry::get_instance()->is_registered( $block_name ) ) {
            register_block_type(
                Social_Share_Helper::get_block_register_path( $block_name, SOCIAL_SHARE_BLOCKS_ADMIN_PATH ),
                [
                    'editor_script'   => 'eb-social-share-block-editor',
                    'editor_style'    => 'eb-social-share-block-editor-style',
                    'style'           => 'create-block-social-share-block',
                    'render_callback' => 'eb_social_share_render_callback'
                ]
            );
        }
    }
    add_action( 'init', 'create_block_social_share_block_init' );

    /**
     * Render Callback Function for Social Share Block.
     *
     * @param array $attributes attributes of block
     * @param string $content
     *
     * @return string content of the block
     */
    function eb_social_share_render_callback( $attributes = [], $content = '' ) {
        ob_start();
        if ( ! is_admin() ) {
            wp_enqueue_style( 'fontawesome-frontend-css' );
            wp_enqueue_script( 'social-share-block-frontend-js' );
            wp_enqueue_script( 'essential-blocks-eb-animation' );
        }

        global $post;
        $attributes   = is_array( $attributes ) ? $attributes : [];
        $post_id      = isset( $post->ID ) ? $post->ID : 0;
        $profilesOnly = ! empty( $attributes['profilesOnly'] ) ? $attributes['profilesOnly'] : [];
        $iconEffect   = ! empty( $attributes['icnEffect'] ) ? $attributes['icnEffect'] : '';
        $blockId      = isset( $attributes['blockId'] ) ? $attributes['blockId'] : '';
        $classHook    = ! empty( $attributes['classHook'] ) ? $attributes['classHook'] : '';
        $showTitle    = isset( $attributes['showTitle'] ) ? $attributes['showTitle'] : true;
        $isFloating   = isset( $attributes['isFloating'] ) ? $attributes['isFloating'] : false;
        $iconShape    = isset( $attributes['iconShape'] ) ? $attributes['iconShape'] : '';

    ?>
<div<?php echo get_block_wrapper_attributes(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- core escapes this. ?>>
    <div class="eb-parent-wrapper eb-parent-<?php echo esc_attr( $blockId ); ?> <?php echo esc_attr( $classHook ); ?>">
        <div
            class="<?php echo esc_attr( $blockId ); ?> eb-social-share-wrapper<?php echo $isFloating ? esc_attr( ' eb-social-share-floating' ) : ''; ?><?php echo $isFloating && 'circular' == $iconShape ? esc_attr( ' eb-social-share-circular' ) : "" ?>">
            <ul class="eb-social-shares">
                <?php
                        foreach ( $profilesOnly as $profile ) {
                                $profile     = is_array( $profile ) ? $profile : [];
                                $profileIcon = isset( $profile['icon'] ) ? (string) $profile['icon'] : '';
                                $matches     = [];
                                preg_match( '/fa-([\w\-]+)/', $profileIcon, $matches );
                                $iconClass = is_array( $matches ) && ! empty( $matches[1] ) ? $matches[1] . '-original' : '';

                                /**
                                 * An override link entered on the item wins; otherwise fall back to
                                 * the generated share URL for the current post, which is what this
                                 * block did for every item before the field existed.
                                 *
                                 * Escape first, then decide. `esc_url()` empties anything outside
                                 * `wp_allowed_protocols()`, so a `javascript:` value must be treated
                                 * as "no override" and fall back to the share URL rather than leave
                                 * a dead anchor behind. `esc_url()` is idempotent, so the escaped
                                 * value is safe to echo directly below.
                                 *
                                 * `is_string()` guard, not a `(string)` cast: `profilesOnly` reaches
                                 * PHP straight from post content with no server-side schema (see
                                 * WP_Block_Type::prepare_attributes_for_render(), which skips
                                 * undeclared attributes), so a hand-edited `"link": []` would raise
                                 * "Array to string conversion". Same guard style as
                                 * Social_Share_Helper::eb_social_share_name_link().
                                 */
                                $customLink = isset( $profile['link'] ) && is_string( $profile['link'] )
                                    ? esc_url( trim( $profile['link'] ) )
                                    : '';
                                $isCustom = '' !== $customLink;
                                $href     = $isCustom
                                    ? $customLink
                                    : esc_url( Social_Share_Helper::eb_social_share_name_link( $post_id, $profileIcon ) );

                                /**
                                 * `linkOpenNewTab` defaults to true when the key is absent: items
                                 * saved before the toggle existed were rendered with a hardcoded
                                 * target="_blank" and must stay that way.
                                 *
                                 * The target is the only thing that decides where the link opens --
                                 * there is deliberately no click handler on the frontend any more.
                                 */
                                $openNewTab = isset( $profile['linkOpenNewTab'] ) ? (bool) $profile['linkOpenNewTab'] : true;

                                /**
                                 * nofollow belongs on a share endpoint, not on the author's own
                                 * destination. `noopener noreferrer` only earns its place on a new
                                 * tab: on a same-tab navigation there is no opener to sever, and
                                 * `noreferrer` would strip the Referer header and blank the site
                                 * owner's own referral analytics for their own link.
                                 */
                                if ( ! $isCustom ) {
                                    $linkRel = 'nofollow noopener noreferrer';
                                } elseif ( $openNewTab ) {
                                    $linkRel = 'noopener noreferrer';
                                } else {
                                    $linkRel = '';
                                }
                            ?>
                <li>
                    <a class="<?php echo esc_attr( $iconClass ); ?><?php echo " " . esc_attr( $iconEffect ); ?>"
                        <?php
                            // An unmapped platform with no override has nowhere to go; emitting
                            // href="" would reload the current page on click.
                            if ( '' !== $href ) {
                                echo 'href="' . $href . '" '; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- esc_url() applied above.
                            }
                            echo 'target="' . ( $openNewTab ? '_blank' : '_self' ) . '"';
                            if ( '' !== $linkRel ) {
                                echo ' rel="' . esc_attr( $linkRel ) . '"';
                            }
                        ?>>
                        <i
                            class="hvr-icon eb-social-share-icon								                                        <?php echo esc_attr( $profileIcon ); ?>"></i>
                        <?php
                                if ( ! empty( $showTitle && ! empty( $profile['iconText'] ) ) ) {?>
                        <span class="eb-social-share-text"><?php echo esc_html( $profile['iconText'] ); ?></span>
                        <?php }?>
                    </a>
                </li>
                <?php }?>
            </ul>
        </div>
    </div>
    </div>
    <?php
    return ob_get_clean();
}
