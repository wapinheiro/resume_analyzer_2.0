import logging
import os
import sys
from pathlib import Path
import uuid
import contextvars
from logging import Formatter
from typing import Optional

# Context variable to store Request ID
request_id_ctx = contextvars.ContextVar("request_id", default=None)

class RequestIdFilter(logging.Filter):
    """
    Injects request_id into log records.
    """
    def filter(self, record):
        record.request_id = request_id_ctx.get() or "system"
        return True

def configure_logging(level: str = "INFO"):
    """
    Configure global logging with structured format (simplified for now).
    """
    logger = logging.getLogger()
    logger.setLevel(level)

    # Clear existing handlers
    logger.handlers = []

    # Console Handler
    handler = logging.StreamHandler(sys.stdout)
    
    # Format: Time | Level | RequestID | Module | Message
    formatter = Formatter(
        fmt="%(asctime)s | %(levelname)-8s | [%(request_id)s] | %(name)s: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    
    handler.setFormatter(formatter)
    handler.addFilter(RequestIdFilter())
    logger.addHandler(handler)

    # File Handler (app.log)
    LOG_DIR = Path(__file__).parent.parent.parent / "logs"
    LOG_DIR.mkdir(parents=True, exist_ok=True)

    file_handler = logging.FileHandler(LOG_DIR / "app.log")
    file_handler.setFormatter(formatter)
    file_handler.addFilter(RequestIdFilter())
    logger.addHandler(file_handler)
    
    # Silence noisy libraries
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)

def get_request_id() -> Optional[str]:
    return request_id_ctx.get()

def set_request_id(request_id: str):
    request_id_ctx.set(request_id)
