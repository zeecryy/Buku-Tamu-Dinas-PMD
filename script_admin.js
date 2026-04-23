const ADMIN_PASSWORD = "admin123";
const scriptURL =
  "https://script.google.com/macros/s/AKfycbzgNa9NoMsQU8vZMLt5N7drq05d5tyRt2E_SHLIxg9uKI7qmfvJQtsAmkxQO0czIw0ugA/exec";

function handleLogin() {
  const input = document.getElementById("passInput").value;
  const error = document.getElementById("error-msg");

  if (input === ADMIN_PASSWORD) {
    document.getElementById("auth-overlay").style.display = "none";
    document.getElementById("main-content").style.display = "block";
    loadData();
    setInterval(loadData, 15000);
  } else {
    error.style.display = "block";
    document.getElementById("passInput").value = "";
    document.getElementById("passInput").focus();
  }
}

document.getElementById("passInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleLogin();
});

async function loadData() {
  const tableBody = document.getElementById("tableBody");
  try {
    const response = await fetch(scriptURL);
    const data = await response.json();
    const sortedData = [...data].reverse();
    tableBody.innerHTML = "";

    sortedData.forEach((row) => {
      const tr = document.createElement("tr");
      const timeStr = row.Timestamp
        ? new Date(row.Timestamp).toLocaleString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "-";

      let phone = row.NoHP ? row.NoHP.toString().replace(/[^0-9]/g, "") : "";
      if (phone.startsWith("0")) {
        phone = "62" + phone.substring(1);
      }

      tr.innerHTML = `
              <td data-label="Waktu">
                <div style="display:flex; align-items:center; gap:8px;">
                  <i data-lucide="calendar" size="18"></i>
                  <span>${timeStr}</span>
                </div>
              </td>
              <td data-label="Nama"><span class="name-tag">${(row.Nama || "-").toLowerCase()}</span></td>
              <td data-label="Jabatan"><span class="text-cap">${(row.Jabatan || "-").toLowerCase()}</span></td>
              <td data-label="Alamat"><span class="text-cap">${(row.Alamat || "-").toLowerCase()}</span></td>
              <td data-label="Tujuan"><div style="color:var(--text-dark)">${row.Tujuan || "-"}</div></td>
              <td data-label="No HP">
                <a target="_blank" href="whatsapp://send?phone=${phone}" class="wa-link">
                  <i data-lucide="phone" size="14"></i> ${row.NoHP || "-"}
                </a>
              </td>
              <td data-label="TTD">
                ${row.TTD ? `<img src="${row.TTD}" class="ttd-img" alt="TTD">` : '<span style="color:#cbd5e1">Tidak ada</span>'}
              </td>
            `;
      tableBody.appendChild(tr);
    });

    document.getElementById("t-total").innerText = data.length;
    lucide.createIcons();
  } catch (e) {
    console.error(e);
  }
}

lucide.createIcons();
