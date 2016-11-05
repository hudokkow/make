/* global Backbone, jQuery, _ */
var oneApp = oneApp || {};

(function (window, Backbone, $, _, oneApp) {
	'use strict';

	oneApp.GalleryItemView = oneApp.ItemView.extend({
		template: '',
		className: 'ttfmake-gallery-item',

		events: function() {
			return _.extend({}, oneApp.ItemView.prototype.events, {
				'click .ttfmake-gallery-item-remove': 'removeItem',
				'overlayClose': 'onOverlayClose',
			});
		},

		initialize: function (options) {
			this.template = _.template(ttfMakeSectionTemplates['gallery-item']);
		},

		render: function () {
			this.$el.html(this.template(this.model))
				.attr('id', this.idAttr)
				.attr('data-id', this.model.get('id'));
			return this;
		},

		onOverlayClose: function(e, textarea) {
			this.model.set('description', $(textarea).val());
			this.$el.trigger('model-item-change');
		},

		removeItem: function (evt) {
			evt.preventDefault();

			var $stage = this.$el.parents('.ttfmake-gallery-items'),
				$orderInput = $('.ttfmake-gallery-item-order', $stage);

			oneApp.removeOrderValue(this.model.get('id'), $orderInput);

			// Fade and slide out the section, then cleanup view
			this.$el.animate({
				opacity: 'toggle',
				height: 'toggle'
			}, oneApp.options.closeSpeed, function() {
				this.remove();
			}.bind(this));
		}
	});
})(window, Backbone, jQuery, _, oneApp);