const express = require('express');
const md5 = require('md5');
const mysql = require('mysql2');
const multer = require('multer');  // Import multer để xử lý upload file
const path = require('path');  // Thêm module path
const moment = require('moment');
const app = express();
const port = 5000;


// Cấu hình multer để lưu tệp vào thư mục 'images-airplane'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images-airplane');  // Đặt thư mục lưu ảnh
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Đặt tên tệp ảnh (bao gồm thời gian hiện tại để tránh trùng tên)
  }
});

const upload = multer({ storage: storage });


// Tạo kết nối đến MySQL
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  database: 'abdb',
  password: 'Anhhai111'
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Lỗi kết nối MySQL:', err);
  } else {
    console.log('✅ Kết nối MySQL thành công!');
  }
});
;

// Để phục vụ các tệp tĩnh (HTML, CSS, JS) trong thư mục public
app.use(express.static(path.join(__dirname)));


// Route để lấy danh sách thành phố
app.get('/getCities', (req, res) => {
  const query = req.query.query;
  connection.query('SELECT name FROM city WHERE name LIKE ?', [`%${query}%`], (err, results) => {
    if (err) {
      res.status(500).send({ error: 'Database error' });
      return;
    }
    res.json(results);
  });
});



// Route để tìm chuyến bay
app.get('/searchFlights', (req, res) => {
  const { tripType, departureCity, arrivalCity, departureDate, arrivalDate, passengers } = req.query;

  // Tìm ID thành phố từ tên
  const cityQuery = 'SELECT id FROM city WHERE name = ?';
  connection.query(cityQuery, [departureCity], (err, departureCityResults) => {
    if (err || departureCityResults.length === 0) {
      res.status(400).send({ error: 'Invalid departure city' });
      return;
    }

    connection.query(cityQuery, [arrivalCity], (err, arrivalCityResults) => {
      if (err || arrivalCityResults.length === 0) {
        res.status(400).send({ error: 'Invalid arrival city' });
        return;
      }

      const departureCityId = departureCityResults[0].id;
      const arrivalCityId = arrivalCityResults[0].id;

      // Truy vấn chuyến bay với các điều kiện và tính toán ghế còn lại
      let flightQuery = `
        SELECT f.id, f.fnumber, f.d_date_time, f.a_date_time, f.price, a.capacity, 
       (a.capacity - IFNULL(sb.seats_booked, 0)) AS available_seats,
       dep_city.name AS departure_city_name, arr_city.name AS arrival_city_name,
       'outbound' AS trip_type -- Đánh dấu chuyến đi
FROM flight f
        JOIN airplane a ON f.airplane_id = a.id
        JOIN city dep_city ON f.d_city = dep_city.id  -- Lấy tên thành phố đi
        JOIN city arr_city ON f.a_city = arr_city.id  -- Lấy tên thành phố đến
        LEFT JOIN seats_booked sb ON f.id = sb.flight_id AND sb.class_id = 1  -- Lớp Economy
        WHERE f.d_city = ? AND f.a_city = ? AND f.d_date_time >= ? 
        HAVING available_seats >= ?
      `;

      const params = [departureCityId, arrivalCityId, departureDate, passengers]; // Thêm đúng tham số vào

      // Nếu là chuyến khứ hồi
      if (tripType === 'Khứ hồi') {
        flightQuery += `
          UNION ALL

SELECT f.id, f.fnumber, f.d_date_time, f.a_date_time, f.price, a.capacity, 
       (a.capacity - IFNULL(sb.seats_booked, 0)) AS available_seats,
       dep_city.name AS departure_city_name, arr_city.name AS arrival_city_name,
       'return' AS trip_type -- Đánh dấu chuyến về
FROM flight f
          JOIN airplane a ON f.airplane_id = a.id
          JOIN city dep_city ON f.d_city = dep_city.id  -- Lấy tên thành phố đi
          JOIN city arr_city ON f.a_city = arr_city.id  -- Lấy tên thành phố đến
          LEFT JOIN seats_booked sb ON f.id = sb.flight_id AND sb.class_id = 1  -- Lớp Economy
          WHERE f.d_city = ? AND f.a_city = ? AND f.d_date_time >= ? 
          HAVING available_seats >= ?
        `;
        params.push(arrivalCityId, departureCityId, arrivalDate, passengers); // Lớp Economy cho chuyến khứ hồi
      }

      // Chạy truy vấn với các tham số
      connection.query(flightQuery, params, (err, results) => {
        if (err) {
          console.error('Database error:', err); // In lỗi để dễ dàng kiểm tra
          res.status(500).send({ error: 'Database error' });
          return;
        }
        res.json(results || []); // Trả về mảng rỗng nếu không có kết quả
      });
    });
  });
});


