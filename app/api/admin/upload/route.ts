import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const contentType = req.headers.get("content-type") || "";

    // 1. Xử lý tải lên qua multipart/form-data
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const files = formData.getAll("files") as File[];

      if (!files || files.length === 0) {
        return NextResponse.json({ error: "Không tìm thấy file tải lên." }, { status: 400 });
      }

      const uploadedUrls: string[] = [];

      // Thư mục lưu trữ local (cho môi trường local / self-hosted)
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      let canWriteToDisk = true;
      try {
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
      } catch {
        canWriteToDisk = false;
      }

      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        if (canWriteToDisk) {
          try {
            const ext = path.extname(file.name) || ".webp";
            const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
            const filePath = path.join(uploadDir, safeName);
            fs.writeFileSync(filePath, buffer);
            uploadedUrls.push(`/uploads/${safeName}`);
            continue;
          } catch {
            // Nếu không ghi được vào disk (Vercel serverless)
          }
        }

        // Fallback cho môi trường Serverless (Vercel) khi không có ổ đĩa ghi:
        const mimeType = file.type || "image/webp";
        const base64Data = buffer.toString("base64");
        uploadedUrls.push(`data:${mimeType};base64,${base64Data}`);
      }

      return NextResponse.json({
        success: true,
        urls: uploadedUrls,
      });
    }

    // 2. Xử lý tải lên qua JSON (ảnh đã được nén WebP từ client)
    const body = await req.json();
    const { images } = body;

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: "Không có dữ liệu ảnh." }, { status: 400 });
    }

    const savedUrls: string[] = [];
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    let canWriteToDisk = true;
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
    } catch {
      canWriteToDisk = false;
    }

    for (const imgData of images) {
      if (typeof imgData === "string" && imgData.startsWith("data:image/")) {
        if (canWriteToDisk) {
          try {
            const matches = imgData.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
            if (matches) {
              const ext = matches[1] === "jpeg" ? ".jpg" : `.${matches[1]}`;
              const dataBuffer = Buffer.from(matches[2], "base64");
              const fileName = `img-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
              const filePath = path.join(uploadDir, fileName);
              fs.writeFileSync(filePath, dataBuffer);
              savedUrls.push(`/uploads/${fileName}`);
              continue;
            }
          } catch {
            // Môi trường không cho phép ghi disk
          }
        }
        // Giữ nguyên Data URL nếu là serverless
        savedUrls.push(imgData);
      } else if (typeof imgData === "string") {
        savedUrls.push(imgData);
      }
    }

    return NextResponse.json({
      success: true,
      urls: savedUrls,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tải ảnh lên máy chủ." },
      { status: 500 }
    );
  }
}
