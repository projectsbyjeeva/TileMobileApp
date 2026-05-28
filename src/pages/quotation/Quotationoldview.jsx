import React, { useEffect, useState } from "react";
import { ArrowLeft, Download, Share2, Printer } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

function QuotationView() {
  const { quotationId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadType, setDownloadType] = useState("pdf");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    API.get(`/quotation-view/${quotationId}`).then((res) => {
      if (res.data.status === true) {
        setData(res.data.data);
      }
    });
  };

  if (!data) return <div className="p-4">Loading...</div>;

  const otherItems = data.items.filter(
  (item) => item.tile_categ === "Other"
);

const tileItems = data.items.filter(
  (item) => item.tile_categ !== "Other"
);

  const total = data.items.reduce((s, i) => s + Number(i.amount || 0), 0);

  const handleDownload = async () => {


// this is canva
//    if (downloadType === "pdf") {

//   const noPrintElements = document.querySelectorAll(".no-print");

//   // ❌ Hide buttons
//   noPrintElements.forEach(el => el.style.display = "none");

//   const input = document.getElementById("print-area");

//   const canvas = await html2canvas(input, {
//     scale: 2,
//     useCORS: true,
//   });

//   const imgData = canvas.toDataURL("image/png");

//   const pdf = new jsPDF("p", "mm", "a4");

//   const pdfWidth = pdf.internal.pageSize.getWidth();
//   const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//   pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

//   pdf.save(`${data.quotation_no}.pdf`);

//   // ✅ Show buttons again
//   noPrintElements.forEach(el => el.style.display = "block");
// }

// if (downloadType === "pdf") {
//   const doc = new jsPDF("p", "mm", "a4");

//   // ===== HEADER (PREMIUM) =====
//   doc.setFillColor(63, 81, 181);
//   doc.rect(0, 0, 210, 35, "F");

//   doc.setTextColor(255, 255, 255);

//   // SHOP NAME (BIG)
//   doc.setFontSize(18);
//   doc.setFont(undefined, "bold");
//   doc.text("OHM MURUGA TILES", 105, 14, { align: "center" });

//   // SUB TITLE
//   doc.setFontSize(12);
//   doc.setFont(undefined, "normal");
//   doc.text("QUOTATION", 105, 22, { align: "center" });

//   // SMALL TAGLINE
//   doc.setFontSize(9);
//   // doc.text("Premium Tile Showroom", 105, 28, { align: "center" });

//   doc.setTextColor(0, 0, 0);

//   // ===== CUSTOMER BOX =====
//   doc.setFillColor(245, 245, 245);
//   doc.roundedRect(14, 40, 182, 45, 3, 3, "F");

//   doc.setFontSize(10);

//   // LEFT
//   doc.text("Customer", 18, 48);
//   doc.setFont(undefined, "bold");
//   doc.text(data.customer, 18, 54);

//   doc.setFont(undefined, "normal");
//   doc.text("Mobile", 18, 62);
//   doc.text(data.mobile_no, 18, 68);

//   doc.text("Address", 18, 76);

//   const addressLines = doc.splitTextToSize(data.address || "-", 90);
//   doc.text(addressLines, 18, 82);

//   // RIGHT
//   doc.text("Quotation No", 130, 48);
//   doc.setFont(undefined, "bold");
//   doc.text(data.quotation_no, 130, 54);

//   doc.setFont(undefined, "normal");
//   doc.text("Date", 130, 62);
//   doc.text(data.entry_date, 130, 68);

//   // ===== TABLE =====
//   const tableData = tileItems.map((item, index) => [
//     index + 1,
//     `${item.tile_categ}\n${item.design_name}`,
//     item.tile_size,
//     item.sq_ft,
//     item.total_box,
//     `${Number(item.rate).toFixed(0)}`,
//     `${Number(item.amount).toFixed(2)}`,
//   ]);


 

//   autoTable(doc, {
//     startY: 92,
//     head: [["#", "Item", "Size", "Sqft", "Boxes", "Rate (per sq.ft)", "Amount"]],
//     body: tableData,

//     styles: {
//       fontSize: 9,
//       cellPadding: 3,
//       valign: "middle",
//     },

//     headStyles: {
//       fillColor: [63, 81, 181],
//       textColor: 255,
//       halign: "center",
//     },

//     alternateRowStyles: {
//       fillColor: [248, 249, 252],
//     },


    

//     columnStyles: {
//       0: { halign: "center", cellWidth: 10 },
//       1: { cellWidth: 60 },
//       2: { halign: "center", cellWidth: 18 },
//       3: { halign: "right", cellWidth: 18 },
//       4: { halign: "right", cellWidth: 18 },
//       5: { halign: "right", cellWidth: 25 },
//       6: { halign: "right", cellWidth: 30 },
//     },

//     didParseCell: function (data) {
//       if (data.column.index === 6) {
//         data.cell.styles.fontStyle = "bold";
//       }
//     },
//   });

//   const finalY = doc.lastAutoTable.finalY;

//   // ===== TOTAL BOX =====
//   doc.setFillColor(46, 125, 50);
//   doc.roundedRect(120, finalY + 8, 76, 12, 2, 2, "F");

//   doc.setTextColor(255, 255, 255);
//   doc.setFontSize(12);
//   doc.setFont(undefined, "bold");
//   doc.text(`TOTAL: Rs. ${total}`, 158, finalY + 16, { align: "center" });

//   doc.setTextColor(0, 0, 0);

//   // ===== SIGNATURE =====
//   doc.setFontSize(10);
//   doc.setFont(undefined, "normal");
//   // doc.text("Authorized Signature", 150, finalY + 32);
//   // doc.line(140, finalY + 28, 200, finalY + 28);

//   // ===== PREMIUM FOOTER =====
//   doc.setFontSize(11);
//   doc.setFont(undefined, "bold");

//   doc.setTextColor(63, 81, 181); // blue highlight
//   doc.text(
//     "Thank you for choosing OHM MURUGA TILES",
//     105,
//     finalY + 45,
//     { align: "center" }
//   );

//   doc.save(`${data.quotation_no}.pdf`);
// }

if (downloadType === "pdf") {
  const doc = new jsPDF("p", "mm", "a4");

  // ===== HEADER =====
  doc.setFillColor(63, 81, 181);
  doc.rect(0, 0, 210, 35, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont(undefined, "bold");
  doc.text("OHM MURUGA TILES", 105, 14, { align: "center" });

  doc.setFontSize(12);
  doc.setFont(undefined, "normal");
  doc.text("QUOTATION", 105, 22, { align: "center" });

  doc.setTextColor(0, 0, 0);

  // ===== CUSTOMER BOX =====
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(14, 40, 182, 45, 3, 3, "F");

  doc.setFontSize(10);

  doc.text("Customer", 18, 48);
  doc.setFont(undefined, "bold");
  doc.text(data.customer, 18, 54);

  doc.setFont(undefined, "normal");
  doc.text("Mobile", 18, 62);
  doc.text(data.mobile_no, 18, 68);

  doc.text("Address", 18, 76);

  const addressLines = doc.splitTextToSize(data.address || "-", 90);
  doc.text(addressLines, 18, 82);

  doc.text("Quotation No", 130, 48);
  doc.setFont(undefined, "bold");
  doc.text(data.quotation_no, 130, 54);

  doc.setFont(undefined, "normal");
  doc.text("Date", 130, 62);
  doc.text(data.entry_date, 130, 68);

  const tileTableData = tileItems.map((item, index) => [
    index + 1,
    `${item.tile_categ}\n${item.design_name}`,
    item.tile_size,
    item.sq_ft,
    item.total_box,
    Number(item.rate).toFixed(0),
    Number(item.amount).toFixed(2),
  ]);

  autoTable(doc, {
    startY: 92,
    head: [["S.No", "Item", "Size", "Sqft", "Boxes", "Rate", "Amount"]],
    body: tileTableData,

    styles: {
      fontSize: 9,
      cellPadding: 3,
    },

    headStyles: {
      fillColor: [63, 81, 181],
      textColor: 255,
    },
  });

  let finalY = doc.lastAutoTable.finalY;

  // ===== OTHER PRODUCTS TABLE =====
  if (otherItems.length > 0) {

    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Other Products", 14, finalY + 12);

    const otherTableData = otherItems.map((item, index) => [
      index + 1,
      item.product,
      item.qty,
      item.rate,
      item.amount,
    ]);

    autoTable(doc, {
      startY: finalY + 18,

      head: [["S.No", "Product", "Qty", "Rate", "Amount"]],
      body: otherTableData,

      styles: {
        fontSize: 9,
        cellPadding: 3,
      },

      headStyles: {
        fillColor: [46, 125, 50],
        textColor: 255,
      },
    });

    finalY = doc.lastAutoTable.finalY;
  }

  // ===== TOTAL =====
  doc.setFillColor(46, 125, 50);
  doc.roundedRect(120, finalY + 8, 76, 12, 2, 2, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont(undefined, "bold");

  doc.text(`TOTAL: Rs. ${total}`, 158, finalY + 16, {
    align: "center",
  });

  // ===== FOOTER =====
  doc.setTextColor(63, 81, 181);

  doc.text(
    "Thank you for choosing OHM MURUGA TILES",
    105,
    finalY + 35,
    {
      align: "center",
    }
  );

  doc.save(`${data.quotation_no}.pdf`);
}
    // ✅ PDF DOWNLOAD
//    if (downloadType === "pdf") {
//   const doc = new jsPDF("p", "mm", "a4");

//   // ===== HEADER BOX =====
//   doc.setFillColor(79, 70, 229);
//   doc.rect(0, 0, 210, 30, "F");

//   doc.setTextColor(255, 255, 255);
//   doc.setFontSize(18);
//   doc.text("OHM MURUGA TILES", 14, 15);

//   // doc.setFontSize(10);
//   // doc.text("TILE SHOWROOM", 14, 22);

//   doc.setFontSize(12);
//   doc.text(`QUOTATION`, 160, 15);

//   // RESET COLOR
//   doc.setTextColor(0, 0, 0);

//   // ===== INFO BOX =====
//   doc.setDrawColor(200);
//   doc.rect(14, 35, 182, 35);

//   doc.setFontSize(10);

//   // LEFT SIDE (Customer)
//   doc.text("Customer:", 16, 42);
//   doc.setFont(undefined, "bold");
//   doc.text(data.customer, 16, 48);

//   doc.setFont(undefined, "normal");
//   doc.text("Mobile:", 16, 55);
//   doc.text(data.mobile_no, 16, 60);

//   doc.text("Address:", 16, 66);
//   doc.text(data.address || "-", 16, 71);

//   // RIGHT SIDE (Quotation Details)
//   doc.text("Quotation No:", 130, 42);
//   doc.setFont(undefined, "bold");
//   doc.text(data.quotation_no, 160, 42);

//   doc.setFont(undefined, "normal");
//   doc.text("Date:", 130, 50);
//   doc.text(data.entry_date, 160, 50);

//   // ===== TABLE =====
//   const tableData = data.items.map((item, index) => [
//     index + 1,
//     `${item.tile_categ} - ${item.design_name}`,
//     item.tile_size,
//     item.sq_ft,
//     item.total_box,
//     `₹${item.rate}`,
//     `₹${item.amount}`,
//   ]);

//   autoTable(doc, {
//     startY: 80,

//     head: [["#", "Item", "Size", "Sqft", "Boxes", "Rate(per sq.ft)", "Amount"]],
//     body: tableData,

//     styles: {
//       fontSize: 9,
//       cellPadding: 3,
//       valign: "middle",
//     },

//     headStyles: {
//       fillColor: [79, 70, 229],
//       textColor: 255,
//       halign: "center",
//     },

//     columnStyles: {
//       0: { halign: "center", cellWidth: 10 },
//       1: { cellWidth: 60 },
//       2: { halign: "center", cellWidth: 20 },
//       3: { halign: "right", cellWidth: 20 },
//       4: { halign: "right", cellWidth: 20 },
//       5: { halign: "right", cellWidth: 25 },
//       6: { halign: "right", cellWidth: 25 },
//     },
//   });

//   const finalY = doc.lastAutoTable.finalY;

//   // ===== TOTAL BOX =====
//   doc.setFillColor(34, 197, 94);
//   doc.rect(130, finalY + 8, 66, 10, "F");

//   doc.setTextColor(255, 255, 255);
//   doc.setFontSize(12);
//   doc.text(`TOTAL: ₹${total}`, 160, finalY + 15, { align: "center" });

//   doc.setTextColor(0, 0, 0);

//   // ===== FOOTER =====
//   doc.setFontSize(10);
//   doc.text(
//     "Thank you for choosing OHM MURUGA TILES",
//     105,
//     finalY + 30,
//     { align: "center" }
//   );

//   // SIGNATURE
//   doc.text("Authorized Signature", 150, finalY + 45);
//   doc.line(140, finalY + 42, 200, finalY + 42);

//   doc.save(`${data.quotation_no}.pdf`);
// }

    if (downloadType === "excel") {
      const worksheet = XLSX.utils.json_to_sheet(data.items);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Quotation");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const file = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });

      saveAs(file, `${data.quotation_no}.xlsx`);
    }

    // ✅ WORD DOWNLOAD
    if (downloadType === "word") {
      const content = `
        <h2>OHM MURUGA TILES</h2>
        <h3>Quotation - ${data.quotation_no}</h3>
        <p>Customer: ${data.customer}</p>
        <p>Total: ₹${total}</p>
      `;

      const blob = new Blob(["\ufeff", content], {
        type: "application/msword",
      });

      saveAs(blob, `${data.quotation_no}.doc`);
    }

    setShowDownloadModal(false);
  };

  // ✅ SHARE
  const handleShare = () => {
    const shareText = `OHM MURUGA TILES\nQuotation ${data.quotation_no} - Total ₹${total}`;

    if (navigator.share) {
      navigator.share({
        title: "Quotation",
        text: shareText,
      });
    } else {
      const whatsapp = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(whatsapp, "_blank");
    }
  };

  return (
  <div>

   <style>
{`
@media print {

  @page {
    size: A4;
    margin: 6mm;
  }

  body {
    zoom: 92%;
    -webkit-print-color-adjust: exact;
  }

  .no-print {
    display: none !important;
  }

  table,
  tr,
  td,
  th {
    page-break-inside: avoid !important;
  }

}
`}
</style>

<div
  id="print-area"
  className="bg-gray-100 min-h-screen p-2 sm:p-4 print:bg-white"
>
  <div className="max-w-5xl mx-auto bg-white border border-gray-300 rounded-xl overflow-hidden shadow-lg print:shadow-none">

    {/* HEADER */}
    <div className="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center print:bg-indigo-600">

      <div className="w-full text-center">
        <h1 className="text-2xl font-extrabold tracking-wide leading-tight">
          OHM MURUGA TILES
        </h1>

        <p className="text-[13px] opacity-90 tracking-wide">
          TILE QUOTATION
        </p>
      </div>

      <div className="flex gap-2 no-print">
        <button
          onClick={() => window.print()}
          className="bg-white/20 p-2 rounded-lg"
        >
          <Printer size={18} />
        </button>

        <button
          onClick={() => setShowDownloadModal(true)}
          className="bg-white/20 p-2 rounded-lg"
        >
          <Download size={18} />
        </button>

        <button
          onClick={handleShare}
          className="bg-white/20 p-2 rounded-lg"
        >
          <Share2 size={18} />
        </button>
      </div>
    </div>

    {/* CUSTOMER DETAILS */}
    <div className="grid grid-cols-3 gap-2 p-3 border-b bg-gray-50 print:bg-white">

      <div className="border rounded-lg p-2 bg-white">
        <p className="text-[10px] text-gray-500">
          Quotation No
        </p>

        <p className="font-bold text-indigo-700 text-[13px]">
          {data.quotation_no}
        </p>

        <p className="text-[10px] text-gray-500 mt-1">
          Date
        </p>

        <p className="font-semibold text-[12px]">
          {data.entry_date}
        </p>
      </div>

      <div className="border rounded-lg p-2 bg-white">
        <p className="text-[10px] text-gray-500">
          Customer
        </p>

        <p className="font-bold text-[13px]">
          {data.customer}
        </p>

        <p className="text-[11px] text-gray-600">
          {data.mobile_no}
        </p>
      </div>

      <div className="border rounded-lg p-2 bg-white">
        <p className="text-[10px] text-gray-500">
          Address
        </p>

        <p className="text-[11px] leading-tight">
          {data.address}
        </p>
      </div>

    </div>

    {/* TABLE */}
    <div className="p-3 overflow-x-auto">

      <table className="w-full border border-gray-300 text-[12px] leading-[1.4]">

        <thead className="bg-gray-100">

          <tr>

            <th className="border px-2 py-2 w-[45px]">
              S.No
            </th>

            <th className="border px-2 py-2 w-[180px]">
              Item
            </th>

         
            <th className="border px-2 py-2 w-[70px]">
              Sqft
            </th>

            <th className="border px-2 py-2 w-[70px]">
              Boxes
            </th>

            <th className="border px-2 py-2 w-[90px]">
              Rate
            </th>

            <th className="border px-2 py-2 w-[95px]">
              Amount
            </th>

          </tr>

        </thead>

        <tbody>

          {tileItems.map((item, i) => (

            <tr
              key={i}
              className="text-center align-middle"
            >

              <td className="border px-2 py-2 font-medium">
                {i + 1}
              </td>

              {/* ITEM */}
              <td className="border px-1 py-1 text-left align-middle">

                {/* CATEGORY */}
                <div className="font-semibold text-gray-800 text-[12px] leading-tight">
                  {item.tile_categ} -({item.tile_size})
                </div>

                {/* DESIGN */}
                <div className="text-[12px] font-bold text-indigo-700 leading-tight mt-[2px]">
                  {item.design_name}
                </div>

                {/* BOX DETAILS */}
                {(item.tile_lines?.[0]?.dark_box ||
                  item.tile_lines?.[0]?.light_box ||
                  item.tile_lines?.[0]?.highlight_box) && (

                  <div className="mt-1 flex flex-wrap gap-1.5 text-[10px]">

                    {/* DARK */}
                    {item.tile_lines?.[0]?.dark_box && (
                      <div className="flex items-center gap-1 rounded-full bg-gray-100 border border-gray-200 px-2.5 py-[3px]">

                        <div className="w-1.5 h-1.5 rounded-full bg-gray-700"></div>

                        <span className="font-medium text-gray-700">
                          Dark
                        </span>

                        <span className="font-bold text-gray-900">
                          {item.tile_lines?.[0]?.dark_box}
                        </span>

                      </div>
                    )}

                    {/* LIGHT */}
                    {item.tile_lines?.[0]?.light_box && (
                      <div className="flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-[3px]">

                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>

                        <span className="font-medium text-blue-700">
                          Light
                        </span>

                        <span className="font-bold text-blue-900">
                          {item.tile_lines?.[0]?.light_box}
                        </span>

                      </div>
                    )}

                    {/* HIGHLIGHT */}
                    {item.tile_lines?.[0]?.highlight_box && (
                      <div className="flex items-center gap-1 rounded-full bg-yellow-50 border border-yellow-200 px-2.5 py-[3px]">

                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>

                        <span className="font-medium text-yellow-700">
                          Highlight
                        </span>

                        <span className="font-bold text-yellow-900">
                          {item.tile_lines?.[0]?.highlight_box}
                        </span>

                      </div>
                    )}

                  </div>
                )}

              </td>

              {/* SIZE */}
             

              {/* SQFT */}
              <td className="border px-2 py-2 font-medium">
                {item.sq_ft}
              </td>

              {/* BOX */}
              <td className="border px-2 py-2 font-medium">
                {item.total_box}
              </td>

              {/* RATE */}
              <td className="border px-2 py-2 text-center align-middle">

                <div className="leading-tight">

                  <div className="font-semibold text-[12px]">
                    ₹{item.rate}
                  </div>

                  <div className="text-[9px] text-gray-500">
                    / {item.rate_type}
                  </div>

                </div>

              </td>

              {/* AMOUNT */}
              <td className="border px-2 py-2 font-bold text-green-700 text-[12px]">
                ₹{item.amount}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

    {/* OTHER PRODUCTS */}
    {otherItems.length > 0 && (

      <div className="px-3 pb-2">

        <h2 className="font-bold text-[14px] mb-2">
          Other Products
        </h2>

        <table className="w-full border border-gray-300 text-[12px]">

          <thead className="bg-gray-100">

            <tr>

              <th className="border px-2 py-2">
                S.No
              </th>

              <th className="border px-2 py-2">
                Product
              </th>

              <th className="border px-2 py-2">
                Qty
              </th>

              <th className="border px-2 py-2">
                Rate
              </th>

              <th className="border px-2 py-2">
                Amount
              </th>

            </tr>

          </thead>

          <tbody>

            {otherItems.map((item, i) => (

              <tr
                key={i}
                className="text-center"
              >

                <td className="border px-2 py-2">
                  {i + 1}
                </td>

                <td className="border px-2 py-2 text-left">
                  {item.product}
                </td>

                <td className="border px-2 py-2">
                  {item.qty}
                </td>

                <td className="border px-2 py-2">
                  ₹{item.rate}
                </td>

                <td className="border px-2 py-2 font-bold text-green-700">
                  ₹{item.amount}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
    )}

    {/* TOTAL */}
    <div className="flex justify-end px-3 pb-3">

      <div className="bg-green-600 text-white px-5 py-2 rounded-lg font-bold text-[14px] shadow">

        TOTAL : ₹{total}

      </div>

    </div>

    {/* FOOTER */}
    <div className="text-center text-[11px] text-gray-500 pb-3">
      Thank you for choosing{" "}
      <span className="font-semibold">
        OHM MURUGA TILES
      </span>
    </div>

  </div>
</div>

    {/* DOWNLOAD MODAL */}
    {showDownloadModal && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 no-print">

        <div className="bg-white rounded-xl p-6 w-80 shadow-lg">

          <h2 className="text-lg font-bold mb-4">
            Download As
          </h2>

          <div className="space-y-2">

            {["pdf", "excel", "word"].map((type) => (

              <label key={type} className="flex gap-2">

                <input
                  type="radio"
                  value={type}
                  checked={downloadType === type}
                  onChange={(e) => setDownloadType(e.target.value)}
                />

                {type.toUpperCase()}

              </label>

            ))}

          </div>

          <div className="flex justify-end gap-2 mt-4">

            <button
              onClick={() => setShowDownloadModal(false)}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              Download
            </button>

          </div>

        </div>

      </div>
    )}

  </div>
);
}

export default QuotationView;