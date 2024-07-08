class RamanObj {
  constructor(excwl,tem,vibfreq,ramint) {
    this.excwl = excwl;
    this.tem = tem;
    this.vibfreq = vibfreq;
    this.ramint = ramint;
  }
}


function raman_info_gamess(outfile) {
    var rows = outfile.split("\n");
    var i = 0;
    var n = -10;
    var foundline = false;
    var startline = 0;
    var endline = 0;
    var freq = [];
    var intensity = [];
    var temperature = 0;
    var ramanint = 0;
    var laserwl = document.forms["my_laserwl"]["laserwl"].value;
    if ((laserwl == null)||(laserwl == undefined)||(laserwl <= 0)) {laserwl = 1064;}
    var laserwn = 1E7/laserwl; // laser excitation frequency in cm-1
	
    // Get the temperature from the output file (needed for Raman 
    //  activity to intensity conversion)
		
    var foundtemp = false;
    i = rows.length-1;
    while (i>0 && foundtemp == false) {
        n = rows[i].search("THERMOCHEMISTRY AT");
        if (n>=0) {
            var ttrow = rows[i].trim();
            var tfields = ttrow.split(/\s+/);
            temperature = Number(tfields[3]);
            foundtemp = true;
        } else {
            i--;
        }
    }

    // Throw error if Thermochemistry (Temperature) section not found
	
    if (foundtemp == false) {
        document.querySelector("#contents").innerHTML = "<b>Thermochemistry " +
        "information was not found in this output file.</b><br><br>" +
        "Please check to make sure that the Hessian calculation" +
        "completed without errors or warnings.";
        document.querySelector("#contents").style.display = 'block';
        document.querySelector("#file-input-label").style.display = 'block';
    }
		
    // collect the frequencies and intensities of
    // find the beginning of the Raman frequency information
    //   in the GAMESS output file

    i = 0;
    n = -10;

    while (i<rows.length && foundline == false) {
        n = rows[i].search("RAMAN ACTIVITY");
        if (n>=0) {
            foundline = true;
            startline = i;
        } else {
             i++;
        }
    }

    // Throw error if Raman Spectrum summary section not found
	
    if (foundline == false) {
        document.querySelector("#contents").innerHTML = "<b>The information " +
        "needed to produce a Raman spectrum was not found in this " +
        "file</b><br><br>" +
        "Please check to make sure that" +
        "<ul><li>the GAMESS calculation terminated normally</li>" +
        "<li>this is a Raman calculation " +
        "(the $CONTRL group in the input file should " +
        "contain \"RUNTYP=RAMAN\")</li>";
        document.querySelector("#contents").style.display = 'block';
        document.querySelector("#file-input-label").style.display = 'block';
    }
		
		
    // collect the frequencies and intensities of
    //   the peaks of the Raman spectrum
    //   Note: the Raman activities (directly from GAMESS output) are
    //   converted to Raman intensities using the formula given in 
    //   Xavier, R. J.; Dinesh, P. Spectrochimica Acta Part A: Molecular
    //    and Biomolecular Spectroscopy 2014, 118, 999-1011.

    i = startline;
    n = -10;

    while (i<rows.length) {
        n = rows[i].search("RAMAN ACTIVITY");
        if (n>=0) {
            var trow = rows[i].trim();
            var irtrow = rows[i-4].trim();
            var modetrow = rows[i-5].trim();
            var fields = trow.split(/\s+/);
            var irfreqs = irtrow.split(/\s+/);
            var modenums = modetrow.split(/\s+/);
            for (let j = 2; j < fields.length; j++) {
                var frequency = Number(irfreqs[j-1]);
                var activity = Number(fields[j]);
		var nmod = Number(modenums[j-2]);
		if ((frequency > 0) && (nmod > 6)) {   // Ignore non-zero frequencies and trans/rot modes 1-6
                    var boltz = Math.exp(-6.626E-34*3.0E10*frequency/(1.381E-23*temperature))
                    freq.push(frequency);
                    ramanint = ((laserwn - frequency)**4)*Number(activity)/(frequency*(1-boltz))
                    ramanint = ramanint/1E11
                    intensity.push(ramanint);
		    console.log(i,j,nmod,temperature,frequency,activity,boltz,ramanint);   // DEBUG
	        }
            }
        } 
        i++;
    }

    raminfo = new RamanObj(laserwl,temperature,freq,intensity);
 
    return raminfo

}

