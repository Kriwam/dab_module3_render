async function addHotel(url) {
  const name = prompt("Provide the new hotel's name");
  if (!name) return;

  const hotelLocation = prompt("Provide the new hotel's location");
  if (!hotelLocation) return;

  try {
    const response = await fetch(url, {
      method: "POST",
      credentials: "same-origin", // ✅ send session cookie
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Name: name,
        Location: hotelLocation,
      }),
    });

    if (response.ok) {
      location.reload();
      return;
    }

    if (response.status === 401) {
      alert("Not logged in / not authorized (401). Please log in again and retry.");
      return;
    }

    const text = await response.text();
    alert(`Could not create hotel (${response.status}): ${text}`);
  } catch (err) {
    alert("Network error: " + err.message);
  }
}
