async function deleteHotel(url, hotelId) {
  try {
    const response = await fetch(url, {
      method: "DELETE",
      credentials: "same-origin", // ✅ send session cookie
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: hotelId }),
    });

    if (response.ok) {
      location.reload();
      return;
    }

    const text = await response.text();
    alert(`Delete failed (${response.status}): ${text}`);
  } catch (err) {
    alert("Network error: " + err.message);
  }
}
