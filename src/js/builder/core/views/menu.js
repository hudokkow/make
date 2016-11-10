/* global Backbone, jQuery, _, ttfmakeBuilderData, setUserSetting, deleteUserSetting */
var oneApp = oneApp || {}, $oneApp = $oneApp || jQuery(oneApp);

(function (window, Backbone, $, _, oneApp, $oneApp) {
	'use strict';

	oneApp.MenuView = Backbone.View.extend({
		el: '#ttfmake-menu',
		$stage: $('#ttfmake-stage'),
		$document: $(window.document),
		$scrollHandle: $('html, body'),
		$pane: $('.ttfmake-menu-pane'),

		initialize: function () {
			this.listenTo(oneApp.sections, 'add', this.addOne);
		},

		events: {
			'click .ttfmake-menu-list-item-link': 'onSectionAdd',
			'section-sort': 'onSectionSort',
		},

		onSectionAdd: function (e) {
			e.preventDefault();

			var sectionType = $(e.currentTarget).data('section');
			var modelClass = oneApp.models[sectionType];
			var sectionDefaults = ttfMakeSectionDefaults[sectionType] || {};
			var modelAttributes = _(modelClass.prototype.defaults)
				.extend(sectionDefaults, {
					'section-type': sectionType,
					'id': new Date().getTime()
				});

			var model = new modelClass(modelAttributes);
			oneApp.sections.add(model);
		},

		onSectionSort: function(e, ids) {
			var sortedSections = _(ids).map(function(id) {
				return oneApp.sections.findWhere({id: id});
			});

			oneApp.sections.reset(sortedSections);
		},

		addOne: function (section) {
			var viewClass = oneApp.views[section.get('section-type')];
			var view = new viewClass({
				model: section
			});

			var html = view.render().el;
			this.$stage.append(html);
			view.$el.trigger('view-ready');

			oneApp.scrollToAddedView(view);
			oneApp.sections.toggleStageClass();
		},

		menuToggle: function(evt) {
			evt.preventDefault();
			var id = ttfmakeBuilderData.pageID,
				key = 'ttfmakemt' + parseInt(id, 10);

			// Open it down
			if (this.$pane.is(':hidden')) {
				this.$pane.slideDown({
					duration: oneApp.options.openSpeed,
					easing: 'easeInOutQuad',
					complete: function() {
						deleteUserSetting( key );
						this.$el.addClass('ttfmake-menu-opened').removeClass('ttfmake-menu-closed');
					}.bind(this)
				});

			// Close it up
			} else {
				this.$pane.slideUp({
					duration: oneApp.options.closeSpeed,
					easing: 'easeInOutQuad',
					complete: function() {
						setUserSetting( key, 'c' );
						this.$el.addClass('ttfmake-menu-closed').removeClass('ttfmake-menu-opened');
					}.bind(this)
				});
			}
		}
	});
})(window, Backbone, jQuery, _, oneApp, $oneApp);
