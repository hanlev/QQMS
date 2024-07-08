class UVVObj {
    constructor(uvvwl,uvvint) {
        this.uvvwl = uvvwl;
        this.uvvint = uvvint;
    }
}


function uvvis_info_gamess(outfile) {

    var rows = outfile.split("\n");
    var i = 0;
    var n = -10;
    var foundline = false;
    var startline = 0;
    var endline = 0;
    var wl = [];
    var osc_str = [];
	
    // find the beginning of the UV/Vis spectrum information 
    //   in the GAMESS output file

    while (i<rows.length && foundline == false) {
        n = rows[i].search("SUMMARY OF TDDFT RESULTS");
        if (n>0){
            foundline = true;
            startline = i + 5;
        } 
        i++;
    }

    // Throw error if TDDFT summary section not found
	
    if (foundline == false) {
        document.querySelector("#contents").innerHTML = "<b>The information " +
        "needed to produce a UV/Vis spectrum was not found in this " +
        "file</b><br><br>" +
        "Please check to make sure that" +
        "<ul><li>the GAMESS calculation terminated normally</li>" +
        "<li>this is a TDDFT calculation " +
        "(the $CONTRL group in the input file should " +
        "contain \"TDDFT=EXCITE\")</li></ul>";
        document.querySelector("#contents").style.display = 'block';
        document.querySelector("#file-input-label").style.display = 'block';
    }

    // collect the wavelengths and oscillator strengths of
    //   the peaks of the UV/Vis spctrum

    i = startline;
    n = -10;
    foundend = false;

    while (i<rows.length && foundend == false) {
        n = rows[i].search("[0-9]");
        if (n>=0) {
            var trow = rows[i].trim();
            var fields = trow.split(/\s+/);
            wl.push(6.636E-34*3.00E8*1.0E9/(1.60218E-19*fields[3]));
            osc_str.push(Number(fields[7]));
            i++;
        } else {
            foundend = true;
            endline = i-1;
        }
    }

    uvvinfo = new UVVObj(wl,osc_str);
    return uvvinfo

}


function uvvis_info_orca(outfile) {

    var rows = outfile.split("\n");
    var i = 0;
    var n = -10;
    var foundline = false;
    var startline = 0;
    var endline = 0;
    var wl = [];
    var osc_str = [];
	
    // find the beginning of the UV/Vis spectrum information 
    //   in the ORCA output file

    while (i<rows.length && foundline == false) {
        n = rows[i].search("ABSORPTION SPECTRUM VIA TRANSITION ELECTRIC DIPOLE MOMENTS");
        if (n>=0){
            foundline = true;
            startline = i + 5;
        } 
        i++;
    }

    // Throw error if UV/Vis summary section not found
	
    if (foundline == false) {
        document.querySelector("#contents").innerHTML = "<b>The information " +
        "needed to produce a UV/Vis spectrum was not found in this " +
        "file</b><br><br>" +
        "Please check to make sure that" +
        "<ul><li>the ORCA calculation terminated normally</li>" +
        "<li>this is a TDDFT calculation " +
        "(the input file should contain \"\%tddft nroots 10 end\")</li></ul>";
        document.querySelector("#contents").style.display = 'block';
        document.querySelector("#file-input-label").style.display = 'block';
    }

    // collect the wavelengths and oscillator strengths of
    //   the peaks of the UV/Vis spctrum

    i = startline;
    n = -10;
    foundend = false;

    while (i<rows.length && foundend == false) {
        n = rows[i].search("[0-9]");
        if (n>=0) {
            var trow = rows[i].trim();
            var fields = trow.split(/\s+/);
            wl.push(fields[2]);
            osc_str.push(Number(fields[3]));
            console.log(fields[2],fields[3]); // DEBUG
            i++;
        } else {
            foundend = true;
            endline = i-1;
        }
    }

    uvvinfo = new UVVObj(wl,osc_str);
    return uvvinfo

}


function uvvis_info_nwchem(outfile) {

    var rows = outfile.split("\n");
    var i = 0;
    var n = -10;
    var foundline = false;
    var startline = 0;
    var endline = 0;
    var wl = [];
    var osc_str = [];
	
    // find the beginning of the UV/Vis spectrum information 
    //   in the NWChem output file

    while (i<rows.length && foundline == false) {
        n = rows[i].search(/^  Root/);
        if (n>=0){
            foundline = true;
            startline = i;
        } 
        i++;
    }

    // Throw error if UV/Vis summary section not found
	
    if (foundline == false) {
        document.querySelector("#contents").innerHTML = "<b>The information " +
        "needed to produce a UV/Vis spectrum was not found in this " +
        "file</b><br><br>" +
        "Please check to make sure that" +
        "<ul><li>the NWChem calculation terminated normally</li>" +
        "<li>this is a TDDFT calculation " +
        "(the input file should contain a tddft section)</li></ul>";
        document.querySelector("#contents").style.display = 'block';
        document.querySelector("#file-input-label").style.display = 'block';
    }

    // collect the wavelengths and oscillator strengths of
    //   the peaks of the UV/Vis spctrum

    i = startline;

    while (i<rows.length) {
        n = rows[i].search(/^  Root/);
        if (n>=0) {
            var trow = rows[i].trim();
            var fields = trow.split(/\s+/);
            wl.push(6.636E-34*3.00E8*1.0E9/(1.60218E-19*fields[6]));
	    var ttrow = rows[i+8].trim();
	    var tfields = ttrow.split(/\s+/);
            osc_str.push(Number(tfields[3]));
	    console.log("eV = ",fields[6]," osc st = ",tfields[3]); // DEBUG
        }
	i++;
    }

    uvvinfo = new UVVObj(wl,osc_str);
    return uvvinfo

}


function uvvis_info_psi4(outfile) {

    var rows = outfile.split("\n");
    var i = 0;
    var n = -10;
    var foundline = false;
    var startline = 0;
    var endline = 0;
    var wl = [];
    var osc_str = [];
	
    // find the beginning of the UV/Vis spectrum information 
    //   in the GAMESS output file

    while (i<rows.length && foundline == false) {
        n = rows[i].search("Excitation Energy");
        if (n>0){
            foundline = true;
            startline = i + 3;
        }
        i++;
    }

    // Throw error if TDDFT summary section not found
	
    if (foundline == false) {
        document.querySelector("#contents").innerHTML = "<b>The information " +
        "needed to produce a UV/Vis spectrum was not found in this " +
        "file</b><br><br>" +
        "Please check to make sure that" +
        "<ul><li>the PSI4 calculation terminated normally</li>" +
        "<li>this is a TDDFT calculation " +
        "(the input file should contain \"td-scf\")</li></ul>";
        document.querySelector("#contents").style.display = 'block';
        document.querySelector("#file-input-label").style.display = 'block';
    }

    // collect the wavelengths and oscillator strengths of
    //   the peaks of the UV/Vis spctrum

    i = startline;
    n = -10;
    foundend = false;

    while (i<rows.length && foundend == false) {
        n = rows[i].search("[0-9]");
        if (n>=0) {
            var trow = rows[i].trim();
            var fields = trow.split(/\s+/);
            wl.push(6.636E-34*3.00E8*1.0E9/(1.60218E-19*fields[5]));
            osc_str.push(Number(fields[7]));
            i++;
        } else {
            foundend = true;
            endline = i-1;
        }
    }

    uvvinfo = new UVVObj(wl,osc_str);
    return uvvinfo

}

