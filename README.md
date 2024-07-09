This directory contains files that define the Quick Quantum Mechanical Spectra (QQMS) website. 
This website allows the user to upload an output file from an open-source electronic structure 
package (such as GAMESS, ORCA, NWChem, or Psi4) and quickly obtain a theoretically-predicted 
spectrum that can easily be compared to an experimental spectrum.

The main file is quick_qm_spectra.html. A series of output files from various electronic structure
packages has been included in the Tests/BzOrig directory.

When the main file is opened in a browser (while all .js files are also present in the same directory)
the user will need to select (1) the electronic structure program (i.e., GAMESS, NWChem, etc.) and
(2) the type of spectrum to parse and display (i.e., infrared, UV/Vis, etc.). If using the test files
included in this directory then the following key explains the naming scheme:

- gms_... = GAMESS
- nwc_... = NWChem
- orc_... = ORCA
- ps4_... = Psi4

- ..._opt.out = infrared (IR) spectrum
- ..._ram.out = Raman spectrum
- ..._uvv.out = UV/Vis spectrum
