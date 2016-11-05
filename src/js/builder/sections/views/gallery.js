/* global jQuery, _ */
var oneApp = oneApp || {}, $oneApp = $oneApp || jQuery(oneApp);

(function (window, $, _, oneApp, $oneApp) {
	'use strict';

	oneApp.GalleryView = oneApp.SectionView.extend({
		itemViews: [],

		events: function() {
			return _.extend({}, oneApp.SectionView.prototype.events, {
				'change .ttfmake-gallery-columns' : 'handleColumns',
				'change .ttfmake-configuration-overlay input[type=text]' : 'updateInputField',
				'keyup .ttfmake-configuration-overlay input[type=text]' : 'updateInputField',
				'change .ttfmake-configuration-overlay input[type=checkbox]' : 'updateCheckbox',
				'change .ttfmake-configuration-overlay select': 'updateSelectField',
				'view-ready': 'onViewReady',
				'click .ttfmake-gallery-add-item' : 'onItemAdd',
				'model-item-change': 'onItemChange',
				'item-sort': 'onItemSort',
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

			var items = this.model.get('gallery-items'),
					self = this;

			if (items.length == 0) {
				var $addButton = $('.ttfmake-gallery-add-item', this.$el);
				$addButton.trigger('click', {type: 'pseudo'});
				$addButton.trigger('click', {type: 'pseudo'});
				$addButton.trigger('click', {type: 'pseudo'});
				return this;
			}

			_(items).each(function (itemModel) {
				var itemView = self.addItem(itemModel);
			});

			return this;
		},

		onViewReady: function(e) {
			e.stopPropagation();

			this.initializeSortables();
			oneApp.initColorPicker(this);
		},

		addItem: function(itemModel) {
			// Create view
			var itemView = new oneApp.GalleryItemView({
				model: itemModel
			});

			var html = itemView.render().el;
			$('.ttfmake-gallery-items-stage', this.$el).append(html);

			// Store view
			this.itemViews.push(itemView);

			return itemView;
		},

		onItemAdd : function (evt) {
			evt.preventDefault();

			var itemModelDefaults = ttfMakeSectionDefaults['gallery-item'] || {};
			var itemModelAttributes = _(itemModelDefaults).extend({
				id: new Date().getTime().toString(),
				parentID: this.getParentID()
			});
			var itemModel = new oneApp.GalleryItemModel(itemModelAttributes);
			var itemView = this.addItem(itemModel);
			itemView.$el.trigger('view-ready');

			var items = this.model.get('gallery-items');
			items.push(itemModel);
			this.model.set('gallery-items', items);
			this.model.trigger('change');

			oneApp.scrollToAddedView(itemView);
		},

		onItemSort: function(e, ids) {
			e.stopPropagation();

			var items = _(this.model.get('gallery-items'));
			var sortedItems = _(ids).map(function(id) {
				return items.findWhere({id: id});
			});

			this.model.set('gallery-items', sortedItems);
		},

		onItemChange: function() {
			this.model.trigger('change');
		},

		getParentID: function() {
			var idAttr = this.$el.attr('id'),
				id = idAttr.replace('ttfmake-section-', '');

			return parseInt(id, 10);
		},

		initializeSortables: function() {
			var $selector = $('.ttfmake-gallery-items-stage', this.$el);
			var self = this;

			$selector.sortable({
				handle: '.ttfmake-sortable-handle',
				placeholder: 'sortable-placeholder',
				distance: 2,
				tolerance: 'pointer',
				start: function (event, ui) {
					// Set the height of the placeholder to that of the sorted item
					var $item = $(ui.item.get(0)),
						$stage = $item.parents('.ttfmake-gallery-items-stage');

					$('.sortable-placeholder', $stage)
						.height(parseInt($item.height(), 10) - 2); // -2 to account for placeholder border
				},
				stop: function (event, ui) {
					var $item = $(ui.item.get(0)),
						$stage = $item.parents('.ttfmake-gallery-items'),
						$orderInput = $('.ttfmake-gallery-item-order', $stage);

					var ids = $(this).sortable('toArray', {attribute: 'data-id'});
					self.$el.trigger('item-sort', [ids]);
				}
			});
		},

		handleColumns : function (evt) {
			evt.preventDefault();

			var columns = $(evt.target).val(),
				$stage = $('.ttfmake-gallery-items-stage', this.$el);

			$stage.removeClass('ttfmake-gallery-columns-1 ttfmake-gallery-columns-2 ttfmake-gallery-columns-3 ttfmake-gallery-columns-4');
			$stage.addClass('ttfmake-gallery-columns-' + parseInt(columns, 10));
		}
	});

	// Initialize the color picker
	// oneApp.initializeGalleryItemColorPicker = function (view) {
	// 	var $selector;
	// 	view = view || '';

	// 	if (view.$el) {
	// 		$selector = $('.ttfmake-gallery-background-color', view.$el);
	// 	} else {
	// 		$selector = $('.ttfmake-gallery-background-color');
	// 	}

	// 	$selector.wpColorPicker();
	// };

	// // Initialize the sortables
	// $oneApp.on('afterSectionViewAdded', function(evt, view) {
	// 	if ('gallery' === view.model.get('section-type')) {
	// 		// Initialize the sortables and picker
	// 		// oneApp.initializeGalleryItemColorPicker(view);
	// 	}
	// });

	// Set the classes for the elements
	oneApp.setClearClasses = function ($el) {
		var columns = $('.ttfmake-gallery-columns', $el).val(),
			$items = $('.ttfmake-gallery-item', $el);

		$items.each(function(index, item){
			var $item = $(item);
			if (0 !== index && 0 === index % columns) {
				$item.addClass('clear');
			} else {
				$item.removeClass('clear');
			}
		});
	};

	// Initialize the views when the app starts up
	// oneApp.initGalleryItemViews();
})(window, jQuery, _, oneApp, $oneApp);
