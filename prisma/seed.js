const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });


async function main() {
  console.log('Seeding database with rich mock data...');

  // 1. Clear old data to prevent conflicts
  await prisma.document.deleteMany();
  await prisma.news.deleteMany();
  await prisma.user.deleteMany();
  await prisma.budget.deleteMany();

  // 2. Create Admin User
  const admin = await prisma.user.create({
    data: {
      nik: '7105000101700001',
      name: 'Admin Desa Pondos',
      email: 'admin@pondos.desa.id',
      password: 'passwordadmin123',
      role: 'admin',
      address: 'Kantor Hukum Tua Desa Pondos, Jaga 2',
      dusun: 'Jaga 2',
    },
  });
  console.log('Admin user seeded:', admin.email);

  // 3. Create Citizens
  const citizens = [
    {
      nik: '7105001206980002',
      name: 'Brian L.',
      email: 'brian@gmail.com',
      password: 'passwordwarga',
      role: 'warga',
      address: 'Jl. Trans Sulawesi, Desa Pondos, Jaga 3',
      dusun: 'Jaga 3',
    },
    {
      nik: '7105001111900001',
      name: 'Johny Mamahit',
      email: 'johny@gmail.com',
      password: 'password123',
      role: 'warga',
      address: 'Desa Pondos, Jaga 1',
      dusun: 'Jaga 1',
    },
    {
      nik: '7105002222910002',
      name: 'Maria Wowor',
      email: 'maria@gmail.com',
      password: 'password123',
      role: 'warga',
      address: 'Desa Pondos, Jaga 2',
      dusun: 'Jaga 2',
    },
    {
      nik: '7105003333920003',
      name: 'Denny Lontoh',
      email: 'denny@gmail.com',
      password: 'password123',
      role: 'warga',
      address: 'Desa Pondos, Jaga 3',
      dusun: 'Jaga 3',
    },
    {
      nik: '7105004444930004',
      name: 'Frida Senduk',
      email: 'frida@gmail.com',
      password: 'password123',
      role: 'warga',
      address: 'Desa Pondos, Jaga 4',
      dusun: 'Jaga 4',
    },
    {
      nik: '7105005555940005',
      name: 'Ricky Tulung',
      email: 'ricky@gmail.com',
      password: 'password123',
      role: 'warga',
      address: 'Desa Pondos, Jaga 1',
      dusun: 'Jaga 1',
    },
  ];

  const createdCitizens = {};
  for (const c of citizens) {
    const user = await prisma.user.create({ data: c });
    createdCitizens[c.name] = user;
    console.log('Citizen seeded:', user.name);
  }

  // 4. Create Documents (Surat)
  const documents = [
    {
      userId: createdCitizens['Johny Mamahit'].id,
      type: 'Surat Pengantar SKCK',
      notes: 'Untuk keperluan melamar pekerjaan di luar kota.',
      status: 'pending', // "proses" in UI
      createdAt: new Date('2026-04-10T09:00:00Z'),
    },
    {
      userId: createdCitizens['Maria Wowor'].id,
      type: 'Akta Kelahiran',
      notes: 'Pengurusan Akta Kelahiran anak kedua.',
      status: 'pending', // "proses" in UI
      createdAt: new Date('2026-04-09T14:30:00Z'),
    },
    {
      userId: createdCitizens['Denny Lontoh'].id,
      type: 'Kartu Keluarga',
      notes: 'Penambahan anggota keluarga baru.',
      status: 'approved', // "selesai" in UI
      createdAt: new Date('2026-04-08T10:15:00Z'),
    },
    {
      userId: createdCitizens['Frida Senduk'].id,
      type: 'SK Tidak Mampu',
      notes: 'Keperluan pengajuan beasiswa anak sekolah.',
      status: 'approved', // "selesai" in UI
      createdAt: new Date('2026-04-07T11:00:00Z'),
    },
    {
      userId: createdCitizens['Ricky Tulung'].id,
      type: 'Surat Pindah',
      notes: 'Pindah domisili ke Kota Manado.',
      status: 'approved', // "selesai" in UI
      createdAt: new Date('2026-04-05T08:45:00Z'),
    },
  ];

  for (const doc of documents) {
    const createdDoc = await prisma.document.create({ data: doc });
    console.log('Document seeded for:', createdDoc.type);
  }

  // 5. Seed News Articles
  const newsItems = [
    {
      title: 'Musrenbang Desa Pondos Tahun 2026',
      slug: 'musrenbang-desa-pondos-tahun-2026',
      content: 'Pemerintah Desa Pondos telah menyelenggarakan Musyawarah Perencanaan Pembangunan (Musrenbang) tahun 2026 yang dihadiri oleh seluruh perwakilan masyarakat, tokoh agama, dan perangkat desa. Forum ini membahas prioritas pembangunan desa tahun depan termasuk rencana perbaikan jalan desa dan pembangunan drainase di Jaga 3.',
      category: 'Pemerintahan',
      authorId: admin.id,
      createdAt: new Date('2026-04-05T08:00:00Z'),
    },
    {
      title: 'Posyandu Rutin dan Imunisasi Anak',
      slug: 'posyandu-rutin-dan-imunisasi-anak',
      content: 'Kegiatan Posyandu rutin bulan Maret telah dilaksanakan di Balai Desa Pondos. Sebanyak 45 balita mendapat pemeriksaan tumbuh kembang dan imunisasi lengkap. Kegiatan ini didukung oleh tenaga kesehatan dari Puskesmas Amurang Barat dan kader Posyandu setempat.',
      category: 'Kesehatan',
      authorId: admin.id,
      createdAt: new Date('2026-03-28T09:30:00Z'),
    },
    {
      title: 'Gotong Royong Bersihkan Lingkungan Desa',
      slug: 'gotong-royong-bersihkan-lingkungan-desa',
      content: 'Warga Desa Pondos dari keempat jaga melaksanakan kegiatan gotong royong (Mapalus) membersihkan lingkungan desa dan saluran air. Kegiatan ini rutin dilaksanakan setiap dua minggu sekali sebagai wujud semangat kebersamaan masyarakat Minahasa.',
      category: 'Sosial',
      authorId: admin.id,
      createdAt: new Date('2026-03-15T07:30:00Z'),
    },
    {
      title: 'Panen Raya Cengkeh Musim 2026',
      slug: 'panen-raya-cengkeh-musim-2026',
      content: 'Para petani Desa Pondos merayakan panen raya cengkeh dengan hasil yang memuaskan. Produksi tahun ini meningkat 15% dibanding tahun sebelumnya berkat program pendampingan pertanian dari Dinas Pertanian Kabupaten Minahasa Selatan.',
      category: 'Ekonomi',
      authorId: admin.id,
      createdAt: new Date('2026-03-01T10:00:00Z'),
    },
  ];

  for (const item of newsItems) {
    await prisma.news.create({ data: item });
  }

  // 6. Seed Budget Items
  const budgetItems = [
    // PENDAPATAN
    {
      type: 'pendapatan',
      category: 'Dana Desa (APBN)',
      amount: 750000000,
      description: 'Transfer APBN pusat untuk pembangunan dan pemberdayaan masyarakat desa.',
      year: 2026,
    },
    {
      type: 'pendapatan',
      category: 'Alokasi Dana Desa (ADD)',
      amount: 350000000,
      description: 'Alokasi dari APBD Kabupaten Minahasa Selatan.',
      year: 2026,
    },
    {
      type: 'pendapatan',
      category: 'Bagi Hasil Pajak & Retribusi',
      amount: 150000000,
      description: 'Bagi hasil pajak daerah dan retribusi daerah kabupaten.',
      year: 2026,
    },
    {
      type: 'pendapatan',
      category: 'Pendapatan Asli Desa (PADes)',
      amount: 100000000,
      description: 'Hasil pengelolaan aset desa dan pasar desa.',
      year: 2026,
    },
    {
      type: 'pendapatan',
      category: 'Bantuan Keuangan Provinsi / Kabupaten',
      amount: 750000000,
      description: 'Bantuan khusus dari pemerintah provinsi maupun kabupaten.',
      year: 2026,
    },
    // BELANJA
    {
      type: 'belanja',
      category: 'Penyelenggaraan Pemerintahan',
      amount: 350000000,
      description: 'Siltap (Penghasilan Tetap) Hukum Tua, perangkat desa, dan operasional kantor.',
      year: 2026,
    },
    {
      type: 'belanja',
      category: 'Pembangunan Desa',
      amount: 500000000,
      description: 'Pekerjaan drainase, paving block jalan pemukiman, dan talud pengaman.',
      year: 2026,
    },
    {
      type: 'belanja',
      category: 'Pembinaan Kemasyarakatan',
      amount: 180000000,
      description: 'Kegiatan keagamaan, karang taruna, dan pelestarian adat Mapalus.',
      year: 2026,
    },
    {
      type: 'belanja',
      category: 'Pemberdayaan Masyarakat',
      amount: 250000000,
      description: 'Pelatihan ketrampilan tani, pembinaan UMKM, dan insentif kader kesehatan.',
      year: 2026,
    },
    {
      type: 'belanja',
      category: 'Penanggulangan Bencana',
      amount: 100000000,
      description: 'Penanggulangan keadaan darurat bencana alam dan mendesak.',
      year: 2026,
    },
  ];

  for (const item of budgetItems) {
    await prisma.budget.create({ data: item });
  }

  console.log('Database seeding complete with rich mock data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
