import { Payslip } from '../types';

export const downloadPayslip = (payslip: Payslip) => {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  
  const monthName = monthNames[payslip.month - 1];
  const formattedGross = parseFloat(payslip.gross_salary).toLocaleString('en-IN', { minimumFractionDigits: 2 });
  const formattedDeductions = parseFloat(payslip.total_deductions).toLocaleString('en-IN', { minimumFractionDigits: 2 });
  const formattedNet = parseFloat(payslip.net_salary).toLocaleString('en-IN', { minimumFractionDigits: 2 });

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Payslip - ${payslip.employee_details.first_name} ${payslip.employee_details.last_name} - ${monthName} ${payslip.year}</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; margin: 0; padding: 40px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #222; padding-bottom: 20px; margin-bottom: 30px; }
        .company-name { font-size: 24px; font-weight: bold; color: #111; }
        .payslip-title { font-size: 20px; color: #555; text-align: right; }
        .emp-details { margin-bottom: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .detail-row { display: flex; margin-bottom: 8px; font-size: 14px; }
        .detail-label { width: 150px; font-weight: bold; color: #555; }
        .detail-value { font-weight: normal; color: #111; }
        
        table { w-full; width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background-color: #f4f4f5; text-align: left; padding: 12px; font-size: 14px; border: 1px solid #e4e4e7; }
        td { padding: 12px; font-size: 14px; border: 1px solid #e4e4e7; }
        .amount { text-align: right; font-family: monospace; font-size: 15px; }
        
        .totals-container { display: flex; justify-content: flex-end; margin-top: 30px; }
        .totals-box { width: 300px; border: 1px solid #e4e4e7; border-radius: 8px; overflow: hidden; }
        .total-row { display: flex; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid #e4e4e7; font-size: 14px; }
        .total-row:last-child { border-bottom: none; background-color: #f4f4f5; font-weight: bold; font-size: 16px; }
        
        .footer { margin-top: 60px; font-size: 12px; color: #71717a; text-align: center; border-top: 1px solid #e4e4e7; padding-top: 20px; }
        
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="company-name">HRMS Enterprise</div>
          <div style="font-size: 12px; color: #777; margin-top: 4px;">123 Business Avenue, Tech Park</div>
        </div>
        <div>
          <div class="payslip-title">Salary Slip</div>
          <div style="font-size: 14px; margin-top: 4px; text-align: right;">For the month of ${monthName} ${payslip.year}</div>
        </div>
      </div>

      <div class="emp-details">
        <div>
          <div class="detail-row"><div class="detail-label">Employee Name:</div><div class="detail-value">${payslip.employee_details.first_name} ${payslip.employee_details.last_name}</div></div>
          <div class="detail-row"><div class="detail-label">Employee ID:</div><div class="detail-value">${payslip.employee_details.employee_id}</div></div>
          <div class="detail-row"><div class="detail-label">Email:</div><div class="detail-value">${payslip.employee_details.email}</div></div>
        </div>
        <div>
          <div class="detail-row"><div class="detail-label">Payslip No:</div><div class="detail-value">#${payslip.id.toString().padStart(6, '0')}</div></div>
          <div class="detail-row"><div class="detail-label">Payment Status:</div><div class="detail-value">${payslip.status}</div></div>
          ${payslip.payment_date ? `<div class="detail-row"><div class="detail-label">Payment Date:</div><div class="detail-value">${payslip.payment_date}</div></div>` : ''}
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 40%">Earnings</th>
            <th style="width: 20%" class="amount">Amount (₹)</th>
            <th style="width: 25%">Deductions</th>
            <th style="width: 15%" class="amount">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Basic Salary</td>
            <td class="amount">${parseFloat(payslip.base_salary).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            <td>Provident Fund (PF)</td>
            <td class="amount">${parseFloat(payslip.pf_deduction).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td>House Rent Allowance (HRA)</td>
            <td class="amount">${parseFloat(payslip.hra).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            <td>Tax Deduction (TDS)</td>
            <td class="amount">${parseFloat(payslip.tax_deduction).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td>Dearness Allowance (DA)</td>
            <td class="amount">${parseFloat(payslip.da).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            <td></td>
            <td class="amount"></td>
          </tr>
          <tr>
            <td>Special Allowances</td>
            <td class="amount">${parseFloat(payslip.special_allowances).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            <td></td>
            <td class="amount"></td>
          </tr>
        </tbody>
      </table>

      <div class="totals-container">
        <div class="totals-box">
          <div class="total-row">
            <span>Gross Earnings</span>
            <span class="amount">₹${formattedGross}</span>
          </div>
          <div class="total-row" style="color: #ef4444;">
            <span>Total Deductions</span>
            <span class="amount">-₹${formattedDeductions}</span>
          </div>
          <div class="total-row">
            <span>Net Payable</span>
            <span class="amount">₹${formattedNet}</span>
          </div>
        </div>
      </div>

      <div class="footer">
        <p>This is a computer-generated document. No signature is required.</p>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 500);
        }
      </script>
    </body>
    </html>
  `;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
};
