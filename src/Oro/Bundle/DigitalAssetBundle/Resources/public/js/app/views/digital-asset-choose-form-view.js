define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var DigitalAssetDialogWidget = require('orodigitalasset/js/widget/digital-asset-dialog-widget');
    var BaseView = require('oroui/js/app/views/base/view');

    var DigitalAssetChooseFormView;

    DigitalAssetChooseFormView = BaseView.extend({
        previewElementTemplate: require('tpl-loader!orodigitalasset/templates/digital-asset-choose-form/preview.html'),
        autoRender: true,

        options: _.extend({}, BaseView.prototype.options, {
            isImageType: false,
            isSet: false,
            widgetOptions: {},
            selectors: {
                emptyFileInput: null,
                digitalAssetInput: null,
                filename: '[data-role="digital-asset-filename"]',
                controls: '[data-role="digital-asset-controls"]',
                chooseAnother: '[data-role="digital-asset-choose-another"]',
                choose: '[data-role="digital-asset-choose"]',
                remove: '[data-role="digital-asset-remove"]'
            }
        }),

        DigitalAssetDialogWidget: null,

        events: {
            'click [data-role="digital-asset-choose"]': 'onChoose',
            'click [data-role="digital-asset-update"]': 'onChoose',
            'click [data-role="digital-asset-remove"]': 'onRemove'
        },

        /**
         * @inheritDoc
         */
        constructor: function DigitalAssetChooseFormView() {
            DigitalAssetChooseFormView.__super__.constructor.apply(this, arguments);
        },

        /**
         * @inheritDoc
         */
        initialize: function(options) {
            DigitalAssetChooseFormView.__super__.initialize.apply(this, arguments);

            this.options = $.extend(true, {}, this.options, options);

            if (!this.options.widgetOptions.url) {
                throw new TypeError('Missing required option: widgetOptions.url');
            }

            this.toggleControls(this.options.isSet);
        },

        /**
         * @param {jQuery.Event} e
         */
        onChoose: function(e) {
            e.preventDefault();

            this.dialogWidget = new DigitalAssetDialogWidget(this.options.widgetOptions);
            this.dialogWidget.once('grid-row-select', _.bind(this.onGridRowSelect, this));
            this.dialogWidget.render();
        },

        /**
         * @param {Object} data
         *  {
         *      datagrid: datagridInstance,
         *      model: selectedModel
         *  }
         */
        onGridRowSelect: function(data) {
            var previewMetadata = data.model.get('previewMetadata');
            this.findElement('filename').remove();
            this.findElement('controls').before(this.previewElementTemplate({
                previewMetadata: previewMetadata,
                isImageType: this.options.isImageType
            }));

            this.findElement('digitalAssetInput').val(data.model.get('id'));
            this.toggleControls(true);
            this.setEmptyFile(false);
            this.dialogWidget.remove();
        },

        /**
         * @param {jQuery.Event} e
         */
        onRemove: function(e) {
            e.preventDefault();

            this.toggleControls(false);
            this.setEmptyFile(true);
        },

        /**
         * @param {boolean} isEmpty
         */
        setEmptyFile: function(isEmpty) {
            if (this.options.selectors.emptyFileInput) {
                this.findElement('emptyFileInput').val(isEmpty ? 1 : 0);
            }
        },

        /**
         * @param {boolean} state
         */
        toggleControls: function(state) {
            if (state) {
                this.findElement('choose').addClass('hide');
                this.findElement('controls').removeClass('hide');
                this.removeValidationErrors();
            } else {
                this.findElement('choose').removeClass('hide');
                this.findElement('filename').remove();
                this.findElement('controls').addClass('hide');
            }
        },

        removeValidationErrors: function() {
            var $controlGroup = this.$el.closest('.control-group');

            $controlGroup.find('.validation-failed').remove();
            $controlGroup.find('.validation-error').removeClass('validation-error');
        },

        /**
         * @param {String} name
         * @returns {jQuery.Element}
         */
        findElement: function(name) {
            return this.$el.find(this.options.selectors[name]);
        }
    });

    return DigitalAssetChooseFormView;
});
