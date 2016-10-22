/* global Backbone, jQuery, _ */
var oneApp = oneApp || {};

(function (window, Backbone, $, _, oneApp) {
	'use strict';

	oneApp.BannerModel = Backbone.Model.extend({
		defaults: {
			'section-type': 'banner'
		}
	});

	// Set up this model as a "no URL model" where data is not synced with the server
	oneApp.BannerModel.prototype.sync = function () { return null; };
	oneApp.BannerModel.prototype.fetch = function () { return null; };
	oneApp.BannerModel.prototype.save = function () { return null; };
})(window, Backbone, jQuery, _, oneApp);
