/**
 * Nén và chuyển đổi ảnh sang định dạng WebP trực tiếp trên trình duyệt
 * Giúp giảm dung lượng từ 5MB-15MB xuống còn ~80-150KB mà vẫn giữ độ nét cao
 */
export async function compressImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Tính toán tỷ lệ co giãn phù hợp
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        // Vẽ ảnh lên canvas với chất lượng làm mượt
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Xuất ra định dạng WebP hiện đại, dung lượng siêu nhẹ
        try {
          const webpData = canvas.toDataURL("image/webp", quality);
          // Nếu trình duyệt hỗ trợ webp và sinh ra dữ liệu hợp lệ
          if (webpData.startsWith("data:image/webp")) {
            resolve(webpData);
          } else {
            // Fallback sang JPEG
            resolve(canvas.toDataURL("image/jpeg", quality));
          }
        } catch {
          resolve(canvas.toDataURL("image/jpeg", quality));
        }
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
  });
}
