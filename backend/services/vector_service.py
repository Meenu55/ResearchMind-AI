from vector_store.chroma_manager import collection

from backend.services.embedding_service import (
    generate_embedding
)


def store_paper(
    paper_id,
    title,
    abstract
):

    text = (
        title +
        "\n" +
        abstract
    )

    embedding = generate_embedding(
        text
    )

    collection.add(

        ids=[paper_id],

        embeddings=[
            embedding
        ],

        documents=[
            text
        ],

        metadatas=[
            {
                "title": title
            }
        ]
    )