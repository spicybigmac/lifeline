from ultralytics import YOLO

model = YOLO("falling2.pt")

def process(imagepath):
    res = model.predict(imagepath)
    return 0,res