/* global jQuery, _ */
var oneApp = oneApp || {}, $oneApp = $oneApp || jQuery(oneApp);

(function (window, $, _, oneApp, $oneApp) {
	'use strict';

	oneApp.TextView = oneApp.SectionView.extend({
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
			var self = this;
			var modelColumns = self.model.get('columns');
			var columnsOrder = self.model.get('columns-order');
			var sortedColumns = {1:{}, 2:{}, 3:{}, 4:{}};

			_(columnsOrder).each(function(id, index) {
				console.log(index+1+':'+id);
				sortedColumns[index+1] = modelColumns[id];
			});

			this.model.set('columns', sortedColumns);

			oneApp.SectionView.prototype.render.apply(this, arguments);

			_(sortedColumns).each(function(columnModel, index) {
				var textItemModelDefaults = {
					'image-link': '',
					'image-id': '',
					'image-url': '',
					'title': '',
					'content': '',
					'index': ''
				};

				var textItemModelAttributes = _(textItemModelDefaults).extend({
					id: new Date().getTime(),
					parentID: self.model.get('id')
				});

				// extend TextItemModel attributes with actual model data
				textItemModelAttributes = _(textItemModelAttributes).extend(columnModel);

				var textItemModel = new oneApp.TextItemModel(textItemModelAttributes);
				var textItemElSelector = '.ttfmake-text-column[data-id='+index+']';

				// set TextItemModel attributes to matching model in TextModel
				sortedColumns[index] = textItemModel.attributes;

				// create view
				self['textItemView'+index] = new oneApp.TextItemView({
					model: textItemModel,
					elSelector: textItemElSelector
				});

				// set view element and render
				self['textItemView'+index].setElement(self.$(textItemElSelector)).render();
			});

			self.model.set('columns', sortedColumns);

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
			console.log(evt);
			this.model.trigger('change');
		},

		initializeColumnsSortables: function() {
			var $selector = $('.ttfmake-text-columns-stage', this.$el);
			var self = this;

			$selector.sortable({
				handle: '.ttfmake-sortable-handle',
				placeholder: 'sortable-placeholder',
				forcePlaceholderSizeType: true,
				distance: 2,
				tolerance: 'pointer',
				start: function(event, ui) {
					var $item = $(ui.item.get(0)),
						$stage = $item.parents('.ttfmake-text-columns-stage');

					$('.sortable-placeholder', $stage).height($item.height()).css({
						'flex': $item.css('flex'),
						'-webkit-flex': $item.css('-webkit-flex')
					});;
				},
				stop: function(event, ui) {
					var $item = $(ui.item.get(0));

					console.log(self.$el.attr('data-id') + '-' + $item.attr('data-id'));

					var ids = $(this).sortable('toArray', {attribute: 'data-id'});
					self.$el.trigger('columns-sort', [ids]);
				}
			});
		}
	});

	// Makes gallery items sortable
	/*oneApp.initializeTextColumnSortables = function(view) {
		var $selector;
		view = view || '';

		if (view.$el) {
			$selector = $('.ttfmake-text-columns-stage', view.$el);
		} else {
			$selector = $('.ttfmake-text-columns-stage');
		}

		$selector.sortable({
			handle: '.ttfmake-sortable-handle',
			placeholder: 'sortable-placeholder',
			forcePlaceholderSizeType: true,
			distance: 2,
			tolerance: 'pointer',
			zIndex: 99999,
			start: function (event, ui) {
				// Set the height of the placeholder to that of the sorted item
				var $item = $(ui.item.get(0)),
					$stage = $item.parents('.ttfmake-text-columns-stage'),
					addClass = '';

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

				$('.sortable-placeholder', $stage)
					.height(parseInt($item.height(), 10) - 2) // -2 to account for placeholder border
					.css({
						'flex': $item.css('flex'),
						'-webkit-flex': $item.css('-webkit-flex')
					});
			},
			stop: function (event, ui) {
				var $item = $(ui.item.get(0)),
					$section = $item.parents('.ttfmake-section'),
					$stage = $('.ttfmake-section-body', $section),
					$columnsStage = $item.parents('.ttfmake-text-columns-stage'),
					$orderInput = $('.ttfmake-text-columns-order', $stage),
					id = $section.attr('data-id'),
					column = $item.attr('data-id'),
					i;

				var ids = $(this).sortable('toArray', {attribute: 'data-id'});
				self.$el.trigger('text-sort', [ids]);

				// Label the columns according to the position they are in
				i = 1;
				$('.ttfmake-text-column', $stage).each(function(){
					$(this)
						.removeClass('ttfmake-text-column-position-1 ttfmake-text-column-position-2 ttfmake-text-column-position-3 ttfmake-text-column-position-4')
						.addClass('ttfmake-text-column-position-' + i);
					i++;
				});

				// Remove the temporary classes from stage
				$columnsStage.removeClass('current-item-two-thirds current-item-one-third current-item-one-fourth current-item-three-fourths current-item-one-half');
			}
		});
	};*/
})(window, jQuery, _, oneApp, $oneApp);
