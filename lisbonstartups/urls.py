from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

import map.views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'lisbonstartups.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/add_place/?$', map.views.AddPlace.as_view()),
    url(r'^$', map.views.Index.as_view()),
)
