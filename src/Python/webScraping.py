# coding: utf-8
import sys
import json
import urllib.request
import re
from bs4 import BeautifulSoup
from unidecode import unidecode

def stringCorrections(string):
    string = re.sub("'", '"', string)
    string = re.sub("\xa0", '', string)
    string = re.sub("\x1f", '', string)
    string = re.sub("\x08", '', string)
    string = re.sub("\x0b", '', string)
    return string

def cleanup_text(text):
	# strip out non-ASCII text so we can draw the text on the image
	# using OpenCV
	return "".join([c if ord(c) < 128 else "" for c in text]).strip()

def getInformationMedicine(urlMedicine):
    pageMedicine = urllib.request.urlopen(urlMedicine)
    soupMedicine = BeautifulSoup(pageMedicine, 'html5lib')
    webValues = soupMedicine.find('div', attrs={'id': 'innerBula'})
    information = []
    bulla = {
        "title": "",
        "description": "",
        "information": ""
    }
    for tags in webValues.contents[1].contents:
        
        if tags == ' ':
            continue

        if tags.name == None:
            bulla["information"] = bulla["information"] + cleanup_text(unidecode(str(tags))) + " <br> "
            continue

        if tags.name == "a":
            if bulla["title"] != "":
                information.append(bulla)
                bulla = {
                    "title": "",
                    "description": "",
                    "information": ""
                }
            continue
        
        text = cleanup_text(unidecode(str(tags.text)))
        text = stringCorrections(text)

        if tags.name == "h2":
            bulla["title"] = text

            bulla["description"] = text
        
        elif tags.name == "h4":
            if tags.text == "Composição":
                bulla["title"] = text
                bulla["description"] = "O que contem cada capsula?"
            elif tags.text == "Laboratório":
                bulla["title"] = text
                bulla["description"] = "Quem o fabrica?"
            else:
                bulla["title"] = "Curiosidades"
                bulla["description"] = text

        elif tags.name == "p":
            bulla["information"] = bulla["information"] + text + " <br> "
        
        elif tags.name == "ul":
            info = re.sub("strong>", "b>", unidecode(str(tags)))
            info = stringCorrections(info)
            text = cleanup_text(str(info))
            bulla["information"] = bulla["information"] + text + " <br> "
        
    information.append(bulla)
    return information


# urlAll = sys.argv[1]
urlAll = "https://www.bulario.com/alfa/todos/45"
page = urllib.request.urlopen(urlAll)
soup = BeautifulSoup(page, 'html5lib')

listMedicine = soup.find_all('strong')
listBulla = []

for list in listMedicine:
    if list.contents[0].name != "a":
        continue
    
    medicine = {}
    medicine["nameBulla"] = unidecode(re.sub("^ ", "", list.text))

    urlMedicine = "https://www.bulario.com" + list.contents[0].attrs['href']
    medicine["information"] = getInformationMedicine(urlMedicine)
    listBulla.append(medicine)

print(listBulla)