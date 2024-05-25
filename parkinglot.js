// var cars = {};
var cars = [];
let data_api = [];
const addCarButton = document.querySelector('#carButton');
const minLicenseeLength = 4;
const payPerHour = 3000;
const payFirstHour = 5000;
const totalPlaces = 10;
const timeOutFreeSpot = 5000; // in milisecond
const apiUrl = 'http://localhost:8000';


const formatDate = (date) => {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + strTime;
}




const secondsToHours = (d) => {
  d = Number(d);
  let h = Math.ceil(d / 3600);
  return h;
}

const api_post_parked_cars =  (newLicensee) => fetch(`${apiUrl}/parked-cars`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ licensee: newLicensee }),
})

// const api_get_parked_cars = async () => {
//   try {
//     const response = await fetch(`${apiUrl}/parked-cars`);
//     if (!response.ok) {
//       throw new Error('Failed to fetch parked cars');
//     }
//     let data
//     data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error:', error);
//     throw error;
//   }
// }



// console.log("asli gan",api_get_parked_cars());
// [[PromiseResult]]

const api_get_parked_cars = () => {
  fetch(`${apiUrl}/parked-cars`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch parked cars');
    }
    return response.json();
  })
  .then(data => {
    cars.push(...data);
    console.log("dalem api funct",data);
    console.log("data type api funct",typeof(data));
    // Lakukan sesuatu dengan data, misalnya menampilkan di halaman web
  })
  .catch(error => console.error('Error:', error));
}


// const fetchData = async () => {
//   try {
//     const data = await api_get_parked_cars();
//     // Use the data here
//     console.log(data);
//     // Perform actions with the data, such as displaying it on the web page
//   } catch (error) {
//     console.error('Error:', error);
//   }
// }

const renderTable = () => {
  let results = '';
  console.log("data render table")
  console.log("data render letnght",cars.length)
  console.log("data render ajah",cars)
  // console.log("ambil dar render_table",data_api)

  for (var i = cars.length - 1; i >= 0; i--) {
    let licensee = cars[i].licensee;
    console.log("data lisence",licensee)
    let arrival = formatDate(cars[i].arrival);
    let leave = cars[i].leave === '-' ? '-' : formatDate(cars[i].leave);

    results += `<tr>
		  <td>${licensee}</td>
		  <td>${arrival}</td>
		  <td>${leave}</td>
		  <td>${showStatus(cars[i])}</td>
		  <td class="text-right">${makeBill(cars[i])}</td>
		  <td class="text-right">
			<button data-row="${i}" onclick="showSummary(event)" data-toggle="modal" data-target="#myModal" class="btn btn-sm btn-success">Summary</button>
					</td>
		</tr>`;
  }

  document.querySelector("#parking tbody").innerHTML = results;
}



const showStatus = (car) => {
  return car.isParked ? "Parked" : "Has left";
}

const changeStatus = (event) => {
  cars[event.target.dataset.row].isParked = false;
}

const setLeaveTime = (event) => {
  cars[event.target.dataset.row].leave = new Date(Date.now());
}

const countAvailablePlaces = (event) => {
  document.querySelector('#placesCount').innerHTML = totalPlaces - cars.length;
}

const setClassForBadge = () => {
  let badgeClassName = cars.length == totalPlaces ? 'badge badge-danger' : 'badge badge-success';
  document.querySelector('#placesCount').setAttribute('class', badgeClassName);
}

const calculateHoursBilled = (car) => {
  let arrivedAt = new Date(car.arrival).getTime();
  let leftAt = new Date(car.leave).getTime();
  return secondsToHours((leftAt - arrivedAt) / 1000); //duration in seconds
}

const makeBill = (car) => {
  let hoursBilled = calculateHoursBilled(car);
  let billValue = car.isParked ? "-" : "Rp " + (payFirstHour + (hoursBilled - 1) * payPerHour);
  return billValue;
}

const printSummary = (event) => {
  console.log(api_get_parked_cars());
  let car = cars[event.target.dataset.row];
  let sumarryTable = `<table class="table table-bordered m-0">
        <tr>
          <td class="font-weight-bold">Registration number</td>
          <td>${car.licensee}</td>
        </tr>
        <tr>
          <td class="font-weight-bold">Arrival</td>
          <td>${formatDate(car.arrival)}</td>
        </tr>
        <tr>
          <td class="font-weight-bold">Departure</td>
          <td>${formatDate(car.leave)}</td>
        </tr>
        <tr>
          <td class="font-weight-bold">Billable hours</td>
          <td>${calculateHoursBilled(car)}</td>
        </tr>
        <tr>
          <td class="font-weight-bold">Bill value</td>
          <td>${makeBill(car)}</td>
      </tr></table>`;

  document.querySelector('#modalBody').innerHTML = sumarryTable;
}

const showSummary = (event) => {
  console.log(api_get_parked_cars());
  changeStatus(event);
  setLeaveTime(event);
  // renderTable(api_get_parked_cars());
  renderTable();
  

  printSummary(event);

  //Free the parking place
  setTimeout(function() {
    freeSpot(event);
  }, timeOutFreeSpot);
}
// renderTable(api_get_parked_cars());
api_get_parked_cars();
console.log("data api",data_api);
const looping = () => {
  for (var i = 1; i >= 0; i--) {
    console.log("data cars loop",cars);
  }
}
console.log(looping());
console.log("data cars",cars);
console.log("data type cars",typeof(cars));
renderTable();


const addCar = () => {
  console.log(api_get_parked_cars());
  let newLicensee = document.querySelector("#carValue").value;
  // console.log(newLicensee);
  let newCar = {
    licensee: newLicensee,
    arrival: new Date(),
    leave: '-',
    isParked: true
  }
  // console.log(newCar);
  api_post_parked_cars(newLicensee)
  console.log(api_get_parked_cars());
  // renderTable(api_get_parked_cars());
  // Add new car to the cars array

  document.querySelector('#message').style.display = 'none';
  if (newLicensee.length >= minLicenseeLength && cars.length < totalPlaces) {
    cars.push(newCar);
    // console.log(cars);
  } else {
    if (newLicensee.length < minLicenseeLength) {
      document.querySelector('#message').style.display = 'block';
    }
  }

  if (cars.length == totalPlaces) {
    document.querySelector('#carButton').setAttribute('disabled', true);
  }

  setClassForBadge();
  console.log(setClassForBadge());

  //Update places count
  countAvailablePlaces(event);

  // Empty text box
  document.querySelector("#carValue").value = '';

  // Render the table
  // renderTable(api_get_parked_cars())
  renderTable()
  
  


}

const freeSpot = (event) => {
  console.log(api_get_parked_cars());
  cars.splice(event.target.dataset.row, 1);
  setClassForBadge();

  if (cars.length == totalPlaces) {
    document.querySelector('#carButton').setAttribute('disabled', true);
  } else {
    document.querySelector('#carButton').removeAttribute('disabled');
  }

  // Render Table again after delete 
  // renderTable(api_get_parked_cars());
  renderTable();
  
  
  

  //Update places count
  countAvailablePlaces(event);
}

// Add new car to the array
if (addCarButton) {
  addCarButton.addEventListener('click', addCar);
  var carb = addCarButton.addEventListener('click', addCar);
  console.log(carb);
}

// Render Table
// renderTable(api_get_parked_cars());
renderTable();

//Show places count at page load
countAvailablePlaces(event);
// renderTable(api_get_parked_cars())
/* Changes
1. Add if condition to addCarButton
2. Put js script at the end of html body
3. change the renderTable condition
4. Edited makeBill
5. edited freespot
*/
