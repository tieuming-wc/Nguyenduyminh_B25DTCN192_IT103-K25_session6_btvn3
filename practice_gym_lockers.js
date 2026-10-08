if (typeof prompt === "undefined") {
  var prompt = require("prompt-sync")({ sigint: true });
}

let cardCode = "";
let memberTier = "";
let lockerZone = "";
let lockerNumber = "";
let isValidCard = false;

let rawSupplyString = "";
let towelCount = 0;
let lockCount = 0;
let totalSupplyFee = 0;
let depositFee = 0;

let choice;

do {
  console.log("\n==================================================");
  console.log("   HỆ THỐNG QUẢN LÝ PHÂN BỔ TỦ ĐỒ & VẬT TƯ GYM   ");
  console.log("==================================================");
  console.log("1. Tiếp nhận và xác thực thẻ hội viên");
  console.log("2. Ghi nhận chuỗi vật tư mượn thêm");
  console.log("3. In phiếu bàn giao tủ đồ và tính tổng phụ phí");
  console.log("4. Đóng ca làm việc và thoát");
  console.log("==================================================");

  choice = Number(prompt("Mời bạn chọn chức năng (1-4): "));

  switch (choice) {
    case 1: {
      console.log("\n--- CHỨC NĂNG 1: TIẾP NHẬN & XÁC THỰC THẺ HỘI VIÊN ---");
      let inputCode = prompt(
        "Nhập mã thẻ hội viên (VD: GYM-VIP-2026 hoặc GYM-STANDARD-2026): ",
      );

      if (!inputCode || inputCode.trim() === "") {
        console.log("❌ Mã thẻ không được để trống!");
        isValidCard = false;
        break;
      }

      inputCode = inputCode.trim().toUpperCase();

      if (!inputCode.startsWith("GYM-")) {
        console.log("❌ Thẻ không hợp lệ! Mã thẻ phải bắt đầu bằng 'GYM-'.");
        isValidCard = false;
        break;
      }

      if (inputCode.includes("-VIP-")) {
        memberTier = "VIP";
        lockerZone = "ZONE-A";
        lockerNumber = "A-" + Math.floor(100 + Math.random() * 900);
        isValidCard = true;
      } else if (inputCode.includes("-STANDARD-")) {
        memberTier = "STANDARD";
        lockerZone = "ZONE-B";
        lockerNumber = "B-" + Math.floor(100 + Math.random() * 900);
        isValidCard = true;
      } else {
        console.log(
          "❌ Thẻ không hợp lệ! Không nhận diện được phân hạng VIP hoặc STANDARD.",
        );
        isValidCard = false;
        break;
      }

      cardCode = inputCode;
      rawSupplyString = "";
      towelCount = 0;
      lockCount = 0;
      totalSupplyFee = 0;
      depositFee = 0;

      console.log(`✅ XÁC THỰC THÀNH CÔNG!`);
      console.log(`- Mã thẻ: ${cardCode}`);
      console.log(`- Phân hạng: ${memberTier}`);
      console.log(`- Khu vực tủ: ${lockerZone}`);
      console.log(`- Số tủ phân bổ: ${lockerNumber}`);
      break;
    }

    case 2: {
      console.log("\n--- CHỨC NĂNG 2: GHI NHẬN CHUỖI VẬT TƯ MƯỢN THÊM ---");

      if (!isValidCard) {
        console.log(
          "⚠️ Vui lòng tiếp nhận và xác thực thẻ hội viên (Chức năng 1) trước!",
        );
        break;
      }

      console.log("Nhập chuỗi vật tư (Ví dụ: TOWEL:2|LOCK:1)");
      let inputSupplies = prompt("Chuỗi nhập: ");

      if (!inputSupplies || inputSupplies.trim() === "") {
        console.log("⚠️ Không ghi nhận vật tư mượn thêm.");
        rawSupplyString = "";
        towelCount = 0;
        lockCount = 0;
        break;
      }

      rawSupplyString = inputSupplies.trim().toUpperCase();
      towelCount = 0;
      lockCount = 0;

      let tempStr = rawSupplyString;
      while (tempStr.length > 0) {
        let pipeIndex = tempStr.indexOf("|");
        let itemSegment = "";

        if (pipeIndex !== -1) {
          itemSegment = tempStr.slice(0, pipeIndex);
          tempStr = tempStr.slice(pipeIndex + 1);
        } else {
          itemSegment = tempStr;
          tempStr = "";
        }

        let colonIndex = itemSegment.indexOf(":");
        if (colonIndex !== -1) {
          let itemKey = itemSegment.slice(0, colonIndex).trim();
          let itemQty = Number(itemSegment.slice(colonIndex + 1).trim());

          if (!isNaN(itemQty) && itemQty > 0) {
            if (itemKey === "TOWEL") {
              towelCount += itemQty;
            } else if (itemKey === "LOCK") {
              lockCount += itemQty;
            }
          }
        }
      }

      console.log("✅ BÓC TÁCH CHUỖI VẬT TƯ THÀNH CÔNG:");
      console.log(`- Khăn tắm mượn thêm: ${towelCount} chiếc`);
      console.log(`- Khóa tủ phụ mượn thêm: ${lockCount} chiếc`);
      break;
    }

    case 3: {
      console.log("\n--- CHỨC NĂNG 3: IN PHIẾU BÀN GIAO TỦ ĐỒ ---");

      if (!isValidCard) {
        console.log(
          "⚠️ Vui lòng tiếp nhận và xác thực thẻ hội viên (Chức năng 1) trước!",
        );
        break;
      }

      let billTowelCount = towelCount;
      if (memberTier === "VIP") {
        billTowelCount = Math.max(0, towelCount - 1);
      }

      let towelFee = billTowelCount * 20000;
      let lockFee = lockCount * 15000;
      totalSupplyFee = towelFee + lockFee;

      if (towelCount > 0 || lockCount > 0) {
        depositFee = 50000;
      } else {
        depositFee = 0;
      }

      let totalPayment = totalSupplyFee + depositFee;

      let headerTitle = "PHIẾU BÀN GIAO TỦ ĐỒ & VẬT TƯ";
      console.log("\n==================================================");
      console.log(headerTitle.padStart(35));
      console.log("==================================================");
      console.log(`Mã thẻ hội viên : ${cardCode}`);
      console.log(`Phân hạng       : ${memberTier}`);
      console.log(`Vị trí tủ       : ${lockerZone} (${lockerNumber})`);
      console.log("--------------------------------------------------");
      console.log("CHI TIẾT VẬT TƯ:");

      if (memberTier === "VIP") {
        console.log(`- Khăn tắm lớn (Miễn phí VIP) : 1 chiếc`.padEnd(45));
      }

      if (towelCount > 0) {
        let towelText = `- Khăn tắm mượn thêm (${towelCount} chiếc)`;
        if (memberTier === "VIP") {
          towelText += ` [Tính tiền: ${billTowelCount}]`;
        }
        console.log(
          `${towelText.padEnd(35)} : ${towelFee.toLocaleString("vi-VN")} VNĐ`,
        );
      }

      if (lockCount > 0) {
        let lockText = `- Khóa tủ phụ (${lockCount} chiếc)`;
        console.log(
          `${lockText.padEnd(35)} : ${lockFee.toLocaleString("vi-VN")} VNĐ`,
        );
      }

      if (towelCount === 0 && lockCount === 0 && memberTier !== "VIP") {
        console.log("- Khách hàng không mượn thêm vật tư.");
      }

      console.log("--------------------------------------------------");
      console.log(
        `Tổng phụ phí vật tư : ${totalSupplyFee.toLocaleString("vi-VN").padStart(12)} VNĐ`,
      );
      console.log(
        `Tiền đặt cọc (hoàn lại): ${depositFee.toLocaleString("vi-VN").padStart(10)} VNĐ`,
      );
      console.log("--------------------------------------------------");
      console.log(
        `TỔNG CẦN THANH TOÁN : ${totalPayment.toLocaleString("vi-VN").padStart(12)} VNĐ`,
      );
      console.log("==================================================\n");
      break;
    }

    case 4: {
      console.log("\n==================================================");
      console.log("   ĐÃ ĐÓNG CA LÀM VIỆC & THOÁT HỆ THỐNG          ");
      console.log("==================================================");
      break;
    }

    default: {
      console.log("❌ Lựa chọn không hợp lệ! Vui lòng chọn từ 1 đến 4.");
      break;
    }
  }
} while (choice !== 4);
