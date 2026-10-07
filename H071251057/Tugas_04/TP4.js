// data awal praktikan
const dataPraktikan = [
    { nama : "Budi", nilaiTugas : [80, 85, 90] },
    { nama : "Siti", nilaiTugas : [60, 60, 60] },
    { nama : "Andi", nilaiTugas : [90, 90, 90] },
    { nama : "Dewi", nilaiTugas : [75, 75, 75] },
    { nama : "Eko", nilaiTugas : [45, 45, 45] }
];

// menentukan nilai min
const batasLulus = 75;

// input nama aslab
function verifikasiAsisten() {
    const nama = prompt("Masukkan nama Anda (Asisten Lab): "); 
    if (nama) {
        return nama;
    } else {
        return null;
    }
}

//menghitung nilai rata2 nilai tugas
function hitungRataRata(daftarNilai) {
    if (daftarNilai.length === 0)  //dftrnilai = 0, rtrt = 0
        return 0;
    //mnjmlhkn smw nilai yg ada di dn, llu d smpn k total
    const total = daftarNilai.reduce(function (jumlah, nilai) {
        return jumlah + nilai; 
    }, 0);
    return total / daftarNilai.length;
}

function tentukanStatus(rataRata) {
    if (rataRata >= batasLulus) {
        return "Lulus";
    } else {
        return "Tidak Lulus";
    }
}

function tentukanPredikat(rataRata) {
    if (rataRata >= 85) {
        return "A";
    } else if (rataRata >= 75) {
        return "B";
    } else if (rataRata >= 60) {
        return "C";
    } else if (rataRata >= 50) {
        return "D";
    } else {
        return "E";
    }
}

//memproses data
function prosesData(data) {
    return data.map(function (praktikan) { //mnghsilkn data bru

        const rataRata = hitungRataRata(praktikan.nilaiTugas);
        return {
            nama: praktikan.nama,
            nilaiTugas: praktikan.nilaiTugas,
            rataRata: rataRata,
            predikat: tentukanPredikat(rataRata),
            status: tentukanStatus(rataRata)
        };
    });
}

//tmpiln krtu tiap praktikn
function buatKartu(hasil, urutan) {
    //cek status praktikan lulus atw bkn
    const lulus = hasil.status === "Lulus";
    //menentukan class css
    const kelas = lulus ? "lulus" : "gagal";

    //membuat tmpilan spt T1:80 dst
    const lencanaNilai = hasil.nilaiTugas.map(function (n, i) {
        return '<span class="chip">T' + (i + 1) + ": " + n + "</span>";
    }).join(""); //menggabungkn smw mnjd 1 teks html

    return (
        '<div class="kartu ' + kelas + '">' + //kls luuls/tdklulus
            '<div class="kartu-atas">' +
                //hrf prtm nma sbg avatar
                '<div class="avatar">' + hasil.nama.charAt(0).toUpperCase() + '</div>' +
                '<div>' +
                    '<h3>' + hasil.nama + '</h3>' +
                    '<small>Praktikan #' + urutan + "</small>" +
                "</div>" +
                '<div class="predikat">' + hasil.predikat + "</div>" +
            "</div>" +

            '<div class="chips">' + lencanaNilai + "</div>" +

            '<div class="bar">' +
                //isi progress sesuai rtrt
                '<div class="isi" style="width: ' + hasil.rataRata + '%"></div>' +
            "</div>" +

            '<div class="kartu-bawah">' +
                '<div>' +
                    '<span class="label">Rata-rata</span>' +
                    '<strong>' + hasil.rataRata + "</strong>" +
                "</div>" +
                '<span class="status ' + kelas + '">' +
                    (lulus ? "✔ " : "✖ ") + hasil.status +
                "</span>" +
            "</div>" +
        "</div>"
    );
}

function renderLaporan(namaAsisten, hasilAkhir) {
    //jmlh praktikn lulus n gagal
    const totalLulus = hasilAkhir.filter(function(h){ 
        return h.status === "Lulus";
    }).length;

    const totalGagal = hasilAkhir.length - totalLulus;

    //mnmgmbil smw nilai rtrt org lalu htung rtrt kls
    const rataKelas = hitungRataRata(hasilAkhir.map(function (h) {
            return h.rataRata;
        })
    );

    //nilai trtinggi
    const tertinggi = Math.max.apply(
        null,
        hasilAkhir.map(function (h) {
            return h.rataRata;
        })
    );

    //membuat krtu utk tiap prktikan
    const kartuHTML = hasilAkhir.map(function (h,i) {
        return buatKartu(h, i + 1);
    }).join("");

    //menampilkn html lporan ke halmn
    document.write(
        '<div class="wadah">' +

        "<header>" +
            "<h1>Sistem Evaluasi Praktikum Interaktif</h1>" +

            "<p>Laporan hasil belajar praktikan (batas kelulusan: " + batasLulus + ")</p>" +
        
            '<span class="asisten">Asisten Lab: ' + namaAsisten + "</span>" +
        "</header>" +

        '<section class="ringkasan">' +

            '<div class="stat">' +
                "<span>Total Praktikan</span>" +
                "<strong>" + hasilAkhir.length + "</strong>" +
            "</div>" +

            '<div class="stat">' +
                "<span>Lulus</span>" +
                '<strong style="color:#6fa97a">' + totalLulus + "</strong>" +
            "</div>" +

            '<div class="stat">' +
                "<span>Tidak Lulus</span>" +
                '<strong style="color:#d98b94">' + totalGagal + "</strong>" +
            "</div>" +

            '<div class="stat">' +
                "<span>Rata-rata Kelas</span>" +
                "<strong>" + rataKelas.toFixed(2) + "</strong>" +
            "</div>" +

            '<div class="stat">' +
                "<span>Nilai Tertinggi</span>" +
                "<strong>" + tertinggi + "</strong>" +
            "</div>" +

        //sleuruh dta praktikn mnmplkn
        "</section>" +

        '<section class="grid">' + kartuHTML + "</section>" +

        "<footer>" +
            "Faticha Raisyah Bachtiar - H071251057" +
        "</footer>" +

    "</div>"
  );
}

function renderAksesDitolak() {
  document.write(
    '<div class="box">' +
      "<h2>Akses Ditolak</h2>" +
        "<p>Anda tidak memasukkan identitas asisten.</p>" +
    "</div>"
  );
}

const namaAsisten = verifikasiAsisten();

if (namaAsisten) {
    const hasilAkhir = prosesData(dataPraktikan);
    renderLaporan(namaAsisten, hasilAkhir);

    console.log("Hasil Akhir Evaluasi Praktikum:", hasilAkhir);
    console.table(hasilAkhir);
} else {
    renderAksesDitolak();
}