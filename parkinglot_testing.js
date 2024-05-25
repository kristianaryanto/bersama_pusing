const apiUrl = 'http://localhost:8000';

const addCar = () => {
  let newLicensee = document.querySelector("#carValue").value;

  let response = fetch(`${apiUrl}/parked-cars`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ licensee: newLicensee }),
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      cars.push(data);
      // renderTable();
    })
    .catch(error => console.error('Error:', error));
}

const freeSpot = (event) => {
  let carIndex = event.target.dataset.row;
  let carLicensee = cars[carIndex].licensee;

  fetch(`${apiUrl}/parked-cars/${carLicensee}`, {
    method: 'PUT',
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to free spot');
    }
    return response.json();
  })
  .then(data => {
    console.log("Kendaraan berhasil dikeluarkan:", data);
    cars.splice(carIndex, 1); // Menghapus kendaraan dari array lokal setelah berhasil dikeluarkan di backend
    renderTable(); // Merender kembali tabel setelah berhasil mengeluarkan kendaraan
  })
  .catch(error => console.error('Error:', error));
}




const apiUrl = 'http://localhost:8000';

// Fungsi untuk mengambil data kendaraan dari API
const getParkedCars = () => {
  return fetch(`${apiUrl}/parked-cars`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch parked cars');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error:', error);
      throw error; // Lanjutkan melemparkan error agar dapat ditangani oleh pemanggil
    });
}

// Fungsi untuk merender tabel berdasarkan data kendaraan
const renderTable = (cars) => {
  let results = '';
  cars.forEach((car, index) => {
    let licensee = car.licensee;
    let arrival = formatDate(car.arrival);
    let leave = car.leave === '-' ? '-' : formatDate(car.leave);

    results += `<tr>
      <td>${licensee}</td>
      <td>${arrival}</td>
      <td>${leave}</td>
      <td>${showStatus(car)}</td>
      <td class="text-right">${makeBill(car)}</td>
      <td class="text-right">
        <button data-row="${index}" onclick="showSummary(event)" data-toggle="modal" data-target="#myModal" class="btn btn-sm btn-success">Summary</button>
      </td>
    </tr>`;
  });

  document.querySelector("#parking tbody").innerHTML = results;
}

// Panggil getParkedCars dan renderTable untuk mendapatkan dan merender data kendaraan
getParkedCars()
  .then(cars => renderTable(cars))
  .catch(error => console.error('Error:', error));
