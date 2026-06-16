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
cursor.execute("""
CREATE TABLE IF NOT EXISTS ideas(

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    topic TEXT,

    idea TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

)
""")

conn.commit()

conn.close()
