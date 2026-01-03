import { Copy, Download, LinkIcon, LoaderCircle, Trash } from "lucide-react";
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import QRCode from "react-qr-code";
import { deleteUrl } from "../services/urlService";

const LinkCard = ({ url, setUrls }) => {
  const [loading, setLoading] = useState(false);
  const qrRef = useRef();

  const copyToClipboard = async (text) => {
    // 1. Try the modern Clipboard API (works on localhost and HTTPS)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        toast.success("Link copied to clipboard!");
        return;
      } catch (err) {
        console.warn("Clipboard API failed, trying fallback...", err);
      }
    }

    // 2. Fallback for non-secure contexts (like HTTP on local IP)
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;

      // Ensure the textarea is not visible but part of the DOM
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "0";
      document.body.appendChild(textArea);

      textArea.focus();
      textArea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        toast.success("Link copied to clipboard!");
      } else {
        throw new Error("Copy command failed");
      }
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy link");
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteUrl(id);
      setUrls((prev) => prev.filter((u) => u._id !== id));
      toast.success("Link deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete link: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (title) => {
    try {
      const svg = qrRef.current.querySelector("svg");
      if (!svg) throw new Error("QR Code not found");

      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);

      const blob = new Blob([svgString], {
        type: "image/svg+xml;charset=utf-8",
      });
      const urlBlob = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = urlBlob;
      link.download = `${title || "qr-code"}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(urlBlob);
      toast.success("QR Code downloaded!");
    } catch (err) {
      toast.error("Download Error: " + err.message);
    }
  };

  const shortLink = `${import.meta.env.VITE_BACKEND_URL}/${url.short_url}`;

  return (
    <div
      key={url._id}
      className="flex justify-between p-2 md:p-5 rounded-5xl border-b-2 border-primary/5 "
      ref={qrRef}>
      {/* Grid with 4 columns: QR | Title | Short URL | Original URL + Copy */}
      <div className="grid md:grid-cols-[200px_150px_1fr_auto] md:place-items-start items-center gap-4 text-slate-50">
        {/* QR Code */}
        <div className="relative inline-block">
          <QRCode
            value={shortLink}
            size={200}
            fgColor="#2f1945"
            bgColor="#ffffff"
            style={{ borderRadius: "4px" }}
          />

          <div className="opacity-0 md:opacity-100 absolute md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-12 h-12 rounded-full border-slate-50/5 border-2 flex items-center justify-center bg-slate-50">
              <LinkIcon className="shadow-lg shadow-black/30 w-10 h-10 p-2 text-[#1f1c33]" />
            </div>
          </div>
        </div>

        <div className="grid whitespace-nowrap">
          <Link to={`/link/${url?._id}`}>
            {/* Title */}
            <p className="hover:text-primary cursor-pointer text-5xl font-black mb-2">
              {url.title}
            </p>
          </Link>
          {/* Short URL */}
          <Link
            className="text-primary hover:text-primary/80 cursor-pointer text-3xl"
            to={`/link/${url?._id}`}>
            {import.meta.env.VITE_BACKEND_URL}/
            {url?.custom_url ? url?.custom_url : url.short_url}
          </Link>
          {/* Original URL + Copy */}
          <Link
            className="text-slate-400 cursor-pointer"
            to={`/link/${url?._id}`}>
            <p className="">{url.original_url}</p>
          </Link>
          <span className="text-slate-400 font-medium mt-5">
            {new Date(url?.created_at).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-start relative">
        <button
          className="p-2 md:top-5 md:right-0 absolute top-5 right-5 cursor-pointer hover:scale-110 duration-200 hover:text-blue-500"
          onClick={() => copyToClipboard(shortLink)}>
          <Copy size={25} />
        </button>
        <button
          className="p-2 md:top-15 md:right-0 absolute top-35 right-5 cursor-pointer hover:scale-110 duration-200 hover:text-red-500"
          onClick={() => {
            handleDelete(url._id);
          }}>
          {loading ? <LoaderCircle /> : <Trash size={25} />}
        </button>
        <button
          className="p-2 md:top-25 md:right-0 absolute top-20 right-5 cursor-pointer hover:scale-110 duration-200 hover:text-primary"
          title="Download QR Code"
          onClick={() => handleDownload(url?.title)}>
          <Download size={25} />
        </button>
      </div>
    </div>
  );
};
export default LinkCard;
