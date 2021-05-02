import sys
import requests
import pandas as pd

url = sys.argv[1]
tableIndex = sys.argv[2]
username = sys.argv[3]
password = sys.argv[4]


if password != "":
  r = requests.get(url, auth=(username, password))
  url = r.text

try: 
  table_test = pd.read_html(url)
  print(table_test[int(tableIndex)].to_json(orient="records"))
except Exception as e:
  print(e.args)