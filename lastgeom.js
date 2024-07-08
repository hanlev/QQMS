function last_geom_gamess(outfile) {
    var rows = outfile.split("\n");
    var i = rows.length-1;
    var n = -10;
    var neq = -10;
    var foundline = false;
    var foundeq = false;
    var startline = 0;
    var endline = 0;
    var coords = "";
    var natom = 0;
    var molxyz = "";
	
    // find the beginning of the Equilibrium Geometry information
    //   in the GAMESS output file, or at least the last geometry
    //   printed.

    while (i>0 && foundline == false) {
        n = rows[i].search("COORDINATES OF ALL ATOMS");
        if (n>=0){
            foundline = true;
            startline = i + 3;
	    neq = rows[i-1].search("EQUILIBRIUM GEOMETRY");
	    if (neq>=0){
	        foundeq = true;
            }
        } 
        i--;
    }   

    // collect the element types and coordinates of each atom

    i = startline;
    foundend = false;

    while (i<rows.length && foundend == false && foundline == true) {
        n = rows[i].search("[0-9]");
        if (n>=0) {
            var trow = rows[i].trim();
            var fields = trow.split(/\s+/);
            var xyzline = fields[0] + " " + fields[2] + " " + fields[3] + " " + fields[4] + "\n";
            coords = coords + xyzline;
	    natom++;
        } else {
            foundend = true;
        }
        i++;
    }

    // If no "last" geometry found after optimization steps, take the input geometry

    if (foundline == false) {
	i = 0;
	n = -10;
        var foundinp = false
	while (i<rows.length && foundinp == false) {
	    n = rows[i].search(/INPUT CARD> \$DATA/);
	    if (n>=0){
	        foundinp = true;
		foundline = true;
		startline = i+3;
	    } 
	    i++;
	}

	i = startline;
	var foundie = false;
	while (i<rows.length && foundie == false) {
            n = rows[i].search("INPUT CARD>");
	    var zz = rows[i].search(/\$END/);
	    if (n>=0 && zz<0) {
                var tline = rows[i].split(/>/);
                var trow = tline[1].trim();
                var fields = trow.split(/\s+/);
                var xyzline = fields[0] + " " + fields[2] + " " + fields[3] + " " + fields[4] + "\n";
                coords = coords + xyzline;
                natom++;
	    } else {
	        foundie = true;
	    }
	    i++;
	}
    }


    // Throw error if no geometry section not found at all
    // Print message about the type of geometry found:

    var geom_message = "";
    
    if (foundeq == true) { 
        geom_message = "Displaying the <b>equilibrium geometry</b> of the molecule.";
    } else if (foundinp == true) {
        geom_message = "Displaying the <b>input geometry</b> of the molecule because a geometry " +
		       "optimization does not appear to have been performed in this output file.<br>" +
                       "<p><i>Please note:</i> the output file was searched for geometries in Cartesian coordinates. " +
                       "If the molecular geometry was input in z-matrix or other format, the molecule " +
	               "might not be displayed correctly.</p>" +
		    "<mark>Some atoms may " +
		    "not be displayed, because GAMESS only reprints the first " +
		    "50 lines of the input file</mark>";
    } else if (foundline == true) {
        geom_message = "No equilibrium geometry was found in this output file. " +
		       "Displaying the <b>last geometry</b> of the molecule" +
		       " that was found in the output file.";
    } else {
        geom_message = "<b>Cartesian coordinates for this molecule were not found in " +
		       "the output file.</b><br><br>" +
                       "Please check to make sure that the GAMESS calculation terminated normally.";
    }

    // console.log(geom_message);   // DEBUG

    document.querySelector("#cont-3dtext").innerHTML = geom_message;
	
    molxyz = natom + "\n\n" + coords;
    console.log(molxyz);    // DEBUG
    return molxyz;

}


