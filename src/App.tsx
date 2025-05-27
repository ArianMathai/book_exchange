import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const client = generateClient<Schema>();

function App() {
    const { signOut, user } = useAuthenticator();
    const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

    useEffect(() => {
        client.models.Todo.observeQuery().subscribe({
            next: (data) => setTodos([...data.items]),
        });
    }, []);

    function createTodo() {
        const content = window.prompt("Todo content");
        if (content) {
            client.models.Todo.create({ content });
        }
    }

    function deleteTodo(id: string) {
        client.models.Todo.delete({ id });
    }

    return (
        <main className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
            <div className="max-w-2xl w-full">
                <h1 className="text-3xl font-bold text-blue-600 mb-6">
                    {user?.signInDetails?.loginId || 'Guest'}'s Todos
                </h1>
                <button
                    onClick={createTodo}
                    className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                >
                    + New Todo
                </button>
                <ul className="space-y-2">
                    {todos.map((todo) => (
                        <li
                            key={todo.id}
                            onClick={() => deleteTodo(todo.id)}
                            className="p-3 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-50 transition duration-150"
                        >
                            {todo.content}
                        </li>
                    ))}
                </ul>
                <div className="mt-6 text-gray-600">
                    🥳 App successfully hosted. Try creating a new todo.
                    <br />
                    <a
                        href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates"
                        className="text-blue-500 hover:underline"
                    >
                        Review next step of this tutorial.
                    </a>
                </div>
                <button
                    onClick={signOut}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                >
                    Sign Out
                </button>
            </div>
        </main>
    );
}

export default App;