# -*- coding: utf-8 -*-

from odoo import models, api, fields


class PosOrder(models.Model):
    _inherit = 'pos.order'

    type_document = fields.Selection(
        selection=[('b', 'Boleta'), ('f', 'Factura')],
        string='Tipo de documento',
        states={'done': [('readonly', True)], 'invoiced': [('readonly', True)]})

    @api.model
    def _order_fields(self, ui_order):
        order_fields = super(PosOrder, self)._order_fields(ui_order)
        order_fields['type_document'] = ui_order.get('type_document', False)
        return order_fields
