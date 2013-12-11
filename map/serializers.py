from rest_framework import serializers
from models import Place


class PlaceSerializer(serializers.ModelSerializer):
    city = serializers.CharField(max_length=20)
    street = serializers.CharField(max_length=60)
    number = serializers.IntegerField()
    lat = serializers.FloatField()
    lng = serializers.FloatField()

    class Meta:
        model = Place
