"""subtle 'slimmer/fitter' retouch: horizontal squeeze toward the body centre, stronger at the waist than the
shoulders (V-taper), very light on the face. Also inpaints the person out of the background plate."""
import sys, numpy as np, cv2
cut = cv2.imread(sys.argv[1], cv2.IMREAD_UNCHANGED)  # RGBA cut-out
bg = cv2.imread(sys.argv[2])
H, W = cut.shape[:2]
a = cut[:, :, 3].astype(np.float32) / 255
cols = np.where(a.sum(0) > 20)[0]
cx = 520.0  # body centre line (between face centre and torso)
ys = np.array([0, 650, 1000, 1150, 1300, 1550, 1920], np.float32)
ks = np.array([1.05, 1.05, 1.07, 1.09, 1.13, 1.17, 1.17], np.float32)  # >1 = narrower
k = np.interp(np.arange(H), ys, ks).astype(np.float32)
xx, yy = np.meshgrid(np.arange(W, dtype=np.float32), np.arange(H, dtype=np.float32))
mapx = cx + (xx - cx) * k[:, None]
out = cv2.remap(cut, mapx, yy, cv2.INTER_CUBIC, borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0, 0))
cv2.imwrite(sys.argv[3], out)
# clean plate: remove the (wider) original body from the background before it gets blurred
m = (cv2.dilate((a > 0.2).astype(np.uint8) * 255, np.ones((41, 41), np.uint8)))
small = cv2.resize(bg, (W // 4, H // 4)); ms = cv2.resize(m, (W // 4, H // 4))
plate = cv2.inpaint(small, ms, 9, cv2.INPAINT_TELEA)
cv2.imwrite(sys.argv[4], cv2.resize(plate, (W, H), interpolation=cv2.INTER_CUBIC))
# where does the watch (x=380, y=1520) land after the squeeze?
print("watch x ->", cx + (380 - cx) / k[1520])
