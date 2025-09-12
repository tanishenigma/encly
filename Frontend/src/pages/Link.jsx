import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";
import { auth } from "../lib/firebase";
import { storeClicks, getClicksForUrl } from "../services/clickServices";
import { getUserUrls } from "../services/urlService";
import Loading from "../components/Loading";

export default function Link() {
  const { id } = useParams();
  const [pageData, setPageData] = useState(null);
  const [clicks, setClicks] = useState([]);
  console.log("Route id:", id);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const urls = await getUserUrls();
          const found = urls.find((u) => String(u.id) === String(id));
          setPageData(found || null);

          if (found) {
            await storeClicks({ id, originalUrl: found.original_url });

            const allClicks = await getClicksForUrl(id);
            console.log("✅ clicks:", allClicks);
            setClicks(allClicks);
          }
        } catch (error) {
          toast.error("Failed to fetch data: " + error.message);
        }
      }
    });

    return () => unsubscribe();
  }, [id]);

  if (!pageData) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">{pageData.title}</h1>
      <p className="mb-6 text-gray-500">
        Original URL: {pageData.original_url}
      </p>

      <a
        href={pageData.original_url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full max-w-sm p-4 my-2 text-center rounded-lg bg-primary text-slate-50 font-semibold shadow-lg hover:bg-primary/90">
        Go to site
      </a>

      {/* 3️⃣ Show clicks info */}
      <div className="mt-8 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-2">Click Stats</h2>
        {clicks.length === 0 ? (
          <p className="text-gray-500">No clicks yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {clicks.map((click, idx) => (
              <li key={idx} className="py-2">
                {click.city}, {click.country} • 📱 {click.device}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
