import { Copy, Download, LinkIcon, LoaderCircle, Trash } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import supabase from "../db/supabase";
import QRCode from "react-qr-code";

const LinkCard = ({ url, setUrls }) => {
  const [loading, setLoading] = useState(false);
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText("https://enc.ly/" + text);
      toast("Copied to clipboard Successfully!");
    } catch (err) {
      toast.error(`Failed to copy: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    const { error } = await supabase.from("urls").delete().eq("id", id);
    if (!error) {
      setUrls((prev) => prev.filter((u) => u.id !== url.id));
    }
    setLoading(false);
    if (error) {
      toast.error("Failed to delete link: " + error.message);
    } else {
      toast.success("Link deleted successfully!");
    }
  };

  const handleDownload = async () => {
    try {
      const imageUrl = url?.qr;
      const fileName = url?.title;
      const anchor = document.createElement("a");
      anchor.href = imageUrl;
      anchor.download = fileName;

      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } catch (error) {
      toast.error("Failed to download QR: " + error.message);
    }
  };

  return (
    <div
      key={url.id}
      className="flex justify-between p-2 md:p-5 rounded-5xl border-b-2 border-primary/5 ">
      {/* Grid with 4 columns: QR | Title | Short URL | Original URL + Copy */}
      <div className="grid md:grid-cols-[200px_150px_1fr_auto]  md:place-items-start items-center gap-4 text-slate-50">
        {/* QR Code */}
        <div className="relative inline-block">
          <QRCode
            value={
              url.short_url
                ? `https://enc.ly/${url.short_url}`
                : url.original_url
            }
            size={200}
            fgColor="#2f1945"
            bgColor="#ffffff"
            style={{ borderRadius: "4px" }}
          />

          <div className="opacity-0 md:opacity-100 absolute md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-12 h-12 rounded-full border-slate-50/5  border-2  flex items-center justify-center bg-slate-50">
              <LinkIcon className="shadow-lg shadow-black/30 w-10 h-10 p-2  text-[#1f1c33]" />
            </div>
          </div>
        </div>

        <div className="grid whitespace-nowrap ">
          {" "}
          <div>
            {" "}
            <Link to={`/link/${url?.id}`}>
              {/* Title */}
              <p className=" hover:text-primary cursor-pointer text-5xl font-black mb-2">
                {url.title}
              </p>
            </Link>
            {/* Short URL */}
            <Link
              className=" text-primary hover:text-primary/80 cursor-pointer text-3xl "
              to={`/link/${url?.id}`}>
              https://enc.ly/
              {url?.custom_url ? url?.custom_url : url.short_url}
            </Link>
            {/* Original URL + Copy */}
            <Link
              className="text-slate-400 cursor-pointer"
              to={`/link/${url?.id}`}>
              <p className="">{url.original_url}</p>
            </Link>
          </div>
          <span className="text-slate-400 font-medium mt-5 ">
            {new Date(url?.created_at).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </span>{" "}
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-start relative">
        <button
          className="p-2 md:top-5 md:right-0 absolute top-5 right-5 cursor-pointer hover:scale-110 duration-200 hover:text-blue-500"
          onClick={() => copyToClipboard(url.short_url)}>
          <Copy size={25} />
        </button>
        <button
          className="p-2 md:top-15 md:right-0  absolute top-35 right-5  cursor-pointer hover:scale-110 duration-200 hover:text-red-500"
          onClick={() => {
            handleDelete(url.id);
          }}>
          {loading ? <LoaderCircle /> : <Trash size={25} />}
        </button>
        <button
          className="p-2 md:top-25 md:right-0 absolute top-20 right-5 cursor-pointer hover:scale-110 duration-200 hover:text-primary "
          title="Download QR Code"
          onClick={() => handleDownload()}>
          <Download size={25} />
        </button>
      </div>
    </div>
  );
};
export default LinkCard;
