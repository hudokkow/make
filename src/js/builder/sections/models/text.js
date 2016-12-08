/* global Backbone, jQuery, _ */
var oneApp = oneApp || {};

(function (window, Backbone, $, _, oneApp) {
	'use strict';

	oneApp.models = oneApp.models || {};

	oneApp.models.text = oneApp.models.section.extend({
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

		toJSON: function() {
			var json = oneApp.models.section.prototype.toJSON.apply(this, arguments);
			var copyColumns = _(json['columns']).clone();

			console.log(copyColumns);

			_(json['columns']).each(function(column, index) {
				if (column.hasOwnProperty('attributes')) {
					copyColumns[index] = column.attributes;
				} else {
					copyColumns[index] = column;
				}
			});

			console.log(json);

			return json;
		},

		updateOrder: function(ids) {
			var ids = _(ids);
			var json = oneApp.models.section.prototype.toJSON.apply(this, arguments);
			var columns = _(json['columns']).clone();
			var orderedColumns = {1: {}, 2: {}, 3: {}, 4: {}};

			ids.each(function(id, index) {
				var intIndex = parseInt(index, 10)+1;
				var desiredColumn;

				_.each(columns, function(model) {
					if (parseInt(model.get('id'), 10) === parseInt(id, 10)) {
						desiredColumn = model;
					}
				});

				if (columns.hasOwnProperty('attributes')) {
					orderedColumns[intIndex] = desiredColumn.attributes;
				} else {
					orderedColumns[intIndex] = desiredColumn;
				}
			});

			this.set('columns', orderedColumns);
		}
	});
})(window, Backbone, jQuery, _, oneApp);
