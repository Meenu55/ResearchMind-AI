import chromadb

client = chromadb.PersistentClient(
    path="vector_store/chroma_db"
)

collection = client.get_or_create_collection(
    name="research_papers"
)