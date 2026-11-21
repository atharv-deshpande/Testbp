(() => {
  const form = document.getElementById("calculator-form");
  const frequency = document.getElementById("frequency");
  const amountInput = document.getElementById("amount");
  const amountLabel = document.getElementById("amount-label");
  const amountHint = document.getElementById("amount-hint");
  const timingWrap = document.getElementById("deposit-timing-wrap");
  const error = document.getElementById("form-error");
  const rateInput = document.getElementById("rate");
  const fmt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
  const money = value => "₹ " + fmt.format(Math.round(value));

  function updateInputMode() {
    const mode = frequency.value;
    timingWrap.hidden = mode === "lump";
    if (mode === "monthly") {
      amountLabel.textContent = "Monthly investment amount";
      amountHint.textContent = "Enter a monthly amount. Your total deposits in each financial year cannot exceed ₹1,50,000.";
      amountInput.value = amountInput.value || "5000";
    } else if (mode === "lump") {
      amountLabel.textContent = "One-time investment amount";
      amountHint.textContent = "The full deposit is assumed to be made in April of the first financial year.";
    } else {
      amountLabel.textContent = "Annual investment amount";
      amountHint.textContent = "Enter an amount between ₹500 and ₹1,50,000 per financial year.";
    }
    error.textContent = "";
  }

  function calculate() {
    const mode = frequency.value;
    const amount = Number(amountInput.value);
    const rate = Number(rateInput.value);
    const timing = document.getElementById("timing").value;
    if (!Number.isFinite(amount) || amount <= 0) throw new Error("Enter an investment amount greater than zero.");
    if (!Number.isFinite(rate) || rate < 0 || rate > 20) throw new Error("Enter an annual interest rate between 0% and 20%.");

    const annualContribution = mode === "monthly" ? amount * 12 : amount;
    if (annualContribution < 500) throw new Error("PPF requires a minimum deposit of ₹500 per financial year.");
    if (annualContribution > 150000) throw new Error("Your total deposits cannot exceed ₹1,50,000 per financial year.");
    if (mode === "lump" && amount > 150000) throw new Error("The one-time deposit cannot exceed the annual PPF limit of ₹1,50,000.");

    const monthlyRate = rate / 100 / 12;
    let balance = 0;
    let totalInvested = 0;
    const rows = [];

    for (let year = 1; year <= 15; year += 1) {
      const openingBalance = balance;
      let yearlyDeposit = 0;
      let interestForYear = 0;

      for (let month = 0; month < 12; month += 1) {
        let deposit = 0;
        if (mode === "yearly" && month === 0) deposit = amount;
        if (mode === "lump" && year === 1 && month === 0) deposit = amount;
        if (mode === "monthly") deposit = amount;

        balance += deposit;
        yearlyDeposit += deposit;
        totalInvested += deposit;

        // PPF interest for a month is based on the lowest balance from the
        // 5th through month-end. A deposit made after the 5th earns interest
        // from the following month; earlier deposits earn in the same month.
        const eligibleBalance = timing === "late" && mode !== "lump" ? balance - deposit : balance;
        interestForYear += eligibleBalance * monthlyRate;
      }

      balance += interestForYear;
      rows.push({
        year,
        deposit: yearlyDeposit,
        invested: totalInvested,
        interest: balance - totalInvested,
        closing: balance,
        yearInterest: interestForYear,
        opening: openingBalance
      });
    }
    return { balance, totalInvested, interest: balance - totalInvested, rows };
  }

  function renderChart(rows) {
    const chart = document.getElementById("growth-chart");
    chart.replaceChildren();
    const max = rows[rows.length - 1].closing || 1;
    [0, 4, 9, 14].forEach(index => {
      const row = rows[index];
      const group = document.createElement("div");
      group.className = "bar-group";
      const stack = document.createElement("div");
      stack.className = "bar-stack";
      stack.style.height = Math.max(4, row.closing / max * 100) + "%";
      const interest = document.createElement("div");
      interest.className = "bar-interest";
      interest.style.height = (row.closing ? (row.interest / row.closing * 100) : 0) + "%";
      const principal = document.createElement("div");
      principal.className = "bar-principal";
      principal.style.height = (row.closing ? (row.invested / row.closing * 100) : 100) + "%";
      stack.append(interest, principal);
      const label = document.createElement("span");
      label.textContent = "Y" + row.year;
      group.append(stack, label);
      chart.append(group);
    });
  }

  function renderSchedule(rows) {
    const body = document.getElementById("schedule-body");
    body.replaceChildren();
    rows.forEach(row => {
      const tr = document.createElement("tr");
      [String(row.year), money(row.deposit), money(row.invested), money(row.interest), money(row.closing)].forEach((value, index) => {
        const td = document.createElement("td");
        td.textContent = value;
        if (index === 4) td.className = "closing-value";
        tr.append(td);
      });
      body.append(tr);
    });
  }

  function render() {
    try {
      const result = calculate();
      error.textContent = "";
      document.getElementById("maturity-value").textContent = money(result.balance);
      document.getElementById("total-invested").textContent = money(result.totalInvested);
      document.getElementById("interest-earned").textContent = money(result.interest);
      renderChart(result.rows);
      renderSchedule(result.rows);
    } catch (err) {
      error.textContent = err.message;
    }
  }

  frequency.addEventListener("change", () => { updateInputMode(); render(); });
  form.addEventListener("submit", event => { event.preventDefault(); render(); });
  [amountInput, rateInput, document.getElementById("timing")].forEach(input => {
    input.addEventListener("input", render);
    input.addEventListener("change", render);
  });
  updateInputMode();
  render();
})();