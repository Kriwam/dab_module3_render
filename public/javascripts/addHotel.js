async function addHotel(url) {
  const name = prompt("Provide the new hotel's name");
  if (!name) return;

  const hotelLocation = prompt("Provide the new hotel's location");
  if (!hotelLocation) return;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin", // important for session login on Render
      body: JSON.stringify({
        // send both styles to match whatever your backend expects
        Name: name,
        Location: hotelLocation,
        name: name,
        location: hotelLocation,
      }),
    });

    if (response.ok) {
      location.reload();
      return;
    }

    // show real error message if server returns one
    const text = await response.text();
    alert(`Could not create hotel (${response.status}): ${text || response.statusText}`);
  } catch (err) {
    alert("Network error: " + err.message);
  }
}
