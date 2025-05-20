function getvibs(prog,file,irinfo,xyz,molview) {
  const vibtable = document.getElementById("vibTable");
  vibtable.style.display='block';
  makevibrows(irinfo,vibtable);
  getvibfreq(prog,file,irinfo,xyz,molview); 
// NOTE TO SELF: if there are imaginary frequencies, this could cause
// problems, definitely for GAMESS, possibly for other programs. 
// Actually, since using mode # rather than freq value, may be ok.
//  vibform.addEventListener("submit", (e) => animatevib(prog,file,irinfo,xyz,molview))
  return;
}

function animatevib(prog,file,irinfo,xyz,molview,modechoice) {
  var nfreqs = irinfo.vibfreq.length;
  console.log("modechoice = " + modechoice);    // DEBUG
  console.log("nfreqs = " + nfreqs); // DEBUG
  var newxyz;
  switch(prog) {
    case "gamess":
      newxyz = vibgamess(file,modechoice,xyz,nfreqs);
      break;
    case "nwchem":
      newxyz = vibnwchem(file,modechoice,xyz,nfreqs);
      break;
    case "orca":
      newxyz = viborca(file,modechoice,xyz,nfreqs);
      break;
    case "psi4":
      newxyz = vibpsi4(file,modechoice,xyz,nfreqs);
      break;
  }
  molview.clear();
  molview.removeAllModels();
  molview.addModel(newxyz,"xyz");
  molview.setStyle({}, { stick: {}, sphere: {radius: 0.4} }); 
  molview.zoomTo();
  molview.render();
//  molview.setFrame(10); // DEBUG
  molview.vibrate(10,1,true);
  molview.animate({loop: "backandforth"});
  document.getElementById("cont-3dtext").innerHTML = "<br><br>Displaying the " +
    "<b>normal mode </b>with frequency <b>" + 
    irinfo.vibfreq[modechoice] + "&nbsp;cm<sup>-1</sup></b>.<br><br>" +
    "<b><i>Note:</i></b> if the animation of the mode is choppy, please " +
    "refresh your browser and reload the output file."
}

function makevibrows(irobj,vibtab) {
  const freqs = irobj.vibfreq;
  const intens = irobj.irint;

  var modenum = 1;

  for (let i=0; i < freqs.length; i++) {

    // Create new table row
//    const newRow = vibtab.insertRow(-1);
    const newRow = vibtab.getElementsByTagName('tbody')[0].insertRow(-1);
    const cell1 = document.createElement('td');
    const cell2 = document.createElement('td');
    const cell3 = document.createElement('td');
    cell1.textContent = modenum;
    cell2.textContent = freqs[i];
    cell3.textContent = intens[i];
    newRow.appendChild(cell1);
    newRow.appendChild(cell2);
    newRow.appendChild(cell3);

    modenum = modenum + 1;
  }
}

