odoo.define('pos_invoice_ticket', function (require) {
"use strict";
var core = require('web.core');
var screens = require('point_of_sale.screens');
var gui = require('point_of_sale.gui');
var models = require('point_of_sale.models');

var _super_order = models.Order.prototype;
models.Order = models.Order.extend({
    initialize: function() {
        _super_order.initialize.apply(this,arguments);
        this.type_document = this.type_document || 'b';
        this.save_to_db();
    },
    export_as_JSON: function() {
        var json = _super_order.export_as_JSON.apply(this,arguments);
        json.type_document = this.type_document;
        return json;
    },
    init_from_JSON: function(json) {
        _super_order.init_from_JSON.apply(this,arguments);
        this.type_document = json.type_document || 'b';
    },
    export_for_printing: function() {
        var vat;
        var street;
        var json = _super_order.export_for_printing.call(this,arguments);
        var client  = this.get('client');
        if (client) {
            vat = client.vat;
            street = client.street;
        } else {
            vat = null;
            street = null;
        }
        json.type_document = this.get_type_document();
        json.vat = vat;
        json.street = street;
        json.num_letra = NumeroALetras(json.total_with_tax, {
          plural: 'dólares estadounidenses',
          singular: 'dólar estadounidense',
          centPlural: 'centavos',
          centSingular: 'centavo'
        });
        return json;
    },
    get_type_document: function(){
        return this.type_document;
    },
    set_type_document: function(td) {
        this.type_document = td;
        this.trigger('change');
    },

});


screens.PaymentScreenWidget.include({
    renderElement: function() {
        var self = this;
        this._super();
        var order = this.pos.get_order();
        // Cuando renderiza pinta la boleta
        if (order) {
            // console.log(order);
            if (order.type_document === 'b') {
                this.$('.js_boleta').addClass('highlight');
            } else {
                this.$('.js_boleta').removeClass('highlight');
            }
            // Cuando renderiza pinta la factura
            if (order.type_document === 'f') {
                this.$('.js_factura').addClass('highlight');
            } else {
                this.$('.js_factura').removeClass('highlight');
            }
        }
        this.$('.js_boleta').click(function(){
            order.set_type_document('b');
            self.$('.js_boleta').addClass('highlight');
            self.$('.js_factura').removeClass('highlight');
        });
        this.$('.js_factura').click(function(){
            order.set_type_document('f');
            self.$('.js_factura').addClass('highlight');
            self.$('.js_boleta').removeClass('highlight');
        });
    },
});

});
