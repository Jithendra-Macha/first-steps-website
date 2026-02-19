import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LOCATION_PAGES } from "@/data/locationPages";
import LocationLanding from "@/components/coh/LocationLanding";

const LocationPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const data = slug ? LOCATION_PAGES[slug] : undefined;

  useEffect(() => {
    if (data) {
      document.title = data.metaTitle;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", data.metaDescription);
      else {
        const m = document.createElement("meta");
        m.name = "description";
        m.content = data.metaDescription;
        document.head.appendChild(m);
      }
    }
    window.scrollTo(0, 0);
  }, [data]);

  if (!data) {
    navigate("/", { replace: true });
    return null;
  }

  return <LocationLanding data={data} />;
};

export default LocationPage;
