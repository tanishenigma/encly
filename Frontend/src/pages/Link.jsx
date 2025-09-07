import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserUrls } from "../services/urlService";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";
import { auth } from "../lib/firebase";
import { getLongUrl, storeClicks } from "../services/clickServices";

export default function Link() {
  const { id } = useParams();
  const [getUrls, setUrls] = useState("");
  const [clicks, setClicks] = useState(null);
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
          const clickData = await storeClicks(id, getLongUrl);
          await getLongUrl(id);
          setClicks(clickData);
        } catch (error) {
          toast.error("Failed to fetch URLs: " + error.message);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">{pageData.title}</h1>
      <p className="mb-6 text-gray-500">{pageData.description}</p>

      {pageData.links?.map((link, i) => (
        <a
          key={i}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-sm p-4 my-2 text-center rounded-lg bg-pink-500 text-white font-semibold shadow-lg hover:bg-pink-600">
          {link.label}
        </a>
      ))}
    </div>
  );
}
