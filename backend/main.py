from fastapi import FastAPI, HTTPException, Response, Form
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
import cv2
import base64
from twilio.twiml.voice_response import VoiceResponse, Gather
import uvicorn
import dotenv
dotenv.load_dotenv()

import airesponse
import detect
import call

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------ CALL HANDLING ---------------
v = "alice"

transcript = {}
info = {}

@app.post("/voice")
async def voice(SpeechResult: str = Form(None), id: int=0):
    response = VoiceResponse()
    
    print(SpeechResult)
    SpeechResult = (SpeechResult or "")
    transcript[id] += "Them: "+SpeechResult+"\n"
    ai_text_response = airesponse.getresponse(SpeechResult, transcript[id], info[id].fullName, info[id].address, info[id].age, info[id].conditions)
    print(ai_text_response)
    transcript[id] += "You: "+ai_text_response+"\n"

    gather = Gather(input='speech', action='/voice?id='+str(id), speechTimeout=2)
    gather.say(
        message=ai_text_response,
        voice=v
    )
    
    response.append(gather)
    response.redirect('/voice?id='+str(id), method="POST")

    return Response(content=str(response), media_type="application/xml")

# --------------- YOLO processing ----------------

class ProcessRequest(BaseModel):
    image: str

currid = 0

@app.post("/processImage")
async def processfunction(request: ProcessRequest):
    image = request.image
    image = image[image.find(",")+1:]

    global currid
    path = f"backend\\images\\{currid}.jpg"
    currid += 1

    print("start read")
    try:
        with open(path, "wb") as f:
            f.write(base64.b64decode(image))
    except:
        raise HTTPException(422, "File Loading Failed.")

    print(f"img with id {currid} saved")

    code, output = detect.process(path)

    if os.path.exists(path):
        os.remove(path)
    else:
        print("File does not exist.")

    success, buffer = cv2.imencode(".jpg",output[0].plot())

    if not success:
        raise HTTPException(422, "Failed to generate output image.")
    
    if (code == 0):
        return [base64.b64encode(buffer.tobytes()).decode("utf-8"),output[0].boxes.data.tolist()]
    
    raise HTTPException(422, output)
   
class ProfileData(BaseModel):
    username: str
    fullName: str
    address: str
    age: str
    conditions: str
    emergencyContact: str

callid = 0
@app.post("/emergencyCall")
async def emergencyCall(profile: ProfileData):
    global callid

    print("calling with id "+str(callid))
    transcript[callid] = ""
    info[callid] = profile

    call.call(callid, profile.emergencyContact)

    callid += 1

if (__name__ == "__main__"):
    uvicorn.run("main:app", reload=True)