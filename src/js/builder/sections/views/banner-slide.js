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
			'change .ttfmake-configuration-overlay input[type=text]' : 'updateInputField',
			'keyup .ttfmake-configuration-overlay input[type=text]' : 'updateInputField',
			'change .ttfmake-configuration-overlay input[type=checkbox]' : 'updateCheckbox',
			'change .ttfmake-configuration-overlay select': 'updateSelectField'
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

		updateInputField: function(e) {
			e.stopPropagation();

			var $input				= $(e.target);
			var modelAttrName = $input.attr('data-model-attr');

			if (typeof modelAttrName !== 'undefined') {
				this.model.set(modelAttrName, $input.val());
				this.$el.trigger('model-slide-change');
			}
		},

		updateCheckbox: function(e) {
			e.stopPropagation();

			var $checkbox = $(e.target);
			var modelAttrName = $checkbox.attr('data-model-attr');

			if (typeof modelAttrName !== 'undefined') {
				if ($checkbox.is(':checked')) {
					this.model.set(modelAttrName, 1);
				} else {
					this.model.set(modelAttrName, 0);
					this.$el.trigger('model-slide-change');
				}
			}
		},

		updateSelectField: function(e) {
			e.stopPropagation();

			var $select = $(e.target);
			var modelAttrName = $select.attr('data-model-attr');

			if (typeof modelAttrName !== 'undefined') {
				this.model.set(modelAttrName, $select.val());
				this.$el.trigger('model-slide-change');
			}
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