from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$',views.index,name='index'),
    url(r'^update$',views.update,name='update'),
    url(r'^show$',views.show,name='show'),
    url(r'^destroy$',views.destroy,name='destroy'),
    url(r'^user_timeline$',views.user_timeline,name='user_timeline')
]
