function plotspectrum(plocs,pamps,xmin,xmax,xlab,ylab,gtitle,fwhh,revplot,invplot) {

    // Key to input variables:
	// plocs = array containing peak locations (e.g. vibrational plocsuencies)
	// pamps = array containing peak amplitudes/heights
	// xmin = x-value where plot starts
	// xmax = x-value where plot ends
	// xlab = label of x-axis (string variable)
	// ylab = label of y-axis (string variable)
	// gtitle = graph title (string variable)
	// revplot = 'reversed' to reverse x-axis or 'false' to leave x-axis alone
	// invplot = 1 or -1 (1 to keep peaks with positive values, -1 to 
	//           give peaks negative values, as for an IR spectrum, to match expt.
	
    var w = xmin;
    var j;
    var amp = [];    // amplitudes on y-axis of spectrum
    var lambda = [];  // frequencies on x-axis of spectrum

    // Lorentzian form for peaks

    while (w <= xmax) {
        var ph = 0;
        for (j = 0; j < plocs.length; j++) {
            ph = invplot*pamps[j]*(1/3.141592654)*(0.5*fwhh)/((w-plocs[j])**2 + (0.5*fwhh)**2) + ph;
        }
        lambda.push(w);
        amp.push(ph);
        w++;
    }

    // Set up the plotly graphing information and create the graph

    var trace = {
        x: lambda,
        y: amp
    };
	 
    var data = [trace];

    var layout = {
        title: gtitle,
        xaxis: {
            title: xlab,
            autorange: revplot
        },
        yaxis: {
            title: ylab
        }
    };


    GRAPH = document.getElementById('graph');
    Plotly.newPlot( GRAPH, data, layout);
		
    // Create csv for download
		
    var csvtext = []
    var csvtitle = " ," + gtitle + "\n";
    var csvcols = xlab + "," + ylab + "\n";
		
    csvtext.push(csvtitle);
    csvtext.push(csvcols);
		
    for (let i = 0; i < lambda.length; i++) {
        csvtext.push(lambda[i] + "," + amp[i] + "\n");
    }
		
		
    // Create a "Blob" that can then be downloaded
    //   (code from http://jsfiddle.net/UselessCode/qm5AG/)
    (function () {
        var textFile = null,
        makeTextFile = function (text) {
            var data = new Blob([text], {type: 'text/plain'});

            // If we are replacing a previously generated file we need to
            // manually revoke the object URL to avoid memory leaks.
            if (textFile !== null) {
                window.URL.revokeObjectURL(textFile);
            }

            textFile = window.URL.createObjectURL(data);

            return textFile;
        };

        document.getElementById("getcsv").style.display = 'block'
  
        var create = document.getElementById('create');

        create.addEventListener('click', function () {
            var link = document.getElementById('downloadlink');
            link.href = makeTextFile(csvtext);
            link.style.display = 'block';
        }, false);
    })();

}

