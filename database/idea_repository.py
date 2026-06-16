import sqlite3


def save_idea(
    topic,
    idea
):

    conn = sqlite3.connect(
        "researchmind.db"
    )

    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO ideas(
            topic,
            idea
        )

        VALUES(
            ?,
            ?
        )
        """,
        (
            topic,
            idea
        )
    )

    conn.commit()

    conn.close()

def get_all_ideas():

    conn = sqlite3.connect(
        "researchmind.db"
    )

    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT *
        FROM ideas
        ORDER BY created_at DESC
        """
    )

    ideas = cursor.fetchall()

    conn.close()

    return ideas