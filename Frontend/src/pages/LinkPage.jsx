import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { getClicks } from "../services/clickServices";
import { getUserUrls } from "../services/urlService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Filter } from "lucide-react";
import LinkCard from "../components/LinkCard";
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
      {!create ? (
        <div className="w-full">
          <div className="flex w-full gap-5 items-center mb-20">
            <div className="bg-primary/5 w-full text-2xl font-semibold  text-slate-50 rounded-xl p-10 h-50 border-2 border-primary/20 backdrop-blur-xl">
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
        <CreateLink
          filteredUrls={filteredUrls}
          create={create}
          setCreate={setCreate}
          setSearchQuery={setSearchQuery}
          setUrls={setUrls}
          urls={urls}
          clicks={clicks}
        />
      )}
    </>
  );
};

export default LinkPage;
