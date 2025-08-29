import React, { useContext, useEffect, useState } from "react";
import { ID, Permission, Role } from "appwrite";
import { storage } from "../lib/appwrite";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { toast } from "sonner";
import UserContext from "../contexts/UserContext";
import { ClipboardClock, Copy, Filter } from "lucide-react";
import { getUserUrls } from "../services/urlService";
import { onAuthStateChanged } from "firebase/auth";
import { getClicks } from "../services/clickServices";
import LinkCard from "../components/LinkCard";

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { profilePic } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [urls, setUrls] = useState([]);
  const [clicks, setClicks] = useState(null);
  const currentuser = auth.currentUser;

  const handleUpload = async () => {
    if (!file) return toast("Please choose a file first");
    setUploading(true);

    try {
      const response = await storage.createFile(
        import.meta.env.VITE_APPWRITE_STORAGE_BUCKET,
        ID.unique(),
        file,
        [Permission.read(Role.any())]
      );
      await setDoc(
        doc(db, "users", currentuser.uid),
        {
          profilePicFileId: response.$id,
        },
        { merge: true }
      );
      setUploading(false);
    } catch (error) {
      toast.error(`Upload failed: ${error.message}`);
    }
  };

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
    <div className="grid gap-30 w-full">
      <div className="flex flex-col gap-y-5 items-center">
        <h1 className="text-6xl font-black">Dashboard</h1>
        <div className="bg-primary/10 rounded-xl h-auto backdrop-blur-2xl shadow-2xl p-10 ">
          {/* File upload */}
          <div className="bg-primary/10 p-5 rounded-xl justify-center  items-center flex flex-col">
            <img
              src={
                profilePic ||
                "https://media.istockphoto.com/id/1393750072/vector/flat-white-icon-man-for-web-design-silhouette-flat-illustration-vector-illustration-stock.jpg?s=612x612&w=0&k=20&c=s9hO4SpyvrDIfELozPpiB_WtzQV9KhoMUP9R9gVohoU="
              }
              className="rounded-full w-50 h-50 m-5 object border-2 border-primary/80"
              alt="profile-picture"
            />
            <p className="text-center font-bold text-2xl m-4">
              Hello, {currentuser?.displayName}
            </p>
            <label
              htmlFor="upload"
              className="font-semibold p-5 border-t border-slate-50/50 w-full text-center block">
              Upload your profile picture
            </label>

            <input
              id="upload"
              name="profile-picture"
              type="file"
              accept="image/*"
              aria-label="Upload your profile picture"
              onChange={(e) => setFile(e.target.files[0])}
              className="g-primary/10 p-5 rounded-full
    file:bg-primary/10 file:text-white file:px-4 file:py-2
    file:rounded-full file:border-none
    file:cursor-pointer
    file:text-sm
    file:hover:bg-primary"
            />

            {/* Save button */}
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-4 py-2 bg-primary text-slate-50 rounded-lg block m-5 cursor-pointer">
              {uploading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
      {/* {Links Section} */}
      <div>
        <div className="flex w-full gap-5 items-center">
          <div className="bg-primary/5 w-full text-2xl font-semibold  text-slate-50 rounded-xl p-10 h-50 border-2 border-primary/20 backdrop-blur-md">
            Links Created
            <p className="pt-5 ">{urls?.length}</p>
          </div>

          <div className="bg-primary/5 w-full text-2xl font-semibold  text-slate-50 rounded-xl p-10 h-50 border-2 border-primary/20 backdrop-blur-md">
            Total Clicks
            <p className="pt-5">{clicks?.length}</p>
          </div>
        </div>
      </div>
      <div className="border-t-1 border-purple-400/20">
        <div className="">
          <div className="flex justify-between py-15">
            <h1 className="text-6xl font-bold">My Links</h1>
            <button className="bg-primary rounded-lg px-5 cursor-pointer">
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
                      <LinkCard key={i} url={u} filteredUrls={filteredUrls} />
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
  );
};

export default Dashboard;
