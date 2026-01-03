import React, { useContext, useState } from "react";
import { auth } from "../lib/firebase";
import { toast } from "sonner";
import UserContext from "../contexts/UserContext";
import { updateUserProfile } from "../services/userService";
import { LoaderCircle } from "lucide-react";

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { profilePic, setProfilePic } = useContext(UserContext);

  const currentuser = auth.currentUser;

  const handleUpload = async () => {
    if (!file) return toast("Please choose a file first");
    setUploading(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result;
        await updateUserProfile({ profile_picture: base64data });
        setProfilePic(base64data);
        toast.success("Profile picture updated successfully!");
        setUploading(false);
        setFile(null);
      };
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload profile picture");
      setUploading(false);
    }
  };

  return (
    <div className="grid md:w-full  justify-center">
      <div className="flex flex-col  gap-y-5 items-center">
        <h1 className="text-4xl  md:text-6xl font-black ">Dashboard</h1>
        <div className="md:bg-primary/10 rounded-xl h-auto backdrop-blur-sm shadow-2xl md:p-10 w-[75%] md:w-full">
          {/* File upload */}
          <div className="bg-primary/10 p-10 rounded-xl justify-center  items-center flex flex-col backdrop-blur-sm ">
            <img
              src={
                profilePic ||
                "https://media.istockphoto.com/id/1393750072/vector/flat-white-icon-man-for-web-design-silhouette-flat-illustration-vector-illustration-stock.jpg?s=612x612&w=0&k=20&c=s9hO4SpyvrDIfELozPpiB_WtzQV9KhoMUP9R9gVohoU="
              }
              className="rounded-full w-30 h-30 md:w-50 md:h-50 m-3 md:m-5 object border-2 border-primary/80"
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
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="mt-4 bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-primary/80 disabled:opacity-50 flex items-center gap-2">
              {uploading ? (
                <>
                  <LoaderCircle className="animate-spin" size={20} />{" "}
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </button>

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
    </div>
  );
};

export default Dashboard;
