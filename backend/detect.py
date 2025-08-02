from ultralytics import YOLO

model = YOLO("backend/falling.pt")

def process(imagepath):
    try:
        res = model.predict(imagepath)
    except Exception as e:
        print("error when processing image")
        return -1, e
        
    print(res)
    return 0, res