function last_geom_orca(outfile) {
    var rows = outfile.split("\n");
    var i = rows.length-1;
    var n = -10;
    var neq = -10;
    var foundline = false;
    var foundeq = false;
    var startline = 0;
    var endline = 0;
    var coords = "";
    var natom = 0;
    var molxyz = "";
	
    // find the beginning of the Equilibrium Geometry information
    //   in the ORCA output file, or at least the last geometry
    //   printed.

    while (i>0 && foundline == false) {
        n = rows[i].search(/CARTESIAN COORDINATES \(ANGSTROEM\)/);
        if (n>=0){
            foundline = true;
            startline = i + 2;
	    neq = rows[i-4].search("STATIONARY POINT");
	    if (neq>=0){
	        foundeq = true;
            }
        } 
        i--;
    }   

    // collect the element types and coordinates of each atom

    if (foundline == true) {

        i = startline;
        foundend = false;

        while (i<rows.length && foundend == false) {
            n = rows[i].search(/[0-9]/);
            if (n>0) {
                var trow = rows[i].trim();
                var fields = trow.split(/\s+/);
                var xyzline = fields[0] + " " + fields[1] + " " + fields[2] + " " + fields[3] + "\n";
                coords = coords + xyzline;
	        natom++;
            } else {
                foundend = true;
            }
	    i++;
        }
    }

    // If no "last" geometry found after optimization steps, take the input geometry

    if (foundline == false) {
	i = 0;
	n = -10;
        var foundinp = false
	while (i<rows.length && foundinp == false) {
	    n = rows[i].search(/INPUT FILE/);
	    if (n>=0){
  		var j = i+3;
		while (j<rows.length && foundline == false) {
	            var yy = rows[j].search(/^\|.+\*.+xyz/);
		    if (yy>=0) {
		        foundinp = true;
		        foundline = true;
		        startline = j+1;
		    }
	            j++;
	        }
	    } 
	    i++;
	}

	i = startline;
	var foundie = false;
	while (i<rows.length && foundie == false && foundinp == true) {
	    zz = rows[i].search(/^\|.+\*/);
	    if (zz<0) {
                var tline = rows[i].split(/>/);
                var trow = tline[1].trim();
                var fields = trow.split(/\s+/);
                var xyzline = fields[0] + " " + fields[1] + " " + fields[2] + " " + fields[3] + "\n";
                coords = coords + xyzline;
                natom++;
	    } else {
                foundie = true;
	    }
	    i++;
	}
    }


    // Throw error if no geometry section not found at all
    // Print message about the type of geometry found:

    var geom_message = "";
    
    if (foundeq == true) { 
        geom_message = "Displaying the <b>equilibrium geometry</b> of the molecule.";
    } else if (foundinp == true) {
        geom_message = "Displaying the <b>input geometry</b> of the molecule because a geometry " +
		       "optimization does not appear to have been performed in this output file.<br>" +
                       "<p><i>Please note:</i> the output file was searched for geometries in Cartesian coordinates. " +
                       "If the molecular geometry was input in z-matrix or other format, the molecule " +
	               "might not be displayed correctly.</p>";
    } else if (foundline == true) {
        geom_message = "No equilibrium geometry was found in this output file. " +
		       "Displaying the <b>last geometry</b> of the molecule" +
		       " that was found in the output file.";
    } else {
        geom_message = "<b>Cartesian coordinates for this molecule were not found in " +
		       "the output file.</b><br><br>" +
                       "Please check to make sure that the ORCA calculation terminated normally.";
    }

    // console.log(geom_message);   // DEBUG

    document.querySelector("#cont-3dtext").innerHTML = geom_message;
	
    molxyz = natom + "\n\n" + coords;
    console.log(molxyz);    // DEBUG
    return molxyz;

}


