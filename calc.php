<?php
function calculatePAYE($income) {
    $taxableIncome = $income - calculateNSSF($income); // Taxable income

    if ($taxableIncome <= 23999)
    {
        return 0;
    }
    elseif ($taxableIncome >= 24000)
    {
        $t1 = 24000;
        $t2 = $t1 + 8333;
        $t3 = $t2 + 467667;
        $t4 = $t3 + 300000;
        $t5 = $t4 + 32333;

        if($taxableIncome == $t1)
        {
            return (24000 * 0.10) - 2400;
        }
        elseif ($taxableIncome > $t1 && $taxableIncome <= $t2)
        {
            $value = $taxableIncome - $t1;
            return (2400 + ($value * 0.25)) - 2400;
        }
        elseif ($taxableIncome > $t2 && $taxableIncome <= $t3)
        {
            $value = $taxableIncome - $t2;
            return (2400 + 2083.25 + ($value * 0.30)) - 2400;
        }
        elseif ($taxableIncome > $t3 && $taxableIncome <= $t4)
        {
            $value = $taxableIncome - $t3;
            return (2400 + 2083.25 + 140300.1 + ($value * 0.325)) - 2400;
        }
        elseif ($taxableIncome >= $t5)
        {
            $value = $taxableIncome - $t4;
            return (2400 + 2083.25 + 140300.1 + 97500 + ($value * 0.35)) - 2400;
        }

    }
    
}
function calculateNHIF($income) {
    // NHIF contributions based on income ranges
    $nhifRanges = [
        5999 => 150,     // Monthly NHIF contribution up to 5,999 income
        7999 => 300,     // Monthly NHIF contribution between 6,000 and 7,999 income
        11999 => 400,    // Monthly NHIF contribution between 8,000 and 11,999 income
        14999 => 500,    // Monthly NHIF contribution between 12,000 and 14,999 income
        19999 => 600,    // Monthly NHIF contribution between 15,000 and 19,999 income
        24999 => 750,    // Monthly NHIF contribution between 20,000 and 24,999 income
        29999 => 850,    // Monthly NHIF contribution between 25,000 and 29,999 income
        34999 => 900,    // Monthly NHIF contribution between 30,000 and 34,999 income
        39999 => 950,    // Monthly NHIF contribution between 35,000 and 39,999 income
        44999 => 1000,   // Monthly NHIF contribution between 40,000 and 44,999 income
        49999 => 1100,   // Monthly NHIF contribution between 45,000 and 49,999 income
        59999 => 1200,   // Monthly NHIF contribution between 50,000 and 59,999 income
        69999 => 1300,   // Monthly NHIF contribution between 60,000 and 69,999 income
        79999 => 1400,   // Monthly NHIF contribution between 70,000 and 79,999 income
        89999 => 1500,   // Monthly NHIF contribution between 80,000 and 89,999 income
        99999 => 1600,   // Monthly NHIF contribution between 90,000 and 99,999 income
        119999 => 1700   // Monthly NHIF contribution between 100,000 and above
    ];
    
    foreach ($nhifRanges as $rangeLimit => $contribution) {
        if ($income <= $rangeLimit) {
            return $contribution;
        }
    }
    
    return 1700; // Maximum contribution for income above 1000,000
}
function calculateNSSF($income) {
    // Define the upper earning limit and lower earning limit
    $uel = 18000;
    $lel = 6000;

    if ($income <= $uel) {
        return 0.06 * $income;
      } else {
        // If the salary is greater than the upper earning limit,
        // the contribution rate is 6% of the upper earning limit.
        return 0.06 * $uel;
      }
    
}

$income = 50000; // Replace this with the actual income amount
$payeTax = calculatePAYE($income);
$nhifContribution = calculateNHIF($income);
$nssfContribution = calculateNSSF($income);
$taxable = $income - calculateNSSF($income);
$payeafter =  $taxable - $payeTax;
$housing = $income * (1.5/100);
$net = $payeafter - $nhifContribution - $housing;

echo "Gross Pay: Kes " . number_format($income, 2) . PHP_EOL;
echo "NSSF: Kes " . number_format($nssfContribution, 2) . PHP_EOL;
echo "Taxable Pay: Kes. " . number_format($taxable, 2) . PHP_EOL;
echo "Personal Relief: Kes " . number_format(2400, 2) . PHP_EOL;
echo "PAYE: Kes " . number_format($payeTax, 2) . PHP_EOL;
echo "Pay after TAX: Kes " . number_format($payeafter, 2) . PHP_EOL;
echo "NHIF: Kes " . number_format($nhifContribution, 2) . PHP_EOL;
echo "Housing Levy: Kes " . number_format($housing, 2) . PHP_EOL;
echo "NET PAY: Kes " . number_format($net, 2) . PHP_EOL;

?>
