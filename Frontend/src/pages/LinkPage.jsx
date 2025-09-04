import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { toast } from "sonner";
import { getClicks } from "../services/clickServices";
import { getUserUrls } from "../services/urlService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Cross, CrossIcon, Filter, X } from "lucide-react";
import LinkCard from "../components/LinkCard";
import supabase from "../db/supabase";
import CreateLink from "../components/CreateLink";

const LinkPage = () => {
  const [urls, setUrls] = useState([]);
  const [clicks, setClicks] = useState(null);
  const [create, setCreate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const data = await getUserUrls();
          setUrls(data);
        } catch (error) {
          toast.error("Failed to fetch URLs: " + error.message);
        }
      }

      if (user) {
        try {
          const clickData = await getClicks();
          setClicks(clickData);
        } catch (error) {
          toast.error("Failed to fetch URLs: " + error.message);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const popCreate = () => {
    <CreateLink />;
  };

  const filteredUrls = urls?.filter((url) => {
    return (
      (url.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (url.short_url?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (url.original_url?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      )
    );
  });

  return (
    <>
      {create ? (
        <div className="w-full">
          <div className="flex w-full gap-5 items-center mb-20">
            <div className="bg-primary/5 w-full text-2xl font-semibold  text-slate-50 rounded-xl p-10 h-50 border-2 border-primary/20 backdrop-blur-md">
              Links Created
              <p className="pt-5 ">{urls?.length}</p>
            </div>

            <div className="bg-primary/5 w-full text-2xl font-semibold  text-slate-50 rounded-xl p-10 h-50 border-2 border-primary/20 backdrop-blur-sm ">
              Total Clicks
              <p className="pt-5">{clicks?.length}</p>
            </div>
          </div>
          <div className="border-t-1 border-purple-400/20 ">
            <div className="">
              <div className="flex justify-between py-15">
                <h1 className="text-6xl font-bold">My Links</h1>
                <button
                  onClick={() => {
                    setCreate((prev) => !prev);
                    console.log(create);
                  }}
                  className="bg-primary rounded-lg px-5 cursor-pointer">
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
      ) : (
        <div className="relative flex justify-center items-start w-full">
          <div className="fixed mt-30 bg-primary/10 backdrop-blur-sm  flex flex-col items-center gap-y-5 z-200 rounded-xl p-15 py-25 drop-shadow-2xl">
            <X
              className="cursor-pointer absolute top-5 left-80"
              onClick={() => {
                setCreate(!create);
              }}
            />
            <div className="flex justify-between gap-x-2 ">
              <h1 className="text-5xl font-black "> Create link</h1>
            </div>
            <input
              placeholder="Enter Your Lynk"
              className="bg-primary/10 border-2 border-primary/10 p-2 rounded-xl outline-none"
            />
            <button className="bg-primary p-4 w-60 rounded-full cursor-pointer text-slate-50">
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
      )}
    </>
  );
};

export default LinkPage;
