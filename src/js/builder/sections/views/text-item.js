/* global Backbone, jQuery, _ */
var oneApp = oneApp || {};

(function (window, Backbone, $, _, oneApp) {
	'use strict';

	oneApp.views = oneApp.views || {}

	oneApp.views['text-item'] = oneApp.views.item.extend({
		el: '',
		elSelector: '',
		className: 'ttfmake-text-column',

		events: function() {
			return _.extend({}, oneApp.views.item.prototype.events, {
				'click .ttfmake-media-uploader-add': 'onMediaOpen',
				'overlayClose': 'onOverlayClose'
			});
		},

		initialize: function (options) {
			this.template = _.template(ttfMakeSectionTemplates['text-item'], oneApp.builder.templateSettings);
		},

		render: function () {
			var html = this.template(this.model);
			this.setElement(html);

			return this;
		},

		onViewReady: function(e) {
			e.stopPropagation();
			oneApp.builder.initColorPicker(this);
		},

		onOverlayClose: function(e, textarea) {
			e.stopPropagation();

			this.model.set('content', $(textarea).val());
			this.$el.trigger('model-item-change');
		},

		onColorPickerChange: function(e, data) {
			e.stopPropagation();

			this.model.set(data.modelAttr, data.color);
			this.$el.trigger('model-item-change');
		}
	});
})(window, Backbone, jQuery, _, oneApp);
