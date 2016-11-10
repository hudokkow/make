/* global jQuery, _ */
var oneApp = oneApp || {}, $oneApp = $oneApp || jQuery(oneApp);

(function (window, $, _, oneApp, $oneApp) {
	'use strict';

	oneApp.BannerView = oneApp.SectionView.extend({
		itemViews: [],

		events: function() {
			return _.extend({}, oneApp.SectionView.prototype.events, {
				'click .ttfmake-add-slide' : 'onSlideAdd',
				'model-item-change': 'onSlideChange',
				'change .ttfmake-configuration-overlay input[type=text]' : 'updateInputField',
				'keyup .ttfmake-configuration-overlay input[type=text]' : 'updateInputField',
				'change .ttfmake-configuration-overlay input[type=checkbox]' : 'updateCheckbox',
				'change .ttfmake-configuration-overlay select': 'updateSelectField',
				'view-ready': 'onViewReady',
				'item-sort': 'onSlideSort',
				'slide-remove': 'onSlideRemove',
				'color-picker-change': 'onColorPickerChange'
			});
		},

		updateInputField: function(evt) {
			var $input				= $(evt.target);
			var modelAttrName = $input.attr('data-model-attr');

			if (typeof modelAttrName !== 'undefined') {
				this.model.set(modelAttrName, $input.val());
			}
		},

		updateCheckbox: function(evt) {
			var $checkbox = $(evt.target);
			var modelAttrName = $checkbox.attr('data-model-attr');

			if (typeof modelAttrName !== 'undefined') {
				if ($checkbox.is(':checked')) {
					this.model.set(modelAttrName, 1);
				} else {
					this.model.set(modelAttrName, 0);
				}
			}
		},

		updateSelectField: function(evt) {
			var $select = $(evt.target);
			var modelAttrName = $select.attr('data-model-attr');

			if (typeof modelAttrName !== 'undefined') {
				this.model.set(modelAttrName, $select.val());
			}
		},

		render: function () {
			oneApp.SectionView.prototype.render.apply(this, arguments);

			var slides = this.model.get('banner-slides'),
					self = this;

			if (slides.length == 0) {
				$('.ttfmake-add-slide', this.$el).trigger('click', true);
				return this;
			}

			_(slides).each(function (slideModel) {
				var slideView = self.addSlide(slideModel);
			});

			return this;
		},

		onViewReady: function(e) {
			this.initializeSortables();
			oneApp.initColorPicker(this);

			_(this.itemViews).each(function(slideView) {
				slideView.$el.trigger('view-ready');
			});
		},

		onSlideChange: function() {
			this.model.trigger('change');
		},

		onSlideSort: function(e, ids) {
			e.stopPropagation();

			var slides = _(this.model.get('banner-slides'));
			var sortedSlides = _(ids).map(function(id) {
				return slides.findWhere({id: id});
			});

			this.model.set('banner-slides', sortedSlides);
		},

		onSlideRemove: function(e, slideView) {
			var slides = this.model.get('banner-slides');
			this.model.set('banner-slides', _(slides).without(slideView.model));
		},

		addSlide: function(slideModel) {
			// Build the view
			var slideView = new oneApp.BannerSlideView({
				model: slideModel
			});

			// Append view
			var html = slideView.render().el;
			$('.ttfmake-banner-slides-stage', this.$el).append(html);

			// Store view
			this.itemViews.push(slideView);

			return slideView;
		},

		onSlideAdd: function (e, pseudo) {
			e.preventDefault();

			var slideModelDefaults = ttfMakeSectionDefaults['banner-item'] || {};
			var slideModelAttributes = _(slideModelDefaults).extend({
				id: new Date().getTime().toString(),
				parentID: this.model.id
			});
			var slideModel = new oneApp.BannerSlideModel(slideModelAttributes);
			var slideView = this.addSlide(slideModel);
			slideView.$el.trigger('view-ready');

			var slides = this.model.get('banner-slides');
			slides.push(slideModel);
			this.model.set('banner-slides', slides);
			this.model.trigger('change');

			if (!pseudo) {
				oneApp.scrollToAddedView(slideView);
			}
		},

		onColorPickerChange: function(e, data) {
			this.model.set(data.modelAttr, data.color);
		},

		getParentID: function() {
			var idAttr = this.$el.attr('id'),
				id = idAttr.replace('ttfmake-section-', '');

			return parseInt(id, 10);
		},

		initializeSortables: function() {
			var $selector = $('.ttfmake-banner-slides-stage', this.$el);
			var self = this;

			$selector.sortable({
				handle: '.ttfmake-sortable-handle',
				placeholder: 'sortable-placeholder',
				forcePlaceholderSizeType: true,
				distance: 2,
				tolerance: 'pointer',
				start: function (event, ui) {
					// Set the height of the placeholder to that of the sorted item
					var $item = $(ui.item.get(0)),
						$stage = $item.parents('.ttfmake-banner-slides-stage');

					$('.sortable-placeholder', $stage).height($item.height());
				},
				stop: function (event, ui) {
					var $item = $(ui.item.get(0)),
						$stage = $item.parents('.ttfmake-banner-slides'),
						$orderInput = $('.ttfmake-banner-slide-order', $stage);

					var ids = $(this).sortable('toArray', {attribute: 'data-id'});
					self.$el.trigger('item-sort', [ids]);
				}
			});
		}
	});
})(window, jQuery, _, oneApp, $oneApp);
