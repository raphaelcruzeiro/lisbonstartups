from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import BaseUserManager
import fields


class UserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password=None):
        user = self.model(
            email=email,
            first_name=first_name,
            last_name=last_name
        )
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, first_name, last_name, password=None):
        user = self.create_user(email, first_name, last_name, password)
        user.is_staff = True
        user.save(using=self._db)

        return user


class User(AbstractBaseUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50, null=True)
    last_name = models.CharField(max_length=50, null=True)
    joined = models.DateTimeField(auto_now=True)

    username = fields.AutoSlugField(
        max_length=80,
        populate_from=['first_name', 'last_name'],
        separator='.'
    )

    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = UserManager()

    def has_module_perms(self, *args, **kwargs):
        return self.is_staff

    def has_perm(self, *args, **kwargs):
        return self.is_staff

    def get_full_name(self):
        return u'%s %s' % (self.first_name, self.last_name)

    def get_short_name(self):
        return self.first_name

    def __unicode__(self):
        return self.get_full_name()


class Address(models.Model):
    city = models.CharField(default='Lisbon', editable=False, max_length=20)
    street = models.CharField(max_length=60)
    number = models.IntegerField()
    additional_details = models.CharField(max_length=100)
    lat = models.FloatField()
    lng = models.FloatField()

    def __unicode__(self):
        return u'%s %d' % (self.street, self.number)


class Place(models.Model):
    TYPES = (
        ('st', 'Startup'),
        ('ac', 'Accelerator'),
        ('cw', 'Coworking'),
    )
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=600)
    type = models.CharField(max_length=2, choices=TYPES)
    date_added = models.DateTimeField(auto_now_add=True, editable=False)
    last_edit = models.DateTimeField(auto_now=True, editable=False)
    address = models.OneToOneField(Address)
    url = models.URLField()

    def __unicode__(self):
        return self.title

