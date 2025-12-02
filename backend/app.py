from flask import Flask, request, jsonify
from flask_cors import CORS
from db_config import get_connection

app = Flask(__name__)
CORS(app)

#  GET all todos
@app.route('/api/todos', methods=['GET'])
def get_todos():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM todos")
    todos = cursor.fetchall()
    conn.close()
    return jsonify(todos)

#  POST create new todo
@app.route('/api/todos', methods=['POST'])
def add_todo():
    data = request.get_json()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO todos (text, completed, due_date, priority) VALUES (%s, %s, %s, %s)",
        (data['text'], data['completed'], data['dueDate'], data['priority'])
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Todo added successfully!"})

#  PUT update todo
@app.route('/api/todos/<int:id>', methods=['PUT'])
def update_todo(id):
    data = request.get_json()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE todos
        SET text=%s, completed=%s, due_date=%s, priority=%s
        WHERE id=%s
    """, (
        data.get('text'),
        data.get('completed', False),
        data.get('dueDate', None),
        data.get('priority', 'Low'),
        id
    ))
    conn.commit()
    conn.close()
    return jsonify({"message": "Todo updated successfully!"})

#  DELETE todo
@app.route('/api/todos/<int:id>', methods=['DELETE'])
def delete_todo(id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM todos WHERE id=%s", (id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Todo deleted successfully!"})

if __name__ == '__main__':
    app.run(debug=True)
