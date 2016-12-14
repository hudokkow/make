/* global Backbone, jQuery, _, ttfmakeBuilderData, setUserSetting, deleteUserSetting */
var oneApp = oneApp || {};

(function (window, Backbone, $, _, oneApp) {
	'use strict';

	oneApp.views = oneApp.views || {};

	oneApp.views.menu = Backbone.View.extend({
		el: '#ttfmake-menu',
		$stage: $('#ttfmake-stage'),
		$document: $(window.document),
		$scrollHandle: $('html, body'),
		$pane: $('.ttfmake-menu-pane'),

		events: {
			'click .ttfmake-menu-list-item-link': 'onSectionAdd',
			// 'section-sort': 'onSectionSort',
		},

		onSectionAdd: function (e) {
			e.preventDefault();
			e.stopPropagation();

			var sectionType = $(e.currentTarget).data('section');
			this.$el.trigger('section-created', sectionType);
		},

		menuToggle: function(evt) {
			evt.preventDefault();
			var id = ttfmakeBuilderData.pageID,
				key = 'ttfmakemt' + parseInt(id, 10);

			// Open it down
			if (this.$pane.is(':hidden')) {
				this.$pane.slideDown({
					duration: oneApp.options.openSpeed,
					easing: 'easeInOutQuad',
					complete: function() {
						deleteUserSetting( key );
						this.$el.addClass('ttfmake-menu-opened').removeClass('ttfmake-menu-closed');
					}.bind(this)
				});

			// Close it up
			} else {
				this.$pane.slideUp({
					duration: oneApp.builder.options.closeSpeed,
					easing: 'easeInOutQuad',
					complete: function() {
						setUserSetting( key, 'c' );
						this.$el.addClass('ttfmake-menu-closed').removeClass('ttfmake-menu-opened');
					}.bind(this)
				});
			}
		}
	});
})(window, Backbone, jQuery, _, oneApp);
