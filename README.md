National Transportation Noise Map
=========================

In 2014, about 97 percent of the U.S. population was potentially exposed to aviation noise between 35 and 50dBA, roughly the equivalent of a refrigerator humming constantly over the course of a day. About 98 percent of the population was likewise exposed to highway noise of the same magnitude. In order to mitigate excessive noise and ensure reasonable levels for the general public, it is crucial for policymakers to be able to visualize the prevalence and intensity of transportation noise data.

For this purpose, a [mapping application](https://cchinchristopherj.github.io/Noise-Map/) was developed to display aviation and highway noise in the U.S. for 2016 and 2018. Aviation noise was modeled using the average number of daily flight operations in airports across the country, while highway noise was modeled using average daily noise levels for automobiles, medium trucks, and heavy trucks. The National Transportation Noise Map was an initiative of the Bureau of Transportation Statistics at the U.S. Department of Transportation. 

[Mapping Application](https://cchinchristopherj.github.io/Noise-Map/)
-------------------------

The screenshot below is the default view of the National Transportation Noise Map, which shows aviation and highway data in the U.S. for 2018. The legend in the bottom left relates the colors shown with levels of noise. Specifically, the noise metric is 24-hour LAeq, which is the “average” noise level over 24 hours for a particular location. 

![noise_main](https://github.com/cchinchristopherj/Noise-Map/blob/master/Screenshots/noise_main.png)

The dashboard has a control panel at the top with four main components: 
1. A **geocoder** allowing the user to zoom to a location they enter into the text input box
2. A **basemap selector** allowing the user to switch between two basemap backgrounds for the map (dark or satellite) 
3. A **year slider** allowing the user to toggle between data for 2016 and 2018
4. A **button group** allowing the user to toggle between data for different transportation modes

As an example, let’s track trends in New York City transportation noise. Type “New York City” in the geocoder, which recommends locations related to the the entered text. 

![noise_geocoder](https://github.com/cchinchristopherj/Noise-Map/blob/master/Screenshots/noise_geocoder.png)

After selecting “New York City” from the geocoder’s list of recommended options, the map zooms to a view of New York City. 

![noise_geocoder_zoom](https://github.com/cchinchristopherj/Noise-Map/blob/master/Screenshots/noise_geocoder_zoom.png)

Toggle the highway mode button to switch to a view of only highway noise in New York City. 

![noise_road_2018](https://github.com/cchinchristopherj/Noise-Map/blob/master/Screenshots/noise_road_2018.png)

Toggle the aviation mode button to switch to a view of only aviation noise in New York City.

![noise_av_2018](https://github.com/cchinchristopherj/Noise-Map/blob/master/Screenshots/noise_av_2018.png)

Switch the year slider from 2018 to 2016 to display 2016 aviation data instead of 2018 aviation data. Note the differences in spatial distribution and prevalence of aviation noise between the two years. 

![noise_av_2016](https://github.com/cchinchristopherj/Noise-Map/blob/master/Screenshots/noise_av_2016.png)

Select the “Satellite” button to change the basemap background to a satellite view instead of the default dark view. 

![noise_satellite](https://github.com/cchinchristopherj/Noise-Map/blob/master/Screenshots/noise_satellite.png)

Data
=========================

The Volpe National Transportation Systems Center provided data in the form of raster images of aviation and highway noise, with the value of each pixel representing the level of noise. These raster images were converted into raster tiles to enable faster rendering in the mapping application. (Raster tiles break the overall image into smaller areas or “tiles”, allowing for improved performance by only displaying tiles relevant to the geographic position and level of zoom required by the user moment to moment). 
