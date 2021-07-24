import argparse
import easyocr
from easyocr import Reader
import cv2

# construct the argument parser and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-i", "--image", required=True, help="path to input image to be OCR'd")
ap.add_argument("-l", "--langs", type=str, default="en", help="comma separated list of languages to OCR")
ap.add_argument("-g", "--gpu", type=int, default=-1, help="whether or not GPU should be used")
args = vars(ap.parse_args())

bestResult = ""
bastImage = ""
probCompare = 0

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

# break the input languages into a comma separated list
langs = args["langs"].split(",")
# load the input image from disk
image = cv2.imread(args["image"])
# OCR the input image using EasyOCR
reader = Reader(langs, gpu=args["gpu"] > 0)

# loop over the results
for i in range(0,4):
  results = reader.readtext(image)
  final_text=''
  sum_probs=0
  for (bbox,text, prob) in results:
    sum_probs+=prob
    if prob < 0.50:
      continue
    else:
      final_text=final_text+' '+text
  if sum_probs > probCompare:
    bestResult = final_text
    probCompare = sum_probs
    bastImage = image
  image = rotate_image(image)
# show the output image
print(bestResult)