/* global Backbone, jQuery, _ */
var oneApp = oneApp || {};

(function (window, Backbone, $, _, oneApp) {
		'use strict';

		oneApp.ItemView = Backbone.View.extend({
			events: {
				'click .ttfmake-media-uploader-add': 'onMediaOpen',
				'mediaSelected': 'onMediaSelected',
				'mediaRemoved': 'onMediaRemoved',
				'click .edit-content-link': 'onContentEdit',
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
			},

			onMediaRemoved: function(e) {
				e.stopPropagation();
				this.model.unset('image-id');
				this.model.unset('image-url');
				this.$el.trigger('model-item-change');
			},

			onContentEdit: function(e) {
				e.preventDefault();

				oneApp.tinymceOverlay.open(this);

				var $target = $(e.target),
					iframeID = ($target.attr('data-iframe')) ? $target.attr('data-iframe') : '',
					textAreaID = $target.attr('data-textarea');

				oneApp.setMakeContentFromTextArea(iframeID, textAreaID);
			}
		});
})(window, Backbone, jQuery, _, oneApp);