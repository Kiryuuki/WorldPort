export async function getGlanceStatus() {
  if (!process.env.GLANCE_URL || !process.env.GLANCE_API_KEY) {
    console.warn("Missing Glance environment variables");
    return [];
  }

  try {
    const res = await fetch(`${process.env.GLANCE_URL}/api/v1/monitors`, {
      headers: { 'Authorization': `Bearer ${process.env.GLANCE_API_KEY}` },
      next: { revalidate: 60 }, // ISR: refresh every 60s
    });
    
    if (!res.ok) {
      console.error("Glance API returned error", res.status);
      return [];
    }
    
    return res.json();
  } catch (error) {
    console.error("Failed to fetch Glance status:", error);
    return [];
  }
}
