from google import genai
import os
import prompts

client = genai.Client(api_key=os.getenv("geminiapikey"))

def getresponse(input, transcript, victimName, address, age, medicalConditions):
    prompt = prompts.getprompt(input, transcript, victimName, address, age, medicalConditions)
    
    res = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt
    )

    return res.text