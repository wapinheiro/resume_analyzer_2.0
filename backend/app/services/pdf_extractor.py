import logging
from typing import Optional
from pypdf import PdfReader
from fastapi import UploadFile

logger = logging.getLogger(__name__)

async def extract_text_from_pdf(file: UploadFile) -> str:
    """
    Extracts text from an uploaded PDF file.
    """
    try:
        # pypdf expects a file-like object
        # Handle FastAPI UploadFile (has .file) or generic file-like object
        source_file = file.file if hasattr(file, "file") else file
        pdf = PdfReader(source_file)
        text = ""
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        
        return text.strip()
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {str(e)}")
        raise e
