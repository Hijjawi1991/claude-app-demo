"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function BillingButton() {
  const [loading, setLoading] = useState(false);

  async function handleManageBilling() {
    setLoading(true);
    try {
      const res = await fetch("/api/billing-portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Something went wrong");
        setLoading(false);
      }
    } catch {
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" onClick={handleManageBilling} disabled={loading}>
      {loading ? "Loading..." : "Manage billing"}
    </Button>
  );
}
