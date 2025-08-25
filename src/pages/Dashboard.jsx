import React, { useState } from "react";
import { ID, Permission, Role } from "appwrite";
import { storage } from "../lib/appwrite";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { toast } from "sonner";

const Dashboard = () => {
  const user = auth.currentUser;
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please choose a file first");
    setUploading(true);

    try {
      const response = await storage.createFile(
        import.meta.env.VITE_APPWRITE_STORAGE_BUCKET,
        ID.unique(),
        file,
        [Permission.read(Role.any())]
      );
      await setDoc(
        doc(db, "users", user.uid),
        {
          profilePicFileId: response.$id,
        },
        { merge: true }
      );
      setUploading(false);
    } catch (error) {
      toast(" Upload failed:", error);
    }
  };
  return (
    <div className="flex flex-col gap-y-5 items-center">
      <h1 className="text-6xl font-black">Dashboard</h1>
      <div className="flex flex-col gap-y-10 bg-primary/10 rounded-xl h-auto backdrop-blur-2xl shadow-2xl p-10">
        {/* File upload */}

        <div className="bg-primary/10 p-5 rounded-xl">
          <p className="font-semibold ">Change Profile Picture</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className=""
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
