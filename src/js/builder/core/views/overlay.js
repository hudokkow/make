/* global jQuery, _ */
var oneApp = oneApp || {};

(function (window, $, _, oneApp) {
	'use strict';

	oneApp.views = oneApp.views || {};

	oneApp.views.overlay = Backbone.View.extend({
		caller: null,

		events: function() {
			return _.extend({}, oneApp.views.section.prototype.events, {
				'click .ttfmake-overlay-close-action' : 'closeOnClick'
			});
		},

		open: function(view) {
			this.caller = view;

			this.$el.show();

			// Auto focus on the editor
			var focusOn = (oneApp.builder.isVisualActive()) ? tinyMCE.get('make') : oneApp.builder.$makeTextArea;
			focusOn.focus();

			view.$el.trigger('overlayOpen');
		},

		close: function() {
			this.$el.hide();

			oneApp.builder.setTextArea(oneApp.builder.activeTextAreaID);

			if ('' !== oneApp.builder.activeiframeID) {
				oneApp.builder.filliframe(oneApp.builder.activeiframeID);
			}

			this.toggleHasContent();
			this.caller.$el.trigger('overlayClose', $('#' + oneApp.builder.activeTextAreaID));
			this.caller = null;
		},

		closeOnClick: function(e) {
			e.preventDefault();
			this.close();
		},

		toggleHasContent: function(textareaID) {
			textareaID = textareaID || oneApp.builder.activeTextAreaID;

			var link = $('.edit-content-link[data-textarea="' + textareaID + '"]'),
				content = oneApp.builder.getMakeContent();

			if ('' !== content) {
				link.addClass('item-has-content');
			} else {
				link.removeClass('item-has-content');
			}
		}
	});
})(window, jQuery, _, oneApp);