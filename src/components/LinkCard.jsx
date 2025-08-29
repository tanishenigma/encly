import { Copy } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const LinkCard = ({ url, filteredUrls }) => {
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast("Copied to clipboard Successfully!");
    } catch (err) {
      toast.error(`Failed to copy: ${err.message}`);
    }
  };
  return (
    <div key={url.id}>
      <img src={url?.qr} alt="QR-Code" className="object-cover w-10" />
      <div className="px-4 py-2 text-slate-50 hover:text-primary ">
        <p>{url.title}</p>
      </div>
      <div className="px-4 py-2 text-slate-50 hover:text-primary  underline">
        <a href={url.short_url} target="_blank" rel="noopener noreferrer">
          {url.short_url}
        </a>
      </div>
      <div className="px-4 py-2 text-slate-50   hover:text-primary">
        {url.original_url}
      </div>
      <div className="px-4 py-2">
        <button
          className="px-2 py-1 cursor-pointer  text-white rounded hover:scale-110 duration-300"
          aria-hidden="true">
          <Copy
            onClick={() => {
              copyToClipboard(url.short_url);
            }}
          />
        </button>
      </div>
    </div>
  );
};

export default LinkCard;
