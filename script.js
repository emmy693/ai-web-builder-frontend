const requestForm = document.getElementById('requestForm');
const status = document.getElementById('status');

const adminForm = document.getElementById('adminForm');
const adminPanel = document.getElementById('adminPanel');
const pendingList = document.getElementById('pendingList');

const REPLIT_ URL=https://ai-web-builder-backend.onrender.com'; // <-- REPLACE with your backend URL

requestForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  status.innerText = 'Submitting...';

  const data = new FormData();
  data.append('name', document.getElementById('name').value.trim());
  data.append('phone', document.getElementById('phone').value.trim());
  data.append('webName', document.getElementById('webName').value.trim());
  data.append('webType', document.getElementById('webType').value.trim());
  data.append('opay', document.getElementById('opay').value.trim());
  data.append('screenshot', document.getElementById('screenshot').files[0]);

  try {
    const res = await fetch(`${REPLIT_URL}/submit`, { method:'POST', body:data });
    const result = await res.json();
    status.innerText = result.message || 'Submitted';
    requestForm.reset();
  } catch (err) {
    status.innerText = 'Submission failed. Check your backend URL.';
  }
});

adminForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const pass = document.getElementById('adminPassword').value;
  if (pass !== 'mine1234$$') {
    alert('Wrong password!');
    return;
  }

  adminPanel.style.display = 'block';
  pendingList.innerHTML = 'Loading...';

  try {
    const res = await fetch(`${REPLIT_URL}/pending`);
    const data = await res.json();
    pendingList.innerHTML = '';

    if (!data.length) {
      pendingList.innerText = 'No pending approvals.';
      return;
    }

    data.forEach(item => {
      const div = document.createElement('div');
      div.className = 'pendingItem';
      div.innerHTML = `
        <p><b>${item.webName}</b> (${item.webType})</p>
        <p>Phone: ${item.phone}</p>
        <p>OPay: ${item.opay}</p>
        <button onclick="approve(${item.id})">Approve</button>
      `;
      pendingList.appendChild(div);
    });
  } catch {
    pendingList.innerText = 'Unable to load pending list.';
  }
});

window.approve = async (id) => {
  try {
    await fetch(`${REPLIT_URL}/approve`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ id })
    });
    alert('Approved!');
    adminForm.dispatchEvent(new Event('submit'));
  } catch {
    alert('Approval failed.');
  }
};
