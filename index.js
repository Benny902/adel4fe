async function submitGuest(event) {
    event.preventDefault(); // Prevent form from submitting in the traditional way

    const guest = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value
    };

    await fetch("https://tropical-blinni-bennysh-cc84be82.koyeb.app/add_guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guest)
    });

    alert("תודה! מחכים לראותכם! 🤩"); // New alert message
    location.reload(); // Reload the page after the alert is dismissed
}

// Event listener for the form submission
document.getElementById('guestForm').addEventListener('submit', submitGuest);
