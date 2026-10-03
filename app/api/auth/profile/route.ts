import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
    }

    const { name, phone, address, currentPassword, newPassword } = await req.json();

    const updateData: {
      name?: string;
      phone?: string;
      address?: string;
      passwordHash?: string;
    } = {};

    if (name) updateData.name = name.trim();
    if (phone !== undefined) updateData.phone = phone ? phone.trim() : null;
    if (address !== undefined) updateData.address = address ? address.trim() : null;

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Vui lòng nhập mật khẩu hiện tại để đổi mật khẩu mới." },
          { status: 400 }
        );
      }
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "Mật khẩu mới phải từ 6 ký tự trở lên." },
          { status: 400 }
        );
      }

      const fullUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!fullUser) {
        return NextResponse.json({ error: "Không tìm thấy người dùng." }, { status: 404 });
      }

      const isMatch = await verifyPassword(currentPassword, fullUser.passwordHash);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Mật khẩu hiện tại không chính xác." },
          { status: 400 }
        );
      }

      updateData.passwordHash = await hashPassword(newPassword);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "Cập nhật thông tin thành công.",
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi cập nhật thông tin." },
      { status: 500 }
    );
  }
}