function last_geom_nwchem(outfile) {
    var rows = outfile.split("\n");
    var i = rows.length-1;
    var n = -10;
    var neq = -10;
    var foundline = false;
    var foundeq = false;
    var foundinp = false;
    var startline = 0;
    var endline = 0;
    var coords = "";
    var natom = 0;
    var molxyz = "";
	
    // find the beginning of the Equilibrium Geometry information
    //   in the NWChem output file, or at least the last geometry
    //   printed.

//  while (i>0 && foundline == false) {
//      n = rows[i].search(/-- Atom information --/);
//      if (n>=0){
//          foundline = true;
//          foundeq = true;
//          startline = i + 3;
//      } else {
//          i--;
//      }
//  }   

    // collect the element types and coordinates of each atom

//  i = startline;
//  foundend = false;
//
//  while (i<rows.length && foundend == false) {
//      n = rows[i].search(/[0-9]/);
//      if (n>0) {
//          var fields = rows[i].split(/\s+/);
//          var xyzline = fields[1] + " " + fields[3] + " " + fields[4] + " " + fields[5] + "\n";
//          coords = coords + xyzline;
//          natom++;
//          i++;
//      } else {
//          foundend = true;
//      }
//  }

    // If no equilibrium geometry found after optimization steps, take the 
	// last geometry given

    i = rows.length-1;
    n = -10;

    while (i>0 && foundline == false) {
        n = rows[i].search(/ENERGY GRADIENT/);
        if (n>=0){
            foundline = true;
            startline = i + 4;
        } 
        i--;
    }

    i = startline;
    foundend = false;

    while (i<rows.length && foundline == true && foundend == false) {
        n = rows[i].search(/[0-9]/);
        if (n>0) {
            var trow = rows[i].trim();
            var fields = trow.split(/\s+/);
            // Divide by 1.889725989 Bohr/A to convert to Angstroms
            var xcrd = Number(fields[2])/1.889725989
            var ycrd = Number(fields[3])/1.889725989
            var zcrd = Number(fields[4])/1.889725989
            var xyzline = fields[1] + " " + xcrd + " " + ycrd + " " + zcrd + "\n";
            coords = coords + xyzline;
	    natom++;
        } else {
            foundend = true;
        }
        i++;
    }

    // If no geometry optimization was performed, take the 
	// input geometry

    i = 0
    n = -10;

    if (foundline == false) {
        while (i<rows.length) {
            n = rows[i].search(/XYZ format geometry/);
            if (n>=0){
                foundline = true;
                foundinp = true;
                startline = i + 4;
            } 
            i++;
        }

        i = startline;
        var foundie = false;
        n = -10;

        while (i<rows.length && foundinp == true && foundie == false) {
            n = rows[i].search(/[0-9]/);
            if (n>=0) {
                var trow = rows[i].trim();
                var fields = trow.split(/\s+/);
                var xyzline = fields[0] + " " + fields[1] + " " + fields[2] + " " + fields[3] + "\n";
                coords = coords + xyzline;
	        natom++;
            } else {
                foundie = true;
            }
	    i++;
        }
    }

    // Throw error if no geometry section not found at all
    // Print message about the type of geometry found:

    var geom_message = "";
    
    if (foundeq == true) { 
        geom_message = "Displaying the <b>equilibrium geometry</b> of the molecule.";
    } else if (foundinp == true) {
        geom_message = "Displaying the <b>input geometry</b> of the molecule because a geometry " +
		       "optimization does not appear to have been performed in this output file.<br>" +
                       "<p><i>Please note:</i> the output file was searched for geometries in Cartesian coordinates. " +
                       "If the molecular geometry was input in z-matrix or other format, the molecule " +
	               "might not be displayed correctly.</p>";
    } else if (foundline == true) {
        geom_message = "Displaying the <b>last geometry</b> of the molecule" +
		       " that was found in the output file.";
    } else {
        geom_message = "<b>Cartesian coordinates for this molecule were not found in " +
		       "the output file.</b><br><br>" +
                       "Please check to make sure that the NWChem calculation terminated normally.";
    }

    // console.log(geom_message);   // DEBUG

    document.querySelector("#cont-3dtext").innerHTML = geom_message;
	
    molxyz = natom + "\n\n" + coords;
    console.log(molxyz);    // DEBUG
    return molxyz;

}


