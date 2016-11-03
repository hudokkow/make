/* global Backbone, jQuery, _ */
var oneApp = oneApp || {};

(function (window, Backbone, $, _, oneApp) {
	'use strict';

	oneApp.TextItemModel = Backbone.Model.extend({
		defaults: {
			id: '',
			parentID: '',
		}
	});

	// Set up this model as a "no URL model" where data is not synced with the server
	oneApp.TextItemModel.prototype.sync = function () { return null; };
	oneApp.TextItemModel.prototype.fetch = function () { return null; };
	oneApp.TextItemModel.prototype.save = function () { return null; };
})(window, Backbone, jQuery, _, oneApp);
