from django.conf.urls import patterns, include, url

from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'twitterTest.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^$','tweet.views.index',name='home'),
    url(r'^tweet/', include('tweet.urls'))
    # url(r'^admin/', include(admin.site.urls)),
)