function raman_info_orca(outfile) {
    var rows = outfile.split("\n");
    var i = 0;
    var n = -10;
    var foundline = false;
    var startline = 0;
    var endline = 0;
    var freq = [];
    var intensity = [];
    var temperature = 0;
    var ramanint = 0;
    var laserwl = document.forms["my_laserwl"]["laserwl"].value;
    if ((laserwl == null)||(laserwl == undefined)||(laserwl <= 0)) {laserwl = 488;}
    var laserwn = 1E7/laserwl; // laser excitation frequency in cm-1
	
    // Get the temperature from the output file (needed for Raman 
    //  activity to intensity conversion)
		
    var foundtemp = false;
    i = rows.length-1;
    while (i>0 && foundtemp == false) {
        n = rows[i].search("THERMOCHEMISTRY AT");
        if (n>=0) {
            var ttrow = rows[i+3].trim();
            var tfields = ttrow.split(/\s+/);
            temperature = Number(tfields[2]);
            foundtemp = true;
        } else {
            i--;
        }
    }

    // Throw error if Thermochemistry (Temperature) section not found
	
    if (foundtemp == false) {
        document.querySelector("#contents").innerHTML = "<b>Thermochemistry " +
        "information was not found in this output file.</b><br><br>" +
        "Please check to make sure that the frequency calculation" +
        "completed without errors or warnings.";
        document.querySelector("#contents").style.display = 'block';
        document.querySelector("#file-input-label").style.display = 'block';
    }
		
    // collect the frequencies and intensities of
    // find the beginning of the Raman frequency information
    //   in the ORCA output file

    i = 0;
    n = -10;

    while (i<rows.length && foundline == false) {
        n = rows[i].search("RAMAN SPECTRUM");
        if (n>=0) {
            foundline = true;
            startline = i+5;
        } else {
             i++;
        }
    }

    // Throw error if Raman Spectrum summary section not found
	
    if (foundline == false) {
        document.querySelector("#contents").innerHTML = "<b>The information " +
        "needed to produce a Raman spectrum was not found in this " +
        "file</b><br><br>" +
        "Please check to make sure that" +
        "<ul><li>the ORCA calculation terminated normally</li>" +
        "<li>this is a Raman calculation </li>" +
           "<ul><li>a keyword line in the input file contains \"freq\"</li>" +
		   "<li>a polarizability calculation has been requested in the input" +
		   " (for example, the input contains \"\%elprop Polar 1 end\") </li></ul>";
        document.querySelector("#contents").style.display = 'block';
        document.querySelector("#file-input-label").style.display = 'block';
    }
		
		
    // collect the frequencies and intensities of
    //   the peaks of the Raman spectrum
    //   Note: the Raman activities (directly from ORCA output) are
    //   converted to Raman intensities using the formula given in 
    //   Xavier, R. J.; Dinesh, P. Spectrochimica Acta Part A: Molecular
    //    and Biomolecular Spectroscopy 2014, 118, 999-1011.

    i = startline;
    foundend = false;
    n = -10;

    while (i<rows.length && foundend == false) {
        n = rows[i].search("[0-9]");
        if (n>=0) {
            var trow = rows[i].trim();
            var fields = trow.split(/\s+/);
            var frequency = Number(fields[1]);
            var activity = Number(fields[2]);
            var boltz = Math.exp(-6.626E-34*3.0E10*frequency/(1.381E-23*temperature))
            freq.push(frequency);
            ramanint = ((laserwn - frequency)**4)*Number(activity)/(frequency*(1-boltz))
            ramanint = ramanint/1E11
            intensity.push(ramanint);
		    console.log(i,temperature,frequency,activity,boltz,ramanint);  // DEBUG!
			i++;
        }
		else {
			foundend = true;
		}
    }

    raminfo = new RamanObj(laserwl,temperature,freq,intensity);
 
    return raminfo

}


