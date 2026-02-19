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

      // Meta description
      let meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", data.metaDescription);
      else {
        meta = document.createElement("meta");
        (meta as HTMLMetaElement).name = "description";
        (meta as HTMLMetaElement).content = data.metaDescription;
        document.head.appendChild(meta);
      }

      // Canonical URL
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = `https://coupleofhours.com/hotels/${data.slug}`;

      // OG tags
      const setMeta = (property: string, content: string) => {
        let el = document.querySelector(`meta[property="${property}"]`);
        if (el) el.setAttribute("content", content);
        else {
          el = document.createElement("meta");
          el.setAttribute("property", property);
          el.setAttribute("content", content);
          document.head.appendChild(el);
        }
      };
      setMeta("og:title", data.metaTitle);
      setMeta("og:description", data.metaDescription);
      setMeta("og:url", `https://coupleofhours.com/hotels/${data.slug}`);
      setMeta("og:type", "website");
      setMeta("og:image", `https://coupleofhours.com${data.ogImage}`);
      setMeta("og:image:width", "1200");
      setMeta("og:image:height", "640");
      setMeta("og:image:type", "image/jpeg");

      // Twitter Card
      const setTwitter = (name: string, content: string) => {
        let el = document.querySelector(`meta[name="${name}"]`);
        if (el) el.setAttribute("content", content);
        else {
          el = document.createElement("meta");
          el.setAttribute("name", name);
          el.setAttribute("content", content);
          document.head.appendChild(el);
        }
      };
      setTwitter("twitter:card", "summary_large_image");
      setTwitter("twitter:title", data.metaTitle);
      setTwitter("twitter:description", data.metaDescription);
      setTwitter("twitter:image", `https://coupleofhours.com${data.ogImage}`);
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
