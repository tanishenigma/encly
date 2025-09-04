import { Filter, X } from "lucide-react";
import React from "react";
import LinkCard from "./LinkCard";

// const handleCreate = async () => {
//   const { data, error } = await supabase.from("urls").insert([{}]);
// };
const CreateLink = ({
  create,
  setCreate,
  filteredUrls,
  setSearchQuery,
  setUrls,
  urls,
  clicks,
}) => {
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
        <div className="flex justify-between w- ">
          <h1 className="text-5xl font-black "> Create Lynk</h1>
        </div>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png"
          className="size-50"
        />
        <input
          placeholder="Name of your lynk"
          className="bg-primary/10 w-full border-2 border-primary/10 p-2 rounded-xl outline-none"
        />
        <input
          placeholder="Enter Your Lynk"
          className="bg-primary/10 w-full border-2 border-primary/10 p-2 rounded-xl outline-none"
        />
        <div className="bg-primary/10 w-fit border-2 border-primary/10 p-2 rounded-xl o">
          <span>Enc.ly/ </span>
          <input
            className="outline-none"
            placeholder="Custom Lynk (optional)"
          />
        </div>

        <button className="bg-primary p-2 w-full rounded-full cursor-pointer text-slate-50">
          Encly
        </button>
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
