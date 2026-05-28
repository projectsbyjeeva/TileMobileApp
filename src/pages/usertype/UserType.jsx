import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import API from "../../api/axios";



function UserType() {
  const navigate = useNavigate();

  const { id } = useParams();


  const [form, setForm] = useState({
    user_type: "",
    status: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (id) {
      API.get(`/user-type-get/${id}`).then((res) => {
        setForm({
  user_type: res.data.user_type,
  status: res.data.is_active
});
      });
    }
  }, [id]);


const handleSave = () => {
  // VALIDATION
  if (!form.user_type) {
    Swal.fire({
      icon: "warning",
      title: "User Type Required",
      text: "Please enter user type"
    });
    return;
  }

 if (!form.status) {
  Swal.fire({
    icon: "warning",
    title: "Status Required",
    text: "Please select status"
  });
  return;
}

  // API CALL
  const request = id
    ? API.put(`/user-type-update/${id}`, form)
    : API.post("/user-type-store", form);

  request
    .then((res) => {
      const data = res.data;

    
      if (data.status === false) {
        Swal.fire({
          icon: "warning",
          title: "Already Exists",
          text: data.message
        });
        return;
      }

    
      Swal.fire({
        icon: "success",
        title: id ? "Updated!" : "Created!",
        text: data.message,
        timer: 1500,
        showConfirmButton: false
      });

      navigate("/usertypelist");
    })
    .catch(() => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong"
      });
    });
};

  return (
    <MainLayout title="User Type Form">

      <div className="max-w-md mx-auto space-y-4">

        {/* USER TYPE */}
        <div className="bg-white rounded-2xl p-5 shadow-md space-y-3">

          <div>
            <label className="text-sm text-gray-600">User Type</label>
            <input
              name="user_type"
              value={form.user_type}
              onChange={handleChange}
              placeholder="Enter User Type"
              className="w-full p-3 border rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg outline-none"
            >
              <option value="">Select Status</option>
              <option value="1">Active</option>
              <option value="2">Inactive</option>
            </select>
          </div>

         
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg"
            >
             {id ? "Update" : "Save"}
            </button>

            <button
              onClick={() => navigate("/usertypelist")}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>

        </div>

      </div>

    </MainLayout>
  );
}

export default UserType;