import mysql.connector

def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="appuser",
        password="1234",
        database="women_safety"
    )