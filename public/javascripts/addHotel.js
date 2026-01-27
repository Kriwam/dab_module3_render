async function addHotel(url) {
  const name = prompt("Provide the new hotel's name");
  const hotelLocation = prompt("Provide the new hotel's location");

  // If user clicks cancel, stop
  if (!name || !hotelLocation) return;

  await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({
      Name: name,
      Location: hotelLocation
    })
  })
    .then((response) => {
      if (response.ok) {
        location.reload();
        return;
      }
      return Promise.reject(response);
    })
    .catch(() => {
      alert("Could not create hotel");
    });
}

