 // Global booking array
    let bookings = [];

    // Update total price and total seats
    function updateTotal() {
        const totalPrice = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);
        const totalSeats = bookings.reduce((acc, booking) => acc + booking.seats.length, 0);
        document.getElementById('totalPrice').textContent = totalPrice;
        document.getElementById('totalSeats').textContent = totalSeats;
    }

    // Add a new booking
    document.getElementById('bookingForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const busNumber = document.getElementById('busNumber').value;
        const date = document.getElementById('date').value;
        const villageName = document.getElementById('villageName').value;
        const seatNumbers = document.getElementById('seatNumbers').value.split(',').map(num => num.trim());
        const pricePerSeat = parseFloat(document.getElementById('price').value);

        const totalPrice = pricePerSeat * seatNumbers.length;

        const booking = {
            busNumber,
            date,
            villageName,
            seats: seatNumbers,
            totalPrice,
            pricePerSeat,
        };

        bookings.push(booking);
        displayBookings();
        updateTotal();

        // Reset form
        document.getElementById('bookingForm').reset();
    });

    // Display bookings in the table
    function displayBookings() {
        const bookingTable = document.getElementById('bookingTable');
        bookingTable.innerHTML = '';

        bookings.forEach((booking, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${booking.busNumber}</td>
                <td>${booking.date}</td>
                <td>${booking.villageName}</td>
                <td>${booking.seats.join(', ')}</td>
                <td>${booking.totalPrice}</td>
                <td>${booking.seats.length}</td>
                <td>
                    <button onclick="editBooking(${index})">Edit</button>
                    <button onclick="deleteBooking(${index})">Delete</button>
                </td>
            `;
            bookingTable.appendChild(row);
        });
    }

    // Edit booking
    function editBooking(index) {
        const booking = bookings[index];
        document.getElementById('busNumber').value = booking.busNumber;
        document.getElementById('date').value = booking.date;
        document.getElementById('villageName').value = booking.villageName;
        document.getElementById('seatNumbers').value = booking.seats.join(', ');
        document.getElementById('price').value = booking.pricePerSeat;

        // Remove the booking from the array for editing
        deleteBooking(index);
    }

    // Delete booking
    function deleteBooking(index) {
        bookings.splice(index, 1);
        displayBookings();
        updateTotal();
    }

   // Generate PDF
 document.getElementById('generatePDF').addEventListener('click', function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Add logo with proper size and position (ensure the image path is correct)
        const logo = 'C:/Users/HP/Downloads/20240716_232949.jpg'; // Replace with the correct image path
        doc.addImage(logo, 'JPEG', 14, 10, 30, 30); // Logo position and size

        // Add header with background color and stylish font
        doc.setFillColor(47, 68, 82); // Dark blue background for header
        doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F'); // Rectangle for header
        doc.setTextColor(255, 255, 255); // White text color
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(18);
        doc.text('Shree RamKunj Travels', 50, 20); // Title text position

        // Date and day on the right side

        const currentDate = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = currentDate.toLocaleDateString('en-US', options);
        doc.setFontSize(12);
        doc.text(`Date: ${formattedDate}`, doc.internal.pageSize.width - 70, 10); // Right-aligned date

        // Add a line below the header
        doc.setLineWidth(0.5);
        doc.line(0, 30, doc.internal.pageSize.width, 30); // Horizontal line

        // Add table with improved styles
        const table = document.getElementById('bookingTable');
        if (!table) {
            console.error('Booking table not found!');
            return;
        }

        const rows = Array.from(table.rows).map(row =>
            Array.from(row.cells).map(cell => cell.textContent)
        );

        // Table header with blue background and white text
        doc.autoTable({
            head: [['Bus Number', 'Date', 'Village Name', 'Seat Numbers', 'Total Price', 'Total Seats']],
            body: rows,
            startY: 40, // Table starting Y position
            headStyles: {
                fillColor: [47, 68, 82], // Dark blue
                textColor: [255, 255, 255], // White text
                fontStyle: 'bold',
                halign: 'center',
            },
            bodyStyles: {
                fillColor: [250, 250, 250], // Light grey background for rows
                textColor: [0, 0, 0], // Black text
                halign: 'center',
                lineWidth: 0.3,
                lineColor: [0, 0, 0], // Black borders for table cells
            },
            alternateRowStyles: {
                fillColor: [235, 235, 235], // Lighter grey for alternate rows
            },
            margin: { top: 40 },
        });

        // Add total price and total seats in the footer section
        doc.setFontSize(12);
        doc.setFont('Helvetica', 'normal');
        doc.setTextColor(0, 0, 0); // Black text

        const totalPriceElement = document.getElementById('totalPrice');
        const totalSeatsElement = document.getElementById('totalSeats');

        if (totalPriceElement && totalSeatsElement) {
            const totalPrice = totalPriceElement.textContent;
            const totalSeats = totalSeatsElement.textContent;

            const footerY = doc.lastAutoTable.finalY + 10;
            doc.text(`Total Price: ${totalPrice}`, 14, footerY);
            doc.text(`Total Seats: ${totalSeats}`, 14, footerY + 10);
        } else {
            console.error('Total price or total seats element not found!');
        }

        // Add a footer with a line at the bottom
        doc.setLineWidth(0.5);
        doc.line(0, doc.internal.pageSize.height - 20, doc.internal.pageSize.width, doc.internal.pageSize.height - 20);

        // Footer text
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128); // Gray color
        doc.text('Shree RamKunj Travels | All Rights Reserved', doc.internal.pageSize.width - 120, doc.internal.pageSize.height - 10);

        // Save PDF with a professional name
        doc.save('Booking_Report.pdf');
    });
