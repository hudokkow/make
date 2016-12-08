<?php
/**
 * @package Make
 */

if ( ! class_exists( 'MAKE_Builder_Sections_Banner_Definition' ) ) :
/**
 * Section definition for Columns
 *
 * Class MAKE_Builder_Sections_Banner_Definition
 */
class MAKE_Builder_Sections_Banner_Definition {
	/**
	 * The one instance of MAKE_Builder_Sections_Banner_Definition.
	 *
	 * @var   MAKE_Builder_Sections_Banner_Definition
	 */
	private static $instance;

	/**
	 * Register the text section.
	 *
	 * Note that in 1.4.0, the "text" section was renamed to "columns". In order to provide good back compatibility,
	 * only the section label is changed to "Columns". All other internal references for this section will remain as
	 * "text".
	 *
	 * @return void
	 */
	public static function register() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	public function __construct() {
		ttfmake_add_section(
			'banner',
			__( 'Banner', 'make' ),
			Make()->scripts()->get_css_directory_uri() . '/builder/sections/images/banner.png',
			__( 'Display multiple types of content in a banner or a slider.', 'make' ),
			array( $this, 'save' ),
			array (
				'banner' => 'sections/banner/builder-template',
				'banner-slide' => 'sections/banner/builder-template-slide'
			),
			'sections/banner/frontend-template',
			300,
			get_template_directory() . '/inc/builder/',
			$this->get_settings(),
			array( 'slide' => $this->get_banner_slide_settings() )
		);

		add_filter( 'make_section_defaults', array( $this, 'section_defaults' ) );
		add_filter( 'make_get_section_json', array ( $this, 'get_section_json' ), 10, 2 );
		add_filter( 'make_builder_js_dependencies', array( $this, 'add_js_dependencies' ) );
	}

	public function get_settings() {
		return array(
			100 => array(
				'type'  => 'section_title',
				'name'  => 'title',
				'label' => __( 'Enter section title', 'make' ),
				'class' => 'ttfmake-configuration-title ttfmake-section-header-title-input',
				'default' => ttfmake_get_section_default( 'title', 'banner' ),
			),
			200 => array(
				'type'    => 'checkbox',
				'label'   => __( 'Hide navigation arrows', 'make' ),
				'name'    => 'hide-arrows',
				'default' => ttfmake_get_section_default( 'hide-arrows', 'banner' ),
			),
			300 => array(
				'type'    => 'checkbox',
				'label'   => __( 'Hide navigation dots', 'make' ),
				'name'    => 'hide-dots',
				'default' => ttfmake_get_section_default( 'hide-dots', 'banner' ),
			),
			400 => array(
				'type'    => 'checkbox',
				'label'   => __( 'Autoplay slideshow', 'make' ),
				'name'    => 'autoplay',
				'default' => ttfmake_get_section_default( 'autoplay', 'banner' ),
			),
			500 => array(
				'type'    => 'text',
				'label'   => __( 'Time between slides (ms)', 'make' ),
				'name'    => 'delay',
				'default' => ttfmake_get_section_default( 'delay', 'banner' ),
			),
			600 => array(
				'type'    => 'select',
				'label'   => __( 'Transition effect', 'make' ),
				'name'    => 'transition',
				'default' => ttfmake_get_section_default( 'transition', 'banner' ),
				'options' => array(
					'scrollHorz' => __( 'Slide horizontal', 'make' ),
					'fade'       => __( 'Fade', 'make' ),
					'none'       => __( 'None', 'make' ),
				)
			),
			700 => array(
				'type'    => 'text',
				'label'   => __( 'Section height (px)', 'make' ),
				'name'    => 'height',
				'default' => ttfmake_get_section_default( 'height', 'banner' ),
			),
			800 => array(
				'type'        => 'select',
				'label'       => __( 'Responsive behavior', 'make' ),
				'name'        => 'responsive',
				'default' => ttfmake_get_section_default( 'responsive', 'banner' ),
				'description' => __( 'Choose how the Banner will respond to varying screen widths. Default is ideal for large amounts of written content, while Aspect is better for showing your images.', 'make' ),
				'options'     => array(
					'balanced' => __( 'Default', 'make' ),
					'aspect'   => __( 'Aspect', 'make' ),
				)
			),
			900 => array(
				'type'  => 'image',
				'name'  => 'background-image',
				'label' => __( 'Background image', 'make' ),
				'class' => 'ttfmake-configuration-media',
				'default' => ttfmake_get_section_default( 'background-image', 'banner' ),
			),
			1000 => array(
				'type'    => 'checkbox',
				'label'   => __( 'Darken background to improve readability', 'make' ),
				'name'    => 'darken',
				'default' => ttfmake_get_section_default( 'darken', 'banner' ),
			),
			1100 => array(
				'type'    => 'select',
				'name'    => 'background-style',
				'label'   => __( 'Background style', 'make' ),
				'default' => ttfmake_get_section_default( 'background-style', 'banner' ),
				'options' => array(
					'tile'  => __( 'Tile', 'make' ),
					'cover' => __( 'Cover', 'make' ),
				),
			),
			1200 => array(
				'type'    => 'color',
				'label'   => __( 'Background color', 'make' ),
				'name'    => 'background-color',
				'class'   => 'ttfmake-gallery-background-color ttfmake-configuration-color-picker',
				'default' => ttfmake_get_section_default( 'background-color', 'banner' ),
			)
		);
	}

