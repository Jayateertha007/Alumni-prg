const xlsx = require('xlsx');
const mysql = require('mysql2/promise');

async function processExcel() {
  // Read the Excel file
  const workbook = xlsx.readFile('Alumni_data.xlsx');
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);

  // Connect to MySQL
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'sdmit_alumni'
  });

  // Create table if not exists
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS alumni (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      graduation_year INT,
      current_position VARCHAR(255),
      company VARCHAR(255)
    )
  `);

  // Insert data into the database
  for (const row of data) {
    await connection.execute(
      'INSERT INTO alumni (name, graduation_year, current_position, company) VALUES (?, ?, ?, ?)',
      [row.Name, row.GraduationYear, row.CurrentPosition, row.Company]
    );
  }

  console.log('Data imported successfully');
  await connection.end();
}

processExcel().catch(console.error);