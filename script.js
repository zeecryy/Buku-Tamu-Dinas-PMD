const scriptURL =
  "https://script.google.com/macros/s/AKfycbzgNa9NoMsQU8vZMLt5N7drq05d5tyRt2E_SHLIxg9uKI7qmfvJQtsAmkxQO0czIw0ugA/exec";

const form = document.getElementById("guestForm");
const canvas = document.getElementById("signature-pad");
const signaturePad = new SignaturePad(canvas);

function resizeCanvas() {
  const ratio = Math.max(window.devicePixelRatio || 1, 1);
  canvas.width = canvas.offsetWidth * ratio;
  canvas.height = canvas.offsetHeight * ratio;
  canvas.getContext("2d").scale(ratio, ratio);
  signaturePad.clear();
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

document
  .getElementById("clearBtn")
  .addEventListener("click", () => signaturePad.clear());

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const btn = document.getElementById("submitBtn");
  const status = document.getElementById("status");

  btn.disabled = true;
  btn.innerText = "Sedang Mengirim...";

  const formData = new FormData();

  formData.append("Nama", document.getElementById("namaInput").value);
  formData.append("Alamat", document.getElementById("alamatInput").value);
  formData.append("Jabatan", document.getElementById("jabatanInput").value);
  formData.append("NoHP", document.getElementById("hpInput").value);
  formData.append("Tujuan", document.getElementById("tujuanInput").value);

  const ttdData = signaturePad.isEmpty() ? "" : signaturePad.toDataURL();
  formData.append("TTD", ttdData);

  fetch(scriptURL, { method: "POST", body: formData })
    .then((response) => {
      btn.disabled = false;
      btn.innerText = "Kirim Data Kunjungan";
      status.style.display = "block";
      status.className = "success";
      status.innerHTML = "✅ Data berhasil dikirim! Terima kasih.";
      form.reset();
      signaturePad.clear();
      setTimeout(() => {
        status.style.display = "none";
      }, 5000);
    })
    .catch((error) => {
      btn.disabled = false;
      btn.innerText = "Kirim Data Kunjungan";
      alert("Gagal mengirim data. Coba lagi.");
    });
});
