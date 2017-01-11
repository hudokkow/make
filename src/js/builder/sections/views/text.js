/* global jQuery, _ */
var oneApp = oneApp || {};

(function (window, $, _, oneApp) {
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
			oneApp.views.section.prototype.render.apply(this, arguments);

			var columns = this.model.get('columns');
			var self = this;

			if (typeof columns === 'undefined' || !columns.length) {
				this.addColumns(3);
			} else {
				_(columns).each(function(columnModel) {
					var columnView = self.addColumn(columnModel);
				});
			}

			return this;
		},

		addColumn: function(columnModel) {
			var columnView = new oneApp.views['text-item']({
				model: columnModel
			});

			var html = columnView.render().el;
			$('.ttfmake-text-columns-stage', this.$el).append(html);

			this.itemViews.push(columnView);

			return columnView;
		},

		addColumns: function(number) {
			if (typeof number === 'undefined') {
				number = 1;
			}

			for (var i = 1; i <= number; i++) {
				var columnModelDefaults = ttfMakeSectionDefaults['text-item'] || {};
				var columnModelAttributes = _(columnModelDefaults).extend({
					id: new Date().getTime().toString(),
					parentID: this.model.id
				});

				var columnModel = new oneApp.models['text-item'](columnModelAttributes);
				var columnView = this.addColumn(columnModel);

				columnView.$el.trigger('view-ready');

				var columns = this.model.get('columns');
				columns.push(columnModel);

				this.model.set('columns', columns);
				this.model.trigger('change');
			}
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

			var columns = _(this.model.get('columns'));
			var sortedColumns = _(ids).map(function(id) {
				return columns.find(function(column) {
					return column.id.toString() === id.toString();
				});
			});

			this.model.set('columns', sortedColumns);
		},

		handleColumns : function (evt) {
			evt.preventDefault();

			var columns = parseInt($(evt.target).val(), 10),
				$stage = $('.ttfmake-text-columns-stage', this.$el);

			var numberOfColumnsToCreate = columns - this.model.get('columns').length;

			if (numberOfColumnsToCreate !== 0) {
				if (numberOfColumnsToCreate > 0) {
					this.addColumns(numberOfColumnsToCreate);
				}
			}

			$stage.removeClass(function(i, className) {
				return className.match(/ttfmake-text-columns-[0-9]/g || []).join(' ');
			});

			$stage.addClass('ttfmake-text-columns-' + columns);
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

					var ids = $(this).sortable('toArray', {attribute: 'data-id'});
					self.$el.trigger('columns-sort', [ids]);
				}
			});
		}
	});
})(window, jQuery, _, oneApp);
