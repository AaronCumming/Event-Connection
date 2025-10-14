import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";

import App from "./App";
import RecordList from "./routes/RecordList";
import RecordForm from "./routes/RecordForm";

// Backend API base URL
const API_BASE = "http://127.0.0.1:8000/api/records/";

// Define routes with loaders and actions
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <RecordList />,
        loader: async () => {
          const res = await fetch(API_BASE);
          if (!res.ok) throw new Error("Failed to load records");
          return res.json();
        },
      },
      {
        path: "add",
        element: <RecordForm />,
        action: async ({ request }) => {
          const formData = await request.formData();
          const name = formData.get("name");
          const value = formData.get("value");

          const res = await fetch(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, value: Number(value) }),
          });

          if (!res.ok) throw new Error("Failed to create record");
          return redirect("/"); // Navigate after success
        },
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
