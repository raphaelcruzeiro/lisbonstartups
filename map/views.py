from django.views.generic import TemplateView
from rest_framework.response import Response
from rest_framework import generics, views
import serializers
import models


class Index(TemplateView):
    template_name = 'index.html'


class AddPlace(generics.CreateAPIView):
    serializer_class = serializers.PlaceSerializer

    def post(self, request):
        serializer = serializers.PlaceSerializer(request.DATA)

        print request.DATA
        print serializer.data

        address = models.Address(
            city=serializer.data['city'],
            street=serializer.data['street'],
            number=serializer.data['number'],
            lat=serializer.data['lat'],
            lng=serializer.data['lng']
        )
        address.save()

        place = models.Place(
            name=serializer.data['name'],
            description=serializer.data['description'],
            url=serializer.data['url'],
            type=serializer.data['type'],
            address=address
        )
        place.save()

        return Response({
            'status' : 'ok'
        })


class PlaceList(generics.ListAPIView):
    serializer_class = serializers.PlaceReadOnlySerializer

    def get_queryset(self):
        return models.Place.objects.filter(published=True)
