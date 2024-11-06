async function submitGuest(event) {
    event.preventDefault();

    const guest = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value
    };

    await fetch("https://tropical-blinni-bennysh-cc84be82.koyeb.app/add_guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guest)
    });
    document.getElementById("confirmationModal").style.display = "flex";
}

document.getElementById('guestForm').addEventListener('submit', submitGuest);

document.querySelector(".close-button").addEventListener("click", function() {
    document.getElementById("confirmationModal").style.display = "none";
    location.reload();
});

window.addEventListener("click", function(event) {
    if (event.target === document.getElementById("confirmationModal")) {
        document.getElementById("confirmationModal").style.display = "none";
        location.reload();
    }
});