	public function get_banner_slide_settings() {
		$inputs = array(
			100 => array(
				'type'    => 'select',
				'name'    => 'alignment',
				'label'   => __( 'Content position', 'make' ),
				'default' => ttfmake_get_section_default( 'alignment', 'banner-slide' ),
				'options' => array(
					'none'  => __( 'None', 'make' ),
					'left'  => __( 'Left', 'make' ),
					'right' => __( 'Right', 'make' ),
				),
			),
			200 => array(
				'type'    => 'checkbox',
				'label'   => __( 'Darken background to improve readability', 'make' ),
				'name'    => 'darken',
				'default' => ttfmake_get_section_default( 'darken', 'banner-slide' )
			),
			300 => array(
				'type'    => 'color',
				'label'   => __( 'Background color', 'make' ),
				'name'    => 'background-color',
				'class'   => 'ttfmake-gallery-background-color ttfmake-configuration-color-picker',
				'default' => ttfmake_get_section_default( 'background-color', 'banner-slide' )
			),
		);

		/**
		 * Filter the definitions of the Banner slide configuration inputs.
		 *
		 * @since 1.4.0.
		 *
		 * @param array    $inputs    The input definition array.
		 */
		$inputs = apply_filters( 'make_banner_slide_configuration', $inputs );

		// Sort the config in case 3rd party code added another input
		ksort( $inputs, SORT_NUMERIC );

		return $inputs;
	}

	public function get_defaults() {
		return array(
			'title' => '',
			'hide-arrows' => 0,
			'hide-dots' => 0,
			'autoplay' => 1,
			'delay' => 6000,
			'transition' => 'scrollHorz',
			'height' => 600,
			'responsive' => 'balanced',
			'background-image' => '',
			'darken' => 0,
			'background-style' => 'tile',
			'background-color' => ''
		);
	}

	public function get_slide_defaults() {
		return array(
			'alignment' => 'none',
			'darken' => 0,
			'background-color' => ''
		);
	}

	/**
	 * Add new section defaults.
	 *
	 * @hooked filter make_section_defaults
	 *
	 * @param array $defaults    The default section defaults.
	 *
	 * @return array             The augmented section defaults.
	 */
	public function section_defaults( $defaults ) {
		$defaults['banner'] = $this->get_defaults();
		$defaults['banner-slide'] = $this->get_slide_defaults();

		return $defaults;
	}

	public function get_section_json( $data, $type ) {
		if ( $type == 'banner' ) {
			if ( isset( $data['background-image'] ) && ( $image_id = intval( $data['background-image'] ) ) > 0 ) {
				$image = ttfmake_get_image_src( $image_id, 'large' );
				$data['background-image-url'] = $image[0];
			}

			if ( isset( $data['banner-slides'] ) && is_array( $data['banner-slides'] ) ) {
				foreach ( $data['banner-slides'] as $s => $slide ) {
					// Handle legacy data layout
					$id = isset( $slide['id'] ) ? $slide['id']: $s;
					$data['banner-slides'][$s]['id'] = $id;

					if ( isset( $slide['image-id'] ) && ( $image_id = intval( $slide['image-id'] ) ) > 0 ) {
						$image = ttfmake_get_image_src( $image_id, 'large' );
						$data['banner-slides'][$s]['image-url'] = $image[0];
					}
				}

				if ( isset( $data['banner-slide-order'] ) ) {
					$ordered_items = array();

					foreach ( $data['banner-slide-order'] as $item_id ) {
						array_push( $ordered_items, $data['banner-slides'][$item_id] );
					}

					$data['banner-slides'] = $ordered_items;
					unset( $data['banner-slide-order'] );
				}
			}
		}

		return $data;
	}

