import subprocess, numpy as np, os, sys
import mediapipe as mp, cv2
from mediapipe.tasks.python import vision, BaseOptions
from PIL import Image
W,H=1080,1920
src, outdir = sys.argv[1], sys.argv[2]
os.makedirs(outdir, exist_ok=True)
seg = vision.ImageSegmenter.create_from_options(vision.ImageSegmenterOptions(
    base_options=BaseOptions(model_asset_path='selfie_multiclass.tflite'), output_confidence_masks=True, running_mode=vision.RunningMode.VIDEO))
p = subprocess.Popen(['ffmpeg','-v','error','-i',src,'-f','rawvideo','-pix_fmt','rgb24','-'], stdout=subprocess.PIPE)
prev=None; i=0
while True:
    b = p.stdout.read(W*H*3)
    if len(b) < W*H*3: break
    rgb = np.frombuffer(b, np.uint8).reshape(H, W, 3)
    small = cv2.resize(rgb, (540, 960), interpolation=cv2.INTER_AREA)
    r = seg.segment_for_video(mp.Image(image_format=mp.ImageFormat.SRGB, data=np.ascontiguousarray(small)), int(i*1000/30))
    bg = r.confidence_masks[0].numpy_view()          # class 0 = background
    m = 1.0 - bg
    m = cv2.resize(m, (W, H), interpolation=cv2.INTER_LINEAR)
    prev = m if prev is None else 0.6*m + 0.4*prev   # temporal smoothing (less edge flicker)
    a = np.clip((prev - 0.35) / 0.3, 0, 1)            # tighten edge
    a = cv2.GaussianBlur(a, (0, 0), 2.0)
    rgba = np.dstack([rgb, (a*255).astype(np.uint8)])
    Image.fromarray(rgba, 'RGBA').save(f'{outdir}/{i:04d}.webp', quality=82, method=4)
    i += 1
print(i)
