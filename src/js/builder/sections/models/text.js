/* global Backbone, jQuery, _ */
var oneApp = oneApp || {};

(function (window, Backbone, $, _, oneApp) {
	'use strict';

	oneApp.models = oneApp.models || {};

	oneApp.TextModel = oneApp.models.text = oneApp.SectionModel.extend({
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
			attributes['columns-order'] = ['1', '2', '3', '4'];

			return attributes;
		},

		toJSON: function() {
			var json = oneApp.SectionModel.prototype.toJSON.apply(this, arguments);
			var copyColumns = _(json['columns']).clone();

			_(json['columns']).each(function(column, index) {
				if (column.hasOwnProperty('attributes')) {
					copyColumns[index] = column.attributes;
				} else {
					copyColumns[index] = column;
				}
			});

			return json;
		},

		updateOrder: function(ids) {
			var ids = _(ids);			
			var json = oneApp.SectionModel.prototype.toJSON.apply(this, arguments);
			var columns = _(json['columns']).clone();
			var orderedColumns = {1: {}, 2: {}, 3: {}, 4: {}};

			ids.each(function(id, index) {
				var intIndex = parseInt(index, 10)+1;
				var desiredColumn = _.findWhere(columns, {id: id});

				if (columns.hasOwnProperty('attributes')) {
					orderedColumns[intIndex] = desiredColumn.attributes;
				} else {
					orderedColumns[intIndex] = desiredColumn;
				}
			});

			this.set('columns', orderedColumns);
		}
	});

	// Set up this model as a "no URL model" where data is not synced with the server
	oneApp.TextModel.prototype.sync = function () { return null; };
	oneApp.TextModel.prototype.fetch = function () { return null; };
	oneApp.TextModel.prototype.save = function () { return null; };
})(window, Backbone, jQuery, _, oneApp);
