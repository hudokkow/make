/* global Backbone, jQuery, _ */
var oneApp = oneApp || {};

(function (window, Backbone, $, _, oneApp) {
	'use strict';

	oneApp.TextModel = Backbone.Model.extend({
		defaults: {
			'id': '',
			'label': '',
			'state': 'open',
			'title': '',
			'image-link': '',
			'section-type': 'text',
			'section-classes': '',
			'section-html-id': '',
			'background-color': '',
			'background-image': '',
			'background-style': '',
			'columns-number': 3,
			'columns': {
				1: {
					'image-link': '',
					'image-id': '',
					'title': '',
					'content': ''
				},
				2: {
					'image-link': '',
					'image-id': '',
					'title': '',
					'content': ''
				},
				3: {
					'image-link': '',
					'image-id': '',
					'title': '',
					'content': ''
				},
				4: {
					'image-link': '',
					'image-id': '',
					'title': '',
					'content': ''
				}
			},
			'columns-order': [],
			'darken': 0,
			'parallax-enable': 0,
			'remove-space-below': 0
		},

		initialize: function () {
			var viewName = this.get('section-type').charAt(0).toUpperCase() + 'View';
			this.set('viewName', viewName);
		}
	});

	// Set up this model as a "no URL model" where data is not synced with the server
	oneApp.TextModel.prototype.sync = function () { return null; };
	oneApp.TextModel.prototype.fetch = function () { return null; };
	oneApp.TextModel.prototype.save = function () { return null; };
})(window, Backbone, jQuery, _, oneApp);
