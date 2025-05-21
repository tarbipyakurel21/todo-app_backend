
# Todo App Backend

This is the backend for a simple todo application. It provides an API for managing todos, allowing you to create, read, update, and delete them.

## Features

* **CRUD operations:** Create, read, update, and delete todos.
* **RESTful API:** Uses a RESTful architecture for communication.
* **Render Deployment:** The backend is deployed on Render.https://todo-app-backend-2c33.onrender.com/

## Technologies Used

* [Node.js](https://nodejs.org/):  JavaScript runtime environment.
* [Express.js](https://expressjs.com/):  Web framework for Node.js.
* [MongoDB](https://www.mongodb.com/): Database.
* [Mongoose](https://mongoosejs.com/): MongoDB object modeling.
* [Vercel](https://vercel.com/):  Cloud platform for deployment.

##  Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/tarbipyakurel21/todo-app_backend.git](https://github.com/tarbipyakurel21/todo-app_backend.git)
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd todo-app_backend
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Set up environment variables:**
    * Create a `.env` file in the project root.
    * Add the following environment variable, replacing `<Your_MongoDB_URI>` with your MongoDB connection string:
        ```
        MONGODB_URI=<Your_MongoDB_URI>
        ```

5.  **Run the application locally:**
    ```bash
    npm run dev
    ```
    The server will start at http://localhost:3000

## API Endpoints

* `GET /`:  Welcome message.
* `GET /todos`:  Get all todos.
* `GET /todos/:id`: Get a single todo by ID.
* `POST /todos`:  Create a new todo.
* `PUT /todos/:id`:  Update an existing todo.
* `DELETE /todos/:id`: Delete a todo.

## Deployment

The backend is deployed on Vercel.  Any push to the main branch will automatically deploy the latest changes.

##  Important Notes

* Ensure you have MongoDB set up and running, and that the `MONGODB_URI` in your `.env` file is correct.
* The application uses port 3000 by default.

"""