function raman_info_nwchem(outfile) {
    var rows = outfile.split("\n");
    var i = 0;
    var n = -10;
    var foundline = false;
    var startline = 0;
    var endline = 0;
    var freq = [];
    var intensity = [];
    var temperature = 0;
    var ramanint = 0;
    var laserwl = document.forms["my_laserwl"]["laserwl"].value;
    if ((laserwl == null)||(laserwl == undefined)||(laserwl <= 0)) {laserwl = 488;}
    var laserwn = 1E7/laserwl; // laser excitation frequency in cm-1
	
    // Get the temperature from the output file (needed for Raman 
    //  activity to intensity conversion)
		
    var foundtemp = false;
    i = rows.length-1;
    while (i>0 && foundtemp == false) {
        n = rows[i].search("Temperature");
        if (n>=0) {
            var ttrow = rows[i].trim();
            var tfields = ttrow.split(/\s+/);
            temperature = Number(tfields[2].substring(0, tfields[2].length - 1));
            foundtemp = true;
        } else {
            i--;
        }
    }

    // Throw error if Thermochemistry (Temperature) section not found
	
    if (foundtemp == false) {
        document.querySelector("#contents").innerHTML = "<b>Temperature " +
        "information was not found in this output file.</b><br><br>" +
        "Please check to make sure that the frequency calculation" +
        "completed without errors or warnings.";
        document.querySelector("#contents").style.display = 'block';
        document.querySelector("#file-input-label").style.display = 'block';
    }
		
    // collect the frequencies and intensities of
    // find the beginning of the Raman frequency information
    //   in the NWChem output file

    i = 0;
	n = -10;

    while (i<rows.length && foundline == false) {
        n = rows[i].search("Showing rminfo");
        if (n>=0) {
            foundline = true;
            startline = i+2;
        } else {
             i++;
        }
    }

    // Throw error if Raman Spectrum summary section not found
	
    if (foundline == false) {
        document.querySelector("#contents").innerHTML = "<b>The information " +
        "needed to produce a Raman spectrum was not found in this " +
        "file</b><br><br>" +
        "Please check to make sure that" +
        "<ul><li>the NWChem calculation terminated normally</li>" +
        "<li>this is a Raman calculation </li>" +
           "<ul><li>a task line in the input file contains \"raman\"</li>" +
		   "<li>a polarizability calculation has been requested in the input" +
		   " (for example, the input contains a \"property\" section.) </li></ul>";
        document.querySelector("#contents").style.display = 'block';
        document.querySelector("#file-input-label").style.display = 'block';
    }
		
		
    // collect the frequencies and intensities of
    //   the peaks of the Raman spectrum
    //   Note: the Raman activities (directly from NWChem output) are
    //   converted to Raman intensities using the formula given in 
    //   Xavier, R. J.; Dinesh, P. Spectrochimica Acta Part A: Molecular
    //    and Biomolecular Spectroscopy 2014, 118, 999-1011.

    i = startline;
    n = -10;
    foundend = false;

    while (i<rows.length && foundend == false) {
        n = rows[i].search(/^rminfo/);
        if (n>=0) {
            var trow = rows[i].trim();
            var fields = trow.split(/\s+/);
            var frequency = Number(fields[2].substring(0, fields[2].length - 1));
            var activity = Number(fields[5].substring(0, fields[5].length - 1));
            var boltz = Math.exp(-6.626E-34*3.0E10*frequency/(1.381E-23*temperature))
            freq.push(frequency);
            ramanint = ((laserwn - frequency)**4)*Number(activity)/(frequency*(1-boltz))
            ramanint = ramanint/1E11
            intensity.push(ramanint);
            console.log(i,temperature,frequency,activity,boltz,ramanint);  // DEBUG!
            i++;
        }
        else {
            foundend = true;
        }
    }

    raminfo = new RamanObj(laserwl,temperature,freq,intensity);
 
    return raminfo

}


