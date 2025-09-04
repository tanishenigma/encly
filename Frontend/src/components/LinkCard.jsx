import { Copy, Download, Trash } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import supabase from "../db/supabase";
import { saveAs } from "file-saver";

const LinkCard = ({ url, setUrls }) => {
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast("Copied to clipboard Successfully!");
    } catch (err) {
      toast.error(`Failed to copy: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("urls").delete().eq("id", id);
    if (!error) {
      setUrls((prev) => prev.filter((u) => u.id !== url.id));
    }

    if (error) {
      toast.error("Failed to delete link: " + error.message);
    } else {
      toast.success("Link deleted successfully!");
    }
  };

  const handleDownload = async (qr, title) => {
    try {
      const response = await fetch(qr);
      const blob = await response.blob();

      // force correct MIME type if Supabase URL doesn’t include an extension
      const file = new File([blob], `${title || "qr-code"}.png`, {
        type: "image/png",
      });

      saveAs(file);
    } catch (error) {
      toast.error("Failed to download QR: " + error.message);
    }
  };

  return (
    <div
      key={url.id}
      className="flex justify-between p-5 rounded-5xl border-b-2 border-primary/5 ">
      {/* Grid with 4 columns: QR | Title | Short URL | Original URL + Copy */}
      <div className="grid grid-cols-[200px_150px_1fr_auto] items-center gap-4 text-slate-50">
        {/* QR Code */}
        <img
          src={url?.qr}
          alt="QR-Code"
          className="w-50 h-50 border-2 border-primary/30 rounded-xl"
        />
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
      <div className="">
        <button
          className="p-2 cursor-pointer hover:scale-110 duration-200 hover:text-blue-500"
          onClick={() => copyToClipboard(url.short_url)}>
          <Copy size={25} />
        </button>
        <button
          className="p-2 cursor-pointer hover:scale-110 duration-200 hover:text-red-500"
          onClick={() => {
            handleDelete(url.id);
          }}>
          <Trash size={25} />
        </button>
        <button
          className="p-2 cursor-pointer hover:scale-110 duration-200 hover:text-primary "
          title="Download QR Code"
          onClick={() => handleDownload((url?.qr, url?.title))}>
          <Download size={25} />
        </button>
      </div>
    </div>
  );
};
export default LinkCard;
