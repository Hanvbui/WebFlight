// Lấy các phần tử modal, overlay và các liên kết "Xem thêm"
const modal = document.getElementById("modalDV2");
const modalOverlay = document.getElementById("modal-overlay2"); // Lớp phủ nền
const closeModalButton = document.querySelector(".closeDV2");
const readMoreLinks = document.querySelectorAll(".read-moreDV2");

// Mở modal khi click vào "Xem thêm"
readMoreLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault(); // Ngừng hành động mặc định của liên kết

    const title = e.target.getAttribute("data-titleDV2");
    const description = e.target.getAttribute("data-descriptionDV2");

    // Cập nhật nội dung của modal
    document.getElementById("modal-titleDV2").innerText = title;
    document.getElementById("modal-descriptionDV2").innerText = description;

    // Hiển thị modal và lớp phủ nền
    modal.style.display = "block"; // Chỉ hiển thị modal
    modalOverlay.style.display = "block"; // Hiển thị lớp phủ nền
  });
});

// Đóng modal và lớp phủ khi click vào nút đóng
closeModalButton.addEventListener("click", () => {
  modal.style.display = "none"; // Ẩn modal
  modalOverlay.style.display = "none"; // Ẩn lớp phủ nền
});

// Đóng modal nếu nhấn ngoài nội dung modal
window.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    closeModalButton.click(); // Gọi lại sự kiện đóng modal
  }
});
