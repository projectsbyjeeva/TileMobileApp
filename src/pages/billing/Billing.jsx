  import React, { useState } from "react";
  import MainLayout from "../../components/MainLayout";
  import { motion } from "framer-motion";
  import { Plus, Trash2 } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";


  function BillingForm() {

   const navigate = useNavigate();
    
    const [items, setItems] = useState([]);

  const [form, setForm] = useState({
  customerType: "",
  quotationId: "",
  customer: "", 
  mobile: "",
  address: "",    
  tile: "",
  size: "",
  design: "",
  sqft: "",
  rate: "",
  box: "",
  amount: "",
  discount:"",
  gst:"",
  gstamount:""
});

     const tileOptions = {
      "Floor Tile": ["2x2", "4x2", "4x4"],
      "Wall Tile": ["2x2", "4x2", "18x10", "18x12"],
      "Bathroom Tile": ["1x1", "2x1"]
    };

    const quotationList = [
  {
    id: "QTN001",
    name: "Ravi",
    mobile: "9876543210",
    address: "Madurai"
  },
  {
    id: "QTN002",
    name: "Kumar",
    mobile: "9123456780",
    address: "Salem"
  }
];
  

    
    


  const boxSqftMap = {
      "2x2": 16,
      "4x2": 32,
      "4x4": 64,
      "18x10": 12,
      "18x12": 15,
      "1x1": 8,
      "2x1": 10
    };

  const handleChange = (e) => {
  const { name, value } = e.target;

  let updated = { ...form, [name]: value };

  const sqft = name === "sqft" ? value : form.sqft;
  const rate = name === "rate" ? value : form.rate;
  const size = name === "size" ? value : form.size;
  const box = name === "box" ? value : form.box;
  const discount = name === "discount" ? value : form.discount;
  const gst = name === "gst" ? value : form.gst;

  const boxSqft = boxSqftMap[size];

  if (sqft && size && boxSqft && name !== "box") {
    updated.box = Math.ceil(sqft / boxSqft);
  }

  const finalBox = name === "box" ? value : updated.box || box;

  let baseAmount = 0;
  if (rate && finalBox && boxSqft) {
    baseAmount = finalBox * boxSqft * rate;
  }

  updated.amount = baseAmount.toFixed(2);

  let discountPercent = Number(discount) || 0;
  let discountAmount = (baseAmount * discountPercent) / 100;

  let afterDiscount = baseAmount - discountAmount;

  let gstPercent = Number(gst) || 0;
  let gstAmount = (afterDiscount * gstPercent) / 100;

  let finalAmount = afterDiscount + gstAmount;

  updated.discountAmount = discountAmount.toFixed(2);
  updated.gstamount = gstAmount.toFixed(2);
  updated.finalAmount = finalAmount.toFixed(2);

  setForm(updated);

};

    const addItem = () => {
      if (!form.tile || !form.size || !form.sqft || !form.rate) return;

      setItems([...items, form]);

      setForm({
        ...form,
        tile: "",
        size: "",
        design: "",
        sqft: "",
        rate: "",
        box: "",
        amount: "",
        discount:"",
        gstamount:""
      });
    };

    const deleteItem = (index) => {
      setItems(items.filter((_, i) => i !== index));
    };

const total = items.reduce(
  (sum, i) => sum + Number(i.finalAmount || i.amount || 0),
  0
);



    return (
      <MainLayout title="Add Bill">

        <div className="max-w-md mx-auto space-y-6">

          {/* CUSTOMER */}
            <div className="bg-white rounded-2xl p-5 shadow-md space-y-4">
          <h3 className="font-semibold text-gray-700">Customer Details</h3>

          {/* Customer Type */}
          <select
            value={form.customerType}
            onChange={(e) =>
              setForm({
                ...form,
                customerType: e.target.value,
                quotationId: "",
                customer: "",
                mobile: "",
                address: ""
              })
            }
            className="w-full p-3 rounded-lg border border-gray-300"
          >
            <option value="">Select Customer Type</option>
            <option value="New">New Customer</option>
            <option value="QuoteCustomer">Quote Customer</option>
          </select>

          {/* NEW CUSTOMER */}
          {form.customerType === "New" && (
            <>
              <input
                name="customer"
                value={form.customer}
                onChange={handleChange}
                placeholder="Customer Name"
                className="w-full p-3 border rounded-lg"
              />

              <input
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="Mobile"
                className="w-full p-3 border rounded-lg"
              />

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full p-3 border rounded-lg"
              />
            </>
          )}

          {/* QUOTE CUSTOMER */}
          {form.customerType === "QuoteCustomer" && (
            <>
              <select
                value={form.quotationId}
                onChange={(e) => {
                  const selected = quotationList.find(
                    (q) => q.id === e.target.value
                  );

                  setForm({
                    ...form,
                    quotationId: e.target.value,
                    customer: selected?.name || "",
                    mobile: selected?.mobile || "",
                    address: selected?.address || ""
                  });
                }}
                className="w-full p-3 border rounded-lg"
              >
                <option value="">Select Quotation ID</option>
                {quotationList.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.id}
                  </option>
                ))}
              </select>

              {form.customer && (
                <div className="bg-gray-50 p-3 rounded-lg border text-sm">
                  <p><b>Name:</b> {form.customer}</p>
                  <p><b>Mobile:</b> {form.mobile}</p>
                  <p><b>Address:</b> {form.address}</p>
                </div>
              )}
            </>
          )}
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
                  design: ""
                });
              }}
              className="w-full p-3 rounded-lg border border-gray-300 bg-white outline-none"
            >
              <option value="">Select Tile Category</option>
              {Object.keys(tileOptions).map((tile, i) => (
                <option key={i} value={tile}>{tile}</option>
              ))}
            </select>

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
    <input
      name="rate"
      value={form.rate}
      onChange={handleChange}
      placeholder="Enter Rate"
      type="number"
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

