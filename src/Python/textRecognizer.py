import sys
import easyocr
from easyocr import Reader
import cv2

def ocr(image):
  reader = easyocr.Reader(['pt','en'])
  results = reader.readtext(image)
  return results

def cleanup_text(text):
	# strip out non-ASCII text so we can draw the text on the image
	# using OpenCV
	return "".join([c if ord(c) < 128 else "" for c in text]).strip()

def rotate_image(img):
  # get image height, width
  (h, w) = img.shape[:2]
  # calculate the center of the image
  center = (w / 2, h / 2)
  angle90 = 90
  scale = 1.0
  # Perform the counter clockwise rotation holding at the center
  # 90 degrees
  M = cv2.getRotationMatrix2D(center, angle90, scale)
  rotated90 = cv2.warpAffine(img, M, (h, w))
  return rotated90

all_results=[]
image = cv2.imread('C:/Users/Erik Bezerra/Desktop/git - TCC/PillHelper-API/src/Python/pare.jpg')
results = ocr(image)

print(results)
