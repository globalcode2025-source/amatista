import os
import uuid
from pathlib import Path

import cloudinary
import cloudinary.uploader
from fastapi import HTTPException, UploadFile


def configure_cloudinary():
    """Configure Cloudinary from environment variables."""
    cloudinary.config(
        cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
        api_key=os.getenv("CLOUDINARY_API_KEY"),
        api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    )


def upload_image(file: UploadFile, folder: str = "amatista") -> str:
    """Upload an image to Cloudinary and return the URL."""
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=422, detail="El archivo debe ser una imagen.")
    
    configure_cloudinary()
    
    # Generate unique filename
    ext = Path(file.filename or "").suffix.lower()
    public_id = f"{folder}/{uuid.uuid4().hex}"
    
    try:
        result = cloudinary.uploader.upload(
            file.file,
            public_id=public_id,
            resource_type="image",
            format=ext.lstrip("."),
        )
        return result["secure_url"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al subir la imagen: {str(e)}")


def upload_video(file: UploadFile, folder: str = "amatista") -> str:
    """Upload a video to Cloudinary and return the URL."""
    if not file.content_type or not file.content_type.startswith("video/"):
        raise HTTPException(status_code=422, detail="El archivo debe ser un video.")
    
    configure_cloudinary()
    
    # Generate unique filename
    ext = Path(file.filename or "").suffix.lower()
    public_id = f"{folder}/{uuid.uuid4().hex}"
    
    try:
        result = cloudinary.uploader.upload(
            file.file,
            public_id=public_id,
            resource_type="video",
            format=ext.lstrip("."),
        )
        return result["secure_url"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al subir el video: {str(e)}")


def delete_image(url: str) -> None:
    """Delete an image from Cloudinary by URL. Does nothing for local paths."""
    if not url or "cloudinary" not in url:
        # Skip deletion for local paths or empty URLs
        return
    
    configure_cloudinary()
    
    try:
        # Extract public_id from URL
        # URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.ext
        parts = url.split("/")
        if "upload" in parts:
            upload_index = parts.index("upload")
            # Get the part after upload/version
            public_id_with_ext = "/".join(parts[upload_index + 1:])
            # Remove version and extension
            public_id = public_id_with_ext.split("/")[-1].split(".")[0]
            folder = parts[upload_index + 1] if len(parts) > upload_index + 2 else None
            full_public_id = f"{folder}/{public_id}" if folder else public_id
            
            cloudinary.uploader.destroy(full_public_id, resource_type="image")
    except Exception:
        # Don't raise error if deletion fails
        pass
