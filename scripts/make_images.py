#!/usr/bin/env python3
"""Render favicon PNGs and the 1200x630 social share image (assets/img/)."""
import os
from PIL import Image, ImageDraw, ImageFont

OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "img")
INK, PAPER, ACC, MUTED = (21, 19, 15), (244, 240, 232), (255, 74, 28), (74, 69, 60)


def font(cands, size):
    for c in cands:
        if os.path.exists(c):
            return ImageFont.truetype(c, size)
    return ImageFont.load_default()


SERIF = ["/usr/share/fonts/truetype/freefont/FreeSerifBold.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"]
SANS = ["/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]


def icon(sz):
    im = Image.new("RGBA", (sz, sz), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, sz - 1, sz - 1], radius=int(sz * .28), fill=INK)
    d.text((sz * .47, sz * .53), "B", font=font(SERIF, int(sz * .66)), fill=PAPER, anchor="mm")
    r, cx, cy = sz * .08, sz * .77, sz * .74
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=ACC)
    return im


def main():
    os.makedirs(OUT, exist_ok=True)
    for s in (192, 512):
        icon(s).save(os.path.join(OUT, f"icon-{s}.png"), optimize=True)
    W, H = 1200, 630
    im = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, W, 14], fill=ACC)
    ic = icon(120)
    im.paste(ic, (80, 90), ic)
    d.text((80, 280), "Brand.Studio", font=font(SERIF, 118), fill=INK)
    f = font(SANS, 34)
    d.text((84, 420), "Name it. Design it. Launch it. Free brand-building tools,", font=f, fill=MUTED)
    d.text((84, 468), "expert guides and vetted studio matching.", font=f, fill=MUTED)
    for i, c in enumerate([(31, 58, 95), (62, 124, 177), ACC, (235, 229, 217), INK]):
        d.rounded_rectangle([84 + i * 96, 540, 164 + i * 96, 590], radius=12, fill=c)
    im.quantize(colors=48).save(os.path.join(OUT, "og.png"), optimize=True)
    print("images written to", os.path.abspath(OUT))


if __name__ == "__main__":
    main()
