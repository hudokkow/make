/* global Backbone, jQuery, _ */
var oneApp = oneApp || {};

(function (window, Backbone, $, _, oneApp) {
	'use strict';

	oneApp.models = oneApp.models || {};

	oneApp.models['gallery-item'] = Backbone.Model.extend({
		defaults: {
			id: '',
			parentID: ''
		}
	});
})(window, Backbone, jQuery, _, oneApp);