"""person matte for a 1080x1920 clip -> grayscale mask video (white = person)"""
import sys, subprocess, numpy as np, cv2, mediapipe as mp
from mediapipe.tasks.python import vision, BaseOptions
W, H = 1080, 1920
seg = vision.ImageSegmenter.create_from_options(vision.ImageSegmenterOptions(base_options=BaseOptions(model_asset_path=sys.argv[2]), running_mode=vision.RunningMode.VIDEO, output_confidence_masks=True))
rd = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', sys.argv[1], '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
wr = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'gray', '-s', f'{W}x{H}', '-r', '30', '-i', '-', '-c:v', 'libx264', '-crf', '12', '-pix_fmt', 'yuv420p', sys.argv[3]], stdin=subprocess.PIPE)
prev, i = None, 0
while True:
    b = rd.stdout.read(W * H * 3)
    if len(b) < W * H * 3: break
    img = np.frombuffer(b, np.uint8).reshape(H, W, 3)
    small = np.ascontiguousarray(cv2.resize(img, (540, 960), interpolation=cv2.INTER_AREA))
    r = seg.segment_for_video(mp.Image(image_format=mp.ImageFormat.SRGB, data=small), int(i * 1000 / 30))
    m = 1.0 - r.confidence_masks[0].numpy_view()
    m = cv2.resize(m, (W, H), interpolation=cv2.INTER_CUBIC)
    m = np.clip((m - 0.35) / 0.3, 0, 1).astype(np.float32)
    m = cv2.ximgproc.guidedFilter(img.astype(np.float32) / 255, m, 8, 1e-4)
    m = np.clip(m, 0, 1)
    if prev is not None: m = 0.6 * m + 0.4 * prev  # temporal smoothing against flicker
    prev = m
    wr.stdin.write((m * 255).astype(np.uint8).tobytes()); i += 1
wr.stdin.close(); wr.wait(); print('frames', i)
