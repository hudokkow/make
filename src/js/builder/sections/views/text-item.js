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
				'click .ttfmake-media-uploader-add': 'onMediaOpen'
			});
		},

		render: function () {
			return this;
		},
	});
})(window, Backbone, jQuery, _, oneApp);
