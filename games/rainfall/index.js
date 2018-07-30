var fs = require('fs'),
    PNG = require('pngjs').PNG;

fs.createReadStream('img.png')
    .pipe(new PNG({
        filterType: 4
    }))
    .on('parsed', function() {
	    const offsetWidth = 200;
	    const offsetHeight = 200;
	    const cropWidth = 200;
	    const cropHeight = 150;
        for (var y = offsetHeight; y < Math.min(this.height,offsetHeight+ cropHeight); y++) {
            for (var x = offsetWidth; x < Math.min(this.width, offsetWidth+cropWidth); x++) {
                var idx = (this.width * y + x) << 2;
 
                this.data[idx+3] = 255;
            }
	}
        this.pack().pipe(fs.createWriteStream('text.png'));
    }); 
