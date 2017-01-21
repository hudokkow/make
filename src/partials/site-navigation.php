<span class="menu-toggle"><?php echo make_get_thememod_value( 'navigation-mobile-label' ); ?></span>
<?php
$mobile_menu = make_get_thememod_value( 'mobile-menu' );

wp_nav_menu( array(
	'theme_location' => 'primary',
	'menu_class' => 'menu menu-desktop',
) );

wp_nav_menu( array(
	'theme_location' => $mobile_menu,
	'menu_class' => 'menu menu-mobile',
) );
?>