import chromadb

client = chromadb.PersistentClient(
    path="./chroma_db"
)

collection = client.get_or_create_collection(
    name="papers"
)

collection.add(
    documents=[
        "Artificial Intelligence in Healthcare"
    ],
    ids=["1"]
)

print("Stored Successfully")