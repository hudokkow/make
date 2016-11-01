/* global jQuery, _ */
var oneApp = oneApp || {}, $oneApp = $oneApp || jQuery(oneApp);

(function (window, $, _, oneApp, $oneApp) {
	'use strict';

	oneApp.BannerView = oneApp.SectionView.extend({

		events: function() {
			return _.extend({}, oneApp.SectionView.prototype.events, {
				'click .ttfmake-add-slide' : 'addSlide',
				'model-slide-change': 'onSlideChange',
				'change .ttfmake-configuration-overlay input[type=text]' : 'updateInputField',
				'keyup .ttfmake-configuration-overlay input[type=text]' : 'updateInputField',
				'change .ttfmake-configuration-overlay input[type=checkbox]' : 'updateCheckbox',
				'change .ttfmake-configuration-overlay select': 'updateSelectField'
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

		onSlideChange: function() {
			this.model.trigger('change');
		},

		render: function () {
			oneApp.SectionView.prototype.render.apply(this, arguments);

			// Initialize the views when the app starts up
			oneApp.initBannerSlideViews(this);

			return this;
		},

		addSlide: function (evt, params) {
			evt.preventDefault();

			var slideModelDefaults = ttfMakeSectionDefaults['banner-item'] || {};
			var slideModelAttributes = _(slideModelDefaults).extend({
				id: new Date().getTime(),
				parentID: this.getParentID()
			});

			var slideModel = new oneApp.BannerSlideModel(slideModelAttributes);

			var slides = this.model.get('banner-slides');
			slides.push(slideModel);
			this.model.set('banner-slides', slides);

			// Create view
			var view = new oneApp.BannerSlideView({
				model: slideModel
			});

			// Append view
			var html = view.render().el;
			$('.ttfmake-banner-slides-stage', this.$el).append(html);

			// Only scroll and focus if not triggered by the pseudo event
			if ( ! params ) {
				// Scroll to added view and focus first input
				oneApp.scrollToAddedView(view);
			}

			// Initiate the color picker
			oneApp.initializeBannerSlidesColorPicker(view);

			// Add the section value to the sortable order
			oneApp.addOrderValue(view.model.get('id'), $('.ttfmake-banner-slide-order', $(view.$el).parents('.ttfmake-banner-slides')));
		},

		getParentID: function() {
			var idAttr = this.$el.attr('id'),
				id = idAttr.replace('ttfmake-section-', '');

			return parseInt(id, 10);
		}
	});

	// Makes banner slides sortable
	oneApp.initializeBannerSlidesSortables = function(view) {
		var $selector;
		view = view || '';

		if (view.$el) {
			$selector = $('.ttfmake-banner-slides-stage', view.$el);
		} else {
			$selector = $('.ttfmake-banner-slides-stage');
		}

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

				oneApp.setOrder($(this).sortable('toArray', {attribute: 'data-id'}), $orderInput);
			}
		});
	};

	// Initialize the color picker
	oneApp.initializeBannerSlidesColorPicker = function (view) {
		var $selector;
		view = view || '';

		if (view.$el) {
			$selector = $('.ttfmake-configuration-color-picker', view.$el);
		} else {
			$selector = $('.ttfmake-configuration-color-picker');
		}

		$selector.wpColorPicker();
	};

	// Initialize the sortables
	$oneApp.on('afterSectionViewAdded', function(evt, view) {
		if ('banner' === view.model.get('section-type') && view.model.get('banner-slides').length == 0) {
			// Add an initial slide item
			$('.ttfmake-add-slide', view.$el).trigger('click', {type: 'pseudo'});

			// Initialize the sortables
			oneApp.initializeBannerSlidesSortables(view);
		}
	});

	// Initialize available slides
	oneApp.initBannerSlideViews = function (view) {
		var slides = view.model.get('banner-slides');

		_(slides).each(function (slideModel) {
			// Build the view
			var slideView = new oneApp.BannerSlideView({
				model: slideModel,
				// el: $('.ttfmake-banner-slides-stage', view.$el),
				serverRendered: true
			});

			// Append view
			var html = slideView.render().el;
			$('.ttfmake-banner-slides-stage', view.$el).append(html);

			oneApp.initializeBannerSlidesColorPicker(slideView);
		});

		oneApp.initializeBannerSlidesSortables();
	};
})(window, jQuery, _, oneApp, $oneApp);
