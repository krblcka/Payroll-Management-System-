const EMPLOYEES = [
    { id: 1, name: "Aisulu Bekova", email: "a.bekova@techkz.kz", dept: "Engineering", position: "Senior Developer", salary: 850000, hourly: 5312, hired: "2021-03-15", status: "active", iin: "950615300421", phone: "+7 701 234 5678" },
    { id: 2, name: "Daulet Seitkali", email: "d.seitkali@techkz.kz", dept: "Design", position: "UX Designer", salary: 620000, hourly: 3875, hired: "2022-07-01", status: "active", iin: "880923450123", phone: "+7 705 345 6789" },
    { id: 3, name: "Madina Nurlanovna", email: "m.nurlan@techkz.kz", dept: "HR", position: "HR Manager", salary: 580000, hourly: 3625, hired: "2020-11-10", status: "active", iin: "910401200234", phone: "+7 707 456 7890" },
    { id: 4, name: "Yerlan Abenov", email: "y.abenov@techkz.kz", dept: "Engineering", position: "DevOps Engineer", salary: 720000, hourly: 4500, hired: "2023-01-20", status: "active", iin: "970812350567", phone: "+7 702 567 8901" },
    { id: 5, name: "Aliya Sultanova", email: "a.sultanova@techkz.kz", dept: "Finance", position: "Accountant", salary: 500000, hourly: 3125, hired: "2022-04-05", status: "active", iin: "930628150678", phone: "+7 708 678 9012" },
];

const PAYROLL_HISTORY = [
    { month: "April 2025", period: "01–30 Apr", status: "paid", date: "2025-05-05" },
    { month: "March 2025", period: "01–31 Mar", status: "paid", date: "2025-04-05" },
    { month: "February 2025", period: "01–28 Feb", status: "paid", date: "2025-03-05" },
    { month: "January 2025", period: "01–31 Jan", status: "paid", date: "2025-02-05" },
    { month: "December 2024", period: "01–31 Dec", status: "paid", date: "2025-01-05" },
];

function calcTaxes(gross) {
    const opv = Math.min(gross * 0.10, 35000);         // OPV pension 10% max 35,000
    const osms = gross * 0.02;                          // OSMS medical 2%
    const taxableBase = Math.max(0, gross - opv - osms - 14 * 3692); // 14 MRP deduction
    const iit = Math.max(0, taxableBase * 0.10);        // IIT 10%
    const soSocIns = gross * 0.035;                     // Social insurance 3.5%
    const empOsms = gross * 0.03;                       // Employer OSMS 3%
    const net = gross - opv - osms - iit;
    return { gross, opv, osms, iit, soSocIns, empOsms, net };
}

const SCHEDULE = [
    { day: "Mon", date: 28, shift: "09:00–18:00", type: "work" },
    { day: "Tue", date: 29, shift: "09:00–18:00", type: "work" },
    { day: "Wed", date: 30, shift: "09:00–18:00", type: "work" },
    { day: "Thu", date: 1, shift: "Today", type: "today" },
    { day: "Fri", date: 2, shift: "09:00–18:00", type: "work" },
    { day: "Sat", date: 3, shift: "Day off", type: "off" },
    { day: "Sun", date: 4, shift: "Day off", type: "off" },
];

let currentRole = "employer";
let currentEmployee = EMPLOYEES[0];
let currentPage = "";

function setRole(r) {
    currentRole = r;
    document.querySelectorAll(".role-tab").forEach(t => t.classList.toggle("active", t.textContent.toLowerCase().includes(r)));
    if (r === "employee") {
        document.getElementById("login-email").value = "a.bekova@techkz.kz";
    } else {
        document.getElementById("login-email").value = "admin@techkz.kz";
    }
}

function login() {
    document.getElementById("auth-screen").style.display = "none";
    document.getElementById("app").style.display = "block";
    if (currentRole === "employer") {
        document.getElementById("sb-name").textContent = "TechKZ LLC";
        document.getElementById("sb-role").textContent = "Employer Account";
        buildEmployerNav();
        showPage("emp-dashboard");
    } else {
        currentEmployee = EMPLOYEES[0];
        document.getElementById("sb-name").textContent = currentEmployee.name;
        document.getElementById("sb-role").textContent = "Employee";
        buildEmployeeNav();
        showPage("my-dashboard");
    }
}

function logout() {
    document.getElementById("auth-screen").style.display = "flex";
    document.getElementById("app").style.display = "none";
}

function navItem(icon, label, pageId) {
    return `<div class="nav-item" id="nav-${pageId}" onclick="showPage('${pageId}')">
    <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor">${icon}</svg>
    ${label}
  </div>`;
}

const ICONS = {
    dash: '<path d="M2 11l8-8 8 8M4 9v8h5v-5h2v5h5V9"/>',
    people: '<path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>',
    pay: '<path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM16 8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4a2 2 0 012-2h8zm-1 4a1 1 0 11-2 0 1 1 0 012 0z"/>',
    cal: '<path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>',
    tax: '<path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"/>',
    hist: '<path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>',
    report: '<path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clip-rule="evenodd"/>',
};

