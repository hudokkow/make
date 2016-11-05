/* global Backbone, jQuery, _ */
var oneApp = oneApp || {};

(function (window, Backbone, $, _, oneApp) {
	'use strict';

	oneApp.GalleryModel = oneApp.SectionModel.extend({
		defaults: {
			'section-type': 'gallery',
			'gallery-items': [],
		},

		parse: function(data) {
			var attributes = _(data).clone();
			attributes['gallery-items'] = _(attributes['gallery-items'])
				.values()
				.map(function(item) {
					var itemModel = new oneApp.GalleryItemModel(item);
					itemModel.set('parentID', data.id);
					return itemModel;
				});

			return attributes;
		},

		toJSON: function() {
			var json = oneApp.SectionModel.prototype.toJSON.apply(this, arguments);
			json['gallery-items'] = _(json['gallery-items']).map(function(item) {
				return item.toJSON();
			});

			return json;
		}
	});

	// Set up this model as a "no URL model" where data is not synced with the server
	oneApp.GalleryModel.prototype.sync = function () { return null; };
	oneApp.GalleryModel.prototype.fetch = function () { return null; };
	oneApp.GalleryModel.prototype.save = function () { return null; };
})(window, Backbone, jQuery, _, oneApp);
