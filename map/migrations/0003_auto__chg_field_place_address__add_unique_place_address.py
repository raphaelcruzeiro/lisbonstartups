# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):

        # Changing field 'Place.address'
        db.alter_column(u'map_place', 'address_id', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['map.Address'], unique=True))
        # Adding unique constraint on 'Place', fields ['address']
        db.create_unique(u'map_place', ['address_id'])


    def backwards(self, orm):
        # Removing unique constraint on 'Place', fields ['address']
        db.delete_unique(u'map_place', ['address_id'])


        # Changing field 'Place.address'
        db.alter_column(u'map_place', 'address_id', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['map.Address']))

    models = {
        u'map.address': {
            'Meta': {'object_name': 'Address'},
            'additional_details': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'city': ('django.db.models.fields.CharField', [], {'default': "'Lisbon'", 'max_length': '20'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lat': ('django.db.models.fields.FloatField', [], {}),
            'lng': ('django.db.models.fields.FloatField', [], {}),
            'number': ('django.db.models.fields.IntegerField', [], {}),
            'street': ('django.db.models.fields.CharField', [], {'max_length': '60'})
        },
        u'map.place': {
            'Meta': {'object_name': 'Place'},
            'address': ('django.db.models.fields.related.OneToOneField', [], {'to': u"orm['map.Address']", 'unique': 'True'}),
            'date_added': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.CharField', [], {'max_length': '600'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'last_edit': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'type': ('django.db.models.fields.CharField', [], {'max_length': '2'})
        }
    }

    complete_apps = ['map']