function buildEmployerNav() {
    document.getElementById("sidebar-nav").innerHTML = `
    <div class="nav-section">Overview</div>
    ${navItem(ICONS.dash, "Dashboard", "emp-dashboard")}
    <div class="nav-section">Workforce</div>
    ${navItem(ICONS.people, "Employees", "employees")}
    ${navItem(ICONS.cal, "Schedule", "schedule")}
    <div class="nav-section">Payroll</div>
    ${navItem(ICONS.pay, "Run Payroll", "run-payroll")}
    ${navItem(ICONS.hist, "History", "payroll-history")}
    ${navItem(ICONS.report, "Tax Reports", "tax-reports")}
  `;
}

function buildEmployeeNav() {
    document.getElementById("sidebar-nav").innerHTML = `
    <div class="nav-section">My Account</div>
    ${navItem(ICONS.dash, "My Dashboard", "my-dashboard")}
    ${navItem(ICONS.pay, "My Payslip", "my-payslip")}
    ${navItem(ICONS.tax, "Tax Breakdown", "my-taxes")}
    ${navItem(ICONS.cal, "My Schedule", "my-schedule")}
    ${navItem(ICONS.hist, "Pay History", "my-history")}
  `;
}

function showPage(id) {
    currentPage = id;
    document.querySelectorAll(".nav-item").forEach(el => el.classList.toggle("active", el.id === "nav-" + id));
    const mc = document.getElementById("main-content");
    mc.innerHTML = "";
    const pages = {
        "emp-dashboard": pageEmpDashboard,
        "employees": pageEmployees,
        "schedule": pageSchedule,
        "run-payroll": pageRunPayroll,
        "payroll-history": pagePayrollHistory,
        "tax-reports": pageTaxReports,
        "my-dashboard": pageMyDashboard,
        "my-payslip": pageMyPayslip,
        "my-taxes": pageMyTaxes,
        "my-schedule": pageMySchedule,
        "my-history": pageMyHistory,
    };
    if (pages[id]) mc.innerHTML = pages[id]();
}

function fmt(n) { return Number(n).toLocaleString("ru-KZ") + " ₸"; }
function fmtN(n) { return Number(n).toLocaleString("ru-KZ"); }

function pageEmpDashboard() {
    const totalPayroll = EMPLOYEES.reduce((a, e) => a + e.salary, 0);
    const taxes = EMPLOYEES.map(e => calcTaxes(e.salary));
    const totalTax = taxes.reduce((a, t) => a + t.iit + t.opv + t.osms, 0);
    const totalNet = taxes.reduce((a, t) => a + t.net, 0);
    return `
  <div class="page-header">
    <div class="page-title">Company Dashboard</div>
    <div class="page-sub">TechKZ LLC · May 2025 · BIN: 180540021374</div>
  </div>
  <div class="alert alert-info">Payroll for May 2025 is due on June 5. Run payroll before the deadline to avoid penalties.</div>
  <div class="stats-grid">
    <div class="stat-card"><div class="card-title">Total Employees</div><div class="card-value">${EMPLOYEES.length}</div><div class="card-note">Active this month</div></div>
    <div class="stat-card"><div class="card-title">Gross Payroll</div><div class="card-value" style="font-size:20px">${fmt(totalPayroll)}</div><div class="card-note">Per month</div></div>
    <div class="stat-card"><div class="card-title">Net Payout</div><div class="card-value" style="font-size:20px;color:#27500A">${fmt(totalNet)}</div><div class="card-note">After deductions</div></div>
    <div class="stat-card"><div class="card-title">Tax Deducted</div><div class="card-value" style="font-size:20px;color:#A32D2D">${fmt(totalTax)}</div><div class="card-note">IIT + OPV + OSMS</div></div>
  </div>
  <div class="two-col">
    <div class="card">
      <div class="section-header"><div class="section-title">Employees by Department</div></div>
      <table><thead><tr><th>Department</th><th>Headcount</th><th>Avg. Salary</th></tr></thead><tbody>
      ${["Engineering", "Design", "HR", "Finance"].map(d => {
        const emps = EMPLOYEES.filter(e => e.dept === d);
        const avg = emps.length ? Math.round(emps.reduce((a, e) => a + e.salary, 0) / emps.length) : 0;
        return `<tr><td>${d}</td><td>${emps.length}</td><td>${fmt(avg)}</td></tr>`;
    }).join("")}
      </tbody></table>
    </div>
    <div class="card">
      <div class="section-title" style="margin-bottom:1rem">Payroll Breakdown</div>
      ${[
            { l: "Gross Payroll", v: totalPayroll, color: "#1B4FD8", pct: 100 },
            { l: "Net Payout", v: totalNet, color: "#27500A", pct: Math.round(totalNet / totalPayroll * 100) },
            { l: "IIT (10%)", v: taxes.reduce((a, t) => a + t.iit, 0), color: "#A32D2D", pct: Math.round(taxes.reduce((a, t) => a + t.iit, 0) / totalPayroll * 100) },
            { l: "OPV Pension (10%)", v: taxes.reduce((a, t) => a + t.opv, 0), color: "#633806", pct: Math.round(taxes.reduce((a, t) => a + t.opv, 0) / totalPayroll * 100) },
            { l: "OSMS Medical (2%)", v: taxes.reduce((a, t) => a + t.osms, 0), color: "#3B6D11", pct: Math.round(taxes.reduce((a, t) => a + t.osms, 0) / totalPayroll * 100) },
        ].map(r => `
        <div class="tax-bar-row">
          <div class="tax-bar-label">${r.l}</div>
          <div class="tax-bar-track"><div class="tax-bar-fill" style="width:${r.pct}%;background:${r.color}"></div></div>
          <div class="tax-bar-amount">${fmt(r.v)}</div>
        </div>`).join("")}
    </div>
  </div>`;
}

