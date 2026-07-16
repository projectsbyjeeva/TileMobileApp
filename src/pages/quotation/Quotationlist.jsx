import React,{ useState, useEffect,useRef} from "react";
import MainLayout from "../../components/MainLayout";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { Eye, Edit, Download, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';


function Quotationlist() {
  
const [quotations, setQuotations] = useState([]);
const [loading, setLoading] = useState(false);
const [searchText, setSearchText] = useState("");



const hasFetched = useRef(false);


useEffect(() => {

   if (hasFetched.current) return;

  hasFetched.current = true;

  fetchQuotations();

}, []);


const navigate = useNavigate();

const fetchQuotations = () => {

  setLoading(true);

  API.get("/quotation/list")
    .then((res) => {
      if (res.data.status == true) {
        setQuotations(res.data.data);
      }
    })
    .catch(() => {
      alert("Failed to load quotations");
    })
    .finally(() => {
      setLoading(false);
    });
};

const filteredQuotations = quotations.filter((item) => {

  const search  = searchText.toLowerCase();  

  return (

   item.quotation_id?.toString().toLowerCase().includes(search) ||
    item.customer_name?.toString().toLowerCase().includes(search)
  );

});


const deleteQuotation = (id) => {

 Swal.fire({
  title: "Are you sure?",
  text: "Do you want to delete this quotation?",
  icon: "warning",
  showCancelButton: true,
  confirmButtonText: "Yes, delete it!",
  cancelButtonText: "Cancel",

  buttonsStyling: true, 
  heightAuto: false,    

  customClass: {
    popup: "swal-zindex",
    confirmButton: "swal-confirm-btn",
    cancelButton: "swal-cancel-btn"
  }
}).then((result) => {

    if (result.isConfirmed) {

      Swal.fire({
        title: "Deleting...",
        text: "Please wait",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      API.post(`/quotation_main-delete/${id}`)
        .then((res) => {

          if(res.data.status == 'success'){

          
          Swal.fire({
            title: "Deleted!",
            text: "Quotation successfully deleted.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
          });

           fetchQuotations();
        }

        })
        .catch((err) => {

          Swal.fire({
            title: "Error!",
            text: err.response ?.data?.message || 'Error',
            icon: "error"
          });

        });

    }

  });

};
 return (
  <MainLayout title="Quotation">

    {/* 🔷 TOP GRADIENT HEADER */}
    <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-4 rounded-b-3xl shadow-lg">

      {/* SEARCH */}
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
          <Search size={18} className="text-white" />
          <input value={searchText} onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search Customer Name / Quotation No..."
            className="bg-transparent outline-none text-white placeholder-white/70 w-full"
          />
        </div>
      </div>

    </div>


    {/* 📄 LIST */}
    <div className="max-w-md mx-auto mt-4 space-y-4 px-2">

      {loading ? (
        [...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 animate-pulse space-y-3 shadow">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            <div className="h-6 bg-gray-200 rounded w-full"></div>
          </div>
        ))
      ) : filteredQuotations.length > 0 ?  (

        filteredQuotations.map((item) => (
          <motion.div
            key={item.id}
            whileTap={{ scale: 0.97 }}
            className="relative bg-white rounded-2xl p-4 shadow-md border border-gray-100 overflow-hidden"
          >

            {/* 💡 TOP STRIP */}
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>

            {/* HEADER */}
            <div className="flex justify-between pl-2">

              <div>
                <h3 className="font-bold text-gray-800 text-base">
                  {item.quotation_id}
                </h3>

                <p className="font-bold text-xs text-gray-500">
                  {item.customer_name}
                </p>
                 <p className="text-xs text-black-500">
                  {item.mobile_no}
                </p>
              </div>

              <div className="text-right">
                <p className="text-green-600 font-bold">
                  ₹{item.total_amount}
                </p>

                {/* <span className="text-[10px] px-2 py-1 bg-green-100 text-green-700 rounded-full">
                  Active
                </span> */}
              </div>

            </div>

            {/* FOOTER ACTIONS */}
            <div className="flex justify-between items-center mt-4 pl-2">

              <p className="font-bold text-[11px] text-gray-400">
                {item.formatted_entry_date}
              </p>

              <div className="flex gap-2">

                {/* VIEW */}
                <button
                  onClick={() =>
                    window.open(`/quotation/view/${item.quotation_id}`, "_blank")
                  }
                  className="p-2 rounded-full bg-blue-50 text-blue-600"
                >
                  <Eye size={16} />
                </button>

                {/* EDIT */}
                <button
                  onClick={() =>
                    navigate(`/quotationform/edit/${item.quotation_id}`)
                  }
                  className="p-2 rounded-full bg-indigo-50 text-indigo-600"
                >
                  <Edit size={16} />
                </button>

                {/* DOWNLOAD */}
                <button
                  onClick={() =>
                    window.open(
                      `http://localhost:8000/api/quotation/pdf/${item.quotation_id}`,
                      "_blank"
                    )
                  }
                  className="p-2 rounded-full bg-green-50 text-green-600"
                >
                  <Download size={16} />
                </button>

                {/* DELETE */}
                <button
                  onClick={() => deleteQuotation(item.quotation_id)}
                  className="p-2 rounded-full bg-red-50 text-red-600"
                >
                  <Trash2 size={16} />
                </button>

              </div>
            </div>

          </motion.div>
        ))
      ) : (

        <div className="text-center bg-white rounded-2xl p-6 shadow">
            <p className="font-bold text-gray-700">No data found</p>
            <p className="text-sm text-gray-400 mt-1">
              Search customer name or quotation number
            </p>
          </div>
      )}

    </div>


    <button
      onClick={() => navigate("/quotationform")}
      className="fixed bottom-20 right-5 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl flex items-center justify-center"
    >
      <Plus />
    </button>

  </MainLayout>
);

}

export default Quotationlist;