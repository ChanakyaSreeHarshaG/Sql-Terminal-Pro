import { DatabaseDefinition, SqlTableSchema } from '../sqlPracticeData';

export const PATTERNS_INIT_SQL = `
-- 1. Departments Table
CREATE TABLE IF NOT EXISTS departments (
  dept_id INTEGER PRIMARY KEY,
  department_id INTEGER GENERATED ALWAYS AS (dept_id) VIRTUAL,
  dept_name TEXT NOT NULL,
  department_name TEXT GENERATED ALWAYS AS (dept_name) VIRTUAL,
  location TEXT NOT NULL
);

INSERT INTO departments (dept_id, dept_name, location) VALUES
(1, 'Engineering', 'San Francisco'),
(2, 'Data & AI', 'New York'),
(3, 'Product', 'Seattle'),
(4, 'Marketing', 'London'),
(5, 'Finance', 'Singapore');

-- 2. Employees Table (with Managers, Salaries, Dates)
CREATE TABLE IF NOT EXISTS employees (
  emp_id INTEGER PRIMARY KEY,
  employee_id INTEGER GENERATED ALWAYS AS (emp_id) VIRTUAL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  salary INTEGER NOT NULL,
  dept_id INTEGER NOT NULL,
  department_id INTEGER GENERATED ALWAYS AS (dept_id) VIRTUAL,
  manager_id INTEGER,
  hire_date TEXT NOT NULL
);

INSERT INTO employees (emp_id, first_name, last_name, email, salary, dept_id, manager_id, hire_date) VALUES
(101, 'Satya', 'Nadella', 'satya@enterprise.io', 320000, 1, NULL, '2018-01-15'),
(102, 'Sundar', 'Pichai', 'sundar@enterprise.io', 310000, 1, 101, '2019-03-01'),
(103, 'Mira', 'Murati', 'mira@enterprise.io', 280000, 2, 101, '2020-05-10'),
(104, 'Andrej', 'Karpathy', 'andrej@enterprise.io', 290000, 2, 103, '2021-02-15'),
(105, 'Lex', 'Fridman', 'lex@enterprise.io', 190000, 2, 103, '2021-08-20'),
(106, 'Demis', 'Hassabis', 'demis@enterprise.io', 295000, 2, 101, '2019-11-01'),
(107, 'Jeff', 'Dean', 'jeff@enterprise.io', 330000, 1, 102, '2017-06-01'),
(108, 'Sanjay', 'Ghemawat', 'sanjay@enterprise.io', 325000, 1, 107, '2017-06-01'),
(109, 'Gwen', 'Stacy', 'gwen@enterprise.io', 145000, 3, 101, '2022-01-10'),
(110, 'Peter', 'Parker', 'peter@enterprise.io', 135000, 3, 109, '2022-04-12'),
(111, 'Miles', 'Morales', 'miles@enterprise.io', 120000, 3, 109, '2023-01-05'),
(112, 'Bruce', 'Wayne', 'bruce@enterprise.io', 250000, 4, 101, '2020-09-01'),
(113, 'Dick', 'Grayson', 'dick@enterprise.io', 140000, 4, 112, '2021-10-15'),
(114, 'Barbara', 'Gordon', 'barbara@enterprise.io', 155000, 4, 112, '2022-03-01'),
(115, 'Clark', 'Kent', 'clark@enterprise.io', 170000, 5, 101, '2021-07-01'),
(116, 'Lois', 'Lane', 'lois@enterprise.io', 185000, 5, 115, '2020-04-01'),
(117, 'Jimmy', 'Olsen', 'jimmy@enterprise.io', 95000, 5, 115, '2023-06-15'),
(118, 'Tony', 'Stark', 'tony@enterprise.io', 350000, 1, NULL, '2016-01-01'),
(119, 'Pepper', 'Potts', 'pepper@enterprise.io', 270000, 5, 118, '2017-05-01'),
(120, 'Happy', 'Hogan', 'happy@enterprise.io', 110000, 4, 118, '2019-02-01');

-- 3. Product Categories & Products
CREATE TABLE IF NOT EXISTS categories (
  category_id INTEGER PRIMARY KEY,
  category_name TEXT NOT NULL
);

INSERT INTO categories (category_id, category_name) VALUES
(1, 'Laptops & Computers'),
(2, 'Smartphones & Mobile'),
(3, 'Cloud & AI Hardware'),
(4, 'Audio & Accessories');

CREATE TABLE IF NOT EXISTS products (
  product_id INTEGER PRIMARY KEY,
  product_name TEXT NOT NULL,
  category_id INTEGER NOT NULL,
  price REAL NOT NULL
);

INSERT INTO products (product_id, product_name, category_id, price) VALUES
(201, 'MacBook Pro M3 Max', 1, 3499.00),
(202, 'Dell XPS 16 Developer Edition', 1, 2499.00),
(203, 'ThinkPad X1 Carbon Gen 12', 1, 2199.00),
(204, 'Framework Laptop 16 DIY', 1, 1799.00),
(205, 'iPhone 15 Pro Max 512GB', 2, 1399.00),
(206, 'Samsung Galaxy S24 Ultra', 2, 1299.00),
(207, 'Google Pixel 8 Pro', 2, 999.00),
(208, 'OnePlus 12', 2, 799.00),
(209, 'NVIDIA H100 Tensor Core GPU', 3, 29999.00),
(210, 'NVIDIA A100 80GB PCIe', 3, 14999.00),
(211, 'AMD Instinct MI300X', 3, 18500.00),
(212, 'Apple Vision Pro 512GB', 4, 3699.00),
(213, 'Sony WH-1000XM5 Headphones', 4, 399.00),
(214, 'AirPods Max USB-C', 4, 549.00),
(215, 'Bose QuietComfort Ultra', 4, 429.00);

-- 4. Customers Table (including users with NO orders for Anti-joins)
CREATE TABLE IF NOT EXISTS customers (
  customer_id INTEGER PRIMARY KEY,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT NOT NULL,
  signup_date TEXT NOT NULL
);

INSERT INTO customers (customer_id, customer_name, email, country, signup_date) VALUES
(1, 'Alice Walker', 'alice@gmail.com', 'USA', '2023-01-10'),
(2, 'Bob Chen', 'bob@qq.com', 'China', '2023-01-15'),
(3, 'Charlie Dupont', 'charlie@orange.fr', 'France', '2023-02-01'),
(4, 'Devon Vance', 'devon@outlook.com', 'USA', '2023-02-18'),
(5, 'Elena Rostova', 'elena@yandex.ru', 'Germany', '2023-03-05'),
(6, 'Farhan Khan', 'farhan@gmail.com', 'India', '2023-03-22'),
(7, 'Grace Hopper', 'grace@navy.mil', 'USA', '2023-04-10'),
(8, 'Hiroshi Tanaka', 'hiroshi@rakuten.jp', 'Japan', '2023-05-01'),
(9, 'Isabella Gomez', 'isabella@yahoo.es', 'Spain', '2023-06-12'),
(10, 'Jamal Williams', 'jamal@gmail.com', 'Canada', '2023-07-04');

-- 5. Orders & Order Items Table (with Completed, Cancelled, Returned)
CREATE TABLE IF NOT EXISTS orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  order_date TEXT NOT NULL,
  total_amount REAL NOT NULL,
  status TEXT NOT NULL
);

INSERT INTO orders (order_id, customer_id, order_date, total_amount, status) VALUES
(1001, 1, '2023-02-01', 3499.00, 'Completed'),
(1002, 1, '2023-03-15', 549.00, 'Completed'),
(1003, 1, '2023-05-10', 1399.00, 'Completed'),
(1004, 2, '2023-02-14', 1299.00, 'Completed'),
(1005, 2, '2023-04-20', 2499.00, 'Cancelled'),
(1006, 3, '2023-03-01', 399.00, 'Completed'),
(1007, 3, '2023-03-25', 1799.00, 'Completed'),
(1008, 4, '2023-04-05', 29999.00, 'Completed'),
(1009, 4, '2023-06-01', 14999.00, 'Completed'),
(1010, 5, '2023-05-02', 429.00, 'Cancelled'),
(1011, 6, '2023-04-12', 799.00, 'Completed'),
(1012, 6, '2023-06-18', 2199.00, 'Completed'),
(1013, 6, '2023-07-22', 999.00, 'Completed');
-- Notice: Customers 7, 8, 9, 10 NEVER placed an order (crucial for Anti-Join questions)

CREATE TABLE IF NOT EXISTS order_items (
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL
);

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(1001, 201, 1, 3499.00),
(1002, 214, 1, 549.00),
(1003, 205, 1, 1399.00),
(1004, 206, 1, 1299.00),
(1005, 202, 1, 2499.00),
(1006, 213, 1, 399.00),
(1007, 204, 1, 1799.00),
(1008, 209, 1, 29999.00),
(1009, 210, 1, 14999.00),
(1010, 215, 1, 429.00),
(1011, 208, 1, 799.00),
(1012, 203, 1, 2199.00),
(1013, 207, 1, 999.00);

-- 6. User Logins (Crucial for 3-Day Consecutive Logins & Gaps-and-Islands)
CREATE TABLE IF NOT EXISTS user_logins (
  login_id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  login_date TEXT NOT NULL
);

INSERT INTO user_logins (login_id, user_id, login_date) VALUES
-- User 1: 3-day streak (2023-08-01, 2023-08-02, 2023-08-03), break, then 2023-08-05
(1, 1, '2023-08-01'),
(2, 1, '2023-08-02'),
(3, 1, '2023-08-03'),
(4, 1, '2023-08-05'),
-- User 2: 4-day streak (2023-08-02, 2023-08-03, 2023-08-04, 2023-08-05)
(5, 2, '2023-08-02'),
(6, 2, '2023-08-03'),
(7, 2, '2023-08-04'),
(8, 2, '2023-08-05'),
-- User 3: sporadic logins (never 3 consecutive days)
(9, 3, '2023-08-01'),
(10, 3, '2023-08-03'),
(11, 3, '2023-08-05'),
(12, 3, '2023-08-08'),
-- User 4: 3-day streak (2023-08-10, 2023-08-11, 2023-08-12)
(13, 4, '2023-08-10'),
(14, 4, '2023-08-11'),
(15, 4, '2023-08-12');

-- 7. Bank Financial Transactions (for Running Balance & Rolling 3-Day Average)
CREATE TABLE IF NOT EXISTS transactions (
  txn_id INTEGER PRIMARY KEY,
  account_id INTEGER NOT NULL,
  txn_date TEXT NOT NULL,
  txn_type TEXT NOT NULL,
  amount REAL NOT NULL
);

INSERT INTO transactions (txn_id, account_id, txn_date, txn_type, amount) VALUES
(501, 9001, '2023-09-01', 'Deposit', 5000.00),
(502, 9001, '2023-09-02', 'Withdrawal', -1200.00),
(503, 9001, '2023-09-03', 'Deposit', 2500.00),
(504, 9001, '2023-09-03', 'Withdrawal', -800.00),
(505, 9001, '2023-09-05', 'Deposit', 1500.00),
(506, 9001, '2023-09-06', 'Withdrawal', -3000.00),
(507, 9001, '2023-09-07', 'Deposit', 4000.00),
(508, 9002, '2023-09-01', 'Deposit', 10000.00),
(509, 9002, '2023-09-05', 'Withdrawal', -4500.00),
(510, 9002, '2023-09-05', 'Deposit', 3000.00);

-- 8. Cinema Theater Seats (for Consecutive Available Seats Pattern)
CREATE TABLE IF NOT EXISTS cinema_seats (
  seat_id INTEGER PRIMARY KEY,
  row_id TEXT NOT NULL,
  seat_number INTEGER NOT NULL,
  is_booked INTEGER NOT NULL -- 0 = free, 1 = booked
);

INSERT INTO cinema_seats (seat_id, row_id, seat_number, is_booked) VALUES
(1, 'A', 1, 1),
(2, 'A', 2, 0),
(3, 'A', 3, 0),
(4, 'A', 4, 0), -- Consecutive seats 2, 3, 4 are FREE in row A!
(5, 'A', 5, 1),
(6, 'B', 1, 0),
(7, 'B', 2, 1),
(8, 'B', 3, 0),
(9, 'B', 4, 0),
(10, 'B', 5, 1);

-- 9. Daily Website Visits & Conversions (for MoM / YoY / Ratios)
CREATE TABLE IF NOT EXISTS daily_metrics (
  metric_date TEXT PRIMARY KEY,
  visits INTEGER NOT NULL,
  signups INTEGER NOT NULL,
  checkouts INTEGER NOT NULL,
  revenue REAL NOT NULL
);

INSERT INTO daily_metrics (metric_date, visits, signups, checkouts, revenue) VALUES
('2023-09-01', 1200, 180, 45, 4500.00),
('2023-09-02', 1350, 210, 52, 5300.00),
('2023-09-03', 1100, 160, 38, 3900.00),
('2023-09-04', 1500, 240, 65, 6800.00),
('2023-09-05', 1420, 225, 58, 6100.00),
('2023-09-06', 1600, 270, 70, 7500.00),
('2023-09-07', 1750, 310, 85, 9200.00),
('2023-09-08', 1300, 190, 48, 5100.00);

-- 10. Projects Table (Enterprise Strategic Initiatives)
CREATE TABLE IF NOT EXISTS projects (
  project_id INTEGER PRIMARY KEY,
  project_name TEXT NOT NULL,
  budget REAL NOT NULL
);

INSERT INTO projects (project_id, project_name, budget) VALUES
(1, 'Apollo Cloud Infrastructure', 250000.00),
(2, 'NextGen AI Assistant', 320000.00),
(3, 'Global Security Compliance', 120000.00),
(4, 'Mobile Enterprise Suite', 180000.00),
(5, 'Autonomous Logistics Engine', 290000.00);

-- 11. Employee Projects (Project Workload & Staff Allocations)
CREATE TABLE IF NOT EXISTS employee_projects (
  employee_id INTEGER NOT NULL,
  project_id INTEGER NOT NULL,
  hours_allocated INTEGER NOT NULL,
  PRIMARY KEY (employee_id, project_id)
);

INSERT INTO employee_projects (employee_id, project_id, hours_allocated) VALUES
(101, 1, 40),
(101, 2, 25),
(102, 1, 35),
(103, 2, 60),
(104, 2, 55),
(105, 2, 30),
(106, 2, 45),
(107, 1, 50),
(108, 1, 45),
(112, 3, 40),
(113, 3, 30),
(115, 4, 35),
(116, 4, 40),
(118, 5, 50),
(119, 5, 30);
`;

