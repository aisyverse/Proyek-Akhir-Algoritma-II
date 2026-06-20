// ==================== OOP BLUEPRINT MAHASISWA (CLASS & ENKAPSULASI) ====================

class Mahasiswa {
    // Properti private (Enkapsulasi) menggunakan tanda pagar '#'
    #nim;
    #nama;
    #ipk;

    constructor(nim, nama, ipk) {
        this.#nim = nim;
        this.#nama = nama;
        this.#ipk = ipk;
    }

    // GETTER: ambil data
    getNim() { return this.#nim; }
    getNama() { return this.#nama; }
    getIpk() { return this.#ipk; }

    // SETTER: Ubah Data (Fitur Edit)
    setNama(namaBaru) { this.#nama = namaBaru; }
    setIpk(ipkBaru) { this.#ipk = ipkBaru; }
}

// ARRAY GLOBAL: Wadah penampung kumpulan Objek (Pointer Reference)
let daftarMahasiswa = [];
let kumpulanTugas = [];

// VARIABEL GLOBAL: Menyimpan Kode OTP Berjalan di Memori Sementara
let kodeOtpSimulasi = "";
let emailOtpSimulasi = "";

// 1. PINDAH PANEL DI GERBANG AKSES LOGIN
function pindahPanel(panelTujuan) {
    const loginPanel = document.getElementById("login-panel");
    const registerPanel = document.getElementById("register-panel");
    const forgotPanel = document.getElementById("forgot-panel");
    const pesanTarget = document.getElementById("login-error");
    
    // Reset pesan error/sukses setiap kali pindah halaman
    pesanTarget.innerText = "";
    pesanTarget.style.color = "red";

    // Sembunyikan ketiga panel terlebih dahulu
    loginPanel.style.display = "none";
    registerPanel.style.display = "none";
    forgotPanel.style.display = "none";

    // Nyalakan panel target secara spesifik
    if (panelTujuan === "register") {
        registerPanel.style.display = "block";
    } else if (panelTujuan === "forgot") {
        forgotPanel.style.display = "block";
        document.getElementById("otp-step-1").style.display = "block";
        document.getElementById("otp-step-2").style.display = "none";
        document.getElementById("forgot-email").value = "";
    } else {
        loginPanel.style.display = "block";
    }
}

// 2. REGISTRASI (BUAT AKUN BARU)
function buatAkun() {
    const usernameBaru = document.getElementById("regis-username").value.trim();
    const passwordBaru = document.getElementById("regis-pw").value.trim();
    const pesanTarget = document.getElementById("login-error");

    try {
        if (usernameBaru === "" || passwordBaru === "") {
            throw "Username dan Password baru tidak boleh kosong!";
        }

        if (localStorage.getItem(usernameBaru) !== null) {
            throw "Username sudah digunakan! Pilih nama lain.";
        }

        localStorage.setItem(usernameBaru, passwordBaru);

        pesanTarget.style.color = "green";
        pesanTarget.innerText = "Akun berhasil dibuat! Silakan kembali ke menu login.";
        
        document.getElementById("regis-username").value = "";
        document.getElementById("regis-pw").value = "";
    } catch (error) {
        pesanTarget.style.color = "red";
        pesanTarget.innerText = error;
    }
}

// 3. VERIFIKASI LOGIN
function verifikasiLogin() {
    const usernameInput = document.getElementById("login-username").value.trim();
    const passwordInput = document.getElementById("login-pw").value.trim();
    const pesanTarget = document.getElementById("login-error");

    try {
        if (usernameInput === "" || passwordInput === "") {
            throw "Harap isi Username dan Password Anda terlebih dahulu!";
        }

        const passwordAsli = localStorage.getItem(usernameInput);

        if (passwordAsli === null) {
            throw "Username tidak terdaftar di sistem!";
        }
        if (passwordInput !== passwordAsli) {
            throw "Password anda salah! Akses ditolak.";
        }

        alert("Selamat Datang " + usernameInput + "! Login Akun Kamu Berhasil.");
        
        // Pengalihan Layout Utama
        document.getElementById("login-gate").style.display = "none";
        document.getElementById("main-dashboard").style.display = "flex";
        document.getElementById("user-display").innerText = "User: " + usernameInput;
        pesanTarget.innerText = "";
        
        // Reset form login
        document.getElementById("login-username").value = "";
        document.getElementById("login-pw").value = "";
        
        // Tampilkan data ke tabel jika sudah ada di array data memori
        tampilkanDataKeTabel();
    } catch (error) {
        pesanTarget.style.color = "red";
        pesanTarget.innerText = error;
    }
}

// ==================== INTEGRASI NYATA KIRIM OTP VIA EMAILJS ====================

let usernameTerdeteksiLupaPw = "";
function kirimSimulasiOTP() {
    const usernameInput = document.getElementById("forgot-username").value.trim();
    const emailTujuan = document.getElementById("forgot-email").value.trim();
    const pesanTarget = document.getElementById("login-error");

    try {
        if (usernameInput === "") {
            throw "Silakan ketik Username akun Anda terlebih dahulu!";
        }
        if (emailTujuan === "") {
            throw "Silakan ketik alamat email Anda terlebih dahulu!";
        }
        if (!emailTujuan.includes("@")) {
            throw "Format penulisan email tidak valid!";
        }

        // Validasi: Cek apakah username tersebut benar-benar ada di localStorage laptopmu
        if (localStorage.getItem(usernameInput) === null) {
            throw `Gagal! Username "${usernameInput}" tidak ditemukan dalam sistem lokal. Silakan periksa kembali.`;
        }

        // Kunci username yang valid ke memori global untuk proses reset nanti
        usernameTerdeteksiLupaPw = usernameInput;

        // 1. Generate 4 digit angka OTP acak secara realtime
        kodeOtpSimulasi = Math.floor(1000 + Math.random() * 9000).toString();
        emailOtpSimulasi = emailTujuan;

        // 2. Pasangkan ke dalam parameter variabel EmailJS
        const params = {
            to_name: usernameInput, // Langsung menyapa username asli!
            to_email: emailTujuan,
            message: kodeOtpSimulasi
        };

        pesanTarget.style.color = "orange";
        pesanTarget.innerText = "Sedang menghubungi server Gateway... Menembakkan email asli...";

        // 3. Eksekusi pengiriman data lewat API EmailJS
        emailjs.send("service_tpuc8nd", "template_d03is1k", params)
            .then(function() {
                alert(`🚀 BERHASIL!\n\nEmail resmi telah dikirim ke alamat: ${emailTujuan}.\nSilakan cek folder Kotak Masuk atau Spam Anda untuk mengambil kode gembok OTP.`);
                
                document.getElementById("otp-step-1").style.display = "none";
                document.getElementById("otp-step-2").style.display = "block";
                pesanTarget.innerText = "";
                
                document.getElementById("otp-input").value = "";
                document.getElementById("forgot-pw-baru").value = "";
            }, function(error) {
                pesanTarget.style.color = "red";
                pesanTarget.innerText = "Koneksi Gateway Gagal: " + JSON.stringify(error);
            });

    } catch (error) {
        pesanTarget.style.color = "red";
        pesanTarget.innerText = error;
    }
}

function verifikasiOTPdanReset() {
    const otpInput = document.getElementById("otp-input").value.trim();
    const pwBaru = document.getElementById("forgot-pw-baru").value.trim();
    const pesanTarget = document.getElementById("login-error");

    try {
        if (otpInput === "" || pwBaru === "") {
            throw "Kode OTP dan Password Baru wajib diisi!";
        }
        if (otpInput !== kodeOtpSimulasi) {
            throw "Kode OTP yang Anda masukkan salah atau kadaluarsa!";
        }

        // Eksekusi pembaruan password mutlak ke username yang sudah dikunci tadi
        localStorage.setItem(usernameTerdeteksiLupaPw, pwBaru);

        alert(`Sukses! Password untuk akun "${usernameTerdeteksiLupaPw}" berhasil diperbarui.`);
        
        // Reset form input username di panel step 1 agar bersih kembali
        document.getElementById("forgot-username").value = "";
        
        pindahPanel('login');
    } catch (error) {
        pesanTarget.style.color = "red";
        pesanTarget.innerText = error;
    }
}


// ==================== FITUR INPUT, VALIDASI, & CRUD EDIT MAHASISWA ====================

function tambahMahasiswa() {
    const nimInput = document.getElementById("mhs-nim").value.trim();
    const namaInput = document.getElementById("mhs-nama").value.trim();
    const ipkInput = document.getElementById("mhs-ipk").value.trim();
    const errorDashboard = document.getElementById("dashboard-error");
    const editIndex = parseInt(document.getElementById("edit-index").value);

    try {
        if (nimInput === "" || namaInput === "" || ipkInput === "") {
            throw "Semua kolom input data mahasiswa harus diisi!";
        }

        const regexNIM = /^\d{12}$/;
        if (!regexNIM.test(nimInput)) {
            throw "Format NIM salah! Harus berupa angka sebanyak 12 digit.";
        }

        const regexIPK = /^[0-3](\.\d{1,2})?$|^4(\.0{1,2})?$/;
        if (!regexIPK.test(ipkInput)) {
            throw "Format IPK salah! Angka harus berada di antara 0.00 hingga 4.00 (Gunakan titik sebagai desimal).";
        }

        if (editIndex === -1) {
            // Validasi Proteksi NIM Ganda (Pemberitahuan Data Sudah Terdaftar)
            for (let i = 0; i < daftarMahasiswa.length; i++) {
                if (daftarMahasiswa[i].getNim() === nimInput) {
                    throw `Gagal! Mahasiswa dengan NIM [${nimInput}] sudah terdaftar di sistem.`;
                }
            }

            const mahasiswaBaru = new Mahasiswa(nimInput, namaInput, parseFloat(ipkInput));
            daftarMahasiswa.push(mahasiswaBaru);
            
            errorDashboard.style.color = "green";
            errorDashboard.innerText = "Data mahasiswa atas nama " + namaInput + " berhasil disimpan!";
        } 
        else {
            daftarMahasiswa[editIndex].setNama(namaInput);
            daftarMahasiswa[editIndex].setIpk(parseFloat(ipkInput));

            errorDashboard.style.color = "green";
            errorDashboard.innerText = "Data mahasiswa berhasil diperbarui secara realtime!";
            
            batalProsesEdit();
        }

        tampilkanDataKeTabel();

        document.getElementById("mhs-nim").value = "";
        document.getElementById("mhs-nama").value = "";
        document.getElementById("mhs-ipk").value = "";

    } catch (error) {
        errorDashboard.style.color = "red";
        errorDashboard.innerText = error;
    }
}

function tampilkanDataKeTabel() {
    const tabelBody = document.getElementById("mahasiswa-list");
    tabelBody.innerHTML = ""; 

    for (let i = 0; i < daftarMahasiswa.length; i++) {
        const mhs = daftarMahasiswa[i];
        const baris = document.createElement("tr");

        baris.innerHTML = `
            <td>${mhs.getNim()}</td>
            <td>${mhs.getNama()}</td>
            <td>${mhs.getIpk().toFixed(2)}</td>
            <td style="text-align: center;">
                <button onclick="pemicuEditMahasiswa(${i})" style="background-color: #ecc94b; color: #2d3748; padding: 5px 12px; font-size: 0.8rem; margin-right: 5px; font-weight: bold; border-radius:4px; border:none; cursor:pointer;">Edit</button>
                <button onclick="hapusMahasiswa(${i})" style="background-color: #e53e3e; color: white; padding: 5px 12px; font-size: 0.8rem; font-weight: bold; border-radius:4px; border:none; cursor:pointer;">Hapus</button>
            </td>
        `;
        tabelBody.appendChild(baris);
    }
}

function pemicuEditMahasiswa(index) {
    const targetMhs = daftarMahasiswa[index];

    document.getElementById("mhs-nim").value = targetMhs.getNim();
    document.getElementById("mhs-nim").disabled = true; 
    document.getElementById("mhs-nama").value = targetMhs.getNama();
    document.getElementById("mhs-ipk").value = targetMhs.getIpk();

    document.getElementById("edit-index").value = index;

    document.getElementById("form-title").innerText = "Perbarui Data Akademik Mahasiswa";
    document.getElementById("form-desc").innerText = "Modifikasi data di bawah ini, lalu klik Perbarui Data.";
    document.getElementById("btn-simpan-mhs").innerText = "Perbarui Data Mahasiswa";
    document.getElementById("btn-simpan-mhs").style.backgroundColor = "#ecc94b";
    document.getElementById("btn-simpan-mhs").style.color = "#2d3748";
    document.getElementById("btn-batal-edit").style.display = "inline-block";

    bukaHalaman('page-tambah');
}

function batalProsesEdit() {
    document.getElementById("edit-index").value = "-1";
    document.getElementById("mhs-nim").value = "";
    document.getElementById("mhs-nim").disabled = false;
    document.getElementById("mhs-nama").value = "";
    document.getElementById("mhs-ipk").value = "";

    document.getElementById("form-title").innerText = "Tambah Data Mahasiswa Baru";
    document.getElementById("form-desc").innerText = "Masukkan informasi akademik mahasiswa secara valid ke dalam sistem.";
    document.getElementById("btn-simpan-mhs").innerText = "Simpan Data Mahasiswa";
    document.getElementById("btn-simpan-mhs").style.backgroundColor = "#3182ce";
    document.getElementById("btn-simpan-mhs").style.color = "white";
    document.getElementById("btn-batal-edit").style.display = "none";
    document.getElementById("dashboard-error").innerText = "";
}

function hapusMahasiswa(index) {
    if (confirm("Apakah Anda yakin ingin menghapus data mahasiswa ini?")) {
        daftarMahasiswa.splice(index, 1);
        tampilkanDataKeTabel();
        document.getElementById("dashboard-error").style.color = "orange";
        document.getElementById("dashboard-error").innerText = "Data mahasiswa telah dihapus dari sistem.";
        
        if(document.getElementById("edit-index").value == index) {
            batalProsesEdit();
        }
    }
}

// ==================== ALGORITMA SORTING & SEARCHING (CHRONO TIME) ====================

function urutkanMahasiswa(metode) {
    const errorDashboard = document.getElementById("dashboard-error");
    const infoBox = document.getElementById("algo-info-box");
    const timeMsg = document.getElementById("algo-time-msg");

    try {
        if (daftarMahasiswa.length < 2) {
            throw "Minimal harus ada 2 data mahasiswa di tabel untuk diurutkan!";
        }

        const waktuAwal = performance.now(); 

        if (metode === 'bubble') {
            let n = daftarMahasiswa.length;
            for (let i = 0; i < n - 1; i++) {
                for (let j = 0; j < n - i - 1; j++) {
                    if (daftarMahasiswa[j].getIpk() > daftarMahasiswa[j + 1].getIpk()) {
                        let temp = daftarMahasiswa[j];
                        daftarMahasiswa[j] = daftarMahasiswa[j + 1];
                        daftarMahasiswa[j + 1] = temp;
                    }
                }
            }
            timeMsg.innerText = `[Bubble Sort Selesai] `;
        } 
        else if (metode === 'selection') {
            let n = daftarMahasiswa.length;
            for (let i = 0; i < n - 1; i++) {
                let indexMin = i;
                for (let j = i + 1; j < n; j++) {
                    if (daftarMahasiswa[j].getIpk() > daftarMahasiswa[indexMin].getIpk()) {
                        indexMin = j;
                    }
                }
                let temp = daftarMahasiswa[indexMin];
                daftarMahasiswa[indexMin] = daftarMahasiswa[i];
                daftarMahasiswa[i] = temp;
            }
            timeMsg.innerText = `[Selection Sort (Descending) Selesai] `;
        }

        const waktuAkhir = performance.now(); 
        const durasi = waktuAkhir - waktuAwal;

        tampilkanDataKeTabel();
        infoBox.style.display = "block";
        
        if (metode === 'bubble') {
            timeMsg.innerText += `Pengurutan IPK dari terkecil ke terbesar berhasil. Estimasi Waktu Eksekusi: ${durasi.toFixed(4)} milidetik.`;
        } else {
            timeMsg.innerText += `Pengurutan IPK dari terbesar ke terkecil berhasil. Estimasi Waktu Eksekusi: ${durasi.toFixed(4)} milidetik.`;
        }
        errorDashboard.innerText = "";
    } catch (error) {
        errorDashboard.style.color = "red";
        errorDashboard.innerText = error;
    }
}

function cariMahasiswa(metode) {
    const kategori = document.getElementById("search-category").value;
    const query = document.getElementById("search-query").value.trim().toLowerCase();
    const errorDashboard = document.getElementById("dashboard-error");
    const infoBox = document.getElementById("algo-info-box");
    const timeMsg = document.getElementById("algo-time-msg");

    try {
        if (query === "") throw "Masukkan kata kunci pencarian!";
        if (daftarMahasiswa.length === 0) throw "Tabel kosong! Silakan tambah data dahulu.";

        let indeksDitemukan = -1;
        const waktuAwal = performance.now();

        if (metode === 'linear') {
            for (let i = 0; i < daftarMahasiswa.length; i++) {
                if (kategori === 'nim') {
                    if (daftarMahasiswa[i].getNim() === query) {
                        indeksDitemukan = i;
                        break;
                    }
                } else if (kategori === 'nama') {
                    let namaMhs = daftarMahasiswa[i].getNama().toLowerCase();
                    if (namaMhs.includes(query)) {
                        indeksDitemukan = i;
                        break;
                    }
                }
            }
            timeMsg.innerText = `[Linear Search Selesai] `;
        } 
        else if (metode === 'binary') {
            if (kategori === 'nama') {
                throw "Algoritma Binary Search dikhususkan untuk pencarian NIM yang terurut!";
            }

            daftarMahasiswa.sort((a, b) => a.getNim().localeCompare(b.getNim()));
            tampilkanDataKeTabel();

            let kiri = 0;
            let kanan = daftarMahasiswa.length - 1;

            while (kiri <= kanan) {
                let tengah = Math.floor((kiri + kanan) / 2);
                let nimTengah = daftarMahasiswa[tengah].getNim();

                if (nimTengah === query) {
                    indeksDitemukan = tengah;
                    break;
                } else if (nimTengah < query) {
                    kiri = tengah + 1;
                } else {
                    kanan = tengah - 1;
                }
            }
            timeMsg.innerText = `[Binary Search Selesai] *Catatan: Data otomatis diurutkan berdasarkan NIM. `;
        }

        const waktuAkhir = performance.now();
        const durasi = waktuAkhir - waktuAwal;

        infoBox.style.display = "block";
        if (indeksDitemukan !== -1) {
            const mhsKetemu = daftarMahasiswa[indeksDitemukan];
            timeMsg.innerHTML += `<br><strong>Data Ditemukan!</strong> Berada pada susunan baris ke-${indeksDitemukan + 1}<br>` +
                                 `Detail -> NIM: ${mhsKetemu.getNim()} | Nama: ${mhsKetemu.getNama()} | IPK: ${mhsKetemu.getIpk().toFixed(2)}.<br>` +
                                 `Estimasi Waktu Eksekusi: ${durasi.toFixed(4)} milidetik.`;
            errorDashboard.innerText = "";
        } else {
            timeMsg.innerHTML += `<br>Data tidak ditemukan dalam sistem database.<br>Estimasi Waktu Pencarian: ${durasi.toFixed(4)} milidetik.`;
        }
    } catch (error) {
        errorDashboard.style.color = "red";
        errorDashboard.innerText = error;
    }
}

// ==================== FITUR BACKUP LOCAL FILE I/O (EXPORT & IMPORT JSON) ====================

function ekkosDataJSON() {
    // Fungsi pembantu alias pendukung
    eksporDataJSON();
}

function eksporDataJSON() {
    try {
        if (daftarMahasiswa.length === 0) {
            throw "Tidak ada data mahasiswa di dalam tabel untuk di-ekspor!";
        }

        const dataMentah = daftarMahasiswa.map(mhs => {
            return {
                nim: mhs.getNim(),
                nama: mhs.getNama(),
                ipk: mhs.getIpk()
            };
        });

        const jsonString = JSON.stringify(dataMentah, null, 4);
        const blob = new Blob([jsonString], { type: "application/json" });
        const urlLink = URL.createObjectURL(blob);
        
        const unduhAnchor = document.createElement("a");
        unduhAnchor.href = urlLink;
        unduhAnchor.download = "database-mahasiswa.json";
        
        document.body.appendChild(unduhAnchor);
        unduhAnchor.click(); 
        
        document.body.removeChild(unduhAnchor);
        URL.revokeObjectURL(urlLink);

        alert("Sukses mengekspor berkas! File 'database-mahasiswa.json' berhasil diunduh ke komputer Anda.");
    } catch (error) {
        alert(error);
    }
}

function triggerKlikInputFile() {
    document.getElementById("import-file-json").click();
}

function imporDataJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const pembacaBerkas = new FileReader();
    pembacaBerkas.onload = function(e) {
        try {
            const isiTeks = e.target.result;
            const dataHasilParsing = JSON.parse(isiTeks);

            if (!Array.isArray(dataHasilParsing)) {
                throw "Format berkas salah! Isi file JSON harus berupa Array data.";
            }

            dataHasilParsing.forEach((item, index) => {
                if (!item.nim || !item.nama || item.ipk === undefined) {
                    throw `Baris data ke-${index+1} tidak lengkap (Wajib punya properti nim, nama, dan ipk).`;
                }
                const mhsPulih = new Mahasiswa(item.nim, item.nama, parseFloat(item.ipk));
                daftarMahasiswa.push(mhsPulih);
            });

            tampilkanDataKeTabel();
            alert(`Berhasil! ${dataHasilParsing.length} Data Mahasiswa sukses dipulihkan dari berkas JSON.`);
            document.getElementById("import-file-json").value = "";
        } catch (error) {
            alert("Gagal Impor Berkas! Alasan: " + error);
            document.getElementById("import-file-json").value = "";
        }
    };
    pembacaBerkas.readAsText(file);
}

// ==================== PORTAL UPLOAD TUGAS (SINKRONISASI DAFTAR TABEL) ====================

function simulasiUploadTugas() {
    const judulTugas = document.getElementById("tugas-judul").value.trim();
    const pilihanMhs = document.getElementById("tugas-mhs-select").value;
    const komponenFile = document.getElementById("tugas-file-input");
    const pesanSukses = document.getElementById("tugas-success-msg");
    const tabelTugasBody = document.getElementById("daftar-tugas-terkumpul");

    try {
        if (judulTugas === "") throw "Judul tugas kuliah tidak boleh kosong!";
        if (pilihanMhs === "") throw "Silakan pilih mahasiswa pemilik tugas terlebih dahulu!";
        if (komponenFile.files.length === 0) throw "Silakan pilih berkas dokumen tugas Anda terlebih dahulu!";

        const dataFile = komponenFile.files[0];
        const namaFile = dataFile.name;
        const ukuranFileKB = (dataFile.size / 1024).toFixed(2);
        const urlFileSementara = URL.createObjectURL(dataFile);

        // Masukkan data tugas baru ke dalam array kumpulanTugas
        kumpulanTugas.push({
            pemilik: pilihanMhs,
            tugas: judulTugas,
            linkFile: urlFileSementara,
            namaFile: namaFile,
            ukuran: ukuranFileKB
        });

        // Cetak notifikasi hijau di atas form
        pesanSukses.innerHTML = `<span style="color: green; font-weight: bold;">🎉 Sukses! Tugas atas nama ${pilihanMhs} berhasil ditambahkan ke daftar bawah.</span>`;

        // Render ulang daftar tabel tugas di bawah secara dinamis
        tabelTugasBody.innerHTML = "";
        for (let i = 0; i < kumpulanTugas.length; i++) {
            const item = kumpulanTugas[i];
            const baris = document.createElement("tr");
            baris.style.borderBottom = "1px solid #e2e8f0";

            baris.innerHTML = `
                <td style="padding: 12px; font-weight: bold; color: #4a5568;">${item.pemilik}</td>
                <td style="padding: 12px; color: #4a5568;">${item.tugas}</td>
                <td style="padding: 12px;">
                    <a href="${item.linkFile}" target="_blank" style="color: #3182ce; font-weight: bold; text-decoration: underline;">📑 ${item.namaFile}</a>
                </td>
                <td style="padding: 12px; color: #718096;">${item.ukuran} KB</td>
            `;
            tabelTugasBody.appendChild(baris);
        }

        // Bersihkan kolom form tugas setelah berhasil upload
        document.getElementById("tugas-judul").value = "";
        document.getElementById("tugas-mhs-select").value = "";
        komponenFile.value = "";

    } catch (error) {
        pesanSukses.innerHTML = `<span style="color: red;">Gagal Unggah Tugas: ${error}</span>`;
    }
}

function perbaruiDropdownTugas() {
    const selectMhs = document.getElementById("tugas-mhs-select");
    if (!selectMhs) return;

    // Reset isi dropdown, sisakan opsi default
    selectMhs.innerHTML = '<option value="">-- Pilih Mahasiswa --</option>';

    // Loop data dari database mahasiswa untuk dimasukkan sebagai pilihan
    for (let i = 0; i < daftarMahasiswa.length; i++) {
        const mhs = daftarMahasiswa[i];
        const opsi = document.createElement("option");
        opsi.value = `${mhs.getNim()} - ${mhs.getNama()}`;
        opsi.innerText = `${mhs.getNim()} - ${mhs.getNama()}`;
        selectMhs.appendChild(opsi);
    }
}

// ==================== UTILITY OPERASI NAVIGASI TAB HALAMAN ====================

function bukaHalaman(idHalamanTujuan) {
    const seluruhHalaman = document.querySelectorAll(".sub-page");
    seluruhHalaman.forEach(halaman => {
        halaman.style.display = "none";
    });

    document.getElementById(idHalamanTujuan).style.display = "block";

    const seluruhTombolNav = document.querySelectorAll(".nav-btn");
    seluruhTombolNav.forEach(tombol => {
        tombol.classList.remove("active");
    });

    if (idHalamanTujuan === 'page-tambah') {
        document.getElementById("nav-tambah").classList.add("active");
    } else if (idHalamanTujuan === 'page-database') {
        document.getElementById("nav-database").classList.add("active");
    } else if (idHalamanTujuan === 'page-tugas') {
        document.getElementById("nav-tugas").classList.add("active");
        perbaruiDropdownTugas();
    }
}

function logoutSistem() {
    if(confirm("Apakah Anda yakin ingin keluar dari aplikasi manajemen?")) {
        alert("Anda telah keluar dari sistem.");
        document.getElementById("main-dashboard").style.display = "none";
        document.getElementById("login-gate").style.display = "block";
        batalProsesEdit(); 
    }
}