<div className="grid grid-cols-2 gap-3">

  <div>
    <label className="text-sm text-gray-600">Discount</label>
    <input
      name="discount"
      value={form.discount}
      onChange={handleChange}
      
      className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 outline-none"
    />
  </div>

  <div>
    <label className="text-sm text-gray-600">GST %</label>
    <input
      name="gst"
      value={form.gst}
     onChange={handleChange}
      className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 font-semibold outline-none"
    />
  </div>

</div>
  
  <div className="grid grid-cols-2 gap-3">

  <div>
    <label className="text-sm text-gray-600">GST Amount</label>
    <input
      name="gstamount"
      value={form.gstamount}
      onChange={handleChange}
      
      className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 outline-none"
    />
  </div>

 

</div>
            
   
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={addItem}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white p-3 rounded-lg"
            >
              <Plus size={18} /> Add Item
            </motion.button>

       </div>

        
          <div className="space-y-3">

           {items.map((item, index) => (
  <motion.div
    key={index}
    whileTap={{ scale: 0.97 }}
    className="bg-white rounded-xl p-4 shadow-md border space-y-2"
  >
    <div className="flex justify-between">
      <p className="font-semibold text-gray-800">
        {item.tile} ({item.size})
      </p>
      <Trash2
        size={18}
        className="text-red-500 cursor-pointer"
        onClick={() => deleteItem(index)}
      />
    </div>

    <p className="text-xs text-gray-500">
      {item.sqft} sqft | {item.box} boxes × ₹{item.rate}
    </p>

    {/* ✅ BREAKDOWN UI */}
    <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1 border">

      <div className="flex justify-between">
        <span>Base Amount</span>
        <span>₹{item.amount}</span>
      </div>

      {Number(item.discount) > 0 && (
        <div className="flex justify-between text-red-500">
          <span>Discount ({item.discount}%)</span>
          <span>- ₹{item.discountAmount}</span>
        </div>
      )}

      {Number(item.gst) > 0 && (
        <div className="flex justify-between text-green-600">
          <span>GST ({item.gst}%)</span>
          <span>+ ₹{item.gstamount}</span>
        </div>
      )}

      <div className="flex justify-between font-bold border-t pt-1">
        <span>Final</span>
        <span className="text-indigo-600">
          ₹{item.finalAmount}
        </span>
      </div>

    </div>
  </motion.div>
))}
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-md flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-indigo-600">₹{total}</span>
          </div>
<div className="flex gap-3">
  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md text-sm font-medium">
    Save & Close
  </button>

  <button
    onClick={() => navigate("/billinglist")}
    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-md text-sm font-medium"
  >
    Back to List
  </button>
</div>

       
        </div>

      </MainLayout>
    );
  }
  
  export default BillingForm;