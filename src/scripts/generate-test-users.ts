import * as XLSX from 'xlsx';
import * as path from 'path';

// Sample data
const users = [
  {
    Email: 'user1@example.com',
    'Employee Name': 'John Doe',
    Role: 'PM',
    'Working Unit': 'Development',
  },
  {
    Email: 'user2@example.com',
    'Employee Name': 'Jane Smith',
    Role: 'Member',
    'Working Unit': 'Testing',
  },
  {
    Email: 'user3@example.com',
    'Employee Name': 'Bob Johnson',
    Role: 'Admin',
    'Working Unit': 'Management',
  },
];

// Create a new workbook
const workbook = XLSX.utils.book_new();

// Convert data to worksheet
const worksheet = XLSX.utils.json_to_sheet(users);

// Add worksheet to workbook
XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

// Write to file
const outputPath = path.join(__dirname, '../../test-users.xlsx');
XLSX.writeFile(workbook, outputPath);

console.log(`Test Excel file generated at: ${outputPath}`);