function last_geom_psi4(outfile) {
    var rows = outfile.split("\n");
    var i = rows.length-1;
    var n = -10;
    var neq = -10;
    var foundline = false;
    var foundeq = false;
    var startline = 0;
    var endline = 0;
    var coords = "";
    var natom = 0;
    var molxyz = "";
	
    // find the beginning of the Equilibrium Geometry information
    //   in the Psi4 output file, or at least the last geometry
    //   printed.

    while (i>0 && foundline == false) {
        n = rows[i].search(/Final optimized geometry/);
        if (n>=0){
            foundline = true;
            foundeq = true;
            startline = i + 6;
        } 
        i--;
    }   
    
    i = rows.length-1;
    n = -10;
    while (i>0 && foundline == false) {
        n = rows[i].search(/Geometry \(in Angstrom\)/);
        if (n>=0){
            foundline = true;
            startline = i + 4;
        } 
        i--;
    }   

    // collect the element types and coordinates of each atom

    if (foundline == true) {

        i = startline;
        foundend = false;

        while (i<rows.length && foundend == false) {
            n = rows[i].search("[0-9]");
            if (n>=0) {
                var trow = rows[i].trim();
                var fields = trow.split(/\s+/);
                var xyzline = fields[0] + " " + Number(fields[1]) + " " + Number(fields[2]) + " " + Number(fields[3]) + "\n";
                coords = coords + xyzline;
	        natom++;
            } else {
                foundend = true;
            }
	    i++;
        }
    }

    // If no "last" geometry found after optimization steps, take the input geometry

    if (foundline == false) {
	i = 0;
	n = -10;
	startline = 0;
        var foundinp = false
	while (i<rows.length && foundinp == false) {
	    n = rows[i].search(/Input File/);
	    if (n>=0){
	        foundinp = true;
		var j = i+3;
		var nm = -10;
		var foundimol = false;
		while (j<rows.length && foundimol == false) {
                    nm = rows[j].search(/molecule/);
		    if (nm>=0) {
                        foundimol = true;
			var k = j+1;
			var nk = -10;
			var foundicoord = false;
			while (k<rows.length && foundicoord == false) {
		            var trow = rows[k].trim();
			    var fields = trow.split(/\s+/);
			    if (fields.length >= 4) {
                                var nkat = fields[0].search(/[A-Za-z]{1,2}/);
                                var nkc1 = fields[1].search(/[0-9]+/);
                                var nkc2 = fields[2].search(/[0-9]+/);
                                var nkc3 = fields[3].search(/[0-9]+/);
			        if (nkat==0 && nkc1 >= 0 && nkc2 >= 0 && nkc3 >= 0) {
                                    foundicoord = true;
                                    startline = k;
                                }
                            }
                            k++;
                        }
		    }
		    j++;
                }
            }
	    i++;
        }

	i = startline;
	var foundic = false;
	while (i<rows.length && foundic == false && foundicoord == true) {
  	    n = rows[i].search(/[0-9]/);
	    if (n>=0) {
                var trow = rows[i].trim();
                var fields = trow.split(/\s+/);
                var xyzline = fields[0] + " " + Number(fields[1]) + " " + Number(fields[2]) + " " + Number(fields[3]) + "\n";
                coords = coords + xyzline;
                natom++;
	    } else {
                foundic = true;
	    }
	    i++;
	}
    }


    // Throw error if no geometry section not found at all
    // Print message about the type of geometry found:

    var geom_message = "";
    
    if (foundeq == true) { 
        geom_message = "Displaying the <b>equilibrium geometry</b> of the molecule.";
    } else if (foundinp == true) {
        geom_message = "Displaying the <b>input geometry</b> of the molecule because a geometry " +
		       "optimization does not appear to have been performed in this output file.<br>" +
                       "<p><i>Please note:</i> the output file was searched for geometries in Cartesian coordinates. " +
                       "If the molecular geometry was input in z-matrix or other format, the molecule " +
	               "might not be displayed correctly.</p>";
    } else if (foundline == true) {
        geom_message = "No equilibrium geometry was found in this output file. " +
		       "Displaying the <b>last geometry</b> of the molecule" +
		       " that was found in the output file.";
    } else {
        geom_message = "<b>Cartesian coordinates for this molecule were not found in " +
		       "the output file.</b><br><br>" +
                       "Please check to make sure that the Psi4 calculation terminated normally.";
    }

    // console.log(geom_message);   // DEBUG

    document.querySelector("#cont-3dtext").innerHTML = geom_message;
	
    molxyz = natom + "\n\n" + coords;
    console.log(molxyz);    // DEBUG
    return molxyz;

}

