# Terrahacks 2025

# LifeLine

## Inspiration
Nearly 50% of all seniors who fall are unable to get up without assistance, leading to pressure sores, hypothermia, and delayed treatment for fall related injuries. Fallers who were unable to get up in a study were 10% more likely to experience reduced daily mobility and were much more likely to be hospitalized or die. These further injuries could be prevented easily with a real time monitoring system that quickly alerts a loved one upon detecting a fall, so we built LifeLine to do so.

## What it does
LifeLine allows users to create an emergency contact profile for loved ones who live alone. By monitoring the user's webcam, LifeLine can use computer vision to detect if somebody has fallen for more than 10 seconds, and perform an automatic, AI-powered phone call (much more effective than methods like playing a loud sound) which can alert the emergency contact of the situation, and respond to questions regarding the next course of action.

## How we built it
Next.js: Used to build a sleek and modern frontend design.

MongoDB: Used to store vital information for account registration/login and the emergency contact profile system.

YOLO: Used to create a custom trained model for detecting people who have fallen in live video footage.

Twilio: Used to facilitate automated phone calls, powered by AI.

Gemini: Used to generate quick and accurate responses to live conversations over the automated phone call.

## Challenges we ran into
Because we used so many different API's and AI models, it was challenging to unite all of them into one ambitious project, making sure each system could integrate properly with the others. Part of the debugging process was not just figuring out which line of code an error was stemming from, but also figuring out which of the many systems we were using was failing! The Twilio API was especially difficult to test because we would have to answer a phone call every single time.

## Accomplishments that we're proud of
We're proud of being able to implement and integrate several advanced AI systems in such a short amount of time. Despite all of the difficulties in debugging, in the end, we managed to make a finished product which incorporates a database API, a computer vision model, a phone call API and an LLM, all presented within an eye-catching frontend design!

## What we learned
The main APIs which were new to us were the Twilio automated phone call API and the MongoDB API. After building this project, we have a better grasp on how these APIs work and we may find them useful in the future. We also learnt how to create SVG animations using CSS magic and some hard work! This will also be helpful the next time we build a frontend design.

## What's next for LifeLine
One major extension that can be made to LifeLine is increasing the range of computer vision and detection to more than just falls. For example, we could also detect strokes, heart attacks, or other medical emergencies. Additionally, it would be convenient for consumers if we added support for connecting to other cameras such as existing security cameras.
