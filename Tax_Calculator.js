/*Next steps:
* Add National Insurance deductions for categories other than A.
* Add pension % deduction
* Add donations, investment, etc.
*/

//Welcome to tax calculator!
//Parameters: (number), (string or number - values read: 1, 2, 4, 5), (boolean or string - values read: yes, y, true)
function afterTaxCalc(grossIncome, studentLoanPlan, postGrad) {
    if (typeof grossIncome !== "number" || grossIncome < 0) {
        return "Please set income to a positive number value.";
    }
    if (postGrad.toLowerCase() === "yes" ||postGrad.toLowerCase() === "y" || postGrad.toLowerCase() === "true") {
        postGrad = true;
    } else {
        postGrad = false;
    }
    const grossMonthly = Number((grossIncome / 12).toFixed(2));
    let income = 0;
    let nIPaid = 0;
    let personalAllowance = 12570;
    let plan = studentLoanPlan.toString();
    let sLThreshold = 0;
    let studentLoanRepayment = 0;
    let taxedInCurrentBand = 0;
    /* Student loan plans
     *Plan 1: 9%, threshold = 1682/mo
     *Plan 2: 9%, threshold = 2274/mo
     *Plan 4: 9%, threshold = 2114/mo
     *Plan 5: 9%, threshold = 2083/mo
     *Postgrad loan: 6%, threshold = 1750/mo
    */
   //determines the threshold for student loan repayment
    switch (plan) {
        case "1":
            sLThreshold = 1682;
            break;
        case "2":
            sLThreshold = 2274.58.toFixed(2);
            break;
        case "4":
            sLThreshold = 2114;
            break;
        case "5":
            sLThreshold = 2083;
            break;
        default:
            break;
    }
    //calculates student loan repayment per month
    if (grossMonthly > sLThreshold) {
        studentLoanRepayment = (grossMonthly - sLThreshold) * 0.09;
    }
    if (postGrad && grossMonthly > 1750) {
        studentLoanRepayment += (grossMonthly - 1750) * 0.06;
    }
    /*
     *National Insurance (NI) deductions:
     *PT = 1048/mo - employees pay NI after this point - 12%
     *UEL = 4189/mo - lower NI rate after this point   - 2%
    */
    if (grossMonthly >= 1048.01 && grossMonthly <= 4189) {
        nIPaid = ((grossIncome - 12576) * 0.12).toFixed(2); // £12576 = income below NI threshold
    } else if (grossMonthly > 4189) {
        nIPaid = (4523.04 + ((grossIncome - 17099.04) * .02)).toFixed(2); // £4523.04 = maximum annual NI paid in primary threshold, 2% paid after
    }
    income = (grossIncome - nIPaid) - (12 * studentLoanRepayment); //studentLoanRepayment is a monthly payment, hence * 12
    console.log(`Income after SL repayment, before tax applied: £${income.toFixed(2)}.`);
    console.log(`Student loan repayment monthly: £${studentLoanRepayment.toFixed(2)} on student loan plan ${studentLoanPlan}.`);

    //taxDeduct(income, 20) should return 80% of the value of income.
    const taxDeduct = (money, percent) => {
        let taxRate = (percent / 100).toFixed(2); //converts 20 -> .2, 45 -> .45, etc.
        return money - (money * taxRate);
    };
    const band1Tax = x => {
        taxable = x - personalAllowance;
        return taxDeduct(taxable, 20) + personalAllowance;
    };
    const band2Tax = x => {
        //Personal allowance reduction, £1 off for each £2 above 100k
        if (x < 125140 && x > 100000) {
            personalAllowance -= Math.floor((x - 100000) / 2);
            console.log(`Your personal allowance is reduced to £${personalAllowance}.`);
        } else if (x >= 125140) {
            personalAllowance = 0;
        }
        let taxedBand1 = 50270 - personalAllowance;
        taxedInCurrentBand = x - 50270;

        return taxDeduct(taxedBand1, 20) + taxDeduct(taxedInCurrentBand, 40) + personalAllowance;
    };
    const band3Tax = x => {
        taxedInCurrentBand = x - 150000;
        return taxDeduct(50270, 20) + taxDeduct(99730, 40) + taxDeduct(taxedInCurrentBand, 45);
    };
    const findTaxBand = x => {
        let annual = 0;
        if (50270 >= x && x > 12570) {
            annual = band1Tax(x);
            return annual;
        } else if (150000 >= x && x >= 50270.01) {
            annual = band2Tax(x);
            return annual;
        } else if (x > 150000) {
            annual = band3Tax(x);
            return annual;
        } else if (x <= 12570) {
            return x;
        }
    };

    const netAnnual = findTaxBand(income);
    const netMonthly = netAnnual / 12;
    console.log("National insurance paid annually: £" + `${nIPaid}`);
    return `Gross income £${grossIncome}. After tax: Annual income £${netAnnual.toFixed(2)}, Monthly income £${netMonthly.toFixed(2)}.`;
};
//Tests
const testIncome = Math.floor(Math.random()*137430) + 12570;

//Parameters: Income (number), Student loan plan (string or number - values read: 1, 2, 4, 5), postgraduate loan (boolean or string - values read: yes, y, true)
console.log(afterTaxCalc(34000, 2 ,"yes"));
