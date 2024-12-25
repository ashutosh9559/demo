async function fetchPatientData() {
  const apiURL = 'https://fedskillstest.coalitiontechnologies.workers.dev';

  // Get the patient name from the search input field
  const patientName = document.getElementById('patient-search').value.trim();

  if (!patientName) {
    alert("Please enter a patient's name.");
    return;
  }

  // Encode Basic Auth credentials (username:password)
  const username = 'coalition';
  const password = 'skills-test';
  const authKey = btoa(`${username}:${password}`); // Base64 encoding of 'coalition:skills-test'

  try {
    // Make the API call with Basic Auth
    const response = await fetch(apiURL, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${authKey}`, // Add Basic Authorization
        'Content-Type': 'application/json',
      }
    });

    // Check for HTTP errors
    if (!response.ok) {
      console.error(`HTTP Error: ${response.status} ${response.statusText}`);
      throw new Error('Failed to fetch API data.');
    }

    // Parse the JSON response
    const data = await response.json();

    // Filter and display the data for the searched patient
    const patient = data.find(p => p.name.toLowerCase() === patientName.toLowerCase());
    if (patient) {
      updateUI(patient);
    } else {
      alert('Patient not found.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Function to update the UI with the patient's data
function updateUI(patient) {
  // Update name, profile picture, and other details
  document.getElementById('patient-name').textContent = patient.name;
  document.getElementById('profile-picture').src = patient.profile_picture;
  document.getElementById('dob').textContent = patient.date_of_birth;
  document.getElementById('gender').textContent = patient.gender;
  document.getElementById('contact').textContent = patient.phone_number;
  document.getElementById('insurance').textContent = patient.insurance_type;

  // Update vitals if available
  document.getElementById('respiratory-rate').textContent = patient.respiratory_rate || '-';
  document.getElementById('temperature').textContent = patient.temperature || '-';
  document.getElementById('heart-rate').textContent = patient.heart_rate || '-';

  // Call the chart function to update the blood pressure chart
  updateBloodPressureChart(patient.diagnosis_history);
}

// Function to update the blood pressure chart
function updateBloodPressureChart(diagnosisHistory) {
  const ctx = document.getElementById('bloodPressureChart').getContext('2d');
  const labels = diagnosisHistory.map(item => item.month);
  const systolicData = diagnosisHistory.map(item => item.systolic);
  const diastolicData = diagnosisHistory.map(item => item.diastolic);

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Systolic Blood Pressure',
        data: systolicData,
        borderColor: 'rgb(75, 192, 192)',
        fill: false,
      }, {
        label: 'Diastolic Blood Pressure',
        data: diastolicData,
        borderColor: 'rgb(255, 99, 132)',
        fill: false,
      }]
    }
  });
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Automatically fetch patient data on page load if needed (or wait for search)
  // fetchPatientData();
});
