from fastapi import FastAPI, HTTPException, Form, Response
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

@app.post("/voice")
async def voice():
    response = VoiceResponse()

    gather = Gather(input='speech', action='/handleResponse', speechTimeout=1)
    gather.say("hi, welcome to terrahacks calling test", voice=v)
    response.append(gather)

    response.redirect('/voice')
    return Response(content=str(response), media_type="application/xml")

@app.post("/handleResponse")
async def handle_response(SpeechResult: str = Form(None)):
    response = VoiceResponse()
    
    print(SpeechResult)
    if (SpeechResult != None):
        ai_text_response = airesponse.getresponse(SpeechResult)
        print(ai_text_response)

    gather = Gather(input='speech', action='/handleResponse', speechTimeout=1)
    gather.say(
        message=ai_text_response,
        voice=v
    )
    
    response.append(gather)
    response.redirect('/handleResponse')

    return Response(content=str(response), media_type="application/xml")

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
   
@app.post("/emergencyCall")
async def emergencyCall():
    print("called")

if (__name__ == "__main__"):
    uvicorn.run("main:app", reload=True)