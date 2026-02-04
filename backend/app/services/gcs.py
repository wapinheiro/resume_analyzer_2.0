from google.cloud import storage
from datetime import timedelta
from app.core.config import settings
import os

class GCSService:
    def __init__(self):
        # Explicitly look for the key file if provided in settings, otherwise default SDK behavior
        if settings.GOOGLE_APPLICATION_CREDENTIALS and os.path.exists(settings.GOOGLE_APPLICATION_CREDENTIALS):
             self.client = storage.Client.from_service_account_json(settings.GOOGLE_APPLICATION_CREDENTIALS)
        else:
             # Fallback to default environment variable GOOGLE_APPLICATION_CREDENTIALS or metadata server
             self.client = storage.Client()
             
        self.bucket_name = settings.GCS_BUCKET_NAME
        self.bucket = self.client.bucket(self.bucket_name)

    async def upload_file(self, file_obj, filename: str, content_type: str = "application/pdf") -> str:
        """
        Uploads a file-like object to GCS.
        Returns the public URL or gs:// path.
        """
        blob = self.bucket.blob(filename)
        
        # Reset file pointer just in case
        file_obj.seek(0)
        
        # Upload from file object
        blob.upload_from_file(file_obj, content_type=content_type)
        
        return blob.name

    def generate_signed_url(self, filename: str, expiration_minutes: int = 60) -> str:
        """
        Generates a temporary signed URL for viewing the file.
        """
        blob = self.bucket.blob(filename)
        
        url = blob.generate_signed_url(
            version="v4",
            expiration=timedelta(minutes=expiration_minutes),
            method="GET",
        )
        return url

# Singleton instance
gcs_service = GCSService()
