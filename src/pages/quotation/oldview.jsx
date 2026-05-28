import React, { useEffect, useState } from "react";
import { ArrowLeft, Download, Share2, Printer } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import autoTable from "jspdf-autotable";

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

  const total = data.items.reduce((s, i) => s + Number(i.amount || 0), 0);

  const handleDownload = async () => {


if (downloadType === "pdf") {
  const doc = new jsPDF("p", "mm", "a4");

  doc.setFontSize(16);
  doc.text("TILE QUOTATION", 105, 15, { align: "center" });

  doc.setFontSize(10);
  doc.text(`Quotation No: ${data.quotation_no}`, 14, 25);
  doc.text(`Date: ${data.entry_date}`, 14, 30);
  doc.text(`Customer: ${data.customer}`, 14, 35);
  doc.text(`Mobile: ${data.mobile_no}`, 14, 40);

  doc.text("Address:", 14, 45);
  doc.text(data.address || "", 14, 50);

  // TABLE DATA
  const tableData = data.items.map((item, index) => [
    index + 1,
    item.tile_categ + "\n" + item.design_name,
    item.tile_size,
    item.sq_ft,
    item.total_box,
    item.rate,
    item.amount,
  ]);

  autoTable(doc, {
    startY: 60,
    head: [["#", "Item", "Size", "Sqft", "Boxes", "Rate", "Amount"]],
    body: tableData,
    styles: {
      fontSize: 9,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [79, 70, 229], // indigo
    },
  });

  // TOTAL
  const finalY = doc.lastAutoTable.finalY;
  doc.setFontSize(12);
  doc.text(`TOTAL: ₹${total}`, 150, finalY + 10);

  // SAVE
  doc.save(`${data.quotation_no}.pdf`);
}
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

    if (downloadType === "word") {
      const content = `
        <h2>Quotation - ${data.quotation_no}</h2>
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

  // ✅ SHARE FUNCTION
  const handleShare = () => {
    const shareText = `Quotation ${data.quotation_no} - Total ₹${total}`;

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
      {/* MAIN UI */}
      <div
        id="print-area"
        className="min-h-screen bg-gray-100 p-3 sm:p-6 print:bg-white">
        <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden border print:shadow-none print:border-none">

          {/* HEADER */}
          <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 bg-indigo-600 text-white print:bg-white print:text-black">

            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white/20 rounded-lg print:hidden"
            >
              <ArrowLeft size={18} />
            </button>

            <h1 className="text-base sm:text-lg font-bold text-center w-full">
              TILE QUOTATION
            </h1>

            <div className="flex gap-2 print:hidden">
              <button onClick={() => window.print()} className="p-2 bg-white/20 rounded-lg">
                <Printer size={18} />
              </button>

              <button
                onClick={() => setShowDownloadModal(true)}
                className="p-2 bg-white/20 rounded-lg"
              >
                <Download size={18} />
              </button>

              <button
                onClick={handleShare}
                className="p-2 bg-white/20 rounded-lg"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>

          {/* CUSTOMER INFO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-6 bg-gray-50 border-b print:bg-white">

            <div className="bg-white p-4 rounded-lg border">
              <p className="text-xs text-gray-500">Quotation No</p>
              <p className="font-bold text-indigo-600">{data.quotation_no}</p>
              <p className="text-xs text-gray-500 mt-2">Date</p>
              <p className="font-bold text-indigo-600">{data.entry_date}</p>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <p className="text-xs text-gray-500">Customer</p>
              <p className="font-bold">{data.customer}</p>
              <p className="text-xs text-gray-500">{data.mobile_no}</p>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <p className="text-xs text-gray-500">Address</p>
              {data.address?.split(",").map((line, i) => (
                <p key={i}>{line.trim()}</p>
              ))}
            </div>
          </div>

          {/* TABLE */}
          <div className="p-4 sm:p-6 overflow-x-auto">
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">S.No</th>
                  <th className="p-2 border">Item</th>
                  <th className="p-2 border">Size</th>
                  <th className="p-2 border">Sqft</th>
                  <th className="p-2 border">Boxes</th>
                  <th className="p-2 border">Rate</th>
                  <th className="p-2 border">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, i) => (
                  <tr key={i} className="text-center">
                    <td className="p-2 border">{i + 1}</td>
                    <td className="p-2 border text-left">
                      {item.tile_categ}
                      <div className="text-xs">{item.design_name}</div>
                    </td>
                    <td className="p-2 border">{item.tile_size}</td>
                    <td className="p-2 border">{item.sq_ft}</td>
                    <td className="p-2 border">{item.total_box}</td>
                    <td className="p-2 border">₹{item.rate}</td>
                    <td className="p-2 border font-bold text-green-600">
                      ₹{item.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TOTAL */}
          <div className="p-4 flex justify-end">
            <div className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold">
              TOTAL: ₹{total}
            </div>
          </div>

        </div>
      </div>

      {/* ✅ DOWNLOAD MODAL */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-lg">

            <h2 className="text-lg font-bold mb-4">Download As</h2>

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