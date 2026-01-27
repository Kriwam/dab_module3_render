async function addHotel(url) {
  const name = prompt("Provide the new hotel's name");
  const hotelLocation = prompt("Provide the new hotel's location");

  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      Name: name,
      Location: hotelLocation
    })
  });

  if (response.ok) {
    location.reload();
  } else {
    alert("Could not create hotel");
  }
}
