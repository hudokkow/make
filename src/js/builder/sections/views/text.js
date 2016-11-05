/* global jQuery, _ */
var oneApp = oneApp || {}, $oneApp = $oneApp || jQuery(oneApp);

(function (window, $, _, oneApp, $oneApp) {
	'use strict';

	oneApp.TextView = oneApp.SectionView.extend({
		itemViews: [],
		
		events: function() {
			return _.extend({}, oneApp.SectionView.prototype.events, {
				'change .ttfmake-text-columns' : 'handleColumns',
				'mouseup .ttfmake-text-column' : 'updateJSONOnSlide',
				'model-item-change': 'onTextItemChange',
				'change .ttfmake-configuration-overlay input[type=text]' : 'updateInputField',
				'change .ttfmake-configuration-overlay input[type=checkbox]' : 'updateCheckbox',
				'change .ttfmake-configuration-overlay select': 'updateSelectField',
				'columns-sort': 'onColumnsSort',
				'view-ready': 'onViewReady'
			});
		},

		render: function() {
			var modelColumns = _(this.model.get('columns'));
			var dataColumns = _(modelColumns).clone();
			
			oneApp.SectionView.prototype.render.apply(this, arguments);

			var self = this;

			_(modelColumns).each(function(columnModel, index) {
				var ourIndex = parseInt(index, 10);

				var textItemModelDefaults = {
					'id': '',
					'parentID': '',
					'image-link': '',
					'image-id': '',
					'image-url': '',
					'title': '',
					'content': ''
				};

				var textItemModelAttributes = _(textItemModelDefaults).extend({
					id: new Date().getTime(),
					parentID: self.model.get('id')
				});

				// extend TextItemModel attributes with actual model data
				textItemModelAttributes = _(textItemModelAttributes).extend(columnModel);

				var textItemModel = new oneApp.TextItemModel(textItemModelAttributes);
				var textItemElSelector = '.ttfmake-text-column[data-id='+ourIndex+']';

				dataColumns[ourIndex] = textItemModel.attributes;

				// create view
				var itemView = new oneApp.TextItemView({
					model: textItemModel,
					elSelector: textItemElSelector
				});

				// set view element and render
				itemView.setElement(self.$(textItemElSelector)).render();

				self.itemViews.push(itemView);
			});

			self.model.set('columns', dataColumns);

			return this;
		},

		onViewReady: function(e) {
			e.stopPropagation();

			this.initializeColumnsSortables();
			this.initFrames();
		},

		initFrames: function(e) {
			var link = oneApp.getFrameHeadLinks();

			$('iframe', this.$el).each(function() {
				var $this = $(this);

				var id = $this.attr('id').replace('ttfmake-iframe-', '');
				oneApp.initFrame(id, link);
			});
		},

		onColumnsSort: function(e, ids) {
			e.stopPropagation();

			this.model.set('columns-order', ids);
		},

		handleColumns : function (evt) {
			evt.preventDefault();

			var columns = $(evt.target).val(),
				$stage = $('.ttfmake-text-columns-stage', this.$el);

			$stage.removeClass('ttfmake-text-columns-1 ttfmake-text-columns-2 ttfmake-text-columns-3 ttfmake-text-columns-4');
			$stage.addClass('ttfmake-text-columns-' + parseInt(columns, 10));
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

		onTextItemChange: function(evt) {
			this.model.set('columns-order', ["1", "2", "3", "4"]);
			this.model.trigger('change');
		},

		initializeColumnsSortables: function() {
			var $sortableSelector = $('.ttfmake-text-columns-stage', this.$el);
			var self = this;

			$sortableSelector.sortable({
				handle: '.ttfmake-sortable-handle',
				placeholder: 'sortable-placeholder',
				forcePlaceholderSizeType: true,
				distance: 2,
				tolerance: 'pointer',
				start: function(event, ui) {
					var $item = $(ui.item.get(0)),
						$stage = $item.parents('.ttfmake-text-columns-stage');

					/**
					 * Make Plus feature from here
					 */
					var addClass;

					// If text item, potentially add class to stage
					if ($item.hasClass('ttfmake-text-column')) {
						if ($item.hasClass('ttfmake-column-width-two-thirds')) {
							addClass = 'current-item-two-thirds';
						} else if ($item.hasClass('ttfmake-column-width-one-third')) {
							addClass = 'current-item-one-third';
						} else if ($item.hasClass('ttfmake-column-width-one-fourth')) {
							addClass = 'current-item-one-fourth';
						} else if ($item.hasClass('ttfmake-column-width-three-fourths')) {
							addClass = 'current-item-three-fourths';
						} else if ($item.hasClass('ttfmake-column-width-one-half')) {
							addClass = 'current-item-one-half';
						}
						
						$stage.addClass(addClass);
					}

					$('.sortable-placeholder', $stage).height($item.height()).css({
						'flex': $item.css('flex'),
						'-webkit-flex': $item.css('-webkit-flex')
					});
				},
				stop: function(event, ui) {
					var $item = $(ui.item.get(0)),
						$stage = $item.parents('.ttfmake-text-columns-stage');

					var i = 1;

					$('.ttfmake-text-column', $stage).each(function() {
						$(this).removeClass('ttfmake-text-column-position-1 ttfmake-text-column-position-2 ttfmake-text-column-position-3 ttfmake-text-column-position-4')
							.addClass('ttfmake-text-column-position-' + i);
						i++;
					});

					var ids = $(this).sortable('toArray', {attribute: 'data-id'});
					self.$el.trigger('columns-sort', [ids]);
				}
			});
		}
	});
})(window, jQuery, _, oneApp, $oneApp);
