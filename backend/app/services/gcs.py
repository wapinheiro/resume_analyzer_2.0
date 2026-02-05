from google.cloud import storage
from datetime import timedelta
from app.core.config import settings
import os

class GCSService:
    def __init__(self):
        self.client = None
        self.bucket = None
        
        try:
            # Priority 1: JSON String in Environment Variable (Best for Render/Heroku)
            json_creds = os.environ.get("GOOGLE_CREDENTIALS_JSON")
            if json_creds:
                import json
                from google.oauth2 import service_account
                creds_dict = json.loads(json_creds)
                credentials = service_account.Credentials.from_service_account_info(creds_dict)
                self.client = storage.Client(credentials=credentials)
            
            # Priority 2: Key File Path (Standard Local Dev)
            elif settings.GOOGLE_APPLICATION_CREDENTIALS and os.path.exists(settings.GOOGLE_APPLICATION_CREDENTIALS):
                 self.client = storage.Client.from_service_account_json(settings.GOOGLE_APPLICATION_CREDENTIALS)
            
            # Priority 3: Default Environment (Google Metadata Server / Cloud Run default identity)
            else:
                 self.client = storage.Client()
                 
            self.bucket_name = settings.GCS_BUCKET_NAME
            if self.bucket_name:
                self.bucket = self.client.bucket(self.bucket_name)
            else:
                print("Warning: GCS_BUCKET_NAME not set.")

        except Exception as e:
            print(f"GCS Setup Failed: {e}")


    async def upload_file(self, file_obj, filename: str, content_type: str = "application/pdf") -> str:
        """
        Uploads a file-like object to GCS.
        Returns the public URL or gs:// path.
        """
        if not self.bucket:
            raise ValueError("GCS_BUCKET_NAME not configured or GCS connection failed.")

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
