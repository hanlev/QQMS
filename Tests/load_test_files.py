from selenium import webdriver
from selenium.webdriver.firefox.options import Options
#from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
#from selenium.webdriver.common.keys import Keys
import time
import os
from pathlib import Path


options = Options()
options.add_argument("--headless")

#This script loads quick_qm_spectra.html in Selenium, loads each test file and exports a screenshot named "screenshot-OUTPUTFILE.png"
#Autodetect of program seems to work, but without a way to autodetect spectrum type graph won't load
def input_settings(uploadfile, my_spect='ir'): #my_qmprog="gamess",fwhh=50
    if "_opt" in uploadfile:
        my_spect = "ir"
    elif "_ram" in uploadfile:
        my_spect = "raman"
    elif "_uvv" in uploadfile:
        my_spect = "uvvis"
    # driver.execute_script("document.getElementById('my_qmprog').value= " + "'" + my_qmprog + "'" + ';')
    driver.execute_script("document.getElementById('my_spect').value = " + "'" + my_spect  + "'" + ';')
    # driver.execute_script("document.getElementById('fwhh').value = " + str(fwhh) + ';')

#Assumes starting Python script in Tests folder
#Grabs first file from Tests/BzOrig
base_dir = str(Path(os.path.abspath(os.path.curdir)).parents[0])
print(base_dir)
tests_dir = os.path.join(base_dir, "Tests", "BzOrig")
test_files = sorted(os.listdir(tests_dir))

upload_files = [os.path.join(tests_dir, x) for x in test_files]
print(upload_files)
for upload_file in upload_files:
    driver = webdriver.Firefox(options=options)
    driver.get("file://" + os.path.join(base_dir, "quick_qm_spectra.html"))

    # input_settings(uploadfile=upload_file)

    file_input_button = driver.find_element(By.ID, "output-button")
    file_input = driver.find_element(By.CSS_SELECTOR, "input[type='file']")
    file_input.send_keys(upload_file)
    time.sleep(5)
    #Scroll to bottom of page
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    # driver.implicitly_wait(10)
    print(upload_file)
    
    print(driver.find_element(By.ID, "my_qmprog").get_attribute("value"))
    print(driver.find_element(By.ID, "hidden_status_div").get_attribute("innerHTML"))
    # print(driver.find_element(By.ID, "my_spect").get_attribute("value"))
    driver.save_full_page_screenshot("screenshot-" + os.path.basename(upload_file).replace(".out","") + ".png")

    driver.quit()
