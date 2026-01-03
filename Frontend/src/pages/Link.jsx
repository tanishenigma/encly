import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";
import { auth } from "../lib/firebase";
import { storeClicks, getClicksForUrl } from "../services/clickServices";
import { getUserUrls } from "../services/urlService";
import Loading from "../components/Loading";
import { MapPin, Monitor, Smartphone } from "lucide-react";
// Geographic visualization component
function ClickMap({ clicks }) {
  const locationCounts = clicks.reduce((acc, click) => {
    const key = `${click.city}, ${click.country}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const totalClicks = clicks.length;

  return (
    <div className="bg-primary/10 rounded-lg p-5 mt-6">
      <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>

      <div className="space-y-3">
        {Object.entries(locationCounts).map(([location, count]) => {
          const percentage = ((count / totalClicks) * 100).toFixed(1);
          return (
            <div key={location} className="bg-white rounded-md p-3 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-medium text-gray-700">{location}</span>
                </div>
                <span className="text-sm font-semibold text-primary ml-2">
                  ({count} clicks)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {percentage}% of total
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Device stats component
function DeviceStats({ clicks }) {
  const deviceCounts = clicks.reduce((acc, click) => {
    acc[click.device] = (acc[click.device] || 0) + 1;
    return acc;
  }, {});

  const totalClicks = clicks.length;

  return (
    <div className="bg-primary/10 rounded-lg p-5 mt-6">
      <h3 className="text-lg font-semibold mb-4">Device Breakdown</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(deviceCounts).map(([device, count]) => {
          const percentage = ((count / totalClicks) * 100).toFixed(1);
          const Icon =
            device.toLowerCase().includes("mobile") ||
            device.toLowerCase().includes("phone")
              ? Smartphone
              : Monitor;

          return (
            <div
              key={device}
              className="bg-white rounded-md p-4 shadow-sm text-center">
              <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="font-medium text-gray-700 text-sm mb-1">{device}</p>
              <p className="text-2xl font-bold text-primary">{count}</p>
              <p className="text-xs text-gray-500">{percentage}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Recent Activity component with custom scrollbar
function RecentActivity({ clicks }) {
  return (
    <div className="bg-primary/10 rounded-lg p-5">
      <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
      <div className="recent-activity-scroll  space-y-2 max-h-96 overflow-y-auto pr-2">
        {clicks.map((click, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm text-gray-700">
                {click.city}, {click.country}
              </span>
            </div>
            <span className="text-xs text-gray-500 bg-primary/10 px-3 py-1 rounded-full">
              {click.device}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Link() {
  const { id } = useParams();
  const [pageData, setPageData] = useState(null);
  const [clicks, setClicks] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const urls = await getUserUrls();
          const found = urls.find((u) => String(u._id) === String(id));
          setPageData(found || null);

          if (found) {
            await storeClicks({
              id,
              originalUrl: found.original_url,
              shortUrl: found.short_url,
            });

            const allClicks = await getClicksForUrl(id);
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
      <h1 className="text-8xl font-bold mb-4">{pageData.title}</h1>
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

      <div className="mt-8 w-full max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Click Stats</h2>
          <div className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold ">
            {clicks.length} Total Clicks
          </div>
        </div>

        {clicks.length === 0 ? (
          <p className="text-gray-500">No clicks yet.</p>
        ) : (
          <div className="space-y-6">
            <div className="flex gap-x-6">
              <ClickMap clicks={clicks} />
              <DeviceStats clicks={clicks} />
            </div>

            <RecentActivity clicks={clicks} />
          </div>
        )}
      </div>
    </div>
  );
}
