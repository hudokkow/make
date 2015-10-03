<?php
/**
 * @package Make
 */


final class TTFMAKE_Util_Compatibility_Base implements TTFMAKE_Util_Compatibility_CompatibilityInterface {
	/**
	 * The compatibility modes.
	 *
	 * @since x.x.x.
	 *
	 * @var array
	 */
	private $mode = array(
		'full' => array(
			'deprecated-functions' => true,
		),
		'current' => array(
			'deprecated-functions' => false,
		),
	);

	/**
	 * Switch for showing compatibility errors.
	 *
	 * @since x.x.x.
	 *
	 * @var bool
	 */
	private $show_errors = true;

	/**
	 * The activation status of Make Plus.
	 *
	 * @since x.x.x.
	 *
	 * @var bool
	 */
	private $plus = false;

	/**
	 * Indicator of whether the load routine has been run.
	 *
	 * @since x.x.x.
	 *
	 * @var bool
	 */
	private $loaded = false;

	/**
	 * Initialize and set properties.
	 *
	 * @since x.x.x.
	 */
	public function __construct() {
		/**
		 * Filter: Set the mode for compatibility.
		 *
		 * - 'full' will load all the files to enable back compatibility with deprecated code.
		 * - 'current' will not load any deprecated code. Use with caution! Could result in a fatal PHP error.
		 *
		 * @since x.x.x.
		 *
		 * @param string    $mode    The compatibility mode to run the theme in.
		 */
		$mode = apply_filters( 'make_compatibility_mode', 'full' );
		if ( isset( $this->mode[ $mode ] ) ) {
			$this->mode = $this->mode[ $mode ];
		} else {
			$this->mode = $this->mode['full'];
		}

		/**
		 * Filter: Toggle for showing compatibility errors.
		 *
		 * WP_DEBUG must also be set to true.
		 *
		 * @since x.x.x.
		 *
		 * @param bool    $show_errors    True to show errors.
		 */
		$this->show_errors = apply_filters( 'make_compatibility_show_errors', true );

		// Check for Make Plus
		$this->plus = class_exists( 'TTFMP_App' );
	}

	/**
	 * Load files and hook into WordPress.
	 *
	 * @since x.x.x.
	 *
	 * @return void
	 */
	public function load() {
		// Bail if the load routine has already been run.
		if ( true === $this->is_loaded() ) {
			return;
		}

		// Load the deprecated functions file.
		if ( true === $this->mode['deprecated-functions'] ) {
			$file = basename( __FILE__ ) . '/deprecated-functions.php';
			if ( is_readable( $file ) ) {
				require_once $file;
			}
		}

		// Loading has occurred.
		$this->loaded = true;
	}

	/**
	 * Check if the load routine has been run.
	 *
	 * @since x.x.x.
	 *
	 * @return bool
	 */
	public function is_loaded() {
		return $this->loaded;
	}

	/**
	 * Mark a function as deprecated and inform when it has been used.
	 *
	 * Based on _deprecated_function() in WordPress core.
	 *
	 * @param      $function
	 * @param      $version
	 * @param null $replacement
	 */
	public function deprecated_function( $function, $version, $replacement = null ) {
		/**
		 * Fires when a deprecated function is called.
		 *
		 * @since x.x.x.
		 *
		 * @param string $function    The function that was called.
		 * @param string $replacement The function that should have been called.
		 * @param string $version     The version of Make that deprecated the function.
		 */
		do_action( 'make_deprecated_function_run', $function, $replacement, $version );

		// Maybe show an error.
		if ( defined( 'WP_DEBUG' ) && true === WP_DEBUG && true === $this->show_errors ) {
			if ( function_exists( '__' ) ) {
				if ( ! is_null( $replacement ) ) {
					trigger_error( sprintf( __( '%1$s is <strong>deprecated</strong> since version %2$s of Make! Use %3$s instead.', 'make' ), $function, $version, $replacement ) );
				} else {
					trigger_error( sprintf( __( '%1$s is <strong>deprecated</strong> since version %2$s of Make, with no alternative available.', 'make' ), $function, $version ) );
				}
			} else {
				if ( ! is_null( $replacement ) ) {
					trigger_error( sprintf( '%1$s is <strong>deprecated</strong> since version %2$s of Make! Use %3$s instead.', $function, $version, $replacement ) );
				} else {
					trigger_error( sprintf( '%1$s is <strong>deprecated</strong> since version %2$s of Make, with no alternative available.', $function, $version ) );
				}
			}
		}
	}

	/**
	 * Mark an action or filter hook as deprecated and inform when it has been used.
	 *
	 * Based on _deprecated_argument() in WordPress core.
	 *
	 * @since x.x.x.
	 *
	 * @param string $hook     The hook that was used.
	 * @param string $version  The version of WordPress that deprecated the hook.
	 * @param string $message  Optional. A message regarding the change. Default null.
	 */
	public function deprecated_hook( $hook, $version, $message = null ) {
		/**
		 * Fires when a deprecated hook has an attached function/method.
		 *
		 * @since x.x.x.
		 *
		 * @param string $hook        The hook that was called.
		 * @param string $message     Optional. A message regarding the change. Default null.
		 * @param string $version     The version of Make that deprecated the hook.
		 */
		do_action( 'make_deprecated_hook_run', $hook, $message, $version );

		// Maybe show an error.
		if ( defined( 'WP_DEBUG' ) && true === WP_DEBUG && true === $this->show_errors ) {
			if ( function_exists( '__' ) ) {
				if ( ! is_null( $message ) ) {
					trigger_error( sprintf( __( 'The %1$s hook is <strong>deprecated</strong> since version %2$s of Make! %3$s', 'make' ), $hook, $version, $message ) );
				} else {
					trigger_error( sprintf( __( 'The %1$s hook is <strong>deprecated</strong> since version %2$s of Make, with no alternative available.', 'make' ), $hook, $version ) );
				}
			} else {
				if ( ! is_null( $message ) ) {
					trigger_error( sprintf( 'The %1$s hook is <strong>deprecated</strong> since version %2$s of Make! %3$s', $hook, $version, $message ) );
				} else {
					trigger_error( sprintf( 'The %1$s hook is <strong>deprecated</strong> since version %2$s of Make, with no alternative available.', $hook, $version ) );
				}
			}
		}
	}

	/**
	 * Check to see if Make Plus is active.
	 *
	 * @since x.x.x.
	 *
	 * @return bool
	 */
	public function is_plus() {
		/**
		 * Filter: Modify the status of Make Plus.
		 *
		 * @since 1.2.3.
		 *
		 * @param bool    $is_plus    True if Make Plus is active.
		 */
		return apply_filters( 'make_is_plus', $this->plus );
	}
}