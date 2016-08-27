import json
from django.shortcuts import render
from django.http import HttpResponse
from twython import Twython

def index(request):
    # Main Index
    return render(request,'tweet/index.html')

def update(request):
    twitter = getApi(request)

    # Request message
    message = request.POST['message']

    # Send Status
    twitter.update_status(status=message)

    # Output
    response = HttpResponse(json.dumps({'ok': 'true'}))

    # remove Cross-Origin
    set_access_control_headers(response)

    return response

def show(request):
    twitter = getApi(request)

    status_id = request.POST['id']

    results = twitter.request("https://api.twitter.com/1.1/statuses/show.json", "GET",{'id' : status_id})

    response = HttpResponse(json.dumps(results))

    # remove Cross-Origin
    set_access_control_headers(response)

    return response

def destroy(request):
    twitter = getApi(request)

    status_id = request.POST['id']

    results = twitter.request("https://api.twitter.com/1.1/statuses/destroy/" + status_id + ".json", "POST")

    response = HttpResponse(json.dumps(results))

    # remove Cross-Origin
    set_access_control_headers(response)

    return response

def user_timeline(request):
    twitter = getApi(request)

    screen_name = request.POST['screen_name']

    count = request.POST['count']

    timeline = twitter.request("https://api.twitter.com/1.1/statuses/user_timeline.json", "GET", {'screen_name': screen_name,'count': count })

    response = HttpResponse(json.dumps(timeline))

    set_access_control_headers(response)

    return response

def set_access_control_headers(response):
    response['Access-Control-Allow-Origin'] = '*'
    response['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
    response['Access-Control-Max-Age'] = 1000
    response['Access-Control-Allow-Headers'] = '*'
    response['Content-Type']    =   "application/json"

def getApi(request):
    APP_KEY = request.POST['consumer_key']
    APP_SECRET = request.POST['consumer_secret']
    OAUTH_TOKEN = request.POST['access_token']
    OAUTH_TOKEN_SECRET = request.POST['access_token_secret']
    twitter = Twython(APP_KEY, APP_SECRET,
                      OAUTH_TOKEN, OAUTH_TOKEN_SECRET)
    return twitter
