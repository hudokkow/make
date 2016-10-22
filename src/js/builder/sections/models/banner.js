/* global Backbone, jQuery, _ */
var oneApp = oneApp || {};

(function (window, Backbone, $, _, oneApp) {
	'use strict';

	oneApp.BunnerModel = Backbone.Model.extend({
		defaults: {
			'section-type': 'banner'
		}
	});

	// Set up this model as a "no URL model" where data is not synced with the server
	oneApp.BunnerModel.prototype.sync = function () { return null; };
	oneApp.BunnerModel.prototype.fetch = function () { return null; };
	oneApp.BunnerModel.prototype.save = function () { return null; };
})(window, Backbone, jQuery, _, oneApp);
