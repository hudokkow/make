<?php
/**
 * @package Make
 */

if ( ! class_exists( 'MAKE_Builder_Sections_Columns_Definition' ) ) :
/**
 * Section definition for Columns
 *
 * Class MAKE_Builder_Sections_Columns_Definition
 */
class MAKE_Builder_Sections_Columns_Definition {
	/**
	 * The one instance of MAKE_Builder_Sections_Columns_Definition.
	 *
	 * @var   MAKE_Builder_Sections_Columns_Definition
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
			'text',
			__( 'Columns', 'make' ),
			Make()->scripts()->get_css_directory_uri() . '/builder/sections/images/text.png',
			__( 'Create rearrangeable columns of content and images.', 'make' ),
			array( $this, 'save' ),
			'sections/columns/builder-template',
			'sections/columns/frontend-template',
			100,
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
				'default' => ttfmake_get_section_default( 'title', 'text' ),
			),
			200 => array(
				'type'    => 'select',
				'name'    => 'columns-number',
				'class'   => 'ttfmake-text-columns',
				'label'   => __( 'Columns', 'make' ),
				'default' => ttfmake_get_section_default( 'columns-number', 'text' ),
				'options' => array(
					1 => 1,
					2 => 2,
					3 => 3,
					4 => 4,
				),
			),
			300 => array(
				'type'  => 'image',
				'name'  => 'background-image',
				'label' => __( 'Background image', 'make' ),
				'class' => 'ttfmake-configuration-media',
				'default' => ttfmake_get_section_default( 'background-image', 'text' ),
			),
			400 => array(
				'type'    => 'checkbox',
				'label'   => __( 'Darken background to improve readability', 'make' ),
				'name'    => 'darken',
				'default' => ttfmake_get_section_default( 'darken', 'text' ),
			),
			500 => array(
				'type'    => 'select',
				'name'    => 'background-style',
				'label'   => __( 'Background style', 'make' ),
				'default' => ttfmake_get_section_default( 'background-style', 'text' ),
				'options' => array(
					'tile'  => __( 'Tile', 'make' ),
					'cover' => __( 'Cover', 'make' ),
				),
			),
			600 => array(
				'type'    => 'color',
				'label'   => __( 'Background color', 'make' ),
				'name'    => 'background-color',
				'class'   => 'ttfmake-text-background-color ttfmake-configuration-color-picker',
				'default' => ttfmake_get_section_default( 'background-color', 'text' ),
			),
		);
	}

	public function get_defaults() {
		return array(
			'title' => '',
			'columns-number' => 3,
			'background-image' => '',
			'darken' => 0,
			'background-style' => 'tile',
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
		$defaults['text'] = $this->get_defaults();

		return $defaults;
	}

	public function get_section_json( $data, $type ) {
		if ( $type == 'text' ) {
			if ( isset( $data['background-image'] ) && ( $image_id = intval( $data['background-image'] ) ) > 0 ) {
				$image = ttfmake_get_image_src( $image_id, 'large' );
				$data['background-image-url'] = $image[0];
			}

			if ( isset( $data['columns'] ) && is_array( $data['columns'] ) ) {
				if ( isset( $data['columns-order'] ) ) {
					$ordered_items = array();

					foreach ( $data['columns-order'] as $index => $column_position ) {
						$column_position = intval($column_position);
						$ordered_items[$index+1] = $data['columns'][$column_position];

						if ( $ordered_items[$index+1]['sidebar-label'] != '' && !array_key_exists('widget-area-id', $ordered_items[$index+1]) ) {
							$page_id = get_the_ID();
							$ordered_items[$index+1]['widget-area-id'] = 'ttfmp-' . $page_id . '-' . $data['id'] . '-' . $column_position;
						}
					}

					$data['columns'] = $ordered_items;
					unset( $data['columns-order'] );
				}

				foreach ( $data['columns'] as $s => $column ) {
					// Handle legacy data layout
					$id = isset( $column['id'] ) ? $column['id']: $s;
					$data['columns'][$s]['id'] = $id;

					if ( isset( $column['image-id'] ) && ( $image_id = intval( $column['image-id'] ) ) > 0 ) {
						$image = ttfmake_get_image_src( $image_id, 'large' );
						$data['columns'][$s]['image-url'] = $image[0];
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

		if ( isset( $data['columns-number'] ) ) {
			if ( in_array( $data['columns-number'], range( 1, 4 ) ) ) {
				$clean_data['columns-number'] = $data['columns-number'];
			}
		}

		$clean_data['title'] = $clean_data['label'] = ( isset( $data['title'] ) ) ? apply_filters( 'title_save_pre', $data['title'] ) : '';

		if ( isset( $data['columns-order'] ) ) {
			$clean_data['columns-order'] = $data['columns-order'];
		}

		if ( isset( $data['background-image'] ) ) {
			$clean_data['background-image'] = ttfmake_sanitize_image_id( $data['background-image'] );
		}

		if ( isset( $data['darken'] ) && $data['darken'] == 1 ) {
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

		if ( isset( $data['columns'] ) && is_array( $data['columns'] ) ) {
			foreach ( $data['columns'] as $id => $item ) {
				if ( isset( $item['id'] ) ) {
					$clean_data['columns'][ $id ]['id'] = $item['id'];
				}

				if ( isset( $item['parentID'] ) ) {
					$clean_data['columns'][ $id ]['parentID'] = $item['parentID'];
				}

				if ( isset( $item['title'] ) ) {
					$clean_data['columns'][ $id ]['title'] = apply_filters( 'title_save_pre', $item['title'] );
				}

				if ( isset( $item['image-link'] ) ) {
					$clean_data['columns'][ $id ]['image-link'] = esc_url_raw( $item['image-link'] );
				}

				if ( isset( $item['image-id'] ) ) {
					$clean_data['columns'][ $id ]['image-id'] = ttfmake_sanitize_image_id( $item['image-id'] );

					$image = ttfmake_get_image_src( $item['image-id'], 'large' );
					$clean_data['columns'][ $id ]['image-url'] = $image[0];
				}

				if ( isset( $item['content'] ) ) {
					$clean_data['columns'][ $id ]['content'] = sanitize_post_field( 'post_content', $item['content'], ( get_post() ) ? get_the_ID() : 0, 'db' );
				}

				if ( isset( $item['size'] ) ) {
					$clean_data['columns'][ $id ]['size'] = esc_attr( $item['size'] );
				}

				if ( isset( $item['sidebar-label'] ) ) {
					$clean_data['columns'][ $id ]['sidebar-label'] = $item['sidebar-label'];
				}

				if ( isset( $item['widget-area-id'] ) ) {
					$clean_data['columns'][ $id ]['widget-area-id'] = $item['widget-area-id'];
				}
			}
		}

		return $clean_data;
	}

	public function add_js_dependencies( $deps ) {
		if ( ! is_array( $deps ) ) {
			$deps = array();
		}

		wp_register_script(
			'builder-models-text',
			Make()->scripts()->get_js_directory_uri() . '/builder/sections/models/text.js',
			array(),
			TTFMAKE_VERSION,
			true
		);

		wp_register_script(
			'builder-models-text-item',
			Make()->scripts()->get_js_directory_uri() . '/builder/sections/models/text-item.js',
			array(),
			TTFMAKE_VERSION,
			true
		);

		wp_register_script(
			'builder-views-text',
			Make()->scripts()->get_js_directory_uri() . '/builder/sections/views/text.js',
			array(),
			TTFMAKE_VERSION,
			true
		);

		wp_register_script(
			'builder-views-text-item',
			Make()->scripts()->get_js_directory_uri() . '/builder/sections/views/text-item.js',
			array( 'builder-views-item' ),
			TTFMAKE_VERSION,
			true
		);

		return array_merge( $deps, array(
			'builder-models-text',
			'builder-models-text-item',
			'builder-views-text',
			'builder-views-text-item'
		) );
	}
}
endif;
