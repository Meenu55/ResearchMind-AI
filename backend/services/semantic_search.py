from vector_store.chroma_manager import (
    collection
)

from backend.services.embedding_service import (
    generate_embedding
)

def semantic_search(query):

    embedding = generate_embedding(
        query
    )

    results = collection.query(

        query_embeddings=[
            embedding
        ],

        n_results=5
    )

    return results