import React from "react"

const Todo = ({ todos, updateTodo, updateCallback }) => {
    const onDelete = async (id) => {
        try {
            const options = {
                method: "DELETE"
            }
            const response = await fetch(`http://127.0.0.1:5000/delete_todo/${id}`, options)
            if (response.status === 200) {
                updateCallback()
            } else {
                console.error("Failed to delete")
            }
        } catch (error) {
            alert(error)
        }
    }

    return <div>
        <h2>Todos</h2>
        <table>
            <thead>
                <tr>
                    <th>Item Title</th>
                    <th>Item Content</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {todos.map((todo) => (
                    <tr key={todo.id}>
                        <td>{todo.itemTitle}</td>
                        <td>{todo.itemContent}</td>
                        <td>
                            <button onClick={() => updateContact(todo)}>Update</button>
                            <button onClick={() => onDelete(todo.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}

export default Todo