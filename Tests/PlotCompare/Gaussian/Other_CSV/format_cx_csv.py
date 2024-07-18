import sys
import csv
import os
from os import listdir
from os.path import isfile, join

# This script opens a series of .csv files of spectra generated 
#  by ChimeraX and converts them into a format like 
#  that of the QQMS website. The filenames must end in _cx.csv.

cwd = os.getcwd()
tsv_files = [os.path.join(cwd, f) for f in os.listdir(cwd) if
(os.path.isfile(os.path.join(cwd, f)) and f.endswith('_cx.csv'))]

for tsvfile in tsv_files:
    origfile = open(tsvfile, "r")
    newpath = tsvfile.replace('_cx.csv','_oth.csv')
    newfile = open(newpath, "w")

    if "_av" in tsvfile:
      newfile.write('Avogadro for Orca \n')
    elif "_cx" in tsvfile:
      newfile.write('ChimeraX \n')

    if "uvv" in tsvfile:
      newfile.write(',Wavelength (nm),Intensity \n')
    else:
      newfile.write(',Frequency (cm^-1),Intensity \n')

    lines = origfile.readlines()

    for i in range(1,len(lines)):
        newfile.write(',' + lines[i])
    
    origfile.close()
    newfile.close()

quit()
