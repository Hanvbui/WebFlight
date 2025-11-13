// Hàm cập nhật các thành phố tương ứng với quốc gia
function updateCityOptions() {
    const countrySelect = document.getElementById("country-selectTTSB");
    const citySelect = document.getElementById("city-selectTTSB");
    const selectedCountry = countrySelect.value;
  
    // Reset thành phố khi thay đổi quốc gia
    citySelect.innerHTML = '<option value="">Chọn thành phố</option>';
  
    if (selectedCountry === "Vietnam") {
      const cities = ["Hà Nội", "TP Hồ Chí Minh", "Đà Nẵng"];
      cities.forEach((city) => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
      });
    } else if (selectedCountry === "France") {
      const cities = ["Paris"];
      cities.forEach((city) => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
      });
    } else if (selectedCountry === "Anh") {
      const cities = ["London"];
      cities.forEach((city) => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
      });
    } else if (selectedCountry === "TBN") {
      const cities = ["Madrid"];
      cities.forEach((city) => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
      });
    }
  }
  
  // Hàm cập nhật thông tin sân bay khi chọn thành phố
  function updateAirportInfo() {
    const citySelect = document.getElementById("city-selectTTSB");
    const selectedCity = citySelect.value;
    const airportInfo = document.getElementById("airport-infoTTSB");
  
    if (selectedCity === "Hà Nội") {
      airportInfo.innerHTML = `
            <h2 class="info-titleTTSB">Cảng hàng không quốc tế Nội Bài</h2>
            <table class="info-tableTTSB">
              <tr>
                <th>1</th>
                <th>Tên sân bay</th>
                <td>Cảng hàng không quốc tế Nội Bài</td>
              </tr>
              <tr>
                <th>2</th>
                <th>Thông tin chung về nhà ga</th>
                <td>
                  Cảng hàng không quốc tế Nội Bài bao gồm nhà ga nội địa (T1) và nhà
                  ga quốc tế (T2). Nhà ga T1 đưa vào sử dụng từ năm 2001. Từ tháng 1
                  năm 2014, sân bay Nội Bài có thêm nhà ga T2 để đáp ứng nhu cầu đi
                  lại của hành khách.
                </td>
              </tr>
              <tr>
                <th>3</th>
                <th>Vị trí</th>
                <td>
                  Cảng hàng không quốc tế Nội Bài (sân bay Nội Bài) nằm trong địa giới
                  hành chính thuộc huyện Sóc Sơn, thành phố Hà Nội. Sân bay Nội Bài
                  cách trung tâm thành phố khoảng 30km về phía Bắc.
                </td>
              </tr>
              <tr>
                <th>4</th>
                <th>Website</th>
                <td>
                  <a
                    href="https://www.vietnamairport.vn/noibaiairport/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.vietnamairport.vn/noibaiairport/
                  </a>
                </td>
              </tr>
              <tr>
                <th>5</th>
                <th>
                  Phương tiện đi lại từ trung tâm thành phố đến sân bay và ngược lại
                </th>
                <td>
                  Taxi: từ 250.000 VND/lượt<br />
                  Xe mini buýt của sân bay: 40.000 VND/lượt<br />
                  Xe buýt chất lượng cao: 30.000 VND/lượt
                </td>
              </tr>
              <tr>
                <th>6</th>
                <th>Đi lại trong nhà ga</th>
                <td>
                  Nhà ga T1 và T2 cách nhau khoảng 850m. Hành khách di chuyển giữa các
                  nhà ga bằng xe buýt. Thời gian hoạt động của xe buýt từ 06:00 đến
                  01:00 ngày hôm sau (giờ địa phương) với tần suất 10-15 phút/lượt xe.
                  Ngoài ra, các loại hình vận tải khác (xe điện, xe buýt công cộng)
                  vẫn được duy trì. Tại mỗi nhà ga có một vị trí đỗ chờ, tại mỗi vị
                  trí đỗ chờ bố trí một xe buýt và một nhân viên điều hành cùng hệ
                  thống biển báo để hỗ trợ hành khách dễ dàng sử dụng dịch vụ.
                </td>
              </tr>
              <tr>
                <th>7</th>
                <th>Các dịch vụ tiện ích tại sân bay</th>
                <td>
                  Tại nhà ga có một số dịch vụ tiện ích khác như khu vực truy cập
                  internet, dịch vụ đổi tiền, điện thoại công cộng, thông tin du lịch,
                  dịch vụ đóng gói hành lý, quầy ăn nhanh, cà phê, dịch vụ y tế...
                </td>
              </tr>
            </table>
          `;
    } else if (selectedCity === "TP Hồ Chí Minh") {
      // Thêm thông tin cho TP Hồ Chí Minh
      airportInfo.innerHTML = `
        <h2 class="info-titleTTSB">Cảng hàng không quốc tế Tân Sơn Nhất</h2>
        <table class="info-tableTTSB">
          <tr>
            <th>1</th>
            <th>Tên sân bay</th>
            <td>Cảng hàng không quốc tế Tân Sơn Nhất</td>
          </tr>
          <tr>
            <th>2</th>
            <th>Thông tin chung về nhà ga</th>
            <td>
            Cảng hàng không quốc tế Tân Sơn Nhất bao gồm nhà ga nội địa (T1) và nhà ga quốc tế (T2).
            </td>
          </tr>
          <tr>
            <th>3</th>
            <th>Vị trí</th>
            <td>
            Cảng hàng không quốc tế Tân Sơn Nhất nằm ở quận Tân Bình, Thành phố Hồ Chí Minh, cách trung tâm thành phố khoảng 8 km.
            </td>
          </tr>
          <tr>
            <th>4</th>
            <th>Website</th>
            <td>
              <a
                href="https://www.vietnamairport.vn/tansonnhatairport/ "
                target="_blank"
                rel="noopener noreferrer"
              >
              https://www.vietnamairport.vn/tansonnhatairport/ 
              </a>
            </td>
          </tr>
          <tr>
            <th>5</th>
            <th>
              Phương tiện đi lại từ trung tâm thành phố đến sân bay và ngược lại
            </th>
            <td>
            Taxi khoảng 100.000 VND - 200.000 VND<br />
            Xe buýt chất lượng cao từ sân bay về trung tâm thành phố 40.000 VND<br />
            </td>
          </tr>
          <tr>
            <th>6</th>
            <th>Đi lại trong nhà ga</th>
            <td>
            Nhà ga T1 và T2 cách nhau khoảng 500m. Hành khách di chuyển giữa các nhà ga bằng cách đi bộ.
            </td>
          </tr>
          <tr>
            <th>7</th>
            <th>Các dịch vụ tiện ích tại sân bay</th>
            <td>
            Tại nhà ga có một số dịch vụ tiện ích khác như khu vực truy cập internet, dịch vụ đổi tiền, 
            điện thoại công cộng, thông tin du lịch, dịch vụ đóng gói hành lý, quầy ăn nhanh, cà phê, dịch vụ y tế, massage, v.v.
          </tr>
        </table>
      `;
    } else if (selectedCity === "Đà Nẵng") {
      // Thêm thông tin cho Đà Nẵng
      airportInfo.innerHTML = `
        <h2 class="info-titleTTSB">Cảng hàng không quốc tế Đà Nẵng</h2>
        <table class="info-tableTTSB">
          <tr>
            <th>1</th>
            <th>Tên sân bay</th>
            <td>Cảng hàng không quốc tế Đà Nẵng</td>
          </tr>
          <tr>
            <th>2</th>
            <th>Thông tin chung về nhà ga</th>
            <td>
            Cảng hàng không quốc tế Đà Nẵng bao gồm nhà ga nội địa (T1) và nhà ga quốc tế (T2).
            </td>
          </tr>
          <tr>
            <th>3</th>
            <th>Vị trí</th>
            <td>
            Sân bay quận Hải Châu, cách trung tâm thành phố Đà Nẵng 3 km.
            </td>
          </tr>
          <tr>
            <th>4</th>
            <th>Website</th>
            <td>
              <a
                href="https://www.vietnamairport.vn/danangairport/ "
                target="_blank"
                rel="noopener noreferrer"
              >
              https://www.vietnamairport.vn/danangairport/ 
              </a>
            </td>
          </tr>
          <tr>
            <th>5</th>
            <th>
              Phương tiện đi lại từ trung tâm thành phố đến sân bay và ngược lại
            </th>
            <td>
            Taxi giá khoảng 60.000 VND - 80.000 VND về các khu vực trung tâm thành phố<br />
            Xe buýt: 10.000 VND<br />
            </td>
          </tr>
          <tr>
            <th>6</th>
            <th>Đi lại trong nhà ga</th>
            <td>
            Nhà ga T1 và T2 cách nhau khoảng 200m. Hành khách di chuyển giữa các nhà ga bằng hình thức đi bộ.
            </td>
          </tr>
          <tr>
            <th>7</th>
            <th>Các dịch vụ tiện ích tại sân bay</th>
            <td>
            Tại nhà ga có một số dịch vụ tiện ích khác như khu vực truy cập internet, dịch vụ đổi tiền
            , thông tin du lịch, dịch vụ đóng gói hành lý, quầy ăn nhanh, cà phê, dịch vụ y tế, v.v.
          </tr>
        </table>
      `;
    } else if (selectedCity === "Paris") {
      airportInfo.innerHTML = `
        <h2 class="info-titleTTSB">Sân bay quốc tế Paris Charles de Gaulle </h2>
        <table class="info-tableTTSB">
          <tr>
            <th>1</th>
            <th>Tên sân bay</th>
            <td>Sân bay quốc tế Paris Charles de Gaulle</td>
          </tr>
          <tr>
            <th>2</th>
            <th>Thông tin sân bay</th>
            <td>
          Paris Charles de Gaulle (code: CDG) là sân bay quốc tế lớn nhất tại Pháp. Đây cũng là sân bay đông đúc thứ 8 trên thế giới và thứ 2 tại châu Âu về số lượng hành khách.
    Về số lượng chuyến bay, sân bay này cũng đứng thứ 10 trên thế giới và thứ 2 tại châu Âu.
            </td>
          </tr>
          <tr>
            <th>3</th>
            <th>Vị trí</th>
            <td>
            Sân bay Charles de Gaulle Airport nằm cách Paris 27km về phía Đông Bắc.
            </td>
          </tr>
          <tr>
            <th>4</th>
            <th>Website</th>
            <td>
              <a
                href="http://www.aeroportsdeparis.fr/en "
                target="_blank"
                rel="noopener noreferrer"
              >
              http://www.aeroportsdeparis.fr/en
              </a>
            </td>
          </tr>
          <tr>
            <th>5</th>
            <th>
            Đi lại giữa sân bay và trung tâm thành phố Paris
            </th>
            <td>
            Taxi: Chi phí một chuyến đi là 55 Euro với thời gian di chuyển 45 phút.<br />
            Tàu điện: Vé tàu một chiều từ sân bay đến trung tâm thành phố Paris có giá 10 Euro/chuyến người lớn, 6 Euro/chuyến trẻ em.<br />
            Xe bus: National Express là dịch vụ xe bus tốc hành đến trung tâm thành phố với tần suất 30 phút/chuyến, với thời gian trung bình 50 phút/chuyến và giá vé dao động từ 6 - 10 Bảng Anh/chuyến.<br />
            Taxi: Chi phí một chuyến đi là 50 Bảng Anh với thời gian di chuyển trung bình khoảng 30 phút.<br />
            </td>
          </tr>
          <tr>
            <th>6</th>
            <th>Di chuyển trong sân bay</th>
            <td>
            Hành khách có thể di chuyển dễ dàng giữa các nhà ga trong sân bay. Nhà ga 2 và 3 ở trong khoảng cách có thể đi bộ.
            Nhà ga số 4 và 5 có hệ thống xe bus và tàu điện miễn phí. Vào đây để xem thông tin chi tiết.
            </td>
          </tr>
          <tr>
            <th>7</th>
            <th>Trang thiết bị & dịch vụ của sân bay</th>
            <td>
            Sân bay Heathrow cung cấp đầy đủ các loại dịch vụ cần thiết cho khách hàng như truy cập internet,
            đổi tiền, viễn thông liên lạc, thông tin du lịch, thông tin sân bay, bán hàng miễn thuế, đồ ăn, café, v.v.
          </tr>
        </table>
      `;
    } else if (selectedCity === "London") {
      airportInfo.innerHTML = `
        <h2 class="info-titleTTSB">Sân bay quốc tế London Heathrow </h2>
        <table class="info-tableTTSB">
          <tr>
            <th>1</th>
            <th>Tên sân bay</th>
            <td>Sân bay quốc tế London Heathrow</td>
          </tr>
          <tr>
            <th>2</th>
            <th>Thông tin sân bay</th>
            <td>
            Sân bay Heathrow (mã: LHR) là sân bay quốc tế lớn, tại khu vực Hillingdon, London, Anh. Đây là sân bay đông đúc nhất của Anh,
            đồng thời cũng là sân bay đông đúc nhất châu Âu và thứ 6 trên thế giới về số lượng hành khách.
            </td>
          </tr>
          <tr>
            <th>3</th>
            <th>Vị trí của sân bay</th>
            <td>
            Heathrow cách trung tâm Thủ đô London 26km về phía Tây.
            </td>
          </tr>
          <tr>
            <th>4</th>
            <th>Website</th>
            <td>
              <a
                href=" http://www.heathrowairport.com/"
                target="_blank"
                rel="noopener noreferrer"
              >http://www.heathrowairport.com/
              </a>
            </td>
          </tr>
          <tr>
            <th>5</th>
            <th>
            Đi lại giữa sân bay và trung tâm thành phố London
            </th>
            <td>
            Tàu điện ngầm: tuyến tàu điện ngầm Piccadilly di chuyển trung tâm thành phố London với tần suất 10 phút/chuyến, với khoảng 45 phút di chuyển và giá vé 6 Bảng Anh/chiều.<br />
            Tàu hoả: Tàu tốc hành Heathrow Express từ sân bay Heathrow đến ga London Paddington chỉ với 15 phút, tần suất chạy 4 chuyến/giờ, giá vé vào giờ thấp điểm là 22 Bảng Anh, giờ cao điểm là 24 Bảng Anh.<br />
            Xe bus: Tuyến bus tiện nhất là Roissybus, sẽ đưa du khách trực tiếp vào trung tâm. Giá 1 chuyến  Roissybus là 11,5 Euro/người<br />
            </td>
          </tr>
          <tr>
            <th>6</th>
            <th>Di chuyển trong sân bay</th>
            <td>
            Hành khách có thể dễ dàng di chuyển giữa các nhà ga thông qua hệ thống xe shuttle bus miễn phí.
            </td>
          </tr>
          <tr>
            <th>7</th>
            <th>Trang thiết bị & dịch vụ của sân bay</th>
            <td>
            Sân bay Charles de Gaulle cung cấp đầy đủ các loại dịch vụ cần thiết cho khách hàng như truy cập internet,
             đổi tiền, viễn thông liên lạc, thông tin du lịch, thông tin sân bay, bán hàng miễn thuế, đồ ăn, café, v.v. 
          </tr>
        </table>
      `;
    } else if (selectedCity === "Madrid") {
      airportInfo.innerHTML = `
        <h2 class="info-titleTTSB">Sân bay quốc tế Madrid-Barajas</h2>
        <table class="info-tableTTSB">
          <tr>
            <th>1</th>
            <th>Tên sân bay</th>
            <td>Sân bay quốc tế Madrid-Barajas </td>
          </tr>
          <tr>
            <th>2</th>
            <th>Thông tin sân bay</th>
            <td>
              Sân bay quốc tế Madrid-Barajas là sân bay lớn nhất và bận rộn nhất ở Tây Ban Nha. Sân bay này có 4 nhà ga, phục vụ hàng triệu hành khách mỗi năm.
            </td>
          </tr>
          <tr>
            <th>3</th>
            <th>Vị trí</th>
            <td>
              Sân bay nằm cách trung tâm Madrid khoảng 12 km về phía đông.
            </td>
          </tr>
          <tr>
            <th>4</th>
            <th>Website</th>
            <td>
              <a href="https://www.aeropuertomadrid.es/" target="_blank" rel="noopener noreferrer">
                https://www.aeropuertomadrid.es/
              </a>
            </td>
          </tr>
          <tr>
            <th>5</th>
            <th>Đi lại giữa sân bay và trung tâm thành phố Madrid</th>
            <td>
              - Xe buýt: Từ 5 EUR/lượt<br />
              - Xe điện: Từ 3 EUR/lượt<br />
              - Taxi: Khoảng 30 EUR/lượt
            </td>
          </tr>
          <tr>
            <th>6</th>
            <th>Di chuyển trong sân bay</th>
            <td>
              Sân bay có các tuyến xe buýt miễn phí kết nối các nhà ga. Tàu điện ngầm và xe điện cũng dễ dàng sử dụng để di chuyển giữa các khu vực.
            </td>
          </tr>
          <tr>
            <th>7</th>
            <th>Trang thiết bị & dịch vụ của sân bay</th>
            <td>
              Các dịch vụ bao gồm: khu vực Wi-Fi miễn phí, quầy đổi tiền, nhà hàng, cửa hàng miễn thuế, khu vực nghỉ ngơi, và dịch vụ y tế.
            </td>
          </tr>
        </table>
      `;
    } else {
      airportInfo.innerHTML = `<p>Vui lòng chọn một thành phố để xem thông tin sân bay.</p>`;
    }
  }
  