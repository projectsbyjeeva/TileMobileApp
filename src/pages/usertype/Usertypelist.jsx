import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import API from "../../api/axios";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";

function UserTypeMobile() {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    user_type: "",
    status: ""
  });

  // ================= FETCH LIST =================
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    API.get("/user-types")
      .then((res) => setList(res.data))
      .catch(() => {
        Swal.fire("Error", "Failed to load data", "error");
      });
  };

  // ================= OPEN ADD =================
  const openAdd = () => {
    setForm({ user_type: "", status: "" });
    setEditId(null);
    setOpen(true);
  };

  // ================= OPEN EDIT =================
  const openEdit = (item) => {
    setForm({
      user_type: item.user_type,
      status: item.is_active
    });
    setEditId(item.id);
    setOpen(true);
  };

  // ================= SAVE =================
  const handleSave = () => {
    if (!form.user_type) {
      Swal.fire("Warning", "User Type required", "warning");
      return;
    }

    if (!form.status) {
      Swal.fire("Warning", "Status required", "warning");
      return;
    }

    const request = editId
      ? API.put(`/user-type-update/${editId}`, {
          user_type: form.user_type,
          status: form.status
        })
      : API.post("/user-type-store", form);

    request.then((res) => {
      const newData = res?.data?.data;

      if (editId) {
        setList((prev) =>
          prev.map((item) =>
            item.id === editId
              ? { ...item, user_type: form.user_type, is_active: form.status }
              : item
          )
        );
      } else {
        setList((prev) => [
          {
            id: newData?.id || Date.now(),
            user_type: form.user_type,
            is_active: form.status
          },
          ...prev
        ]);
      }

      Swal.fire("Success", "Saved successfully", "success");
      setOpen(false);
    });
  };

  // ================= DELETE =================
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        API.delete(`/user-types/${id}`)
          .then(() => {
            setList((prev) => prev.filter((item) => item.id !== id));
            Swal.fire("Deleted!", "Record removed", "success");
          })
          .catch(() => {
            Swal.fire("Error", "Delete failed", "error");
          });
      }
    });
  };

  return (
    <MainLayout title="User Types">

      <div className="p-4 bg-gray-100 min-h-screen">

        {/* LIST */}
        {list.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center bg-white p-3 mb-3 rounded-xl shadow-sm"
          >
            <div>
              <p className="font-semibold text-gray-800">
                {item.user_type}
              </p>
              <p className="text-xs text-gray-500">
                {item.is_active == 1 ? "Active" : "Inactive"}
              </p>
            </div>

            <div className="flex gap-4 text-lg">
              <button
                onClick={() => openEdit(item)}
                className="text-blue-600 active:scale-95"
              >
                <FaEdit />
              </button>

              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-500 active:scale-95"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}

        {/* FLOATING BUTTON */}
        <button
          onClick={openAdd}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-14 h-14 rounded-full text-2xl shadow-lg active:scale-95"
        >
          +
        </button>
{open && (
  <div className="fixed inset-0 z-50 flex flex-col">

    {/* BACKDROP */}
    <div
      className="flex-1 bg-black/50"
      onClick={() => setOpen(false)}
    />

    {/* SHEET */}
    <div className="bg-white rounded-t-3xl flex flex-col max-h-[85vh]">

      {/* HANDLE */}
      <div className="flex justify-center pt-2">
        <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
      </div>

      {/* TITLE */}
      <div className="px-4 py-3 border-b">
        <h2 className="text-lg font-semibold">
          {editId ? "Edit User Type" : "Add User Type"}
        </h2>
      </div>

      {/* SCROLL AREA */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        
        <label className="text-sm text-gray-600">User Type</label>
        <input
          value={form.user_type}
          onChange={(e) =>
            setForm({ ...form, user_type: e.target.value })
          }
          className="w-full mt-1 mb-4 p-3 border rounded-xl"
          placeholder="Enter user type"
        />

        <label className="text-sm text-gray-600">Status</label>
        <select
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value })
          }
          className="w-full mt-1 p-3 border rounded-xl"
        >
          <option value="">Select Status</option>
          <option value="1">Active</option>
          <option value="2">Inactive</option>
        </select>

      </div>

      {/* FOOTER (FIXED SAFE AREA) */}
      <div className="p-4 border-t bg-white space-y-2 pb-6">

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white p-3 rounded-xl font-semibold"
        >
          {editId ? "Update" : "Save"}
        </button>

        <button
          onClick={() => setOpen(false)}
          className="w-full bg-gray-200 text-gray-700 p-3 rounded-xl"
        >
          Cancel
        </button>

      </div>

    </div>
  </div>
)}

      </div>

    </MainLayout>
  );
}

export default UserTypeMobile;