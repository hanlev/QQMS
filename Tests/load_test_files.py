from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time, os
from pathlib import Path

driver = webdriver.Firefox()


#This script loads quick_qm_spectra.html in Selenium, loads the first test file with default values, and exports a screenshot named "screenshot.ong"

#Assumes starting Python script in Tests folder
#Grabs first file from Tests/BzOrig
base_dir = str(Path(os.path.abspath(os.path.curdir)).parents[0])
print(base_dir)
tests_dir = os.path.join(base_dir, "Tests", "BzOrig")
test_files = sorted(os.listdir(tests_dir))

upload_file = os.path.join(tests_dir, test_files[0]) #uploads only first test file
print(upload_file)
driver.get("file://" + os.path.join(base_dir, "quick_qm_spectra.html"))

def input_settings(my_qmprog="gamess", my_spect='ir', fwhh=50):
    driver.execute_script("document.getElementById('my_qmprog').value= " + "'" + my_qmprog + "'" + ';')
    driver.execute_script("document.getElementById('my_spect').value = " + "'" + my_spect  + "'" + ';')
    driver.execute_script("document.getElementById('fwhh').value = " + str(fwhh) + ';')

input_settings()

file_input_button = driver.find_element(By.ID, "output-button")
file_input = driver.find_element(By.CSS_SELECTOR, "input[type='file']")
file_input.send_keys(upload_file)

#Scroll to bottom of page
driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
driver.implicitly_wait(2)
driver.save_full_page_screenshot("screenshot.png")

driver.quit()