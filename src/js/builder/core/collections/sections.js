/* global Backbone, jQuery, _ */
var oneApp = oneApp || {};

(function (window, Backbone, $, _, oneApp) {
	'use strict';

	oneApp.collections = oneApp.collections || {};

	oneApp.collections.section = Backbone.Collection.extend({
		model: function(sectionType) {
			return oneApp.models[sectionType];
		},

		parse: function(data) {
			var models = _(data).map(function(sectionData) {
					var sectionType = sectionData['section-type'];
					var modelClass = oneApp.models[sectionType];
					var sectionModel = new modelClass(sectionData, {parse: true});

					return sectionModel;
			});

			return models;
		}
	});
})(window, Backbone, jQuery, _, oneApp);
