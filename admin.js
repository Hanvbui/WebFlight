document.addEventListener('DOMContentLoaded', function () {
    // Lắng nghe sự kiện submit của form "post-info-form"
    const postForm = document.getElementById('post-info-form');
    if (postForm) {
      postForm.addEventListener('submit', async (e) => {
        e.preventDefault();
  
        const title = document.getElementById('info-title').value;
        const content = document.getElementById('info-content').value;
        const picture = document.getElementById('info-picture').files[0];
  
        if (!title || !content || !picture) {
          alert('Vui lòng điền đầy đủ thông tin!');
          return;
        }
  
        const formData = new FormData();
        formData.append('info-title', title);
        formData.append('info-content', content);
        formData.append('info-picture', picture);
  
        try {
          const response = await fetch('/addInfo', {
            method: 'POST',
            body: formData,
          });
  
          const result = await response.json();
          if (response.ok) {
            alert(result.message);
          } else {
            alert('Có lỗi xảy ra: ' + result.message);
          }
        } catch (error) {
          console.error('Lỗi:', error);
          alert('Không thể kết nối đến server!');
        }
      });
    } else {
      console.error('Không tìm thấy form "post-info-form"');
    }
  
    // Lắng nghe sự kiện submit của form "delete-info-form"
    const deleteForm = document.getElementById('delete-info-form');
    if (deleteForm) {
      deleteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
  
        const infoId = document.getElementById('info-id').value;
  
        try {
          const response = await fetch(`/deleteInfo/${infoId}`, {
            method: 'DELETE',
          });
  
          const result = await response.json();
          if (response.ok) {
            alert(result.message);  // Thành công
          } else {
            alert('Có lỗi xảy ra: ' + result.message);  // Lỗi từ server
          }
        } catch (error) {
          console.error('Lỗi:', error);
          alert('Không thể kết nối đến server!');
        }
      });
    } else {
      console.error('Không tìm thấy phần tử form với id "delete-info-form"');
    }
  });
  
  document.addEventListener('DOMContentLoaded', function () {
    const flightForm = document.getElementById('add-flight-form');
    if (flightForm) {
      flightForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Ngừng hành động submit mặc định
  
        const fnumber = document.getElementById('fnumber').value;
        const airplane_id = document.getElementById('airplane_id').value;
        const d_city = document.getElementById('d_city').value;
        const d_date_time = document.getElementById('d_date_time').value;
        const a_city = document.getElementById('a_city').value;
        const a_date_time = document.getElementById('a_date_time').value;
        const price = document.getElementById('price').value;
  
        // Kiểm tra dữ liệu
        if (!fnumber || !airplane_id || !d_city || !d_date_time || !a_city || !a_date_time || !price) {
          alert('Vui lòng điền đầy đủ thông tin!');
          return;
        }
  
        // Tạo đối tượng dữ liệu chuyến bay
        const flightData = {
          fnumber,
          airplane_id,
          d_city,
          d_date_time,
          a_city,
          a_date_time,
          price
        };
  
        try {
          // Gửi yêu cầu POST
          const response = await fetch('/addFlight', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(flightData)
          });
  
          const result = await response.json();
          if (response.ok) {
            alert(result.message);  // Thành công
          } else {
            alert('Có lỗi xảy ra: ' + result.message);  // Lỗi từ server
          }
        } catch (error) {
          console.error('Lỗi:', error);
          alert('Không thể kết nối đến server!');
        }
      });
    } else {
      console.error('Không tìm thấy form "add-flight-form"');
    }
  });
  
  document.addEventListener('DOMContentLoaded', function () {
    const deleteFlightForm = document.getElementById('delete-flight-form');
    if (deleteFlightForm) {
      deleteFlightForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Ngừng hành động submit mặc định
  
        const flightId = document.getElementById('flight-id').value;
  
        // Kiểm tra dữ liệu đầu vào
        if (!flightId) {
          alert('Vui lòng nhập ID chuyến bay!');
          return;
        }
  
        try {
          // Gửi yêu cầu DELETE tới server
          const response = await fetch(`/deleteFlight/${flightId}`, {
            method: 'DELETE',
          });
  
          const result = await response.json();
          if (response.ok) {
            alert(result.message);  // Thành công
          } else {
            alert('Có lỗi xảy ra: ' + result.message);  // Lỗi từ server
          }
        } catch (error) {
          console.error('Lỗi:', error);
          alert('Không thể kết nối đến server!');
        }
      });
    } else {
      console.error('Không tìm thấy form "delete-flight-form"');
    }
  });
  
  
  document.addEventListener('DOMContentLoaded', function () {
    const delayFlightForm = document.getElementById('delay-flight-form');
    if (delayFlightForm) {
      delayFlightForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Ngừng hành động submit mặc định
  
        let flightId = document.getElementById('delay-flight-id').value;
        const delayHours = document.getElementById('delay-hours').value;
  
        // Debug: Kiểm tra giá trị nhập vào
        console.log('flightId:', flightId, 'delayHours:', delayHours);
  
        // Kiểm tra dữ liệu đầu vào
        flightId = parseInt(flightId);  // Ép kiểu flightId thành số
        if (!flightId || !delayHours || isNaN(flightId) || isNaN(delayHours)) {
          alert('Vui lòng nhập mã chuyến bay và số giờ delay!');
          return;
        }
  
        try {
          // Gửi yêu cầu POST tới server
          const response = await fetch(`/delayFlight/${flightId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              delayHours: parseInt(delayHours),
            }),
          });
  
          const result = await response.json();
          if (response.ok) {
            alert(result.message);  // Thành công
          } else {
            alert('Có lỗi xảy ra: ' + result.message);  // Lỗi từ server
          }
        } catch (error) {
          console.error('Lỗi:', error);
          alert('Không thể kết nối đến server!');
        }
      });
    } else {
      console.error('Không tìm thấy form "delay-flight-form"');
    }
  });
  
  
  // Frontend: Xử lý khi nhấn nút "Xem thống kê"
document.addEventListener('DOMContentLoaded', function () {
    const statsButton = document.getElementById('generate-stats');
    const statsDisplay = document.getElementById('stats-display');
  
    if (statsButton) {
      statsButton.addEventListener('click', async () => {
        const period = prompt("Chọn khoảng thời gian thống kê: 'day' (Ngày), 'week' (Tuần), 'month' (Tháng)");
  
        if (!['day', 'week', 'month'].includes(period)) {
          alert("Vui lòng chọn 'day', 'week' hoặc 'month'.");
          return;
        }
  
        try {
          const response = await fetch(`/bookingStats?period=${period}`);
          const result = await response.json();
  
          if (response.ok) {
            statsDisplay.innerHTML = `
              <p>${result.message}</p>
              <p>Số lượng khách hàng đặt vé: ${result.bookingCount}</p>
            `;
          } else {
            statsDisplay.innerHTML = `<p>${result.message}</p>`;
          }
        } catch (error) {
          console.error('Lỗi:', error);
          statsDisplay.innerHTML = '<p>Không thể kết nối đến server!</p>';
        }
      });
    }
  });
  