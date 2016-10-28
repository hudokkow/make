/* global Backbone, jQuery, _ */
var oneApp = oneApp || {};

(function (window, Backbone, $, _, oneApp) {
	'use strict';

	oneApp.SectionModel = Backbone.Model.extend({
		defaults: {
			'section-type': ''
		},

		initialize: function () {
			// Capitalize the name
			var viewName = this.get('section-type').charAt(0).toUpperCase() + this.get('section-type').slice(1);
			this.set('viewName', viewName);
		},

		saveData: function() {
			// Store JSONified attributes
			this.set('section-json', JSON.stringify(this.toJSON()));
		}
	});

	// Set up this model as a "no URL model" where data is not synced with the server
	oneApp.SectionModel.prototype.sync = function () { return null; };
	oneApp.SectionModel.prototype.fetch = function () { return null; };
	oneApp.SectionModel.prototype.save = function () { return null; };
})(window, Backbone, jQuery, _, oneApp);
