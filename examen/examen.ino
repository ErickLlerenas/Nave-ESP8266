//FirebaseESP8266.h must be included before ESP8266WiFi.h
#include "FirebaseESP8266.h"
#include <ESP8266WiFi.h>


#define FIREBASE_HOST "nave-a43fc.firebaseio.com"
#define FIREBASE_AUTH "auWoftpAzxT79qnk1G989fdspLhAFL9kKI8V2LW3"
#define WIFI_SSID "HUAWEI-5G"
#define WIFI_PASSWORD "1234567890"
#define TempRelay 12 //D0
#define DistanceRelay 15 //D2
const int echopin = 0;  //D3
#define lightPin 13 //D7
#define TempPin A0

long duracion;
int distancia;
float vref = 3.3;
float resolution = vref/1023;
float tMin,tMax,dMin,dMax;
int relCount=0;
//Define FirebaseESP8266 data object
FirebaseData firebaseData;

FirebaseJson json;
// Dependiendo del tipo de sensor

String path = "/nave-DX";
bool ent=false;

void setup()
{

  Serial.begin(9600);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);

  //Set the size of WiFi rx/tx buffers in the case where we want to work with large data.
  firebaseData.setBSSLBufferSize(1024, 1024);

  //Set the size of HTTP response buffers in the case where we want to work with large data.
  firebaseData.setResponseSize(1024);

  //Set database read timeout to 1 minute (max 15 minutes)
  Firebase.setReadTimeout(firebaseData, 1000 * 60);
  //tiny, small, medium, large and unlimited.
  //Size and its write timeout e.g. tiny (1s), small (10s), medium (30s) and large (60s).
  Firebase.setwriteSizeLimit(firebaseData, "tiny");
  
  /*
  This option allows get and delete functions (PUT and DELETE HTTP requests) works for device connected behind the
  Firewall that allows only GET and POST requests.
  
  Firebase.enableClassicRequest(firebaseData, true);
  */

 
  Serial.println("------------------------------------");
  Serial.println("Set double test...");

  pinMode(LED_BUILTIN,OUTPUT);
  pinMode(TempRelay,OUTPUT);

  pinMode(DistanceRelay,OUTPUT);

}



void loop()
{
  for (uint8_t i = 0; i < 100; i++)
  {
    Firebase.getFloat(firebaseData ,"/Distancia/max");
    dMax=firebaseData.stringData().toFloat();
    Firebase.getFloat(firebaseData ,"/Distancia/min");
    dMin=firebaseData.stringData().toFloat();
    Firebase.getFloat(firebaseData ,"/Temperature/max");
    tMax=firebaseData.stringData().toFloat();
    Firebase.getFloat(firebaseData ,"/Temperature/min");
    tMin=firebaseData.stringData().toFloat();
   int lightValue=digitalRead(lightPin);  //Lectura de la luz en digital en pin D7

  float temperature = analogRead(TempPin); //lectura de la temperatura con lm35 en A0
  temperature = (temperature*resolution);
  temperature = temperature*100;
  
   duracion = pulseIn(echopin, HIGH);  //Lectura de la distancia en D3
  distancia= duracion*0.034/2;

 
  
    
    Firebase.setFloat(firebaseData, "/Temperature/value", temperature);
    Firebase.setFloat(firebaseData, "/Distancia/value", distancia);
    Firebase.setFloat(firebaseData, "/Light_V/value", lightValue);
    
    relCount=0;



    if( temperature<=tMin||temperature>=tMax){
      digitalWrite(TempRelay,HIGH);
      
    }else{
      digitalWrite(TempRelay,LOW);
    }

    if(distancia<=dMin||distancia>=dMax){
      digitalWrite(DistanceRelay,HIGH);
      
    }else{
      digitalWrite(DistanceRelay,LOW);
    }

    
    if(digitalRead(TempRelay)==1){
      relCount++;
    }

    if(digitalRead(DistanceRelay)==1){
      relCount++;
    }

    Firebase.setInt(firebaseData, "/Relay", relCount);

    if(  distancia<=dMin||distancia>=dMax|| temperature<=tMin||temperature>=tMax){

            digitalWrite(LED_BUILTIN,LOW);
        if(ent){
            digitalWrite(LED_BUILTIN,HIGH);
          ent=false;
          break;
        }
        ent=true;
    }else{
            digitalWrite(LED_BUILTIN,HIGH);
      
    }
 
  delay(1000);  
  }
  
}
