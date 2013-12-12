# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):

        # Changing field 'Place.description'
        db.alter_column(u'map_place', 'description', self.gf('django.db.models.fields.CharField')(max_length=2000))

    def backwards(self, orm):

        # Changing field 'Place.description'
        db.alter_column(u'map_place', 'description', self.gf('django.db.models.fields.CharField')(max_length=600))

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
            'description': ('django.db.models.fields.CharField', [], {'max_length': '2000'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'last_edit': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'published': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'type': ('django.db.models.fields.CharField', [], {'max_length': '2'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200'})
        },
        u'map.user': {
            'Meta': {'object_name': 'User'},
            'email': ('django.db.models.fields.EmailField', [], {'unique': 'True', 'max_length': '75'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'joined': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'username': ('map.fields.AutoSlugField', [], {'max_length': '80', 'blank': 'True'})
        }
    }

    complete_apps = ['map']