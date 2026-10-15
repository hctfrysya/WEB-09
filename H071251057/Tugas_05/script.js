const API ="https://jsonplaceholder.typicode.com";

const membersEl = document.getElementById("members");
const membersLoading = document.getElementById("members-loading");
const membersError = document.getElementById("members-error");
const tasksTitle = document.getElementById("tasks-title");
const tasksPlaceholder = document.getElementById("tasks-placeholder");
const tasksLoading = document.getElementById("tasks-loading");
const tasksError = document.getElementById("tasks-error");
const tasksPanel = document.getElementById("tasks-panel");
const summaryEl = document.getElementById("summary");
const searchEl = document.getElementById("search");
const taskList = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");
const taskForm = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const saveBtn = document.getElementById("save-btn");
const formError = document.getElementById("form-error");
const notification = document.getElementById("notification");

//spy gmpg dambil brlung x
const DONE_CLASSES = ["line-through", "text-gray-400"]; //tmpln teks tgs yg sdh sles
const ACTIVE_CLASSES = ["bg-teal-700", "text-white", "border-teal-700"]; //tmpln tmbol anggt yg sgd dplh
const IDLE_CLASSES = ["bg-white", "text-slate-700", "hover:bg-slate-50"]; //----yg sdg tdk dplh

//brbh slm web brjln
let activeButton = null;
let requestCounter = 0;
let notifTimer = null;

async function muatAnggota() {
    membersLoading.classList.remove("hidden");
    membersError.classList.add("hidden");
    try {
        const res = await fetch(`${API}/users`);//mint dt
        if (!res.ok) throw new error(`Server mengembalikan status ${res.status}`); //mmriksa
        const users = await res.json(); //mngbh res jd dt js
        users.forEach((user)=>{
            const btn = document.createElement("button");
            btn.type = "button";
            btn.textContent = user.name;
            btn.className = "text-left border border-slate-300 rounded px-3 py-2 font-medium " + IDLE_CLASSES.join(" ");
            btn.addEventListener("click", () => pilihAnggota(user, btn));
            membersEl.appendChild(btn);
        });
    } catch (err) {
        membersError.textContent = `Gagal memuat anggota: ${err.message}`;
        membersError.classList.remove("hidden");
    } finally {
        membersLoading.classList.add("hidden");
    }
}

//mmlh anggt n mmat tgs
async function pilihAnggota(user, btn) {
    if (activeButton) {
        activeButton.classList.remove(...ACTIVE_CLASSES);
        activeButton.classList.add(...IDLE_CLASSES);
    }
    btn.classList.remove(...IDLE_CLASSES);
    btn.classList.add(...ACTIVE_CLASSES);
    activeButton = btn;

    tasksTitle.textContent = `Tugas ${user.name}`;
    tasksPlaceholder.classList.add("hidden");
    tasksError.classList.add("hidden");
    tasksPanel.classList.add("hidden");
    tasksLoading.classList.remove("hidden");
    taskList.innerHTML = "";
    searchEl.value = "";
    formError.classList.add("hidden");

    const myRequest = ++requestCounter;
    try {
        const res = await fetch(`${API}/todos?userId=${user.id}`);
        if (!res.ok) throw new Error(`Server mengembalikan status ${res.status}`);
        const todos = await res.json();
        if (myRequest !== requestCounter) return; // sudah pindah ke anggota lain

        todos.forEach((todo) => taskList.appendChild(buatItemTugas(todo.title, todo.completed)));
        tasksPanel.classList.remove("hidden");
        segarkan();
    } catch (err) {
        if (myRequest !== requestCounter) return;
        tasksError.textContent = `Gagal memuat tugas: ${err.message}`;
        tasksError.classList.remove("hidden");
    } finally {
        if (myRequest === requestCounter) tasksLoading.classList.add("hidden");
    }
}

