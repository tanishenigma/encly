import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";
import { auth } from "../lib/firebase";
import { storeClicks } from "../services/clickServices";
import { getUserUrls } from "../services/urlService";

export default function Link() {
  const { id } = useParams();
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get all URLs for the user
          const urls = await getUserUrls();
          setPageData(urls.find((u) => u.id === id)); // store current URL's data

          // Record click only
          await storeClicks({ id });
        } catch (error) {
          toast.error("Failed to fetch data: " + error.message);
        }
      }
    });

    return () => unsubscribe();
  }, [id]);

  if (!pageData) {
    return (
      <div className="flex items-center justify-center p-6">Loading...</div>
    );
  }

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
