import { useParams, Navigate } from "react-router-dom";
import { getDoc } from "@/content/docs/_meta";
import { DocPage } from "@/components/docs/DocPage";

const DocViewer = () => {
  const { slug = "" } = useParams();
  const doc = getDoc(slug);
  if (!doc) return <Navigate to="/documents" replace />;
  return <DocPage meta={doc.meta} source={doc.source} />;
};

export default DocViewer;
