import sqlite3
import os
# Connect to the DB
conn = sqlite3.connect(r"E:\seo-optimizer\seo_analysis.db")
print(os.path.abspath("seo_analysis.db"))
cursor = conn.cursor()

# List all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
print("Tables:", tables)

# Show content from 'analysis' table
print("\nAnalysis Table Content:")
for row in cursor.execute("SELECT * FROM analysis;"):
    print(row)

conn.close()
