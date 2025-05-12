from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
import pandas as pd

chrome_options = Options()
chrome_options.add_experimental_option("detach",True)
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()),options=chrome_options)

csv_dealer=[]
csv_addres=[]
csv_phoneno=[]
csv_open_until=[]
poi=True

city=["andaman-and-nicobar-islands","andhra-pradesh","arunachal-pradesh","assam","bihar","chandigarh","chhattisgarh","dadra-and-nagar-haveli","delhi","goa","gujarat","haryana","himachal-pradesh","jammu-and-kashmir","jharkhand","karnataka","kerala","madhya-pradesh","maharashtra","manipur","meghalaya","nagaland","odisha","puducherry","punjab","rajasthan","tamil-nadu","telangana","tripura","uttar-pradesh","uttarakhand","west-bengal"]
for i in city:
    driver.get("https://dealers.tvsmotor.com/tvs-motors/location/"+i)
    con=True
    while(con==True):
        for j in range(7):
            try:
                dealer=driver.find_element('xpath','/html/body/section[3]/div/div[1]/div[2]/div/div[{}]/ul/li[1]/div[2]/a'.format(j))
                csv_dealer.append(dealer.text+' ')
                address=driver.find_element('xpath','/html/body/section[3]/div/div[1]/div[2]/div/div[{}]/ul/li[2]/div[2]'.format(j))
                csv_addres.append(address.text+' ')
                try:
                    phoneno=driver.find_element('xpath','/html/body/section[3]/div/div[1]/div[2]/div/div[{}]/ul/li[4]/div[2]/a'.format(j))   
                    csv_phoneno.append(phoneno.text+' ') 
                except:
                    phonenoo=driver.find_element('xpath','//*[@id="storelocater_id_134327"]/div[2]/span'.format(j))   
                    csv_phoneno.append(phonenoo.text+' ') 
                try:
                    open_until=driver.find_element('xpath','/html/body/section[3]/div/div[1]/div[2]/div/div[{}]/ul/li[4]/div[2]/span'.format(j))
                    second_half = open_until.text[19:]
                    csv_open_until.append(second_half+' ')
                except:
                    open_until=driver.find_element('xpath','/html/body/section[3]/div/div[1]/div[2]/div/div[{}]/ul/li[5]/div[2]/span'.format(j))
                    csv_open_until.append(open_until.text+' ')
            except:
                continue
        try:
            try:
                button_element = driver.find_element('xpath',"/html/body/section[3]/div/div[2]/div/ul/li[4]/a")
                
            except:
                button_element = driver.find_element('xpath',"/html/body/section[3]/div/div[2]/div/ul/li[6]/a")
                

            if(button_element.text=='Next'):
                button_element.click()
            else:
                con=false   
        
        except :
            con=False

min_length = min(len(csv_addres), len(csv_dealer),len(csv_open_until),len(csv_phoneno))
csv_addres = csv_addres[:min_length]
csv_dealer = csv_dealer[:min_length]

csv_open_until = csv_open_until[:min_length]

csv_phoneno = csv_phoneno[:min_length]


data_records = {'Dealers_name': csv_dealer, 'Address':csv_addres, 'Live timing':csv_open_until, 'Phone No':csv_phoneno}
df = pd.DataFrame(data_records)
df.to_csv('Output_records.csv', index=False)
    
driver.quit()
            