	/**
	 * Save the data for the section.
	 *
	 * @param  array    $data    The data from the $_POST array for the section.
	 * @return array             The cleaned data.
	 */
	public function save( $data ) {
		$clean_data = array();

		$clean_data['title']       = $clean_data['label'] = ( isset( $data['title'] ) ) ? apply_filters( 'title_save_pre', $data['title'] ) : '';
		$clean_data['hide-arrows'] = ( isset( $data['hide-arrows'] ) && 1 === (int) $data['hide-arrows'] ) ? 1 : 0;
		$clean_data['hide-dots']   = ( isset( $data['hide-dots'] ) && 1 === (int) $data['hide-dots'] ) ? 1 : 0;
		$clean_data['autoplay']    = ( isset( $data['autoplay'] ) && 1 === (int) $data['autoplay'] ) ? 1 : 0;

		if ( isset( $data['transition'] ) && in_array( $data['transition'], array( 'fade', 'scrollHorz', 'none' ) ) ) {
			$clean_data['transition'] = $data['transition'];
		}

		if ( isset( $data['delay'] ) ) {
			$clean_data['delay'] = absint( $data['delay'] );
		}

		if ( isset( $data['height'] ) ) {
			$clean_data['height'] = absint( $data['height'] );
		}

		if ( isset( $data['responsive'] ) && in_array( $data['responsive'], array( 'aspect', 'balanced' ) ) ) {
			$clean_data['responsive'] = $data['responsive'];
		}

		if ( isset( $data['background-image'] ) ) {
			$clean_data['background-image'] = ttfmake_sanitize_image_id( $data['background-image'] );
		}

		if ( isset( $data['darken'] ) && (int) $data['darken'] == 1 ) {
			$clean_data['darken'] = 1;
		} else {
			$clean_data['darken'] = 0;
		}

		if ( isset( $data['background-color'] ) ) {
			$clean_data['background-color'] = maybe_hash_hex_color( $data['background-color'] );
		}

		if ( isset( $data['background-style'] ) ) {
			if ( in_array( $data['background-style'], array( 'tile', 'cover' ) ) ) {
				$clean_data['background-style'] = $data['background-style'];
			}
		}

		if ( isset( $data['banner-slides'] ) && is_array( $data['banner-slides'] ) ) {
			$clean_data['banner-slides'] = array();

			foreach ( $data['banner-slides'] as $s => $slide ) {
				// Handle legacy data layout
				$id = isset( $slide['id'] ) ? $slide['id']: $s;

				$clean_slide_data = array( 'id' => $id );

				if ( isset( $slide['content'] ) ) {
					$clean_slide_data['content'] = sanitize_post_field( 'post_content', $slide['content'], ( get_post() ) ? get_the_ID() : 0, 'db' );
				}

				if ( isset( $slide['background-color'] ) ) {
					$clean_slide_data['background-color'] = maybe_hash_hex_color( $slide['background-color'] );
				}

				$clean_slide_data['darken'] = ( isset( $slide['darken'] ) && 1 === (int) $slide['darken'] ) ? 1 : 0;

				if ( isset( $slide['image-id'] ) ) {
					$clean_slide_data['image-id'] = ttfmake_sanitize_image_id( $slide['image-id'] );
				}

				$clean_slide_data['alignment'] = ( isset( $slide['alignment'] ) && in_array( $slide['alignment'], array( 'none', 'left', 'right' ) ) ) ? $slide['alignment'] : 'none';

				if ( isset( $slide['state'] ) ) {
					$clean_slide_data['state'] = ( in_array( $slide['state'], array( 'open', 'closed' ) ) ) ? $slide['state'] : 'open';
				}

				array_push( $clean_data['banner-slides'], $clean_slide_data );
			}
		}

		return $clean_data;
	}

	public function add_js_dependencies( $deps ) {
		if ( ! is_array( $deps ) ) {
			$deps = array();
		}

		wp_register_script(
			'builder-models-banner',
			Make()->scripts()->get_js_directory_uri() . '/builder/sections/models/banner.js',
			array(),
			TTFMAKE_VERSION,
			true
		);

		wp_register_script(
			'builder-models-banner-slide',
			Make()->scripts()->get_js_directory_uri() . '/builder/sections/models/banner-slide.js',
			array(),
			TTFMAKE_VERSION,
			true
		);

		wp_register_script(
			'builder-views-banner-slide',
			Make()->scripts()->get_js_directory_uri() . '/builder/sections/views/banner-slide.js',
			array( 'builder-views-item' ),
			TTFMAKE_VERSION,
			true
		);

		wp_register_script(
			'builder-views-banner',
			Make()->scripts()->get_js_directory_uri() . '/builder/sections/views/banner.js',
			array(),
			TTFMAKE_VERSION,
			true
		);

		return array_merge( $deps, array(
			'builder-models-banner',
			'builder-models-banner-slide',
			'builder-views-banner-slide',
			'builder-views-banner'
		) );
	}
}
endif;