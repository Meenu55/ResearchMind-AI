import sqlite3

def save_query(query):

    conn = sqlite3.connect(
        "researchmind.db"
    )

    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO searches(query)
        VALUES(?)
        """,
        (query,)
    )

    conn.commit()

    conn.close()