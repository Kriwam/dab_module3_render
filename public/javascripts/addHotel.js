async function addHotel(url) {
  let name = prompt("Provide the new hotel's name");
  let hotelLocation = prompt("Provide the new hotel's location");

  if (!name || !hotelLocation) {
    return;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include', // 🔑 THIS is the important fix
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Name: name,
        Location: hotelLocation
      })
    });

    if (!response.ok) {
      throw response;
    }

    location.reload();
  } catch (err) {
    alert('Could not create hotel');
    console.error(err);
  }
}
