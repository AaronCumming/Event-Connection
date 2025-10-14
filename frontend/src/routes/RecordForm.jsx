import React from "react";
import { Form, useNavigation } from "react-router-dom";

export default function RecordForm() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Add a Record</h2>
      <Form method="post" className="flex flex-col gap-3">
        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="value"
          placeholder="Value"
          required
          className="border p-2 rounded"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white p-2 rounded"
        >
          {isSubmitting ? "Saving..." : "Add Record"}
        </button>
      </Form>
    </div>
  );
}
