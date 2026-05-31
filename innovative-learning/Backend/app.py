from flask import Flask, request, jsonify
import sqlite3
import os

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "..", "Database", "users.db")


@app.route("/")
def home():
    return "Innovative Learning Backend Running!"


@app.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    first_name = data["firstName"]
    last_name = data["lastName"]
    username = data["username"]
    password = data["password"]

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    try:
        cursor.execute("""
            INSERT INTO users
            (first_name, last_name, username, password)
            VALUES (?, ?, ?, ?)
        """, (
            first_name,
            last_name,
            username,
            password
        ))

        conn.commit()

        return jsonify({
            "success": True,
            "message": "Account created successfully"
        })

    except sqlite3.IntegrityError:

        return jsonify({
            "success": False,
            "message": "Username already exists"
        })

    finally:
        conn.close()


if __name__ == "__main__":
    app.run(debug=True)