//membuat item tgs
function buatItemTugas(title, completed) {
    const li = document.createElement("li");
    li.className = "flex items-center gap-2 bg-white border border-slate-200 rounded px-3 py-2";
    li.dataset.title = title;
    li.dataset.done = completed ? "true" : "false";

    //mmbuat elemen span utk mnmpilkn  judul tgs
    const span = document.createElement("span");
    span.className = "flex-1";
    span.textContent = title;
    if (completed) span.classList.add(...DONE_CLASSES);
    li.appendChild(span);

    //kl blm, mk mmbt tmbl tndai sles
    if (!completed) {
    const doneBtn = document.createElement("button");
        doneBtn.type = "button";
        doneBtn.textContent = "Tandai selesai";
        doneBtn.className =
        "text-sm border border-teal-700 text-teal-800 hover:bg-teal-50 rounded px-2 py-1";
        doneBtn.addEventListener("click", () => {
        li.dataset.done = "true";
        span.classList.add(...DONE_CLASSES);
        doneBtn.remove();
        segarkan();
    });
    li.appendChild(doneBtn);
  }

    // tombl hps tgs
    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.textContent = "Hapus";
    delBtn.className = "text-sm border border-red-300 text-red-700 hover:bg-red-50 rounded px-2 py-1";
    delBtn.addEventListener("click", () => {
        li.remove();
        segarkan();
    });
    li.appendChild(delBtn);

    return li;
}

//mmprbrui jmlh ringksn jmlh tgs yg sles
function perbaruiRingkasan() {
    const items = taskList.querySelectorAll("li");
    let selesai = 0;
    items.forEach((li) => {
        if (li.dataset.done === "true") selesai++;
    });
    summaryEl.textContent = `${selesai} dari ${items.length} tugas selesai`;
}

//mncr tgs brdsrkn jdl yg dmskkn 
function terapkanFilter() {
    const kata = searchEl.value.trim().toLowerCase();
    const items = taskList.querySelectorAll("li");
    let tampil = 0;

    items.forEach((li) => {
        const cocok = li.dataset.title.toLowerCase().includes(kata);
        if (cocok) {
        li.classList.remove("hidden");
        tampil++;
        } else {
        li.classList.add("hidden");
        }
    });

    if (items.length === 0) {
        emptyMessage.textContent = "Belum ada tugas.";
        emptyMessage.classList.remove("hidden");
    } else if (tampil === 0) {
        emptyMessage.textContent = "Tidak ada tugas yang cocok";
        emptyMessage.classList.remove("hidden");
    } else {
        emptyMessage.classList.add("hidden");
    }
}

function segarkan() {
    perbaruiRingkasan();
    terapkanFilter();
}

//filter on tiap
searchEl.addEventListener("input", terapkanFilter);

function simpanTugas(judul) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
        const sudahAda = Array.from(taskList.querySelectorAll("li")).some(
            (li) => li.dataset.title.toLowerCase() === judul.toLowerCase()
        );
        if (sudahAda) {
            reject(new Error(`Tugas "${judul}" sudah ada di daftar.`));
        } else {
            resolve({ title: judul, completed: false });
        }
        }, 1000);
    });
}

function tampilkanNotifikasi(pesan) {
    notification.textContent = pesan;
    notification.classList.remove("hidden");
    clearTimeout(notifTimer);
    notifTimer = setTimeout(() => notification.classList.add("hidden"), 3000);
}

taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    formError.classList.add("hidden");

    const judul = titleInput.value.trim();
    if (judul.length < 5) {
        formError.textContent = "Judul tugas tidak boleh kosong dan minimal 5 karakter.";
        formError.classList.remove("hidden");
        return;
    }

    saveBtn.disabled = true;
    saveBtn.textContent = "Menyimpan...";
    try {
        const tugasBaru = await simpanTugas(judul);
        taskList.appendChild(buatItemTugas(tugasBaru.title, tugasBaru.completed));
        titleInput.value = "";
        segarkan();
        tampilkanNotifikasi("Tugas berhasil ditambahkan.");
    } catch (err) {
        formError.textContent = err.message;
        formError.classList.remove("hidden");
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = "Simpan";
    }
});

muatAnggota();