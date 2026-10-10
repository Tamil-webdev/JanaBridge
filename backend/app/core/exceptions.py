from fastapi import Request
from fastapi.responses import JSONResponse
import uuid

class BaseAppException(Exception):
    def __init__(self, code: str, message: str, status_code: int = 500):
        self.code = code
        self.message = message
        self.status_code = status_code

async def custom_exception_handler(request: Request, exc: BaseAppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "request_id": str(uuid.uuid4()) # Ideally should be generated per request
            }
        }
    )
