/* global Backbone, jQuery, _ */
var oneApp = oneApp || {};

(function (window, Backbone, $, _, oneApp) {
	'use strict';

	oneApp.BannerSlideView = Backbone.View.extend({
		template: '',
		className: 'ttfmake-banner-slide ttfmake-banner-slide-open',

		events: {
			'click .ttfmake-banner-slide-remove': 'removeItem',
			'click .ttfmake-banner-slide-toggle': 'toggleSection',
			'click .ttfmake-media-uploader-add': 'onMediaOpen',
			'mediaSelected': 'onMediaSelected',
		},

		initialize: function (options) {
			this.template = _.template(ttfMakeSectionTemplates['banner-item']);
		},

		render: function () {
			this.$el.html(this.template(this.model))
				.attr('id', this.idAttr)
				.attr('data-id', this.model.get('id'));
			return this;
		},

		removeItem: function (evt) {
			evt.preventDefault();

			var $stage = this.$el.parents('.ttfmake-banner-slides'),
				$orderInput = $('.ttfmake-banner-slide-order', $stage);

			oneApp.removeOrderValue(this.model.get('id'), $orderInput);

			// Fade and slide out the section, then cleanup view
			this.$el.animate({
				opacity: 'toggle',
				height: 'toggle'
			}, oneApp.options.closeSpeed, function() {
				this.remove();
			}.bind(this));
		},

		toggleSection: function (evt) {
			evt.preventDefault();

			var $this = $(evt.target),
				$section = $this.parents('.ttfmake-banner-slide'),
				$sectionBody = $('.ttfmake-banner-slide-body', $section),
				$input = $('.ttfmake-banner-slide-state', this.$el);

			if ($section.hasClass('ttfmake-banner-slide-open')) {
				$sectionBody.slideUp(oneApp.options.closeSpeed, function() {
					$section.removeClass('ttfmake-banner-slide-open');
					$input.val('closed');
				});
			} else {
				$sectionBody.slideDown(oneApp.options.openSpeed, function() {
					$section.addClass('ttfmake-banner-slide-open');
					$input.val('open');
				});
			}
		},

		onMediaOpen: function(e) {
			e.preventDefault();
			e.stopPropagation();
			oneApp.initUploader(this);
		},

		onMediaSelected: function(e, attachment) {
			e.stopPropagation();
			this.model.set('image-id', attachment.id);
			this.model.set('image-url', attachment.url);
			this.$el.trigger('model-slide-change');
		}
	});
})(window, Backbone, jQuery, _, oneApp);