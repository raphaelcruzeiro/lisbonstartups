from rest_framework import serializers
from models import Place, Address


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address


class PlaceSerializer(serializers.ModelSerializer):
    city = serializers.CharField(max_length=20)
    street = serializers.CharField(max_length=60)
    number = serializers.IntegerField()
    lat = serializers.FloatField()
    lng = serializers.FloatField()

    class Meta:
        model = Place


class PlaceReadOnlySerializer(serializers.ModelSerializer):
    address = AddressSerializer()

    class Meta:
        model = Place