// Middleware để xử lý dữ liệu JSON
app.use(express.json());



app.post('/createBooking', (req, res) => {
  const bookings = req.body; // Lấy mảng bookings từ client (bao gồm cả outbound và return flight)
  
  console.log('Bookings received:', bookings); // Kiểm tra dữ liệu nhận được từ client

  const userId = req.user ? req.user.id : null;

  if (!bookings || bookings.length === 0) {
    return res.status(400).json({ error: 'Không có thông tin booking.' });
  }

  const bookingPromises = bookings.map((booking) => {
    const { flight, passengers, classId } = booking;
    
    if (!flight || !passengers || !classId) {
      return Promise.reject(new Error('Thiếu thông tin chuyến bay, hành khách hoặc loại vé.'));
    }

    return new Promise((resolve, reject) => {
      // Tạo booking mới
      connection.query(
        `INSERT INTO Booking (flight_id, user_id, noOfTravellers, status, class_id) 
         VALUES (?, ?, ?, ?, ?)`,
        [flight, userId, passengers.length, 'BOOKED', classId],
        (err, result) => {
          if (err) {
            console.error('Error creating booking:', err);
            return reject(err);
          }

          const bookingId = result.insertId;

          // Lưu thông tin hành khách vào bảng Passenger
          const passengerInsertPromises = passengers.map((passenger) => {
            const { name, mname, age, email } = passenger;
            if (!name || !age || !email) {
              return Promise.reject(new Error('Thiếu thông tin hành khách'));
            }

            const fname = name.split(' ')[0];
            const lname = name.split(' ').slice(1).join(' ') || null;

            return new Promise((resolve, reject) => {
              connection.query(
                `INSERT INTO Passenger (booking_id, fname, mname, lname, age, email) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [bookingId, fname, mname, lname, age, email],
                (err, passengerResult) => {
                  if (err) {
                    console.error('Error saving passenger:', err);
                    return reject(err);
                  }
                  resolve(passengerResult);
                }
              );
            });
          });

          // Chờ tất cả hành khách được lưu
          Promise.all(passengerInsertPromises)
            .then(() => resolve(bookingId))
            .catch((err) => {
              console.error('Error saving passengers:', err);
              reject(err);
            });
        }
      );
    });
  });

  // Chờ tất cả booking và hành khách hoàn thành
  Promise.all(bookingPromises)
    .then((bookingIds) => {
      res.json({ bookingIds }); // Trả về danh sách bookingId
    })
    .catch((err) => {
      console.error('Error during booking process:', err);
      res.status(500).json({ error: 'Lỗi xử lý đặt vé.' });
    });
});


app.post('/checkin', (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
      return res.status(400).json({ success: false, message: 'Booking ID không hợp lệ' });
  }

  // Cập nhật trạng thái booking thành 'CHECKED'
  const query = 'UPDATE Booking SET status = "CHECKED" WHERE id = ?';
  
  connection.query(query, [bookingId], (err, result) => {
      if (err) {
          console.error('Lỗi khi cập nhật trạng thái:', err);
          return res.status(500).json({ success: false, message: 'Lỗi khi cập nhật trạng thái' });
      }

      if (result.affectedRows > 0) {
          res.json({ success: true, message: 'Check-in thành công' });
      } else {
          res.json({ success: false, message: 'Không tìm thấy Booking ID' });
      }
  });
});

app.get('/getBookingStatus', (req, res) => {
  const { bookingId } = req.query;

  if (!bookingId) {
      return res.status(400).json({ success: false, message: 'Booking ID không hợp lệ' });
  }

  // Truy vấn để lấy thông tin chuyến bay
  const flightQuery = `
      SELECT 
          f.fnumber, 
          a.airplane_name, 
          dc.name AS departure_city, 
          ac.name AS arrival_city,
          f.d_date_time
      FROM Booking b
      JOIN flight f ON b.flight_id = f.id
      JOIN airplane a ON f.airplane_id = a.id
      JOIN city dc ON f.d_city = dc.id
      JOIN city ac ON f.a_city = ac.id
      WHERE b.id = ?
  `;

  connection.query(flightQuery, [bookingId], (err, flightResults) => {
      if (err) {
          console.error('Lỗi khi truy vấn thông tin chuyến bay:', err);
          return res.status(500).json({ success: false, message: 'Lỗi khi truy vấn chuyến bay' });
      }

      if (flightResults.length === 0) {
          return res.status(404).json({ success: false, message: 'Không tìm thấy chuyến bay cho Booking ID này' });
      }

      const flight = flightResults[0];

      // Tách ngày và giờ đi từ f.d_date_time
      const departureDateTime = new Date(flight.d_date_time);
      const departureDate = departureDateTime.toLocaleDateString();  // Ngày đi
      const departureTime = departureDateTime.toLocaleTimeString();  // Thời gian đi

      // Truy vấn thông tin tình trạng booking
      const bookingQuery = 'SELECT status FROM Booking WHERE id = ?';
      connection.query(bookingQuery, [bookingId], (err, bookingResults) => {
          if (err) {
              console.error('Lỗi khi truy vấn thông tin booking:', err);
              return res.status(500).json({ success: false, message: 'Lỗi khi truy vấn booking' });
          }

          const bookingStatus = bookingResults[0] ? bookingResults[0].status : null;

          // Truy vấn thông tin hành khách
          const passengerQuery = `
              SELECT fname, mname, lname, age, email 
              FROM Passenger 
              WHERE booking_id = ?
          `;
          connection.query(passengerQuery, [bookingId], (err, passengerResults) => {
              if (err) {
                  console.error('Lỗi khi truy vấn thông tin hành khách:', err);
                  return res.status(500).json({ success: false, message: 'Lỗi khi truy vấn hành khách' });
              }

              // Trả về dữ liệu cho frontend
              res.json({
                  success: true,
                  flight: {
                      ...flight,
                      departureDate,
                      departureTime
                  },
                  bookingStatus,
                  passengers: passengerResults
              });
          });
      });
  });
});


app.post('/register', (req, res) => {
  console.log('Received data:', req.body);  // Kiểm tra xem dữ liệu có đến server không

  const { fname, lname, email, password, sex, address } = req.body; // Nhận thêm sex và address

  const passwordHash = md5(password); // Giả sử bạn sử dụng md5 để hash mật khẩu

  // Kiểm tra nếu email đã tồn tại
  const checkEmailSql = 'SELECT * FROM user WHERE email = ?';
  connection.query(checkEmailSql, [email], (err, result) => {
    if (err) {
      console.error('Error checking email:', err);
      return res.status(500).json({ success: false, message: 'Lỗi khi kiểm tra email' });
    }

    if (result.length > 0) {
      return res.status(400).json({ success: false, message: 'Email đã tồn tại' });
    }

    // Nếu email không tồn tại, tiến hành thêm user mới
    const sql = `INSERT INTO user (password_hash, fname, lname, email, sex, address) VALUES (?, ?, ?, ?, ?, ?)`;
    connection.query(sql, [passwordHash, fname, lname, email, sex, address], (err, result) => {
      if (err) {
        console.error('Error registering user:', err);
        return res.status(500).json({ success: false, message: 'Đăng ký thất bại' });
      }

      console.log('User registered successfully');
      res.json({ success: true });
    });
  });
});





app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Giả sử bạn đã có mã hash mật khẩu trong cơ sở dữ liệu
  const checkUserSql = 'SELECT * FROM user WHERE email = ? AND password_hash = ?';
  connection.query(checkUserSql, [username, md5(password)], (err, result) => {
    if (err) {
      console.error('Error logging in:', err);
      return res.status(500).json({ success: false, message: 'Đăng nhập thất bại' });
    }

    if (result.length > 0) {
      // Đăng nhập thành công, trả về thông tin người dùng
      const user = result[0];
      res.json({
        success: true,
        message: 'Đăng nhập thành công',
        user: {
          fname: user.fname,
          lname: user.lname,
          email: user.email,
          sex: user.sex,
          address: user.address
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Tài khoản hoặc mật khẩu không đúng' });
    }
  });
});

// Route lấy thông tin khuyến mãi từ bảng 'info'
app.get('/getInfo', (req, res) => {
  const query = 'SELECT * FROM info';  // Lấy tất cả các chương trình khuyến mãi từ bảng 'info'

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    // Giả sử bảng 'info' có các trường: id, title, paragraph, picture
    const promotions = results.map(item => ({
      title: item.title,
      paragraph: item.paragraph,
      picture: item.picture  // Đảm bảo URL của hình ảnh được lưu đúng
    }));

    res.json(promotions);  // Trả về dữ liệu dưới dạng JSON
  });
});


// Router thêm thông tin
app.post('/addInfo', upload.single('info-picture'), (req, res) => {
  const { 'info-title': title, 'info-content': content } = req.body;
  const picture = req.file ? req.file.path : '';  // Lấy đường dẫn ảnh từ req.file

  if (!title || !content || !picture) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
  }

  const query = 'INSERT INTO info (title, paragraph, picture) VALUES (?, ?, ?)';

  connection.query(query, [title, content, picture], (err, result) => {
    if (err) {
      console.error('Database error:', err);  // Log lỗi
      return res.status(500).json({ message: 'Có lỗi xảy ra khi thêm thông tin.' });
    }

    res.json({ message: 'Đăng thông tin thành công!' });
  });
});

// Router xóa thông tin
app.delete('/deleteInfo/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM info WHERE id = ?';

  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Có lỗi xảy ra khi xóa thông tin.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin với ID này.' });
    }

    res.json({ message: 'Xóa thông tin thành công!' });
  });
});

app.post('/addFlight', (req, res) => {
  const { fnumber, airplane_id, d_city, d_date_time, a_city, a_date_time, price } = req.body;

  // Kiểm tra dữ liệu
  if (!fnumber || !airplane_id || !d_city || !d_date_time || !a_city || !a_date_time || !price) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
  }

  // Query SQL để thêm dữ liệu chuyến bay
  const query = `
    INSERT INTO flight (fnumber, airplane_id, d_city, d_date_time, a_city, a_date_time, price)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(query, [fnumber, airplane_id, d_city, d_date_time, a_city, a_date_time, price], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Có lỗi xảy ra khi thêm chuyến bay.' });
    }

    res.json({ message: 'Chuyến bay đã được thêm thành công!' });
  });
});

app.delete('/deleteFlight/:id', (req, res) => {
  const { id } = req.params; // Lấy flight id từ params

  // Query SQL để xóa chuyến bay
  const query = 'DELETE FROM flight WHERE id = ?';

  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Có lỗi xảy ra khi xóa chuyến bay.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy chuyến bay với ID này.' });
    }

    res.json({ message: 'Chuyến bay đã được xóa thành công!' });
  });
});


app.post('/flights-by-date', (req, res) => {
  const { datetime } = req.body;  // Lấy ngày giờ từ request
  const selectedDate = moment(datetime).format('YYYY-MM-DD');  // Chuyển đổi ngày tháng đã chọn
  const selectedTime = moment(datetime).format('HH:mm:ss');  // Chuyển đổi giờ đã chọn

  // Truy vấn các chuyến bay từ cơ sở dữ liệu
  const query = `
    SELECT f.id, f.fnumber, f.d_date_time, f.a_date_time, f.price, a.capacity,
    (a.capacity - IFNULL(sb.seats_booked, 0)) AS available_seats,
    dep_city.name AS departure_city_name, arr_city.name AS arrival_city_name
    FROM flight f
    JOIN airplane a ON f.airplane_id = a.id
    JOIN city dep_city ON f.d_city = dep_city.id
    JOIN city arr_city ON f.a_city = arr_city.id
    LEFT JOIN seats_booked sb ON f.id = sb.flight_id
    WHERE DATE(f.d_date_time) = ? AND TIME(f.d_date_time) >= ?
    HAVING available_seats > 0
  `;

  // Chạy truy vấn để lấy các chuyến bay
  connection.query(query, [selectedDate, selectedTime], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    // Trả kết quả về dưới dạng JSON
    res.json({ flights: results });
  });
});

app.post('/delayFlight/:id', (req, res) => {
  const { id } = req.params; // Lấy flight id từ params
  const { delayHours } = req.body; // Lấy số giờ delay từ body

  if (!delayHours || isNaN(delayHours)) {
    return res.status(400).json({ message: 'Vui lòng nhập số giờ delay hợp lệ!' });
  }

  // Query SQL để cập nhật giờ khởi hành
  const query = `
    UPDATE flight
    SET 
      d_date_time = DATE_ADD(d_date_time, INTERVAL ? HOUR),
      a_date_time = DATE_ADD(a_date_time, INTERVAL ? HOUR)
    WHERE id = ?
  `;

  connection.query(query, [delayHours, delayHours, id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Có lỗi xảy ra khi cập nhật giờ khởi hành.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy chuyến bay với ID này.' });
    }

    res.json({ message: 'Cập nhật giờ khởi hành thành công!' });
  });
});

// Backend: Tạo API để lấy thống kê đặt vé
app.get('/bookingStats', (req, res) => {
  const { period } = req.query;  // "day", "week", "month"
  
  let dateCondition = '';
  const currentDate = new Date();

  // Tạo điều kiện để lọc dữ liệu theo ngày, tuần hoặc tháng
  switch (period) {
    case 'day':
      dateCondition = `DATE(booking_time) = DATE(NOW())`;  // Lọc theo ngày hiện tại
      break;
    case 'week':
      dateCondition = `YEARWEEK(booking_time, 1) = YEARWEEK(NOW(), 1)`;  // Lọc theo tuần hiện tại
      break;
    case 'month':
      dateCondition = `YEAR(booking_time) = YEAR(NOW()) AND MONTH(booking_time) = MONTH(NOW())`;  // Lọc theo tháng hiện tại
      break;
    default:
      return res.status(400).json({ message: 'Invalid period. Please use "day", "week", or "month".' });
  }

  const query = `
    SELECT COUNT(*) AS bookingCount
    FROM booking
    WHERE ${dateCondition}
  `;

  connection.query(query, (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Có lỗi xảy ra khi lấy thống kê.' });
    }

    res.json({
      message: `Thống kê đặt vé trong khoảng thời gian ${period}`,
      bookingCount: result[0].bookingCount,
    });
  });
});


// Route để phục vụ trang index
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); // Đảm bảo index.html nằm trong thư mục gốc
});

// Chạy server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

process.on('SIGINT', async () => {
  if (connection) await connection.close(); // Đóng kết nối database
  console.log('Database connection closed.');
  process.exit(0);
});
