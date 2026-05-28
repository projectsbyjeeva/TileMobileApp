const addItem = () => {

  // ✅ FIX: correct condition (Other not others)
  if (form.tile !== "Other") {
    if (!form.tile || !form.size || !form.rate) return;
  } else {
    // ✅ validation for Other
    if (!form.productName || !form.qty || !form.rate) {
      alert("Fill Product Name, Qty, Rate");
      return;
    }
  }

  setLoadingItem(true);

  // ✅ DIFFERENT PAYLOAD BASED ON TILE
  let payload = {};

  if (form.tile === "Other") {
    payload = {
      quotation_no: quotationNo,
      screen_id: screenId,
      tile: "Other",
      product_name: form.productName,
      qty: form.qty,
      rate: form.rate,
      amount: form.amount
    };
  } else {
    payload = {
      ...form,
      quotation_no: quotationNo,
      screen_id: screenId
    };
  }

  API.post("/quotation/add-item", payload)
    .then((res) => {
      if (res.data.status) {

        setItems(prev => [
          ...prev,
          {
            ...res.data.item,
            tile_line_unique_id: res.data.item.tile_line_unique_id
          }
        ]);

        // ✅ RESET FORM CLEANLY
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
          productName: "",
          qty: "",
          tile_line_unique_id: ""
        }));
      }
    })
    .catch(() => {
      alert("Error adding item");
    })
    .finally(() => {
      setLoadingItem(false);
    });
};