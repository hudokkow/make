<?php
/**
 * @package Make
 */

global $ttfmake_section_data;
?>
<?php if ( ! empty( $ttfmake_section_data['section']['config'] ) ) : ?>
	<?php get_template_part( '/inc/builder/core/templates/overlay', 'configuration' ); ?>

    <textarea name="ttfmake-section-json[{{ id }}]" style="display: none;">{{ JSON.stringify(toJSON()) }}</textarea>
<?php endif; ?>
</div>