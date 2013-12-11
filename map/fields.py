import re
import six

from django.core.exceptions import ImproperlyConfigured
from django.db.models import DateTimeField, CharField, SlugField, TextField
from django.conf import settings
from django.db import models

try:
    from django.utils.encoding import force_unicode  # NOQA
except ImportError:
    from django.utils.encoding import force_text as force_unicode  # NOQA


import re
import unicodedata

from django.utils.encoding import smart_unicode

def slugify(s):
    """
    Replacement for Django's slugify which allows unicode chars in
    slugs, for URLs in Chinese, Russian, etc.
    Adapted from https://github.com/mozilla/unicode-slugify/
    """
    chars = []
    for char in unicode(smart_unicode(s)):
        cat = unicodedata.category(char)[0]
        if cat in "LN" or char in "-_~":
            chars.append(char)
        elif cat == "Z":
            chars.append(" ")
    return re.sub("[-\s]+", "-", "".join(chars).strip()).lower()


class AutoSlugField(SlugField):
    """
    A field that automatically generates a unique slug for the object.
    """

    def __init__(self, *args, **kwargs):
        kwargs.setdefault('blank', True)
        kwargs.setdefault('editable', False)

        populate_from = kwargs.pop('populate_from', None)

        # if populate_from is None:
        #     raise ValueError("Missing 'populate_from' argument.")
        # else:
        #     self._populate_from = populate_from

        self._populate_from = populate_from
        self.separator = kwargs.pop('separator', six.u('-'))
        self.overwrite = kwargs.pop('overwrite', False)
        self.allow_duplicates = kwargs.pop('allow_duplicates', False)
        self.pre_filter = kwargs.pop('pre_filter', None)

        super(AutoSlugField, self).__init__(*args, **kwargs)

    def slugify_content(self, content):
        return slugify(content) if content else ''

    def get_queryset(self, models_class, slug_field):
        for field, model in models_class._meta.get_fields_with_model():
            if model and field == slug_field:
                return model._default_manager.all()
        return models_class._default_manager.all()

    def _slug_strip(self, value):
        re_sep = '(?:-|%s)' % re.escape(self.separator)
        value = re.sub('%s+' % re_sep, self.separator, value)
        return re.sub(r'^%s+|%s+$' % (re_sep, re_sep), '', value)

    def create_slug(self, model_instance, add):
        if not self._populate_from:
            return ''

        if not isinstance(self._populate_from, (list, tuple)):
            self._populate_from = (self._populate_from, )
        slug_field = model_instance._meta.get_field(self.attname)

        if add or self.overwrite:
            slug_for_field = lambda field: self.slugify_content(
                getattr(model_instance, field)
            )
            slug = self.separator.join(
                [slug_for_field(field) for field in self._populate_from]
            )
            next = 2
        else:
            slug = getattr(model_instance, self.attname)
            return slug

        slug_len = slug_field.max_length

        if slug_len:
            slug = slug[:slug_len]
        slug = self._slug_strip(slug)
        original_slug = slug

        if self.allow_duplicates:
            return slug

        queryset = self.get_queryset(model_instance.__class__, slug_field)

        if model_instance.pk:
            queryset = queryset.exclude(pk=model_instance.pk)

        if self.pre_filter:
            for k, v in self.pre_filter.iteritems():
                if v and v.startswith('self.'):
                    path = v.replace('self.', '')
                    path = path.split('.')
                    obj = model_instance
                    def navigate_to_last_elem(path, obj):
                        if not path:
                            if isinstance(obj, models.Model):
                                return obj.pk
                            return obj
                        obj = getattr(obj, path[0])
                        path = path[1:]
                        navigate_to_last_elem(path, obj)
                    obj = navigate_to_last_elem(path, obj)
                    self.pre_filter[k] = obj
            queryset = queryset.filter(**self.pre_filter)

        kwargs = {}
        for params in model_instance._meta.unique_together:
            if self.attname in params:
                for param in params:
                    kwargs['param'] = getattr(model_instance, param, None)
        kwargs[self.attname] = slug

        while not slug or queryset.filter(**kwargs):
            slug = original_slug
            end = '%s%s' % (self.separator, next)
            end_len = len(end)
            if slug_len and len(slug) + end_len > slug_len:
                slug = slug[:slug_len - end_len]
                slug = self._slug_strip(slug)
            slug = '%s%s' % (slug, end)
            kwargs[self.attname] = slug
            next += 1

        return slug

    def pre_save(self, model_instance, add):
        value = force_unicode(self.create_slug(model_instance, add))
        setattr(model_instance, self.attname, value)
        return value

def get_internal_type(self):
    return 'SlugField'

def south_field_triple(self):
    "Returns a suitable description of this field for South."
    # We'll just introspect the _actual_ field.
    from south.modelsinspector import introspector
    field_class = '%s.AutoSlugField' % self.__module__
    args, kwargs = introspector(self)
    kwargs.update({
        'populate_from': repr(self._populate_from),
        'separator': repr(self.separator),
        'overwrite': repr(self.overwrite),
        'allow_duplicates': repr(self.allow_duplicates),
    })
    # That's our definition!
    return (field_class, args, kwargs)


from south.modelsinspector import add_introspection_rules
add_introspection_rules([], ["^map\.fields\.AutoSlugField"])



