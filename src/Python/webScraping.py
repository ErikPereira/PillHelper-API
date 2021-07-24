import urllib.request
import re
from bs4 import BeautifulSoup

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
        
        if tags == ' ' and bulla["title"] != "":
            information.append(bulla)
            bulla = {
                "title": "",
                "description": "",
                "information": ""
            }

        elif tags.name == "h2":
            bulla["title"] = tags.text

        elif tags.name == "h3":
            bulla["description"] = tags.text
        
        elif tags.name == "h4":
            if tags.text == "Composição":
                bulla["title"] = tags.text
                bulla["description"] = "O que contém cada cápsula?"
            elif tags.text == "Laboratório":
                bulla["title"] = tags.text
                bulla["description"] = "Quem o fabrica?"
            else:
                bulla["title"] = "Curiosidades"
                bulla["description"] = tags.text

        elif tags.name == "p":
            info = re.sub("strong>", "b>", str(tags))
            info = re.sub("<p>", "", info)
            info = re.sub("</p>", "", info)
            bulla["information"] = bulla["information"] + info + " <br> "
        
        elif tags.name == "ul":
            info = re.sub("strong>", "b>", str(tags))
            bulla["information"] = bulla["information"] + info + " <br> "
        

    information.append(bulla)
    return information


urlAll = 'https://www.bulario.com/alfa/todos'
page = urllib.request.urlopen(urlAll)
soup = BeautifulSoup(page, 'html5lib')

listMedicine = soup.find_all('strong')
listBulla = []

for list in listMedicine:
    if list.contents[0].name != "a":
        continue
    
    medicine = {}
    medicine["name"] = re.sub("^ ", "", list.text)

    urlMedicine = "https://www.bulario.com" + list.contents[0].attrs['href']
    medicine["information"] = getInformationMedicine(urlMedicine)
    listBulla.append(medicine)
    # print(medicine)

print(listBulla)