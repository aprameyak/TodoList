
from flask import request, jsonify
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mydatabase.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    item_title = db.Column(db.String(80), unique=False, nullable=False)
    item_content = db.Column(db.String(80), unique=False, nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "itemTitle": self.item_title,
            "itemContent": self.item_content,
        }
@app.route("/todo", methods=["GET"])
def get_todo():
    todo = Todo.query.all()
    json_todo = list(map(lambda x: x.to_json(), todo))
    return jsonify({"todo": json_todo})


@app.route("/create_todo", methods=["POST"])
def create_todo():
    item_title = request.json.get("itemTitle")
    item_content = request.json.get("itemContent")

    if not item_title or not item_content:
        return (
            jsonify({"message": "You must include an todo item"}),
            400,
        )

    new_todo = Todo(item_title=item_title, item_content=item_content)
    try:
        db.session.add(new_todo)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400

    return jsonify({"message": "Item created!"}), 201


@app.route("/update_todo/<int:todo_id>", methods=["PATCH"])
def update_todo(todo_id):
    todo = Todo.query.get(todo_id)

    if not todo:
        return jsonify({"message": "User not found"}), 404

    data = request.json
    todo.item_title = data.get("itemTitle", todo.item_title)
    todo.item_content = data.get("itemContent", todo.item_content)
   
    db.session.commit()

    return jsonify({"message": "Todo updated."}), 200


@app.route("/delete_todo/<int:todo_id>", methods=["DELETE"])
def delete_todo(todo_id):
    todo = Todo.query.get(todo_id)

    if not todo:
        return jsonify({"message": "Todo not found"}), 404

    db.session.delete(todo)
    db.session.commit()

    return jsonify({"message": "Todo deleted!"}), 200


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)
