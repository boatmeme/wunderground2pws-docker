## Wunderground2PWS
[![Docker Build Statu](https://img.shields.io/docker/build/boatmeme/wunderground2pws.svg?style=flat-square)](https://hub.docker.com/r/boatmeme/wunderground2pws/) [![license](https://img.shields.io/github/license/boatmeme/wunderground2pws-docker.svg?style=flat-square)](https://github.com/boatmeme/wunderground2pws-docker/blob/master/LICENSE)

### What does it do?
Running this image will allow you to copy data from a Weather Underground station to a PWSWeather.com station on a fixed schedule.

While there are many valid use-cases, such a task is particularly useful for owners of the Rachio Smart Sprinkler Controller who do not have a station near them on the PWSWeather or CWOP networks from which Rachio currently draws weather station data.

I built the image to run from Container Station on my QNAP TVS-471, but you can run it from any Docker-enabled cloud provider.

### Before you start

* Find a station on [Weather Underground](https://www.wunderground.com/wundermap) that meets your criteria (better data, proximity to your home, etc). _**Note the Station ID, you will use it later.**_
* Register for an account on Weather Underground
* Request a [free API key](https://www.wunderground.com/weather/api/) on Weather Underground. _**Note the key, you will use it later.**_
* Register for an account on [PWSWeather](https://www.pwsweather.com/register.php). _**Note the password, you will use it later.**_
* Add a new station on [PWSWeather](https://www.pwsweather.com/stationlist.php) _**Note the Station ID, you will use it later.**_

### How to Use This Image

## Running

First, familiarize yourself with the environment variables in the documentation below. At a minimum, you must specify a Weather Underground station, Weather Underground API key, a PWSWeather station, and a PWSWeather password.

A typical command to run the container might look like this:

```docker run -d --name wunderground2pws -e WU_PWS_ID=my_wu_station -e PWS_ID=my_pws_station -e PWS_PASSWORD=my_pws_password -e WU_API_KEY=my_wu_api_key boatmeme/wunderground2pws```


## Environment Variables

```WU_API_KEY``` (**required**)

Your API Key for Weather Underground. This key will be used to query the source station for current conditions before copying it to the PWSWeather station.  

See: https://www.wunderground.com/weather/api/

```PWS_PASSWORD``` (**required**)

The password for your account on PWSWeather. This password should belong to the same account used to create and manage the weather station specified by the _PWS\_ID_ variable.

```WU_PWS_ID``` (**required**)

The ID of the Weather Underground station you would like to use as the source of your data. You do not need to be the owner of this station.

```PWS_ID``` (**required**)

The ID of the weather station on PWSWeather to which you want to copy data. This is the station that will show up in your Rachio app after you have been successfully POSTing data to it.

```FREQUENCY``` (optional)

An integer value, between _1_ and _59_, specifying the frequency (in minutes) for how often you wish to perform the synchronization update. If this variable is not set, _**it will default to 5 minutes**_, which should be good enough for Rachio's purposes.

_**Note**: Weather Underground's free plan allows 500 calls per day, so unless you are a paying customer, you probably don't want to set this any lower than 3._

```CRON_TIME``` (optional)

An optional string value specifying a schedule in Cron format. You should only use this if you need a more sophisticated schedule than can be expressed as _every-x-minutes_. Otherwise, stick to setting the _FREQUENCY_.

See: [Cron Format Cheat Sheet](http://www.nncron.ru/help/EN/working/cron-format.htm)

_**Note**: Setting this variable will override the inverval specified by the FREQUENCY variable._

## FAQs

#### Q: How can I tell if the container is uploading data to PWSWeather?

You can visit https://www.pwsweather.com/pwsupdate/pwsupdate.php?ID=MYPWSID where _MYPWSID_ is your PWSWeather station ID. This will list the latest updates received by PWSWeather via the Update API.

You can also try inspecting the logs of the  container - ```docker logs -f NAME_OF_CONTAINER``` - and see that there should be lines for every scheduled update that has run.

#### Q: The logs are showing success, but why am I still not seeing any data at PWSWeather?

There is often a delay of several minutes after a successful update before the data will appear on PWSWeather. Wait 5 or 10 minutes and see if the situation changes.

Otherwise...

It is entirely possible that you have found a bug. Please [open an issue](https://github.com/boatmeme/wunderground2pws-docker/issues) and include the Weather Underground source station ID and any information you find in the logs for the container.

#### Q: Why don't the timestamps in my PWSWeather data jibe with the update times from my container's logs?

The timestamp values in the PWSWeather station data are derived from the timestamps in the source data of the Weather Underground station. Sometimes, the data from the Weather Underground station might be a few minutes old, or longer if the source station has lost its connection to Weather Underground.

#### Q: Why does the PWSWeather data sometimes have gaps, where it appears that some updates were missed?

There are several possibilities:

1) The container's internet connection was spotty during the time period in question.
2) Sometimes, during consecutive updates, Weather Underground stations may report data with an earlier timestamp than the previously executed update. In this case, the Wunderground2PWS process decides to skip the update, rather than muddle the data stream with old numbers.
3) There was a sporadic, unknown problem with the Weather Underground or PWSWeather APIs.
4) It _could_ be a bug. If the problem persists, please [open an issue](https://github.com/boatmeme/wunderground2pws-docker/issues) and include the Weather Underground source station ID, the problematic time intervals (in UTC), and any information you find in the logs for the container.

## Contact / Contributing

Please direct all issues to the [Github Issues](https://github.com/boatmeme/wunderground2pws-docker/issues) for the project. Pull-requests for features and bugs are welcome.

For other correspondence, you can find my email address on my [Github profile](https://github.com/boatmeme).

## Support on Beerpay
Contributions to the :beers: fund are much appreciated!

[![Beerpay](https://beerpay.io/boatmeme/wunderground2pws-docker/badge.svg?style=beer-square)](https://beerpay.io/boatmeme/wunderground2pws-docker)  [![Beerpay](https://beerpay.io/boatmeme/wunderground2pws-docker/make-wish.svg?style=flat-square)](https://beerpay.io/boatmeme/wunderground2pws-docker?focus=wish)

## License


    The MIT License (MIT)

    Copyright (c) 2017 Jonathan Griggs

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
