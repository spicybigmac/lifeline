import cv2
from ultralytics import YOLO

model = YOLO("backend/falling.pt")

cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("bad")
    exit()

while True:
    success, frame = cap.read()
    if success:
        frame = cv2.flip(frame,1)

        res = model.predict(frame)
        print(res)

        frame = res[0].plot()

        cv2.imshow("aaaaa", frame)

        key = cv2.waitKey(1) & 0xFF
        if (key == ord("q")):
            break

cap.release()
cv2.destroyAllWindows()