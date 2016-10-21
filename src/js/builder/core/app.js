/*global jQuery, tinyMCE, switchEditors */
var oneApp = oneApp || {}, ttfMakeFrames = ttfMakeFrames || [];

(function ($, oneApp, ttfMakeFrames) {
	'use strict';

	// Kickoff Backbone App
	new oneApp.MenuView();

	oneApp.options = {
		openSpeed : 400,
		closeSpeed: 250
	};

	oneApp.cache = {
		$sectionOrder: $('#ttfmake-section-order'),
		$scrollHandle: $('html, body'),
		$makeEditor: $('#wp-make-wrap'),
		$makeTextArea: $('#make')
	};

	oneApp.templateSettings = {
		evaluate   : /<#([\s\S]+?)#>/g,
		interpolate: /\{\{\{([\s\S]+?)\}\}\}/g,
		escape     : /\{\{([^\}]+?)\}\}(?!\})/g
	};

	oneApp.initSortables = function () {
		$('.ttfmake-stage').sortable({
			handle: '.ttfmake-section-header',
			placeholder: 'sortable-placeholder',
			forcePlaceholderSizeType: true,
			distance: 2,
			tolerance: 'pointer',
			start: function (event, ui) {
				// Set the height of the placeholder to that of the sorted item
				var $item = $(ui.item.get(0)),
					$stage = $item.parents('.ttfmake-stage');

				$item.css('-webkit-transform', 'translateZ(0)');
				$('.sortable-placeholder', $stage).height(parseInt($item.height(), 10) - 2);
			},
			stop: function (event, ui) {
				var $item = $(ui.item.get(0)),
					$frames = $('iframe', $item);

				$item.css('-webkit-transform', '');
				oneApp.setOrder( $(this).sortable('toArray', {attribute: 'data-id'}), oneApp.cache.$sectionOrder );

				$.each($frames, function() {
					var id = $(this).attr('id').replace('ttfmake-iframe-', '');
					setTimeout(function() {
						oneApp.initFrame(id);
					}, 100);
				});
			}
		});
	};

	oneApp.setOrder = function (order, $input) {
		var sectionID = $input.closest('.ttfmake-section').attr('data-id');

		// Use a comma separated list
		order = order.join();

		// Set the val of the input
		$input.val(order);

		oneApp.setActiveSectionID(sectionID);
		oneApp.updateSectionJSON();
	};

	oneApp.addOrderValue = function (id, $input) {
		var currentOrder = $input.val(),
			currentOrderArray;

		if ('' === currentOrder) {
			currentOrderArray = [id];
		} else {
			currentOrderArray = currentOrder.split(',');
			currentOrderArray.push(id);
		}

		oneApp.setOrder(currentOrderArray, $input);
	};

	oneApp.removeOrderValue = function (id, $input) {
		var currentOrder = $input.val(),
			currentOrderArray;

		if ('' === currentOrder) {
			currentOrderArray = [];
		} else {
			currentOrderArray = currentOrder.split(',');
			currentOrderArray = _.reject(currentOrderArray, function (item) {
				return id.toString() === item.toString();
			});
		}

		oneApp.setOrder(currentOrderArray, $input);
	};

	oneApp.initViews = function () {
		if (typeof ttfMakeSectionData === 'object') {
			_.forEach(ttfMakeSectionData, function(sectionData, sectionID) {
				var sectionModel,
						modelViewName,
						view,
						viewName;

				sectionModel	= new oneApp.SectionModel(sectionData);
				modelViewName = sectionModel.get('viewName') + 'View';
				viewName			= oneApp.hasOwnProperty(modelViewName) ? modelViewName : 'SectionView';

				view = new oneApp[viewName]({
					model: sectionModel
				});
			});
		}
	};

	oneApp.scrollToAddedView = function (view) {
		// Scroll to the new section
		oneApp.cache.$scrollHandle.animate({
			scrollTop: parseInt($('#' + view.idAttr).offset().top, 10) - 32 - 9 // Offset + admin bar height + margin
		}, 800, 'easeOutQuad', function() {
			oneApp.focusFirstInput(view);
		});
	};

	oneApp.focusFirstInput = function (view) {
		$('input[type="text"]', view.$el).not('.wp-color-picker').first().focus();
	};

	oneApp.filliframe = function (iframeID) {
		var iframe = document.getElementById(iframeID),
			iframeContent = iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow.document,
			iframeBody = $('body', iframeContent),
			content;

		content = oneApp.getMakeContent();

		// Since content is being displayed in the iframe, run it through autop
		content = switchEditors.wpautop(oneApp.wrapShortcodes(content));

		iframeBody.html(content);
	};

	oneApp.setTextArea = function (textAreaID) {
		$('#' + textAreaID).val(oneApp.getMakeContent());

		// update section JSON with new content
		oneApp.updateSectionJSON();
	};

	oneApp.getMakeContent = function () {
		var content = '';

		if (oneApp.isVisualActive()) {
			content = tinyMCE.get('make').getContent();
		} else {
			content = oneApp.cache.$makeTextArea.val();
		}

		return content;
	};

	oneApp.setMakeContent = function (content) {
		if (oneApp.isVisualActive()) {
			tinyMCE.get('make').setContent(switchEditors.wpautop(content));
		} else {
			oneApp.cache.$makeTextArea.val(switchEditors.pre_wpautop(content));
		}
	};

	oneApp.setMakeContentFromTextArea = function (iframeID, textAreaID) {
		var textAreaContent = $('#' + textAreaID).val();

		oneApp.setActiveiframeID(iframeID);
		oneApp.setActiveTextAreaID(textAreaID);
		oneApp.setMakeContent(textAreaContent);
	};

	oneApp.setActiveiframeID = function(iframeID) {
		oneApp.activeiframeID = iframeID;
	};

	oneApp.setActiveTextAreaID = function(textAreaID) {
		oneApp.activeTextAreaID = textAreaID;
	};

	oneApp.getActiveiframeID = function() {
		if (oneApp.hasOwnProperty('activeiframeID')) {
			return oneApp.activeiframeID;
		} else {
			return '';
		}
	};

	oneApp.getActiveTextAreaID = function() {
		if (oneApp.hasOwnProperty('activeTextAreaID')) {
			return oneApp.activeTextAreaID;
		} else {
			return '';
		}
	};

	oneApp.setActiveSectionID = function(sectionID) {
		if (sectionID) {
			oneApp.activeSectionID = sectionID;
		}
	};

	oneApp.getActiveSectionID = function() {
		if (oneApp.hasOwnProperty('activeSectionID')) {
			return oneApp.activeSectionID;
		} else {
			return '';
		}
	};

	oneApp.isTextActive = function() {
		return oneApp.cache.$makeEditor.hasClass('html-active');
	};

	oneApp.isVisualActive = function() {
		return oneApp.cache.$makeEditor.hasClass('tmce-active');
	};

	oneApp.initFrames = function() {
		if (ttfMakeFrames.length > 0) {
			var link = oneApp.getFrameHeadLinks();

			// Add content and CSS
			_.each(ttfMakeFrames, function(id) {
				oneApp.initFrame(id, link);
			});
		}
	};

	oneApp.initFrame = function(id, link) {
		var content = $('#ttfmake-content-' + id).val(),
			iframe = document.getElementById('ttfmake-iframe-' + id),
			iframeContent = iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow.document,
			iframeHead = $('head', iframeContent),
			iframeBody = $('body', iframeContent);

		link = link || oneApp.getFrameHeadLinks();

		iframeHead.html(link);
		iframeBody.html(switchEditors.wpautop(oneApp.wrapShortcodes(content)));

		// Firefox hack
		// @link http://stackoverflow.com/a/24686535
		$(iframe).on('load', function() {
			$(this).contents().find('head').html(link);
			$(this).contents().find('body').html(switchEditors.wpautop(oneApp.wrapShortcodes(content)));
		});
	};

	oneApp.getFrameHeadLinks = function() {
		var scripts = tinyMCEPreInit.mceInit.make.content_css.split(','),
			link = '';

		// Create the CSS links for the head
		_.each(scripts, function(e) {
			link += '<link type="text/css" rel="stylesheet" href="' + e + '" />';
		});

		return link;
	};

	oneApp.wrapShortcodes = function(content) {
		return content.replace(/^(<p>)?(\[.*\])(<\/p>)?$/gm, '<div class="shortcode-wrapper">$2</div>');
	};

	oneApp.triggerInitFrames = function() {
		$(document).ready(function(){
			oneApp.initFrames();
		});
	};

	oneApp.updateSectionJSON = function(sectionID) {
		sectionID = sectionID || oneApp.activeSectionID;

		if (!sectionID) {
			return false;
		}

		var serialized = $('[name*="ttfmake-section['+sectionID+']"]').serializeJSON();
		var serializedTtfMakeSectionContent = serialized['ttfmake-section'][sectionID];
		var serializedCleaned = serializedTtfMakeSectionContent;
		$('[name="ttfmake-section-json['+sectionID+']"]').val(JSON.stringify(serializedCleaned));

		return false;
	};

	// Initialize color pickers
	$oneApp.on('viewInit afterSectionViewAdded', function(evt, view) {
		var $selector;
		view = view || '';

		if (view.$el) {
			$selector = $('.ttfmake-configuration-color-picker', view.$el);
		} else {
			$selector = $('.ttfmake-configuration-color-picker');
		}

		$selector.wpColorPicker();
	});

	$oneApp.on('viewInit', function(evt, view) {
		var sectionID = view.model.id;

		oneApp.setActiveSectionID(sectionID);

		view.$el.on('change', 'input, select', function() {
			oneApp.setActiveSectionID(sectionID);
			oneApp.updateSectionJSON();
		});
	});

	// populate JSON with section data for widgetized columns, on page load
	$(document).ready(function() {
		if (typeof makePlusPluginInfo === 'object') {
			// loop through all Columns components
			$('.ttfmake-section-text').each(function() {
				var $this = $(this);
				var sectionID = $this.attr('data-id');

				// check if it's widgetized
				if ($this.find('.ttfmp-widget-area-overlay-region-active').length) {
					oneApp.setActiveSectionID(sectionID);
					oneApp.updateSectionJSON();
				}
			});

			$('body').on('click', '.ttfmp-revert-widget-area', function() {
				var $this = $(this);
				var sectionID = $this.closest('.ttfmake-section').attr('data-id');

				if (sectionID) {
					oneApp.setActiveSectionID(sectionID);
					oneApp.updateSectionJSON();
				}
			});
		}
	});

	$('body').on('click', '.ttfmake-remove-image-from-modal', function(evt){
		evt.preventDefault();

		var $parent = oneApp.$currentPlaceholder.parents('.ttfmake-uploader'),
			$input = $('.ttfmake-media-uploader-value', $parent);

		// Remove the image
		oneApp.$currentPlaceholder.css('background-image', '');
		$parent.removeClass('ttfmake-has-image-set');

		// Remove the value from the input
		$input.removeAttr('value');

		// Update section JSON after removing image
		oneApp.updateSectionJSON();

		wp.media.frames.frame.close();
	});

	/**
	 * Attach an event to 'Update' post/page submit to store all the ttfmake-section[] array fields to a single hidden input containing these fields serialized in JSON. Then remove the fields to prevent those from being submitted.
	 */
	$('form#post').on('submit', function(e) {
		var $target					= $(e.target);
		var $sectionInputs	= $target.find('[name^="ttfmake-section["]');
		var $wpPreviewInput = $('input[name=wp-preview]');

		// Only disable inputs when form is actually submitted so it's not triggered on Preview
		if ($wpPreviewInput.val() !== 'dopreview') {
			// Set ttfmake-section[] array fields to disabled and remove name for those to prevent them from being submitted
			$sectionInputs.attr({
				'name': '',
				'disabled': 'true'
			});
		}
	});

	wp.media.view.Sidebar = wp.media.view.Sidebar.extend({
		render: function() {
			this.$el.html( wp.media.template( 'ttfmake-remove-image' ) );
			return this;
		}
	});

	// Leaving function to avoid errors if 3rd party code uses it. Deprecated in 1.4.0.
	oneApp.initAllEditors = function(id, model) {};

	oneApp.initSortables();
	oneApp.initViews();
	oneApp.triggerInitFrames();
})(jQuery, oneApp, ttfMakeFrames);
