import React, { useContext, useEffect, useState } from "react";
import { ID, Permission, Role } from "appwrite";
import { storage } from "../lib/appwrite";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { toast } from "sonner";
import UserContext from "../contexts/UserContext";
import { Copy, Filter } from "lucide-react";
import { getUserUrls } from "../services/urlService";
import { onAuthStateChanged } from "firebase/auth";

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { profilePic } = useContext(UserContext);
  const [urls, setUrls] = useState([]);
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
      const username = auth.currentUser;

      if (user) {
        try {
          const data = await getUserUrls();
          setUrls(data);
        } catch (error) {
          toast.error("Failed to fetch URLs: " + error.message);
        }
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <div className="grid gap-30 w-full">
      <div className="flex flex-col gap-y-5 items-center">
        <h1 className="text-6xl font-black">Dashboard</h1>
        <div className="bg-primary/10 rounded-xl h-auto backdrop-blur-2xl shadow-2xl p-10 ">
          {/* File upload */}
          <div className="flex flex-col bg-primary/10 p-5 rounded-xl justify-center  items-center">
            <img
              src={
                profilePic ||
                "https://media.istockphoto.com/id/1393750072/vector/flat-white-icon-man-for-web-design-silhouette-flat-illustration-vector-illustration-stock.jpg?s=612x612&w=0&k=20&c=s9hO4SpyvrDIfELozPpiB_WtzQV9KhoMUP9R9gVohoU="
              }
              className="rounded-full w-50 h-50 m-5"
            />
            <p className="text-center font-bold text-2xl m-4">
              Hello, {currentuser?.displayName}
            </p>
            <p className="font-semibold p-5 border-t-1 border-slate-50/50 w-full text-center">
              Change Your Profile Picture
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="g-primary/10 p-5 rounded-full
             file:bg-primary/10 file:text-white file:px-4 file:py-2
             file:rounded-full file:border-none
             file:cursor-pointer
             file:text-sm
             file:hover:bg-primary "
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
            <p className="pt-5 ">{urls.length}</p>
          </div>

          <div className="bg-primary/5 w-full text-2xl font-semibold  text-slate-50 rounded-xl p-10 h-50 border-2 border-primary/20 backdrop-blur-md">
            Total Clicks
            <p className="pt-5">0</p>
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
            />
            <Filter className="absolute hover:scale-110 duration-300 cursor-pointer " />
          </div>
          <div>
            <div className="bg-primary/10 w-full h-fit mt-5 rounded-xl p-5 ">
              {urls.length != 0 ? (
                <table className="min-w-full border border-primary/30 text-slate-50 text-left">
                  <thead className="bg-primary/10">
                    <tr>
                      <th className="px-4 py-2">Short URL</th>
                      <th className="px-4 py-2 ">Original URL</th>
                      <th className="px-4 py-2">Copy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {urls.map((u) => (
                      <tr key={u.id}>
                        <td className="px-4 py-2 text-pink-600 underline">
                          <a
                            href={u.short_url}
                            target="_blank"
                            rel="noopener noreferrer">
                            {u.short_url}
                          </a>
                        </td>
                        <td className="px-4 py-2  text-primary">
                          {u.original_url}
                        </td>
                        <td className="px-4 py-2">
                          <button className="px-2 py-1 cursor-pointer  text-white rounded hover:scale-110 duration-300">
                            <Copy />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
