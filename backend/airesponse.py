from google import genai
import os

client = genai.Client(api_key=os.getenv("geminiapikey"))

def getresponse(input):
    prompt = f"""
        You're participating in a phone call! Respond to their input with messages, and **nothing else**.
        Do **not** include any form of formatting including code blocks, as your message will be spoken with text to speech.
        Here is their input:
        {input}
    """

    res = client.models.generate_content(
        model = "gemini-2.5-flash",
        contents=prompt
    )

    return res.text