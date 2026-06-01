from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

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

@app.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    username = data["username"]
    password = data["password"]

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT *
        FROM users
        WHERE username = ?
        AND password = ?
    """, (username, password))

    user = cursor.fetchone()

    conn.close()

    if user:

        return jsonify({
            "success": True,
            "user": {
                "id": user[0],
                "firstName": user[1],
                "lastName": user[2],
                "username": user[3],
                "xp": user[5],
                "progress": user[6]
            }
        })

    return jsonify({
        "success": False,
        "message": "Invalid username or password"
    })
    

@app.route("/complete_lesson", methods=["POST"])
def complete_lesson():

    data = request.get_json()

    user_id = data["userId"]
    lesson_name = data["lessonName"]

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO lesson_progress
        (user_id, lesson_name)
        VALUES (?, ?)
    """, (user_id, lesson_name))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True
    })

@app.route("/progress/<int:user_id>")
def get_progress(user_id):

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT COUNT(*)
        FROM lesson_progress
        WHERE user_id = ?
    """, (user_id,))

    completed = cursor.fetchone()[0]

    conn.close()

    return jsonify({
        "completedLessons": completed
    })

@app.route("/lessons/<category>")
def get_lessons(category):

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id,
            lesson_title,
            lesson_file
        FROM lessons
        WHERE category = ?
    """, (category,))

    lessons = cursor.fetchall()

    conn.close()

    result = []

    for lesson in lessons:
        result.append({
            "id": lesson[0],
            "title": lesson[1],
            "file": lesson[2]
        })

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)