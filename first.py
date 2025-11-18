import cv2
from cvzone.HandTrackingModule import HandDetector
import numpy as np
import math
import time

cap = cv2.VideoCapture(0)
detector = HandDetector(maxHands=1)
offset = 20
imgsize = 300
counter = 0

folder = "C:\\Users\\jayar_olx8xkb\\OneDrive\\Desktop\\sign language\\data\\hello"

while True:
    success, img = cap.read()
    if not success:
        print("Failed to grab frame")
        break

    hands, img = detector.findHands(img)

    if hands:
        hand = hands[0]
        x, y, w, h = hand['bbox']

        # make sure crop doesn’t go out of frame
        y1 = max(0, y - offset)
        y2 = min(y + h + offset, img.shape[0])
        x1 = max(0, x - offset)
        x2 = min(x + w + offset, img.shape[1])

        imgCrop = img[y1:y2, x1:x2]

        if imgCrop.size == 0:
            continue  # skip empty crop

        imgWhite = np.ones((imgsize, imgsize, 3), np.uint8) * 255

        aspectRatio = h / w
        if aspectRatio > 1:
            k = imgsize / h
            wCal = math.ceil(k * w)
            imgResize = cv2.resize(imgCrop, (wCal, imgsize))
            wGap = math.ceil((imgsize - wCal) / 2)
            imgWhite[:, wGap:wGap + wCal] = imgResize
        else:
            k = imgsize / w
            hCal = math.ceil(k * h)
            imgResize = cv2.resize(imgCrop, (imgsize, hCal))
            hGap = math.ceil((imgsize - hCal) / 2)
            imgWhite[hGap:hGap + hCal, :] = imgResize

        cv2.imshow("ImageCrop", imgCrop)
        cv2.imshow("ImageWhite", imgWhite)

    cv2.imshow("Image", img)
    key = cv2.waitKey(1)
    if key == ord('s'):
        counter += 1
        cv2.imwrite(f'{folder}/Image_{time.time()}.jpg', imgWhite)
        print(f" Saved image {counter}")
    elif key == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()