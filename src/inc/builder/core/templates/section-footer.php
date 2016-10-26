<?php
/**
 * @package Make
 */

global $ttfmake_section_data, $ttfmake_is_js_template;
?>

	<?php if ( ! empty( $ttfmake_section_data['section']['config'] ) ) : ?>
		<?php global $ttfmake_overlay_id; $id = ( true === $ttfmake_is_js_template ) ? '{{{ get("id") }}}' : esc_attr( $ttfmake_section_data['data']['id'] ); $ttfmake_overlay_id = 'ttfmake-overlay-' . $id; ?>
        <?php get_template_part( '/inc/builder/core/templates/overlay', 'configuration' ); ?>

        <textarea name="ttfmake-section-json[<?php echo $id; ?>]" style="display: none;">{{ get("section-json") }}</textarea>
    <?php endif; ?>

	</div>
<?php if ( ! isset( $ttfmake_is_js_template ) || true !== $ttfmake_is_js_template ) : ?>
</div>
<?php endif; ?>