function getvibfreq(prog,file,irinfo,xyz,molview) {
  const rows = document.getElementById('vibTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
  let previouslyHighlighted = null;
  let prevGrayHighlight = null;
  let modechoice = -1;

  for (let i = 0; i < rows.length; i++) {
    rows[i].addEventListener('click', function() {
      if (previouslyHighlighted) {
        previouslyHighlighted.classList.remove('highlighted_y');
      }
      if (prevGrayHighlight) {
        prevGrayHighlight.classList.remove('highlighted_g');
      }
      this.classList.add('highlighted_y');
      previouslyHighlighted = this;
      // Handle click event, e.g., get cell data
      modechoice = i;
      animatevib(prog,file,irinfo,xyz,molview,modechoice); 
      const cells = this.getElementsByTagName('td');
      const rowData = [];
      for (let j = 0; j < cells.length; j++) {
        rowData.push(cells[j].textContent);
      }
      console.log('Clicked Row Data:', rowData);
    });
    rows[i].addEventListener('mouseover', function() {
      this.classList.add('highlighted_g');
      prevGrayHighlight = this;
    });
    rows[i].addEventListener('mouseleave', function() {
      this.classList.remove('highlighted_g');
    });
  }
  return modechoice;
}

function vibgamess(ofile,nmode,oldxyz,nfreqs) {
  var rows = ofile.split("\n");
  var i = 0;
  var n = -10;
  var nn = -10;
  var foundline = false;
  var startline = 0;
  var endline = 0;
  var xyzlines = oldxyz.split("\n");
  var nfield;
  var maxfield;
  var addval;
  var displacements = [];

  // Find the location in the output file of the selected
  //   vibrational mode.

  while (i<rows.length && foundline==false) {
    n = rows[i].search(/FREQUENCY:/);
    if (n>=0) {
      var smode = Number(nmode) + 1;
      var nmodestring = smode;
      var trow = rows[i-1].trim();
      var fields = trow.split(/\s+/);
      var j = 0;
      while (j<fields.length && foundline == false) {
        nn = fields[j].search(nmodestring);
        if (nn>=0) {
          foundline = true;
          startline = i+5;
	  endline = startline + nfreqs;
          nfield = j;
	  maxfield = fields.length + 3;
        }
        j++;
      }
    }
    i++;
  }

  // Collect the displacements along each coordinate of 
  //   the selected vibrational mode and add them to the
  //   xyz file.

  for (i=startline; i<endline; i++) {
    var ttrow = rows[i].trim();
    var tfields = ttrow.split(/\s+/);
    if (tfields.length == maxfield) {
      addval = 3;
    }
    else {
      addval = 1;
    }
    displacements.push(Number(tfields[nfield+addval]));
  }

  var newxyz = xyzlines[0] + "\n\n";

  n=0;

  for (i=2; i<xyzlines.length; i++) {
    nn = -10;
    nn = xyzlines[i].search(/[0-9]/);
    if (nn>0) {
      newxyz = newxyz + xyzlines[i];
      for (j=0; j<3; j++) {
        newxyz = newxyz + " " + displacements[n];
        n++;
      }
      newxyz = newxyz + "\n";
    }
  }
  
  console.log(newxyz);  // DEBUG
  
  return newxyz;
}

function vibnwchem(ofile,nmode,oldxyz,nfreqs) {
  var rows = ofile.split("\n");
  var i = 0;
  var n = -10;
  var nn = -10;
  var foundline = false;
  var startline = 0;
  var endline = 0;
  var xyzlines = oldxyz.split("\n");
  var nfield;
  var addval;
  var displacements = [];

  // Find the location in the output file of the selected
  //   vibrational mode.

  nmode++; // NWChem starts mode numbering at 1 rather than 0

  while (i<rows.length && foundline==false) {
    n = rows[i].search(/P.Frequency/);
    if (n>=0) {
      var trow = rows[i-2].trim();
      var fields = trow.split(/\s+/);
      var j = 0;
      while (j<fields.length && foundline == false) {
        nn = fields[j].search(nmode);
        if (nn>=0) {
          foundline = true;
          startline = i+2;
	  endline = startline + nfreqs;
          nfield = j;
        }
        j++;
      }
    }
    i++;
  }

  // Collect the displacements along each coordinate of 
  //   the selected vibrational mode and add them to the
  //   xyz file.

  for (i=startline; i<endline; i++) {
    var ttrow = rows[i].trim();
    var tfields = ttrow.split(/\s+/);
    displacements.push(Number(tfields[nfield+1]));
  }

  var newxyz = xyzlines[0] + "\n\n";

  n=0;

  for (i=2; i<xyzlines.length; i++) {
    nn = -10;
    nn = xyzlines[i].search(/[0-9]/);
    if (nn>0) {
      newxyz = newxyz + xyzlines[i];
      for (j=0; j<3; j++) {
        newxyz = newxyz + " " + displacements[n];
        n++;
      }
      newxyz = newxyz + "\n";
    }
  }
  
  console.log(newxyz);  // DEBUG
  
  return newxyz;
}

function viborca(ofile,nmode,oldxyz,nfreqs) {
  var rows = ofile.split("\n");
  var i = 0;
  var n = -10;
  var nn = -10;
  var foundline = false;
  var startline = 0;
  var endline = 0;
  var xyzlines = oldxyz.split("\n");
  var nfield;
  var displacements = [];

  nfreqs = nfreqs + 6;// account for the fact that the first 6 normal modes
  var numode = Number(nmode) + 6;  // were projected out

  // Find the location in the output file of the selected
  //   vibrational mode.

  while (i<rows.length && foundline==false) {
    n = rows[i].search(/NORMAL MODES/);
    if (n>=0) {
      foundline = true;
      startline = i+7;
    }
    i++;
  }

  var foundmode = false;
  i = startline;
  while (i<rows.length && foundmode==false) {
    var trow = rows[i].trim();
    var fields = trow.split(/\s+/);
    var j = 0;
    while (j<fields.length && foundmode == false) {
      nn = fields[j].search(numode);
      if (nn>=0) {
        foundmode = true;
        startline = i+1;
	endline = startline + nfreqs;
	nfield = j;
      }
      j++;
    }
    i=i+nfreqs+1;
  }

  // Collect the displacements along each coordinate of 
  //   the selected vibrational mode and add them to the
  //   xyz file.

  for (i=startline; i<endline; i++) {
    var ttrow = rows[i].trim();
    var tfields = ttrow.split(/\s+/);
    displacements.push(Number(tfields[nfield+1]));
    console.log(Number(tfields[nfield+1])); // DEBUG
  }

  var newxyz = xyzlines[0] + "\n\n";

  n=0;

  for (i=2; i<xyzlines.length; i++) {
    nn = -10;
    nn = xyzlines[i].search(/[0-9]/);
    if (nn>0) {
      newxyz = newxyz + xyzlines[i];
      for (j=0; j<3; j++) {
        newxyz = newxyz + " " + displacements[n];
        n++;
      }
      newxyz = newxyz + "\n";
    }
  }
  
  console.log(newxyz);  // DEBUG
  
  return newxyz;
}


function vibpsi4(ofile,nmode,oldxyz,nfreqs) {
  var rows = ofile.split("\n");
  var i = 0;
  var n = -10;
  var nn = -10;
  var foundline = false;
  var startline = 0;
  var endline = 0;
  var xyzlines = oldxyz.split("\n");
  var nfield;
  var displacements = [];
  
  nfreqs = nfreqs + 6;// account for the fact that the first 6 normal modes
  var numode = Number(nmode) + 7;  // were projected out
  console.log("nfreqs = " + nfreqs + " numode = " + numode); // DEBUG

  // Find the location in the output file of the selected
  //   vibrational mode.

  while (i<rows.length && foundline==false) {
    n = rows[i].search(/IR activ/);
    if (n>=0) {
      var trow = rows[i-7].trim();
      console.log(trow); // DEBUG
      var fields = trow.split(/\s+/);
      var j = 0;
      while (j<fields.length && foundline == false) {
        nn = fields[j].search(numode);
        if (nn>=0) {
          foundline = true;
          startline = i+3;
	  endline = startline + nfreqs/3;
          nfield = j;
	  console.log("found line: startline,endline,nfield" + startline + endline + nfreqs); // DEBUG
        }
        j++;
      }
    }
    i++;
  }

  // Collect the displacements along each coordinate of 
  //   the selected vibrational mode and add them to the
  //   xyz file.

  for (i=startline; i<endline; i++) {
    var ttrow = rows[i].trim();
    var tfields = ttrow.split(/\s+/);
    for (j=0; j<3; j++) {
      displacements.push(Number(tfields[j+(nfield-1)*3+2]));
    }
  }

  var newxyz = xyzlines[0] + "\n\n";

  n=0;

  for (i=2; i<xyzlines.length; i++) {
    nn = -10;
    nn = xyzlines[i].search(/[0-9]/);
    if (nn>0) {
      newxyz = newxyz + xyzlines[i];
      for (j=0; j<3; j++) {
        newxyz = newxyz + " " + displacements[n];
        n++;
      }
      newxyz = newxyz + "\n";
    }
  }
  
  console.log(newxyz);  // DEBUG
  
  return newxyz;
}
