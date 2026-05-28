import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Download,
  Share2,
  Printer,
} from "lucide-react";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";


import { ToWords } from "to-words";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";

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

    API.get(`/quotation-view/${quotationId}`)
      .then((res) => {

        if (res.data.status === true) {
          setData(res.data.data);
        }

      });

  };

  if (!data) {
    return (
      <div className="p-10 text-center text-xl font-bold">
        Loading...
      </div>
    );
  }


  const tileItems = data.items.filter(
    (item) => item.tile_categ !== "Other"
  );

  const otherItems = data.items.filter(
    (item) => item.tile_categ === "Other"
  );

  const total = data.items.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  

  const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: true,
    ignoreZeroCurrency: false,
  },
});

  const totalInWords = toWords.convert(total);

  const handleDownload = async () => {

  // PDF DOWNLOAD
  if (downloadType === "pdf") {

    const input = document.getElementById("print-area");

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = 210;

    const pageHeight = 297;

    const imgWidth = pdfWidth;

    const imgHeight =
      (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight
    );

    heightLeft -= pageHeight;

    while (heightLeft > 0) {

      position = heightLeft - imgHeight;

      pdf.addPage();

      pdf.addImage(
        imgData,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight
      );

      heightLeft -= pageHeight;
    }

    pdf.save(`${data.quotation_no}.pdf`);
  }

  // WORD DOWNLOAD
  if (downloadType === "word") {

    const content = `
      <html>
      <body>
        <h1>OHM MURUGA TILES</h1>
        <h3>Quotation</h3>

        <p>
          Quotation No :
          ${data.quotation_no}
        </p>

        <p>
          Customer :
          ${data.customer}
        </p>

        <p>
          Total :
          ₹${total}
        </p>
      </body>
      </html>
    `;

    const blob = new Blob(
      ["\ufeff", content],
      {
        type: "application/msword",
      }
    );

    saveAs(
      blob,
      `${data.quotation_no}.doc`
    );
  }

  setShowDownloadModal(false);
};

  return (

<div className="bg-[#dfe5ec] min-h-screen py-10 px-4">

<style>
{`

@media print{

  @page{
    size:A4;
    margin:0;
  }

 html,
  body{
    width:210mm;
    height:auto;
    margin:0 !important;
    padding:0 !important;
    background:#fff;
    overflow:hidden;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .no-print{
    display:none !important;
  }
  #print-area{
    width:210mm;
    height:auto !important;
    min-height:auto !important;
    margin:0 auto !important;
    padding:0 !important;
    box-shadow:none !important;
    border:none !important;
    overflow:hidden !important;
    page-break-after:auto;
  }

}

.a4-sheet{
  width:210mm;
  height:auto;
}

.section-ribbon{
  position:relative;
  display:inline-block;
  background:#132548;
  color:#fff;
  padding:7px 22px 7px 18px;
  font-size:12px;
  font-weight:700;
  letter-spacing:.5px;
}

.section-ribbon:after{
  content:"";
  position:absolute;
  right:-18px;
  top:0;
  width:0;
  height:0;
  border-top:16px solid transparent;
  border-bottom:16px solid transparent;
  border-left:18px solid #132548;
}

.footer-strip{
  position:relative;
  overflow:hidden;
}

.footer-strip:before{
  content:"";
  position:absolute;
  left:-25px;
  top:0;
  width:70px;
  height:100%;
  background:#d39a29;
  transform:skew(-40deg);
}

.footer-strip:after{
  content:"";
  position:absolute;
  right:-25px;
  top:0;
  width:70px;
  height:100%;
  background:#d39a29;
  transform:skew(-40deg);
}

.grand-total-shape{
  clip-path:polygon(0 0,100% 0,92% 100%,0% 100%);
}

`}
</style>

<div id="print-area"
className="a4-sheet bg-white mx-auto shadow-[0_15px_40px_rgba(0,0,0,0.18)] border border-gray-300 relative overflow-hidden"
>

{/* ===========================
        HEADER
=========================== */}
{/* ===========================
        HEADER
=========================== */}
{/* ===========================
        HEADER
=========================== */}

<div className="border-b-[2px] border-[#d39a29] px-6 py-4">

  <div className="flex justify-between items-center">

    {/* LEFT SIDE */}
    <div className="flex items-center gap-4">

      {/* LOGO */}
      <div className="relative w-[56px] h-[56px] shrink-0">

        <div className="absolute w-5 h-5 bg-[#132548] rotate-45 left-[18px] top-0 rounded-[2px]"></div>

        <div className="absolute w-5 h-5 bg-[#132548] rotate-45 left-0 top-[18px] rounded-[2px]"></div>

        <div className="absolute w-5 h-5 bg-[#132548] rotate-45 right-0 top-[18px] rounded-[2px]"></div>

        <div className="absolute w-5 h-5 bg-[#d39a29] rotate-45 left-[18px] bottom-0 rounded-[2px]"></div>

      </div>

      {/* COMPANY NAME */}
      <div className="flex flex-col justify-center">

  <h1 className="text-[22px] font-black leading-[30px] tracking-wide text-[#132548] whitespace-nowrap">
    PRAKATHI AMMAN TRADERS
  </h1>

  <div className="text-[#d39a29] text-[13px] font-bold tracking-[2px] mt-1">
    [ OHM MURUGA TILES ]
  </div>

  <p className="text-[12px] text-brown-500 mt-2 tracking-wide">
    Premium Tiles • Elegant Designs • Trusted Quality
  </p>

</div>

    </div>

    {/* RIGHT SIDE */}
    <div className="text-right">

      {/* MOBILE */}
      <div className="flex items-center justify-end gap-2">

        <div className="w-7 h-7 rounded-full bg-[#132548] text-white flex items-center justify-center text-[12px]">
          ☎
        </div>

        <div className="text-[18px] font-bold text-[#132548] tracking-wide">
          +91 97502 75999
        </div>

      </div>

      {/* ADDRESS */}
      <div className="flex items-start justify-end gap-2 mt-3">

        <div className="w-7 h-7 rounded-full bg-[#d39a29] text-[#132548] flex items-center justify-center text-[12px] shrink-0">
          📍
        </div>

        <div className="text-[13px] leading-5 text-right text-gray-700 font-medium">
          482/2, Kunnathur - Perundurai Rd,
          <br />
          Perundurai, Tamil Nadu - 638052
        </div>

      </div>

    </div>

  </div>

</div>


{/* TITLE */}
<div className="text-center pt-7 pb-5 relative">

  <h2 className="text-[30px] font-black tracking-wide text-[#132548]">
    TILE QUOTATION
  </h2>

  <div className="flex items-center justify-center mt-2 gap-2">

    <div className="w-16 h-[2px] bg-[#d39a29]"></div>

    <div className="text-[#d39a29] text-[18px]">
      ❦
    </div>

    <div className="w-16 h-[2px] bg-[#d39a29]"></div>

  </div>

</div>

{/* CUSTOMER + QUOTATION */}
<div className="px-6 grid grid-cols-2 gap-5">

  {/* CUSTOMER */}
  <div className="border border-gray-300 rounded-md overflow-hidden">

    <div className="section-ribbon">
      CUSTOMER DETAILS
    </div>

    <div className="p-5 pt-6 text-[12px] text-gray-700">

      <div className="flex items-start gap-3 mb-4">

        <div className="text-[#132548]">
          👤
        </div>

        <div className="font-bold text-[#132548] leading-5">
          {data.customer}
        </div>

      </div>

      <div className="flex items-center gap-3 mb-4">

        <div className="text-[#132548]">
          📞
        </div>

        <div>
          {data.mobile_no}
        </div>

      </div>

      <div className="flex items-start gap-3 leading-5">

        <div className="text-[#132548]">
          📍
        </div>

        <div>
          {data.address}
        </div>

      </div>

    </div>

  </div>

  {/* QUOTATION */}
  <div className="border border-gray-300 rounded-md overflow-hidden">

    <div className="section-ribbon">
      QUOTATION DETAILS
    </div>

    <div className="p-5 pt-6 text-[12px]">

      <div className="grid grid-cols-[120px_1fr] gap-y-4 text-gray-700">

        <div className="font-bold text-[#132548]">
          Quotation No.
        </div>

        <div>
          {data.quotation_no}
        </div>

        <div className="font-bold text-[#132548]">
          Date
        </div>

        <div>
          {data.entry_date}
        </div>

       

      </div>

    </div>

  </div>

</div>

{/* TILE DETAILS */}
<div className="px-6 mt-6">

  <div className="section-ribbon">
    TILE DETAILS
  </div>

  <table className="w-full border border-gray-300 text-[11px] mt-1">

    <thead>

      <tr className="bg-[#f4f6fa] text-[#132548]">

        <th className="border px-2 py-3">
          S.No
        </th>

        <th className="border px-2 py-3 text-left">
          Item Description
        </th>

        <th className="border px-2 py-3">
          Size
        </th>

        <th className="border px-2 py-3">
          Sqft
        </th>

        <th className="border px-2 py-3">
          Boxes
        </th>

        <th className="border px-2 py-3">
          Rate
        </th>

        <th className="border px-2 py-3">
          Amount
        </th>

      </tr>

    </thead>

    <tbody  className="text-[14px] font-medium">

      {tileItems.map((item, i) => (

        <tr key={i}>

          <td className="border text-center py-4">
            {i + 1}
          </td>
{/* ITEM DESCRIPTION COLUMN */}
<td className="border border-[#d6d6d6] px-3 py-4 align-top">

  {/* TILE NAME */}
  <div className="font-bold text-[#0f172a] text-[12px] leading-[18px]">
    {item.tile_categ} ({item.tile_size})
  </div>

  {/* DESIGN NAME */}
  <div className="text-[#1d4ed8] text-[11px] font-semibold mt-1">
    {item.design_name}
  </div>

  {/* BOX DETAILS */}
  <div className="flex flex-wrap gap-2 mt-3">

    {/* DARK BOX */}
    {item.tile_lines?.[0]?.dark_box > 0 && (
      <div className="flex items-center gap-1 bg-[#f3f4f6] border border-gray-300 rounded-full px-2 py-[3px]">
        
        <div className="w-2 h-2 rounded-full bg-gray-700"></div>

        <span className="text-[9px] font-semibold text-gray-700">
          Dark :
        </span>

        <span className="text-[9px] font-bold text-black">
          {item.tile_lines?.[0]?.dark_box} Box
        </span>

      </div>
    )}

    {/* LIGHT BOX */}
    {item.tile_lines?.[0]?.light_box > 0 && (
      <div className="flex items-center gap-1 bg-[#eef4ff] border border-blue-200 rounded-full px-2 py-[3px]">
        
        <div className="w-2 h-2 rounded-full bg-blue-500"></div>

        <span className="text-[9px] font-semibold text-blue-700">
          Light :
        </span>

        <span className="text-[9px] font-bold text-blue-900">
          {item.tile_lines?.[0]?.light_box} Box
        </span>

      </div>
    )}

    {/* HIGHLIGHTER BOX */}
    {item.tile_lines?.[0]?.highlight_box > 0 && (
      <div className="flex items-center gap-1 bg-[#fff8e6] border border-yellow-300 rounded-full px-2 py-[3px]">
        
        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>

        <span className="text-[9px] font-semibold text-yellow-700">
          Highlight :
        </span>

        <span className="text-[9px] font-bold text-yellow-900">
          {item.tile_lines?.[0]?.highlight_box} Box
        </span>

      </div>
    )}

  </div>

</td>

          <td className="border text-center">
            {item.tile_size}
          </td>

          <td className="border text-center">
            {item.sq_ft}
          </td>

          <td className="border text-center">
            {item.total_box}
          </td>

          <td className="border text-center">
            ₹{item.rate}
          </td>

          <td className="border text-center font-black text-green-700">
            ₹{item.amount}
          </td>

        </tr>

      ))}

    </tbody>

  </table>

</div>

{/* OTHER PRODUCTS */}
{otherItems.length > 0 && (

<div className="px-6 mt-5">

  <div className="section-ribbon">
    OTHER PRODUCTS
  </div>

  <table className="w-full border border-gray-300 text-[11px] mt-1">

    <thead>

      <tr className="bg-[#f4f6fa] text-[#132548]">

        <th className="border px-2 py-3">
          S.No
        </th>

        <th className="border px-2 py-3">
          Product
        </th>

        <th className="border px-2 py-3">
          Quantity
        </th>

        <th className="border px-2 py-3">
          Rate
        </th>

        <th className="border px-2 py-3">
          Amount
        </th>

      </tr>

    </thead>

    <tbody className="text-[14px] font-medium">

      {otherItems.map((item, i) => (

        <tr key={i}>

          <td className="border  text-center py-4">
            {i + 1}
          </td>

          <td className="border px-4 py-4 font-semibold text-[#132548]">
            {item.product}
          </td>

          <td className="border text-center py-4">
            {item.qty}
          </td>

          <td className="border text-center py-4">
            ₹{item.rate}
          </td>

           <td className="border text-center py-4 font-black text-green-700 text-[15px]">
        ₹{item.amount}
      </td>

        </tr>

      ))}

    </tbody>

  </table>

</div>

)}


{/* GRAND TOTAL */}
<div className="px-6 mt-6">

  <div className="flex justify-between items-center border border-[#d39a29]">

    <div className="grand-total-shape bg-white px-5 py-4 w-[70%] border-r border-[#d39a29]">

      <div className="flex items-center gap-3">

        <div className="text-[24px]">
          🧾
        </div>

        <div>

          <div className="font-black text-[#132548] text-[15px]">
            GRAND TOTAL (₹)
          </div>

        <div className="text-[11px] text-gray-500 mt-1 leading-5">
  {totalInWords}
</div>

        </div>

      </div>

    </div>

    <div className="bg-[#132548] text-white w-[30%] py-5 text-center">

      <div className="text-[34px] font-black tracking-wide">
        ₹{total}
      </div>

    </div>

  </div>

</div>

{/* NOTES */}
{/* THANK YOU + SIGNATURE */}
<div className="px-6 mt-10 mb-6">

  <div className="grid grid-cols-3 items-end">

    {/* LEFT EMPTY */}
    <div></div>

    {/* CENTER THANK YOU */}
    <div className="flex flex-col items-center text-center">

      <div className="w-36 border-t border-gray-300 mb-4 relative">

        <div className="absolute left-1/2 -translate-x-1/2 -top-[14px] bg-white px-2 text-[#132548]">
          ❦
        </div>

      </div>

      <p className="text-[14px] text-gray-500">
        Thank you for choosing
      </p>

      <h2 className="text-[28px] font-black text-[#132548] leading-none mt-3 whitespace-nowrap tracking-wide">
        OHM MURUGA TILES
      </h2>

      <p className="text-[14px] text-gray-500 mt-4">
        We look forward to serving you
      </p>

    </div>

    {/* RIGHT SIGNATURE */}
    {/* <div className="flex flex-col items-center justify-end pb-1">

      <div className="w-[180px] border-b border-gray-500 mb-1"></div>

      <div className="text-[12px] font-semibold text-[#132548] tracking-wide">
        Authorised Signature
      </div>

    </div> */}

  </div>

</div>
{/* FOOTER */}
<div className="footer-strip bg-[#132548] text-white mt-5 px-8 py-3 relative">

  <div className="flex justify-between items-center text-[10px] relative z-10">

    <div>
      🌐 www.ohmmurugatiles.com
    </div>

    <div className="text-[#d39a29] font-semibold tracking-wide">
      Quality Tiles. Trusted Service. Lasting Values.
    </div>

  </div>

</div>

</div>


{/* DOWNLOAD MODAL */}
{showDownloadModal && (

<div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">

  <div className="bg-white w-[320px] rounded-2xl shadow-2xl p-6">

    <h2 className="text-[22px] font-black text-[#132548] mb-5">
      Download File
    </h2>

    <select
      value={downloadType}
      onChange={(e) =>
        setDownloadType(e.target.value)
      }
      className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none"
    >

      <option value="pdf">
        PDF
      </option>

      <option value="word">
        WORD
      </option>

    </select>

    <div className="flex justify-end gap-3 mt-6">

      <button
        onClick={() =>
          setShowDownloadModal(false)
        }
        className="px-5 py-2 rounded-lg bg-gray-200"
      >
        Cancel
      </button>

      <button
        onClick={handleDownload}
        className="px-5 py-2 rounded-lg bg-[#132548] text-white"
      >
        Download
      </button>

    </div>

  </div>

</div>

)}

{/* FLOAT BUTTONS */}
<div className="fixed bottom-6 right-6 flex gap-3 no-print">

  <button
    onClick={() => window.print()}
    className="bg-[#132548] text-white p-4 rounded-full shadow-xl"
  >
    <Printer size={20} />
  </button>

  <button   onClick={() => setShowDownloadModal(true)}
    className="bg-[#d39a29] text-[#132548] p-4 rounded-full shadow-xl"
  >
    <Download size={20} />
  </button>

  <button
    className="bg-green-600 text-white p-4 rounded-full shadow-xl"
  >
    <Share2 size={20} />
  </button>

</div>

</div>



  );

}

export default QuotationView;