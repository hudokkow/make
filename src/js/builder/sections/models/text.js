/* global Backbone, jQuery, _ */
var oneApp = oneApp || {};

(function (window, Backbone, $, _, oneApp) {
	'use strict';

	oneApp.TextModel = oneApp.SectionModel.extend({
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
				},
				2: {
				},
				3: {
				},
				4: {
				}
			},
			'columns-order': ['1','2','3','4'],
			'darken': 0,
			'parallax-enable': 0,
			'remove-space-below': 0,
			'section-json': '{}'
		},

		parse: function(data) {
			var attributes = _(data).clone();
			var sortedColumns = _(attributes['columns']).clone();

			_(attributes['columns-order']).each(function(id, index) {
				var ourIndex = parseInt(index, 10)+1;

				sortedColumns[ourIndex] = attributes['columns'][id];
			});

			attributes['columns'] = sortedColumns;

			return attributes;
		},

		toJSON: function() {
			var json = oneApp.SectionModel.prototype.toJSON.apply(this, arguments);
			var copyColumns = _(json['columns']).clone();

			_(json['columns']).each(function(column, index) {
				if (column.hasOwnProperty('attributes')) {
					console.log('ugh');
					copyColumns[index] = column.attributes;
				} else {
					copyColumns[index] = column;
				}
			});

			return json;
		}
	});

	// Set up this model as a "no URL model" where data is not synced with the server
	oneApp.TextModel.prototype.sync = function () { return null; };
	oneApp.TextModel.prototype.fetch = function () { return null; };
	oneApp.TextModel.prototype.save = function () { return null; };
})(window, Backbone, jQuery, _, oneApp);
