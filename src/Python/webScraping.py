import urllib.request
import re
from bs4 import BeautifulSoup

def getInformationMedicine(urlMedicine):
    pageMedicine = urllib.request.urlopen(urlMedicine)
    soupMedicine = BeautifulSoup(pageMedicine, 'html5lib')
    listTitle = soupMedicine.find_all('h2')
    print(listTitle)


urlAll = 'https://www.bulario.com/alfa/todos'
page = urllib.request.urlopen(urlAll)
soup = BeautifulSoup(page, 'html5lib')

listMedicine = soup.find_all('strong')
listBulla = []

for i in range(0,30):
    medicine = {}
    medicine["name"] = re.sub("^ ", "", listMedicine[i].text)
    urlMedicine = "https://www.bulario.com" + listMedicine[i].contents[0].attrs['href']
    medicine["information"] = getInformationMedicine(urlMedicine)
    print(medicine)

print(listMedicine)