import { Filter, X } from "lucide-react";
import React, { useState } from "react";
import LinkCard from "./LinkCard";
import { createShortUrl } from "../services/urlService";
import { toast } from "sonner";
import { LinkIcon } from "lucide-react";
import QRCode from "react-qr-code";

const CreateLink = ({
  create,
  setCreate,
  filteredUrls,
  setSearchQuery,
  setUrls,
  urls,
  clicks,
}) => {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [custom, setCustom] = useState("");
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const result = await createShortUrl({
        originalUrl: link,
        customUrl: custom,
        title: title,
      });
      setUrls((prev) => [...prev, result]);

      setTitle("");
      setLink("");
      setCustom("");
      toast.success("Short URL created!");
    } catch (error) {
      toast.error(error.message || "Failed to create short URL");
    }
  };
  return (
    <div className="relative flex justify-center items-start w-full ">
      <div
        className={
          create
            ? `fixed mt-10 bg-primary/10 backdrop-blur-sm flex flex-col items-center gap-y-5 z-200 rounded-xl p-15 py-25 drop-shadow-2xl transition-all duration-100`
            : ` -top-200 bg-primary/10 backdrop-blur-sm flex flex-col items-center gap-y-5 z-200 rounded-xl p-15 py-25 drop-shadow-2xl transition-all duration-100`
        }>
        <X
          className="cursor-pointer absolute bottom-168 left-98"
          onClick={() => {
            setCreate(!create);
          }}
          size={30}
        />
        <form
          className="flex flex-col justify-center items-center gap-y-5 "
          onSubmit={handleCreate}>
          <div>
            <h1 className="text-5xl font-black "> Create Lynk</h1>
          </div>{" "}
          <div className="relative inline-block">
            <QRCode
              value={custom ? `https://enc.ly/${custom}` : link}
              size={200}
              fgColor="#2f1945"
              bgColor="#ffffff"
              style={{ borderRadius: "4px" }}
            />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-12 h-12 rounded-full border-slate-50/5  border-2  flex items-center justify-center bg-slate-50">
                <LinkIcon className="shadow-lg shadow-black/30 w-10 h-10 p-2  text-[#1f1c33]" />
              </div>
            </div>
          </div>
          <input
            placeholder="Name "
            className="bg-primary/10 w-full border-2 border-primary/10 p-2 rounded-xl outline-none"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            name="title"
            value={title}
          />
          <input
            placeholder="Enter Your Lynk"
            className="bg-primary/10 w-full border-2 border-primary/10 p-2 rounded-xl outline-none"
            onChange={(e) => {
              setLink(e.target.value);
            }}
            name="link"
            value={link}
          />
          <div className="bg-primary/10 w-fit border-2 border-primary/10 p-2 rounded-xl o">
            <span>Enc.ly/ </span>
            <input
              className="outline-none"
              placeholder="Custom Lynk (optional)"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
            />
          </div>
          <button
            className={`p-2 w-full rounded-full text-slate-50 ${
              title.trim().length > 0 && /^https?:\/\/.+/.test(link)
                ? "bg-primary cursor-pointer"
                : "bg-primary/50 cursor-not-allowed"
            }`}
            type="submit"
            disabled={
              !(title.trim().length > 0 && /^https?:\/\/.+/.test(link))
            }>
            Encly
          </button>
        </form>
      </div>

      <div className="w-full blur-md">
        <div className="flex w-full gap-5 items-center mb-20">
          <div className="bg-primary/5 w-full text-2xl font-semibold  text-slate-50 rounded-xl p-10 h-50 border-2 border-primary/20 backdrop-blur-xl">
            Links Created
            <p className="pt-5 ">{urls?.length}</p>
          </div>

          <div className="bg-primary/5 w-full text-2xl font-semibold  text-slate-50 rounded-xl p-10 h-50 border-2 border-primary/20 backdrop-blur-md ">
            Total Clicks
            <p className="pt-5">{clicks?.length}</p>
          </div>
        </div>
        <div className="border-1 border-purple-400/20 ">
          <div className="">
            <div className="flex justify-between py-15">
              <h1 className="text-6xl font-bold">My Links</h1>
              <button className="bg-primary rounded-lg px-5">
                Create Link
              </button>
            </div>
            <div className="flex justify-end w-full bg-primary/10 rounded-md p-4 mt-5 border-2 border-primary/20 relative">
              <input
                className="w-full focus-within:outline-0"
                placeholder="Filter Links..."
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
              />
              <Filter className="absolute hover:scale-110 duration-300 cursor-pointer " />
            </div>
            <div>
              <div className="flex bg-primary/10 w-full h-fit mt-5 rounded-xl p-5 ">
                {urls.length != 0 ? (
                  <div className="min-w-full border border-primary/30 text-slate-50 text-left  md:flex-row">
                    <div className="bg-primary/10"></div>
                    <div>
                      {(filteredUrls || []).map((u, i) => (
                        <LinkCard
                          key={i}
                          url={u}
                          filteredUrls={filteredUrls}
                          setUrls={setUrls}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-400 font-light"> No Links Yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLink;
