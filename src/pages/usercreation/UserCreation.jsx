import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import API from "../../api/axios";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";

function UserCreate() {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [roles,setRoles]  = useState([]);

  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    status: "",
  });


  useEffect(() => {
    fetchData();
    fetchRoles();
  }, []);



  const fetchData = () => {
    API.get("/user-create")
      .then((res) => setList(res.data))
      .catch(() => Swal.fire("Error", "Failed to load users", "error"));
  };

const fetchRoles = () => {
  API.get("/usertype_get")
    .then((res) => {
      const data = res.data?.data || res.data; // handle both formats
      setRoles(data);
    })
    .catch(() =>
      Swal.fire("Error", "Failed to load roles", "error")
    );
};


  const openAdd = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "",
      status: ""
    });
    setEditId(null);
    setOpen(true);
  };

  const openEdit = (item) => {
  setEditId(item.id);
  setOpen(true);

  // optional: clear form first (loading feel)
  setForm({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    status: ""
  });

  API.get(`/user-create-edit/${item.id}`)
    .then((res) => {
      const data = res.data?.data || res.data;

      console.log("EDIT API DATA:", data);

      setForm({
        name: data.name || "",
        email: data.email_id || "",
        phone: data.mobile_no || "",
        password: data.password || "", // ❗ never fill password
        role: data.user_type ? String(data.user_type) : "",
        status:
          data.is_active !== undefined
            ? String(data.is_active)
            : ""
      });
    })
    .catch(() => {
      Swal.fire("Error", "Failed to load user data", "error");
      setOpen(false);
    });
};

  // const openEdit = (item) => {
  //   setForm({
  //     name: item.name || "",
  //     email: item.email_id || "",
  //     phone: item.mobile_no || "",
  //     password: item.password || "",
  //     role: item.user_type ? String(item.user_type) :  "",
  //     status: item.is_active ? String(item.is_active) : ""
  //   });
  //   setEditId(item.id);
  //   setOpen(true);
  // };

  const handleSave = () => {
  let newErrors = {};

  const phoneRegex = /^[0-9]{10}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  if (!form.name) newErrors.name = "Name is required";

  if (!form.phone) {
    newErrors.phone = "Phone is required";
  } else if (!phoneRegex.test(form.phone)) {
    newErrors.phone = "Phone must be 10 digits";
  }

if (!form.role) newErrors.role = "Role is required";
  if (!form.status) newErrors.status = "Status is required";

  if (form.email && !emailRegex.test(form.email)) {
    newErrors.email = "Invalid email format";
  }

  if (!editId || form.password) {
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(form.password)) {
      newErrors.password =
        "Min 8 chars, 1 uppercase, 1 number, 1 special char";
    }
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  // ✅ clear errors
  setErrors({});

  const request = editId
    ? API.put(`/user-create-update/${editId}`, form)
    : API.post("/user-create-store", form);

 request
  .then((res) => {
    const api = res.data; 

    if (api.status === false && api.message === 'Already') {
      Swal.fire("Error",  "User Already Exists", "error");
      return;
    }

    const newData = api?.data;

    if (editId) {
      setList((prev) =>
        prev.map((item) =>
          item.id === editId ? { ...item, ...form } : item
        )
      );
    } else {
      setList((prev) => [
        {
          id: newData?.id || Date.now(),
          ...form
        },
        ...prev
      ]);
    }

    Swal.fire("Success", api.message || "Saved successfully", "success");
    setOpen(false);
  })
  .catch((err) => {
    Swal.fire("Error", "Server error", "error");
  });
};

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will be deleted!",
      icon: "warning",
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        API.delete(`/user-create-delete/${id}`)
          .then(() => {
            setList((prev) => prev.filter((i) => i.id !== id));
            Swal.fire("Deleted!", "", "success");
          })
          .catch(() => Swal.fire("Error", "Delete failed", "error"));
      }
    });
  };

  return (
    <MainLayout title="Users">
      <div className="p-4 bg-gray-100 min-h-screen pb-24">

        {list.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center bg-white p-3 mb-3 rounded-xl shadow-sm"
          >
            <div>
              <p className="font-semibold text-gray-800">{item.name}</p>
              <p className="text-xs text-gray-500">{item.user_type_name}</p>
              <p className="text-xs text-gray-400">

                {item.status == 1 ? "Active" : "Inactive"}
              </p>
            </div>

            <div className="flex gap-4 text-lg">
              <button
                onClick={() => openEdit(item)}
                className="text-blue-600"
              >
                <FaEdit />
              </button>

              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-500"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}

        {/* ================= FLOATING BUTTON ================= */}
        <button
          onClick={openAdd}
          className="fixed bottom-20 right-6 z-40 bg-blue-600 text-white w-14 h-14 rounded-full text-2xl shadow-lg active:scale-95"
        >
          +
        </button>

        {/* ================= BOTTOM SHEET ================= */}
        {open && (
          <div className="fixed inset-0 z-50 flex flex-col">

            {/* BACKDROP */}
            <div
              className="flex-1 bg-black/50"
              onClick={() => setOpen(false)}
            />

            {/* SHEET */}
            <div className="bg-white rounded-t-3xl flex flex-col h-[85vh]">

              {/* HANDLE */}
              <div className="flex justify-center pt-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
              </div>

              {/* TITLE */}
              <div className="px-4 py-3 border-b">
                <h2 className="text-lg font-semibold">
                  {editId ? "Edit User" : "Add User"}
                </h2>
              </div>


              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">

                <input
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="w-full p-3 border rounded-xl"
                />
                {errors.name && (
  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
)}

                <input
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="w-full p-3 border rounded-xl"
                />

                <input
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  className="w-full p-3 border rounded-xl"
                />
                {errors.phone && (
  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
)}

             <select
  value={form.role}
  onChange={(e) =>
    setForm({ ...form, role: e.target.value })
  }
  className="w-full p-3 border rounded-xl"
>
  <option value="">Select Role</option>

  {roles.map((role) => (
    <option key={role.unique_id} value={role.unique_id}>
      {role.user_type}
    </option>
  ))}
</select>


{errors.role && (
  <p className="text-red-500 text-sm mt-1">{errors.role}</p>
)}
              <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={form.password}
    onChange={(e) =>
      setForm({ ...form, password: e.target.value })
    }
    className="w-full p-3 border rounded-xl pr-12"
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2"
  >
    {showPassword ? "🙈" : "👁"}
  </button>
</div>

{errors.password && (
  <p className="text-red-500 text-sm mt-1">
    {errors.password}
  </p>
)}

                <select
                  value={String(form.status)}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                  className="w-full p-3 border rounded-xl"
                >
                  <option value="">Status</option>
                  <option value="1">Active</option>
                  <option value="2">Inactive</option>
                </select>
                {errors.status && (
  <p className="text-red-500 text-sm mt-1">{errors.status}</p>
)}

              </div>

              {/* FOOTER (FIXED) */}
              <div className="p-4 border-t bg-white space-y-2 sticky bottom-0">

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

export default UserCreate;