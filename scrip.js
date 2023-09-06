
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

    function netPAYE(income) {

        const minus = deduct(income);
        const taxableIncome = income + minus;
        //const taxableIncome = income;
    
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

    function calculateGrossSalary(income) {
        let gross = income + nhifContribution + housing; // Start with net pay and add NHIF and housing deductions

        // Reverse calculate PAYE
        gross += netpaye;

        // Reverse calculate NSSF contribution
        if (nssfContribution != 0) {
            gross += nssfContribution;
        }

        // Reverse calculate NHIF contribution
        if (nhifContribution != 0) {
            gross += nhifContribution;
        }

        // Adjust for personal relief
        gross += relief;
        gross += nhifrelief;

        return gross;
    }
    
    const nhifContribution = getnhif(nhif);
    const nssfContribution = deduct(income);
    const taxable = income - nssfContribution;
    const nhifrelief = nhifContribution * 0.15;
    const payeTax = calculatePAYE(income) - nhifrelief;
    const netpaye = netPAYE(income);
    const payeAfter = taxable - payeTax;
    const housing = income * (1.5 / 100);
    const net = payeAfter - nhifContribution - housing;
    const relief = 2400;  
    const netPay = calculateGrossSalary(income);
    const netaxable = netPay - nssfContribution ;
    const house = netPay * (1.5 / 100);
    const neTax = calculatePAYE(netPay) - nhifrelief;
    //netPAYE(netPay) - nhifrelief;
    const netAfter = netaxable - neTax;
    const netnhif = calculateNHIF(netPay);
    const netrelief = netnhif * 0.15;
   
    // netPay - nssfContribution;
    // const netpaye = netPAYE(income) - nhifrelief;

    
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

    if (option != "NetPay")
    {
          // Define the data rows
    const rowData = [
        ...(option != "NetPay"
            ?[["Gross Pay:", `${formatCurrency(income)}`]]
            :[["Gross Pay:", `${formatCurrency(netPay)}`]]
        ),
        ...(nssfContribution != 0  
            ?[["NSSF:", `- ${formatCurrency(nssfContribution)}`]]
            :[]),
        ...(option != "NetPay"
            ?[["TAXABLE PAY:", `${formatCurrency(taxable)}`]]
            :[["TAXABLE PAY:", `${formatCurrency(netaxable)}`]]),
        ["Personal Relief:", `- ${formatCurrency(relief)}`],
        ...(nhifContribution != 0  
            ?[["Insurance (NHIF) Relief:", `- ${formatCurrency(nhifrelief)}`]]
            :[]),
        ...(option != "NetPay"
            ?[["P.A.Y.E:", `${formatCurrency(payeTax)}`]]
            :[["P.A.Y.E:", `${formatCurrency(neTax)}`]]),
        ...(option != "NetPay"
            ?[["PAY AFTER TAX:", `${formatCurrency(payeAfter)}`]]
            :[["PAY AFTER TAX:", `${formatCurrency(netAfter)}`]]),
        //["PAY AFTER TAX:", `${formatCurrency(payeAfter)}`],
        ...(nhifContribution != 0  
            ?[["NHIF:", `- ${formatCurrency(nhifContribution)}`]]
            :[]),
        //["Housing Levy:", `- ${formatCurrency(housing)}`],
        ...(option != "NetPay"
            ?[["Housing Levy:", `${formatCurrency(housing)}`]]
            :[["Housing Levy:", `${formatCurrency(house)}`]]
        ),
        ...(option != "NetPay"
        ?[["NET PAY:", `${formatCurrency(net)}`]]
        :[["NET PAY:", `${formatCurrency(income)}`]]
    ),
        
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

    }
    else
    {

    // Define the data rows
    const rowData = [
        ...(option != "NetPay"
            ?[["Gross Pay:", `${formatCurrency(income)}`]]
            :[["Gross Pay:", `${formatCurrency(netPay)}`]]
        ),
        ...(nssfContribution != 0  
            ?[["NSSF:", `- ${formatCurrency(nssfContribution)}`]]
            :[]),
        ...(option != "NetPay"
            ?[["TAXABLE PAY:", `${formatCurrency(taxable)}`]]
            :[["TAXABLE PAY:", `${formatCurrency(netaxable)}`]]),
        ["Personal Relief:", `- ${formatCurrency(relief)}`],
        ...(nhifContribution != 0  
            ?[["Insurance (NHIF) Relief:", `- ${formatCurrency(netrelief)}`]]
            :[]),
        ...(option != "NetPay"
            ?[["P.A.Y.E:", `${formatCurrency(payeTax)}`]]
            :[["P.A.Y.E:", `${formatCurrency(neTax)}`]]),
        ...(option != "NetPay"
            ?[["PAY AFTER TAX:", `${formatCurrency(payeAfter)}`]]
            :[["PAY AFTER TAX:", `${formatCurrency(netAfter)}`]]),
        //["PAY AFTER TAX:", `${formatCurrency(payeAfter)}`],
        ...(nhifContribution != 0  
            ?[["NHIF:", `- ${formatCurrency(netnhif)}`]]
            :[]),
        //["Housing Levy:", `- ${formatCurrency(housing)}`],
        ...(option != "NetPay"
            ?[["Housing Levy:", `${formatCurrency(housing)}`]]
            :[["Housing Levy:", `${formatCurrency(house)}`]]
        ),
        ...(option != "NetPay"
        ?[["NET PAY:", `${formatCurrency(net)}`]]
        :[["NET PAY:", `${formatCurrency(income)}`]]
    ),
        
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

}

    // Append all elements to the DOM
    tableElement.appendChild(theadElement);
    tableElement.appendChild(tbodyElement);
    divElement.appendChild(tableElement);

    // Find the target element in the HTML where you want to append the created content
    document.getElementById("netPayResult").textContent = ` `;
    const targetElement = document.getElementById("netPayResult"); // Replace with the actual ID of the target element
    targetElement.appendChild(divElement);

    

});