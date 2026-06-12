import sqlite3

conn = sqlite3.connect(
    "researchmind.db"
)

cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS papers(
id INTEGER PRIMARY KEY,
title TEXT,
authors TEXT,
abstract TEXT
)
""")

conn.commit()

conn.close()