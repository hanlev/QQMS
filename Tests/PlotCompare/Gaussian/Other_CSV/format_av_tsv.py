import sys
import csv
import os
from os import listdir
from os.path import isfile, join

# This script opens a series of .tsv files of spectra generated 
#  by Avogadro for Orca and converts them into a format like 
#  that of the QQMS website. The file must end in _av.tsv.

cwd = os.getcwd()
tsv_files = [os.path.join(cwd, f) for f in os.listdir(cwd) if
(os.path.isfile(os.path.join(cwd, f)) and f.endswith('.tsv'))]

for tsvfile in tsv_files:
    origfile = open(tsvfile, "r")
    newpath = tsvfile.replace('_av.tsv','_oth.csv')
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
        tline = lines[i].split()
        newfile.write(',' + tline[0] + ',' + tline[1] + '\n')
    
    origfile.close()
    newfile.close()



quit()
#qmprog = ["gms", "nwc", "orc", "ps4"]
#spectyp = ["ir", "ram", "uvv"]

for qmp in qmprog:
    for spect in spectyp:
        web_rows = []
        oth_rows = []
        web_freqs = []
        web_inten = []
        oth_freqs = []
        oth_inten = []
#        csv_web = qmp + "_bzorig_b3lyp_nosmd_" + spect + "_web.csv"
        csv_web10 = qmp + "_bzorig_b3lyp_nosmd_" + spect + "-10.csv"
        csv_web20 = qmp + "_bzorig_b3lyp_nosmd_" + spect + "-20.csv"
        csv_oth = qmp + "_bzorig_b3lyp_nosmd_" + spect + "_oth.csv"
#       csv_tot_web = filepath + "\\" + csv_web
        csv_tot_web = filepath + "\\" + csv_web10
        csv_tot_oth = filepath + "\\" + csv_oth
        if (not os.path.isfile(csv_tot_web)):
            csv_tot_web = filepath + "\\" + csv_web20
        if ((os.path.isfile(csv_tot_web)) and (os.path.isfile(csv_tot_oth))):
            with open(csv_tot_web, newline='') as webfile:
                webinfo = csv.reader(webfile)
                for row in webinfo:
                    web_rows.append(row)
            with open(csv_tot_oth, newline='') as othfile:
                othinfo = csv.reader(othfile)
                for row in othinfo:
                    oth_rows.append(row)
            for i in range(2,len(web_rows)):
                web_freqs.append(float(web_rows[i][1]))
                web_inten.append(float(web_rows[i][2]))
            for i in range(2,len(oth_rows)):
                oth_freqs.append(float(oth_rows[i][1]))
                oth_inten.append(float(oth_rows[i][2]))
            # scale "other" intensities to match scale of QQMS website csv
            max_web_inten = max(web_inten)
            max_oth_inten = max(oth_inten)
            min_web_inten = min(web_inten)
            scaled_oth_inten = []
            for i in range(0,len(oth_inten)):
                if (spect == "ir") and (qmp == "ps4"):
                    t_inten = oth_inten[i]*min_web_inten/max_oth_inten
                elif (spect == "ir"):
                    t_inten = (-oth_inten[i])*min_web_inten/max_oth_inten + min_web_inten
                else:
                    t_inten = oth_inten[i]*max_web_inten/max_oth_inten
                scaled_oth_inten.append(t_inten)

            if (spect == "uvv"):
                xaxlab = "Wavelength (nm)"     # x axis label
                yaxlab = "Oscillator Strength (arbitrary units)" # y axis label
            else:
                xaxlab = "Frequency (cm^-1)"     # x axis label
                yaxlab = "Intensity (arbitrary units)"     # y axis label

            x1 = web_freqs
            x2 = oth_freqs
            y1 = web_inten
            y2 = scaled_oth_inten

            plt.plot(x1, y1, 'r-', label='qqms', linewidth=2)
            plt.plot(x2, y2, 'b--', label='other', linewidth=2)

#           plottitle = qmp + "_" + spect
#           plt.title(plottitle)

            plt.tick_params(axis='both',which='major',labelsize=12)
            plt.xlabel(xaxlab, size=18)
            plt.ylabel(yaxlab, size=18)
            plt.legend(loc='lower left')
            plt.tight_layout()
            pngname = qmp + "_" + spect + "_plots.png"
            plt.savefig(pngname)
          # plt.show()
            plt.close()


