var fs = require('fs'),
    PNG = require('pngjs').PNG;

fs.createReadStream('img.png')
    .pipe(new PNG({
        filterType: 4
    }))
    .on('parsed', function() {
    	    const offsetWidth = 200;
    	    const offsetHeight = 200;

            for (var y = offsetHeight; y < Math.min(this.height, offsetHeight+ 200); y++) {
                for (var x = offsetWidth; x < Math.min(this.width, offsetWidth+ 200); x++) {
                    var idx = (this.width * y + x) << 2;
                    frame[idx] = '\x'+this.data[idx].toString(16);     
                    frame[idx+1] = '\x'+this.data[idx+1].toString(16);     
                    frame[idx+2] = '\x'+this.data[idx+2].toString(16);     
                }
    	    }
        this.pack().pipe(fs.createWriteStream('text.png'));
    }); 
