/* global Backbone, jQuery, _ */
var oneApp = oneApp || {};

(function (window, Backbone, $, _, oneApp) {
	'use strict';

	oneApp.SectionModel = Backbone.Model.extend({
		defaults: {
			'section-type': ''
		},
	});

	// Set up this model as a "no URL model" where data is not synced with the server
	oneApp.SectionModel.prototype.sync = function () { return null; };
	oneApp.SectionModel.prototype.fetch = function () { return null; };
	oneApp.SectionModel.prototype.save = function () { return null; };
})(window, Backbone, jQuery, _, oneApp);
