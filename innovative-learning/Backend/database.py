import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "..", "Database", "users.db")

def initialize_database():

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # =========================================
    # USERS TABLE
    # =========================================

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        xp INTEGER DEFAULT 0,
        progress INTEGER DEFAULT 0
    )
    """)

    # =========================================
    # LESSON PROGRESS TABLE
    # =========================================

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS lesson_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        lesson_name TEXT NOT NULL
    )
    """)

    # =========================================
    # LESSONS TABLE
    # =========================================

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS lessons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        lesson_title TEXT NOT NULL,
        lesson_file TEXT NOT NULL
    )
    """)

    # =========================================
    # QUIZZES TABLE
    # =========================================

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS quizzes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        quiz_title TEXT NOT NULL
    )
    """)

    # =========================================
    # QUIZ QUESTIONS TABLE
    # =========================================

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS quiz_questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quiz_id INTEGER NOT NULL,
        question TEXT NOT NULL,
        choice_a TEXT NOT NULL,
        choice_b TEXT NOT NULL,
        choice_c TEXT NOT NULL,
        choice_d TEXT NOT NULL,
        correct_answer TEXT NOT NULL
    )
    """)

    # =========================================
    # QUIZ RESULTS TABLE
    # =========================================

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS quiz_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        quiz_id INTEGER NOT NULL,
        score INTEGER NOT NULL,
        total_questions INTEGER NOT NULL
    )
    """)

    # =========================================
    # DEFAULT LESSONS
    # =========================================

    cursor.execute("SELECT COUNT(*) FROM lessons")

    if cursor.fetchone()[0] == 0:

        lessons = [

            # HTML

            ("HTML", "Introduction to HTML", "HTML/introduction_to_html.json"),
            ("HTML", "Understanding Web Pages", "HTML/understanding_web_pages.json"),
            ("HTML", "HTML Document Structure", "HTML/html_document_structure.json"),
            ("HTML", "HTML Tags and Elements", "HTML/html_tags_and_elements.json"),
            ("HTML", "Headings and Paragraphs", "HTML/headings_and_paragraphs.json"),
            ("HTML", "Text Formatting", "HTML/text_formatting.json"),
            ("HTML", "Lists in HTML", "HTML/lists_in_html.json"),
            ("HTML", "Links and Hyperlinks", "HTML/links_and_hyperlinks.json"),
            ("HTML", "Images in HTML", "HTML/images_in_html.json"),
            ("HTML", "Tables Basics", "HTML/tables_basics.json"),
            ("HTML", "Forms Introduction", "HTML/forms_introduction.json"),
            ("HTML", "Input Types", "HTML/input_types.json"),
            ("HTML", "Labels and Buttons", "HTML/labels_and_buttons.json"),
            ("HTML", "Semantic HTML", "HTML/semantic_html.json"),
            ("HTML", "Div and Span Elements", "HTML/div_and_span_elements.json"),
            ("HTML", "Audio and Video", "HTML/audio_and_video.json"),
            ("HTML", "HTML Entities", "HTML/html_entities.json"),
            ("HTML", "Embedding Content", "HTML/embedding_content.json"),
            ("HTML", "Accessibility Basics", "HTML/accessibility_basics.json"),
            ("HTML", "HTML Mini Project", "HTML/html_mini_project.json"),

            # CSS

            ("CSS", "Introduction to CSS", "CSS/introduction_to_css.json"),
            ("CSS", "CSS Syntax", "CSS/css_syntax.json"),
            ("CSS", "Selectors", "CSS/selectors.json"),
            ("CSS", "Colors and Backgrounds", "CSS/colors_and_backgrounds.json"),
            ("CSS", "Text Styling", "CSS/text_styling.json"),
            ("CSS", "Fonts and Typography", "CSS/fonts_and_typography.json"),
            ("CSS", "Box Model", "CSS/box_model.json"),
            ("CSS", "Margins and Padding", "CSS/margins_and_padding.json"),
            ("CSS", "Borders and Shadows", "CSS/borders_and_shadows.json"),
            ("CSS", "Width and Height", "CSS/width_and_height.json"),
            ("CSS", "Display Property", "CSS/display_property.json"),
            ("CSS", "Positioning Elements", "CSS/positioning_elements.json"),
            ("CSS", "Flexbox Basics", "CSS/flexbox_basics.json"),
            ("CSS", "CSS Grid Basics", "CSS/css_grid_basics.json"),
            ("CSS", "Responsive Design Project", "CSS/responsive_design_project.json"),

            # JAVASCRIPT

            ("JS", "Introduction to JavaScript", "JS/introduction_to_javascript.json"),
            ("JS", "Variables and Data Types", "JS/variables_and_data_types.json"),
            ("JS", "Operators", "JS/operators.json"),
            ("JS", "User Input", "JS/user_input.json"),
            ("JS", "Conditional Statements", "JS/conditional_statements.json"),
            ("JS", "Comparison Operators", "JS/comparison_operators.json"),
            ("JS", "Loops Basics", "JS/loops_basics.json"),
            ("JS", "Functions", "JS/functions.json"),
            ("JS", "Scope and Variables", "JS/scope_and_variables.json"),
            ("JS", "Arrays", "JS/arrays.json"),
            ("JS", "Objects", "JS/objects.json"),
            ("JS", "DOM Introduction", "JS/dom_introduction.json"),
            ("JS", "Event Handling", "JS/event_handling.json"),
            ("JS", "Form Validation", "JS/form_validation.json"),
            ("JS", "JavaScript Mini Project", "JS/javascript_mini_project.json")
        ]

        cursor.executemany("""
        INSERT INTO lessons
        (category, lesson_title, lesson_file)
        VALUES (?, ?, ?)
        """, lessons)

    conn.commit()
    conn.close()

    print("Database initialized successfully!")

