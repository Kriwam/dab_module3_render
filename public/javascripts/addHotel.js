async function addHotel(url) {
  const name = prompt("Provide the new hotel's name");
  const location = prompt("Provide the new hotel's location");

  if (!name || !location) return;

  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      location: location,
    }),
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
