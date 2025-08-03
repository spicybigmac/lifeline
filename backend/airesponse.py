from google import genai
import os
import prompts

client = genai.Client(api_key=os.getenv("geminiapikey"))

def getresponse(input, transcript):
    prompt = prompts.getprompt(input, transcript)

    res = client.models.generate_content(
        model = "gemini-2.5-flash",
        contents=prompt
    )

    return res.text