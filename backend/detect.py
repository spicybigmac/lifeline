from ultralytics import YOLO

model = YOLO("falling2.pt")

def process(imagepath):
    res = model.predict(imagepath)
    print(res)
    return res
