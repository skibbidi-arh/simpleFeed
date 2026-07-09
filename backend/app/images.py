from dotenv import load_dotenv
from imagekitio import ImageKit
import os

load_dotenv()


def _build_imagekit():
    private_key = os.getenv("IMAGEKIT_PRIVATE_KEY")
    if not private_key:
        return None

    try:
        return ImageKit(private_key=private_key)
    except Exception:
        return None


imagekit = _build_imagekit()