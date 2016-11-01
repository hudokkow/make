/* global Backbone, jQuery, _ */
var oneApp = oneApp || {};

(function (window, Backbone, $, _, oneApp) {
		'use strict';

		oneApp.ItemView = Backbone.View.extend({
			events: {
				'click .ttfmake-media-uploader-add': 'onMediaOpen',
				'mediaSelected': 'onMediaSelected',
				'change .ttfmake-configuration-overlay input[type=text]' : 'updateInputField',
				'keyup .ttfmake-configuration-overlay input[type=text]' : 'updateInputField',
				'change .ttfmake-configuration-overlay input[type=checkbox]' : 'updateCheckbox',
				'change .ttfmake-configuration-overlay select': 'updateSelectField'
			},

			updateInputField: function(e) {
				e.stopPropagation();

				var $input				= $(e.target);
				var modelAttrName = $input.attr('data-model-attr');

				if (typeof modelAttrName !== 'undefined') {
					this.model.set(modelAttrName, $input.val());
					this.$el.trigger('model-item-change');
				}
			},

			updateCheckbox: function(e) {
				e.stopPropagation();

				var $checkbox = $(e.target);
				var modelAttrName = $checkbox.attr('data-model-attr');

				if (typeof modelAttrName !== 'undefined') {
					if ($checkbox.is(':checked')) {
						this.model.set(modelAttrName, 1);
					} else {
						this.model.set(modelAttrName, 0);
						this.$el.trigger('model-item-change');
					}
				}
			},

			updateSelectField: function(e) {
				e.stopPropagation();

				var $select = $(e.target);
				var modelAttrName = $select.attr('data-model-attr');

				if (typeof modelAttrName !== 'undefined') {
					this.model.set(modelAttrName, $select.val());
					this.$el.trigger('model-item-change');
				}
			},

			onMediaOpen: function(e) {
				e.preventDefault();
				e.stopPropagation();
				oneApp.initUploader(this);
			},

			onMediaSelected: function(e, attachment) {
				e.stopPropagation();
				this.model.set('image-id', attachment.id);
				this.model.set('image-url', attachment.url);
				this.$el.trigger('model-item-change');
			}
		});
})(window, Backbone, jQuery, _, oneApp);