from backend.gemini_client import model

def extract_relationships(text):

    prompt = f"""

Extract relationships.

Return JSON.

Text:

{text}

"""

    response = model.generate_content(
        prompt
    )

    return response.text

def create_relationship(

    source,

    relation,

    target

):

    with driver.session() as session:

        session.run(

            """

            MERGE (a:Concept {
                name:$source
            })

            MERGE (b:Concept {
                name:$target
            })

            MERGE (a)-[:RELATED]->(b)

            """,

            source=source,

            target=target
        )