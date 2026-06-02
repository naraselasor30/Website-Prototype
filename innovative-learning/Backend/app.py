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
        SELECT *
        FROM lesson_progress
        WHERE user_id = ?
        AND lesson_name = ?
    """, (
        user_id,
        lesson_name
    ))

    existing = cursor.fetchone()

    if not existing:

        cursor.execute("""
            INSERT INTO lesson_progress
            (user_id, lesson_name)
            VALUES (?, ?)
        """, (
            user_id,
            lesson_name
        ))

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

@app.route("/dashboard/<int:user_id>")
def dashboard(user_id):

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT xp
        FROM users
        WHERE id = ?
    """, (user_id,))

    user = cursor.fetchone()

    cursor.execute("""
        SELECT COUNT(*)
        FROM lesson_progress
        WHERE user_id = ?
    """, (user_id,))

    lessons = cursor.fetchone()[0]

    cursor.execute("""
        SELECT COUNT(DISTINCT quiz_id)
        FROM quiz_results
        WHERE user_id = ?
    """, (user_id,))

    quizzes = cursor.fetchone()[0]

    conn.close()

    return jsonify({
        "xp": user[0],
        "lessons": lessons,
        "quizzes": quizzes
    })

@app.route("/add_xp", methods=["POST"])
def add_xp():

    data = request.get_json()

    user_id = data["userId"]
    xp = data["xp"]

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE users
        SET xp = xp + ?
        WHERE id = ?
    """, (xp, user_id))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True
    })
    
@app.route("/add_activity", methods=["POST"])
def add_activity():

    data = request.get_json()

    user_id = data["userId"]
    activity = data["activity"]

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO activity_logs
        (user_id, activity)
        VALUES (?, ?)
    """, (
        user_id,
        activity
    ))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True
    })
    
@app.route("/activities/<int:user_id>")
def get_activities(user_id):

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT activity
        FROM activity_logs
        WHERE user_id = ?
        ORDER BY id DESC
        LIMIT 10
    """, (user_id,))

    activities = cursor.fetchall()

    conn.close()

    return jsonify([
        activity[0]
        for activity in activities
    ])

@app.route("/save_quiz", methods=["POST"])
def save_quiz():

    data = request.get_json()

    user_id = data["userId"]
    quiz_id = data["quizId"]
    score = data["score"]
    total = data["total"]

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT *
        FROM quiz_results
        WHERE user_id = ?
        AND quiz_id = ?
    """, (
        user_id,
        quiz_id
    ))

    existing = cursor.fetchone()

    if not existing:

        cursor.execute("""
            INSERT INTO quiz_results
            (
                user_id,
                quiz_id,
                score,
                total_questions
            )
            VALUES (?, ?, ?, ?)
        """, (
            user_id,
            quiz_id,
            score,
            total
        ))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True
    })

@app.route("/unlock_achievement", methods=["POST"])
def unlock_achievement():

    data = request.get_json()

    user_id = data["userId"]
    badge_name = data["badge"]

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT *
        FROM achievements
        WHERE user_id = ?
        AND badge_name = ?
    """, (
        user_id,
        badge_name
    ))

    existing = cursor.fetchone()

    if not existing:

        cursor.execute("""
            INSERT INTO achievements
            (
                user_id,
                badge_name
            )
            VALUES (?, ?)
        """, (
            user_id,
            badge_name
        ))

        conn.commit()

    conn.close()

    return jsonify({
        "success": True
    })

@app.route("/achievements/<int:user_id>")
def get_achievements(user_id):

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT badge_name
        FROM achievements
        WHERE user_id = ?
    """, (user_id,))

    achievements = cursor.fetchall()

    conn.close()

    return jsonify([
        achievement[0]
        for achievement in achievements
    ])

if __name__ == "__main__":
    app.run(debug=True)