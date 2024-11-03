async function loadGuests() {
    try {
        const response = await fetch("https://tropical-blinni-bennysh-cc84be82.koyeb.app/guests");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const guests = data.guests;
        const totalAttendees = data.totalGuests;

        const tableBody = document.getElementById("guestTableBody");
        const totalAttendeesElement = document.getElementById("totalAttendees");

        tableBody.innerHTML = ""; // Clear previous entries
        totalAttendeesElement.innerText = `(כמות אורחים כרגע: ${totalAttendees})`;

        guests.forEach((guest, index) => {
            const row = tableBody.insertRow();

            // Add Actions cell
            const actionsCell = row.insertCell(0);
            
            const editButton = document.createElement("button");
            editButton.innerText = "ערוך";
            editButton.onclick = () => editGuest(guest.phone);
            
            const deleteButton = document.createElement("button");
            deleteButton.innerText = "מחק";
            deleteButton.onclick = () => deleteGuest(guest.phone);
            
            // Add spacing between buttons
            actionsCell.appendChild(editButton);
            actionsCell.appendChild(document.createTextNode("\u00A0")); // Adds a non-breaking space
            actionsCell.appendChild(deleteButton);
        
            // Insert other guest details
            row.insertCell(1).innerText = guest.submissionDate || "";
            row.insertCell(2).innerText = guest.phone;
            row.insertCell(3).innerText = guest.name;
        
            row.insertCell(4).innerText = index + 1; 
        });
    } catch (error) {
        console.error("Failed to load guests:", error);
    }
}

window.onload = loadGuests;

async function deleteGuest(phone) {
    if (confirm("Are you sure you want to delete this guest?")) {
        try {
            const response = await fetch("https://tropical-blinni-bennysh-cc84be82.koyeb.app/delete_guest", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            alert("Guest deleted successfully!");
            loadGuests(); 
        } catch (error) {
            console.error("Failed to delete guest:", error);
        }
    }
}

async function editGuest(phone) {
    const newName = prompt("Enter new name:", "");

    if (newName) {
        try {
            const response = await fetch("https://tropical-blinni-bennysh-cc84be82.koyeb.app/edit_guest", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, name: newName })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            alert("Guest updated successfully!");
            loadGuests(); 
        } catch (error) {
            console.error("Failed to edit guest:", error);
        }
    } else {
        alert("Name must be provided for editing.");
    }
}

let sortOrder = { column: -1, ascending: true };

function sortTable(columnIndex) {
    const table = document.getElementById("guestTable");
    const rows = Array.from(table.rows).slice(1);

    rows.sort((a, b) => {
        const aText = a.cells[columnIndex].innerText;
        const bText = b.cells[columnIndex].innerText;

        return sortOrder.ascending
            ? aText.localeCompare(bText)
            : bText.localeCompare(aText); 
    });

    sortOrder.column = columnIndex;
    sortOrder.ascending = !sortOrder.ascending;

    rows.forEach(row => table.appendChild(row));
}

function downloadCSV() {
    const table = document.getElementById("guestTable");
    let csvContent = "data:text/csv;charset=utf-8,";

    const headers = Array.from(table.rows[0].cells)
        .slice(1) // Skip the first column
        .map(header => header.innerText)
        .join(",");
    csvContent += headers + "\n";

    for (let i = 1; i < table.rows.length; i++) {
        const rowData = Array.from(table.rows[i].cells)
            .slice(1) // Skip the first column
            .map(cell => cell.innerText)
            .join(",");
        csvContent += rowData + "\n";
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "guest_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
