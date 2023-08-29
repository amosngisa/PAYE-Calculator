
document.getElementById("payeForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const income = parseFloat(document.getElementById("monthlySalary").value);
    const option = document.getElementById("treat-salary-as").value;
    const nssf = document.getElementById("nssf-rates").value;
    const nhif = document.getElementById("deduct-nhif").checked;

    function deduct(income)
    {
        if (nssf == "both")
        {
            return calculateNSSF(income);
        }
        else if(nssf == "tier1")
        {
            if (income <= 5999)
            {
                return  0.06 * income;
            }
            else if (income > 5999)
            {
                return 360;   
            }

        }
        else if(nssf == "oldRates")
        {
            return 200;
        }
        else if(nssf == "none")
        {
            return 0;   
        }
        else
        {
            return calculateNSSF(income);
        }
    }

    function calculatePAYE(income) {

        const minus = deduct(income);
        const taxableIncome = income - minus;
    
        if (taxableIncome <= 23999) {
            return 0;
        } else if (taxableIncome >= 24000) {
            const t1 = 24000;
            const t2 = t1 + 8333;
            const t3 = t2 + 467667;
            const t4 = t3 + 300000;
            const t5 = t4 + 32333;
    
            if (taxableIncome === t1) {
                return (24000 * 0.10) - 2400;
            } else if (taxableIncome > t1 && taxableIncome <= t2) {
                const value = taxableIncome - t1;
                return (2400 + (value * 0.25)) - 2400;
            } else if (taxableIncome > t2 && taxableIncome <= t3) {
                const value = taxableIncome - t2;
                return (2400 + 2083.25 + (value * 0.30)) - 2400;
            } else if (taxableIncome > t3 && taxableIncome <= t4) {
                const value = taxableIncome - t3;
                return (2400 + 2083.25 + 140300.1 + (value * 0.325)) - 2400;
            } else if (taxableIncome >= t5) {
                const value = taxableIncome - t4;
                return (2400 + 2083.25 + 140300.1 + 97500 + (value * 0.35)) - 2400;
            }
        }
    }
    
    function calculateNHIF(income) {
        const nhifRanges = {
            5999: 150,
            7999: 300,
            11999: 400,
            14999: 500,
            19999: 600,
            24999: 750,
            29999: 850,
            34999: 900,
            39999: 950,
            44999: 1000,
            49999: 1100,
            59999: 1200,
            69999: 1300,
            79999: 1400,
            89999: 1500,
            99999: 1600,
            119999: 1700
        };
    
        for (const rangeLimit in nhifRanges) {
            if (income <= rangeLimit) {
                return nhifRanges[rangeLimit];
            }
        }
    
        return 1700;
    }
    
    function calculateNSSF(income) {
        const uel = 18000;
        const lel = 6000;
    
        if (income <= uel) {
            return 0.06 * income;
        } else {
            return 0.06 * uel;
        }
    }

    function getnhif(nhif)
    {
        if(nhif)
        {
            return calculateNHIF(income);
        }
        else
        {
            return 0;
        }
    }
    
    function formatCurrency(amount) 
    {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'Kes' }).format(amount);
    }
    const payeTax = calculatePAYE(income);
    const nhifContribution = getnhif(nhif);
    const nssfContribution = deduct(income);
    const taxable = income - nssfContribution;
    const payeAfter = taxable - payeTax;
    const housing = income * (1.5 / 100);
    const net = payeAfter - nhifContribution - housing;
    const relief = 2400;
    
    // console.log(`Gross Pay: Kes ${income.toFixed(2)}`);
    // console.log(`NSSF: Kes ${nssfContribution.toFixed(2)}`);
    // console.log(`Taxable Pay: Kes. ${taxable.toFixed(2)}`);
    // console.log(`Personal Relief: Kes 2400.00`);
    // console.log(`PAYE: Kes ${payeTax.toFixed(2)}`);
    // console.log(`Pay after TAX: Kes ${payeAfter.toFixed(2)}`);
    // console.log(`NHIF: Kes ${nhifContribution.toFixed(2)}`);
    // console.log(`Housing Levy: Kes ${housing.toFixed(2)}`);
    // console.log(`NET PAY: Kes ${net.toFixed(2)}`);

    // document.getElementById("netPayResult").textContent = `Your net pay is: ${formatCurrency(net)}`;

    // Create a div element with the specified classes
    const divElement = document.createElement("div");
    divElement.className = "alert alert-info";

    // Create a table element with the specified classes
    const tableElement = document.createElement("table");
    tableElement.className = "table table-condensed table-bordered";

    // Create the table header row
    const theadElement = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const headerCell = document.createElement("th");
    headerCell.colSpan = "2";
    headerCell.textContent = "Pay Slip Results:";
    headerRow.appendChild(headerCell);
    theadElement.appendChild(headerRow);

    // Create the table body
    const tbodyElement = document.createElement("tbody");

    // Define the data rows
    const rowData = [
        ["Gross Pay:", `${formatCurrency(income)}`],
        ...(nssfContribution != 0  
            ?[["NSSF:", `- ${formatCurrency(nssfContribution)}`]]
            :[]),
        ["TAXABLE PAY:", `${formatCurrency(taxable)}`],
        ["Personal Relief:", `- ${formatCurrency(relief)}`],
        ["P.A.Y.E:", `${formatCurrency(payeTax)}`],
        ["PAY AFTER TAX:", `${formatCurrency(payeAfter)}`],
        ...(nhifContribution != 0  
            ?[["NHIF:", `- ${formatCurrency(nhifContribution)}`]]
            :[]),
        ["Housing Levy:", `- ${formatCurrency(housing)}`],
        ["NET PAY:", `${formatCurrency(net)}`],
    ];

    // Create rows and cells for each data entry
    rowData.forEach(([label, value]) => {
    const row = document.createElement("tr");
    const labelCell = document.createElement("td");
    labelCell.align = "right";
    labelCell.textContent = label;
    const valueCell = document.createElement("td");
    valueCell.align = "right";
    const strongElement = document.createElement("b");
    strongElement.textContent = value;
    valueCell.appendChild(strongElement);
    row.appendChild(labelCell);
    row.appendChild(valueCell);
    tbodyElement.appendChild(row);
    });

    // Append all elements to the DOM
    tableElement.appendChild(theadElement);
    tableElement.appendChild(tbodyElement);
    divElement.appendChild(tableElement);

    // Find the target element in the HTML where you want to append the created content
    document.getElementById("netPayResult").textContent = ` `;
    const targetElement = document.getElementById("netPayResult"); // Replace with the actual ID of the target element
    targetElement.appendChild(divElement);

    

});