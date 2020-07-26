<?php
/**
 * Plugin Name:     Social
 * Description:     Enable one-click social sharing option to grow your audience
 * Version:         0.1.0
 * Author:          The WordPress Contributors
 * License:         GPL-2.0-or-later
 * License URI:     https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     social-share-block
 *
 * @package         block
 */

/**
 * Registers all block assets so that they can be enqueued through the block editor
 * in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/applying-styles-with-stylesheets/
 */
function create_block_social_block_init() {
	$dir = dirname( __FILE__ );

	$script_asset_path = "$dir/build/index.asset.php";
	if ( ! file_exists( $script_asset_path ) ) {
		throw new Error(
			'You need to run `npm start` or `npm run build` for the "block/social-share-block" block first.'
		);
	}
	$index_js     = 'build/index.js';
	$script_asset = require( $script_asset_path );
	wp_register_script(
		'create-block-social-block-editor',
		plugins_url( $index_js, __FILE__ ),
		$script_asset['dependencies'],
		$script_asset['version']
	);

	$style_css = 'build/style-index.css';
	wp_register_style(
		'create-block-social-block',
		plugins_url( $style_css, __FILE__ ),
		array(),
		filemtime( "$dir/$style_css" )
	);

	$fontpicker_theme = 'src/css/fonticonpicker.base-theme.react.css';
	wp_enqueue_style(
		'fontpicker-default-theme',
		plugins_url( $fontpicker_theme, __FILE__),
		array()
	);

	$fontpicker_material_theme = 'src/css/fonticonpicker.material-theme.react.css';
	wp_enqueue_style(
		'fontpicker-matetial-theme',
		plugins_url( $fontpicker_material_theme, __FILE__),
		array()
	);

	$fontawesome_css = 'src/css/font-awesome5.css';
	wp_enqueue_style(
		'fontawesome-frontend-css',
		plugins_url( $fontawesome_css, __FILE__),
		array()
	);

  $hover_css = 'src/css/hover-min.css';
  wp_enqueue_style(
      'essential-blocks-hover-css',
      plugins_url($hover_css, __FILE__),
      array('wp-editor')
  );

	if( ! WP_Block_Type_Registry::get_instance()->is_registered( 'essential-blocks/social' ) ) {
    register_block_type( 'block/social-share-block', array(
      'editor_script'             => 'create-block-social-block-editor',
      'editor_style'              => 'create-block-social-block-editor',
      'style'                     => 'create-block-social-block',
      'fontpicker_theme'          => 'fontpicker-default-theme',
      'fontpicker_material_theme' => 'fontpicker-material-theme',
      'fontawesome_css'           => 'fontawesome-frontend-css',
    ) );
  }
}

add_action( 'init', 'create_block_social_block_init' );
