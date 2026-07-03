import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// GET — เรียกผ่าน browser ได้เลยเพื่อสร้าง admin user
export async function GET() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.adminUser.upsert({
      where: { email: 'admin@pornpisitbattery.com' },
      update: { 
        password: hashedPassword,
        name: 'Admin User'
      },
      create: {
        email: 'admin@pornpisitbattery.com',
        name: 'Admin User',
        password: hashedPassword,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'สร้าง admin user สำเร็จ! ไปที่ /login ได้เลย',
      admin: { email: admin.email, name: admin.name }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: `สร้างไม่สำเร็จ: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST() {
  try {
    // Hash password with salt rounds 10 (same as seed.ts)
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Create admin user
    const admin = await prisma.adminUser.upsert({
      where: { email: 'admin@pornpisitbattery.com' },
      update: { 
        password: hashedPassword,
        name: 'Admin User'
      },
      create: {
        email: 'admin@pornpisitbattery.com',
        name: 'Admin User',
        password: hashedPassword,
      },
    });

    console.log('Admin user seeded:', admin.email);

    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded successfully',
      admin: {
        email: admin.email,
        name: admin.name
      }
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: `Seed failed: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
