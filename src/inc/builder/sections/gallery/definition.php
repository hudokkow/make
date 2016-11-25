<?php
/**
 * @package Make
 */

if ( ! class_exists( 'MAKE_Builder_Sections_Gallery_Definition' ) ) :
/**
 * Section definition for Columns
 *
 * Class MAKE_Builder_Sections_Gallery_Definition
 */
class MAKE_Builder_Sections_Gallery_Definition {
	/**
	 * The one instance of MAKE_Builder_Sections_Gallery_Definition.
	 *
	 * @var   MAKE_Builder_Sections_Gallery_Definition
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
			'gallery',
			__( 'Gallery', 'make' ),
			Make()->scripts()->get_css_directory_uri() . '/builder/sections/images/gallery.png',
			__( 'Display your images in various grid combinations.', 'make' ),
			array( $this, 'save' ),
			array(
				'gallery' => 'sections/gallery/builder-template',
				'gallery-item' => 'sections/gallery/builder-template-item'
			),
			'sections/gallery/frontend-template',
			400,
			get_template_directory() . '/inc/builder/',
			$this->get_settings()
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
				'default' => ttfmake_get_section_default( 'title', 'gallery' )
			),
			200 => array(
				'type'    => 'select',
				'name'    => 'columns',
				'label'   => __( 'Columns', 'make' ),
				'class'   => 'ttfmake-gallery-columns',
				'default' => ttfmake_get_section_default( 'columns', 'gallery' ),
				'options' => array(
					1 => 1,
					2 => 2,
					3 => 3,
					4 => 4,
				)
			),
			300 => array(
				'type'    => 'select',
				'name'    => 'aspect',
				'label'   => __( 'Aspect ratio', 'make' ),
				'default' => ttfmake_get_section_default( 'aspect', 'gallery' ),
				'options' => array(
					'square'    => __( 'Square', 'make' ),
					'landscape' => __( 'Landscape', 'make' ),
					'portrait'  => __( 'Portrait', 'make' ),
					'none'      => __( 'None', 'make' ),
				)
			),
			400 => array(
				'type'    => 'select',
				'name'    => 'captions',
				'label'   => __( 'Caption style', 'make' ),
				'default' => ttfmake_get_section_default( 'captions', 'gallery' ),
				'options' => array(
					'reveal'  => __( 'Reveal', 'make' ),
					'overlay' => __( 'Overlay', 'make' ),
					'none'    => __( 'None', 'make' ),
				)
			),
			500 => array(
				'type'    => 'select',
				'name'    => 'caption-color',
				'label'   => __( 'Caption color', 'make' ),
				'default' => ttfmake_get_section_default( 'caption-color', 'gallery' ),
				'options' => array(
					'light'  => __( 'Light', 'make' ),
					'dark' => __( 'Dark', 'make' ),
				)
			),
			600 => array(
				'type'  => 'image',
				'name'  => 'background-image',
				'label' => __( 'Background image', 'make' ),
				'class' => 'ttfmake-configuration-media',
				'default' => ttfmake_get_section_default( 'background-image', 'gallery' )
			),
			700 => array(
				'type'    => 'checkbox',
				'label'   => __( 'Darken background to improve readability', 'make' ),
				'name'    => 'darken',
				'default' => ttfmake_get_section_default( 'darken', 'gallery' ),
			),
			800 => array(
				'type'    => 'select',
				'name'    => 'background-style',
				'label'   => __( 'Background style', 'make' ),
				'default' => ttfmake_get_section_default( 'background-style', 'gallery' ),
				'options' => array(
					'tile'  => __( 'Tile', 'make' ),
					'cover' => __( 'Cover', 'make' ),
				),
			),
			900 => array(
				'type'    => 'color',
				'label'   => __( 'Background color', 'make' ),
				'name'    => 'background-color',
				'class'   => 'ttfmake-gallery-background-color ttfmake-configuration-color-picker',
				'default' => ttfmake_get_section_default( 'background-color', 'gallery' )
			),

			'item' => $this->get_item_settings(),
		);
	}

	public function get_item_settings() {
		/**
		 * Filter the definitions of the Gallery item configuration inputs.
		 *
		 * @since 1.4.0.
		 *
		 * @param array    $inputs    The input definition array.
		 */
		$inputs = apply_filters( 'make_gallery_item_configuration', array(
			100 => array(
				'type'    => 'section_title',
				'name'    => 'title',
				'label'   => __( 'Enter item title', 'make' ),
				'default' => ttfmake_get_section_default( 'title', 'gallery-item' ),
				'class'   => 'ttfmake-configuration-title',
			),
			200 => array(
				'type'    => 'text',
				'name'    => 'link',
				'label'   => __( 'Item link URL', 'make' ),
				'default' => ttfmake_get_section_default( 'link', 'gallery-item' ),
			),
		) );

		// Sort the config in case 3rd party code added another input
		ksort( $inputs, SORT_NUMERIC );

