// DataTables
$(document).ready(function () {
  $('#projectsTable').DataTable();
});

// Chart.js
const ctx = document.getElementById('skillsChart').getContext('2d');
new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Node.js', 'Python', 'Django', 'JavaScript', 'ML'],
    datasets: [{
      data: [25, 20, 15, 30, 10],
      backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1']
    }]
  }
});
