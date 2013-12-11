# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Address'
        db.create_table(u'map_address', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('city', self.gf('django.db.models.fields.CharField')(default='Lisbon', max_length=20)),
            ('street', self.gf('django.db.models.fields.CharField')(max_length=60)),
            ('number', self.gf('django.db.models.fields.IntegerField')()),
            ('additional_details', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('lat', self.gf('django.db.models.fields.FloatField')()),
            ('lng', self.gf('django.db.models.fields.FloatField')()),
        ))
        db.send_create_signal(u'map', ['Address'])

        # Deleting field 'Place.lng'
        db.delete_column(u'map_place', 'lng')

        # Deleting field 'Place.lat'
        db.delete_column(u'map_place', 'lat')

        # Adding field 'Place.address'
        db.add_column(u'map_place', 'address',
                      self.gf('django.db.models.fields.related.ForeignKey')(default=None, to=orm['map.Address']),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting model 'Address'
        db.delete_table(u'map_address')

        # Adding field 'Place.lng'
        db.add_column(u'map_place', 'lng',
                      self.gf('django.db.models.fields.FloatField')(default=0),
                      keep_default=False)

        # Adding field 'Place.lat'
        db.add_column(u'map_place', 'lat',
                      self.gf('django.db.models.fields.FloatField')(default=0),
                      keep_default=False)

        # Deleting field 'Place.address'
        db.delete_column(u'map_place', 'address_id')


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
            'address': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['map.Address']"}),
            'date_added': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.CharField', [], {'max_length': '600'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'last_edit': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'type': ('django.db.models.fields.CharField', [], {'max_length': '2'})
        }
    }

    complete_apps = ['map']