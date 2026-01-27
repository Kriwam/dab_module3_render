async function addHotel(url) {
  const name = prompt("Provide the new hotel's name");
  if (!name) return;

  const hotelLocation = prompt("Provide the new hotel's location");
  if (!hotelLocation) return;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin", // IMPORTANT on Render (cookies/session)
      body: JSON.stringify({
        Name: name,
        Location: hotelLocation,
      }),
    });

    if (!response.ok) {
      alert("Could not create hotel");
      return;
    }

    location.reload();
  } catch (err) {
    console.error(err);
    alert("Could not create hotel");
  }
}