export const PATTERNS_TABLE_SCHEMAS: SqlTableSchema[] = [
  {
    tableName: 'employees',
    description: 'Corporate staff directory with salaries, managers, department assignments, and hire dates.',
    columns: [
      { name: 'emp_id', type: 'INTEGER', isPk: true },
      { name: 'employee_id', type: 'INTEGER (alias)' },
      { name: 'first_name', type: 'TEXT' },
      { name: 'last_name', type: 'TEXT' },
      { name: 'email', type: 'TEXT' },
      { name: 'salary', type: 'INTEGER' },
      { name: 'dept_id', type: 'INTEGER', isFk: true, references: 'departments.dept_id' },
      { name: 'department_id', type: 'INTEGER (alias)' },
      { name: 'manager_id', type: 'INTEGER' },
      { name: 'hire_date', type: 'TEXT' }
    ]
  },
  {
    tableName: 'departments',
    description: 'Department units and regional office headquarters.',
    columns: [
      { name: 'dept_id', type: 'INTEGER', isPk: true },
      { name: 'department_id', type: 'INTEGER (alias)' },
      { name: 'dept_name', type: 'TEXT' },
      { name: 'department_name', type: 'TEXT (alias)' },
      { name: 'location', type: 'TEXT' }
    ]
  },
  {
    tableName: 'products',
    description: 'Catalog of retail tech products, hardware, and retail pricing.',
    columns: [
      { name: 'product_id', type: 'INTEGER', isPk: true },
      { name: 'product_name', type: 'TEXT' },
      { name: 'category_id', type: 'INTEGER', isFk: true, references: 'categories.category_id' },
      { name: 'price', type: 'REAL' }
    ]
  },
  {
    tableName: 'categories',
    description: 'Product categorization taxonomies.',
    columns: [
      { name: 'category_id', type: 'INTEGER', isPk: true },
      { name: 'category_name', type: 'TEXT' }
    ]
  },
  {
    tableName: 'customers',
    description: 'Customer profiles across multiple countries.',
    columns: [
      { name: 'customer_id', type: 'INTEGER', isPk: true },
      { name: 'customer_name', type: 'TEXT' },
      { name: 'email', type: 'TEXT' },
      { name: 'country', type: 'TEXT' },
      { name: 'signup_date', type: 'TEXT' }
    ]
  },
  {
    tableName: 'orders',
    description: 'Order ledger with dates, statuses (Completed, Cancelled), and total order values.',
    columns: [
      { name: 'order_id', type: 'INTEGER', isPk: true },
      { name: 'customer_id', type: 'INTEGER', isFk: true, references: 'customers.customer_id' },
      { name: 'order_date', type: 'TEXT' },
      { name: 'total_amount', type: 'REAL' },
      { name: 'status', type: 'TEXT' }
    ]
  },
  {
    tableName: 'order_items',
    description: 'Line item records per order with product IDs, quantities purchased, and unit prices.',
    columns: [
      { name: 'item_id', type: 'INTEGER', isPk: true },
      { name: 'order_id', type: 'INTEGER', isFk: true, references: 'orders.order_id' },
      { name: 'product_id', type: 'INTEGER', isFk: true, references: 'products.product_id' },
      { name: 'quantity', type: 'INTEGER' },
      { name: 'unit_price', type: 'REAL' }
    ]
  },
  {
    tableName: 'user_logins',
    description: 'User access history tracking login streaks, cohorts, and gaps-and-islands.',
    columns: [
      { name: 'login_id', type: 'INTEGER', isPk: true },
      { name: 'user_id', type: 'INTEGER' },
      { name: 'login_date', type: 'TEXT' }
    ]
  },
  {
    tableName: 'transactions',
    description: 'Banking transactions with timestamps for running balances and moving averages.',
    columns: [
      { name: 'txn_id', type: 'INTEGER', isPk: true },
      { name: 'account_id', type: 'INTEGER' },
      { name: 'txn_date', type: 'TEXT' },
      { name: 'txn_type', type: 'TEXT' },
      { name: 'amount', type: 'REAL' }
    ]
  },
  {
    tableName: 'cinema_seats',
    description: 'Theater seating map with availability status (0=Free, 1=Booked) for consecutive seating puzzles.',
    columns: [
      { name: 'seat_id', type: 'INTEGER', isPk: true },
      { name: 'row_id', type: 'TEXT' },
      { name: 'seat_number', type: 'INTEGER' },
      { name: 'is_booked', type: 'INTEGER' }
    ]
  },
  {
    tableName: 'daily_metrics',
    description: 'Web analytics day-by-day metrics for DoD growth, conversion rates, and moving averages.',
    columns: [
      { name: 'metric_date', type: 'TEXT', isPk: true },
      { name: 'visits', type: 'INTEGER' },
      { name: 'signups', type: 'INTEGER' },
      { name: 'checkouts', type: 'INTEGER' },
      { name: 'revenue', type: 'REAL' }
    ]
  },
  {
    tableName: 'projects',
    description: 'Strategic cross-functional initiatives and budget allocations.',
    columns: [
      { name: 'project_id', type: 'INTEGER', isPk: true },
      { name: 'project_name', type: 'TEXT' },
      { name: 'budget', type: 'REAL' }
    ]
  },
  {
    tableName: 'employee_projects',
    description: 'Resource allocations detailing staff hours committed to strategic projects.',
    columns: [
      { name: 'employee_id', type: 'INTEGER', isPk: true, isFk: true, references: 'employees.employee_id' },
      { name: 'project_id', type: 'INTEGER', isPk: true, isFk: true, references: 'projects.project_id' },
      { name: 'hours_allocated', type: 'INTEGER' }
    ]
  }
];

export const PATTERNS_DATABASE_DEFINITION: DatabaseDefinition = {
  id: 'enterprise', // matches database definition type
  name: 'Interview Master Schema',
  badge: '20 Master Patterns Sandbox',
  description: 'Production-grade relational schema covering employees, customers, orders, financial transactions, logins, and time-series metrics.',
  initSql: PATTERNS_INIT_SQL,
  tables: PATTERNS_TABLE_SCHEMAS
};
