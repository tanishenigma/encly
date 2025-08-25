import React, { useContext, useState } from "react";
import { ID, Permission, Role } from "appwrite";
import { storage } from "../lib/appwrite";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { toast } from "sonner";
import UserContext from "../contexts/UserContext";

const Dashboard = () => {
  const currentuser = auth.currentUser;
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { profilePic } = useContext(UserContext);

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
  return (
    <div className="flex flex-col gap-y-5 items-center">
      <h1 className="text-6xl font-black">Dashboard</h1>
      <div className="bg-primary/10 rounded-xl h-auto backdrop-blur-2xl shadow-2xl p-10 ">
        {/* File upload */}
        <div className="flex flex-col bg-primary/10 p-5 rounded-xl justify-center  items-center">
          <img src={profilePic} className="rounded-full w-50 h-50 m-5" />
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
            className="px-4 py-2 bg-primary text-slate-50 rounded-lg block m-5">
            {uploading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
