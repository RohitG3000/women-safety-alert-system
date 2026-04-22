from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="appuser",
        password="1234",
        database="women_safety",
        auth_plugin='mysql_native_password'
    )


# CREATE ALERT + LOCATION LOG
@app.route('/alert', methods=['POST'])
def create_alert():
    data = request.json
    name = data['name']

    # get location safely
    latitude = data.get('latitude', None)
    longitude = data.get('longitude', None)

    db = get_db()
    cursor = db.cursor()

    # check if user exists
    cursor.execute("SELECT user_id FROM Users WHERE full_name=%s", (name,))
    result = cursor.fetchone()

    if result:
        user_id = result[0]
    else:
        cursor.execute(
            "INSERT INTO Users (full_name) VALUES (%s)",
            (name,)
        )
        db.commit()
        user_id = cursor.lastrowid

    # insert alert
    cursor.execute(
        "INSERT INTO Emergency_Alerts (user_id, status) VALUES (%s, 'RAISED')",
        (user_id,)
    )
    db.commit()

    alert_id = cursor.lastrowid

    # insert into Location_Log ALWAYS
    cursor.execute(
        "INSERT INTO Location_Log (alert_id, latitude, longitude) VALUES (%s, %s, %s)",
        (alert_id, latitude, longitude)
    )
    db.commit()

    db.close()

    return jsonify({"message": "Alert created"})


# GET ALERTS (WITH USER NAME + LOCATION)
@app.route('/alerts', methods=['GET'])
def get_alerts():
    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
        SELECT ea.alert_id, u.full_name, ea.status,
            DATE_ADD(ea.alert_time, INTERVAL 330 MINUTE),
            ll.latitude, ll.longitude
        FROM Emergency_Alerts ea
        JOIN Users u ON ea.user_id = u.user_id
        LEFT JOIN Location_Log ll ON ea.alert_id = ll.alert_id
        ORDER BY ea.alert_time DESC
    """)

    data = cursor.fetchall()
    db.close()

    return jsonify(data)


# RESOLVE ALERT
@app.route('/resolve/<int:alert_id>', methods=['POST'])
def resolve_alert(alert_id):
    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        "UPDATE Emergency_Alerts SET status='RESOLVED' WHERE alert_id=%s",
        (alert_id,)
    )

    db.commit()
    db.close()

    return jsonify({"message": "Resolved"})


app.run(debug=True)