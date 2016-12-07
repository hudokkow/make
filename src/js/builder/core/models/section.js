/* global Backbone, jQuery, _ */
var oneApp = oneApp || {};

(function (window, Backbone, $, _, oneApp) {
	'use strict';

	oneApp.models = oneApp.models || {};

	oneApp.models.section = Backbone.Model.extend({
		defaults: {
			'section-type': ''
		},
	});
})(window, Backbone, jQuery, _, oneApp);
