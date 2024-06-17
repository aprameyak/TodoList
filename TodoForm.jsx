
import { useState } from "react";

const TodoForm = ({ existingTodo = {}, updateCallback }) => {
    const [itemTitle, setItemTitle] = useState(existingTodo.itemTitle || "");
    const [itemContent, setItemContent] = useState(existingTodo.itemContent || "");

    const updating = Object.entries(existingTodo).length !== 0

    const onSubmit = async (e) => {
        e.preventDefault()

        const data = {
            itemTitle,
            itemContent,
        }
        const url = "http://127.0.0.1:5000/" + (updating ? `update_todo/${existingTodo.id}` : "create_todo")
        const options = {
            method: updating ? "PATCH" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
        const response = await fetch(url, options)
        if (response.status !== 201 && response.status !== 200) {
            const data = await response.json()
            alert(data.message)
        } else {
            updateCallback()
        }
    }

    return (
        <form onSubmit={onSubmit}>
            <div>
                <label htmlFor="itemTitle">Item Title:</label>
                <input
                    type="text"
                    id="itemTitle"
                    value={itemTitle}
                    onChange={(e) => setItemTitle(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="itemContent">Item Content:</label>
                <input
                    type="text"
                    id="itemContent"
                    value={itemContent}
                    onChange={(e) => setItemContent(e.target.value)}
                />
            </div>
            <button type="submit">{updating ? "Update" : "Create"}</button>
        </form>
    );
};

export default TodoForm
