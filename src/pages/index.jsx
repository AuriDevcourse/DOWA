import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function HomePage() {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    navigate(createPageUrl("Departments"), { replace: true });
  }, [navigate]);

  return null;
}