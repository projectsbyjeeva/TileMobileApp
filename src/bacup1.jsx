import React, { useEffect, useState } from "react";
import { ArrowLeft, Download, Share2, Printer } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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
    const element = document.getElementById("print-area");
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save(`${data.quotation_no}.pdf`);
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

const handleShare = () => {
  const shareText = `Quotation ${data.quotation_no} - Total ₹${total}`;

  if (navigator.share) {
    navigator.share({
      title: "Quotation",
      text: shareText,
    });
  } else {
    // fallback
    const whatsapp = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsapp, "_blank");
  }
};


  return (
    // <div className="min-h-screen bg-gray-100 p-3 sm:p-6 print:bg-white">
    <div
  id="print-area"
  className="min-h-screen bg-gray-100 p-3 sm:p-6 print:bg-white"
>
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

          <div className="flex gap-1 sm:gap-2 print:hidden">
            <button onClick={() => window.print()} className="p-2 bg-white/20 rounded-lg">
              <Printer size={18} />
            </button>
            <button onClick={() => setShowDownloadModal(true)}
             className="p-2 bg-white/20 rounded-lg">
              <Download size={18} />
            </button>
            <button className="p-2 bg-white/20 rounded-lg">
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* CUSTOMER INFO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-4 sm:p-6 bg-gray-50 border-b print:bg-white">

          <div className="bg-white p-3 sm:p-4 rounded-lg border">
            <p className="text-xs text-gray-500">Quotation No</p>
            <p className="font-bold text-indigo-600 text-sm sm:text-base">
              {data.quotation_no}
            </p>
             <p className="text-xs text-gray-500">Date</p>
            <p className="font-bold text-indigo-600 text-sm sm:text-base">
              {data.entry_date}
            </p>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-lg border">
            <p className="text-xs text-gray-500">Customer Name</p>
            <p className="font-bold text-sm sm:text-base">{data.customer}</p>
            <p className="text-xs text-gray-500">{data.mobile_no}</p>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-lg border">
            <p className="text-xs text-gray-500">Address</p>
            <div className="text-sm leading-5">
              {data.address?.split(",").map((line, index) => (
                <p key={index}>{line.trim()}</p>
              ))}
            </div>
          </div>
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block p-4 sm:p-6">
          <div className="overflow-x-auto">
            <table className="min-w-[700px] w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">#</th>
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
                      <p className="font-semibold">{item.tile_categ}</p>

                  
                      <p className="text-xs font-bold text-gray-700">
                        {item.design_name}
                      </p>
                    </td>

                    <td className="p-2 border">{item.tile_size}</td>

                    <td className="p-2 border">
                      {item.sq_ft}
                      <div className="text-xs text-gray-400">
                        {item.width} x {item.height}
                      </div>
                    </td>

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
        </div>

        {/* MOBILE VIEW */}
        <div className="md:hidden p-4 space-y-3">
          {data.items.map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border shadow-sm">

              <div className="flex justify-between">
                <p className="font-bold">{item.tile_categ}</p>
                <p className="text-green-600 font-semibold">₹{item.amount}</p>
              </div>

              {/* ✅ ADD THIS (missing before) */}
              <p className="text-xs font-bold text-gray-700">
                {(item.design_name)}
              </p>

              <p className="text-xs text-gray-500">{item.tile_size}</p>

              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <p>Sqft: {item.sq_ft}</p>
                <p>Boxes: {item.total_box}</p>
                <p>Rate: ₹{item.rate}</p>
                <p>
                  Size: {item.width} x {item.height}
                </p>
              </div>

            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t flex justify-end print:bg-white">
          <div className="bg-green-600 text-white px-6 py-2 rounded-lg text-lg font-bold">
            TOTAL: ₹{total}
          </div>
        </div>

      </div>
    </div>
  );
} 

export default QuotationView;