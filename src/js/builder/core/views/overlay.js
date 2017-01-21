/* global jQuery, _ */
var oneApp = oneApp || {};

(function (window, $, _, oneApp) {
	'use strict';

	oneApp.views = oneApp.views || {};

	oneApp.views.overlay = Backbone.View.extend({
		caller: null,

		events: {
			'click .ttfmake-overlay-close-update': 'onUpdate',
			'click .ttfmake-overlay-close-discard': 'onDiscard',
		},

		initialize: function() {
			this.model = new Backbone.Model();
		},

		open: function(view) {
			this.caller = view;

			this.$el.css('display', 'table');
			$('body').addClass('modal-open');
		},

		close: function(apply) {},

		onUpdate: function(e) {
			e.preventDefault();
			this.close(true);
		},

		onDiscard: function(e) {
			e.preventDefault();
			this.close(false);
		},
	});

	oneApp.views['tinymce-overlay'] = oneApp.views.overlay.extend({
		open: function(view) {
			oneApp.views.overlay.prototype.open.apply(this, arguments)

			// Auto focus on the editor
			var focusOn = (oneApp.builder.isVisualActive()) ? tinyMCE.get('make') : oneApp.builder.$makeTextArea;
			focusOn.focus();

			view.$el.trigger('overlayOpen');
		},

		close: function(apply) {
			this.$el.hide();
			$('body').removeClass('modal-open');

			if (apply) {
				oneApp.builder.setTextArea(oneApp.builder.activeTextAreaID);

				if ('' !== oneApp.builder.activeiframeID) {
					oneApp.builder.filliframe(oneApp.builder.activeiframeID);
				}

				this.toggleHasContent();

				var $textarea = $('#' + oneApp.builder.activeTextAreaID);
				var modelAttr = $textarea.data('model-attr');
				this.model.set(modelAttr, $textarea.val());
			}

			this.caller.$el.trigger('overlay-close', this.model.attributes);
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

	oneApp.views.settings = oneApp.views.overlay.extend({
		$overlay: null,
		$colorPickers: null,

		events: function() {
			return _.extend({}, oneApp.views.overlay.prototype.events, {
				'change input[type=text]' : 'updateInputField',
				'keyup input[type=text]' : 'updateInputField',
				'change input[type=checkbox]' : 'updateCheckbox',
				'change select': 'updateSelectField',
				'color-picker-change': 'onColorPickerChange',
				'click .ttfmake-media-uploader-add': 'onMediaAdd',
				'mediaSelected': 'onMediaSelected',
				'mediaRemoved': 'onMediaRemoved',
			});
		},

		open: function(view, $overlay) {
			this.render($overlay);
			oneApp.views.overlay.prototype.open.apply(this, arguments);
			this.$overlay = $overlay;

			$('.wp-color-result', $overlay).click().off('click');
			$( 'body' ).off( 'click.wpcolorpicker' );
			$overlay.find('input, select').filter(':first').focus();
		},

		render: function($overlay) {
			this.$el.remove();
			var $el = $overlay.clone();
			$el.removeAttr('id');
			$('body').append($el);
			this.setElement($el);

			this.$colorPickers = oneApp.builder.initColorPicker(this);
		},

		close: function(apply) {
			var changeset = {};
			this.$el.hide();

			// Reset color picker inputs
			// to original state
			if (this.$colorPickers) {
				this.$colorPickers.each(function() {
					var $this = $(this);
					$(this).wpColorPicker('close');
					$this.parents('.wp-picker-container').replaceWith($this);
					$this.show();
				});
				this.$colorPickers = null;
			}

			if (apply) {
				$('.ttfmake-overlay-body', this.$overlay).remove();
				$('.ttfmake-overlay-header', this.$overlay).after($('.ttfmake-overlay-body', this.$el));
				changeset = this.model.attributes;
			}

			this.caller.$el.trigger('overlay-close', changeset);
			$('body').removeClass('modal-open');
			this.remove();
		},

		updateInputField: function(e) {
			var $input				= $(e.target);
			var modelAttrName = $input.attr('data-model-attr');

			if (typeof modelAttrName !== 'undefined') {
				this.model.set(modelAttrName, $input.val());
			}
		},

		updateCheckbox: function(e) {
			var $checkbox = $(e.target);
			var modelAttrName = $checkbox.attr('data-model-attr');

			if (typeof modelAttrName !== 'undefined') {
				if ($checkbox.is(':checked')) {
					this.model.set(modelAttrName, 1);
				} else {
					this.model.set(modelAttrName, 0);
				}
			}
		},

		updateSelectField: function(e) {
			var $select = $(e.target);
			var modelAttrName = $select.attr('data-model-attr');

			if (typeof modelAttrName !== 'undefined') {
				this.model.set(modelAttrName, $select.val());
			}
		},

		onMediaAdd: function(e) {
			e.stopPropagation();
			oneApp.builder.initUploader(this, e.target);
		},

		onMediaSelected: function(e, attachment) {
			e.stopPropagation();
			this.model.set('background-image', attachment.id);
			this.model.set('background-image-url', attachment.url);
		},

		onMediaRemoved: function(e) {
			e.stopPropagation();
			this.model.set('background-image', '');
			this.model.set('background-image-url', '');
		},

		onColorPickerChange: function(e, data) {
			if (data) {
				this.model.set(data.modelAttr, data.color);
			}
		},
	});
})(window, jQuery, _, oneApp);