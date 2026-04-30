import { Navigate, useParams } from "react-router-dom";

// Legacy /members/:slug routes redirect to the live storefront page.
const MemberProfile = () => {
  const { slug } = useParams();
  return <Navigate to={slug ? `/store/${slug}` : "/directory"} replace />;
};

export default MemberProfile;
