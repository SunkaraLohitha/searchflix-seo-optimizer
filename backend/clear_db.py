import sqlite3
import os

print(os.path.abspath("seo_analysis.db"))
# Replace this path with the full path printed by your Flask app
db_path = r"E:\seo-optimizer\seo_analysis.db"

conn = sqlite3.connect(db_path)
cursor = conn.cursor()



# Delete all records from analysis table
cursor.execute("DELETE FROM analysis;")
conn.commit()

print("All records deleted from analysis table.")

conn.close()






