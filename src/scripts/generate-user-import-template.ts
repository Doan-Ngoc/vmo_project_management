import * as XLSX from 'xlsx';
import * as path from 'path';

// Sample data
const users = [
  {
    email: 'user1@example.com',
    employeeName: 'John Doe',
    role: 'pm',
    workingUnit: 'working_unit_1',
  },
  {
    email: 'user2@example.com',
    employeeName: 'Jane Smith',
    role: 'tech_lead',
    workingUnit: 'working_unit_1',
  },
  {
    email: 'user3@example.com',
    employeeName: 'Bob Johnson',
    role: 'dev',
    workingUnit: 'working_unit_2',
  },
];

// Create a new workbook
const workbook = XLSX.utils.book_new();

// Convert data to worksheet
const worksheet = XLSX.utils.json_to_sheet(users);

// Add worksheet to workbook
XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

// Write to file
const outputPath = path.join(
  __dirname,
  '../shared/file-processing/templates/user-import-template.xlsx',
);
XLSX.writeFile(workbook, outputPath);

console.log(`Test Excel file generated at: ${outputPath}`);
