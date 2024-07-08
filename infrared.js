class IRObj {
    constructor(vibfreq,irint) {
        this.vibfreq = vibfreq;
        this.irint = irint;
    }
}


function ir_info_gamess(outfile) {
    var rows = outfile.split("\n");
    var i = 0;
    var n = 0;
    var foundline = false;
    var startline = 0;
    var endline = 0;
    var freq = [];
    var intensity = [];
	
    // find the beginning of the IR Frequency information
    //   in the GAMESS output file

    while (i<rows.length && foundline == false) {
        n = rows[i].search("MODE FREQ");
        if (n>0){
            foundline = true;
            startline = i + 1;
        } else {
            i++;
        }
    }   

    // Throw error if IR Spectrum summary section not found
	
    if (foundline == false) {
        document.querySelector("#contents").innerHTML = "<b>The information " +
        "needed to produce an IR spectrum was not found in this " +
        "file</b><br><br>" +
        "Please check to make sure that" +
        "<ul><li>the GAMESS calculation terminated normally</li>" +
        "<li>this is geometry optimization calculation " +
        "(the $CONTRL group in the input file should " +
        "contain \"RUNTYP=OPTIMIZE\")</li>" +
        "<li>a Hessian calculation was performed on the " +
        "final geometry (the $STATPT group in the input file " +
        "should contain \"HSSEND=.T.\")</li></ul>";
        document.querySelector("#contents").style.display = 'block';
        document.querySelector("#file-input-label").style.display = 'block';
    }

    // collect the frequencies and intensities of
    //   the peaks of the IR spctrum

    i = startline;
    foundend = false;

    while (i<rows.length && foundend == false) {
        n = rows[i].search("[0-9]");
        if (n>0) {
            var trow = rows[i].trim();
            var fields = trow.split(/\s+/);
            freq.push(Number(fields[1]));
            intensity.push(Number(fields[4]));
            i++;
        } else {
            foundend = true;
            endline = i-1;
        }
    }

    irinfo = new IRObj(freq,intensity);
    return irinfo

}


function ir_info_orca(outfile) {
    var rows = outfile.split("\n");
    var i = 0;
    var n = -10;
    var foundline = false;
    var startline = 0;
    var endline = 0;
    var freq = [];
    var intensity = [];
	
    // find the beginning of the IR Frequency information
    //   in the ORCA output file

    while (i<rows.length && foundline == false) {
        n = rows[i].search("IR SPECTRUM");
        if (n>=0){
            foundline = true;
            startline = i + 6;
        } else {
            i++;
        }
    }   

    // Throw error if IR Spectrum summary section not found
	
    if (foundline == false) {
        document.querySelector("#contents").innerHTML = "<b>The information " +
        "needed to produce an IR spectrum was not found in this " +
        "file</b><br><br>" +
        "Please check to make sure that" +
        "<ul><li>the ORCA calculation terminated normally</li>" +
        "<li>this is geometry optimization calculation " +
        "(a keyword line in the input file should " +
        "contain \"opt\")</li>" +
        "<li>a frequency calculation was performed on the " +
        "final geometry (a keyword line in the input file " +
        "should contain \"freq\")</li></ul>";
        document.querySelector("#contents").style.display = 'block';
        document.querySelector("#file-input-label").style.display = 'block';
    }

    // collect the frequencies and intensities of
    //   the peaks of the IR spctrum

    i = startline;
    foundend = false;

    while (i<rows.length && foundend == false) {
        n = rows[i].search("[0-9]");
        if (n>=0) {
            var trow = rows[i].trim();
            var fields = trow.split(/\s+/);
            freq.push(Number(fields[1]));
            intensity.push(Number(fields[3]));
	    console.log(fields[1],fields[3]);   // DEBUG
            i++;
        } else {
            foundend = true;
            endline = i-1;
        }
    }

    irinfo = new IRObj(freq,intensity);
    return irinfo

}


