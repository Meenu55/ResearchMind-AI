from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File

router = APIRouter()

@router.post("/upload")

async def upload_pdf(
    file: UploadFile = File(...)
):

    path = f"uploads/{file.filename}"

    with open(path, "wb") as f:

        content = await file.read()

        f.write(content)

    return {
        "file_path": path
    }