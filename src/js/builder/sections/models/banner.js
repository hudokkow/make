/* global Backbone, jQuery, _ */
var oneApp = oneApp || {};

(function (window, Backbone, $, _, oneApp) {
	'use strict';

	oneApp.BannerModel = oneApp.SectionModel.extend({
		defaults: {
			'section-type': 'banner',
			'banner-slides': [],
		},

		parse: function(data) {
			var attributes = _(data).clone();
			attributes['banner-slides'] = _(attributes['banner-slides'])
				.values()
				.map(function(slide) {
					var slideModel = new oneApp.BannerSlideModel(slide);
					slideModel.set('parentID', data.id);
					return slideModel;
				});

			return attributes;
		},

		toJSON: function() {
			var json = oneApp.SectionModel.prototype.toJSON.apply(this, arguments);
			json['banner-slides'] = _(json['banner-slides']).map(function(slide) {
				return slide.toJSON();
			});

			return json;
		}
	});

	// Set up this model as a "no URL model" where data is not synced with the server
	oneApp.BannerModel.prototype.sync = function () { return null; };
	oneApp.BannerModel.prototype.fetch = function () { return null; };
	oneApp.BannerModel.prototype.save = function () { return null; };
})(window, Backbone, jQuery, _, oneApp);