		return $inputs;
	}

	public function get_defaults() {
		return array(
			'title' => '',
			'columns' => 3,
			'aspect' => 'square',
			'captions' => 'reveal',
			'caption-color' => 'light',
			'background-image' => '',
			'darken' => 0,
			'background-style' => 'tile',
			'background-color' => ''
		);
	}

	public function get_item_defaults() {
		return array(
			'title' => '',
			'link' => ''
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
		$defaults['gallery'] = $this->get_defaults();
		$defaults['gallery-item'] = $this->get_item_defaults();

		return $defaults;
	}

	public function get_section_json( $data, $type ) {
		if ( $type == 'gallery' ) {
			if ( isset( $data['background-image'] ) && ( $image_id = intval( $data['background-image'] ) ) > 0 ) {
				$image = ttfmake_get_image_src( $image_id, 'large' );
				$data['background-image-url'] = $image[0];
			}

			if ( isset( $data['gallery-items'] ) && is_array( $data['gallery-items'] ) ) {
				if ( isset( $data['gallery-item-order'] ) ) {
					$ordered_items = array();

					foreach ( $data['gallery-item-order'] as $item_id ) {
						array_push( $ordered_items, $data['gallery-items'][$item_id] );
					}

					$data['gallery-items'] = $ordered_items;
					unset( $data['gallery-item-order'] );
				}

				foreach ( $data['gallery-items'] as $s => $item ) {
					// Handle legacy data layout
					$id = isset( $item['id'] ) ? $item['id']: $s;
					$data['gallery-items'][$s]['id'] = $id;

					if ( isset( $item['image-id'] ) && ( $image_id = intval( $item['image-id'] ) ) > 0  ) {
						$image = ttfmake_get_image_src( $image_id, 'large' );
						$data['gallery-items'][$s]['image-url'] = $image[0];
					}
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

		if ( isset( $data['columns'] ) ) {
			if ( in_array( $data['columns'], range( 1, 4 ) ) ) {
				$clean_data['columns'] = $data['columns'];
			}
		}

		if ( isset( $data['caption-color'] ) ) {
			if ( in_array( $data['caption-color'], array( 'light', 'dark' ) ) ) {
				$clean_data['caption-color'] = $data['caption-color'];
			}
		}

		if ( isset( $data['captions'] ) ) {
			if ( in_array( $data['captions'], array( 'none', 'overlay', 'reveal' ) ) ) {
				$clean_data['captions'] = $data['captions'];
			}
		}

		if ( isset( $data['aspect'] ) ) {
			if ( in_array( $data['aspect'], array( 'none', 'landscape', 'portrait', 'square' ) ) ) {
				$clean_data['aspect'] = $data['aspect'];
			}
		}

		if ( isset( $data['background-image'] ) ) {
			$clean_data['background-image'] = ttfmake_sanitize_image_id( $data['background-image'] );
		}

		if ( isset( $data['title'] ) ) {
			$clean_data['title'] = $clean_data['label'] = apply_filters( 'title_save_pre', $data['title'] );
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

		if ( isset( $data['gallery-items'] ) && is_array( $data['gallery-items'] ) ) {
			$clean_data['gallery-items'] = array();

			foreach ( $data['gallery-items'] as $i => $item ) {
				// Handle legacy data layout
				$id = isset( $item['id'] ) ? $item['id']: $i;

				$clean_item_data = array( 'id' => $id );

				if ( isset( $item['title'] ) ) {
					$clean_item_data['title'] = apply_filters( 'title_save_pre', $item['title'] );
				}

				if ( isset( $item['link'] ) ) {
					$clean_item_data['link'] = esc_url_raw( $item['link'] );
				}

				if ( isset( $item['description'] ) ) {
					$clean_item_data['description'] = sanitize_post_field( 'post_content', $item['description'], ( get_post() ) ? get_the_ID() : 0, 'db' );
				}

				if ( isset( $item['image-id'] ) ) {
					$clean_item_data['image-id'] = ttfmake_sanitize_image_id( $item['image-id'] );
				}

				array_push( $clean_data['gallery-items'], $clean_item_data );
			}
		}

		return $clean_data;
	}

	public function add_js_dependencies( $deps ) {
		if ( ! is_array( $deps ) ) {
			$deps = array();
		}

		wp_register_script(
			'builder-models-gallery',
			Make()->scripts()->get_js_directory_uri() . '/builder/sections/models/gallery.js',
			array(),
			TTFMAKE_VERSION,
			true
		);

		wp_register_script(
			'builder-models-gallery-item',
			Make()->scripts()->get_js_directory_uri() . '/builder/sections/models/gallery-item.js',
			array(),
			TTFMAKE_VERSION,
			true
		);

		wp_register_script(
			'builder-views-gallery-item',
			Make()->scripts()->get_js_directory_uri() . '/builder/sections/views/gallery-item.js',
			array( 'builder-views-item' ),
			TTFMAKE_VERSION,
			true
		);

		wp_register_script(
			'builder-views-gallery',
			Make()->scripts()->get_js_directory_uri() . '/builder/sections/views/gallery.js',
			array(),
			TTFMAKE_VERSION,
			true
		);

		return array_merge( $deps, array(
			'builder-models-gallery',
			'builder-models-gallery-item',
			'builder-views-gallery-item',
			'builder-views-gallery'
		) );
	}
}
endif;