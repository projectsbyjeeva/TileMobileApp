  import React, { useRef, useEffect, useState } from "react";
  import MainLayout from "../../components/MainLayout";
  import { motion } from "framer-motion";
  import { Plus, Trash2 } from "lucide-react";

import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import API from "../../api/axios";


  function QuotationForm() {

   const navigate = useNavigate();
    
    const [items, setItems] = useState([]);
    const [lineError, setLineError] = useState("");

    const [quotationNo, setQuotationNo] = useState("");
const [screenId, setScreenId] = useState("");

const [loadingItem, setLoadingItem] = useState(false);
const [loadingMain, setLoadingMain] = useState(false);

const [loadingDelete, setLoadingDelete] = useState(false);

const [deletingId, setDeletingId] = useState(null);

  const [form, setForm] = useState({
  customer: "",
  mobile: "",
  address:"",
  tile: "",
  size: "",
  design: "",
  sqft: "",
  rate: "",
  box: "",
  amount: "",
  discount:"",
  gst:"",
  gstamount:"",
  width:"",
  height:"",

  darkLine: "",
  lightLine: "",
  highlightLine: "",

  darkBox:"",
  lightBox:"",
  highlightBox:""
});

    const tileOptions = {
      "Floor Tile": ["2x2", "4x2", "4x4"],
      "Wall Tile": ["2x2", "4x2", "18x10", "18x12"],
      "Bathroom Tile": ["18x12", "2x1"],
      "Kitchen Tile":["18x12","2x1"]
    };

    const boxSqftMap = {
      "2x2": 16,
      "4x2": 32,
      "4x4": 64,
      "18x10": 12,
      "18x12": 15,
      "1x1": 8,
      "2x1": 10,
      // "18x12":9
    };



 

const hasFetched = useRef(false);

useEffect(() => {
  if (hasFetched.current) return;

  hasFetched.current = true;
  getIds();
}, []);

const getIds = () => {
  API.get("/quotation/generate-ids")
    .then((res) => {
      if (res.data.status) {
        setQuotationNo(res.data.quotation_no);
        setScreenId(res.data.screen_id);
      }
    })
    .catch(() => {
      console.log("Error fetching IDs");
    });
};


    
  const handleChange = (e) => {
    const { name, value } = e.target;

    let updated = { ...form, [name]: value };

    let value2 = 0;

    if (updated.tile === "Kitchen Tile" && updated.width && updated.height) {

      let width  = Number(updated.width);
      let height = Number(updated.height);

     let darkLine = height > 8 ? 3 : 2;

      let lightLine = height - darkLine;

    
    if(updated.size === "18x12"){

        value2 = Math.round((width * 12) / 18);
    }  

    else if(updated.size === "2x1"){

         value2 = Math.round((width * 12) / 24);
    }

      let darkTiles = darkLine * value2;
      let lightTiles = lightLine * value2;

      let darkBox = Math.round(darkTiles / 6);
      let lightBox = Math.round(lightTiles / 6);
      let highlightBox = 1;

      let totalBox = darkBox + lightBox + highlightBox;

      updated.darkBox = darkBox;
      updated.lightBox = lightBox;
      updated.highlightBox = highlightBox;
      updated.box = totalBox;

       if(updated.size === "18x12"){
      if (updated.rate) {
        updated.amount = (totalBox * 9 * updated.rate).toFixed(2);
      }
    }

     else if(updated.size === "2x1"){
      if (updated.rate) {
        updated.amount = (totalBox * 10* updated.rate).toFixed(2);
      }
    }

    }

  else if (updated.tile === "Bathroom Tile" && updated.width && updated.height) {

  let width = Number(updated.width);
  let height = Number(updated.height);

  if (name === "height") {
    let dark = 3;
    let remaining = height - dark;

    let light = Math.ceil(remaining / 2);
    let highlight = Math.floor(remaining / 2);

    updated.darkLine = dark;
    updated.lightLine = light;
    updated.highlightLine = highlight;
  }

  let darkLine = Number(updated.darkLine || 0);
  let lightLine = Number(updated.lightLine || 0);
  let highlightLine = Number(updated.highlightLine || 0);

  if (darkLine && lightLine && highlightLine) {

    let totalLine = darkLine + lightLine + highlightLine;

      if (totalLine !== height) {

    alert("Total lines must be equal to height");

    updated.darkLine = "";
    updated.lightLine = "";
    updated.highlightLine = "";

    updated.darkBox = "";
    updated.lightBox = "";
    updated.highlightBox = "";
    updated.box = "";
    updated.amount = "";

    setForm(updated);
    return;
  }


    // if (totalLine > height) {
    //   alert("Total lines cannot exceed height");

    //   updated.darkLine = "";
    //   updated.lightLine = "";
    //   updated.highlightLine = "";

    //   updated.darkBox = "";
    //   updated.lightBox = "";
    //   updated.highlightBox = "";
    //   updated.box = "";
    //   updated.amount = "";

    //   setForm(updated);
    //   return;
    // }
    // else if(totalLine < height && totalLine != height){

    //    alert("Total lines should be equal to  height");

    //   updated.darkLine = "";
    //   updated.lightLine = "";
    //   updated.highlightLine = "";

    //   updated.darkBox = "";
    //   updated.lightBox = "";
    //   updated.highlightBox = "";
    //   updated.box = "";
    //   updated.amount = "";

    //   setForm(updated);
    //   return;
    // }
  }

  let value2;

  if (updated.size === "18x12") {
    value2 = Math.ceil((width * 12) / 18);
  } 
  else if (updated.size === "2x1") {
    value2 = Math.ceil((width * 12) / 24);
  }

  if (!value2) return;

  let darkTiles = darkLine * value2;
  let lightTiles = lightLine * value2;
  let highlightTiles = highlightLine * value2;

  let darkBox = Math.ceil(darkTiles / 6);
  let lightBox = Math.ceil(lightTiles / 6);
  let highlightBox = Math.ceil(highlightTiles / 6);

  let totalBox = darkBox + lightBox + highlightBox;

  updated.darkBox = darkBox;
  updated.lightBox = lightBox;
  updated.highlightBox = highlightBox;
  updated.box = totalBox;

  let boxSqft = updated.size === "18x12" ? 9 : 10;

  if (updated.rate) {
    updated.amount = (totalBox * boxSqft * updated.rate).toFixed(2);
  }
}
  else {
      const sqft = name === "sqft" ? value : form.sqft;
      const rate = name === "rate" ? value : form.rate;
      const size = name === "size" ? value : form.size;
      const box = name === "box" ? value : form.box;

      const boxSqft = boxSqftMap[size];

      if (sqft && size && boxSqft && name !== "box") {
        updated.box = (sqft / boxSqft).toFixed(2);
      }

      if (rate && box && boxSqft) {
        updated.amount = (box * boxSqft * rate).toFixed(2);
      }
    }

    setForm(updated);
  };

  // const addItem = () => {
  //   if (!form.tile || !form.size || !form.rate) return;

  //   setItems([...items, { ...form }]);

  //   setForm({
  //     ...form,
  //     tile: "",
  //     size: "",
  //     design: "",
  //     sqft: "",
  //     rate: "",
  //     box: "",
  //     amount: "",
  //     width: "",
  //     height: "",
  //     darkBox: 0,
  //     lightBox: 0,
  //     highlightBox: 1
  //   });
  // };

const mainsubmit = () => {

  if (!form.customer || !form.mobile || !form.address) {
    alert("Fill all customer details");
    return;
  }

  if (items.length === 0) {
    alert("Add at least one item");
    return;
  }


  setLoadingMain(true); 


  API.post("/quotation/main-submit", {
    quotation_no: quotationNo,
    screen_id: screenId,

    customer: form.customer,
    mobile: form.mobile,
    address: form.address,

    total_amount: total,   

   
  })
  .then((res) => {
    if (res.data.status) {
      alert("Saved Successfully");
      navigate("/quotation");
    }
  })
  .catch(() => {
    alert("Error saving quotation");
  })
   .finally(() => {
    setLoadingMain(false); // stop loader
  });
};





  const addItem = () => {
  if (!form.tile || !form.size || !form.rate) return;

    setLoadingItem(true); // start loader


  API.post("/quotation/add-item", {
    ...form,
    quotation_no: quotationNo,   
    screen_id: screenId          
  })
  .then((res) => {
    if (res.data.status) {

    
setItems(prev => [
  ...prev,
  {
    ...res.data.item,
    tile_line_unique_id: res.data.item.tile_line_unique_id
  }
]);
     
      setForm(prev => ({
        ...prev,
        tile: "",
        size: "",
        design: "",
        sqft: "",
        rate: "",
        box: "",
        amount: "",
        width: "",
        height: "",
        darkLine: "",
        lightLine: "",
        highlightLine: "",
        darkBox: "",
        lightBox: "",
        highlightBox: "",
        tile_line_unique_id:""
      }));
    }
  })
  .catch(() => {
    alert("Error adding item");
  })
   .finally(() => {
    setLoadingItem(false); // stop loader
  });
};

 const resetCalculation = () => ({
  sqft: "",
  box: "",
  amount: "",
  width: "",
  height: "",

  darkLine: "",
  lightLine: "",
  highlightLine: "",

  darkBox: "",
  lightBox: "",
  highlightBox: ""
});

const validateLinesLive = (updated) => {

  let height = Number(updated.height);

  let dark = Number(updated.darkLine || 0);
  let light = Number(updated.lightLine || 0);
  let highlight = Number(updated.highlightLine || 0);

  // only validate if all fields entered
  if (
    updated.darkLine !== "" &&
    updated.lightLine !== "" &&
    updated.highlightLine !== ""
  ) {
    let total = dark + light + highlight;

    if (total > height) {
      setLineError("Total lines cannot exceed height");
    } 
    else if (total < height) {
      setLineError("Total lines must equal height");
    } 
    else {
      setLineError(""); // ✅ valid
    }
  } else {
    setLineError(""); // no error while typing
  }
};

const deleteItem = (item) => {

  const confirmDelete = window.confirm("Are you sure you want to delete this item?");
  if (!confirmDelete) return;

  setDeletingId(item.id); // ✅ FIX HERE

  API.post("/quotation/delete-sublistitem", {
    id: item.id,
    quotation_no: quotationNo,
    screen_id: screenId,
    tile_line_unique_id: item.tile_line_unique_id,
    tile: item.tile,
    size: item.size
  })
  .then((res) => {
    if (res.data.status) {
      setItems(prev => prev.filter(i => i.id !== item.id));
    } else {
      alert("Delete failed");
    }
  })
  .catch(() => {
    alert("Error deleting item");
  })
  .finally(() => {
    setDeletingId(null); // ✅ correct reset
  });
};


const total = items.reduce((sum, i) => sum + Number(i.amount || 0), 0);

    return (
      <MainLayout title="Add Quotation">

        <div className="max-w-md mx-auto space-y-6">

          {/* CUSTOMER */}
          <div className="bg-white rounded-2xl p-5 shadow-md space-y-4">

            <div className="bg-white p-4 rounded-xl shadow mb-4">
  <p className="text-sm text-gray-500">Quotation No</p>
  <p className="font-bold text-indigo-600">{quotationNo}</p>

  <p className="text-sm text-gray-500 mt-2">Screen ID</p>
  <p className="font-bold text-green-600">{screenId}</p>
</div>

            <h3 className="font-semibold text-gray-700">Customer Details</h3>

            <input
              name="customer"
              value={form.customer}
              onChange={handleChange}
              placeholder="Customer Name"
              className="w-full p-3 rounded-lg border border-gray-300 outline-none"
            />

            <input
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="Mobile Number"
              className="w-full p-3 rounded-lg border border-gray-300 outline-none"
            />

         <textarea
  name="address"
  value={form.address}
  onChange={handleChange}   
  placeholder="Address"
  className="w-full p-3 rounded-lg border border-gray-300 outline-none"
/>

          </div>

          {/* TILE DETAILS */}
          <div className="bg-white rounded-2xl p-5 shadow-md space-y-4">

            <h3 className="font-semibold text-gray-700">Tile Details</h3>

            {/* Tile Category */}
            <select
              name="tile"
              value={form.tile}
              onChange={(e) => {
                setForm({
                  ...form,
                  tile: e.target.value,
                  size: "",
                  design: "",
                  rate:"",
                   ...resetCalculation()
                });
              }}
              className="w-full p-3 rounded-lg border border-gray-300 bg-white outline-none"
            >
              <option value="">Select Tile Category</option>
              {Object.keys(tileOptions).map((tile, i) => (
                <option key={i} value={tile}>{tile}</option>
              ))}
            </select>

            {/* Tile Size */}
            <select
              name="size"
              value={form.size}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 bg-white outline-none"
            >
              <option value="">Select Tile Size</option>

              {form.tile &&
                tileOptions[form.tile].map((size, i) => (
                  <option key={i} value={size}>{size}</option>
                ))
              }
            </select>

            {form.size && (
              <input
                name="design"
                value={form.design}
                onChange={handleChange}
                placeholder="Enter Design Name"
                className="w-full p-3 rounded-lg border border-gray-300 outline-none"
              />
            )}


{(form.tile === "Kitchen Tile" || form.tile === "Bathroom Tile") && form.size && (
  <div className="grid grid-cols-2 gap-3">

    <input
      name="width"
      value={form.width}
      onChange={handleChange}
      placeholder="Width"
      className="p-3 border rounded"
    />

    <input
      name="height"
      value={form.height}
      onChange={handleChange}
      placeholder="Height" 
      className="p-3 border rounded"
    />

  </div>
)}
            <div className="grid grid-cols-2 gap-3">

  <div>
    <label className="text-sm text-gray-600">Sq.ft</label>
    <input
      name="sqft"
      value={form.sqft}
      onChange={handleChange}
      placeholder="Enter Sq.ft"
      type="number"
      className="w-full p-3 rounded-lg border border-gray-300 outline-none"
    />
  </div>



  <div>
    <label className="text-sm text-gray-600">Rate (₹ / Sq.ft)</label>
    <input name="rate"  value={form.rate} onChange={handleChange}  placeholder="Enter Rate" type="number"
      className="w-full p-3 rounded-lg border border-gray-300 outline-none"
    />
  </div>

</div>

            <div className="grid grid-cols-2 gap-3">

  <div>
    <label className="text-sm text-gray-600">No. of Boxes</label>
    <input
      name="box"
      value={form.box}
      onChange={handleChange}
    
      
      className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 outline-none"
    />
  </div>

  <div>
    <label className="text-sm text-gray-600">Total Amount (₹)</label>
    <input
      name="amount"
      value={form.amount}
     onChange={handleChange}
      className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 font-semibold outline-none"
    />
  </div>

</div>

            

            {/* Add Button */}
           <motion.button
  whileTap={{ scale: 0.95 }}
  onClick={addItem}
  disabled={loadingItem}
  className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white p-3 rounded-lg"
>
  {loadingItem && (
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  )}
  <Plus size={18} />
  {loadingItem ? "Adding..." : "Add Item"}
</motion.button>

       </div>

   {form.tile === "Kitchen Tile" && form.box > 0 && (
  <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl shadow">
    <h4 className="font-semibold text-indigo-700 mb-2">Kitchen Tile</h4>

    <div className="grid grid-cols-3 text-center gap-2 text-sm">
      <div>
        <p className="text-gray-500">Dark</p>
        <p className="font-bold">{form.darkBox}</p>
      </div>

      <div>
        <p className="text-gray-500">Light</p>
        <p className="font-bold">{form.lightBox}</p>
      </div>

      <div>
        <p className="text-gray-500">Highlight</p>
        <p className="font-bold">{form.highlightBox}</p>
      </div>
    </div>

    <hr className="my-3"/>

    <p className="text-center font-bold text-lg">
      Total: {form.box} Boxes
    </p>
  </div>
)}

{form.tile === "Bathroom Tile" && form.height && (
  <div className="grid grid-cols-3 gap-3">

    <div>
      <label className="text-sm text-gray-600">Dark Line</label>
      <input
        name="darkLine"
        value={form.darkLine}
        onChange={handleChange}
         onInput={(e) => validateLinesLive({ ...form, darkLine: e.target.value })}
        type="number"
        className="w-full p-2 border rounded mt-1"
      />
    </div>

    <div>
      <label className="text-sm text-gray-600">Light Line</label>
      <input
        name="lightLine"
        value={form.lightLine}
        onChange={handleChange}
         onInput={(e) => validateLinesLive({ ...form, lightLine: e.target.value })}
        type="number"
        className="w-full p-2 border rounded mt-1"
      />
    </div>

    <div>
      <label className="text-sm text-gray-600">Highlighter Line</label>
      <input
        name="highlightLine"
        value={form.highlightLine}
        onChange={handleChange}
         onInput={(e) => validateLinesLive({ ...form, highlightLine: e.target.value })}
        type="number"
        className="w-full p-2 border rounded mt-1"
      />
      {lineError && (
  <p className="text-red-500 text-sm mt-1">
    {lineError}
  </p>
)}
    </div>

  </div>
)}
       {form.tile === "Bathroom Tile" && form.box > 0 && (
  <div className="bg-green-50 border border-green-200 p-4 rounded-xl shadow">
    <h4 className="font-semibold text-green-700 mb-2">Bathroom Tile</h4>

    <div className="grid grid-cols-3 text-center gap-2 text-sm">
      <div>
        <p className="text-gray-500">Dark</p>
        <p className="font-bold">{form.darkBox}</p>
      </div>

      <div>
        <p className="text-gray-500">Light</p>
        <p className="font-bold">{form.lightBox}</p>
      </div>

      <div>
        <p className="text-gray-500">Highlight</p>
        <p className="font-bold">{form.highlightBox}</p>
      </div>
    </div>

    <hr className="my-3"/>

    <p className="text-center font-bold text-lg">
      Total: {form.box} Boxes
    </p>
  </div>
)}
          {/* ITEM LIST */}
          <div className="space-y-3">

            {items.map((item, index) => (
              <motion.div
                key={index}
                whileTap={{ scale: 0.97 }}
                className="bg-white rounded-xl p-4 shadow-sm flex justify-between items-center border"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {item.tile} ({item.size})
                  </p>

                  <p className="text-xs text-gray-500">
                    Design: {item.design}
                  </p>

                  <p className="text-xs text-gray-500">
                    {item.sqft} sqft | {item.box} boxes × ₹{item.rate}
                  </p>


                    {/* 🔵 KITCHEN TILE - ONLY BOX DETAILS */}
  {item.tile === "Kitchen Tile" && (
    <div className="mt-2 text-xs text-gray-600 space-y-1">
      <p>🟦 Dark Box: {item.darkBox}</p>
      <p>🟦 Light Box: {item.lightBox}</p>
      <p>🟦 Highlight Box: {item.highlightBox}</p>
    </div>
  )}

  {/* 🟢 BATHROOM TILE - LINE + BOX DETAILS */}
  {item.tile === "Bathroom Tile" && (
    <div className="mt-2 text-xs text-gray-600 space-y-1">
      
      {/* Lines */}
      <p className="font-semibold text-gray-700">Lines:</p>
      <p>🔹 Dark Line: {item.darkLine}</p>
      <p>🔹 Light Line: {item.lightLine}</p>
      <p>🔹 Highlight Line: {item.highlightLine}</p>

      {/* Boxes */}
      <p className="font-semibold text-gray-700 mt-1">Boxes:</p>
      <p>🟢 Dark Box: {item.darkBox}</p>
      <p>🟢 Light Box: {item.lightBox}</p>
      <p>🟢 Highlight Box: {item.highlightBox}</p>
    </div>
               )}
               </div>

               <div className="flex items-center gap-3">
  <p className="text-indigo-600 font-bold">₹{item.amount}</p>

  <div className="relative flex items-center justify-center w-6 h-6">

    {deletingId === item.id ? (
      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
    ) : (
      <Trash2
        size={18}
        className="text-red-500 cursor-pointer"
        onClick={() => deleteItem(item)}
      />
    )}

  </div>
</div>
              </motion.div>
            ))}

          </div>

        {(loadingItem || loadingMain) && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">

    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl px-8 py-6 flex flex-col items-center gap-4">

      {/* Apple Spinner */}
      <div className="relative w-12 h-12">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="absolute w-1.5 h-4 bg-blue-500 rounded-full opacity-0 animate-[fade_1.2s_linear_infinite]"
            style={{
              transform: `rotate(${i * 30}deg) translateY(-18px)`,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>

      {/* Text */}
      <p className="text-sm text-gray-600 font-medium">
        {loadingMain ? "Saving quotation..." : "Adding item..."}
      </p>

    </div>

  </div>
)}


{loadingDelete && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">

    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl px-8 py-6 flex flex-col items-center gap-4">

      <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>

      <p className="text-sm text-gray-600 font-medium">
        Deleting item...
      </p>

    </div>

  </div>
)}

          {/* TOTAL */}
          <div className="bg-white rounded-2xl p-5 shadow-md flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-indigo-600">₹{total}</span>
          </div>

<div className="flex gap-3">
 <button
  onClick={mainsubmit}
  disabled={loadingMain}
  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2"
>
  {loadingMain && (
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  )}
  {loadingMain ? "Saving..." : "Submit"}
</button>

  <button
    onClick={() => navigate("/quotation")}
    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-md text-sm font-medium"
  >
    Back to List
  </button>
</div>

       
        </div>

      </MainLayout>
    );
  }

  const styles = {
  loaderOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
  },


};
  
  export default QuotationForm;