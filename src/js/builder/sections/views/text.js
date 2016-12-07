/* global jQuery, _ */
var oneApp = oneApp || {}, $oneApp = $oneApp || jQuery(oneApp);

(function (window, $, _, oneApp, $oneApp) {
	'use strict';

	oneApp.views = oneApp.views || {}

	oneApp.views.text = oneApp.views.section.extend({
		itemViews: [],

		events: function() {
			return _.extend({}, oneApp.views.section.prototype.events, {
				'change .ttfmake-text-columns' : 'handleColumns',
				'mouseup .ttfmake-text-column' : 'updateJSONOnSlide',
				'model-item-change': 'onTextItemChange',
				'columns-sort': 'onColumnsSort',
				'view-ready': 'onViewReady'
			});
		},

		render: function() {
			var modelColumns = _(this.model.get('columns'));
			var dataColumns = _(modelColumns).clone();

			oneApp.views.section.prototype.render.apply(this, arguments);

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

				var textItemModel = new oneApp.models['text-item'](textItemModelAttributes);
				var textItemElSelector = '.ttfmake-text-column[data-id='+ourIndex+']';

				dataColumns[ourIndex] = textItemModel;

				// create view
				var itemView = new oneApp.views['text-item']({
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
			var link = oneApp.builder.getFrameHeadLinks();

			$('iframe', this.$el).each(function() {
				var $this = $(this);

				var id = $this.attr('id').replace('ttfmake-iframe-', '');

				oneApp.builder.initFrame(id, link);
			});
		},

		onColumnsSort: function(e, ids) {
			e.stopPropagation();

			this.model.updateOrder(ids);
		},

		handleColumns : function (evt) {
			evt.preventDefault();

			var columns = $(evt.target).val(),
				$stage = $('.ttfmake-text-columns-stage', this.$el);

			$stage.removeClass('ttfmake-text-columns-1 ttfmake-text-columns-2 ttfmake-text-columns-3 ttfmake-text-columns-4');
			$stage.addClass('ttfmake-text-columns-' + parseInt(columns, 10));
		},

		onTextItemChange: function(evt) {
			this.model.trigger('change');
		},

		initializeColumnsSortables: function() {
			var $sortableSelector = $('.ttfmake-text-columns-stage', this.$el);
			var self = this;

			$sortableSelector.sortable({
				handle: '.ttfmake-sortable-handle',
				placeholder: 'sortable-placeholder',
				items: '.ttfmake-text-column',
				forcePlaceholderSizeType: true,
				distance: 2,
				zIndex: 99999,
				tolerance: 'pointer',
				create: function() {
					self.$el.trigger('columns-sortable-init');
				},
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

					var ids = $(this).sortable('toArray', {attribute: 'data-model-id'});

					self.initFrames();

					self.$el.trigger('columns-sort', [ids]);
				}
			});
		}
	});
})(window, jQuery, _, oneApp, $oneApp);
