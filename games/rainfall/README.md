Add install.sh and set permissions with git update-index --chmod=+x install.sh

Previously the dependencies had been placed in the top level node\_modules/, so it ran fine in the test harness (since node searches directories upwards to find them) but not on floorcade.

Inspecting the changes made to the top level package.json, creating a games/rainfall/package.json, and cutting them into there.

The file ordering was wrong, because the callback with frames.push was running asynchronously, so although the file read operations were started in a sorted order, the push order depended on the order in which the file reads were completed. Changed to an explicit array indexing.

The timeout was too short, and the game didn't load, because (as stated above) the file reads were asynchronus, and didn't complete before the timeout.

TODO: create an array of promises, Promise.all them, then block on the promises before sending READY to stdout.

Colours on the png returned from the rainfall radar map overlay:

[ { r: 199, g: 191, b: 193, opacity: 128 }, grey, no data

  { r: 0, g: 0, b: 0, opacity: 128 }, black, no rain

  { r: 0, g: 0, b: 254, opacity: 128 }, blue 0.01 - 0.5

  { r: 50, g: 101, b: 254, opacity: 128 }, pale blue 0.5-1

  { r: 127, g: 127, b: 0, opacity: 128 }, dirty green 1-2

  { r: 254, g: 203, b: 0, opacity: 128 }, bright yellow 2-4

  { r: 254, g: 152, b: 0, opacity: 128 }, orange 4-8

  { r: 254, g: 0, b: 254, opacity: 128 }, pink 16-32

  { r: 254, g: 0, b: 0, opacity: 128 }, red 8-16

  { r: 229, g: 254, b: 254, opacity: 128 } ] white >32


1. Request 'capabilities' from the metoffice, ie. the times for which tile data sets are available (typically the past 8 hours, at 15 minute intervals.)

http://datapoint.metoffice.gov.uk/public/data/layer/wxobs/all/json/capabilities?key=926709b2-ec0f-44b4-ab74-a0ff0b7dcc57

2. Requst pngs using the time parameter from the capabilities query

datapoint.metoffice.gov.uk/public/data/layer/wxobs/RADAR_UK_Composite_Highres/png?TIME=2018-07-27T17:30:00Z&key=926709b2-ec0f-44b4-ab74-a0ff0b7dcc57

3. decode each png with pngjs
   crop image and place into array of frames with dimension this.width * this.height * 3 * nFrames
   convert integer RGB values to hex string, eg. 255 -> \xff

4. On STICK, send to stdout frame[frameIndex]
   Every second or so, increment frameIndex, pause on the most recent image, repeat

.on('STICK', function () {
	stdout(frames[frameIndex]);
});

.on('frameChange', function () {
	if (frameIndex === frames.length - 1) {
		pausedClock += 1;
		if (pausedClock === pauseLength) {
			pauseClock = 0;
			frameIndex = 0;
		}
	} else {
		frameIndex += 1;
	}
});

5. Use js-pixel-fonts to write the timestamp on the frame

Once that's done, it works with a preloaded folder of images.

So every 15 minutes:
         Check capabilities for new frame
         If so {
           download png, save with the name of the timestamp
           Add a new frame
           Delete oldest frame
         }