function pageEmployees() {
    return `
  <div class="page-header">
    <div class="page-title">Employees</div>
    <div class="page-sub">Manage your workforce</div>
  </div>
  <div class="card" style="margin-bottom:1.5rem">
    <div class="section-header"><div class="section-title">Add New Employee</div></div>
    <div class="form-grid">
      <div class="form-group"><label class="form-label">Full Name</label><input class="form-input" id="ne-name" placeholder="Аиша Жексенова"></div>
      <div class="form-group"><label class="form-label">Email</label><input class="form-input" id="ne-email" placeholder="a.jeks@company.kz"></div>
      <div class="form-group"><label class="form-label">IIN (ИИН)</label><input class="form-input" id="ne-iin" placeholder="000000000000" maxlength="12"></div>
      <div class="form-group"><label class="form-label">Department</label>
        <select class="form-input" id="ne-dept"><option>Engineering</option><option>Design</option><option>HR</option><option>Finance</option><option>Marketing</option><option>Operations</option></select>
      </div>
      <div class="form-group"><label class="form-label">Position</label><input class="form-input" id="ne-pos" placeholder="Software Engineer"></div>
      <div class="form-group"><label class="form-label">Monthly Salary (₸)</label><input class="form-input" id="ne-sal" type="number" placeholder="500000"></div>
      <div class="form-group"><label class="form-label">Phone</label><input class="form-input" id="ne-phone" placeholder="+7 701 000 0000"></div>
      <div class="form-group"><label class="form-label">Start Date</label><input class="form-input" id="ne-date" type="date" value="2025-05-01"></div>
    </div>
    <div class="actions-row">
      <button class="btn-outline" onclick="">Cancel</button>
      <button class="btn-action" onclick="addEmployee()">Add Employee</button>
    </div>
  </div>
  <div class="card">
    <div class="section-header"><div class="section-title">Current Employees</div><span class="badge badge-blue">${EMPLOYEES.length} active</span></div>
    <div class="table-wrap"><table>
      <thead><tr><th>Employee</th><th>Department</th><th>Position</th><th>Salary</th><th>Hourly</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>
      ${EMPLOYEES.map(e => `
        <tr>
          <td><div class="flex items-center gap-sm">
            <div class="avatar" style="background:#E6F1FB;color:#185FA5">${e.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
            <div><div style="font-size:13px;font-weight:500">${e.name}</div><div style="font-size:11px;color:var(--color-text-secondary)">${e.email}</div></div>
          </div></td>
          <td>${e.dept}</td>
          <td>${e.position}</td>
          <td style="font-weight:500">${fmt(e.salary)}</td>
          <td>${fmtN(e.hourly)} ₸/hr</td>
          <td><span class="badge badge-green">Active</span></td>
          <td><button class="btn-sm">Edit</button></td>
        </tr>`).join("")}
      </tbody>
    </table></div>
  </div>`;
}

function addEmployee() {
    const name = document.getElementById("ne-name").value.trim();
    const sal = parseInt(document.getElementById("ne-sal").value) || 0;
    if (!name || !sal) { alert("Please fill in at least name and salary."); return; }
    EMPLOYEES.push({
        id: EMPLOYEES.length + 1,
        name,
        email: document.getElementById("ne-email").value || name.toLowerCase().replace(" ", ".") + "@techkz.kz",
        dept: document.getElementById("ne-dept").value,
        position: document.getElementById("ne-pos").value || "Employee",
        salary: sal,
        hourly: Math.round(sal / 160),
        hired: document.getElementById("ne-date").value,
        status: "active",
        iin: document.getElementById("ne-iin").value,
        phone: document.getElementById("ne-phone").value,
    });
    showPage("employees");
}

function pageSchedule() {
    return `
  <div class="page-header"><div class="page-title">Work Schedule</div><div class="page-sub">May 2025 · Standard 5-day week, 8 hours/day</div></div>
  <div class="card">
    <div class="section-title" style="margin-bottom:1rem">This Week (Apr 28 – May 4, 2025)</div>
    <div class="week-grid">
      ${SCHEDULE.map(d => `
        <div class="day-card day-${d.type}">
          <div class="day-name">${d.day}</div>
          <div class="day-date">${d.date}</div>
          <div class="day-shift">${d.shift}</div>
        </div>`).join("")}
    </div>
  </div>
  <div class="card mt-2">
    <div class="section-title" style="margin-bottom:1rem">Monthly Summary · May 2025</div>
    <div class="stats-grid">
      <div class="stat-card"><div class="card-title">Working Days</div><div class="card-value">22</div></div>
      <div class="stat-card"><div class="card-title">Work Hours</div><div class="card-value">176</div></div>
      <div class="stat-card"><div class="card-title">Days Off</div><div class="card-value">9</div></div>
      <div class="stat-card"><div class="card-title">Public Holidays</div><div class="card-value">1</div><div class="card-note">May 1 – Labor Day</div></div>
    </div>
  </div>`;
}

function pageRunPayroll() {
    const taxes = EMPLOYEES.map(e => ({ ...e, ...calcTaxes(e.salary) }));
    const totalGross = taxes.reduce((a, t) => a + t.gross, 0);
    const totalNet = taxes.reduce((a, t) => a + t.net, 0);
    const totalIIT = taxes.reduce((a, t) => a + t.iit, 0);
    const totalOPV = taxes.reduce((a, t) => a + t.opv, 0);
    const totalOSMS = taxes.reduce((a, t) => a + t.osms, 0);
    return `
  <div class="page-header"><div class="page-title">Run Payroll</div><div class="page-sub">May 1–31, 2025 · Due by June 5, 2025</div></div>
  <div class="stats-grid">
    <div class="stat-card"><div class="card-title">Gross Total</div><div class="card-value" style="font-size:19px">${fmt(totalGross)}</div></div>
    <div class="stat-card"><div class="card-title">Net Payout</div><div class="card-value" style="font-size:19px;color:#27500A">${fmt(totalNet)}</div></div>
    <div class="stat-card"><div class="card-title">IIT Total</div><div class="card-value" style="font-size:19px;color:#A32D2D">${fmt(totalIIT)}</div></div>
    <div class="stat-card"><div class="card-title">OPV + OSMS</div><div class="card-value" style="font-size:19px;color:#633806">${fmt(totalOPV + totalOSMS)}</div></div>
  </div>
  <div class="card">
    <div class="section-title" style="margin-bottom:1rem">Payroll Register · May 2025</div>
    <div class="table-wrap"><table>
      <thead><tr><th>Employee</th><th>Gross</th><th>OPV (10%)</th><th>OSMS (2%)</th><th>IIT (10%)</th><th>Net Pay</th></tr></thead>
      <tbody>
      ${taxes.map(e => `
        <tr>
          <td><div style="font-weight:500;font-size:13px">${e.name}</div><div style="font-size:11px;color:var(--color-text-secondary)">${e.position}</div></td>
          <td>${fmt(e.gross)}</td>
          <td style="color:#633806">–${fmt(e.opv)}</td>
          <td style="color:#633806">–${fmt(e.osms)}</td>
          <td style="color:#A32D2D">–${fmt(e.iit)}</td>
          <td style="font-weight:600;color:#27500A">${fmt(e.net)}</td>
        </tr>`).join("")}
      </tbody>
      <tfoot><tr style="font-weight:600;border-top:0.5px solid var(--color-border-primary)">
        <td>TOTAL</td><td>${fmt(totalGross)}</td><td style="color:#633806">–${fmt(totalOPV)}</td><td style="color:#633806">–${fmt(totalOSMS)}</td><td style="color:#A32D2D">–${fmt(totalIIT)}</td><td style="color:#27500A">${fmt(totalNet)}</td>
      </tr></tfoot>
    </table></div>
    <div class="actions-row mt-2">
      <button class="btn-outline">Export CSV</button>
      <button class="btn-action">Approve &amp; Submit Payroll</button>
    </div>
  </div>`;
}

function pagePayrollHistory() {
    return `
  <div class="page-header"><div class="page-title">Payroll History</div><div class="page-sub">All past payroll runs</div></div>
  <div class="card">
    <div class="table-wrap"><table>
      <thead><tr><th>Period</th><th>Dates</th><th>Status</th><th>Gross</th><th>Net</th><th>Paid On</th><th></th></tr></thead>
      <tbody>
      ${PAYROLL_HISTORY.map(h => {
        const totalGross = EMPLOYEES.reduce((a, e) => a + e.salary, 0);
        const totalNet = EMPLOYEES.reduce((a, e) => a + calcTaxes(e.salary).net, 0);
        return `<tr>
          <td style="font-weight:500">${h.month}</td>
          <td class="text-muted text-sm">${h.period}</td>
          <td><span class="badge badge-green">Paid</span></td>
          <td>${fmt(totalGross)}</td>
          <td style="color:#27500A;font-weight:500">${fmt(totalNet)}</td>
          <td class="text-sm text-muted">${h.date}</td>
          <td><button class="btn-sm">View</button></td>
        </tr>`;
    }).join("")}
      </tbody>
    </table></div>
  </div>`;
}

function pageTaxReports() {
    const taxes = EMPLOYEES.map(e => calcTaxes(e.salary));
    const totIIT = taxes.reduce((a, t) => a + t.iit, 0);
    const totOPV = taxes.reduce((a, t) => a + t.opv, 0);
    const totOSMS = taxes.reduce((a, t) => a + t.osms, 0);
    const totSoc = taxes.reduce((a, t) => a + t.soSocIns, 0);
    const totEOSMS = taxes.reduce((a, t) => a + t.empOsms, 0);
    return `
  <div class="page-header"><div class="page-title">Tax Reports</div><div class="page-sub">Kazakhstan Tax Authority (КГД) Reporting · May 2025</div></div>
  <div class="two-col">
    <div class="card">
      <div class="section-title" style="margin-bottom:1rem">Employee Deductions (Form 200.00)</div>
      ${[
            { l: "Individual Income Tax (ИПН)", sub: "10% of taxable income", v: totIIT, c: "#A32D2D" },
            { l: "Pension Contributions (ОПВ)", sub: "10% of gross, max 35,000 ₸", v: totOPV, c: "#185FA5" },
            { l: "Medical Insurance (ОСМС)", sub: "2% of gross income", v: totOSMS, c: "#27500A" },
        ].map(r => `
        <div class="payslip-row">
          <div><div class="payslip-label">${r.l}</div><div style="font-size:11px;color:var(--color-text-tertiary)">${r.sub}</div></div>
          <div style="color:${r.c};font-weight:600">${fmt(r.v)}</div>
        </div>`).join("")}
      <hr class="divider">
      <div class="payslip-row"><div style="font-weight:500">Total Employee Deductions</div><div style="font-weight:600">${fmt(totIIT + totOPV + totOSMS)}</div></div>
    </div>
    <div class="card">
      <div class="section-title" style="margin-bottom:1rem">Employer Contributions</div>
      ${[
            { l: "Social Insurance (СО)", sub: "3.5% of gross income", v: totSoc, c: "#633806" },
            { l: "Employer OSMS (ОСМС)", sub: "3% of gross income", v: totEOSMS, c: "#27500A" },
        ].map(r => `
        <div class="payslip-row">
          <div><div class="payslip-label">${r.l}</div><div style="font-size:11px;color:var(--color-text-tertiary)">${r.sub}</div></div>
          <div style="color:${r.c};font-weight:600">${fmt(r.v)}</div>
        </div>`).join("")}
      <hr class="divider">
      <div class="payslip-row"><div style="font-weight:500">Total Employer Contributions</div><div style="font-weight:600">${fmt(totSoc + totEOSMS)}</div></div>
      <div style="margin-top:1rem;padding:10px;background:var(--color-background-secondary);border-radius:8px;font-size:12px;color:var(--color-text-secondary)">
        Employer contributions are paid separately to the State Revenue Committee and do not reduce employee net pay.
      </div>
    </div>
  </div>
  <div class="card mt-2">
    <div class="section-title" style="margin-bottom:1rem">Filing Deadlines · 2025</div>
    <table>
      <thead><tr><th>Form</th><th>Description</th><th>Deadline</th><th>Status</th></tr></thead>
      <tbody>
        <tr><td style="font-weight:500">200.00</td><td>Quarterly tax report (Q1)</td><td>May 15, 2025</td><td><span class="badge badge-green">Filed</span></td></tr>
        <tr><td style="font-weight:500">200.00</td><td>Quarterly tax report (Q2)</td><td>Aug 15, 2025</td><td><span class="badge badge-gray">Upcoming</span></td></tr>
        <tr><td style="font-weight:500">910.00</td><td>Simplified declaration (H1)</td><td>Aug 15, 2025</td><td><span class="badge badge-gray">Upcoming</span></td></tr>
      </tbody>
    </table>
  </div>`;
}

function pageMyDashboard() {
    const e = currentEmployee;
    const t = calcTaxes(e.salary);
    return `
  <div class="page-header">
    <div class="page-title">My Dashboard</div>
    <div class="page-sub">${e.position} · ${e.dept} · Employee since ${e.hired}</div>
  </div>
  <div class="stats-grid">
    <div class="stat-card"><div class="card-title">Gross Salary</div><div class="card-value" style="font-size:20px">${fmt(e.salary)}</div><div class="card-note">Per month</div></div>
    <div class="stat-card"><div class="card-title">Net Take-Home</div><div class="card-value" style="font-size:20px;color:#27500A">${fmt(t.net)}</div><div class="card-note">After all deductions</div></div>
    <div class="stat-card"><div class="card-title">Hourly Rate</div><div class="card-value" style="font-size:20px">${fmtN(e.hourly)} ₸</div><div class="card-note">Based on 160 hrs/mo</div></div>
    <div class="stat-card"><div class="card-title">Total Deductions</div><div class="card-value" style="font-size:20px;color:#A32D2D">${fmt(e.salary - t.net)}</div><div class="card-note">IIT + OPV + OSMS</div></div>
  </div>
  <div class="two-col">
    <div class="card">
      <div class="section-title" style="margin-bottom:1rem">Quick Payslip · May 2025</div>
      <div class="payslip-row"><div class="payslip-label">Gross Salary</div><div class="payslip-value">${fmt(e.salary)}</div></div>
      <div class="payslip-row"><div class="payslip-label">OPV (Pension 10%)</div><div class="payslip-value deduction">–${fmt(t.opv)}</div></div>
      <div class="payslip-row"><div class="payslip-label">OSMS (Medical 2%)</div><div class="payslip-value deduction">–${fmt(t.osms)}</div></div>
      <div class="payslip-row"><div class="payslip-label">IIT (Income Tax 10%)</div><div class="payslip-value deduction">–${fmt(t.iit)}</div></div>
      <hr class="divider">
      <div class="payslip-row"><div style="font-weight:600">Net Pay</div><div class="payslip-value positive">${fmt(t.net)}</div></div>
    </div>
    <div class="card">
      <div class="section-title" style="margin-bottom:1rem">This Week's Schedule</div>
      ${SCHEDULE.map(d => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:0.5px solid var(--color-border-tertiary)">
          <div style="font-size:13px;font-weight:${d.type === 'today' ? '600' : '400'};color:${d.type === 'today' ? '#1B4FD8' : 'var(--color-text-primary)'}">
            ${d.day}, May ${d.date < 10 ? d.date : d.date}
          </div>
          <div style="font-size:12px;color:var(--color-text-secondary)">${d.shift}</div>
          ${d.type === 'today' ? '<span class="badge badge-blue">Today</span>' : '<span class="badge badge-gray">' + (d.type === 'off' ? 'Off' : 'Work') + '</span>'}
        </div>`).join("")}
    </div>
  </div>`;
}

function pageMyPayslip() {
    const e = currentEmployee;
    const t = calcTaxes(e.salary);
    return `
  <div class="page-header"><div class="page-title">My Payslip</div><div class="page-sub">May 1–31, 2025</div></div>
  <div class="card" style="max-width:600px">
    <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:1.5rem;padding-bottom:1rem;border-bottom:0.5px solid var(--color-border-tertiary)">
      <div>
        <div style="font-size:16px;font-weight:600">${e.name}</div>
        <div class="text-sm text-muted">${e.position} · ${e.dept}</div>
        <div style="font-size:11px;color:var(--color-text-tertiary);margin-top:3px">IIN: ${e.iin || "950615300421"}</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:12px;font-weight:500">TechKZ LLC</div>
        <div class="text-sm text-muted">BIN: 180540021374</div>
        <div style="font-size:12px;margin-top:4px"><span class="badge badge-green">Paid · May 5</span></div>
      </div>
    </div>

    <div class="payslip-section">
      <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:var(--color-text-secondary);margin-bottom:8px">Earnings</div>
      <div class="payslip-row"><div class="payslip-label">Base Salary (22 days × 8 hrs)</div><div class="payslip-value">${fmt(e.salary)}</div></div>
      <div class="payslip-row"><div class="payslip-label">Hourly Rate</div><div class="payslip-value">${fmtN(e.hourly)} ₸/hr</div></div>
    </div>

    <div class="payslip-section">
      <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:var(--color-text-secondary);margin-bottom:8px">Deductions</div>
      <div class="payslip-row">
        <div><div class="payslip-label">OPV – Mandatory Pension</div><div style="font-size:11px;color:var(--color-text-tertiary)">10% of gross · ЕНПФ</div></div>
        <div class="payslip-value deduction">–${fmt(t.opv)}</div>
      </div>
      <div class="payslip-row">
        <div><div class="payslip-label">OSMS – Medical Insurance</div><div style="font-size:11px;color:var(--color-text-tertiary)">2% of gross · ФОСМС</div></div>
        <div class="payslip-value deduction">–${fmt(t.osms)}</div>
      </div>
      <div class="payslip-row">
        <div><div class="payslip-label">IIT – Individual Income Tax</div><div style="font-size:11px;color:var(--color-text-tertiary)">10% after standard deductions (14 MRP)</div></div>
        <div class="payslip-value deduction">–${fmt(t.iit)}</div>
      </div>
    </div>

    <div style="background:var(--color-background-secondary);border-radius:8px;padding:1rem;display:flex;justify-content:space-between;align-items:center">
      <div style="font-size:15px;font-weight:600">Net Pay</div>
      <div style="font-size:22px;font-weight:600;color:#27500A">${fmt(t.net)}</div>
    </div>

    <div style="margin-top:1rem;display:flex;gap:8px">
      <button class="btn-outline" style="flex:1">Download PDF</button>
      <button class="btn-outline" style="flex:1">Send to Email</button>
    </div>
  </div>`;
}

function pageMyTaxes() {
    const e = currentEmployee;
    const t = calcTaxes(e.salary);
    return `
  <div class="page-header"><div class="page-title">Tax Breakdown</div><div class="page-sub">Your deductions explained · Kazakhstan Tax Code 2025</div></div>
  <div class="two-col">
    <div>
      <div class="card" style="margin-bottom:1.25rem">
        <div class="section-title" style="margin-bottom:1rem">Monthly Deductions</div>
        ${[
            { l: "OPV – Pension", sub: "ЕНПФ · Retirement savings", v: t.opv, pct: 10, color: "#185FA5", bg: "#E6F1FB" },
            { l: "OSMS – Medical", sub: "ФОСМС · Healthcare access", v: t.osms, pct: 2, color: "#27500A", bg: "#EAF3DE" },
            { l: "IIT – Income Tax", sub: "КГД · State budget", v: t.iit, pct: Math.round(t.iit / e.salary * 100), color: "#A32D2D", bg: "#FCEBEB" },
        ].map(r => `
          <div style="border:0.5px solid var(--color-border-tertiary);border-radius:10px;padding:14px;margin-bottom:10px">
            <div class="flex items-center justify-between" style="margin-bottom:8px">
              <div>
                <div style="font-size:14px;font-weight:500">${r.l}</div>
                <div style="font-size:11px;color:var(--color-text-tertiary)">${r.sub}</div>
              </div>
              <div style="text-align:right">
                <div style="font-size:16px;font-weight:600;color:${r.color}">${fmt(r.v)}</div>
                <div style="font-size:11px;color:var(--color-text-tertiary)">${r.pct}% of gross</div>
              </div>
            </div>
            <div style="height:6px;background:var(--color-background-secondary);border-radius:3px;overflow:hidden">
              <div style="width:${r.pct * 4}%;height:100%;background:${r.color};border-radius:3px"></div>
            </div>
          </div>`).join("")}
      </div>
      <div class="card">
        <div class="section-title" style="margin-bottom:1rem">Annual Projection</div>
        <div class="stats-grid" style="grid-template-columns:1fr 1fr">
          <div class="stat-card"><div class="card-title">Annual Gross</div><div class="card-value" style="font-size:17px">${fmt(e.salary * 12)}</div></div>
          <div class="stat-card"><div class="card-title">Annual Net</div><div class="card-value" style="font-size:17px;color:#27500A">${fmt(t.net * 12)}</div></div>
          <div class="stat-card"><div class="card-title">Pension Saved</div><div class="card-value" style="font-size:17px;color:#185FA5">${fmt(t.opv * 12)}</div></div>
          <div class="stat-card"><div class="card-title">Tax Paid</div><div class="card-value" style="font-size:17px;color:#A32D2D">${fmt(t.iit * 12)}</div></div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="section-title" style="margin-bottom:1rem">How Your IIT is Calculated</div>
      <div style="font-size:13px;color:var(--color-text-secondary);line-height:1.7">
        Kazakhstan uses a flat 10% individual income tax rate with standard deductions.
      </div>
      ${[
            { l: "1. Gross Monthly Salary", v: fmt(e.salary), note: "" },
            { l: "2. Minus: OPV deduction", v: "–" + fmt(t.opv), note: "Pension contributions reduce taxable base" },
            { l: "3. Minus: OSMS deduction", v: "–" + fmt(t.osms), note: "Medical contributions reduce taxable base" },
            { l: "4. Minus: Standard deduction", v: "–" + fmt(14 * 3692), note: "14 MRP = 14 × 3,692 ₸ (2025)" },
            { l: "5. Taxable Base", v: fmt(Math.max(0, e.salary - t.opv - t.osms - 14 * 3692)), note: "", bold: true },
            { l: "6. IIT Rate", v: "× 10%", note: "Flat rate for all employees" },
            { l: "7. IIT Amount Due", v: fmt(t.iit), note: "", bold: true, red: true },
        ].map(r => `
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:0.5px solid var(--color-border-tertiary)">
          <div>
            <div style="font-size:13px;font-weight:${r.bold ? '600' : '400'}">${r.l}</div>
            ${r.note ? `<div style="font-size:11px;color:var(--color-text-tertiary)">${r.note}</div>` : ""}
          </div>
          <div style="font-size:13px;font-weight:${r.bold ? '600' : '500'};color:${r.red ? '#A32D2D' : 'var(--color-text-primary)'}">${r.v}</div>
        </div>`).join("")}
      <div style="margin-top:1rem;padding:10px;background:var(--color-background-secondary);border-radius:8px;font-size:12px;color:var(--color-text-secondary)">
        Your employer also pays Social Insurance (3.5%) and Employer OSMS (3%) on your behalf — these are not deducted from your salary.
      </div>
    </div>
  </div>`;
}

function pageMySchedule() {
    return `
  <div class="page-header"><div class="page-title">My Schedule</div><div class="page-sub">May 2025 · Standard 5/2 schedule · 09:00–18:00</div></div>
  <div class="card" style="margin-bottom:1.25rem">
    <div class="section-title" style="margin-bottom:1rem">This Week</div>
    <div class="week-grid">
      ${SCHEDULE.map(d => `
        <div class="day-card day-${d.type}">
          <div class="day-name">${d.day}</div>
          <div class="day-date">${d.date}</div>
          <div class="day-shift">${d.shift}</div>
        </div>`).join("")}
    </div>
  </div>
  <div class="card">
    <div class="section-title" style="margin-bottom:1rem">May 2025 Calendar</div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center">
      ${["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(d => `<div style="font-size:10px;font-weight:500;color:var(--color-text-secondary);padding:4px;text-transform:uppercase">${d}</div>`).join("")}
      ${[null, null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map((d, i) => {
        if (!d) return `<div></div>`;
        const dow = (i) % 7;
        const isWeekend = dow === 5 || dow === 6;
        const isHoliday = d === 1;
        const isToday = d === 1 && false;
        let bg = isWeekend || isHoliday ? "var(--color-background-secondary)" : "#E6F1FB";
        let color = isWeekend || isHoliday ? "var(--color-text-tertiary)" : "#185FA5";
        return `<div style="padding:8px 2px;border-radius:6px;font-size:13px;background:${bg};color:${color};position:relative">
          ${d}${isHoliday ? `<div style="font-size:8px;color:#A32D2D;margin-top:1px">holiday</div>` : ""}
        </div>`;
    }).join("")}
    </div>
    <div style="margin-top:1rem;display:flex;gap:12px;font-size:12px;color:var(--color-text-secondary)">
      <span style="display:flex;align-items:center;gap:5px"><span style="display:inline-block;width:12px;height:12px;background:#E6F1FB;border-radius:3px"></span>Work day</span>
      <span style="display:flex;align-items:center;gap:5px"><span style="display:inline-block;width:12px;height:12px;background:var(--color-background-secondary);border-radius:3px"></span>Day off</span>
      <span style="display:flex;align-items:center;gap:5px"><span style="display:inline-block;width:12px;height:12px;background:#FCEBEB;border-radius:3px"></span>Holiday</span>
    </div>
  </div>`;
}

function pageMyHistory() {
    const e = currentEmployee;
    return `
  <div class="page-header"><div class="page-title">Pay History</div><div class="page-sub">All your past payslips</div></div>
  <div class="stats-grid">
    <div class="stat-card"><div class="card-title">YTD Gross</div><div class="card-value" style="font-size:18px">${fmt(e.salary * 5)}</div><div class="card-note">Jan–May 2025</div></div>
    <div class="stat-card"><div class="card-title">YTD Net</div><div class="card-value" style="font-size:18px;color:#27500A">${fmt(calcTaxes(e.salary).net * 5)}</div><div class="card-note">Jan–May 2025</div></div>
    <div class="stat-card"><div class="card-title">YTD IIT Paid</div><div class="card-value" style="font-size:18px;color:#A32D2D">${fmt(calcTaxes(e.salary).iit * 5)}</div><div class="card-note">Jan–May 2025</div></div>
    <div class="stat-card"><div class="card-title">YTD OPV Saved</div><div class="card-value" style="font-size:18px;color:#185FA5">${fmt(calcTaxes(e.salary).opv * 5)}</div><div class="card-note">Pension accumulation</div></div>
  </div>
  <div class="card">
    <div class="table-wrap"><table>
      <thead><tr><th>Period</th><th>Gross</th><th>OPV</th><th>OSMS</th><th>IIT</th><th>Net Pay</th><th>Status</th><th></th></tr></thead>
      <tbody>
      ${PAYROLL_HISTORY.map(h => {
        const t = calcTaxes(e.salary);
        return `<tr>
          <td style="font-weight:500">${h.month}</td>
          <td>${fmt(e.salary)}</td>
          <td style="color:#185FA5">–${fmt(t.opv)}</td>
          <td style="color:#27500A">–${fmt(t.osms)}</td>
          <td style="color:#A32D2D">–${fmt(t.iit)}</td>
          <td style="font-weight:600;color:#27500A">${fmt(t.net)}</td>
          <td><span class="badge badge-green">Paid</span></td>
          <td><button class="btn-sm">Payslip</button></td>
        </tr>`;
    }).join("")}
      </tbody>
    </table></div>
  </div>`;
}
