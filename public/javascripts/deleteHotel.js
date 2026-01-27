async function deleteHotel(url, hotelId) { 
    console.log(url, hotelId);

    await fetch(url, {
        method: 'DELETE',
        credentials: 'include', // ✅ REQUIRED on Render
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            id: hotelId
        })
    })
    .then((response) => {
        if (response.ok) {
            location.reload();
            return;
        }
        return Promise.reject(response);
    })
    .catch((response) => {
        alert(response.statusText);
    });
}
