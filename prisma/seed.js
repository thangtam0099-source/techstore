const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // 1. Clear existing data
  await prisma.review.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.user.deleteMany();

  console.log("Cleared old data.");

  // 2. Create Users
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Quản Trị Viên Shop",
      email: "admin@shop.com",
      passwordHash: adminPassword,
      role: "ADMIN",
      phone: "0901234567",
      address: "Quận 1, TP. Hồ Chí Minh",
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      name: "Nguyễn Văn Khách",
      email: "user@shop.com",
      passwordHash: userPassword,
      role: "USER",
      phone: "0912345678",
      address: "Ba Đình, Hà Nội",
    },
  });

  console.log("Created demo admin and user accounts.");

  // 3. Create Categories
  const categoriesData = [
    { name: "Điện thoại", slug: "dien-thoai", icon: "Smartphone", description: "Điện thoại thông minh chính hãng" },
    { name: "Laptop", slug: "laptop", icon: "Laptop", description: "Máy tính xách tay văn phòng, đồ họa, gaming" },
    { name: "Tablet", slug: "tablet", icon: "Tablet", description: "Máy tính bảng phục vụ học tập, giải trí" },
    { name: "Tai nghe", slug: "tai-nghe", icon: "Headphones", description: "Tai nghe True Wireless, tai nghe chụp tai chống ồn" },
    { name: "Đồng hồ thông minh", slug: "dong-ho-thong-minh", icon: "Watch", description: "Smartwatch theo dõi sức khỏe và luyện tập" },
    { name: "Phụ kiện", slug: "phu-kien", icon: "Mouse", description: "Chuột, bàn phím, cáp sạc, phụ kiện công nghệ" },
    { name: "Linh kiện máy tính", slug: "linh-kien-may-tinh", icon: "Cpu", description: "SSD, RAM, card đồ họa nâng cấp PC" },
    { name: "Thiết bị mạng", slug: "thiet-bi-mang", icon: "Wifi", description: "Router Wi-Fi 6, bộ phát mesh gia đình" },
  ];

  const categoryMap = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categoryMap[cat.slug] = created.id;
  }

  // 4. Create Brands
  const brandsData = [
    { name: "Apple", slug: "apple" },
    { name: "Samsung", slug: "samsung" },
    { name: "Xiaomi", slug: "xiaomi" },
    { name: "ASUS", slug: "asus" },
    { name: "Sony", slug: "sony" },
    { name: "Logitech", slug: "logitech" },
    { name: "Keychron", slug: "keychron" },
    { name: "Corsair", slug: "corsair" },
    { name: "TP-Link", slug: "tp-link" },
  ];

  const brandMap = {};
  for (const b of brandsData) {
    const created = await prisma.brand.create({ data: b });
    brandMap[b.slug] = created.id;
  }

  // 5. Products Data
  const products = [
    {
      name: "iPhone 16 Pro Max",
      slug: "iphone-16-pro-max",
      sku: "IP16PM-256-NT",
      brandId: brandMap["apple"],
      categoryId: categoryMap["dien-thoai"],
      price: 34990000,
      salePrice: 36990000,
      stock: 15,
      isFeatured: true,
      salesCount: 48,
      shortDescription: "Chip A18 Pro đột phá, vỏ Titan cao cấp, cụm camera 48MP và nút Camera Control hoàn toàn mới.",
      description: `iPhone 16 Pro Max trang bị màn hình Super Retina XDR 6.9 inch với viền mỏng nhất từng có trên các thiết bị Apple. Khung vỏ bằng titan cấp độ 5 siêu bền bỉ và trọng lượng nhẹ.

Hệ thống camera Pro gồm camera chính Fusion 48MP, camera Ultra Wide 48MP và camera Telephoto 5x 120mm quang học cho khả năng chụp ảnh và quay video 4K 120fps chuẩn điện ảnh. Thời lượng pin tốt nhất lịch sử iPhone, hỗ trợ sạc nhanh MagSafe 25W.`,
      specifications: JSON.stringify({
        "Thương hiệu": "Apple",
        "Màn hình": "6.9 inch, Super Retina XDR OLED, 120Hz ProMotion",
        "Vi xử lý": "Apple A18 Pro 6 lõi (3nm thế hệ 2)",
        "Bộ nhớ trong": "256GB / 512GB / 1TB",
        "RAM": "8GB",
        "Camera sau": "Chính 48MP + Góc siêu rộng 48MP + Tele 12MP 5x",
        "Camera trước": "12MP TrueDepth",
        "Pin & Sạc": "Lên tới 33 giờ xem video, sạc nhanh 25W MagSafe",
        "Hệ điều hành": "iOS 18",
        "Trọng lượng": "227g",
      }),
      images: [
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=1000&auto=format&fit=crop",
      ],
      variants: [
        { name: "Phiên bản", value: "256GB - Titan Sa Mạc", price: 34990000, stock: 6 },
        { name: "Phiên bản", value: "256GB - Titan Tự Nhiên", price: 34990000, stock: 5 },
        { name: "Phiên bản", value: "512GB - Titan Đen", price: 40990000, stock: 4 },
      ],
      reviews: [
        { rating: 5, comment: "Máy thiết kế cực đẹp, cầm đầm tay, camera control chụp rất tiện." },
        { rating: 5, comment: "Pin dùng cả ngày thoải mái, màn hình 6.9 inch xem phim cực đã." },
      ],
    },
    {
      name: "Samsung Galaxy S24 Ultra",
      slug: "samsung-galaxy-s24-ultra",
      sku: "SGS24U-256-TI",
      brandId: brandMap["samsung"],
      categoryId: categoryMap["dien-thoai"],
      price: 28490000,
      salePrice: 31990000,
      stock: 12,
      isFeatured: true,
      salesCount: 39,
      shortDescription: "Galaxy AI đỉnh cao, màn hình phẳng Dynamic AMOLED 2X 120Hz chống chói, bút S Pen quyền năng.",
      description: `Samsung Galaxy S24 Ultra mở ra kỷ nguyên mới với Galaxy AI tích hợp sẵn: Phiên dịch cuộc gọi trực tiếp, Trợ lý chat thông minh, Khoanh tròn để tìm kiếm (Circle to Search).

Khung viền Titan sang trọng, kính cường lực Corning Gorilla Armor giảm 75% độ phản xạ ánh sáng. Cụm camera 200MP tái hiện chi tiết sắc nét ngay cả trong điều kiện thiếu sáng.`,
      specifications: JSON.stringify({
        "Thương hiệu": "Samsung",
        "Màn hình": "6.8 inch Dynamic AMOLED 2X, QHD+, 120Hz, 2600 nits",
        "Vi xử lý": "Snapdragon 8 Gen 3 for Galaxy (4nm)",
        "RAM": "12GB",
        "Bộ nhớ trong": "256GB / 512GB",
        "Camera sau": "200MP + 50MP (5x) + 12MP (Góc siêu rộng) + 10MP (3x)",
        "Camera trước": "12MP",
        "Pin": "5000 mAh, sạc nhanh 45W",
        "Hệ điều hành": "One UI 6.1 (Android 14)",
      }),
      images: [
        "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=1000&auto=format&fit=crop",
      ],
      variants: [
        { name: "Màu sắc", value: "Xám Titan - 256GB", price: 28490000, stock: 7 },
        { name: "Màu sắc", value: "Đen Titan - 512GB", price: 32490000, stock: 5 },
      ],
      reviews: [
        { rating: 5, comment: "Galaxy AI dùng rất đã, màn hình không bị lóa khi ra ngoài trời nắng." },
      ],
    },
    {
      name: "MacBook Pro 14 M3 Pro",
      slug: "macbook-pro-14-m3-pro",
      sku: "MBP14-M3P-18-512",
      brandId: brandMap["apple"],
      categoryId: categoryMap["laptop"],
      price: 48990000,
      salePrice: 52990000,
      stock: 8,
      isFeatured: true,
      salesCount: 22,
      shortDescription: "Hiệu năng vượt trội với chip Apple M3 Pro 11-core CPU, 14-core GPU, màn hình Liquid Retina XDR 120Hz.",
      description: `MacBook Pro 14 inch M3 Pro mang lại hiệu năng phi thường và thời lượng pin đáng kinh ngạc lên đến 18 giờ.

Màn hình Liquid Retina XDR với Extreme Dynamic Range, độ sáng liên tục 1.000 nits cho nội dung HDR. Cổng kết nối đa dạng gồm HDMI, đầu đọc thẻ SDXC, jack tai nghe và 3 cổng Thunderbolt 4.`,
      specifications: JSON.stringify({
        "Thương hiệu": "Apple",
        "Màn hình": "14.2 inch Liquid Retina XDR (3024 x 1964), 120Hz",
        "CPU": "Apple M3 Pro (11 nhân CPU, 14 nhân GPU)",
        "RAM": "18GB Unified Memory",
        "Ổ cứng": "512GB SSD",
        "Pin": "Thời lượng lên đến 18 giờ, sạc 70W USB-C",
        "Trọng lượng": "1.61 kg",
      }),
      images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1000&auto=format&fit=crop",
      ],
      variants: [
        { name: "Màu sắc", value: "Đen Không Gian (Space Black)", price: 48990000, stock: 5 },
        { name: "Màu sắc", value: "Bạc (Silver)", price: 48990000, stock: 3 },
      ],
      reviews: [
        { rating: 5, comment: "Máy chạy cực mát và êm, render video 4K mượt mà không bị nóng." },
      ],
    },
    {
      name: "ASUS TUF Gaming A15",
      slug: "asus-tuf-gaming-a15",
      sku: "ASUS-TUF-A15-R7",
      brandId: brandMap["asus"],
      categoryId: categoryMap["laptop"],
      price: 24990000,
      salePrice: 27990000,
      stock: 10,
      isFeatured: false,
      salesCount: 31,
      shortDescription: "AMD Ryzen 7 7735HS, NVIDIA GeForce RTX 4060 8GB, màn hình 144Hz 100% sRGB bền bỉ chuẩn quân đội.",
      description: `ASUS TUF Gaming A15 là cỗ máy chiến game bền bỉ đạt tiêu chuẩn độ bền quân sự MIL-STD-810H. 
Sở hữu card đồ họa NVIDIA GeForce RTX 4060 kết hợp cùng MUX Switch và NVIDIA Advanced Optimus giúp tối ưu hóa từng khung hình. Hệ thống tản nhiệt Arc Flow Fans giữ cho máy luôn mát mẻ khi combat căng thẳng.`,
      specifications: JSON.stringify({
        "Thương hiệu": "ASUS",
        "Màn hình": "15.6 inch FHD (1920x1080) 144Hz, 100% sRGB",
        "CPU": "AMD Ryzen 7 7735HS (8 nhân 16 luồng)",
        "VGA": "NVIDIA GeForce RTX 4060 8GB GDDR6",
        "RAM": "16GB DDR5 4800MHz (nâng cấp tối đa 32GB)",
        "Ổ cứng": "512GB PCIe 4.0 NVMe M.2 SSD",
        "Trọng lượng": "2.20 kg",
      }),
      images: [
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1000&auto=format&fit=crop",
      ],
      variants: [
        { name: "Cấu hình", value: "Ryzen 7 / 16GB / 512GB / RTX 4060", price: 24990000, stock: 10 },
      ],
      reviews: [
        { rating: 5, comment: "Chiến Black Myth Wukong và CS2 mượt mà, tản nhiệt tốt trong tầm giá." },
      ],
    },
    {
      name: "iPad Pro M4 11 inch",
      slug: "ipad-pro-m4-11-inch",
      sku: "IPAD-M4-11-256",
      brandId: brandMap["apple"],
      categoryId: categoryMap["tablet"],
      price: 27990000,
      salePrice: 29990000,
      stock: 9,
      isFeatured: true,
      salesCount: 18,
      shortDescription: "Độ mỏng không tưởng chỉ 5.3mm, chip M4 thế hệ tiếp theo, màn hình Ultra Retina XDR Tandem OLED.",
      description: `iPad Pro hoàn toàn mới được thiết kế mỏng ấn tượng nhất lịch sử các sản phẩm của Apple. Chip M4 mang lại sức mạnh vượt bậc cho quy trình làm việc chuyên nghiệp từ chỉnh sửa video đến vẽ đồ họa 3D.`,
      specifications: JSON.stringify({
        "Thương hiệu": "Apple",
        "Màn hình": "11 inch Ultra Retina XDR Tandem OLED, 120Hz ProMotion",
        "Vi xử lý": "Apple M4 9 lõi CPU, 10 lõi GPU",
        "RAM": "8GB",
        "Bộ nhớ trong": "256GB / 512GB",
        "Độ mỏng": "5.3 mm siêu nhẹ 444g",
      }),
      images: [
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1000&auto=format&fit=crop",
      ],
      variants: [
        { name: "Màu sắc", value: "Bạc - 256GB WiFi", price: 27990000, stock: 5 },
        { name: "Màu sắc", value: "Đen Không Gian - 256GB WiFi", price: 27990000, stock: 4 },
      ],
      reviews: [
        { rating: 5, comment: "Màn hình OLED màu đen sâu tuyệt đối, vẽ Procreate siêu mượt." },
      ],
    },
    {
      name: "AirPods Pro 2 (USB-C)",
      slug: "airpods-pro-2-usb-c",
      sku: "APP2-USBC",
      brandId: brandMap["apple"],
      categoryId: categoryMap["tai-nghe"],
      price: 5490000,
      salePrice: 6190000,
      stock: 25,
      isFeatured: true,
      salesCount: 65,
      shortDescription: "Chống ồn chủ động ANC gấp 2 lần, âm thanh thích ứng Adaptive Audio, cổng sạc USB-C tiện lợi.",
      description: `AirPods Pro 2 trang bị chip H2 cho hiệu năng âm thanh sống động, khử ồn thông minh và khả năng nghe xuyên âm thích ứng. Hộp sạc MagSafe hỗ trợ tìm chính xác với chip U1 và khả năng chống bụi nước IP54.`,
      specifications: JSON.stringify({
        "Thương hiệu": "Apple",
        "Chip âm thanh": "Apple H2",
        "Chống ồn": "Chống ồn chủ động (Active Noise Cancellation) gấp 2x",
        "Thời lượng pin": "6 giờ (tai nghe), lên tới 30 giờ (kèm hộp sạc)",
        "Cổng sạc": "USB-C, sạc không dây MagSafe / Qi",
        "Kháng nước": "IP54 chống bụi & giọt bắn",
      }),
      images: [
        "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=1000&auto=format&fit=crop",
      ],
      variants: [
        { name: "Phiên bản", value: "Hộp sạc MagSafe (USB-C)", price: 5490000, stock: 25 },
      ],
      reviews: [
        { rating: 5, comment: "Chống ồn cực kỳ êm ái, đeo đi tàu xe hay làm việc quán cafe không nghe thấy tiếng ồn xung quanh." },
      ],
    },
    {
      name: "Sony WH-1000XM5",
      slug: "sony-wh-1000xm5",
      sku: "SONY-XM5-BLK",
      brandId: brandMap["sony"],
      categoryId: categoryMap["tai-nghe"],
      price: 7490000,
      salePrice: 8490000,
      stock: 14,
      isFeatured: true,
      salesCount: 42,
      shortDescription: "Tai nghe chụp tai chống ồn hàng đầu thế giới với bộ xử lý tích hợp V1 và HD QN1, đàm thoại trong trẻo.",
      description: `Sony WH-1000XM5 định nghĩa lại tiêu chuẩn chống ồn với 8 micro và 2 bộ xử lý âm thanh chuyên dụng. Màng loa 30mm sợi carbon nhẹ đem lại chất âm Hi-Res Audio tinh tế. Đệm tai da mềm thoải mái cả ngày dài.`,
      specifications: JSON.stringify({
        "Thương hiệu": "Sony",
        "Kiểu dáng": "Over-ear (chụp tai)",
        "Thời lượng pin": "30 giờ bật chống ồn (sạc nhanh 3 phút được 3 giờ)",
        "Codec hỗ trợ": "LDAC, AAC, SBC",
        "Trọng lượng": "250g siêu nhẹ",
        "Micro": "4 micro định chùm sóng khử ồn đàm thoại",
      }),
      images: [
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop",
      ],
      variants: [
        { name: "Màu sắc", value: "Đen Huyền Bí", price: 7490000, stock: 8 },
        { name: "Màu sắc", value: "Bạc Bạch Kim", price: 7490000, stock: 6 },
      ],
      reviews: [
        { rating: 5, comment: "Chất âm ấm áp, dải bass sâu, đeo lâu không bị ép tai đau đầu." },
      ],
    },
    {
      name: "Apple Watch Series 10",
      slug: "apple-watch-series-10",
      sku: "AWS10-46-BLK",
      brandId: brandMap["apple"],
      categoryId: categoryMap["dong-ho-thong-minh"],
      price: 10490000,
      salePrice: 11490000,
      stock: 11,
      isFeatured: true,
      salesCount: 28,
      shortDescription: "Thiết kế mỏng nhất từ trước đến nay, màn hình OLED góc nhìn rộng lớn hơn, sạc nhanh 80% trong 30 phút.",
      description: `Apple Watch Series 10 sở hữu màn hình rộng nhất và mỏng hơn gần 10% so với thế hệ trước. Trang bị cảm biến đo độ sâu và nhiệt độ nước, phát hiện ngưng thở khi ngủ và loa ngoài phát nhạc trực tiếp.`,
      specifications: JSON.stringify({
        "Thương hiệu": "Apple",
        "Màn hình": "Wide-angle OLED Always-On Retina",
        "Kích thước": "42mm / 46mm",
        "Chất liệu viền": "Nhôm tái chế 100% / Titan đánh bóng",
        "Kháng nước": "50m, chứng nhận lặn nông 6m",
        "Thời lượng pin": "18 giờ, sạc nhanh 30 phút đạt 80%",
      }),
      images: [
        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1000&auto=format&fit=crop",
      ],
      variants: [
        { name: "Kích thước & Màu", value: "42mm - Nhôm Đen Bóng", price: 10490000, stock: 6 },
        { name: "Kích thước & Màu", value: "46mm - Nhôm Đen Bóng", price: 11290000, stock: 5 },
      ],
      reviews: [
        { rating: 5, comment: "Màn hình to và nhìn chéo rất rõ, tính năng theo dõi giấc ngủ chuẩn xác." },
      ],
    },
    {
      name: "Chuột không dây Logitech MX Master 3S",
      slug: "chuot-logitech-mx-master-3s",
      sku: "LOGI-MXM3S-GR",
      brandId: brandMap["logitech"],
      categoryId: categoryMap["phu-kien"],
      price: 2190000,
      salePrice: 2490000,
      stock: 30,
      isFeatured: true,
      salesCount: 88,
      shortDescription: "Con lăn cơ học MagSpeed siêu nhanh, cảm biến 8000 DPI lướt mượt trên kính, click êm Quiet Clicks.",
      description: `Biểu tượng chuột công thái học cho dân thiết kế, lập trình và sáng tạo nội dung. Cảm biến quang học 8.000 DPI có thể theo dõi trên hầu như mọi bề mặt, kể cả mặt kính. Kết nối tối đa 3 thiết bị và chuyển đổi mượt mà qua Easy-Switch.`,
      specifications: JSON.stringify({
        "Thương hiệu": "Logitech",
        "Cảm biến": "Darkfield 8000 DPI (chạy được trên kính)",
        "Nút bấm": "7 nút tùy chỉnh với công nghệ Quiet Click",
        "Con lăn": "MagSpeed cuộn 1.000 dòng/giây",
        "Kết nối": "Bluetooth Low Energy & Logi Bolt USB Receiver",
        "Pin": "Pin sạc Li-Po 500 mAh, dùng đến 70 ngày",
      }),
      images: [
        "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=1000&auto=format&fit=crop",
      ],
      variants: [
        { name: "Màu sắc", value: "Graphite (Xám Đen)", price: 2190000, stock: 20 },
        { name: "Màu sắc", value: "Pale Gray (Xám Trắng)", price: 2190000, stock: 10 },
      ],
      reviews: [
        { rating: 5, comment: "Cầm vừa khít lòng bàn tay, cuộn bánh xe MagSpeed nghiện luôn." },
        { rating: 5, comment: "Click cực kỳ êm không gây tiếng ồn trong văn phòng yên tĩnh." },
      ],
    },
    {
      name: "Bàn phím cơ Keychron K2 Pro",
      slug: "ban-phim-co-keychron-k2-pro",
      sku: "KEYCHRON-K2P-BR",
      brandId: brandMap["keychron"],
      categoryId: categoryMap["phu-kien"],
      price: 2350000,
      salePrice: 2650000,
      stock: 18,
      isFeatured: true,
      salesCount: 54,
      shortDescription: "Bàn phím cơ không dây layout 75%, hỗ trợ QMK/VIA tùy biến toàn diện, Hot-swappable, switch Gateron Pro.",
      description: `Keychron K2 Pro là bàn phím cơ không dây layout 75% nâng cấp hoàn hảo. Tích hợp sẵn đệm tiêu âm EVA foam, keycap PBT double-shot OSA profile bền bỉ. Hỗ trợ thay nóng switch (hot-swap) và kết nối qua Bluetooth 5.1 hoặc cáp Type-C cho cả Mac & Windows.`,
      specifications: JSON.stringify({
        "Thương hiệu": "Keychron",
        "Layout": "75% (84 phím)",
        "Switch": "Keychron K Pro Brown / Red (Hot-swap)",
        "Keycap": "PBT Double-shot OSA profile",
        "Đèn nền": "RGB với 22 hiệu ứng ánh sáng",
        "Pin": "4000 mAh lên tới 300 giờ làm việc (tắt led)",
        "Tương thích": "macOS, Windows, Linux, Android",
      }),
      images: [
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=1000&auto=format&fit=crop",
      ],
      variants: [
        { name: "Switch", value: "K Pro Brown Switch (Tactile)", price: 2350000, stock: 10 },
        { name: "Switch", value: "K Pro Red Switch (Linear)", price: 2350000, stock: 8 },
      ],
      reviews: [
        { rating: 5, comment: "Âm gõ trầm đục rất hay, pin trâu dùng 2 tuần chưa phải sạc." },
      ],
    },
    {
      name: "SSD Samsung 990 Pro 1TB PCIe 4.0 NVMe",
      slug: "ssd-samsung-990-pro-1tb",
      sku: "SAM-990P-1TB",
      brandId: brandMap["samsung"],
      categoryId: categoryMap["linh-kien-may-tinh"],
      price: 2790000,
      salePrice: 3190000,
      stock: 22,
      isFeatured: false,
      salesCount: 40,
      shortDescription: "Tốc độ đọc tuần tự lên đến 7450 MB/s, ghi 6900 MB/s, chuẩn giao tiếp PCIe Gen 4.0 x4 tối ưu cho game và đồ họa.",
      description: `Samsung 990 Pro đạt đỉnh cao tốc độ của giao thức PCIe 4.0. Khả năng kiểm soát nhiệt độ thông minh với lớp phủ niken và thuật toán tản nhiệt nâng cao giữ cho ổ cứng luôn vận hành ổn định trong các tác vụ nặng nhất.`,
      specifications: JSON.stringify({
        "Thương hiệu": "Samsung",
        "Dung lượng": "1TB (1000GB)",
        "Chuẩn kết nối": "PCIe Gen 4.0 x4, NVMe 2.0",
        "Tốc độ đọc": "Lên tới 7,450 MB/s",
        "Tốc độ ghi": "Lên tới 6,900 MB/s",
        "Độ bền (TBW)": "600 TBW, bảo hành 5 năm",
      }),
      images: [
        "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=1000&auto=format&fit=crop",
      ],
      variants: [
        { name: "Dung lượng", value: "1TB M.2 NVMe", price: 2790000, stock: 14 },
        { name: "Dung lượng", value: "2TB M.2 NVMe", price: 4790000, stock: 8 },
      ],
      reviews: [
        { rating: 5, comment: "Lắp vào PS5 và PC load game trong chớp mắt, rất đáng tiền." },
      ],
    },
    {
      name: "Router Wi-Fi 6 TP-Link Archer AX73 AX5400",
      slug: "router-wifi-6-tp-link-archer-ax73",
      sku: "TPLINK-AX73",
      brandId: brandMap["tp-link"],
      categoryId: categoryMap["thiet-bi-mang"],
      price: 2190000,
      salePrice: 2590000,
      stock: 16,
      isFeatured: false,
      salesCount: 33,
      shortDescription: "Tốc độ kép Wi-Fi 6 lên đến 5400 Mbps, 6 ăng-ten ngoài công suất cao, hỗ trợ OneMesh phủ sóng toàn ngôi nhà.",
      description: `Router TP-Link Archer AX73 mang tới kết nối không dây tốc độ cao 5.4 Gbps mượt mà cho livestream 8K, chơi game không độ trễ. Trang bị CPU 3 nhân 1.5 GHz mạnh mẽ và công nghệ MU-MIMO + OFDMA kết nối đồng thời hơn 200 thiết bị.`,
      specifications: JSON.stringify({
        "Thương hiệu": "TP-Link",
        "Chuẩn Wi-Fi": "Wi-Fi 6 (802.11ax/ac/n/a 5 GHz, 802.11ax/n/b/g 2.4 GHz)",
        "Băng tần": "5 GHz: 4804 Mbps, 2.4 GHz: 574 Mbps",
        "Ăng-ten": "6 Ăng-ten ngoài hiệu suất cao tích hợp Beamforming",
        "Cổng kết nối": "1x Gigabit WAN, 4x Gigabit LAN, 1x USB 3.0",
        "Bảo mật": "WPA3, HomeShield Security",
      }),
      images: [
        "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1000&auto=format&fit=crop",
      ],
      variants: [
        { name: "Phiên bản", value: "Archer AX73 Tiêu chuẩn", price: 2190000, stock: 16 },
      ],
      reviews: [
        { rating: 5, comment: "Phủ sóng khắp nhà 3 tầng không cần kích sóng, xem video 4K tua không giật." },
      ],
    },
    {
      name: "RAM Corsair Vengeance RGB 32GB DDR5 6000MHz",
      slug: "ram-corsair-vengeance-rgb-32gb-ddr5",
      sku: "COR-VENG-32G-6000",
      brandId: brandMap["corsair"],
      categoryId: categoryMap["linh-kien-may-tinh"],
      price: 3290000,
      salePrice: 3590000,
      stock: 14,
      isFeatured: false,
      salesCount: 25,
      shortDescription: "Kit 32GB (2x16GB) DDR5 bus 6000MHz CL36, tản nhiệt nhôm tinh tế kết hợp LED RGB đa vùng rực rỡ.",
      description: `Corsair Vengeance RGB DDR5 tối ưu hóa cho bo mạch chủ Intel và AMD thế hệ mới nhất. Tương thích chuẩn XMP 3.0 và EXPO cho phép ép xung ổn định bằng một cú click. Đèn LED RGB 10 vùng siêu sáng tùy biến qua phần mềm iCUE.`,
      specifications: JSON.stringify({
        "Thương hiệu": "Corsair",
        "Loại RAM": "DDR5 Desktop",
        "Dung lượng": "32GB (2 x 16GB)",
        "Tốc độ Bus": "6000 MHz",
        "Độ trễ": "CL36-36-36-76",
        "Điện áp": "1.35V",
      }),
      images: [
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop",
      ],
      variants: [
        { name: "Màu sắc", value: "Đen (Black) - 32GB 6000MHz", price: 3290000, stock: 8 },
        { name: "Màu sắc", value: "Trắng (White) - 32GB 6000MHz", price: 3390000, stock: 6 },
      ],
      reviews: [
        { rating: 5, comment: "Bật XMP một phát lên ngay 6000MHz, led RGB đẹp và đồng bộ mượt với iCUE." },
      ],
    },
    {
      name: "Xiaomi 14 Ultra",
      slug: "xiaomi-14-ultra",
      sku: "MI14U-512-WHT",
      brandId: brandMap["xiaomi"],
      categoryId: categoryMap["dien-thoai"],
      price: 24990000,
      salePrice: 28990000,
      stock: 0, // Hết hàng để test trạng thái Out of Stock
      isFeatured: false,
      salesCount: 15,
      shortDescription: "Hệ thống 4 camera Leica 50MP cảm biến 1-inch biến thiên khẩu độ f/1.63 - f/4.0 đỉnh cao nhiếp ảnh.",
      description: `Xiaomi 14 Ultra khẳng định đẳng cấp nhiếp ảnh di động đỉnh cao hợp tác cùng Leica. Màn hình cong bốn cạnh siêu nét C8 AMOLED 120Hz, chip Snapdragon 8 Gen 3 và sạc siêu tốc 90W có dây, 80W không dây.`,
      specifications: JSON.stringify({
        "Thương hiệu": "Xiaomi",
        "Màn hình": "6.73 inch LTPO AMOLED, 120Hz, 3000 nits, Dolby Vision",
        "Vi xử lý": "Snapdragon 8 Gen 3 (4nm)",
        "RAM / ROM": "16GB RAM / 512GB ROM",
        "Camera sau": "4 ống kính Leica 50MP (Cảm biến chính 1 inch LYT-900)",
        "Pin & Sạc": "5000 mAh, sạc nhanh 90W có dây, 80W không dây",
      }),
      images: [
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=1000&auto=format&fit=crop",
      ],
      variants: [
        { name: "Màu sắc", value: "Trắng Gốm - 512GB", price: 24990000, stock: 0 },
      ],
      reviews: [
        { rating: 5, comment: "Camera Leica màu sắc rất có hồn, chụp chân dung xoá phông tự nhiên như máy cơ." },
      ],
    },
  ];

  for (const prodData of products) {
    const { images, variants, reviews, ...prod } = prodData;
    const createdProduct = await prisma.product.create({
      data: prod,
    });

    // Create Images
    for (let i = 0; i < images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: createdProduct.id,
          imageUrl: images[i],
          sortOrder: i,
        },
      });
    }

    // Create Variants
    for (const v of variants) {
      await prisma.productVariant.create({
        data: {
          productId: createdProduct.id,
          name: v.name,
          value: v.value,
          price: v.price,
          stock: v.stock,
        },
      });
    }

    // Create Reviews
    for (const r of reviews) {
      await prisma.review.create({
        data: {
          productId: createdProduct.id,
          userId: demoUser.id,
          rating: r.rating,
          comment: r.comment,
        },
      });
    }
  }

  console.log(`Seeded ${products.length} tech products with images, variants, and reviews successfully.`);
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
