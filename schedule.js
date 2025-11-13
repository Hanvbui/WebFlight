document.getElementById('search-flights').addEventListener('click', function() {
  console.log("Button clicked");  // Kiểm tra nút được bấm

  var departureDate = document.getElementById('departure-date').value;
  var departureTime = document.getElementById('departure-time').value;

  // Tạo chuỗi datetime từ ngày và giờ
  var datetime = departureDate + ' ' + departureTime + ':00'; // Thêm giây vào cuối giờ

  console.log(datetime);  // In ra datetime xem có chính xác không

  // Gửi yêu cầu tới server để lấy kết quả
  fetch('/flights-by-date', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ datetime: datetime })  // Sử dụng giá trị datetime từ input
  })
    .then(response => response.json())
    .then(data => {
      var resultsDiv = document.getElementById('flight-results');
      resultsDiv.innerHTML = '';  // Xóa kết quả cũ

      if (data.flights && data.flights.length > 0) {
        // Hiển thị danh sách chuyến bay nếu có kết quả
        data.flights.forEach(flight => {
          var flightInfo = document.createElement('div');
          flightInfo.innerHTML = `
            <p>Chuyến bay: ${flight.fnumber}</p>
            <p>Thời gian khởi hành: ${flight.d_date_time}</p>
            <p>Thời gian đến: ${flight.a_date_time}</p>
            <p>Điểm đi: ${flight.departure_city_name}</p>
            <p>Điểm đến: ${flight.arrival_city_name}</p>
            <p>Giá vé: ${flight.price}</p>
          `;
          resultsDiv.appendChild(flightInfo);
        });
      } else {
        // Hiển thị thông báo không có chuyến bay
        resultsDiv.innerHTML = '<p>Không có chuyến bay trong thời điểm này.</p>';
      }
    })
    .catch(error => {
      console.error('Error fetching flight data:', error);
      document.getElementById('flight-results').innerHTML = '<p>Đã xảy ra lỗi khi tìm kiếm chuyến bay.</p>';
    });
});

