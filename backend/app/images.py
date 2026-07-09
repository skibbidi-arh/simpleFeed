from dotenv import load_dotenv
from imagekitio import ImageKit
import os

load_dotenv()


def _build_imagekit():
    private_key = os.getenv("IMAGEKIT_PRIVATE_KEY")
    if not private_key:
        return None

    init_kwargs = {"private_key": private_key}
    url_endpoint = os.getenv("IMAGEKIT_URL")
    if url_endpoint:
        init_kwargs["base_url"] = url_endpoint

    try:
        return ImageKit(**init_kwargs)
    except TypeError:
        return ImageKit(private_key=private_key)


imagekit = _build_imagekit()