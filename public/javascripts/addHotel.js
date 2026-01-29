// public/javascripts/addHotel.js
async function addHotel(url) {
  const name = prompt("Provide the new hotel's name");
  if (!name) return;

  const hotelLocation = prompt("Provide the new hotel's location");
  if (!hotelLocation) return;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Name: name,
        Location: hotelLocation,
      }),
    });

    if (response.ok) {
      location.reload();
      return;
    }

    const text = await response.text();
    alert(text || response.statusText);
  } catch (err) {
    alert("Network error: " + err.message);
  }
}

