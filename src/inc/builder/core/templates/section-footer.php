<?php
/**
 * @package Make
 */

global $ttfmake_section_data, $ttfmake_overlay_id;

$ttfmake_overlay_id = 'ttfmake-overlay-{{ id }}';
?>

	<?php get_template_part( '/inc/builder/core/templates/overlay', 'configuration' ); ?>

    <textarea name="ttfmake-section-json[{{ id }}]" style="display: none;">{{ JSON.stringify(toJSON()) }}</textarea>

</div>