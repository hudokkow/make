/* global Backbone, jQuery, _ */
var oneApp = oneApp || {};

(function (window, Backbone, $, _, oneApp) {
	'use strict';

	oneApp.TextItemView = oneApp.ItemView.extend({
		el: '',
		elSelector: '',
		className: 'ttfmake-text-column',

		events: function() {
			return _.extend({}, oneApp.ItemView.prototype.events, {
				'click .ttfmake-media-uploader-add': 'onMediaOpen',
				'overlayClose': 'onOverlayClose'
			});
		},

		render: function () {
			return this;
		},

		onOverlayClose: function(e, textarea) {
			this.model.set('content', $(textarea).val());
			this.$el.trigger('model-item-change');
		}		
	});
})(window, Backbone, jQuery, _, oneApp);
