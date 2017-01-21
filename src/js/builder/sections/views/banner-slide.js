/* global Backbone, jQuery, _ */
var oneApp = oneApp || {};

(function (window, Backbone, $, _, oneApp) {
	'use strict';

	oneApp.views = oneApp.views || {}

	oneApp.views['banner-slide'] = oneApp.views.item.extend({
		events: function() {
			return _.extend({}, oneApp.views.item.prototype.events, {
				'click .ttfmake-banner-slide-remove': 'onSlideRemove',
				'click .ttfmake-banner-slide-toggle': 'toggleSection',
				'click .edit-content-link': 'onContentEdit',
			});
		},

		initialize: function (options) {
			this.template = _.template(ttfMakeSectionTemplates['banner-slide'], oneApp.builder.templateSettings);
		},

		render: function () {
			var html = this.template(this.model)
			this.setElement(html);

			return this;
		},

		onContentEdit: function(e) {
			oneApp.views.item.prototype.onContentEdit.apply(this, arguments);

			var $overlay = oneApp.builder.tinymceOverlay.$el;
			var $button = $('.ttfmake-overlay-close', $overlay);
			$button.text('Update slide');
		},

		onColorPickerChange: function(e, data) {
			e.stopPropagation();

			this.model.set(data.modelAttr, data.color);
			this.$el.trigger('model-item-change');
		},

		onSlideRemove: function (evt) {
			evt.preventDefault();

			var $stage = this.$el.parents('.ttfmake-banner-slides');

			// Fade and slide out the section, then cleanup view
			this.$el.animate({
				opacity: 'toggle',
				height: 'toggle'
			}, oneApp.builder.options.closeSpeed, function() {
				this.$el.trigger('slide-remove', this);
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
				$sectionBody.slideUp(oneApp.builder.options.closeSpeed, function() {
					$section.removeClass('ttfmake-banner-slide-open');
					$input.val('closed');
				});
			} else {
				$sectionBody.slideDown(oneApp.builder.options.openSpeed, function() {
					$section.addClass('ttfmake-banner-slide-open');
					$input.val('open');
				});
			}
		}
	});
})(window, Backbone, jQuery, _, oneApp);