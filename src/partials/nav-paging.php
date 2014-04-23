<?php
/**
 * @package ttf-one
 */
?>

<?php if ( get_next_posts_link() || get_previous_posts_link() ) : ?>
<nav class="navigation paging-navigation" role="navigation">
	<span class="screen-reader-text"><?php _e( 'Posts navigation', 'ttf-one' ); ?></span>
	<?php if ( function_exists( 'wp_pagenavi' ) ) : ?>
		<?php wp_pagenavi(); ?>
	<?php else : ?>
	<div class="nav-links">
		<?php if ( get_previous_posts_link() ) : ?>
		<div class="nav-previous">
			<?php previous_posts_link( __( 'Newer posts', 'ttf-one' ) ); ?>
		</div>
		<?php endif; ?>

		<?php if ( get_next_posts_link() ) : ?>
		<div class="nav-next">
			<?php next_posts_link( __( 'Older posts', 'ttf-one' ) ); ?>
		</div>
		<?php endif; ?>
	</div>
	<?php endif; ?>
</nav>
<?php endif; ?>