function ir_info_nwchem(outfile) {
    var rows = outfile.split("\n");
    var i = 0;
    var n = -10;
    var foundline = false;
    var startline = 0;
    var endline = 0;
    var freq = [];
    var intensity = [];
	
    // find the beginning of the IR Frequency information
    //   in the NWChem output file

    while (i<rows.length && foundline == false) {
        n = rows[i].search(/Projected Infra Red Intensities/); 
        if (n>=0){
            foundline = true;
            startline = i + 3;
        } else {
            i++;
        }
    }   

    // Throw error if IR Spectrum summary section not found
	
    if (foundline == false) {
        document.querySelector("#contents").innerHTML = "<b>The information " +
        "needed to produce an IR spectrum was not found in this " +
        "file</b><br><br>" +
        "Please check to make sure that" +
        "<ul><li>the NWChem calculation terminated normally</li>" +
        "<li>this is geometry optimization calculation " +
        "(task line in the input file should " +
        "contain \"opt\")</li>" +
        "<li>a frequency calculation was performed on the " +
        "final geometry (task line in the input file " +
        "should contain \"freq\")</li></ul>";
        document.querySelector("#contents").style.display = 'block';
        document.querySelector("#file-input-label").style.display = 'block';
    }

    // collect the frequencies and intensities of
    //   the peaks of the IR spctrum

    i = startline;
    foundend = false;

    while (i<rows.length && foundend == false) {
        n = rows[i].search("[0-9]");
        if (n>=0) {
            var trow = rows[i].trim();
            var fields = trow.split(/\s+/);
            freq.push(Number(fields[1]));
            intensity.push(Number(fields[5]));
	    console.log(fields[1],fields[5]);   // DEBUG
            i++;
        } else {
            foundend = true;
            endline = i-1;
        }
    }

    irinfo = new IRObj(freq,intensity);
    return irinfo

}


function ir_info_psi4(outfile) {
    var rows = outfile.split("\n");
    var i = 0;
    var n = -10;
    var foundline = false;
    var startline = 0;
    var endline = 0;
    var freq = [];
    var intensity = [];
	
    // find the beginning of the IR Frequency information
    //   in the Psi4 output file

    while (i<rows.length && foundline == false) {
        n = rows[i].search(/IR activ/); 
        if (n>=0){
            foundline = true;
            startline = i;
        } else {
            i++;
        }
    }   

    // Throw error if IR Spectrum summary section not found
	
    if (foundline == false) {
        document.querySelector("#contents").innerHTML = "<b>The information " +
        "needed to produce an IR spectrum was not found in this " +
        "file</b><br><br>" +
        "Please check to make sure that" +
        "<ul><li>the Psi4 calculation terminated normally</li>" +
        "<li>this is geometry optimization calculation " +
        "(line in the input file should " +
        "contain \"optimization(...)\")</li>" +
        "<li>a frequency calculation was performed on the " +
        "final geometry (line in the input file " +
        "should contain \"frequency(...)\")</li></ul>";
        document.querySelector("#contents").style.display = 'block';
        document.querySelector("#file-input-label").style.display = 'block';
    }

    // collect the frequencies and intensities of
    //   the peaks of the IR spctrum

    i = startline;

    while (i<rows.length) {
        n = rows[i].search(/IR activ/);
        if (n>0) {
            var itrow = rows[i].trim();
            var ftrow = rows[i-6].trim();
            var ifields = itrow.split(/\s+/);
            var ffields = ftrow.split(/\s+/);
	    for (let j = 3; j < ifields.length; j++) {
                intensity.push(Number(ifields[j]));
                freq.push(Number(ffields[j-1]));
            }
        }
	i++;
    }

    for (let j = 0; j < freq.length; j++) {   // DEBUG
        console.log(freq[j],intensity[j]);    // DEBUG
    }                                         // DEBUG

    irinfo = new IRObj(freq,intensity);
    return irinfo

}


