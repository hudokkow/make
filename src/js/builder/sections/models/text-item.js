/* global Backbone, jQuery, _ */
var oneApp = oneApp || {};

(function (window, Backbone, $, _, oneApp) {
	'use strict';

	oneApp.models = oneApp.models || {};

	oneApp.models['text-item'] = Backbone.Model.extend({
		defaults: {
			id: '',
			parentID: '',
			'section-type': 'text-item'
		}
	});
})(window, Backbone, jQuery, _, oneApp);
