import os
from twilio.rest import Client
import dotenv
dotenv.load_dotenv()

account_sid = os.getenv("twiliosid")
auth_token = os.getenv("twilioauthtoken")

twilio_phone_number = "+13656750638"

ngrok_url = "https://0c0b690b54c4.ngrok-free.app"
instruction_url = f"{ngrok_url}/voice?id="

client = Client(account_sid, auth_token)

def call(id, recipient_phone_number="+14374366580"):
    try:
        print(f"Initiating call to {recipient_phone_number}...")
        call = client.calls.create(
            url=instruction_url+str(id),
            to=recipient_phone_number,
            from_=twilio_phone_number
        )

        print(f"Call initiated successfully. Call SID: {call.sid}")

    except Exception as e:
        print(f"Error making call: {e}")