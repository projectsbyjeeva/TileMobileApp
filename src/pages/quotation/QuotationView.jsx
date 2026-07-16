import React, { useEffect, useRef, useState } from "react";
import { Download, Share2, Printer, X, CheckCircle ,ArrowLeft } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { ToWords } from "to-words";
import { useParams,useNavigate  } from "react-router-dom";
import API from "../../api/axios";
import { Share } from "@capacitor/share";
import { Filesystem, Directory } from "@capacitor/filesystem";

function QuotationView() {
  const { quotationId } = useParams();
  const printRef = useRef(null);

  const [data, setData] = useState(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadType, setDownloadType] = useState("pdf");
  const [isDownloading, setIsDownloading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const navigate = useNavigate();
  const fetchData = () => {
    API.get(`/quotation-view/${quotationId}`)
      .then((res) => {
        if (res.data.status === true) {
          setData(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-[#dfe5ec] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#132548] border-t-[#d39a29] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#132548] font-bold text-lg">
            Loading Quotation...
          </p>
        </div>
      </div>
    );
  }

  const items = data.items || [];

  const tileItems = items.filter((item) => item.tile_categ !== "Other");
  const otherItems = items.filter((item) => item.tile_categ === "Other");

  const getAmount = (item) => {
    if (Number(item.amount) > 0) {
      return Number(item.amount);
    }

    if (item.tile_categ === "Other") {
      return Number(item.qty || 0) * Number(item.rate || 0);
    }

    return Number(item.sq_ft || 0) * Number(item.rate || 0);
  };

  const total = items.reduce((sum, item) => sum + getAmount(item), 0);

  const toWords = new ToWords({
    localeCode: "en-IN",
    converterOptions: {
      currency: true,
      ignoreDecimal: true,
      ignoreZeroCurrency: false,
    },
  });

  const totalInWords = toWords.convert(Math.round(total));

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      if (downloadType === "pdf") {
        const input = document.getElementById("print-area");

        const canvas = await html2canvas(input, {
          scale: 2,
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`${data.quotation_no}.pdf`);
        showToast("PDF downloaded successfully!");
      }

      if (downloadType === "word") {
        const tileRows = tileItems
          .map(
            (item, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${item.tile_categ || ""} (${item.tile_size || ""}) - ${
              item.design_name || ""
            }</td>
                <td>${item.tile_size || ""}</td>
                <td>${item.sq_ft || 0}</td>
                <td>${item.total_box || 0}</td>
                <td>₹${Number(item.rate || 0).toFixed(2)}</td>
                <td>₹${getAmount(item).toFixed(2)}</td>
              </tr>
            `
          )
          .join("");

        const otherRows = otherItems
          .map(
            (item, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${item.product || ""}</td>
                <td>${item.qty || 0}</td>
                <td>₹${Number(item.rate || 0).toFixed(2)}</td>
                <td>₹${getAmount(item).toFixed(2)}</td>
              </tr>
            `
          )
          .join("");

        const content = `
          <html>
            <head>
              <meta charset="utf-8" />
              <style>
                body { font-family: Arial; font-size: 12px; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                th, td { border: 1px solid #ccc; padding: 8px; }
                th { background: #f4f6fa; }
              </style>
            </head>
            <body>
              <h2>PRAKATHI AMMAN TRADERS - OHM MURUGA TILES</h2>
              <p><b>Quotation No:</b> ${data.quotation_no}</p>
              <p><b>Date:</b> ${data.entry_date}</p>
              <p><b>Customer:</b> ${data.customer}</p>
              <p><b>Mobile:</b> ${data.mobile_no}</p>
              <p><b>Address:</b> ${data.address}</p>

              <h3>Tile Details</h3>
              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Description</th>
                    <th>Size</th>
                    <th>Sqft</th>
                    <th>Boxes</th>
                    <th>Rate</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>${tileRows}</tbody>
              </table>

              ${
                otherItems.length > 0
                  ? `
                  <h3>Other Products</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Rate</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>${otherRows}</tbody>
                  </table>
                `
                  : ""
              }

              <h2>Grand Total: ₹${total.toFixed(2)}</h2>
              <p>${totalInWords}</p>
            </body>
          </html>
        `;

        const blob = new Blob(["\ufeff", content], {
          type: "application/msword",
        });

        saveAs(blob, `${data.quotation_no}.doc`);
        showToast("Word document downloaded!");
      }
    } catch (err) {
      console.log(err);
      showToast("Download failed", "error");
    } finally {
      setIsDownloading(false);
      setShowDownloadModal(false);
    }
  };

  const generatePdfBase64 = async () => {
  const input = document.getElementById("print-area");

  const canvas = await html2canvas(input, {
    scale: 2,
    useCORS: true,
    logging: false,
    allowTaint: true,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = 210;
  const pageHeight = 297;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  return pdf.output("datauristring").split(",")[1];
};

const handleShare = async () => {
  try {
    const fileName = `${data.quotation_no}.pdf`;

    const pdfBase64 = await generatePdfBase64();

    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: pdfBase64,
      directory: Directory.Cache,
      recursive: true,
    });

    await Share.share({
      title: `Quotation ${data.quotation_no}`,
      text: `Quotation for ${data.customer}`,
      url: savedFile.uri,
      dialogTitle: "Share Quotation PDF",
    });

    showToast("Share options opened");
  } catch (err) {
    console.log("Share Error:", err);
    showToast("Share failed", "error");
  }
};

  // const generatePdfBlob = async () => {

  //   const input = document.getElementById("print-area");

  //   const canvas = await html2canvas(input, {
  //     scale : 2,
  //     useCORS : true,
  //     backgroundColor: '#ffffff'
  //   });

  //    const imgData =canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("p", "mm", "a4");


  //   const pdfWidth = 210;

  //     const pageHeight = 297;
  // const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  // let heightLeft = imgHeight;
  // let position = 0;
  //   pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
  // heightLeft -= pageHeight;

  // while (heightLeft > 0) {
  //   position = heightLeft - imgHeight;
  //   pdf.addPage();
  //   pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
  //   heightLeft -= pageHeight;
  // }

  // return pdf.output("blob");
  // };


  // const handleShare = async () => {

  //   try{
  //     const pdfBlob = await generatePdfBlob();

  //     const pdfFile = new File(

  //       [pdfBlob],
  //       `${data.quotation_no}.pdf`,
  //       { type: "application/pdf"}

  //     );

  //     if(navigator.canShare && navigator.canShare({ files: [pdfFile]})) {

  //       await navigator.share({
  //       title: `Quotation ${data.quotation_no}`,
  //       text: `Quotation for ${data.customer}`,
  //       files: [pdfFile],
  //     });


  //     showToast("PDF shared successfully!");
  //     }
  //     else{
  //          saveAs(pdfBlob, `${data.quotation_no}.pdf`);
  //     showToast("PDF downloaded. Share manually.");
  //     }
  //   }
  //   catch  (err){
  //      console.log(err);
  //   showToast("Share failed", "error");
  //   }
  // };



  // const handleShare = async () => {
  //   const shareData = {
  //     title: `Quotation ${data.quotation_no}`,
  //     text: `Quotation for ${data.customer} | Total: ₹${total.toFixed(2)}`,
  //     url: window.location.href,
  //   };

  //   try {
  //     if (navigator.share) {
  //       await navigator.share(shareData);
  //       showToast("Shared successfully!");
  //     } else {
  //       await navigator.clipboard.writeText(window.location.href);
  //       showToast("Link copied!");
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  return (
    
    <div className="bg-[#dfe5ec] min-h-screen py-4 sm:py-8 px-2 sm:px-4 pb-28 sm:pb-10">
      <div className="no-print fixed top-4 left-4 z-50">
  <button
    onClick={() => navigate("/quotation")}
    className="flex items-center gap-2 bg-[#132548] text-white px-4 py-2 rounded-full shadow-lg text-[13px] font-semibold"
  >
    <ArrowLeft size={18} />
    Back
  </button>
</div>
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }

          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .no-print {
            display: none !important;
          }

          #print-area {
            width: 210mm !important;
            max-width: 210mm !important;
            margin: 0 auto !important;
            box-shadow: none !important;
            border: none !important;
          }

          .table-scroll {
            overflow: visible !important;
          }
        }

        .section-ribbon {
          position: relative;
          display: inline-block;
          background: #132548;
          color: white;
          padding: 7px 25px 7px 16px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }

        .section-ribbon:after {
          content: "";
          position: absolute;
          right: -17px;
          top: 0;
          border-top: 15px solid transparent;
          border-bottom: 15px solid transparent;
          border-left: 17px solid #132548;
        }

        .grand-total-shape {
          clip-path: polygon(0 0, 100% 0, 92% 100%, 0% 100%);
        }

        .footer-strip {
          position: relative;
          overflow: hidden;
        }

        .footer-strip:before {
          content: "";
          position: absolute;
          left: -25px;
          top: 0;
          width: 70px;
          height: 100%;
          background: #d39a29;
          transform: skew(-40deg);
        }

        .footer-strip:after {
          content: "";
          position: absolute;
          right: -25px;
          top: 0;
          width: 70px;
          height: 100%;
          background: #d39a29;
          transform: skew(-40deg);
        }
      `}</style>

      {toast && (
        <div
          className={`fixed bottom-28 sm:bottom-10 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-white text-sm font-semibold ${
            toast.type === "error" ? "bg-red-600" : "bg-[#132548]"
          }`}
        >
          <CheckCircle size={16} />
          {toast.msg}
        </div>
      )}

      <div
        id="print-area"
        ref={printRef}
        className="bg-white mx-auto shadow-[0_15px_40px_rgba(0,0,0,0.18)] border border-gray-200 overflow-hidden"
        style={{ maxWidth: "210mm", width: "100%" }}
      >
        {/* HEADER */}
        <div className="border-b-2 border-[#d39a29] px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative w-12 h-12 shrink-0">
                <div className="absolute w-[18px] h-[18px] bg-[#132548] rotate-45 left-[9px] top-0 rounded-sm"></div>
                <div className="absolute w-[18px] h-[18px] bg-[#132548] rotate-45 left-0 top-[9px] rounded-sm"></div>
                <div className="absolute w-[18px] h-[18px] bg-[#132548] rotate-45 right-0 top-[9px] rounded-sm"></div>
                <div className="absolute w-[18px] h-[18px] bg-[#d39a29] rotate-45 left-[9px] bottom-0 rounded-sm"></div>
              </div>

              <div>
                <h1 className="text-[15px] sm:text-[20px] font-black text-[#132548] tracking-wide">
                  PRAKATHI AMMAN TRADERS
                </h1>
                <div className="text-[#d39a29] text-[11px] font-bold tracking-widest">
                  [ OHM MURUGA TILES ]
                </div>
                <p className="text-[10px] text-gray-500 mt-1 hidden sm:block">
                  Premium Tiles • Elegant Designs • Trusted Quality
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="flex items-center sm:justify-end gap-2">
                <div className="w-6 h-6 rounded-full bg-[#132548] text-white flex items-center justify-center text-[10px]">
                  ☎
                </div>
                <div className="text-[15px] font-bold text-[#132548]">
                  +91 97502 75999
                </div>
              </div>

              <div className="flex items-start sm:justify-end gap-2 mt-2">
                <div className="w-6 h-6 rounded-full bg-[#d39a29] flex items-center justify-center text-[10px] shrink-0">
                  📍
                </div>
                <div className="text-[11px] leading-5 text-gray-600">
                  482/2, Kunnathur - Perundurai Rd,
                  <br />
                  Perundurai, Tamil Nadu - 638052
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TITLE */}
        <div className="text-center pt-5 pb-4">
          <h2 className="text-[22px] sm:text-[28px] font-black tracking-wide text-[#132548]">
            TILE QUOTATION
          </h2>

          <div className="flex items-center justify-center mt-2 gap-2">
            <div className="w-12 h-[2px] bg-[#d39a29]"></div>
            <div className="text-[#d39a29] text-[16px]">❦</div>
            <div className="w-12 h-[2px] bg-[#d39a29]"></div>
          </div>
        </div>

        {/* CUSTOMER + QUOTATION */}
        <div className="px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-gray-300 rounded-md overflow-hidden">
            <div className="section-ribbon">CUSTOMER DETAILS</div>

            <div className="p-4 pt-5 text-[12px] text-gray-700 space-y-3">
              <div className="flex items-start gap-2">
                <span>👤</span>
                <span className="font-bold text-[#132548]">
                  {data.customer}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span>📞</span>
                <span>{data.mobile_no}</span>
              </div>

              <div className="flex items-start gap-2">
                <span>📍</span>
                <span>{data.address}</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-300 rounded-md overflow-hidden">
            <div className="section-ribbon">QUOTATION DETAILS</div>

            <div className="p-4 pt-5 text-[12px]">
              <div className="grid grid-cols-[110px_1fr] gap-y-3 text-gray-700">
                <div className="font-bold text-[#132548]">Quotation No.</div>
                <div>{data.quotation_no}</div>

                <div className="font-bold text-[#132548]">Date</div>
                <div>{data.entry_date}</div>
              </div>
            </div>
          </div>
        </div>

        {/* TILE DETAILS */}
        <div className="px-3 sm:px-6 mt-5">
          <div className="text-center mb-2">
            <div className="section-ribbon">TILE DETAILS</div>
          </div>

          <div className="table-scroll overflow-x-auto border border-gray-300 rounded-md">
            <table className="w-full min-w-[760px] text-[11px] border-collapse">
              <thead>
                <tr className="bg-[#f4f6fa] text-[#132548]">
                  <th className="border border-gray-300 px-2 py-3 text-center w-12">
                    S.No
                  </th>
                  <th className="border border-gray-300 px-2 py-3 text-left">
                    Item Description
                  </th>
                  <th className="border border-gray-300 px-2 py-3 text-center w-20">
                    Size
                  </th>
                  <th className="border border-gray-300 px-2 py-3 text-center w-20">
                    Sqft
                  </th>
                  <th className="border border-gray-300 px-2 py-3 text-center w-20">
                    Boxes
                  </th>
                  <th className="border border-gray-300 px-2 py-3 text-center w-24">
                    Rate
                  </th>
                  <th className="border border-gray-300 px-2 py-3 text-center w-28">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody>
                {tileItems.length > 0 ? (
                  tileItems.map((item, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="border border-gray-200 px-2 py-4 text-center font-semibold">
                        {i + 1}
                      </td>

                      <td className="border border-gray-200 px-3 py-4 align-top">
                        <div className="font-bold text-[#132548] text-[12px]">
                          {item.tile_categ || "-"} ({item.tile_size || "-"})
                        </div>

                        <div className="text-blue-600 text-[11px] font-semibold mt-1">
                          {item.design_name || "-"}
                        </div>

                        {item.tile_lines?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2 text-[10px]">
                            {Number(item.tile_lines[0]?.dark_box) > 0 && (
                              <span className="bg-gray-100 border border-gray-300 rounded-full px-2 py-1">
                                Dark: {item.tile_lines[0].dark_box} Box
                              </span>
                            )}

                            {Number(item.tile_lines[0]?.light_box) > 0 && (
                              <span className="bg-blue-50 border border-blue-200 rounded-full px-2 py-1">
                                Light: {item.tile_lines[0].light_box} Box
                              </span>
                            )}

                            {Number(item.tile_lines[0]?.highlight_box) > 0 && (
                              <span className="bg-yellow-50 border border-yellow-300 rounded-full px-2 py-1">
                                Highlight: {item.tile_lines[0].highlight_box} Box
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="border border-gray-200 px-2 py-4 text-center">
                        {item.tile_size || "-"}
                      </td>

                      <td className="border border-gray-200 px-2 py-4 text-center">
                        {item.sq_ft || 0}
                      </td>

                      <td className="border border-gray-200 px-2 py-4 text-center">
                        {item.total_box || 0}
                      </td>

                      <td className="border border-gray-200 px-2 py-4 text-center font-semibold">
                        ₹{Number(item.rate || 0).toFixed(2)}
                      </td>

                      <td className="border border-gray-200 px-2 py-4 text-center font-black text-green-700">
                        ₹{getAmount(item).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="border border-gray-200 px-2 py-4 text-center"
                    >
                      No tile items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* OTHER PRODUCTS */}
        {otherItems.length > 0 && (
          <div className="px-3 sm:px-6 mt-5">
            <div className="text-center mb-2">
              <div className="section-ribbon">OTHER PRODUCTS</div>
            </div>

            <div className="table-scroll overflow-x-auto border border-gray-300 rounded-md">
              <table className="w-full min-w-[520px] text-[11px] border-collapse">
                <thead>
                  <tr className="bg-[#f4f6fa] text-[#132548]">
                    <th className="border border-gray-300 px-2 py-3 text-center">
                      S.No
                    </th>
                    <th className="border border-gray-300 px-2 py-3 text-left">
                      Product
                    </th>
                    <th className="border border-gray-300 px-2 py-3 text-center">
                      Qty
                    </th>
                    <th className="border border-gray-300 px-2 py-3 text-center">
                      Rate
                    </th>
                    <th className="border border-gray-300 px-2 py-3 text-center">
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {otherItems.map((item, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="border border-gray-200 px-2 py-4 text-center">
                        {i + 1}
                      </td>
                      <td className="border border-gray-200 px-3 py-4 font-semibold text-[#132548]">
                        {item.product || "-"}
                      </td>
                      <td className="border border-gray-200 px-2 py-4 text-center">
                        {item.qty || 0}
                      </td>
                      <td className="border border-gray-200 px-2 py-4 text-center">
                        ₹{Number(item.rate || 0).toFixed(2)}
                      </td>
                      <td className="border border-gray-200 px-2 py-4 text-center font-black text-green-700">
                        ₹{getAmount(item).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* GRAND TOTAL */}
        <div className="px-3 sm:px-6 mt-6">
          <div className="flex flex-col sm:flex-row border border-[#d39a29] rounded overflow-hidden">
            <div className="grand-total-shape bg-white px-4 sm:px-5 py-4 flex-1 border-r border-[#d39a29]">
              <div className="flex items-start gap-3">
                <div className="text-[24px] shrink-0">🧾</div>

                <div>
                  <div className="font-black text-[#132548] text-[14px] sm:text-[15px]">
                    GRAND TOTAL (₹)
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1 leading-5 capitalize">
                    {totalInWords}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#132548] text-white px-4 sm:px-8 py-4 flex items-center justify-center">
              <div className="text-[24px] sm:text-[32px] font-black tracking-wide whitespace-nowrap">
                ₹{total.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* THANK YOU */}
        <div className="px-4 sm:px-6 mt-8 mb-6">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 sm:w-20 h-[1px] bg-gray-300"></div>
              <div className="text-[#132548] text-lg">❦</div>
              <div className="w-10 sm:w-20 h-[1px] bg-gray-300"></div>
            </div>

            <p className="text-[13px] text-gray-500">
              Thank you for choosing
            </p>

            <h2 className="text-[20px] sm:text-[26px] font-black text-[#132548] mt-2 tracking-wide">
              OHM MURUGA TILES
            </h2>

            <p className="text-[13px] text-gray-500 mt-3">
              We look forward to serving you
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="footer-strip bg-[#132548] text-white px-8 py-3 relative">
          <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] relative z-10 gap-1">
            <div>🌐 www.ohmmurugatiles.com</div>
            <div className="text-[#d39a29] font-semibold tracking-wide text-center">
              Quality Tiles. Trusted Service. Lasting Values.
            </div>
          </div>
        </div>
      </div>

      {/* DOWNLOAD MODAL */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-[340px] rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[20px] font-black text-[#132548]">
                Download File
              </h2>

              <button
                onClick={() => setShowDownloadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <label className="text-[12px] font-semibold text-gray-500 mb-1 block">
              Select Format
            </label>

            <select
              value={downloadType}
              onChange={(e) => setDownloadType(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none text-[14px] text-[#132548] font-semibold focus:border-[#d39a29]"
            >
              <option value="pdf">PDF Document</option>
              <option value="word">Word Document</option>
            </select>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDownloadModal(false)}
                className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-semibold text-[13px]"
              >
                Cancel
              </button>

              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="px-5 py-2.5 rounded-xl bg-[#132548] text-white font-semibold text-[13px] flex items-center gap-2 disabled:opacity-70"
              >
                {isDownloading ? "Preparing..." : "Download"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOAT BUTTONS */}
      <div className="no-print fixed bottom-0 left-0 right-0 sm:bottom-6 sm:left-auto sm:right-6 sm:w-auto bg-white sm:bg-transparent border-t sm:border-0 border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] sm:shadow-none px-4 sm:px-0 py-3 sm:py-0 flex items-center justify-around sm:justify-end sm:flex-col gap-3 z-40">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-[#132548] text-white sm:p-4 px-5 py-2.5 rounded-full shadow-xl text-[13px] font-semibold"
        >
          <Printer size={18} />
          <span className="sm:hidden">Print</span>
        </button>

        <button
          onClick={() => setShowDownloadModal(true)}
          className="flex items-center gap-2 bg-[#d39a29] text-[#132548] sm:p-4 px-5 py-2.5 rounded-full shadow-xl text-[13px] font-semibold"
        >
          <Download size={18} />
          <span className="sm:hidden">Download</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 bg-green-600 text-white sm:p-4 px-5 py-2.5 rounded-full shadow-xl text-[13px] font-semibold"
        >
          <Share2 size={18} />
          <span className="sm:hidden">Share</span>
        </button>
      </div>
    </div>
  );
}

export default QuotationView;