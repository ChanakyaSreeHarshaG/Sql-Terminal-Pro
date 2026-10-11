import { SqlQuestion } from '../sqlPracticeData';

export interface SqlPatternDefinition {
  id: string;
  number: number;
  name: string;
  shortDesc: string;
  technique: string;
}

export const SQL_PATTERNS: SqlPatternDefinition[] = [
  { id: 'pat-1', number: 1, name: 'Top N per Group', shortDesc: 'Highest salary per department, top products per category', technique: 'ROW_NUMBER / RANK / DENSE_RANK with PARTITION BY' },
  { id: 'pat-2', number: 2, name: 'Nth Highest Value', shortDesc: 'Second highest salary, 3rd highest product price', technique: 'subquery, DENSE_RANK, or LIMIT/OFFSET' },
  { id: 'pat-3', number: 3, name: 'Duplicate Detection & Removal', shortDesc: 'Find, count, or filter duplicate rows', technique: 'GROUP BY ... HAVING COUNT(*) > 1, ROW_NUMBER()' },
  { id: 'pat-4', number: 4, name: "Finding What's Missing", shortDesc: 'Customers who never ordered, employees with no manager', technique: 'LEFT JOIN ... IS NULL, NOT EXISTS, NOT IN' },
  { id: 'pat-5', number: 5, name: 'Self Joins', shortDesc: 'Employees earning more than manager, peer comparisons', technique: 'INNER / LEFT JOIN on same table' },
  { id: 'pat-6', number: 6, name: 'Running Totals & Moving Averages', shortDesc: 'Cumulative revenue, 3-day rolling averages', technique: 'SUM() OVER, ROWS BETWEEN' },
  { id: 'pat-7', number: 7, name: 'Comparing to Previous or Next Row', shortDesc: 'Day-over-day change, month-over-month growth', technique: 'LAG / LEAD with PARTITION BY' },
  { id: 'pat-8', number: 8, name: 'Consecutive Sequences (Gaps & Islands)', shortDesc: 'Users logged in 3 days in a row, consecutive seats', technique: 'Gaps-and-islands, row-number difference trick' },
  { id: 'pat-9', number: 9, name: 'Aggregation with Filters', shortDesc: 'Conditional counts and sums in a single row', technique: 'CASE WHEN inside SUM / COUNT' },
  { id: 'pat-10', number: 10, name: 'Group Filtering', shortDesc: 'Departments with > X staff, products sold > N times', technique: 'HAVING COUNT(*) / SUM()' },
  { id: 'pat-11', number: 11, name: 'Percentage / Ratio Calculations', shortDesc: 'Share of total, conversion rate, cancellation rate', technique: '100.0 * numerator / denominator' },
  { id: 'pat-12', number: 12, name: 'Retention & Cohort Analysis', shortDesc: 'Day-1 retention, first-purchase cohorts', technique: 'Self joins on date offset, MIN(date)' },
  { id: 'pat-13', number: 13, name: 'Date Handling & Time-Series', shortDesc: 'Monthly rollups, date diffs, rolling 7-day metrics', technique: 'strftime, julianday, date diffs' },
  { id: 'pat-14', number: 14, name: 'First or Last Record per Entity', shortDesc: 'Latest order per customer, first login date', technique: 'ROW_NUMBER() or MIN/MAX with JOIN' },
  { id: 'pat-15', number: 15, name: 'Pivoting Rows to Columns', shortDesc: 'Monthly sales as columns, status matrix', technique: 'Conditional aggregation with CASE WHEN' },
  { id: 'pat-16', number: 16, name: 'Set Operations', shortDesc: 'Unioning users, finding symmetric differences', technique: 'UNION, UNION ALL, EXCEPT, INTERSECT' },
  { id: 'pat-17', number: 17, name: 'CTEs and Multi-Stage Pipelines', shortDesc: 'Readable modular stages, correlated subqueries', technique: 'WITH cte1 AS (...), cte2 AS (...)' },
  { id: 'pat-18', number: 18, name: 'Recursive CTEs', shortDesc: 'Org hierarchies, manager-employee chains', technique: 'WITH RECURSIVE org AS (anchor UNION ALL recursive)' },
  { id: 'pat-19', number: 19, name: 'Median and Percentiles', shortDesc: 'Median salary, 75th percentile calculations', technique: 'ROW_NUMBER() / NTILE or row-count midpoint' },
  { id: 'pat-20', number: 20, name: 'Joins with Aggregates (Fan-out Trap)', shortDesc: 'Preventing double counting and multiplied totals', technique: 'Pre-aggregate in CTE before joining' }
];

export const PATTERN_QUESTIONS: SqlQuestion[] = [
  // =========================================================================
  // 🎯 PATTERN 1: TOP N PER GROUP (10 Questions)
  // =========================================================================
  {
    id: 'pat-1-1',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 1: Top N per Group',
    title: 'Highest Salary in Each Department',
    description: 'Find the highest earning employee in each department using ROW_NUMBER(). Show dept_name, first_name, and salary.',
    hint: 'ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) as rn, filter WHERE rn = 1.',
    starterSql: "WITH Ranked AS (\n  SELECT d.dept_name, e.first_name, e.salary,\n    ROW_NUMBER() OVER (PARTITION BY e.dept_id ORDER BY e.salary DESC) AS rn\n  FROM employees e\n  JOIN departments d ON e.dept_id = d.dept_id\n)\nSELECT dept_name, first_name, salary\nFROM Ranked\nWHERE rn = 1;",
    solutionSql: "WITH Ranked AS (\n  SELECT d.dept_name, e.first_name, e.salary,\n    ROW_NUMBER() OVER (PARTITION BY e.dept_id ORDER BY e.salary DESC) AS rn\n  FROM employees e\n  JOIN departments d ON e.dept_id = d.dept_id\n)\nSELECT dept_name, first_name, salary\nFROM Ranked\nWHERE rn = 1;"
  },
  {
    id: 'pat-1-2',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 1: Top N per Group',
    title: 'Top 2 Most Expensive Products per Category',
    description: 'Find the top 2 highest priced products in each category using DENSE_RANK(). Show category_name, product_name, and price.',
    hint: 'DENSE_RANK() OVER (PARTITION BY category_id ORDER BY price DESC) as rnk WHERE rnk <= 2.',
    starterSql: "WITH RankedProducts AS (\n  SELECT c.category_name, p.product_name, p.price,\n    DENSE_RANK() OVER (PARTITION BY p.category_id ORDER BY p.price DESC) AS rnk\n  FROM products p\n  JOIN categories c ON p.category_id = c.category_id\n)\nSELECT category_name, product_name, price\nFROM RankedProducts\nWHERE rnk <= 2\nORDER BY category_name, price DESC;",
    solutionSql: "WITH RankedProducts AS (\n  SELECT c.category_name, p.product_name, p.price,\n    DENSE_RANK() OVER (PARTITION BY p.category_id ORDER BY p.price DESC) AS rnk\n  FROM products p\n  JOIN categories c ON p.category_id = c.category_id\n)\nSELECT category_name, product_name, price\nFROM RankedProducts\nWHERE rnk <= 2\nORDER BY category_name, price DESC;"
  },
  {
    id: 'pat-1-3',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 1: Top N per Group',
    title: 'Top 2 Longest-Tenured Employees per Department',
    description: 'Find the 2 earliest hired employees in each department. Show dept_id, first_name, and hire_date.',
    hint: 'ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY hire_date ASC) as rn WHERE rn <= 2.',
    starterSql: "WITH EarliestHires AS (\n  SELECT dept_id, first_name, hire_date,\n    ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY hire_date ASC) AS rn\n  FROM employees\n)\nSELECT dept_id, first_name, hire_date\nFROM EarliestHires\nWHERE rn <= 2\nORDER BY dept_id, hire_date ASC;",
    solutionSql: "WITH EarliestHires AS (\n  SELECT dept_id, first_name, hire_date,\n    ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY hire_date ASC) AS rn\n  FROM employees\n)\nSELECT dept_id, first_name, hire_date\nFROM EarliestHires\nWHERE rn <= 2\nORDER BY dept_id, hire_date ASC;"
  },
  {
    id: 'pat-1-4',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 1: Top N per Group',
    title: 'Top Spending Customer in Each Country',
    description: 'Find the customer who has spent the most total money (sum of completed orders) in each country. Show country, customer_name, and total_spent.',
    hint: 'First aggregate sum(total_amount) by customer and country, then use ROW_NUMBER() PARTITION BY country ORDER BY total_spent DESC.',
    starterSql: "WITH CustomerSpend AS (\n  SELECT c.country, c.customer_name, SUM(o.total_amount) AS total_spent\n  FROM customers c\n  JOIN orders o ON c.customer_id = o.customer_id\n  WHERE o.status = 'Completed'\n  GROUP BY c.customer_id, c.country, c.customer_name\n),\nRanked AS (\n  SELECT country, customer_name, total_spent,\n    ROW_NUMBER() OVER (PARTITION BY country ORDER BY total_spent DESC) AS rn\n  FROM CustomerSpend\n)\nSELECT country, customer_name, total_spent\nFROM Ranked\nWHERE rn = 1;",
    solutionSql: "WITH CustomerSpend AS (\n  SELECT c.country, c.customer_name, SUM(o.total_amount) AS total_spent\n  FROM customers c\n  JOIN orders o ON c.customer_id = o.customer_id\n  WHERE o.status = 'Completed'\n  GROUP BY c.customer_id, c.country, c.customer_name\n),\nRanked AS (\n  SELECT country, customer_name, total_spent,\n    ROW_NUMBER() OVER (PARTITION BY country ORDER BY total_spent DESC) AS rn\n  FROM CustomerSpend\n)\nSELECT country, customer_name, total_spent\nFROM Ranked\nWHERE rn = 1;"
  },
  {
    id: 'pat-1-5',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 1: Top N per Group',
    title: 'Latest Order per Customer',
    description: 'Find the most recent order for each customer using ROW_NUMBER(). Show customer_id, order_id, order_date, and total_amount.',
    hint: 'ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) as rn WHERE rn = 1.',
    starterSql: "WITH LatestOrders AS (\n  SELECT customer_id, order_id, order_date, total_amount,\n    ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS rn\n  FROM orders\n)\nSELECT customer_id, order_id, order_date, total_amount\nFROM LatestOrders\nWHERE rn = 1\nORDER BY customer_id;",
    solutionSql: "WITH LatestOrders AS (\n  SELECT customer_id, order_id, order_date, total_amount,\n    ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS rn\n  FROM orders\n)\nSELECT customer_id, order_id, order_date, total_amount\nFROM LatestOrders\nWHERE rn = 1\nORDER BY customer_id;"
  },
  {
    id: 'pat-1-6',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 1: Top N per Group',
    title: 'Top 3 Salaried Employees with Ties (RANK)',
    description: 'Find the top 3 salary rankings in Engineering (dept_id = 1) using RANK() to allow ties. Show first_name, salary, and rnk.',
    hint: 'RANK() OVER (ORDER BY salary DESC) as rnk WHERE dept_id = 1 and rnk <= 3.',
    starterSql: "WITH RankedEngineers AS (\n  SELECT first_name, salary,\n    RANK() OVER (ORDER BY salary DESC) AS rnk\n  FROM employees\n  WHERE dept_id = 1\n)\nSELECT first_name, salary, rnk\nFROM RankedEngineers\nWHERE rnk <= 3\nORDER BY rnk, salary DESC;",
    solutionSql: "WITH RankedEngineers AS (\n  SELECT first_name, salary,\n    RANK() OVER (ORDER BY salary DESC) AS rnk\n  FROM employees\n  WHERE dept_id = 1\n)\nSELECT first_name, salary, rnk\nFROM RankedEngineers\nWHERE rnk <= 3\nORDER BY rnk, salary DESC;"
  },
  {
    id: 'pat-1-7',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 1: Top N per Group',
    title: 'Highest Single Transaction per Bank Account',
    description: 'Find the single largest transaction amount for each bank account. Show account_id, txn_id, txn_date, and amount.',
    hint: 'ROW_NUMBER() OVER (PARTITION BY account_id ORDER BY amount DESC) as rn WHERE rn = 1.',
    starterSql: "WITH MaxTxn AS (\n  SELECT account_id, txn_id, txn_date, amount,\n    ROW_NUMBER() OVER (PARTITION BY account_id ORDER BY amount DESC) AS rn\n  FROM transactions\n)\nSELECT account_id, txn_id, txn_date, amount\nFROM MaxTxn\nWHERE rn = 1;",
    solutionSql: "WITH MaxTxn AS (\n  SELECT account_id, txn_id, txn_date, amount,\n    ROW_NUMBER() OVER (PARTITION BY account_id ORDER BY amount DESC) AS rn\n  FROM transactions\n)\nSELECT account_id, txn_id, txn_date, amount\nFROM MaxTxn\nWHERE rn = 1;"
  },
  {
    id: 'pat-1-8',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 1: Top N per Group',
    title: 'Top 2 Ordered Products by Quantity per Category',
    description: 'Find the top 2 products in each category that have the highest total quantity sold in order_items.',
    hint: 'Aggregate sum(quantity) by product and category, then ROW_NUMBER() PARTITION BY category_id ORDER BY total_qty DESC.',
    starterSql: "WITH ProductSales AS (\n  SELECT p.category_id, p.product_name, SUM(oi.quantity) AS total_qty\n  FROM products p\n  JOIN order_items oi ON p.product_id = oi.product_id\n  GROUP BY p.product_id, p.category_id, p.product_name\n),\nRanked AS (\n  SELECT category_id, product_name, total_qty,\n    ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY total_qty DESC) AS rn\n  FROM ProductSales\n)\nSELECT category_id, product_name, total_qty\nFROM Ranked\nWHERE rn <= 2\nORDER BY category_id, total_qty DESC;",
    solutionSql: "WITH ProductSales AS (\n  SELECT p.category_id, p.product_name, SUM(oi.quantity) AS total_qty\n  FROM products p\n  JOIN order_items oi ON p.product_id = oi.product_id\n  GROUP BY p.product_id, p.category_id, p.product_name\n),\nRanked AS (\n  SELECT category_id, product_name, total_qty,\n    ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY total_qty DESC) AS rn\n  FROM ProductSales\n)\nSELECT category_id, product_name, total_qty\nFROM Ranked\nWHERE rn <= 2\nORDER BY category_id, total_qty DESC;"
  },
  {
    id: 'pat-1-9',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 1: Top N per Group',
    title: 'Top Earning Manager per Department',
    description: 'Identify the highest-paid manager (an employee who is listed in another employee manager_id) in each department.',
    hint: 'Filter WHERE emp_id IN (SELECT DISTINCT manager_id FROM employees WHERE manager_id IS NOT NULL), then ROW_NUMBER() PARTITION BY dept_id.',
    starterSql: "WITH Managers AS (\n  SELECT dept_id, first_name, salary,\n    ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rn\n  FROM employees\n  WHERE emp_id IN (SELECT DISTINCT manager_id FROM employees WHERE manager_id IS NOT NULL)\n)\nSELECT dept_id, first_name, salary\nFROM Managers\nWHERE rn = 1;",
    solutionSql: "WITH Managers AS (\n  SELECT dept_id, first_name, salary,\n    ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rn\n  FROM employees\n  WHERE emp_id IN (SELECT DISTINCT manager_id FROM employees WHERE manager_id IS NOT NULL)\n)\nSELECT dept_id, first_name, salary\nFROM Managers\nWHERE rn = 1;"
  },
  {
    id: 'pat-1-10',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 1: Top N per Group',
    title: 'Top Value Order per Month',
    description: "Find the single highest order amount for each month. Show the month (YYYY-MM), order_id, and total_amount.",
    hint: "Use SUBSTR(order_date, 1, 7) AS order_month, ROW_NUMBER() PARTITION BY order_month ORDER BY total_amount DESC.",
    starterSql: "WITH MonthlyOrders AS (\n  SELECT SUBSTR(order_date, 1, 7) AS order_month, order_id, total_amount,\n    ROW_NUMBER() OVER (PARTITION BY SUBSTR(order_date, 1, 7) ORDER BY total_amount DESC) AS rn\n  FROM orders\n)\nSELECT order_month, order_id, total_amount\nFROM MonthlyOrders\nWHERE rn = 1\nORDER BY order_month;",
    solutionSql: "WITH MonthlyOrders AS (\n  SELECT SUBSTR(order_date, 1, 7) AS order_month, order_id, total_amount,\n    ROW_NUMBER() OVER (PARTITION BY SUBSTR(order_date, 1, 7) ORDER BY total_amount DESC) AS rn\n  FROM orders\n)\nSELECT order_month, order_id, total_amount\nFROM MonthlyOrders\nWHERE rn = 1\nORDER BY order_month;"
  },

  // =========================================================================
  // 🎯 PATTERN 2: NTH HIGHEST VALUE (10 Questions)
  // =========================================================================
  {
    id: 'pat-2-1',
    database: 'enterprise',
    difficulty: 'Easy',
    category: 'Pattern 2: Nth Highest Value',
    title: 'Second Highest Salary (DENSE_RANK)',
    description: 'Find the second highest salary across all employees using DENSE_RANK() to correctly handle potential ties.',
    hint: 'WITH Ranked AS (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk FROM employees) SELECT DISTINCT salary FROM Ranked WHERE rnk = 2;',
    starterSql: "WITH Ranked AS (\n  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk\n  FROM employees\n)\nSELECT DISTINCT salary AS second_highest_salary\nFROM Ranked\nWHERE rnk = 2;",
    solutionSql: "WITH Ranked AS (\n  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk\n  FROM employees\n)\nSELECT DISTINCT salary AS second_highest_salary\nFROM Ranked\nWHERE rnk = 2;"
  },
  {
    id: 'pat-2-2',
    database: 'enterprise',
    difficulty: 'Easy',
    category: 'Pattern 2: Nth Highest Value',
    title: 'Second Highest Salary (Subquery)',
    description: 'Find the second highest salary using a subquery and MAX(salary) without window functions.',
    hint: 'SELECT MAX(salary) AS second_highest_salary FROM employees WHERE salary < (SELECT MAX(salary) FROM employees);',
    starterSql: "SELECT MAX(salary) AS second_highest_salary\nFROM employees\nWHERE salary < (SELECT MAX(salary) FROM employees);",
    solutionSql: "SELECT MAX(salary) AS second_highest_salary\nFROM employees\nWHERE salary < (SELECT MAX(salary) FROM employees);"
  },
  {
    id: 'pat-2-3',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 2: Nth Highest Value',
    title: 'Third Most Expensive Product Price',
    description: 'Find the 3rd highest distinct price in the products table using DENSE_RANK().',
    hint: 'DENSE_RANK() OVER (ORDER BY price DESC) as rnk WHERE rnk = 3.',
    starterSql: "WITH RankedPrices AS (\n  SELECT price, DENSE_RANK() OVER (ORDER BY price DESC) AS rnk\n  FROM products\n)\nSELECT DISTINCT price AS third_highest_price\nFROM RankedPrices\nWHERE rnk = 3;",
    solutionSql: "WITH RankedPrices AS (\n  SELECT price, DENSE_RANK() OVER (ORDER BY price DESC) AS rnk\n  FROM products\n)\nSELECT DISTINCT price AS third_highest_price\nFROM RankedPrices\nWHERE rnk = 3;"
  },
  {
    id: 'pat-2-4',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 2: Nth Highest Value',
    title: 'Second Highest Salary in Engineering',
    description: 'Find the 2nd highest distinct salary within Department 1 (Engineering).',
    hint: 'Filter WHERE dept_id = 1 before ranking or using subquery.',
    starterSql: "WITH DeptRank AS (\n  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk\n  FROM employees\n  WHERE dept_id = 1\n)\nSELECT DISTINCT salary AS second_highest_eng_salary\nFROM DeptRank\nWHERE rnk = 2;",
    solutionSql: "WITH DeptRank AS (\n  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk\n  FROM employees\n  WHERE dept_id = 1\n)\nSELECT DISTINCT salary AS second_highest_eng_salary\nFROM DeptRank\nWHERE rnk = 2;"
  },
  {
    id: 'pat-2-5',
    database: 'enterprise',
    difficulty: 'Easy',
    category: 'Pattern 2: Nth Highest Value',
    title: 'Third Most Recent Order Placed',
    description: 'Find the order details for the 3rd most recent order using LIMIT and OFFSET.',
    hint: 'ORDER BY order_date DESC LIMIT 1 OFFSET 2.',
    starterSql: "SELECT order_id, customer_id, order_date, total_amount\nFROM orders\nORDER BY order_date DESC\nLIMIT 1 OFFSET 2;",
    solutionSql: "SELECT order_id, customer_id, order_date, total_amount\nFROM orders\nORDER BY order_date DESC\nLIMIT 1 OFFSET 2;"
  },
  {
    id: 'pat-2-6',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 2: Nth Highest Value',
    title: 'Second Largest Deposit Transaction',
    description: "Find the 2nd largest transaction amount among all 'Deposit' transactions across all accounts.",
    hint: "WHERE txn_type = 'Deposit' with DENSE_RANK() OVER (ORDER BY amount DESC).",
    starterSql: "WITH RankedDeposits AS (\n  SELECT amount, DENSE_RANK() OVER (ORDER BY amount DESC) AS rnk\n  FROM transactions\n  WHERE txn_type = 'Deposit'\n)\nSELECT DISTINCT amount AS second_largest_deposit\nFROM RankedDeposits\nWHERE rnk = 2;",
    solutionSql: "WITH RankedDeposits AS (\n  SELECT amount, DENSE_RANK() OVER (ORDER BY amount DESC) AS rnk\n  FROM transactions\n  WHERE txn_type = 'Deposit'\n)\nSELECT DISTINCT amount AS second_largest_deposit\nFROM RankedDeposits\nWHERE rnk = 2;"
  },
  {
    id: 'pat-2-7',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 2: Nth Highest Value',
    title: 'Nth Highest Salary with NULL Fallback',
    description: 'Write a robust query that returns the 10th highest distinct salary, or NULL if there are fewer than 10 distinct salaries in the company.',
    hint: 'SELECT (SELECT DISTINCT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET 9) AS nth_highest_salary;',
    starterSql: "SELECT (\n  SELECT DISTINCT salary\n  FROM employees\n  ORDER BY salary DESC\n  LIMIT 1 OFFSET 9\n) AS nth_highest_salary;",
    solutionSql: "SELECT (\n  SELECT DISTINCT salary\n  FROM employees\n  ORDER BY salary DESC\n  LIMIT 1 OFFSET 9\n) AS nth_highest_salary;"
  },
  {
    id: 'pat-2-8',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 2: Nth Highest Value',
    title: 'Second Largest Order Amount in Completed Orders',
    description: "Find the 2nd highest total_amount among all 'Completed' orders.",
    hint: "DENSE_RANK() OVER (ORDER BY total_amount DESC) where status = 'Completed'.",
    starterSql: "WITH RankedOrders AS (\n  SELECT total_amount, DENSE_RANK() OVER (ORDER BY total_amount DESC) AS rnk\n  FROM orders\n  WHERE status = 'Completed'\n)\nSELECT DISTINCT total_amount AS second_highest_order_amount\nFROM RankedOrders\nWHERE rnk = 2;",
    solutionSql: "WITH RankedOrders AS (\n  SELECT total_amount, DENSE_RANK() OVER (ORDER BY total_amount DESC) AS rnk\n  FROM orders\n  WHERE status = 'Completed'\n)\nSELECT DISTINCT total_amount AS second_highest_order_amount\nFROM RankedOrders\nWHERE rnk = 2;"
  },
  {
    id: 'pat-2-9',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 2: Nth Highest Value',
    title: 'Second Earliest Hired Employee in Entire Company',
    description: 'Find the second earliest hire_date and the employee who was hired on that date.',
    hint: 'DENSE_RANK() OVER (ORDER BY hire_date ASC) as rnk WHERE rnk = 2.',
    starterSql: "WITH Hires AS (\n  SELECT first_name, last_name, hire_date,\n    DENSE_RANK() OVER (ORDER BY hire_date ASC) AS rnk\n  FROM employees\n)\nSELECT first_name, last_name, hire_date\nFROM Hires\nWHERE rnk = 2;",
    solutionSql: "WITH Hires AS (\n  SELECT first_name, last_name, hire_date,\n    DENSE_RANK() OVER (ORDER BY hire_date ASC) AS rnk\n  FROM employees\n)\nSELECT first_name, last_name, hire_date\nFROM Hires\nWHERE rnk = 2;"
  },
  {
    id: 'pat-2-10',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 2: Nth Highest Value',
    title: 'Second Highest Spending Customer',
    description: 'Find the customer who holds the 2nd highest cumulative spend across all completed orders.',
    hint: 'Sum total_amount by customer_id, DENSE_RANK() OVER (ORDER BY total_spend DESC) as rnk WHERE rnk = 2.',
    starterSql: "WITH Spends AS (\n  SELECT customer_id, SUM(total_amount) AS total_spend,\n    DENSE_RANK() OVER (ORDER BY SUM(total_amount) DESC) AS rnk\n  FROM orders\n  WHERE status = 'Completed'\n  GROUP BY customer_id\n)\nSELECT c.customer_name, s.total_spend\nFROM Spends s\nJOIN customers c ON s.customer_id = c.customer_id\nWHERE s.rnk = 2;",
    solutionSql: "WITH Spends AS (\n  SELECT customer_id, SUM(total_amount) AS total_spend,\n    DENSE_RANK() OVER (ORDER BY SUM(total_amount) DESC) AS rnk\n  FROM orders\n  WHERE status = 'Completed'\n  GROUP BY customer_id\n)\nSELECT c.customer_name, s.total_spend\nFROM Spends s\nJOIN customers c ON s.customer_id = c.customer_id\nWHERE s.rnk = 2;"
  },

  // =========================================================================
  // 🎯 PATTERN 3: DUPLICATES (10 Questions)
  // =========================================================================
  {
    id: 'pat-3-1',
    database: 'enterprise',
    difficulty: 'Easy',
    category: 'Pattern 3: Duplicates',
    title: 'Find Duplicate Department IDs in Employees',
    description: 'Find department IDs that have more than 3 employees assigned.',
    hint: 'GROUP BY dept_id HAVING COUNT(*) > 3.',
    starterSql: "SELECT dept_id, COUNT(*) AS emp_count\nFROM employees\nGROUP BY dept_id\nHAVING COUNT(*) > 3;",
    solutionSql: "SELECT dept_id, COUNT(*) AS emp_count\nFROM employees\nGROUP BY dept_id\nHAVING COUNT(*) > 3;"
  },
  {
    id: 'pat-3-2',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 3: Duplicates',
    title: 'Find Duplicate Customer Countries',
    description: 'Show countries that appear more than once in the customers table, along with the count of customers.',
    hint: 'GROUP BY country HAVING COUNT(*) > 1 ORDER BY COUNT(*) DESC.',
    starterSql: "SELECT country, COUNT(*) AS customer_count\nFROM customers\nGROUP BY country\nHAVING COUNT(*) > 1\nORDER BY customer_count DESC;",
    solutionSql: "SELECT country, COUNT(*) AS customer_count\nFROM customers\nGROUP BY country\nHAVING COUNT(*) > 1\nORDER BY customer_count DESC;"
  },
  {
    id: 'pat-3-3',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 3: Duplicates',
    title: 'Find Dates with Multiple Bank Transactions',
    description: 'Find all transaction dates where more than 1 transaction occurred on the same account.',
    hint: 'GROUP BY account_id, txn_date HAVING COUNT(*) > 1.',
    starterSql: "SELECT account_id, txn_date, COUNT(*) AS txn_count\nFROM transactions\nGROUP BY account_id, txn_date\nHAVING COUNT(*) > 1;",
    solutionSql: "SELECT account_id, txn_date, COUNT(*) AS txn_count\nFROM transactions\nGROUP BY account_id, txn_date\nHAVING COUNT(*) > 1;"
  },
  {
    id: 'pat-3-4',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 3: Duplicates',
    title: 'Deduplicate Records Keeping Lowest ID',
    description: 'Simulate deduplicating employees by hire_date keeping only the record with the minimum emp_id using ROW_NUMBER(). Show emp_id, first_name, and hire_date.',
    hint: 'ROW_NUMBER() OVER (PARTITION BY hire_date ORDER BY emp_id ASC) as rn WHERE rn = 1.',
    starterSql: "WITH Deduped AS (\n  SELECT emp_id, first_name, hire_date,\n    ROW_NUMBER() OVER (PARTITION BY hire_date ORDER BY emp_id ASC) AS rn\n  FROM employees\n)\nSELECT emp_id, first_name, hire_date\nFROM Deduped\nWHERE rn = 1\nORDER BY emp_id;",
    solutionSql: "WITH Deduped AS (\n  SELECT emp_id, first_name, hire_date,\n    ROW_NUMBER() OVER (PARTITION BY hire_date ORDER BY emp_id ASC) AS rn\n  FROM employees\n)\nSELECT emp_id, first_name, hire_date\nFROM Deduped\nWHERE rn = 1\nORDER BY emp_id;"
  },
  {
    id: 'pat-3-5',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 3: Duplicates',
    title: 'Find Customers Who Placed Multiple Orders',
    description: 'Identify customer IDs who have placed more than 1 order in the system, along with their order count.',
    hint: 'GROUP BY customer_id HAVING COUNT(*) > 1.',
    starterSql: "SELECT customer_id, COUNT(*) AS total_orders\nFROM orders\nGROUP BY customer_id\nHAVING COUNT(*) > 1\nORDER BY total_orders DESC;",
    solutionSql: "SELECT customer_id, COUNT(*) AS total_orders\nFROM orders\nGROUP BY customer_id\nHAVING COUNT(*) > 1\nORDER BY total_orders DESC;"
  },
  {
    id: 'pat-3-6',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 3: Duplicates',
    title: 'Find Duplicate Salaries within the Same Department',
    description: 'Find any salary amounts that are shared by two or more employees within the exact same department.',
    hint: 'GROUP BY dept_id, salary HAVING COUNT(*) > 1.',
    starterSql: "SELECT dept_id, salary, COUNT(*) AS employee_count\nFROM employees\nGROUP BY dept_id, salary\nHAVING COUNT(*) > 1;",
    solutionSql: "SELECT dept_id, salary, COUNT(*) AS employee_count\nFROM employees\nGROUP BY dept_id, salary\nHAVING COUNT(*) > 1;"
  },
  {
    id: 'pat-3-7',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 3: Duplicates',
    title: 'Identify Products Ordered in Multiple Distinct Orders',
    description: 'Find product_ids that appear in more than 1 order in the order_items table.',
    hint: 'GROUP BY product_id HAVING COUNT(DISTINCT order_id) > 1.',
    starterSql: "SELECT product_id, COUNT(DISTINCT order_id) AS distinct_orders\nFROM order_items\nGROUP BY product_id\nHAVING COUNT(DISTINCT order_id) > 1;",
    solutionSql: "SELECT product_id, COUNT(DISTINCT order_id) AS distinct_orders\nFROM order_items\nGROUP BY product_id\nHAVING COUNT(DISTINCT order_id) > 1;"
  },
  {
    id: 'pat-3-8',
    database: 'enterprise',
    difficulty: 'Easy',
    category: 'Pattern 3: Duplicates',
    title: 'Count Total Rows vs Distinct Customers',
    description: 'Compare the total count of order rows against the count of unique customers who placed orders.',
    hint: 'SELECT COUNT(*) AS total_order_rows, COUNT(DISTINCT customer_id) AS unique_ordering_customers FROM orders;',
    starterSql: "SELECT COUNT(*) AS total_order_rows, COUNT(DISTINCT customer_id) AS unique_ordering_customers\nFROM orders;",
    solutionSql: "SELECT COUNT(*) AS total_order_rows, COUNT(DISTINCT customer_id) AS unique_ordering_customers\nFROM orders;"
  },
  {
    id: 'pat-3-9',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 3: Duplicates',
    title: 'Find Non-Unique Login Dates Across Users',
    description: 'Find login_dates where 2 or more distinct users logged into the platform.',
    hint: 'GROUP BY login_date HAVING COUNT(DISTINCT user_id) >= 2 ORDER BY login_date;',
    starterSql: "SELECT login_date, COUNT(DISTINCT user_id) AS user_count\nFROM user_logins\nGROUP BY login_date\nHAVING COUNT(DISTINCT user_id) >= 2\nORDER BY login_date;",
    solutionSql: "SELECT login_date, COUNT(DISTINCT user_id) AS user_count\nFROM user_logins\nGROUP BY login_date\nHAVING COUNT(DISTINCT user_id) >= 2\nORDER BY login_date;"
  },
  {
    id: 'pat-3-10',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 3: Duplicates',
    title: 'Duplicate Email Verification Check',
    description: 'Write a validation query to ensure no duplicate email addresses exist in the employees table. Return emails with count > 1.',
    hint: 'SELECT email, COUNT(*) FROM employees GROUP BY email HAVING COUNT(*) > 1;',
    starterSql: "SELECT email, COUNT(*) AS email_count\nFROM employees\nGROUP BY email\nHAVING COUNT(*) > 1;",
    solutionSql: "SELECT email, COUNT(*) AS email_count\nFROM employees\nGROUP BY email\nHAVING COUNT(*) > 1;"
  },

  // =========================================================================
  // 🎯 PATTERN 4: FINDING WHAT'S MISSING / ANTI-JOINS (10 Questions)
  // =========================================================================
  {
    id: 'pat-4-1',
    database: 'enterprise',
    difficulty: 'Easy',
    category: "Pattern 4: Finding What's Missing",
    title: 'Customers Who Never Ordered (LEFT JOIN ... IS NULL)',
    description: 'Find all customers who have never placed any orders using a LEFT JOIN and IS NULL check. Show customer_id, customer_name, and country.',
    hint: 'LEFT JOIN orders ON c.customer_id = o.customer_id WHERE o.order_id IS NULL.',
    starterSql: "SELECT c.customer_id, c.customer_name, c.country\nFROM customers c\nLEFT JOIN orders o ON c.customer_id = o.customer_id\nWHERE o.order_id IS NULL;",
    solutionSql: "SELECT c.customer_id, c.customer_name, c.country\nFROM customers c\nLEFT JOIN orders o ON c.customer_id = o.customer_id\nWHERE o.order_id IS NULL;"
  },
  {
    id: 'pat-4-2',
    database: 'enterprise',
    difficulty: 'Medium',
    category: "Pattern 4: Finding What's Missing",
    title: 'Customers Who Never Ordered (NOT EXISTS)',
    description: 'Find all customers who have never placed an order using the NOT EXISTS clause.',
    hint: 'WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id).',
    starterSql: "SELECT c.customer_id, c.customer_name\nFROM customers c\nWHERE NOT EXISTS (\n  SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id\n);",
    solutionSql: "SELECT c.customer_id, c.customer_name\nFROM customers c\nWHERE NOT EXISTS (\n  SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id\n);"
  },
  {
    id: 'pat-4-3',
    database: 'enterprise',
    difficulty: 'Medium',
    category: "Pattern 4: Finding What's Missing",
    title: 'Customers Who Never Ordered (NOT IN)',
    description: 'Find all customers who have never placed an order using the NOT IN clause.',
    hint: 'WHERE customer_id NOT IN (SELECT DISTINCT customer_id FROM orders WHERE customer_id IS NOT NULL).',
    starterSql: "SELECT customer_id, customer_name\nFROM customers\nWHERE customer_id NOT IN (\n  SELECT DISTINCT customer_id FROM orders\n);",
    solutionSql: "SELECT customer_id, customer_name\nFROM customers\nWHERE customer_id NOT IN (\n  SELECT DISTINCT customer_id FROM orders\n);"
  },
  {
    id: 'pat-4-4',
    database: 'enterprise',
    difficulty: 'Easy',
    category: "Pattern 4: Finding What's Missing",
    title: 'Employees with No Manager',
    description: 'Find employees who do not report to any manager (manager_id is NULL).',
    hint: 'WHERE manager_id IS NULL.',
    starterSql: "SELECT emp_id, first_name, last_name, salary\nFROM employees\nWHERE manager_id IS NULL;",
    solutionSql: "SELECT emp_id, first_name, last_name, salary\nFROM employees\nWHERE manager_id IS NULL;"
  },
  {
    id: 'pat-4-5',
    database: 'enterprise',
    difficulty: 'Medium',
    category: "Pattern 4: Finding What's Missing",
    title: 'Products Never Purchased',
    description: 'Find product_id and product_name for all products that do not exist in the order_items table.',
    hint: 'LEFT JOIN order_items oi ON p.product_id = oi.product_id WHERE oi.order_id IS NULL.',
    starterSql: "SELECT p.product_id, p.product_name\nFROM products p\nLEFT JOIN order_items oi ON p.product_id = oi.product_id\nWHERE oi.order_id IS NULL;",
    solutionSql: "SELECT p.product_id, p.product_name\nFROM products p\nLEFT JOIN order_items oi ON p.product_id = oi.product_id\nWHERE oi.order_id IS NULL;"
  },
  {
    id: 'pat-4-6',
    database: 'enterprise',
    difficulty: 'Hard',
    category: "Pattern 4: Finding What's Missing",
    title: 'Managers with No Direct Reports',
    description: 'Find all employees who are NOT listed as a manager for any other employee in the company.',
    hint: 'WHERE emp_id NOT IN (SELECT DISTINCT manager_id FROM employees WHERE manager_id IS NOT NULL).',
    starterSql: "SELECT emp_id, first_name, last_name\nFROM employees\nWHERE emp_id NOT IN (\n  SELECT DISTINCT manager_id FROM employees WHERE manager_id IS NOT NULL\n);",
    solutionSql: "SELECT emp_id, first_name, last_name\nFROM employees\nWHERE emp_id NOT IN (\n  SELECT DISTINCT manager_id FROM employees WHERE manager_id IS NOT NULL\n);"
  },
  {
    id: 'pat-4-7',
    database: 'enterprise',
    difficulty: 'Medium',
    category: "Pattern 4: Finding What's Missing",
    title: 'Customers with No Completed Orders',
    description: "Find customers who either have no orders or only have 'Cancelled' orders (i.e. no Completed orders).",
    hint: "WHERE customer_id NOT IN (SELECT customer_id FROM orders WHERE status = 'Completed').",
    starterSql: "SELECT customer_id, customer_name\nFROM customers\nWHERE customer_id NOT IN (\n  SELECT DISTINCT customer_id FROM orders WHERE status = 'Completed'\n);",
    solutionSql: "SELECT customer_id, customer_name\nFROM customers\nWHERE customer_id NOT IN (\n  SELECT DISTINCT customer_id FROM orders WHERE status = 'Completed'\n);"
  },
  {
    id: 'pat-4-8',
    database: 'enterprise',
    difficulty: 'Hard',
    category: "Pattern 4: Finding What's Missing",
    title: 'Departments with No Employees Earning Over $200k',
    description: 'Find department names that do NOT have any employee earning more than $200,000.',
    hint: 'WHERE dept_id NOT IN (SELECT DISTINCT dept_id FROM employees WHERE salary > 200000).',
    starterSql: "SELECT dept_name\nFROM departments\nWHERE dept_id NOT IN (\n  SELECT DISTINCT dept_id FROM employees WHERE salary > 200000\n);",
    solutionSql: "SELECT dept_name\nFROM departments\nWHERE dept_id NOT IN (\n  SELECT DISTINCT dept_id FROM employees WHERE salary > 200000\n);"
  },
  {
    id: 'pat-4-9',
    database: 'enterprise',
    difficulty: 'Medium',
    category: "Pattern 4: Finding What's Missing",
    title: 'Bank Accounts with No Withdrawals',
    description: "Find all account IDs in transactions that have made deposits but NEVER made a 'Withdrawal'.",
    hint: "SELECT DISTINCT account_id FROM transactions WHERE txn_type = 'Deposit' EXCEPT SELECT DISTINCT account_id FROM transactions WHERE txn_type = 'Withdrawal';",
    starterSql: "SELECT DISTINCT account_id\nFROM transactions\nWHERE account_id NOT IN (\n  SELECT DISTINCT account_id FROM transactions WHERE txn_type = 'Withdrawal'\n);",
    solutionSql: "SELECT DISTINCT account_id\nFROM transactions\nWHERE account_id NOT IN (\n  SELECT DISTINCT account_id FROM transactions WHERE txn_type = 'Withdrawal'\n);"
  },
  {
    id: 'pat-4-10',
    database: 'enterprise',
    difficulty: 'Hard',
    category: "Pattern 4: Finding What's Missing",
    title: 'Available Theater Seats (Unbooked)',
    description: 'Find all seats in cinema_seats that are NOT booked (is_booked = 0). Show row_id and seat_number ordered by row and seat.',
    hint: 'WHERE is_booked = 0 ORDER BY row_id, seat_number.',
    starterSql: "SELECT row_id, seat_number\nFROM cinema_seats\nWHERE is_booked = 0\nORDER BY row_id, seat_number;",
    solutionSql: "SELECT row_id, seat_number\nFROM cinema_seats\nWHERE is_booked = 0\nORDER BY row_id, seat_number;"
  },

  // =========================================================================
  // 🎯 PATTERN 5: SELF JOINS (10 Questions)
  // =========================================================================
  {
    id: 'pat-5-1',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 5: Self Joins',
    title: 'Employees Earning More Than Their Manager',
    description: 'Find all employees who earn a higher salary than their direct manager. Show employee_name, employee_salary, manager_name, manager_salary.',
    hint: 'JOIN employees e with employees m ON e.manager_id = m.emp_id WHERE e.salary > m.salary.',
    starterSql: "SELECT e.first_name || ' ' || e.last_name AS employee_name, e.salary AS employee_salary,\n  m.first_name || ' ' || m.last_name AS manager_name, m.salary AS manager_salary\nFROM employees e\nJOIN employees m ON e.manager_id = m.emp_id\nWHERE e.salary > m.salary;",
    solutionSql: "SELECT e.first_name || ' ' || e.last_name AS employee_name, e.salary AS employee_salary,\n  m.first_name || ' ' || m.last_name AS manager_name, m.salary AS manager_salary\nFROM employees e\nJOIN employees m ON e.manager_id = m.emp_id\nWHERE e.salary > m.salary;"
  },
  {
    id: 'pat-5-2',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 5: Self Joins',
    title: 'Employees Hired Before Their Manager',
    description: 'Find employees who were hired before their direct manager (e.hire_date < m.hire_date). Show employee name, hire date, manager name, and manager hire date.',
    hint: 'JOIN employees e with employees m ON e.manager_id = m.emp_id WHERE e.hire_date < m.hire_date.',
    starterSql: "SELECT e.first_name AS employee, e.hire_date AS emp_hire,\n  m.first_name AS manager, m.hire_date AS mgr_hire\nFROM employees e\nJOIN employees m ON e.manager_id = m.emp_id\nWHERE e.hire_date < m.hire_date;",
    solutionSql: "SELECT e.first_name AS employee, e.hire_date AS emp_hire,\n  m.first_name AS manager, m.hire_date AS mgr_hire\nFROM employees e\nJOIN employees m ON e.manager_id = m.emp_id\nWHERE e.hire_date < m.hire_date;"
  },
  {
    id: 'pat-5-3',
    database: 'enterprise',
    difficulty: 'Easy',
    category: 'Pattern 5: Self Joins',
    title: 'Complete Employee-Manager Roster',
    description: "List every employee and their manager's full name. If an employee has no manager, display 'CEO / Executive' as manager_name.",
    hint: "LEFT JOIN employees m ON e.manager_id = m.emp_id, COALESCE(m.first_name || ' ' || m.last_name, 'CEO / Executive').",
    starterSql: "SELECT e.first_name || ' ' || e.last_name AS employee_name,\n  COALESCE(m.first_name || ' ' || m.last_name, 'CEO / Executive') AS manager_name\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.emp_id;",
    solutionSql: "SELECT e.first_name || ' ' || e.last_name AS employee_name,\n  COALESCE(m.first_name || ' ' || m.last_name, 'CEO / Executive') AS manager_name\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.emp_id;"
  },
  {
    id: 'pat-5-4',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 5: Self Joins',
    title: 'Peers in Same Department with Identical Hire Year',
    description: 'Find distinct pairs of different employees who work in the same department and were hired in the exact same year. Avoid duplicate pairs (e.g. use e1.emp_id < e2.emp_id).',
    hint: "ON e1.dept_id = e2.dept_id AND e1.emp_id < e2.emp_id AND SUBSTR(e1.hire_date, 1, 4) = SUBSTR(e2.hire_date, 1, 4).",
    starterSql: "SELECT e1.dept_id, e1.first_name AS emp1, e2.first_name AS emp2, SUBSTR(e1.hire_date, 1, 4) AS hire_year\nFROM employees e1\nJOIN employees e2 ON e1.dept_id = e2.dept_id\n  AND e1.emp_id < e2.emp_id\n  AND SUBSTR(e1.hire_date, 1, 4) = SUBSTR(e2.hire_date, 1, 4);",
    solutionSql: "SELECT e1.dept_id, e1.first_name AS emp1, e2.first_name AS emp2, SUBSTR(e1.hire_date, 1, 4) AS hire_year\nFROM employees e1\nJOIN employees e2 ON e1.dept_id = e2.dept_id\n  AND e1.emp_id < e2.emp_id\n  AND SUBSTR(e1.hire_date, 1, 4) = SUBSTR(e2.hire_date, 1, 4);"
  },
  {
    id: 'pat-5-5',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 5: Self Joins',
    title: 'Direct Report Count per Manager',
    description: 'For each manager, show their emp_id, name, and total count of direct reports who report to them.',
    hint: 'JOIN employees e ON m.emp_id = e.manager_id GROUP BY m.emp_id.',
    starterSql: "SELECT m.emp_id, m.first_name || ' ' || m.last_name AS manager_name,\n  COUNT(e.emp_id) AS direct_reports\nFROM employees m\nJOIN employees e ON m.emp_id = e.manager_id\nGROUP BY m.emp_id\nORDER BY direct_reports DESC;",
    solutionSql: "SELECT m.emp_id, m.first_name || ' ' || m.last_name AS manager_name,\n  COUNT(e.emp_id) AS direct_reports\nFROM employees m\nJOIN employees e ON m.emp_id = e.manager_id\nGROUP BY m.emp_id\nORDER BY direct_reports DESC;"
  },
  {
    id: 'pat-5-6',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 5: Self Joins',
    title: 'Products in Same Category with Price Difference <= $100',
    description: 'Find pairs of different products in the same category whose price difference is at most $100. Avoid duplicate mirror pairs (p1.product_id < p2.product_id).',
    hint: 'JOIN products p2 ON p1.category_id = p2.category_id AND p1.product_id < p2.product_id WHERE ABS(p1.price - p2.price) <= 100.',
    starterSql: "SELECT p1.product_name AS product1, p2.product_name AS product2, p1.price AS price1, p2.price AS price2,\n  ABS(p1.price - p2.price) AS price_diff\nFROM products p1\nJOIN products p2 ON p1.category_id = p2.category_id AND p1.product_id < p2.product_id\nWHERE ABS(p1.price - p2.price) <= 100;",
    solutionSql: "SELECT p1.product_name AS product1, p2.product_name AS product2, p1.price AS price1, p2.price AS price2,\n  ABS(p1.price - p2.price) AS price_diff\nFROM products p1\nJOIN products p2 ON p1.category_id = p2.category_id AND p1.product_id < p2.product_id\nWHERE ABS(p1.price - p2.price) <= 100;"
  },
  {
    id: 'pat-5-7',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 5: Self Joins',
    title: 'Customers Living in Same Country',
    description: 'Find all pairs of different customers who live in the same country. Use c1.customer_id < c2.customer_id to prevent duplicates.',
    hint: 'JOIN customers c2 ON c1.country = c2.country AND c1.customer_id < c2.customer_id.',
    starterSql: "SELECT c1.country, c1.customer_name AS customer_1, c2.customer_name AS customer_2\nFROM customers c1\nJOIN customers c2 ON c1.country = c2.country AND c1.customer_id < c2.customer_id\nORDER BY c1.country;",
    solutionSql: "SELECT c1.country, c1.customer_name AS customer_1, c2.customer_name AS customer_2\nFROM customers c1\nJOIN customers c2 ON c1.country = c2.country AND c1.customer_id < c2.customer_id\nORDER BY c1.country;"
  },
  {
    id: 'pat-5-8',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 5: Self Joins',
    title: 'Managers Managing More Than 2 People',
    description: 'Find managers whose team has more than 2 direct reports. Show manager name and team size.',
    hint: 'GROUP BY m.emp_id HAVING COUNT(e.emp_id) > 2.',
    starterSql: "SELECT m.first_name || ' ' || m.last_name AS manager_name, COUNT(e.emp_id) AS team_size\nFROM employees m\nJOIN employees e ON m.emp_id = e.manager_id\nGROUP BY m.emp_id\nHAVING COUNT(e.emp_id) > 2;",
    solutionSql: "SELECT m.first_name || ' ' || m.last_name AS manager_name, COUNT(e.emp_id) AS team_size\nFROM employees m\nJOIN employees e ON m.emp_id = e.manager_id\nGROUP BY m.emp_id\nHAVING COUNT(e.emp_id) > 2;"
  },
  {
    id: 'pat-5-9',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 5: Self Joins',
    title: 'Employee-to-Manager Salary Percentage',
    description: "Calculate what percentage of their manager's salary each employee earns, rounded to 1 decimal place.",
    hint: "ROUND(100.0 * e.salary / m.salary, 1) AS salary_pct_of_manager.",
    starterSql: "SELECT e.first_name AS employee, e.salary AS emp_salary,\n  m.first_name AS manager, m.salary AS mgr_salary,\n  ROUND(100.0 * e.salary / m.salary, 1) AS salary_pct_of_manager\nFROM employees e\nJOIN employees m ON e.manager_id = m.emp_id;",
    solutionSql: "SELECT e.first_name AS employee, e.salary AS emp_salary,\n  m.first_name AS manager, m.salary AS mgr_salary,\n  ROUND(100.0 * e.salary / m.salary, 1) AS salary_pct_of_manager\nFROM employees e\nJOIN employees m ON e.manager_id = m.emp_id;"
  },
  {
    id: 'pat-5-10',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 5: Self Joins',
    title: 'Find Second Level Managers (Grandbosses)',
    description: 'Find employee, their direct manager, and their grandboss (manager of their manager).',
    hint: 'JOIN employees m ON e.manager_id = m.emp_id LEFT JOIN employees gm ON m.manager_id = gm.emp_id.',
    starterSql: "SELECT e.first_name AS employee,\n  m.first_name AS direct_manager,\n  COALESCE(gm.first_name, 'None') AS grandboss\nFROM employees e\nJOIN employees m ON e.manager_id = m.emp_id\nLEFT JOIN employees gm ON m.manager_id = gm.emp_id;",
    solutionSql: "SELECT e.first_name AS employee,\n  m.first_name AS direct_manager,\n  COALESCE(gm.first_name, 'None') AS grandboss\nFROM employees e\nJOIN employees m ON e.manager_id = m.emp_id\nLEFT JOIN employees gm ON m.manager_id = gm.emp_id;"
  },

  // =========================================================================
  // 🎯 PATTERN 6: RUNNING TOTALS & MOVING AVERAGES (10 Questions)
  // =========================================================================
  {
    id: 'pat-6-1',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 6: Running Totals & Moving Averages',
    title: 'Cumulative Running Revenue by Date',
    description: 'Calculate the cumulative running total of daily website revenue ordered by metric_date.',
    hint: 'SUM(revenue) OVER (ORDER BY metric_date ASC) AS running_revenue.',
    starterSql: "SELECT metric_date, revenue,\n  SUM(revenue) OVER (ORDER BY metric_date ASC) AS running_revenue\nFROM daily_metrics\nORDER BY metric_date ASC;",
    solutionSql: "SELECT metric_date, revenue,\n  SUM(revenue) OVER (ORDER BY metric_date ASC) AS running_revenue\nFROM daily_metrics\nORDER BY metric_date ASC;"
  },
  {
    id: 'pat-6-2',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 6: Running Totals & Moving Averages',
    title: '3-Day Rolling Moving Average of Website Visits',
    description: 'Calculate a 3-day moving average of daily visits (including current day and previous 2 days), rounded to 1 decimal place.',
    hint: 'ROUND(AVG(visits) OVER (ORDER BY metric_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 1) AS moving_avg_visits.',
    starterSql: "SELECT metric_date, visits,\n  ROUND(AVG(visits) OVER (ORDER BY metric_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 1) AS moving_avg_visits\nFROM daily_metrics\nORDER BY metric_date;",
    solutionSql: "SELECT metric_date, visits,\n  ROUND(AVG(visits) OVER (ORDER BY metric_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 1) AS moving_avg_visits\nFROM daily_metrics\nORDER BY metric_date;"
  },
  {
    id: 'pat-6-3',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 6: Running Totals & Moving Averages',
    title: 'Bank Account Running Balance',
    description: 'Calculate the running balance for account_id 9001 ordered by txn_date and txn_id.',
    hint: 'SUM(amount) OVER (ORDER BY txn_date, txn_id) AS running_balance.',
    starterSql: "SELECT txn_id, txn_date, txn_type, amount,\n  SUM(amount) OVER (ORDER BY txn_date, txn_id) AS running_balance\nFROM transactions\nWHERE account_id = 9001\nORDER BY txn_date, txn_id;",
    solutionSql: "SELECT txn_id, txn_date, txn_type, amount,\n  SUM(amount) OVER (ORDER BY txn_date, txn_id) AS running_balance\nFROM transactions\nWHERE account_id = 9001\nORDER BY txn_date, txn_id;"
  },
  {
    id: 'pat-6-4',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 6: Running Totals & Moving Averages',
    title: 'Cumulative Department Payroll',
    description: 'Calculate the running cumulative salary total within each department, ordered by hire date.',
    hint: 'SUM(salary) OVER (PARTITION BY dept_id ORDER BY hire_date ASC) AS running_dept_payroll.',
    starterSql: "SELECT dept_id, first_name, hire_date, salary,\n  SUM(salary) OVER (PARTITION BY dept_id ORDER BY hire_date ASC) AS running_dept_payroll\nFROM employees\nORDER BY dept_id, hire_date ASC;",
    solutionSql: "SELECT dept_id, first_name, hire_date, salary,\n  SUM(salary) OVER (PARTITION BY dept_id ORDER BY hire_date ASC) AS running_dept_payroll\nFROM employees\nORDER BY dept_id, hire_date ASC;"
  },
  {
    id: 'pat-6-5',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 6: Running Totals & Moving Averages',
    title: '3-Day Rolling Sum of Checkouts',
    description: 'Calculate the 3-day rolling sum of checkouts (current day + 2 preceding days).',
    hint: 'SUM(checkouts) OVER (ORDER BY metric_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS rolling_3d_checkouts.',
    starterSql: "SELECT metric_date, checkouts,\n  SUM(checkouts) OVER (ORDER BY metric_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS rolling_3d_checkouts\nFROM daily_metrics\nORDER BY metric_date;",
    solutionSql: "SELECT metric_date, checkouts,\n  SUM(checkouts) OVER (ORDER BY metric_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS rolling_3d_checkouts\nFROM daily_metrics\nORDER BY metric_date;"
  },
  {
    id: 'pat-6-6',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 6: Running Totals & Moving Averages',
    title: 'Cumulative Order Count per Customer',
    description: 'For each order, show customer_id, order_id, order_date, and the cumulative count of orders placed by that customer up to that date.',
    hint: 'COUNT(*) OVER (PARTITION BY customer_id ORDER BY order_date ASC) AS cumulative_orders.',
    starterSql: "SELECT customer_id, order_id, order_date,\n  COUNT(*) OVER (PARTITION BY customer_id ORDER BY order_date ASC) AS cumulative_orders\nFROM orders\nORDER BY customer_id, order_date ASC;",
    solutionSql: "SELECT customer_id, order_id, order_date,\n  COUNT(*) OVER (PARTITION BY customer_id ORDER BY order_date ASC) AS cumulative_orders\nFROM orders\nORDER BY customer_id, order_date ASC;"
  },
  {
    id: 'pat-6-7',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 6: Running Totals & Moving Averages',
    title: '7-Day Rolling Revenue Window',
    description: 'Calculate a 7-day rolling average of revenue up to and including the current day, rounded to 2 decimal places.',
    hint: 'ROUND(AVG(revenue) OVER (ORDER BY metric_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW), 2) AS rolling_7d_avg_rev.',
    starterSql: "SELECT metric_date, revenue,\n  ROUND(AVG(revenue) OVER (ORDER BY metric_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW), 2) AS rolling_7d_avg_rev\nFROM daily_metrics\nORDER BY metric_date;",
    solutionSql: "SELECT metric_date, revenue,\n  ROUND(AVG(revenue) OVER (ORDER BY metric_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW), 2) AS rolling_7d_avg_rev\nFROM daily_metrics\nORDER BY metric_date;"
  },
  {
    id: 'pat-6-8',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 6: Running Totals & Moving Averages',
    title: 'Cumulative Spend per Customer over Time',
    description: 'Show customer_id, order_id, order_date, total_amount, and the running total amount spent by that customer across completed orders.',
    hint: "SUM(total_amount) OVER (PARTITION BY customer_id ORDER BY order_date ASC) AS running_spend WHERE status = 'Completed'.",
    starterSql: "SELECT customer_id, order_id, order_date, total_amount,\n  SUM(total_amount) OVER (PARTITION BY customer_id ORDER BY order_date ASC) AS running_spend\nFROM orders\nWHERE status = 'Completed'\nORDER BY customer_id, order_date ASC;",
    solutionSql: "SELECT customer_id, order_id, order_date, total_amount,\n  SUM(total_amount) OVER (PARTITION BY customer_id ORDER BY order_date ASC) AS running_spend\nFROM orders\nWHERE status = 'Completed'\nORDER BY customer_id, order_date ASC;"
  },
  {
    id: 'pat-6-9',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 6: Running Totals & Moving Averages',
    title: 'Centered 3-Day Moving Average',
    description: 'Compute a centered 3-day moving average of daily visits (1 day before, current day, 1 day after).',
    hint: 'ROUND(AVG(visits) OVER (ORDER BY metric_date ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING), 1) AS centered_avg.',
    starterSql: "SELECT metric_date, visits,\n  ROUND(AVG(visits) OVER (ORDER BY metric_date ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING), 1) AS centered_avg\nFROM daily_metrics\nORDER BY metric_date;",
    solutionSql: "SELECT metric_date, visits,\n  ROUND(AVG(visits) OVER (ORDER BY metric_date ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING), 1) AS centered_avg\nFROM daily_metrics\nORDER BY metric_date;"
  },
  {
    id: 'pat-6-10',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 6: Running Totals & Moving Averages',
    title: 'Running Total Percentage of Grand Total',
    description: 'Calculate the running revenue total as a percentage of the grand total company revenue across all recorded dates.',
    hint: 'ROUND(100.0 * SUM(revenue) OVER (ORDER BY metric_date) / SUM(revenue) OVER (), 2) AS pct_of_grand_total.',
    starterSql: "SELECT metric_date, revenue,\n  ROUND(100.0 * SUM(revenue) OVER (ORDER BY metric_date) / SUM(revenue) OVER (), 2) AS pct_of_grand_total\nFROM daily_metrics\nORDER BY metric_date;",
    solutionSql: "SELECT metric_date, revenue,\n  ROUND(100.0 * SUM(revenue) OVER (ORDER BY metric_date) / SUM(revenue) OVER (), 2) AS pct_of_grand_total\nFROM daily_metrics\nORDER BY metric_date;"
  },

  // =========================================================================
  // 🎯 PATTERN 7: COMPARING TO PREVIOUS OR NEXT ROW (LAG / LEAD) (10 Questions)
  // =========================================================================
  {
    id: 'pat-7-1',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 7: Comparing to Previous/Next Row',
    title: 'Day-over-Day Revenue Change (LAG)',
    description: 'Calculate the absolute change in daily revenue compared to the previous day using LAG().',
    hint: 'revenue - LAG(revenue) OVER (ORDER BY metric_date) AS dod_revenue_change.',
    starterSql: "SELECT metric_date, revenue,\n  revenue - LAG(revenue) OVER (ORDER BY metric_date) AS dod_revenue_change\nFROM daily_metrics\nORDER BY metric_date;",
    solutionSql: "SELECT metric_date, revenue,\n  revenue - LAG(revenue) OVER (ORDER BY metric_date) AS dod_revenue_change\nFROM daily_metrics\nORDER BY metric_date;"
  },
  {
    id: 'pat-7-2',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 7: Comparing to Previous/Next Row',
    title: 'Daily Percentage Revenue Growth Rate',
    description: 'Calculate daily percentage growth rate in revenue: ((revenue - prev_revenue) / prev_revenue) * 100, rounded to 2 decimals.',
    hint: 'ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY metric_date)) / LAG(revenue) OVER (ORDER BY metric_date), 2) AS growth_pct.',
    starterSql: "SELECT metric_date, revenue,\n  ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY metric_date)) / LAG(revenue) OVER (ORDER BY metric_date), 2) AS growth_pct\nFROM daily_metrics\nORDER BY metric_date;",
    solutionSql: "SELECT metric_date, revenue,\n  ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY metric_date)) / LAG(revenue) OVER (ORDER BY metric_date), 2) AS growth_pct\nFROM daily_metrics\nORDER BY metric_date;"
  },
  {
    id: 'pat-7-3',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 7: Comparing to Previous/Next Row',
    title: 'Salary Gap to Next Higher Paid Peer (LEAD)',
    description: 'For each employee, calculate the salary difference to the next higher paid colleague in their department using LEAD().',
    hint: 'LEAD(salary) OVER (PARTITION BY dept_id ORDER BY salary ASC) - salary AS salary_gap.',
    starterSql: "SELECT dept_id, first_name, salary,\n  LEAD(salary) OVER (PARTITION BY dept_id ORDER BY salary ASC) - salary AS salary_gap\nFROM employees\nORDER BY dept_id, salary ASC;",
    solutionSql: "SELECT dept_id, first_name, salary,\n  LEAD(salary) OVER (PARTITION BY dept_id ORDER BY salary ASC) - salary AS salary_gap\nFROM employees\nORDER BY dept_id, salary ASC;"
  },
  {
    id: 'pat-7-4',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 7: Comparing to Previous/Next Row',
    title: 'Days Between Consecutive Customer Orders',
    description: 'Calculate the number of days between each order and the previous order placed by the same customer.',
    hint: 'CAST(julianday(order_date) - julianday(LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date)) AS INT) AS days_since_last_order.',
    starterSql: "SELECT customer_id, order_id, order_date,\n  CAST(julianday(order_date) - julianday(LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date)) AS INT) AS days_since_last_order\nFROM orders\nORDER BY customer_id, order_date;",
    solutionSql: "SELECT customer_id, order_id, order_date,\n  CAST(julianday(order_date) - julianday(LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date)) AS INT) AS days_since_last_order\nFROM orders\nORDER BY customer_id, order_date;"
  },
  {
    id: 'pat-7-5',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 7: Comparing to Previous/Next Row',
    title: 'Day-over-Day Visits Change',
    description: 'Calculate the difference in website visits between the current day and the previous day.',
    hint: 'visits - LAG(visits) OVER (ORDER BY metric_date) AS dod_visit_diff.',
    starterSql: "SELECT metric_date, visits,\n  visits - LAG(visits) OVER (ORDER BY metric_date) AS dod_visit_diff\nFROM daily_metrics\nORDER BY metric_date;",
    solutionSql: "SELECT metric_date, visits,\n  visits - LAG(visits) OVER (ORDER BY metric_date) AS dod_visit_diff\nFROM daily_metrics\nORDER BY metric_date;"
  },
  {
    id: 'pat-7-6',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 7: Comparing to Previous/Next Row',
    title: 'Flag Days with Revenue Drop',
    description: "Display metric_date, revenue, and flag days where revenue decreased compared to the previous day as 'Dropped', otherwise 'Increased/Same'.",
    hint: "CASE WHEN revenue < LAG(revenue) OVER (ORDER BY metric_date) THEN 'Dropped' ELSE 'Increased/Same' END AS trend.",
    starterSql: "SELECT metric_date, revenue,\n  CASE\n    WHEN revenue < LAG(revenue) OVER (ORDER BY metric_date) THEN 'Dropped'\n    ELSE 'Increased/Same'\n  END AS trend\nFROM daily_metrics\nORDER BY metric_date;",
    solutionSql: "SELECT metric_date, revenue,\n  CASE\n    WHEN revenue < LAG(revenue) OVER (ORDER BY metric_date) THEN 'Dropped'\n    ELSE 'Increased/Same'\n  END AS trend\nFROM daily_metrics\nORDER BY metric_date;"
  },
  {
    id: 'pat-7-7',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 7: Comparing to Previous/Next Row',
    title: 'Previous and Next Login Dates for User',
    description: 'For each login of user_id = 1, display the current login_date, the previous login_date (LAG), and the upcoming login_date (LEAD).',
    hint: 'LAG(login_date) OVER (ORDER BY login_date) as prev_login, LEAD(login_date) OVER (ORDER BY login_date) as next_login.',
    starterSql: "SELECT user_id, login_date,\n  LAG(login_date) OVER (ORDER BY login_date) AS prev_login,\n  LEAD(login_date) OVER (ORDER BY login_date) AS next_login\nFROM user_logins\nWHERE user_id = 1\nORDER BY login_date;",
    solutionSql: "SELECT user_id, login_date,\n  LAG(login_date) OVER (ORDER BY login_date) AS prev_login,\n  LEAD(login_date) OVER (ORDER BY login_date) AS next_login\nFROM user_logins\nWHERE user_id = 1\nORDER BY login_date;"
  },
  {
    id: 'pat-7-8',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 7: Comparing to Previous/Next Row',
    title: 'Next Transaction Amount on Bank Account',
    description: 'For each transaction on account 9001, display amount and the upcoming next transaction amount using LEAD().',
    hint: 'LEAD(amount) OVER (ORDER BY txn_date, txn_id) AS next_amount.',
    starterSql: "SELECT txn_id, txn_date, txn_type, amount,\n  LEAD(amount) OVER (ORDER BY txn_date, txn_id) AS next_amount\nFROM transactions\nWHERE account_id = 9001\nORDER BY txn_date, txn_id;",
    solutionSql: "SELECT txn_id, txn_date, txn_type, amount,\n  LEAD(amount) OVER (ORDER BY txn_date, txn_id) AS next_amount\nFROM transactions\nWHERE account_id = 9001\nORDER BY txn_date, txn_id;"
  },
  {
    id: 'pat-7-9',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 7: Comparing to Previous/Next Row',
    title: 'Identify Hire Date Distance to Next Employee',
    description: 'Find how many days after an employee was hired the next employee in the same department was hired.',
    hint: 'CAST(julianday(LEAD(hire_date) OVER (PARTITION BY dept_id ORDER BY hire_date ASC)) - julianday(hire_date) AS INT) AS days_until_next_hire.',
    starterSql: "SELECT dept_id, first_name, hire_date,\n  CAST(julianday(LEAD(hire_date) OVER (PARTITION BY dept_id ORDER BY hire_date ASC)) - julianday(hire_date) AS INT) AS days_until_next_hire\nFROM employees\nORDER BY dept_id, hire_date ASC;",
    solutionSql: "SELECT dept_id, first_name, hire_date,\n  CAST(julianday(LEAD(hire_date) OVER (PARTITION BY dept_id ORDER BY hire_date ASC)) - julianday(hire_date) AS INT) AS days_until_next_hire\nFROM employees\nORDER BY dept_id, hire_date ASC;"
  },
  {
    id: 'pat-7-10',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 7: Comparing to Previous/Next Row',
    title: 'Consecutive Days Signups Increase',
    description: 'Find all dates where website signups were strictly higher than both the previous day (LAG) and the next day (LEAD).',
    hint: 'signups > LAG(signups) OVER (ORDER BY metric_date) AND signups > LEAD(signups) OVER (ORDER BY metric_date).',
    starterSql: "WITH Spikes AS (\n  SELECT metric_date, signups,\n    LAG(signups) OVER (ORDER BY metric_date) AS prev_s,\n    LEAD(signups) OVER (ORDER BY metric_date) AS next_s\n  FROM daily_metrics\n)\nSELECT metric_date, signups\nFROM Spikes\nWHERE signups > prev_s AND signups > next_s;",
    solutionSql: "WITH Spikes AS (\n  SELECT metric_date, signups,\n    LAG(signups) OVER (ORDER BY metric_date) AS prev_s,\n    LEAD(signups) OVER (ORDER BY metric_date) AS next_s\n  FROM daily_metrics\n)\nSELECT metric_date, signups\nFROM Spikes\nWHERE signups > prev_s AND signups > next_s;"
  },

  // =========================================================================
  // 🎯 PATTERN 8: CONSECUTIVE SEQUENCES & GAPS-AND-ISLANDS (10 Questions)
  // =========================================================================
  {
    id: 'pat-8-1',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 8: Consecutive Sequences',
    title: 'Users with 3 Consecutive Days Login',
    description: 'Find all user_ids who logged in for at least 3 consecutive days using LEAD() or date offsets.',
    hint: "Use LEAD(login_date, 1) and LEAD(login_date, 2) to check if date + 1 and date + 2 match consecutive days.",
    starterSql: "WITH Consecutive AS (\n  SELECT user_id, login_date,\n    LEAD(login_date, 1) OVER (PARTITION BY user_id ORDER BY login_date) AS d1,\n    LEAD(login_date, 2) OVER (PARTITION BY user_id ORDER BY login_date) AS d2\n  FROM user_logins\n)\nSELECT DISTINCT user_id\nFROM Consecutive\nWHERE CAST(julianday(d1) - julianday(login_date) AS INT) = 1\n  AND CAST(julianday(d2) - julianday(login_date) AS INT) = 2;",
    solutionSql: "WITH Consecutive AS (\n  SELECT user_id, login_date,\n    LEAD(login_date, 1) OVER (PARTITION BY user_id ORDER BY login_date) AS d1,\n    LEAD(login_date, 2) OVER (PARTITION BY user_id ORDER BY login_date) AS d2\n  FROM user_logins\n)\nSELECT DISTINCT user_id\nFROM Consecutive\nWHERE CAST(julianday(d1) - julianday(login_date) AS INT) = 1\n  AND CAST(julianday(d2) - julianday(login_date) AS INT) = 2;"
  },
  {
    id: 'pat-8-2',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 8: Consecutive Sequences',
    title: 'Find 3 Consecutive Free Cinema Seats',
    description: 'Find all sets of 3 consecutive free seats (is_booked = 0) in the same row. Show row_id, seat1, seat2, and seat3.',
    hint: 's1.seat_number + 1 = s2.seat_number AND s2.seat_number + 1 = s3.seat_number all with is_booked = 0 in same row.',
    starterSql: "SELECT s1.row_id, s1.seat_number AS seat_1, s2.seat_number AS seat_2, s3.seat_number AS seat_3\nFROM cinema_seats s1\nJOIN cinema_seats s2 ON s1.row_id = s2.row_id AND s1.seat_number + 1 = s2.seat_number\nJOIN cinema_seats s3 ON s1.row_id = s3.row_id AND s2.seat_number + 1 = s3.seat_number\nWHERE s1.is_booked = 0 AND s2.is_booked = 0 AND s3.is_booked = 0;",
    solutionSql: "SELECT s1.row_id, s1.seat_number AS seat_1, s2.seat_number AS seat_2, s3.seat_number AS seat_3\nFROM cinema_seats s1\nJOIN cinema_seats s2 ON s1.row_id = s2.row_id AND s1.seat_number + 1 = s2.seat_number\nJOIN cinema_seats s3 ON s1.row_id = s3.row_id AND s2.seat_number + 1 = s3.seat_number\nWHERE s1.is_booked = 0 AND s2.is_booked = 0 AND s3.is_booked = 0;"
  },
  {
    id: 'pat-8-3',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 8: Consecutive Sequences',
    title: 'Gaps & Islands: Login Streak Start and End Dates',
    description: 'Find the start_date, end_date, and streak_length for each continuous login streak of user_id = 2 using the classic date minus row_number trick.',
    hint: 'date(login_date, -row_number() over (order by login_date) || " days") creates the island grouping key!',
    starterSql: "WITH Islands AS (\n  SELECT user_id, login_date,\n    date(login_date, '-' || ROW_NUMBER() OVER (ORDER BY login_date) || ' day') AS grp\n  FROM user_logins\n  WHERE user_id = 2\n)\nSELECT user_id, MIN(login_date) AS streak_start, MAX(login_date) AS streak_end, COUNT(*) AS streak_length\nFROM Islands\nGROUP BY user_id, grp\nORDER BY streak_start;",
    solutionSql: "WITH Islands AS (\n  SELECT user_id, login_date,\n    date(login_date, '-' || ROW_NUMBER() OVER (ORDER BY login_date) || ' day') AS grp\n  FROM user_logins\n  WHERE user_id = 2\n)\nSELECT user_id, MIN(login_date) AS streak_start, MAX(login_date) AS streak_end, COUNT(*) AS streak_length\nFROM Islands\nGROUP BY user_id, grp\nORDER BY streak_start;"
  },
  {
    id: 'pat-8-4',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 8: Consecutive Sequences',
    title: 'Longest Consecutive Login Streak per User',
    description: 'Find the maximum consecutive login streak length (in days) achieved by each user.',
    hint: 'Group by user_id and island group, then calculate MAX(streak_length) per user_id.',
    starterSql: "WITH Islands AS (\n  SELECT user_id, login_date,\n    date(login_date, '-' || ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) || ' day') AS grp\n  FROM user_logins\n),\nStreaks AS (\n  SELECT user_id, grp, COUNT(*) AS streak_len\n  FROM Islands\n  GROUP BY user_id, grp\n)\nSELECT user_id, MAX(streak_len) AS max_consecutive_days\nFROM Streaks\nGROUP BY user_id\nORDER BY user_id;",
    solutionSql: "WITH Islands AS (\n  SELECT user_id, login_date,\n    date(login_date, '-' || ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) || ' day') AS grp\n  FROM user_logins\n),\nStreaks AS (\n  SELECT user_id, grp, COUNT(*) AS streak_len\n  FROM Islands\n  GROUP BY user_id, grp\n)\nSELECT user_id, MAX(streak_len) AS max_consecutive_days\nFROM Streaks\nGROUP BY user_id\nORDER BY user_id;"
  },
  {
    id: 'pat-8-5',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 8: Consecutive Sequences',
    title: 'Consecutive Pair of Free Cinema Seats',
    description: 'Find all pairs of 2 adjacent free cinema seats in any row. Show row_id, seat1, and seat2.',
    hint: 's1.row_id = s2.row_id AND s1.seat_number + 1 = s2.seat_number with both is_booked = 0.',
    starterSql: "SELECT s1.row_id, s1.seat_number AS seat_1, s2.seat_number AS seat_2\nFROM cinema_seats s1\nJOIN cinema_seats s2 ON s1.row_id = s2.row_id AND s1.seat_number + 1 = s2.seat_number\nWHERE s1.is_booked = 0 AND s2.is_booked = 0\nORDER BY s1.row_id, seat_1;",
    solutionSql: "SELECT s1.row_id, s1.seat_number AS seat_1, s2.seat_number AS seat_2\nFROM cinema_seats s1\nJOIN cinema_seats s2 ON s1.row_id = s2.row_id AND s1.seat_number + 1 = s2.seat_number\nWHERE s1.is_booked = 0 AND s2.is_booked = 0\nORDER BY s1.row_id, seat_1;"
  },
  {
    id: 'pat-8-6',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 8: Consecutive Sequences',
    title: 'Find Sequence Gaps in Order IDs',
    description: 'Identify if any order_id is missing between MIN(order_id) and MAX(order_id) for completed orders.',
    hint: 'Compare LEAD(order_id) - order_id > 1 in a CTE to detect a jump.',
    starterSql: "WITH NextOrders AS (\n  SELECT order_id AS gap_starts_after, LEAD(order_id) OVER (ORDER BY order_id) AS next_id\n  FROM orders\n)\nSELECT gap_starts_after, next_id\nFROM NextOrders\nWHERE next_id - gap_starts_after > 1;",
    solutionSql: "WITH NextOrders AS (\n  SELECT order_id AS gap_starts_after, LEAD(order_id) OVER (ORDER BY order_id) AS next_id\n  FROM orders\n)\nSELECT gap_starts_after, next_id\nFROM NextOrders\nWHERE next_id - gap_starts_after > 1;"
  },
  {
    id: 'pat-8-7',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 8: Consecutive Sequences',
    title: 'Consecutive Days with Revenue >= 5000',
    description: 'Find consecutive dates where revenue was at least $5,000 for at least 2 days in a row.',
    hint: 'Check revenue >= 5000 and LEAD(revenue) >= 5000 in a CTE.',
    starterSql: "WITH NextMetrics AS (\n  SELECT metric_date AS start_date, revenue AS start_revenue,\n    LEAD(revenue) OVER (ORDER BY metric_date) AS next_revenue\n  FROM daily_metrics\n  WHERE revenue >= 5000\n)\nSELECT start_date, start_revenue\nFROM NextMetrics\nWHERE next_revenue >= 5000;",
    solutionSql: "WITH NextMetrics AS (\n  SELECT metric_date AS start_date, revenue AS start_revenue,\n    LEAD(revenue) OVER (ORDER BY metric_date) AS next_revenue\n  FROM daily_metrics\n  WHERE revenue >= 5000\n)\nSELECT start_date, start_revenue\nFROM NextMetrics\nWHERE next_revenue >= 5000;"
  },
  {
    id: 'pat-8-8',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 8: Consecutive Sequences',
    title: 'Active Login Days Count per Island',
    description: 'For all users, calculate the count of distinct login islands and their sizes.',
    hint: 'Use the row_number date offset trick on user_logins.',
    starterSql: "WITH Islands AS (\n  SELECT user_id, login_date,\n    date(login_date, '-' || ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) || ' day') AS island_key\n  FROM user_logins\n)\nSELECT user_id, island_key, COUNT(*) AS streak_days\nFROM Islands\nGROUP BY user_id, island_key\nORDER BY user_id, island_key;",
    solutionSql: "WITH Islands AS (\n  SELECT user_id, login_date,\n    date(login_date, '-' || ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) || ' day') AS island_key\n  FROM user_logins\n)\nSELECT user_id, island_key, COUNT(*) AS streak_days\nFROM Islands\nGROUP BY user_id, island_key\nORDER BY user_id, island_key;"
  },
  {
    id: 'pat-8-9',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 8: Consecutive Sequences',
    title: '3 Consecutive Days of Rising Visits',
    description: 'Find dates where website visits increased 2 days in a row: visits > prev_visits AND prev_visits > prev_prev_visits.',
    hint: 'Use LAG(visits, 1) and LAG(visits, 2) to evaluate.',
    starterSql: "WITH Rising AS (\n  SELECT metric_date, visits,\n    LAG(visits, 1) OVER (ORDER BY metric_date) AS v1,\n    LAG(visits, 2) OVER (ORDER BY metric_date) AS v2\n  FROM daily_metrics\n)\nSELECT metric_date, visits\nFROM Rising\nWHERE visits > v1 AND v1 > v2;",
    solutionSql: "WITH Rising AS (\n  SELECT metric_date, visits,\n    LAG(visits, 1) OVER (ORDER BY metric_date) AS v1,\n    LAG(visits, 2) OVER (ORDER BY metric_date) AS v2\n  FROM daily_metrics\n)\nSELECT metric_date, visits\nFROM Rising\nWHERE visits > v1 AND v1 > v2;"
  },
  {
    id: 'pat-8-10',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 8: Consecutive Sequences',
    title: 'Consecutive Free Seats Island Length per Row',
    description: 'For each row in cinema_seats, find the maximum consecutive number of free seats.',
    hint: 'Use seat_number - row_number() over (partition by row_id order by seat_number) where is_booked = 0.',
    starterSql: "WITH FreeIslands AS (\n  SELECT row_id, seat_number,\n    seat_number - ROW_NUMBER() OVER (PARTITION BY row_id ORDER BY seat_number) AS grp\n  FROM cinema_seats\n  WHERE is_booked = 0\n),\nLengths AS (\n  SELECT row_id, grp, COUNT(*) AS consecutive_free\n  FROM FreeIslands\n  GROUP BY row_id, grp\n)\nSELECT row_id, MAX(consecutive_free) AS max_consecutive_free_seats\nFROM Lengths\nGROUP BY row_id;",
    solutionSql: "WITH FreeIslands AS (\n  SELECT row_id, seat_number,\n    seat_number - ROW_NUMBER() OVER (PARTITION BY row_id ORDER BY seat_number) AS grp\n  FROM cinema_seats\n  WHERE is_booked = 0\n),\nLengths AS (\n  SELECT row_id, grp, COUNT(*) AS consecutive_free\n  FROM FreeIslands\n  GROUP BY row_id, grp\n)\nSELECT row_id, MAX(consecutive_free) AS max_consecutive_free_seats\nFROM Lengths\nGROUP BY row_id;"
  },

  // =========================================================================
  // 🎯 PATTERN 9: AGGREGATION WITH FILTERS (CASE WHEN inside SUM/COUNT) (10 Questions)
  // =========================================================================
  {
    id: 'pat-9-1',
    database: 'enterprise',
    difficulty: 'Easy',
    category: 'Pattern 9: Aggregation with Filters',
    title: 'Completed vs Cancelled Orders in One Row',
    description: 'Count the total number of Completed orders and Cancelled orders in a single output row.',
    hint: "COUNT(CASE WHEN status = 'Completed' THEN 1 END) AS completed_orders, etc.",
    starterSql: "SELECT\n  COUNT(CASE WHEN status = 'Completed' THEN 1 END) AS completed_orders,\n  COUNT(CASE WHEN status = 'Cancelled' THEN 1 END) AS cancelled_orders\nFROM orders;",
    solutionSql: "SELECT\n  COUNT(CASE WHEN status = 'Completed' THEN 1 END) AS completed_orders,\n  COUNT(CASE WHEN status = 'Cancelled' THEN 1 END) AS cancelled_orders\nFROM orders;"
  },
  {
    id: 'pat-9-2',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 9: Aggregation with Filters',
    title: 'Completed Revenue vs Lost Cancelled Revenue',
    description: 'Calculate the total dollar revenue from Completed orders and the total lost revenue from Cancelled orders.',
    hint: "SUM(CASE WHEN status = 'Completed' THEN total_amount ELSE 0 END) AS completed_revenue, etc.",
    starterSql: "SELECT\n  SUM(CASE WHEN status = 'Completed' THEN total_amount ELSE 0 END) AS completed_revenue,\n  SUM(CASE WHEN status = 'Cancelled' THEN total_amount ELSE 0 END) AS lost_cancelled_revenue\nFROM orders;",
    solutionSql: "SELECT\n  SUM(CASE WHEN status = 'Completed' THEN total_amount ELSE 0 END) AS completed_revenue,\n  SUM(CASE WHEN status = 'Cancelled' THEN total_amount ELSE 0 END) AS lost_cancelled_revenue\nFROM orders;"
  },
  {
    id: 'pat-9-3',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 9: Aggregation with Filters',
    title: 'High vs Standard Earners per Department',
    description: 'For each department, count how many employees earn >= $250,000 (high_earners) and how many earn < $250,000 (standard_earners).',
    hint: 'COUNT(CASE WHEN salary >= 250000 THEN 1 END) AS high_earners GROUP BY dept_id.',
    starterSql: "SELECT dept_id,\n  COUNT(CASE WHEN salary >= 250000 THEN 1 END) AS high_earners,\n  COUNT(CASE WHEN salary < 250000 THEN 1 END) AS standard_earners\nFROM employees\nGROUP BY dept_id;",
    solutionSql: "SELECT dept_id,\n  COUNT(CASE WHEN salary >= 250000 THEN 1 END) AS high_earners,\n  COUNT(CASE WHEN salary < 250000 THEN 1 END) AS standard_earners\nFROM employees\nGROUP BY dept_id;"
  },
  {
    id: 'pat-9-4',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 9: Aggregation with Filters',
    title: 'Total Deposits and Total Withdrawals per Account',
    description: 'For each bank account, show account_id, total deposit amount (sum of positive deposits), and total withdrawal amount (sum of negative amounts).',
    hint: "SUM(CASE WHEN txn_type = 'Deposit' THEN amount ELSE 0 END) AS total_deposits, etc.",
    starterSql: "SELECT account_id,\n  SUM(CASE WHEN txn_type = 'Deposit' THEN amount ELSE 0 END) AS total_deposits,\n  SUM(CASE WHEN txn_type = 'Withdrawal' THEN amount ELSE 0 END) AS total_withdrawals\nFROM transactions\nGROUP BY account_id;",
    solutionSql: "SELECT account_id,\n  SUM(CASE WHEN txn_type = 'Deposit' THEN amount ELSE 0 END) AS total_deposits,\n  SUM(CASE WHEN txn_type = 'Withdrawal' THEN amount ELSE 0 END) AS total_withdrawals\nFROM transactions\nGROUP BY account_id;"
  },
  {
    id: 'pat-9-5',
    database: 'enterprise',
    difficulty: 'Easy',
    category: 'Pattern 9: Aggregation with Filters',
    title: 'Free vs Booked Theater Seats Count',
    description: 'In cinema_seats, count the total number of free seats (is_booked = 0) and booked seats (is_booked = 1) per row.',
    hint: 'SUM(CASE WHEN is_booked = 0 THEN 1 ELSE 0 END) AS free_seats, etc. GROUP BY row_id.',
    starterSql: "SELECT row_id,\n  SUM(CASE WHEN is_booked = 0 THEN 1 ELSE 0 END) AS free_seats,\n  SUM(CASE WHEN is_booked = 1 THEN 1 ELSE 0 END) AS booked_seats\nFROM cinema_seats\nGROUP BY row_id;",
    solutionSql: "SELECT row_id,\n  SUM(CASE WHEN is_booked = 0 THEN 1 ELSE 0 END) AS free_seats,\n  SUM(CASE WHEN is_booked = 1 THEN 1 ELSE 0 END) AS booked_seats\nFROM cinema_seats\nGROUP BY row_id;"
  },
  {
    id: 'pat-9-6',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 9: Aggregation with Filters',
    title: 'Net Bank Balance from Aggregation',
    description: 'Calculate the net account balance for each bank account using conditional SUM of deposits plus withdrawals.',
    hint: 'SUM(amount) AS net_balance GROUP BY account_id.',
    starterSql: "SELECT account_id, SUM(amount) AS net_balance\nFROM transactions\nGROUP BY account_id;",
    solutionSql: "SELECT account_id, SUM(amount) AS net_balance\nFROM transactions\nGROUP BY account_id;"
  },
  {
    id: 'pat-9-7',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 9: Aggregation with Filters',
    title: 'High-Value Orders Breakdown per Customer',
    description: 'For each customer, count orders >= $2000 as high_value_orders and orders < $2000 as standard_orders.',
    hint: 'COUNT(CASE WHEN total_amount >= 2000 THEN 1 END) AS high_value_orders GROUP BY customer_id.',
    starterSql: "SELECT customer_id,\n  COUNT(CASE WHEN total_amount >= 2000 THEN 1 END) AS high_value_orders,\n  COUNT(CASE WHEN total_amount < 2000 THEN 1 END) AS standard_orders\nFROM orders\nGROUP BY customer_id;",
    solutionSql: "SELECT customer_id,\n  COUNT(CASE WHEN total_amount >= 2000 THEN 1 END) AS high_value_orders,\n  COUNT(CASE WHEN total_amount < 2000 THEN 1 END) AS standard_orders\nFROM orders\nGROUP BY customer_id;"
  },
  {
    id: 'pat-9-8',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 9: Aggregation with Filters',
    title: 'Category Product Counts by Price Tier',
    description: 'For each category, count how many products cost > $2000 (premium) vs <= $2000 (budget).',
    hint: 'COUNT(CASE WHEN price > 2000 THEN 1 END) AS premium_count, etc. GROUP BY category_id.',
    starterSql: "SELECT category_id,\n  COUNT(CASE WHEN price > 2000 THEN 1 END) AS premium_count,\n  COUNT(CASE WHEN price <= 2000 THEN 1 END) AS budget_count\nFROM products\nGROUP BY category_id;",
    solutionSql: "SELECT category_id,\n  COUNT(CASE WHEN price > 2000 THEN 1 END) AS premium_count,\n  COUNT(CASE WHEN price <= 2000 THEN 1 END) AS budget_count\nFROM products\nGROUP BY category_id;"
  },
  {
    id: 'pat-9-9',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 9: Aggregation with Filters',
    title: 'Early vs Late Month Revenue',
    description: 'For the recorded dates, calculate total revenue from the first 4 days (dates <= 2023-09-04) vs later days (dates > 2023-09-04).',
    hint: "SUM(CASE WHEN metric_date <= '2023-09-04' THEN revenue ELSE 0 END) AS early_month_rev.",
    starterSql: "SELECT\n  SUM(CASE WHEN metric_date <= '2023-09-04' THEN revenue ELSE 0 END) AS early_month_rev,\n  SUM(CASE WHEN metric_date > '2023-09-04' THEN revenue ELSE 0 END) AS late_month_rev\nFROM daily_metrics;",
    solutionSql: "SELECT\n  SUM(CASE WHEN metric_date <= '2023-09-04' THEN revenue ELSE 0 END) AS early_month_rev,\n  SUM(CASE WHEN metric_date > '2023-09-04' THEN revenue ELSE 0 END) AS late_month_rev\nFROM daily_metrics;"
  },
  {
    id: 'pat-9-10',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 9: Aggregation with Filters',
    title: 'Customer Order Success Ratio in Group By',
    description: 'Calculate the completed orders and total orders per customer, and the completion success rate rounded to 1 decimal place.',
    hint: "ROUND(100.0 * COUNT(CASE WHEN status = 'Completed' THEN 1 END) / COUNT(*), 1) AS success_rate_pct.",
    starterSql: "SELECT customer_id, COUNT(*) AS total_orders,\n  COUNT(CASE WHEN status = 'Completed' THEN 1 END) AS completed_orders,\n  ROUND(100.0 * COUNT(CASE WHEN status = 'Completed' THEN 1 END) / COUNT(*), 1) AS success_rate_pct\nFROM orders\nGROUP BY customer_id;",
    solutionSql: "SELECT customer_id, COUNT(*) AS total_orders,\n  COUNT(CASE WHEN status = 'Completed' THEN 1 END) AS completed_orders,\n  ROUND(100.0 * COUNT(CASE WHEN status = 'Completed' THEN 1 END) / COUNT(*), 1) AS success_rate_pct\nFROM orders\nGROUP BY customer_id;"
  },

  // =========================================================================
  // 🎯 PATTERN 10: GROUP FILTERING (HAVING) (10 Questions)
  // =========================================================================
  {
    id: 'pat-10-1',
    database: 'enterprise',
    difficulty: 'Easy',
    category: 'Pattern 10: Group Filtering',
    title: 'Departments with More than 3 Employees',
    description: 'Find all departments that have strictly more than 3 employees. Show dept_id and employee count.',
    hint: 'GROUP BY dept_id HAVING COUNT(*) > 3.',
    starterSql: "SELECT dept_id, COUNT(*) AS employee_count\nFROM employees\nGROUP BY dept_id\nHAVING COUNT(*) > 3;",
    solutionSql: "SELECT dept_id, COUNT(*) AS employee_count\nFROM employees\nGROUP BY dept_id\nHAVING COUNT(*) > 3;"
  },
  {
    id: 'pat-10-2',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 10: Group Filtering',
    title: 'Categories with Average Price > $1,500',
    description: 'Find product categories where the average price of products exceeds $1,500. Show category_id and rounded average price.',
    hint: 'GROUP BY category_id HAVING AVG(price) > 1500.',
    starterSql: "SELECT category_id, ROUND(AVG(price), 2) AS avg_price\nFROM products\nGROUP BY category_id\nHAVING AVG(price) > 1500;",
    solutionSql: "SELECT category_id, ROUND(AVG(price), 2) AS avg_price\nFROM products\nGROUP BY category_id\nHAVING AVG(price) > 1500;"
  },
  {
    id: 'pat-10-3',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 10: Group Filtering',
    title: 'Customers with Total Completed Spend > $3,000',
    description: 'Find customer_ids whose cumulative completed orders amount exceeds $3,000. Show customer_id and total_spent.',
    hint: "WHERE status = 'Completed' GROUP BY customer_id HAVING SUM(total_amount) > 3000.",
    starterSql: "SELECT customer_id, SUM(total_amount) AS total_spent\nFROM orders\nWHERE status = 'Completed'\nGROUP BY customer_id\nHAVING SUM(total_amount) > 3000;",
    solutionSql: "SELECT customer_id, SUM(total_amount) AS total_spent\nFROM orders\nWHERE status = 'Completed'\nGROUP BY customer_id\nHAVING SUM(total_amount) > 3000;"
  },
  {
    id: 'pat-10-4',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 10: Group Filtering',
    title: 'Departments Where Minimum Salary is at Least $120k',
    description: 'Find departments where every single employee earns at least $120,000 (i.e. MIN(salary) >= 120000).',
    hint: 'GROUP BY dept_id HAVING MIN(salary) >= 120000.',
    starterSql: "SELECT dept_id, MIN(salary) AS min_dept_salary\nFROM employees\nGROUP BY dept_id\nHAVING MIN(salary) >= 120000;",
    solutionSql: "SELECT dept_id, MIN(salary) AS min_dept_salary\nFROM employees\nGROUP BY dept_id\nHAVING MIN(salary) >= 120000;"
  },
  {
    id: 'pat-10-5',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 10: Group Filtering',
    title: 'Countries with at Least 2 Customers',
    description: 'Find countries that have 2 or more registered customers.',
    hint: 'GROUP BY country HAVING COUNT(*) >= 2.',
    starterSql: "SELECT country, COUNT(*) AS customer_count\nFROM customers\nGROUP BY country\nHAVING COUNT(*) >= 2;",
    solutionSql: "SELECT country, COUNT(*) AS customer_count\nFROM customers\nGROUP BY country\nHAVING COUNT(*) >= 2;"
  },
  {
    id: 'pat-10-6',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 10: Group Filtering',
    title: 'Accounts with More than 3 Transactions',
    description: 'Find bank accounts that have recorded more than 3 transactions in total.',
    hint: 'GROUP BY account_id HAVING COUNT(*) > 3.',
    starterSql: "SELECT account_id, COUNT(*) AS total_txns\nFROM transactions\nGROUP BY account_id\nHAVING COUNT(*) > 3;",
    solutionSql: "SELECT account_id, COUNT(*) AS total_txns\nFROM transactions\nGROUP BY account_id\nHAVING COUNT(*) > 3;"
  },
  {
    id: 'pat-10-7',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 10: Group Filtering',
    title: 'Theater Rows with at Least 3 Free Seats',
    description: 'Find theater row_ids that have 3 or more unbooked seats (is_booked = 0).',
    hint: 'WHERE is_booked = 0 GROUP BY row_id HAVING COUNT(*) >= 3.',
    starterSql: "SELECT row_id, COUNT(*) AS free_seats_count\nFROM cinema_seats\nWHERE is_booked = 0\nGROUP BY row_id\nHAVING COUNT(*) >= 3;",
    solutionSql: "SELECT row_id, COUNT(*) AS free_seats_count\nFROM cinema_seats\nWHERE is_booked = 0\nGROUP BY row_id\nHAVING COUNT(*) >= 3;"
  },
  {
    id: 'pat-10-8',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 10: Group Filtering',
    title: 'Categories with at Least 4 Products',
    description: 'Find category IDs that have 4 or more products assigned.',
    hint: 'GROUP BY category_id HAVING COUNT(*) >= 4.',
    starterSql: "SELECT category_id, COUNT(*) AS product_count\nFROM products\nGROUP BY category_id\nHAVING COUNT(*) >= 4;",
    solutionSql: "SELECT category_id, COUNT(*) AS product_count\nFROM products\nGROUP BY category_id\nHAVING COUNT(*) >= 4;"
  },
  {
    id: 'pat-10-9',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 10: Group Filtering',
    title: 'Users Who Logged In Across More Than 2 Unique Days',
    description: 'Find user IDs who have logged in on 3 or more distinct dates.',
    hint: 'GROUP BY user_id HAVING COUNT(DISTINCT login_date) >= 3.',
    starterSql: "SELECT user_id, COUNT(DISTINCT login_date) AS active_days\nFROM user_logins\nGROUP BY user_id\nHAVING COUNT(DISTINCT login_date) >= 3;",
    solutionSql: "SELECT user_id, COUNT(DISTINCT login_date) AS active_days\nFROM user_logins\nGROUP BY user_id\nHAVING COUNT(DISTINCT login_date) >= 3;"
  },
  {
    id: 'pat-10-10',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 10: Group Filtering',
    title: 'Departments with Payroll Exceeding $800k',
    description: 'Find department IDs where total employee payroll exceeds $800,000.',
    hint: 'GROUP BY dept_id HAVING SUM(salary) > 800000.',
    starterSql: "SELECT dept_id, SUM(salary) AS total_payroll\nFROM employees\nGROUP BY dept_id\nHAVING SUM(salary) > 800000;",
    solutionSql: "SELECT dept_id, SUM(salary) AS total_payroll\nFROM employees\nGROUP BY dept_id\nHAVING SUM(salary) > 800000;"
  },

  // =========================================================================
  // 🎯 PATTERN 11: PERCENTAGE / RATIO CALCULATIONS (10 Questions)
  // =========================================================================
  {
    id: 'pat-11-1',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 11: Percentage / Ratio Calculations',
    title: 'Department Share of Total Company Payroll',
    description: 'Calculate each department payroll as a percentage of total company payroll, rounded to 2 decimal places.',
    hint: 'ROUND(100.0 * SUM(salary) / (SELECT SUM(salary) FROM employees), 2) AS payroll_pct GROUP BY dept_id.',
    starterSql: "SELECT dept_id, SUM(salary) AS dept_payroll,\n  ROUND(100.0 * SUM(salary) / (SELECT SUM(salary) FROM employees), 2) AS payroll_pct\nFROM employees\nGROUP BY dept_id\nORDER BY payroll_pct DESC;",
    solutionSql: "SELECT dept_id, SUM(salary) AS dept_payroll,\n  ROUND(100.0 * SUM(salary) / (SELECT SUM(salary) FROM employees), 2) AS payroll_pct\nFROM employees\nGROUP BY dept_id\nORDER BY payroll_pct DESC;"
  },
  {
    id: 'pat-11-2',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 11: Percentage / Ratio Calculations',
    title: 'Order Cancellation Rate',
    description: "Calculate the percentage of orders that were cancelled across the entire platform, rounded to 2 decimal places.",
    hint: "ROUND(100.0 * COUNT(CASE WHEN status = 'Cancelled' THEN 1 END) / COUNT(*), 2) AS cancellation_rate_pct.",
    starterSql: "SELECT\n  ROUND(100.0 * COUNT(CASE WHEN status = 'Cancelled' THEN 1 END) / COUNT(*), 2) AS cancellation_rate_pct\nFROM orders;",
    solutionSql: "SELECT\n  ROUND(100.0 * COUNT(CASE WHEN status = 'Cancelled' THEN 1 END) / COUNT(*), 2) AS cancellation_rate_pct\nFROM orders;"
  },
  {
    id: 'pat-11-3',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 11: Percentage / Ratio Calculations',
    title: 'Visitor-to-Signup Conversion Rate',
    description: 'Calculate daily conversion rate from website visits to signups (signups / visits * 100), rounded to 2 decimal places.',
    hint: 'ROUND(100.0 * signups / visits, 2) AS signup_conversion_pct.',
    starterSql: "SELECT metric_date, visits, signups,\n  ROUND(100.0 * signups / visits, 2) AS signup_conversion_pct\nFROM daily_metrics\nORDER BY metric_date;",
    solutionSql: "SELECT metric_date, visits, signups,\n  ROUND(100.0 * signups / visits, 2) AS signup_conversion_pct\nFROM daily_metrics\nORDER BY metric_date;"
  },
  {
    id: 'pat-11-4',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 11: Percentage / Ratio Calculations',
    title: 'Signup-to-Checkout Funnel Conversion Rate',
    description: 'Calculate daily conversion rate from signups to checkouts (checkouts / signups * 100), rounded to 2 decimal places.',
    hint: 'ROUND(100.0 * checkouts / signups, 2) AS checkout_conversion_pct.',
    starterSql: "SELECT metric_date, signups, checkouts,\n  ROUND(100.0 * checkouts / signups, 2) AS checkout_conversion_pct\nFROM daily_metrics\nORDER BY metric_date;",
    solutionSql: "SELECT metric_date, signups, checkouts,\n  ROUND(100.0 * checkouts / signups, 2) AS checkout_conversion_pct\nFROM daily_metrics\nORDER BY metric_date;"
  },
  {
    id: 'pat-11-5',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 11: Percentage / Ratio Calculations',
    title: 'Cinema Theater Row Occupancy Rate',
    description: 'For each cinema row, calculate the occupancy rate percentage (% of seats booked), rounded to 1 decimal place.',
    hint: 'ROUND(100.0 * SUM(is_booked) / COUNT(*), 1) AS occupancy_pct GROUP BY row_id.',
    starterSql: "SELECT row_id, COUNT(*) AS total_seats, SUM(is_booked) AS booked_seats,\n  ROUND(100.0 * SUM(is_booked) / COUNT(*), 1) AS occupancy_pct\nFROM cinema_seats\nGROUP BY row_id;",
    solutionSql: "SELECT row_id, COUNT(*) AS total_seats, SUM(is_booked) AS booked_seats,\n  ROUND(100.0 * SUM(is_booked) / COUNT(*), 1) AS occupancy_pct\nFROM cinema_seats\nGROUP BY row_id;"
  },
  {
    id: 'pat-11-6',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 11: Percentage / Ratio Calculations',
    title: 'Individual Salary as Share of Department Payroll',
    description: 'Show each employee salary as a percentage of their own department total payroll using window functions.',
    hint: 'ROUND(100.0 * salary / SUM(salary) OVER (PARTITION BY dept_id), 2) AS salary_share_pct.',
    starterSql: "SELECT dept_id, first_name, salary,\n  ROUND(100.0 * salary / SUM(salary) OVER (PARTITION BY dept_id), 2) AS salary_share_pct\nFROM employees\nORDER BY dept_id, salary DESC;",
    solutionSql: "SELECT dept_id, first_name, salary,\n  ROUND(100.0 * salary / SUM(salary) OVER (PARTITION BY dept_id), 2) AS salary_share_pct\nFROM employees\nORDER BY dept_id, salary DESC;"
  },
  {
    id: 'pat-11-7',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 11: Percentage / Ratio Calculations',
    title: 'Percentage of Customers from USA',
    description: "Calculate what percentage of all registered customers are from 'USA', rounded to 2 decimal places.",
    hint: "ROUND(100.0 * COUNT(CASE WHEN country = 'USA' THEN 1 END) / COUNT(*), 2) AS usa_customer_pct.",
    starterSql: "SELECT\n  ROUND(100.0 * COUNT(CASE WHEN country = 'USA' THEN 1 END) / COUNT(*), 2) AS usa_customer_pct\nFROM customers;",
    solutionSql: "SELECT\n  ROUND(100.0 * COUNT(CASE WHEN country = 'USA' THEN 1 END) / COUNT(*), 2) AS usa_customer_pct\nFROM customers;"
  },
  {
    id: 'pat-11-8',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 11: Percentage / Ratio Calculations',
    title: 'Customer Order Spend as Share of Country Spend',
    description: 'Show customer_id, customer_name, country, and each customer total completed spend as a percentage of total spend from that country.',
    hint: 'ROUND(100.0 * total_spent / SUM(total_spent) OVER (PARTITION BY country), 2) AS country_share_pct.',
    starterSql: "WITH CustSpend AS (\n  SELECT c.customer_id, c.customer_name, c.country, SUM(o.total_amount) AS total_spent\n  FROM customers c\n  JOIN orders o ON c.customer_id = o.customer_id\n  WHERE o.status = 'Completed'\n  GROUP BY c.customer_id, c.customer_name, c.country\n)\nSELECT customer_id, customer_name, country, total_spent,\n  ROUND(100.0 * total_spent / SUM(total_spent) OVER (PARTITION BY country), 2) AS country_share_pct\nFROM CustSpend\nORDER BY country, total_spent DESC;",
    solutionSql: "WITH CustSpend AS (\n  SELECT c.customer_id, c.customer_name, c.country, SUM(o.total_amount) AS total_spent\n  FROM customers c\n  JOIN orders o ON c.customer_id = o.customer_id\n  WHERE o.status = 'Completed'\n  GROUP BY c.customer_id, c.customer_name, c.country\n)\nSELECT customer_id, customer_name, country, total_spent,\n  ROUND(100.0 * total_spent / SUM(total_spent) OVER (PARTITION BY country), 2) AS country_share_pct\nFROM CustSpend\nORDER BY country, total_spent DESC;"
  },
  {
    id: 'pat-11-9',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 11: Percentage / Ratio Calculations',
    title: 'Category Catalog Value Share',
    description: 'Calculate what percentage of the total catalog product value (sum of all product prices) is in each category.',
    hint: 'ROUND(100.0 * SUM(price) / (SELECT SUM(price) FROM products), 2) AS catalog_value_pct GROUP BY category_id.',
    starterSql: "SELECT category_id, SUM(price) AS category_value,\n  ROUND(100.0 * SUM(price) / (SELECT SUM(price) FROM products), 2) AS catalog_value_pct\nFROM products\nGROUP BY category_id\nORDER BY catalog_value_pct DESC;",
    solutionSql: "SELECT category_id, SUM(price) AS category_value,\n  ROUND(100.0 * SUM(price) / (SELECT SUM(price) FROM products), 2) AS catalog_value_pct\nFROM products\nGROUP BY category_id\nORDER BY catalog_value_pct DESC;"
  },
  {
    id: 'pat-11-10',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 11: Percentage / Ratio Calculations',
    title: 'Deposit vs Withdrawal Value Proportion',
    description: 'On account 9001, calculate what percentage of the absolute transaction turnover (deposits + abs(withdrawals)) came from deposits.',
    hint: 'ROUND(100.0 * sum(deposits) / sum(abs(amount)), 2).',
    starterSql: "SELECT\n  ROUND(100.0 * SUM(CASE WHEN txn_type = 'Deposit' THEN amount ELSE 0 END) / SUM(ABS(amount)), 2) AS deposit_share_pct\nFROM transactions\nWHERE account_id = 9001;",
    solutionSql: "SELECT\n  ROUND(100.0 * SUM(CASE WHEN txn_type = 'Deposit' THEN amount ELSE 0 END) / SUM(ABS(amount)), 2) AS deposit_share_pct\nFROM transactions\nWHERE account_id = 9001;"
  },

  // =========================================================================
  // 🎯 PATTERN 12: RETENTION & COHORT ANALYSIS (10 Questions)
  // =========================================================================
  {
    id: 'pat-12-1',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 12: Retention & Cohort Analysis',
    title: 'Day-1 Login Retention Rate',
    description: 'Calculate the Day-1 retention rate: the percentage of logins on day N that had a returning login on day N+1.',
    hint: 'JOIN user_logins l2 ON l1.user_id = l2.user_id AND date(l1.login_date, "+1 day") = l2.login_date.',
    starterSql: "WITH DayLogins AS (\n  SELECT DISTINCT l1.user_id, l1.login_date,\n    CASE WHEN l2.login_date IS NOT NULL THEN 1 ELSE 0 END AS retained_next_day\n  FROM user_logins l1\n  LEFT JOIN user_logins l2 ON l1.user_id = l2.user_id\n    AND date(l1.login_date, '+1 day') = l2.login_date\n)\nSELECT\n  ROUND(100.0 * SUM(retained_next_day) / COUNT(*), 1) AS day_1_retention_pct\nFROM DayLogins;",
    solutionSql: "WITH DayLogins AS (\n  SELECT DISTINCT l1.user_id, l1.login_date,\n    CASE WHEN l2.login_date IS NOT NULL THEN 1 ELSE 0 END AS retained_next_day\n  FROM user_logins l1\n  LEFT JOIN user_logins l2 ON l1.user_id = l2.user_id\n    AND date(l1.login_date, '+1 day') = l2.login_date\n)\nSELECT\n  ROUND(100.0 * SUM(retained_next_day) / COUNT(*), 1) AS day_1_retention_pct\nFROM DayLogins;"
  },
  {
    id: 'pat-12-2',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 12: Retention & Cohort Analysis',
    title: 'Monthly Customer Signup Cohorts',
    description: "Group customers into monthly signup cohorts (e.g. '2023-01', '2023-02') and count total signups in each cohort.",
    hint: "SUBSTR(signup_date, 1, 7) AS cohort_month, COUNT(*) AS cohort_size GROUP BY cohort_month.",
    starterSql: "SELECT SUBSTR(signup_date, 1, 7) AS cohort_month, COUNT(*) AS cohort_size\nFROM customers\nGROUP BY cohort_month\nORDER BY cohort_month;",
    solutionSql: "SELECT SUBSTR(signup_date, 1, 7) AS cohort_month, COUNT(*) AS cohort_size\nFROM customers\nGROUP BY cohort_month\nORDER BY cohort_month;"
  },
  {
    id: 'pat-12-3',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 12: Retention & Cohort Analysis',
    title: 'Customers Who Ordered in Their Signup Month',
    description: 'Find customers whose first completed order occurred in the exact same calendar month as their signup_date.',
    hint: "SUBSTR(c.signup_date, 1, 7) = SUBSTR(o.order_date, 1, 7) WHERE o.status = 'Completed'.",
    starterSql: "SELECT DISTINCT c.customer_id, c.customer_name, c.signup_date, o.order_date\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nWHERE o.status = 'Completed'\n  AND SUBSTR(c.signup_date, 1, 7) = SUBSTR(o.order_date, 1, 7);",
    solutionSql: "SELECT DISTINCT c.customer_id, c.customer_name, c.signup_date, o.order_date\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nWHERE o.status = 'Completed'\n  AND SUBSTR(c.signup_date, 1, 7) = SUBSTR(o.order_date, 1, 7);"
  },
  {
    id: 'pat-12-4',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 12: Retention & Cohort Analysis',
    title: 'Days Elapsed from Signup to First Order',
    description: 'Calculate the number of days between each customer signup_date and their earliest recorded order_date.',
    hint: 'CAST(julianday(MIN(o.order_date)) - julianday(c.signup_date) AS INT) AS days_to_first_order.',
    starterSql: "SELECT c.customer_id, c.customer_name, c.signup_date, MIN(o.order_date) AS first_order_date,\n  CAST(julianday(MIN(o.order_date)) - julianday(c.signup_date) AS INT) AS days_to_first_order\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nGROUP BY c.customer_id, c.customer_name, c.signup_date\nORDER BY days_to_first_order ASC;",
    solutionSql: "SELECT c.customer_id, c.customer_name, c.signup_date, MIN(o.order_date) AS first_order_date,\n  CAST(julianday(MIN(o.order_date)) - julianday(c.signup_date) AS INT) AS days_to_first_order\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nGROUP BY c.customer_id, c.customer_name, c.signup_date\nORDER BY days_to_first_order ASC;"
  },
  {
    id: 'pat-12-5',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 12: Retention & Cohort Analysis',
    title: 'Repeat Purchaser Identification',
    description: "Find all customers who have placed at least 2 completed orders (repeat buyers). Show customer_id, customer_name, and completed_orders count.",
    hint: "WHERE status = 'Completed' GROUP BY customer_id HAVING COUNT(*) >= 2.",
    starterSql: "SELECT c.customer_id, c.customer_name, COUNT(o.order_id) AS completed_orders\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nWHERE o.status = 'Completed'\nGROUP BY c.customer_id, c.customer_name\nHAVING COUNT(o.order_id) >= 2;",
    solutionSql: "SELECT c.customer_id, c.customer_name, COUNT(o.order_id) AS completed_orders\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nWHERE o.status = 'Completed'\nGROUP BY c.customer_id, c.customer_name\nHAVING COUNT(o.order_id) >= 2;"
  },
  {
    id: 'pat-12-6',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 12: Retention & Cohort Analysis',
    title: 'Repeat Purchase Rate Across Entire Customer Base',
    description: 'Calculate what percentage of customers who placed at least 1 completed order went on to place a 2nd completed order.',
    hint: 'COUNT(CASE WHEN order_count >= 2 THEN 1 END) * 100.0 / COUNT(*) in a customer order count CTE.',
    starterSql: "WITH OrderCounts AS (\n  SELECT customer_id, COUNT(*) AS cnt\n  FROM orders\n  WHERE status = 'Completed'\n  GROUP BY customer_id\n)\nSELECT\n  ROUND(100.0 * COUNT(CASE WHEN cnt >= 2 THEN 1 END) / COUNT(*), 1) AS repeat_purchase_rate_pct\nFROM OrderCounts;",
    solutionSql: "WITH OrderCounts AS (\n  SELECT customer_id, COUNT(*) AS cnt\n  FROM orders\n  WHERE status = 'Completed'\n  GROUP BY customer_id\n)\nSELECT\n  ROUND(100.0 * COUNT(CASE WHEN cnt >= 2 THEN 1 END) / COUNT(*), 1) AS repeat_purchase_rate_pct\nFROM OrderCounts;"
  },
  {
    id: 'pat-12-7',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 12: Retention & Cohort Analysis',
    title: 'Total Revenue Generated by Monthly Signup Cohort',
    description: 'Calculate the total completed order revenue generated by customers grouped by their signup month.',
    hint: 'SUBSTR(c.signup_date, 1, 7) AS cohort_month, SUM(o.total_amount) AS cohort_revenue GROUP BY cohort_month.',
    starterSql: "SELECT SUBSTR(c.signup_date, 1, 7) AS signup_cohort,\n  SUM(o.total_amount) AS total_cohort_revenue\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nWHERE o.status = 'Completed'\nGROUP BY signup_cohort\nORDER BY signup_cohort;",
    solutionSql: "SELECT SUBSTR(c.signup_date, 1, 7) AS signup_cohort,\n  SUM(o.total_amount) AS total_cohort_revenue\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nWHERE o.status = 'Completed'\nGROUP BY signup_cohort\nORDER BY signup_cohort;"
  },
  {
    id: 'pat-12-8',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 12: Retention & Cohort Analysis',
    title: 'Customer Activity Status (Active vs Dormant)',
    description: "Classify customers who ordered after '2023-04-01' as 'Active' and others as 'Dormant'.",
    hint: "CASE WHEN MAX(o.order_date) >= '2023-04-01' THEN 'Active' ELSE 'Dormant' END AS activity_status.",
    starterSql: "SELECT c.customer_id, c.customer_name,\n  CASE\n    WHEN MAX(o.order_date) >= '2023-04-01' THEN 'Active'\n    ELSE 'Dormant'\n  END AS activity_status\nFROM customers c\nLEFT JOIN orders o ON c.customer_id = o.customer_id\nGROUP BY c.customer_id, c.customer_name;",
    solutionSql: "SELECT c.customer_id, c.customer_name,\n  CASE\n    WHEN MAX(o.order_date) >= '2023-04-01' THEN 'Active'\n    ELSE 'Dormant'\n  END AS activity_status\nFROM customers c\nLEFT JOIN orders o ON c.customer_id = o.customer_id\nGROUP BY c.customer_id, c.customer_name;"
  },
  {
    id: 'pat-12-9',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 12: Retention & Cohort Analysis',
    title: 'Customer Order Frequency Buckets',
    description: "Bucket customers into order frequency buckets: '0 Orders', '1 Order', '2+ Orders'. Show bucket and customer count.",
    hint: 'Use subquery or LEFT JOIN to calculate orders per customer then CASE WHEN in outer query.',
    starterSql: "WITH OrderCounts AS (\n  SELECT c.customer_id, COUNT(o.order_id) AS cnt\n  FROM customers c\n  LEFT JOIN orders o ON c.customer_id = o.customer_id\n  GROUP BY c.customer_id\n)\nSELECT\n  CASE\n    WHEN cnt = 0 THEN '0 Orders'\n    WHEN cnt = 1 THEN '1 Order'\n    ELSE '2+ Orders'\n  END AS frequency_bucket,\n  COUNT(*) AS customer_count\nFROM OrderCounts\nGROUP BY frequency_bucket\nORDER BY customer_count DESC;",
    solutionSql: "WITH OrderCounts AS (\n  SELECT c.customer_id, COUNT(o.order_id) AS cnt\n  FROM customers c\n  LEFT JOIN orders o ON c.customer_id = o.customer_id\n  GROUP BY c.customer_id\n)\nSELECT\n  CASE\n    WHEN cnt = 0 THEN '0 Orders'\n    WHEN cnt = 1 THEN '1 Order'\n    ELSE '2+ Orders'\n  END AS frequency_bucket,\n  COUNT(*) AS customer_count\nFROM OrderCounts\nGROUP BY frequency_bucket\nORDER BY customer_count DESC;"
  },
  {
    id: 'pat-12-10',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 12: Retention & Cohort Analysis',
    title: 'Average Order Value by Signup Cohort',
    description: 'Calculate the average order value (AOV) across completed orders for each monthly signup cohort.',
    hint: 'SUBSTR(c.signup_date, 1, 7) AS cohort, ROUND(AVG(o.total_amount), 2) AS avg_order_val GROUP BY cohort.',
    starterSql: "SELECT SUBSTR(c.signup_date, 1, 7) AS signup_cohort,\n  ROUND(AVG(o.total_amount), 2) AS avg_order_value\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nWHERE o.status = 'Completed'\nGROUP BY signup_cohort\nORDER BY signup_cohort;",
    solutionSql: "SELECT SUBSTR(c.signup_date, 1, 7) AS signup_cohort,\n  ROUND(AVG(o.total_amount), 2) AS avg_order_value\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nWHERE o.status = 'Completed'\nGROUP BY signup_cohort\nORDER BY signup_cohort;"
  },

  // =========================================================================
  // 🎯 PATTERN 13: DATE HANDLING & TIME-SERIES (10 Questions)
  // =========================================================================
  {
    id: 'pat-13-1',
    database: 'enterprise',
    difficulty: 'Easy',
    category: 'Pattern 13: Date Handling',
    title: 'Monthly Order Count Rollup',
    description: 'Show the year and month (YYYY-MM) and total count of orders placed in that month.',
    hint: 'SUBSTR(order_date, 1, 7) AS order_month, COUNT(*) GROUP BY order_month.',
    starterSql: "SELECT SUBSTR(order_date, 1, 7) AS order_month, COUNT(*) AS order_count\nFROM orders\nGROUP BY order_month\nORDER BY order_month;",
    solutionSql: "SELECT SUBSTR(order_date, 1, 7) AS order_month, COUNT(*) AS order_count\nFROM orders\nGROUP BY order_month\nORDER BY order_month;"
  },
  {
    id: 'pat-13-2',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 13: Date Handling',
    title: 'Total Revenue for First 5 Days of September',
    description: "Calculate total revenue from daily_metrics between '2023-09-01' and '2023-09-05' inclusive.",
    hint: "WHERE metric_date BETWEEN '2023-09-01' AND '2023-09-05'.",
    starterSql: "SELECT SUM(revenue) AS total_5d_revenue\nFROM daily_metrics\nWHERE metric_date BETWEEN '2023-09-01' AND '2023-09-05';",
    solutionSql: "SELECT SUM(revenue) AS total_5d_revenue\nFROM daily_metrics\nWHERE metric_date BETWEEN '2023-09-01' AND '2023-09-05';"
  },
  {
    id: 'pat-13-3',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 13: Date Handling',
    title: 'Hires by Calendar Year',
    description: 'Show employee hire year and total count of employees hired in each year.',
    hint: "SUBSTR(hire_date, 1, 4) AS hire_year, COUNT(*) GROUP BY hire_year ORDER BY hire_year ASC.",
    starterSql: "SELECT SUBSTR(hire_date, 1, 4) AS hire_year, COUNT(*) AS hires_count\nFROM employees\nGROUP BY hire_year\nORDER BY hire_year ASC;",
    solutionSql: "SELECT SUBSTR(hire_date, 1, 4) AS hire_year, COUNT(*) AS hires_count\nFROM employees\nGROUP BY hire_year\nORDER BY hire_year ASC;"
  },
  {
    id: 'pat-13-4',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 13: Date Handling',
    title: 'Orders Placed in First Half of Month',
    description: 'Find all orders placed on days 1 through 15 of any month. Show order_id, order_date, and total_amount.',
    hint: "WHERE CAST(SUBSTR(order_date, 9, 2) AS INT) <= 15.",
    starterSql: "SELECT order_id, order_date, total_amount\nFROM orders\nWHERE CAST(SUBSTR(order_date, 9, 2) AS INT) <= 15\nORDER BY order_date;",
    solutionSql: "SELECT order_id, order_date, total_amount\nFROM orders\nWHERE CAST(SUBSTR(order_date, 9, 2) AS INT) <= 15\nORDER BY order_date;"
  },
  {
    id: 'pat-13-5',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 13: Date Handling',
    title: 'Tenure in Days for All Employees as of 2024-01-01',
    description: "Calculate each employee tenure in days as of reference date '2024-01-01'.",
    hint: "CAST(julianday('2024-01-01') - julianday(hire_date) AS INT) AS tenure_days.",
    starterSql: "SELECT emp_id, first_name, hire_date,\n  CAST(julianday('2024-01-01') - julianday(hire_date) AS INT) AS tenure_days\nFROM employees\nORDER BY tenure_days DESC;",
    solutionSql: "SELECT emp_id, first_name, hire_date,\n  CAST(julianday('2024-01-01') - julianday(hire_date) AS INT) AS tenure_days\nFROM employees\nORDER BY tenure_days DESC;"
  },
  {
    id: 'pat-13-6',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 13: Date Handling',
    title: 'Quarterly Employee Hiring Rollup',
    description: "Extract hiring quarter: Q1 (months 01-03), Q2 (04-06), Q3 (07-09), Q4 (10-12). Show hire_year, quarter, and count of hires.",
    hint: 'Use SUBSTR(hire_date, 1, 4) and CASE WHEN on SUBSTR(hire_date, 6, 2) in GROUP BY.',
    starterSql: "SELECT SUBSTR(hire_date, 1, 4) AS hire_year,\n  CASE\n    WHEN SUBSTR(hire_date, 6, 2) BETWEEN '01' AND '03' THEN 'Q1'\n    WHEN SUBSTR(hire_date, 6, 2) BETWEEN '04' AND '06' THEN 'Q2'\n    WHEN SUBSTR(hire_date, 6, 2) BETWEEN '07' AND '09' THEN 'Q3'\n    ELSE 'Q4'\n  END AS hire_quarter,\n  COUNT(*) AS total_hires\nFROM employees\nGROUP BY hire_year, hire_quarter\nORDER BY hire_year, hire_quarter;",
    solutionSql: "SELECT SUBSTR(hire_date, 1, 4) AS hire_year,\n  CASE\n    WHEN SUBSTR(hire_date, 6, 2) BETWEEN '01' AND '03' THEN 'Q1'\n    WHEN SUBSTR(hire_date, 6, 2) BETWEEN '04' AND '06' THEN 'Q2'\n    WHEN SUBSTR(hire_date, 6, 2) BETWEEN '07' AND '09' THEN 'Q3'\n    ELSE 'Q4'\n  END AS hire_quarter,\n  COUNT(*) AS total_hires\nFROM employees\nGROUP BY hire_year, hire_quarter\nORDER BY hire_year, hire_quarter;"
  },
  {
    id: 'pat-13-7',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 13: Date Handling',
    title: 'Days with Highest Daily Visits',
    description: 'Find the top 3 dates with the highest visitor traffic. Show metric_date and visits.',
    hint: 'ORDER BY visits DESC LIMIT 3.',
    starterSql: "SELECT metric_date, visits\nFROM daily_metrics\nORDER BY visits DESC\nLIMIT 3;",
    solutionSql: "SELECT metric_date, visits\nFROM daily_metrics\nORDER BY visits DESC\nLIMIT 3;"
  },
  {
    id: 'pat-13-8',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 13: Date Handling',
    title: 'Time Window Check: Orders within 30 Days of Signup',
    description: 'Find customers who placed an order within 30 days of their signup date. Show customer_name, signup_date, and order_date.',
    hint: 'CAST(julianday(o.order_date) - julianday(c.signup_date) AS INT) BETWEEN 0 AND 30.',
    starterSql: "SELECT c.customer_name, c.signup_date, o.order_date,\n  CAST(julianday(o.order_date) - julianday(c.signup_date) AS INT) AS days_to_order\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nWHERE CAST(julianday(o.order_date) - julianday(c.signup_date) AS INT) BETWEEN 0 AND 30;",
    solutionSql: "SELECT c.customer_name, c.signup_date, o.order_date,\n  CAST(julianday(o.order_date) - julianday(c.signup_date) AS INT) AS days_to_order\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nWHERE CAST(julianday(o.order_date) - julianday(c.signup_date) AS INT) BETWEEN 0 AND 30;"
  },
  {
    id: 'pat-13-9',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 13: Date Handling',
    title: 'Transactions in Month of September 2023',
    description: "Show total count and sum amount of all transactions executed in '2023-09'.",
    hint: "WHERE txn_date LIKE '2023-09%'.",
    starterSql: "SELECT COUNT(*) AS txn_count, SUM(amount) AS net_sum\nFROM transactions\nWHERE txn_date LIKE '2023-09%';",
    solutionSql: "SELECT COUNT(*) AS txn_count, SUM(amount) AS net_sum\nFROM transactions\nWHERE txn_date LIKE '2023-09%';"
  },
  {
    id: 'pat-13-10',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 13: Date Handling',
    title: 'Oldest vs Newest Hired Employees',
    description: 'Find the minimum hire_date (first employee hired) and maximum hire_date (latest employee hired) in the company.',
    hint: 'SELECT MIN(hire_date) AS earliest_hire, MAX(hire_date) AS latest_hire FROM employees;',
    starterSql: "SELECT MIN(hire_date) AS earliest_hire, MAX(hire_date) AS latest_hire\nFROM employees;",
    solutionSql: "SELECT MIN(hire_date) AS earliest_hire, MAX(hire_date) AS latest_hire\nFROM employees;"
  },

  // =========================================================================
  // 🎯 PATTERN 14: FIRST OR LAST RECORD PER ENTITY (10 Questions)
  // =========================================================================
  {
    id: 'pat-14-1',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 14: First or Last Record',
    title: 'First Login Date per User',
    description: 'Find each user first ever recorded login date. Show user_id and first_login_date.',
    hint: 'SELECT user_id, MIN(login_date) AS first_login_date FROM user_logins GROUP BY user_id;',
    starterSql: "SELECT user_id, MIN(login_date) AS first_login_date\nFROM user_logins\nGROUP BY user_id\nORDER BY user_id;",
    solutionSql: "SELECT user_id, MIN(login_date) AS first_login_date\nFROM user_logins\nGROUP BY user_id\nORDER BY user_id;"
  },
  {
    id: 'pat-14-2',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 14: First or Last Record',
    title: 'Latest Order Total and Date per Customer',
    description: 'Find each customer latest order_date and the total_amount of that exact latest order using ROW_NUMBER().',
    hint: 'ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) as rn WHERE rn = 1.',
    starterSql: "WITH RankedOrders AS (\n  SELECT customer_id, order_id, order_date, total_amount,\n    ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS rn\n  FROM orders\n)\nSELECT customer_id, order_id, order_date, total_amount\nFROM RankedOrders\nWHERE rn = 1\nORDER BY customer_id;",
    solutionSql: "WITH RankedOrders AS (\n  SELECT customer_id, order_id, order_date, total_amount,\n    ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS rn\n  FROM orders\n)\nSELECT customer_id, order_id, order_date, total_amount\nFROM RankedOrders\nWHERE rn = 1\nORDER BY customer_id;"
  },
  {
    id: 'pat-14-3',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 14: First or Last Record',
    title: 'First Customer Who Signed Up in Each Country',
    description: 'Find the earliest registered customer in each country. Show country, customer_name, and signup_date.',
    hint: 'ROW_NUMBER() OVER (PARTITION BY country ORDER BY signup_date ASC) as rn WHERE rn = 1.',
    starterSql: "WITH RankedCustomers AS (\n  SELECT country, customer_name, signup_date,\n    ROW_NUMBER() OVER (PARTITION BY country ORDER BY signup_date ASC) AS rn\n  FROM customers\n)\nSELECT country, customer_name, signup_date\nFROM RankedCustomers\nWHERE rn = 1\nORDER BY country;",
    solutionSql: "WITH RankedCustomers AS (\n  SELECT country, customer_name, signup_date,\n    ROW_NUMBER() OVER (PARTITION BY country ORDER BY signup_date ASC) AS rn\n  FROM customers\n)\nSELECT country, customer_name, signup_date\nFROM RankedCustomers\nWHERE rn = 1\nORDER BY country;"
  },
  {
    id: 'pat-14-4',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 14: First or Last Record',
    title: 'Most Recent Bank Transaction per Account',
    description: 'For each bank account, show the most recent transaction details (txn_id, txn_date, txn_type, amount).',
    hint: 'ROW_NUMBER() OVER (PARTITION BY account_id ORDER BY txn_date DESC, txn_id DESC) as rn WHERE rn = 1.',
    starterSql: "WITH RankedTxns AS (\n  SELECT account_id, txn_id, txn_date, txn_type, amount,\n    ROW_NUMBER() OVER (PARTITION BY account_id ORDER BY txn_date DESC, txn_id DESC) AS rn\n  FROM transactions\n)\nSELECT account_id, txn_id, txn_date, txn_type, amount\nFROM RankedTxns\nWHERE rn = 1;",
    solutionSql: "WITH RankedTxns AS (\n  SELECT account_id, txn_id, txn_date, txn_type, amount,\n    ROW_NUMBER() OVER (PARTITION BY account_id ORDER BY txn_date DESC, txn_id DESC) AS rn\n  FROM transactions\n)\nSELECT account_id, txn_id, txn_date, txn_type, amount\nFROM RankedTxns\nWHERE rn = 1;"
  },
  {
    id: 'pat-14-5',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 14: First or Last Record',
    title: 'First Hired Employee in Each Department',
    description: 'Find the pioneer employee who was hired first in each department. Show dept_id, first_name, and hire_date.',
    hint: 'ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY hire_date ASC) as rn WHERE rn = 1.',
    starterSql: "WITH FirstHires AS (\n  SELECT dept_id, first_name, hire_date,\n    ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY hire_date ASC) AS rn\n  FROM employees\n)\nSELECT dept_id, first_name, hire_date\nFROM FirstHires\nWHERE rn = 1\nORDER BY dept_id;",
    solutionSql: "WITH FirstHires AS (\n  SELECT dept_id, first_name, hire_date,\n    ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY hire_date ASC) AS rn\n  FROM employees\n)\nSELECT dept_id, first_name, hire_date\nFROM FirstHires\nWHERE rn = 1\nORDER BY dept_id;"
  },
  {
    id: 'pat-14-6',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 14: First or Last Record',
    title: 'Most Recent Customer Order Status',
    description: 'Show customer_id and the status of their most recent order (e.g. was their last order Completed or Cancelled?).',
    hint: 'ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) as rn WHERE rn = 1.',
    starterSql: "WITH LatestStatus AS (\n  SELECT customer_id, status,\n    ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS rn\n  FROM orders\n)\nSELECT customer_id, status AS latest_order_status\nFROM LatestStatus\nWHERE rn = 1\nORDER BY customer_id;",
    solutionSql: "WITH LatestStatus AS (\n  SELECT customer_id, status,\n    ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS rn\n  FROM orders\n)\nSELECT customer_id, status AS latest_order_status\nFROM LatestStatus\nWHERE rn = 1\nORDER BY customer_id;"
  },
  {
    id: 'pat-14-7',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 14: First or Last Record',
    title: 'Cheapest and Most Expensive Product in Each Category',
    description: 'For each category, show category_id, the lowest price (MIN), and highest price (MAX).',
    hint: 'SELECT category_id, MIN(price) AS min_price, MAX(price) AS max_price FROM products GROUP BY category_id;',
    starterSql: "SELECT category_id, MIN(price) AS min_price, MAX(price) AS max_price\nFROM products\nGROUP BY category_id\nORDER BY category_id;",
    solutionSql: "SELECT category_id, MIN(price) AS min_price, MAX(price) AS max_price\nFROM products\nGROUP BY category_id\nORDER BY category_id;"
  },
  {
    id: 'pat-14-8',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 14: First or Last Record',
    title: 'First Customer Who Placed an Order in 2023',
    description: "Find the customer_id and customer_name of the customer who placed the very first order of 2023.",
    hint: "WHERE order_date LIKE '2023%' ORDER BY order_date ASC LIMIT 1.",
    starterSql: "SELECT c.customer_id, c.customer_name, o.order_date\nFROM orders o\nJOIN customers c ON o.customer_id = c.customer_id\nWHERE o.order_date LIKE '2023%'\nORDER BY o.order_date ASC\nLIMIT 1;",
    solutionSql: "SELECT c.customer_id, c.customer_name, o.order_date\nFROM orders o\nJOIN customers c ON o.customer_id = c.customer_id\nWHERE o.order_date LIKE '2023%'\nORDER BY o.order_date ASC\nLIMIT 1;"
  },
  {
    id: 'pat-14-9',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 14: First or Last Record',
    title: 'Latest User Login per User',
    description: 'Find each user most recent login date. Show user_id and last_login_date.',
    hint: 'SELECT user_id, MAX(login_date) AS last_login_date FROM user_logins GROUP BY user_id;',
    starterSql: "SELECT user_id, MAX(login_date) AS last_login_date\nFROM user_logins\nGROUP BY user_id\nORDER BY user_id;",
    solutionSql: "SELECT user_id, MAX(login_date) AS last_login_date\nFROM user_logins\nGROUP BY user_id\nORDER BY user_id;"
  },
  {
    id: 'pat-14-10',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 14: First or Last Record',
    title: 'Initial Deposit Transaction per Account',
    description: 'Find the very first deposit transaction recorded on each bank account.',
    hint: "WHERE txn_type = 'Deposit' with ROW_NUMBER() PARTITION BY account_id ORDER BY txn_date ASC.",
    starterSql: "WITH FirstDeposits AS (\n  SELECT account_id, txn_id, txn_date, amount,\n    ROW_NUMBER() OVER (PARTITION BY account_id ORDER BY txn_date ASC, txn_id ASC) AS rn\n  FROM transactions\n  WHERE txn_type = 'Deposit'\n)\nSELECT account_id, txn_id, txn_date, amount\nFROM FirstDeposits\nWHERE rn = 1;",
    solutionSql: "WITH FirstDeposits AS (\n  SELECT account_id, txn_id, txn_date, amount,\n    ROW_NUMBER() OVER (PARTITION BY account_id ORDER BY txn_date ASC, txn_id ASC) AS rn\n  FROM transactions\n  WHERE txn_type = 'Deposit'\n)\nSELECT account_id, txn_id, txn_date, amount\nFROM FirstDeposits\nWHERE rn = 1;"
  },

  // =========================================================================
  // 🎯 PATTERN 15: PIVOTING ROWS TO COLUMNS (10 Questions)
  // =========================================================================
  {
    id: 'pat-15-1',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 15: Pivoting Rows to Columns',
    title: 'Pivot Order Status Counts into Columns',
    description: 'Pivot order counts by status into separate columns: customer_id, completed_orders, and cancelled_orders.',
    hint: "COUNT(CASE WHEN status = 'Completed' THEN 1 END) AS completed_orders, etc. GROUP BY customer_id.",
    starterSql: "SELECT customer_id,\n  COUNT(CASE WHEN status = 'Completed' THEN 1 END) AS completed_orders,\n  COUNT(CASE WHEN status = 'Cancelled' THEN 1 END) AS cancelled_orders\nFROM orders\nGROUP BY customer_id\nORDER BY customer_id;",
    solutionSql: "SELECT customer_id,\n  COUNT(CASE WHEN status = 'Completed' THEN 1 END) AS completed_orders,\n  COUNT(CASE WHEN status = 'Cancelled' THEN 1 END) AS cancelled_orders\nFROM orders\nGROUP BY customer_id\nORDER BY customer_id;"
  },
  {
    id: 'pat-15-2',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 15: Pivoting Rows to Columns',
    title: 'Pivot Monthly Revenue into Quarter Columns',
    description: "Pivot 2023 orders into quarterly columns: Q1_revenue (Jan-Mar), Q2_revenue (Apr-Jun), Q3_revenue (Jul-Sep) across completed orders.",
    hint: "SUM(CASE WHEN SUBSTR(order_date, 6, 2) IN ('01', '02', '03') THEN total_amount ELSE 0 END) AS Q1_revenue.",
    starterSql: "SELECT\n  SUM(CASE WHEN SUBSTR(order_date, 6, 2) IN ('01', '02', '03') THEN total_amount ELSE 0 END) AS Q1_revenue,\n  SUM(CASE WHEN SUBSTR(order_date, 6, 2) IN ('04', '05', '06') THEN total_amount ELSE 0 END) AS Q2_revenue,\n  SUM(CASE WHEN SUBSTR(order_date, 6, 2) IN ('07', '08', '09') THEN total_amount ELSE 0 END) AS Q3_revenue\nFROM orders\nWHERE status = 'Completed';",
    solutionSql: "SELECT\n  SUM(CASE WHEN SUBSTR(order_date, 6, 2) IN ('01', '02', '03') THEN total_amount ELSE 0 END) AS Q1_revenue,\n  SUM(CASE WHEN SUBSTR(order_date, 6, 2) IN ('04', '05', '06') THEN total_amount ELSE 0 END) AS Q2_revenue,\n  SUM(CASE WHEN SUBSTR(order_date, 6, 2) IN ('07', '08', '09') THEN total_amount ELSE 0 END) AS Q3_revenue\nFROM orders\nWHERE status = 'Completed';"
  },
  {
    id: 'pat-15-3',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 15: Pivoting Rows to Columns',
    title: 'Pivot Department Headcount by Salary Tier',
    description: "For each department, pivot employee counts into salary tier columns: 'Tier_High' (>= 250k), 'Tier_Mid' (150k-249k), and 'Tier_Entry' (< 150k).",
    hint: 'COUNT(CASE WHEN salary >= 250000 THEN 1 END) AS Tier_High, etc. GROUP BY dept_id.',
    starterSql: "SELECT dept_id,\n  COUNT(CASE WHEN salary >= 250000 THEN 1 END) AS Tier_High,\n  COUNT(CASE WHEN salary >= 150000 AND salary < 250000 THEN 1 END) AS Tier_Mid,\n  COUNT(CASE WHEN salary < 150000 THEN 1 END) AS Tier_Entry\nFROM employees\nGROUP BY dept_id\nORDER BY dept_id;",
    solutionSql: "SELECT dept_id,\n  COUNT(CASE WHEN salary >= 250000 THEN 1 END) AS Tier_High,\n  COUNT(CASE WHEN salary >= 150000 AND salary < 250000 THEN 1 END) AS Tier_Mid,\n  COUNT(CASE WHEN salary < 150000 THEN 1 END) AS Tier_Entry\nFROM employees\nGROUP BY dept_id\nORDER BY dept_id;"
  },
  {
    id: 'pat-15-4',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 15: Pivoting Rows to Columns',
    title: 'Pivot Transaction Totals into Separate Columns',
    description: 'Pivot total deposit amounts and total withdrawal amounts into columns per account.',
    hint: "SUM(CASE WHEN txn_type = 'Deposit' THEN amount ELSE 0 END) AS deposit_total, etc.",
    starterSql: "SELECT account_id,\n  SUM(CASE WHEN txn_type = 'Deposit' THEN amount ELSE 0 END) AS deposit_total,\n  SUM(CASE WHEN txn_type = 'Withdrawal' THEN amount ELSE 0 END) AS withdrawal_total\nFROM transactions\nGROUP BY account_id;",
    solutionSql: "SELECT account_id,\n  SUM(CASE WHEN txn_type = 'Deposit' THEN amount ELSE 0 END) AS deposit_total,\n  SUM(CASE WHEN txn_type = 'Withdrawal' THEN amount ELSE 0 END) AS withdrawal_total\nFROM transactions\nGROUP BY account_id;"
  },
  {
    id: 'pat-15-5',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 15: Pivoting Rows to Columns',
    title: 'Pivot Customer Distribution Across Top Countries',
    description: "Pivot counts of customers from 'USA', 'China', 'France', and 'Other' into separate columns in a single row.",
    hint: "COUNT(CASE WHEN country = 'USA' THEN 1 END) AS usa_count, etc.",
    starterSql: "SELECT\n  COUNT(CASE WHEN country = 'USA' THEN 1 END) AS usa_customers,\n  COUNT(CASE WHEN country = 'China' THEN 1 END) AS china_customers,\n  COUNT(CASE WHEN country = 'France' THEN 1 END) AS france_customers,\n  COUNT(CASE WHEN country NOT IN ('USA', 'China', 'France') THEN 1 END) AS other_customers\nFROM customers;",
    solutionSql: "SELECT\n  COUNT(CASE WHEN country = 'USA' THEN 1 END) AS usa_customers,\n  COUNT(CASE WHEN country = 'China' THEN 1 END) AS china_customers,\n  COUNT(CASE WHEN country = 'France' THEN 1 END) AS france_customers,\n  COUNT(CASE WHEN country NOT IN ('USA', 'China', 'France') THEN 1 END) AS other_customers\nFROM customers;"
  },
  {
    id: 'pat-15-6',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 15: Pivoting Rows to Columns',
    title: 'Pivot Theater Seats Availability Matrix',
    description: 'Pivot seat status (free vs booked) for row A and row B into separate summary columns.',
    hint: "SUM(CASE WHEN row_id = 'A' AND is_booked = 0 THEN 1 ELSE 0 END) AS row_a_free, etc.",
    starterSql: "SELECT\n  SUM(CASE WHEN row_id = 'A' AND is_booked = 0 THEN 1 ELSE 0 END) AS row_a_free,\n  SUM(CASE WHEN row_id = 'A' AND is_booked = 1 THEN 1 ELSE 0 END) AS row_a_booked,\n  SUM(CASE WHEN row_id = 'B' AND is_booked = 0 THEN 1 ELSE 0 END) AS row_b_free,\n  SUM(CASE WHEN row_id = 'B' AND is_booked = 1 THEN 1 ELSE 0 END) AS row_b_booked\nFROM cinema_seats;",
    solutionSql: "SELECT\n  SUM(CASE WHEN row_id = 'A' AND is_booked = 0 THEN 1 ELSE 0 END) AS row_a_free,\n  SUM(CASE WHEN row_id = 'A' AND is_booked = 1 THEN 1 ELSE 0 END) AS row_a_booked,\n  SUM(CASE WHEN row_id = 'B' AND is_booked = 0 THEN 1 ELSE 0 END) AS row_b_free,\n  SUM(CASE WHEN row_id = 'B' AND is_booked = 1 THEN 1 ELSE 0 END) AS row_b_booked\nFROM cinema_seats;"
  },
  {
    id: 'pat-15-7',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 15: Pivoting Rows to Columns',
    title: 'Pivot Product Price Statistics per Category',
    description: 'Display each category with separate columns for min_price, max_price, and avg_price.',
    hint: 'SELECT category_id, MIN(price) AS min_price, MAX(price) AS max_price, ROUND(AVG(price), 2) AS avg_price FROM products GROUP BY category_id;',
    starterSql: "SELECT category_id,\n  MIN(price) AS min_price,\n  MAX(price) AS max_price,\n  ROUND(AVG(price), 2) AS avg_price\nFROM products\nGROUP BY category_id;",
    solutionSql: "SELECT category_id,\n  MIN(price) AS min_price,\n  MAX(price) AS max_price,\n  ROUND(AVG(price), 2) AS avg_price\nFROM products\nGROUP BY category_id;"
  },
  {
    id: 'pat-15-8',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 15: Pivoting Rows to Columns',
    title: 'Pivot Daily Metrics (Visits, Signups, Checkouts) for Sept 1-3',
    description: 'Pivot total visits for Sept 1, Sept 2, and Sept 3 into separate columns.',
    hint: "SUM(CASE WHEN metric_date = '2023-09-01' THEN visits ELSE 0 END) AS sept_1_visits, etc.",
    starterSql: "SELECT\n  SUM(CASE WHEN metric_date = '2023-09-01' THEN visits ELSE 0 END) AS sept_1_visits,\n  SUM(CASE WHEN metric_date = '2023-09-02' THEN visits ELSE 0 END) AS sept_2_visits,\n  SUM(CASE WHEN metric_date = '2023-09-03' THEN visits ELSE 0 END) AS sept_3_visits\nFROM daily_metrics;",
    solutionSql: "SELECT\n  SUM(CASE WHEN metric_date = '2023-09-01' THEN visits ELSE 0 END) AS sept_1_visits,\n  SUM(CASE WHEN metric_date = '2023-09-02' THEN visits ELSE 0 END) AS sept_2_visits,\n  SUM(CASE WHEN metric_date = '2023-09-03' THEN visits ELSE 0 END) AS sept_3_visits\nFROM daily_metrics;"
  },
  {
    id: 'pat-15-9',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 15: Pivoting Rows to Columns',
    title: 'Pivot Employee Counts for Engineering vs Data Departments',
    description: 'In a single row, display the total employee count in Engineering (dept_id = 1) vs Data & AI (dept_id = 2).',
    hint: 'COUNT(CASE WHEN dept_id = 1 THEN 1 END) AS eng_count, COUNT(CASE WHEN dept_id = 2 THEN 1 END) AS data_count.',
    starterSql: "SELECT\n  COUNT(CASE WHEN dept_id = 1 THEN 1 END) AS engineering_staff,\n  COUNT(CASE WHEN dept_id = 2 THEN 1 END) AS data_staff\nFROM employees;",
    solutionSql: "SELECT\n  COUNT(CASE WHEN dept_id = 1 THEN 1 END) AS engineering_staff,\n  COUNT(CASE WHEN dept_id = 2 THEN 1 END) AS data_staff\nFROM employees;"
  },
  {
    id: 'pat-15-10',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 15: Pivoting Rows to Columns',
    title: 'Pivot Order Value by Category',
    description: 'Pivot total sales quantity for Category 1 vs Category 2 in order_items.',
    hint: 'JOIN products p on oi.product_id = p.product_id, SUM(CASE WHEN p.category_id = 1 THEN oi.quantity ELSE 0 END).',
    starterSql: "SELECT\n  SUM(CASE WHEN p.category_id = 1 THEN oi.quantity ELSE 0 END) AS cat1_units_sold,\n  SUM(CASE WHEN p.category_id = 2 THEN oi.quantity ELSE 0 END) AS cat2_units_sold\nFROM order_items oi\nJOIN products p ON oi.product_id = p.product_id;",
    solutionSql: "SELECT\n  SUM(CASE WHEN p.category_id = 1 THEN oi.quantity ELSE 0 END) AS cat1_units_sold,\n  SUM(CASE WHEN p.category_id = 2 THEN oi.quantity ELSE 0 END) AS cat2_units_sold\nFROM order_items oi\nJOIN products p ON oi.product_id = p.product_id;"
  },

  // =========================================================================
  // 🎯 PATTERN 16: SET OPERATIONS (UNION, EXCEPT, INTERSECT) (10 Questions)
  // =========================================================================
  {
    id: 'pat-16-1',
    database: 'enterprise',
    difficulty: 'Easy',
    category: 'Pattern 16: Set Operations',
    title: 'All Email Addresses (UNION ALL)',
    description: 'Combine all email addresses from employees and customers into a single list with duplicates preserved (UNION ALL).',
    hint: 'SELECT email FROM employees UNION ALL SELECT email FROM customers;',
    starterSql: "SELECT email, 'Employee' AS source\nFROM employees\nUNION ALL\nSELECT email, 'Customer' AS source\nFROM customers;",
    solutionSql: "SELECT email, 'Employee' AS source\nFROM employees\nUNION ALL\nSELECT email, 'Customer' AS source\nFROM customers;"
  },
  {
    id: 'pat-16-2',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 16: Set Operations',
    title: 'Unique Names Across Employees and Customers (UNION)',
    description: 'Combine all first names from employees and customer first names (parsed before space) without duplicates using UNION.',
    hint: 'SELECT first_name FROM employees UNION SELECT SUBSTR(customer_name, 1, INSTR(customer_name, " ") - 1) FROM customers;',
    starterSql: "SELECT first_name\nFROM employees\nUNION\nSELECT SUBSTR(customer_name, 1, INSTR(customer_name, ' ') - 1) AS first_name\nFROM customers\nORDER BY first_name;",
    solutionSql: "SELECT first_name\nFROM employees\nUNION\nSELECT SUBSTR(customer_name, 1, INSTR(customer_name, ' ') - 1) AS first_name\nFROM customers\nORDER BY first_name;"
  },
  {
    id: 'pat-16-3',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 16: Set Operations',
    title: 'Catalog Products NOT in Order Items (EXCEPT)',
    description: 'Find all product_ids that exist in the products table but do NOT exist in the order_items table using EXCEPT.',
    hint: 'SELECT product_id FROM products EXCEPT SELECT product_id FROM order_items;',
    starterSql: "SELECT product_id\nFROM products\nEXCEPT\nSELECT product_id\nFROM order_items;",
    solutionSql: "SELECT product_id\nFROM products\nEXCEPT\nSELECT product_id\nFROM order_items;"
  },
  {
    id: 'pat-16-4',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 16: Set Operations',
    title: 'Users Who Logged In on Day 1 AND Day 2 (INTERSECT)',
    description: "Find user_ids who logged in on '2023-08-01' AND also logged in on '2023-08-02' using INTERSECT.",
    hint: "SELECT user_id FROM user_logins WHERE login_date = '2023-08-01' INTERSECT SELECT user_id FROM user_logins WHERE login_date = '2023-08-02';",
    starterSql: "SELECT user_id\nFROM user_logins\nWHERE login_date = '2023-08-01'\nINTERSECT\nSELECT user_id\nFROM user_logins\nWHERE login_date = '2023-08-02';",
    solutionSql: "SELECT user_id\nFROM user_logins\nWHERE login_date = '2023-08-01'\nINTERSECT\nSELECT user_id\nFROM user_logins\nWHERE login_date = '2023-08-02';"
  },
  {
    id: 'pat-16-5',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 16: Set Operations',
    title: 'Accounts with Deposits but No Withdrawals (EXCEPT)',
    description: "Find distinct account_ids in transactions that have made 'Deposit' transactions but NO 'Withdrawal' transactions using EXCEPT.",
    hint: "SELECT account_id FROM transactions WHERE txn_type = 'Deposit' EXCEPT SELECT account_id FROM transactions WHERE txn_type = 'Withdrawal';",
    starterSql: "SELECT account_id\nFROM transactions\nWHERE txn_type = 'Deposit'\nEXCEPT\nSELECT account_id\nFROM transactions\nWHERE txn_type = 'Withdrawal';",
    solutionSql: "SELECT account_id\nFROM transactions\nWHERE txn_type = 'Deposit'\nEXCEPT\nSELECT account_id\nFROM transactions\nWHERE txn_type = 'Withdrawal';"
  },
  {
    id: 'pat-16-6',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 16: Set Operations',
    title: 'Customers with Orders vs Without Orders (UNION)',
    description: "Label and union all customers: label those with orders as 'Active Buyer' and those with no orders as 'Prospect'.",
    hint: "UNION ALL combining the two sets.",
    starterSql: "SELECT customer_id, customer_name, 'Active Buyer' AS status\nFROM customers\nWHERE customer_id IN (SELECT DISTINCT customer_id FROM orders)\nUNION ALL\nSELECT customer_id, customer_name, 'Prospect' AS status\nFROM customers\nWHERE customer_id NOT IN (SELECT DISTINCT customer_id FROM orders);",
    solutionSql: "SELECT customer_id, customer_name, 'Active Buyer' AS status\nFROM customers\nWHERE customer_id IN (SELECT DISTINCT customer_id FROM orders)\nUNION ALL\nSELECT customer_id, customer_name, 'Prospect' AS status\nFROM customers\nWHERE customer_id NOT IN (SELECT DISTINCT customer_id FROM orders);"
  },
  {
    id: 'pat-16-7',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 16: Set Operations',
    title: 'Countries with Customers BUT No Orders Placed (EXCEPT)',
    description: 'Find countries that have registered customers, but zero completed orders originated from that country.',
    hint: 'SELECT country FROM customers EXCEPT SELECT c.country FROM customers c JOIN orders o ON c.customer_id = o.customer_id WHERE o.status = "Completed";',
    starterSql: "SELECT country\nFROM customers\nEXCEPT\nSELECT c.country\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nWHERE o.status = 'Completed';",
    solutionSql: "SELECT country\nFROM customers\nEXCEPT\nSELECT c.country\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nWHERE o.status = 'Completed';"
  },
  {
    id: 'pat-16-8',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 16: Set Operations',
    title: 'Customer IDs in Orders vs Customer Table Consistency Check',
    description: 'Find any customer_ids referenced in orders that do not exist in the customers table using EXCEPT.',
    hint: 'SELECT customer_id FROM orders EXCEPT SELECT customer_id FROM customers;',
    starterSql: "SELECT customer_id\nFROM orders\nEXCEPT\nSELECT customer_id\nFROM customers;",
    solutionSql: "SELECT customer_id\nFROM orders\nEXCEPT\nSELECT customer_id\nFROM customers;"
  },
  {
    id: 'pat-16-9',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 16: Set Operations',
    title: 'Combined Staff from Engineering and Data (UNION ALL)',
    description: 'Create a combined list of employees from Dept 1 (Engineering) and Dept 2 (Data & AI). Show first_name, salary, and dept_id.',
    hint: 'SELECT first_name, salary, dept_id FROM employees WHERE dept_id = 1 UNION ALL ... WHERE dept_id = 2;',
    starterSql: "SELECT first_name, salary, dept_id\nFROM employees\nWHERE dept_id = 1\nUNION ALL\nSELECT first_name, salary, dept_id\nFROM employees\nWHERE dept_id = 2;",
    solutionSql: "SELECT first_name, salary, dept_id\nFROM employees\nWHERE dept_id = 1\nUNION ALL\nSELECT first_name, salary, dept_id\nFROM employees\nWHERE dept_id = 2;"
  },
  {
    id: 'pat-16-10',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 16: Set Operations',
    title: 'Customers Who Bought from Both Category 1 AND Category 2',
    description: 'Find customer_ids who have placed orders for products in Category 1 AND also in Category 2 using INTERSECT.',
    hint: 'INTERSECT the two customer ID sets queried from orders joined with order_items and products.',
    starterSql: "SELECT DISTINCT o.customer_id\nFROM orders o\nJOIN order_items oi ON o.order_id = oi.order_id\nJOIN products p ON oi.product_id = p.product_id\nWHERE p.category_id = 1\nINTERSECT\nSELECT DISTINCT o.customer_id\nFROM orders o\nJOIN order_items oi ON o.order_id = oi.order_id\nJOIN products p ON oi.product_id = p.product_id\nWHERE p.category_id = 2;",
    solutionSql: "SELECT DISTINCT o.customer_id\nFROM orders o\nJOIN order_items oi ON o.order_id = oi.order_id\nJOIN products p ON oi.product_id = p.product_id\nWHERE p.category_id = 1\nINTERSECT\nSELECT DISTINCT o.customer_id\nFROM orders o\nJOIN order_items oi ON o.order_id = oi.order_id\nJOIN products p ON oi.product_id = p.product_id\nWHERE p.category_id = 2;"
  },

  // =========================================================================
  // 🎯 PATTERN 17: CTES AND SUBQUERIES (10 Questions)
  // =========================================================================
  {
    id: 'pat-17-1',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 17: CTEs and Subqueries',
    title: 'Customers Spending Above Average Customer Spend',
    description: 'Find all customers whose total completed order spend is strictly greater than the average total spend across all customers.',
    hint: 'Use a CTE to calculate total spend per customer, then filter WHERE total_spend > (SELECT AVG(total_spend) FROM SpendCTE).',
    starterSql: "WITH CustSpend AS (\n  SELECT customer_id, SUM(total_amount) AS total_spend\n  FROM orders\n  WHERE status = 'Completed'\n  GROUP BY customer_id\n)\nSELECT c.customer_name, cs.total_spend\nFROM CustSpend cs\nJOIN customers c ON cs.customer_id = c.customer_id\nWHERE cs.total_spend > (SELECT AVG(total_spend) FROM CustSpend);",
    solutionSql: "WITH CustSpend AS (\n  SELECT customer_id, SUM(total_amount) AS total_spend\n  FROM orders\n  WHERE status = 'Completed'\n  GROUP BY customer_id\n)\nSELECT c.customer_name, cs.total_spend\nFROM CustSpend cs\nJOIN customers c ON cs.customer_id = c.customer_id\nWHERE cs.total_spend > (SELECT AVG(total_spend) FROM CustSpend);"
  },
  {
    id: 'pat-17-2',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 17: CTEs and Subqueries',
    title: 'Employees Earning Above Department Average',
    description: 'Find all employees who earn more than the average salary of their respective department using a correlated subquery.',
    hint: 'salary > (SELECT AVG(salary) FROM employees e2 WHERE e2.dept_id = e1.dept_id).',
    starterSql: "SELECT e1.emp_id, e1.first_name, e1.salary, e1.dept_id\nFROM employees e1\nWHERE e1.salary > (\n  SELECT AVG(salary) FROM employees e2 WHERE e2.dept_id = e1.dept_id\n);",
    solutionSql: "SELECT e1.emp_id, e1.first_name, e1.salary, e1.dept_id\nFROM employees e1\nWHERE e1.salary > (\n  SELECT AVG(salary) FROM employees e2 WHERE e2.dept_id = e1.dept_id\n);"
  },
  {
    id: 'pat-17-3',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 17: CTEs and Subqueries',
    title: 'Multi-Step Pipeline: Department Budget vs Spend',
    description: 'In a 2-step CTE pipeline: (1) calculate total employee payroll per department, (2) compare with the company average department payroll.',
    hint: 'WITH DeptPayroll AS (...) SELECT * FROM DeptPayroll WHERE total_payroll > (SELECT AVG(total_payroll) FROM DeptPayroll).',
    starterSql: "WITH DeptPayroll AS (\n  SELECT dept_id, SUM(salary) AS total_payroll\n  FROM employees\n  GROUP BY dept_id\n)\nSELECT dp.dept_id, d.dept_name, dp.total_payroll\nFROM DeptPayroll dp\nJOIN departments d ON dp.dept_id = d.dept_id\nWHERE dp.total_payroll > (SELECT AVG(total_payroll) FROM DeptPayroll);",
    solutionSql: "WITH DeptPayroll AS (\n  SELECT dept_id, SUM(salary) AS total_payroll\n  FROM employees\n  GROUP BY dept_id\n)\nSELECT dp.dept_id, d.dept_name, dp.total_payroll\nFROM DeptPayroll dp\nJOIN departments d ON dp.dept_id = d.dept_id\nWHERE dp.total_payroll > (SELECT AVG(total_payroll) FROM DeptPayroll);"
  },
  {
    id: 'pat-17-4',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 17: CTEs and Subqueries',
    title: 'Scalar Subquery for Company Average Salary Diff',
    description: 'Display each employee first_name, salary, and the difference from company average salary: salary - (SELECT AVG(salary) FROM employees).',
    hint: 'salary - (SELECT ROUND(AVG(salary)) FROM employees) AS diff_from_company_avg.',
    starterSql: "SELECT first_name, salary,\n  salary - (SELECT ROUND(AVG(salary)) FROM employees) AS diff_from_avg\nFROM employees\nORDER BY diff_from_avg DESC;",
    solutionSql: "SELECT first_name, salary,\n  salary - (SELECT ROUND(AVG(salary)) FROM employees) AS diff_from_avg\nFROM employees\nORDER BY diff_from_avg DESC;"
  },
  {
    id: 'pat-17-5',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 17: CTEs and Subqueries',
    title: 'Correlated EXISTS for Customers with Big Orders',
    description: 'Find all customers who have placed at least one completed order exceeding $3,000 using EXISTS.',
    hint: "WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id AND o.total_amount > 3000 AND o.status = 'Completed').",
    starterSql: "SELECT c.customer_id, c.customer_name\nFROM customers c\nWHERE EXISTS (\n  SELECT 1 FROM orders o\n  WHERE o.customer_id = c.customer_id\n    AND o.total_amount > 3000\n    AND o.status = 'Completed'\n);",
    solutionSql: "SELECT c.customer_id, c.customer_name\nFROM customers c\nWHERE EXISTS (\n  SELECT 1 FROM orders o\n  WHERE o.customer_id = c.customer_id\n    AND o.total_amount > 3000\n    AND o.status = 'Completed'\n);"
  },
  {
    id: 'pat-17-6',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 17: CTEs and Subqueries',
    title: 'Chained CTEs: Ranked High Spending Customers',
    description: 'Chain two CTEs: First calculate total completed spend per customer, then rank them with DENSE_RANK(), and select rank <= 3.',
    hint: 'WITH SpendCTE AS (...), RankedCTE AS (...) SELECT * FROM RankedCTE WHERE rnk <= 3.',
    starterSql: "WITH CustomerSpend AS (\n  SELECT customer_id, SUM(total_amount) AS total_spend\n  FROM orders\n  WHERE status = 'Completed'\n  GROUP BY customer_id\n),\nRanked AS (\n  SELECT customer_id, total_spend,\n    DENSE_RANK() OVER (ORDER BY total_spend DESC) AS rnk\n  FROM CustomerSpend\n)\nSELECT c.customer_name, r.total_spend, r.rnk\nFROM Ranked r\nJOIN customers c ON r.customer_id = c.customer_id\nWHERE r.rnk <= 3;",
    solutionSql: "WITH CustomerSpend AS (\n  SELECT customer_id, SUM(total_amount) AS total_spend\n  FROM orders\n  WHERE status = 'Completed'\n  GROUP BY customer_id\n),\nRanked AS (\n  SELECT customer_id, total_spend,\n    DENSE_RANK() OVER (ORDER BY total_spend DESC) AS rnk\n  FROM CustomerSpend\n)\nSELECT c.customer_name, r.total_spend, r.rnk\nFROM Ranked r\nJOIN customers c ON r.customer_id = c.customer_id\nWHERE r.rnk <= 3;"
  },
  {
    id: 'pat-17-7',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 17: CTEs and Subqueries',
    title: 'Products Priced Above Category Average',
    description: 'Find products priced higher than the average price of their own category using a correlated subquery.',
    hint: 'price > (SELECT AVG(price) FROM products p2 WHERE p2.category_id = p1.category_id).',
    starterSql: "SELECT p1.product_id, p1.product_name, p1.category_id, p1.price\nFROM products p1\nWHERE p1.price > (\n  SELECT AVG(price) FROM products p2 WHERE p2.category_id = p1.category_id\n);",
    solutionSql: "SELECT p1.product_id, p1.product_name, p1.category_id, p1.price\nFROM products p1\nWHERE p1.price > (\n  SELECT AVG(price) FROM products p2 WHERE p2.category_id = p1.category_id\n);"
  },
  {
    id: 'pat-17-8',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 17: CTEs and Subqueries',
    title: 'Derived Table in FROM Clause for Department Aggregation',
    description: 'Join departments with an inline derived table in the FROM clause that computes employee counts and average salaries.',
    hint: 'FROM departments d JOIN (SELECT dept_id, COUNT(*) AS cnt, AVG(salary) AS avg_sal FROM employees GROUP BY dept_id) e ON d.dept_id = e.dept_id.',
    starterSql: "SELECT d.dept_name, stats.emp_count, ROUND(stats.avg_salary, 2) AS avg_sal\nFROM departments d\nJOIN (\n  SELECT dept_id, COUNT(*) AS emp_count, AVG(salary) AS avg_salary\n  FROM employees\n  GROUP BY dept_id\n) stats ON d.dept_id = stats.dept_id;",
    solutionSql: "SELECT d.dept_name, stats.emp_count, ROUND(stats.avg_salary, 2) AS avg_sal\nFROM departments d\nJOIN (\n  SELECT dept_id, COUNT(*) AS emp_count, AVG(salary) AS avg_salary\n  FROM employees\n  GROUP BY dept_id\n) stats ON d.dept_id = stats.dept_id;"
  },
  {
    id: 'pat-17-9',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 17: CTEs and Subqueries',
    title: 'Subquery with ALL / NOT IN for Maximum Salary',
    description: 'Find the employee with the maximum salary using a subquery condition.',
    hint: 'WHERE salary = (SELECT MAX(salary) FROM employees).',
    starterSql: "SELECT emp_id, first_name, last_name, salary\nFROM employees\nWHERE salary = (SELECT MAX(salary) FROM employees);",
    solutionSql: "SELECT emp_id, first_name, last_name, salary\nFROM employees\nWHERE salary = (SELECT MAX(salary) FROM employees);"
  },
  {
    id: 'pat-17-10',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 17: CTEs and Subqueries',
    title: 'CTE to Identify Users with Sporadic Logins',
    description: 'Using a CTE that counts logins per user, find all users who logged in strictly fewer than 3 times.',
    hint: 'WITH UserCounts AS (SELECT user_id, COUNT(*) AS cnt FROM user_logins GROUP BY user_id) SELECT * FROM UserCounts WHERE cnt < 3.',
    starterSql: "WITH UserCounts AS (\n  SELECT user_id, COUNT(*) AS login_count\n  FROM user_logins\n  GROUP BY user_id\n)\nSELECT user_id, login_count\nFROM UserCounts\nWHERE login_count < 3;",
    solutionSql: "WITH UserCounts AS (\n  SELECT user_id, COUNT(*) AS login_count\n  FROM user_logins\n  GROUP BY user_id\n)\nSELECT user_id, login_count\nFROM UserCounts\nWHERE login_count < 3;"
  },

  // =========================================================================
  // 🎯 PATTERN 18: RECURSIVE CTES (10 Questions)
  // =========================================================================
  {
    id: 'pat-18-1',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 18: Recursive CTEs',
    title: 'Top-Down Organizational Hierarchy Depth',
    description: 'Use a RECURSIVE CTE to calculate the hierarchy level (1 for top leaders with manager_id IS NULL, 2 for direct reports, 3 for sub-reports) for every employee.',
    hint: 'WITH RECURSIVE Org AS (SELECT emp_id, first_name, manager_id, 1 AS level FROM employees WHERE manager_id IS NULL UNION ALL SELECT e.emp_id, e.first_name, e.manager_id, o.level + 1 FROM employees e JOIN Org o ON e.manager_id = o.emp_id).',
    starterSql: "WITH RECURSIVE Org AS (\n  SELECT emp_id, first_name, manager_id, 1 AS level\n  FROM employees\n  WHERE manager_id IS NULL\n  UNION ALL\n  SELECT e.emp_id, e.first_name, e.manager_id, o.level + 1\n  FROM employees e\n  JOIN Org o ON e.manager_id = o.emp_id\n)\nSELECT emp_id, first_name, manager_id, level\nFROM Org\nORDER BY level, emp_id;",
    solutionSql: "WITH RECURSIVE Org AS (\n  SELECT emp_id, first_name, manager_id, 1 AS level\n  FROM employees\n  WHERE manager_id IS NULL\n  UNION ALL\n  SELECT e.emp_id, e.first_name, e.manager_id, o.level + 1\n  FROM employees e\n  JOIN Org o ON e.manager_id = o.emp_id\n)\nSELECT emp_id, first_name, manager_id, level\nFROM Org\nORDER BY level, emp_id;"
  },
  {
    id: 'pat-18-2',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 18: Recursive CTEs',
    title: 'All Subordinates Under Satya Nadella (emp_id = 101)',
    description: 'Find all direct and indirect subordinates who report to Satya Nadella (emp_id = 101) at any level in the hierarchy.',
    hint: 'Anchor: WHERE manager_id = 101. Recursive step: JOIN Subordinates on e.manager_id = sub.emp_id.',
    starterSql: "WITH RECURSIVE Subordinates AS (\n  SELECT emp_id, first_name, manager_id, 1 AS level\n  FROM employees\n  WHERE manager_id = 101\n  UNION ALL\n  SELECT e.emp_id, e.first_name, e.manager_id, s.level + 1\n  FROM employees e\n  JOIN Subordinates s ON e.manager_id = s.emp_id\n)\nSELECT emp_id, first_name, manager_id, level\nFROM Subordinates\nORDER BY level, emp_id;",
    solutionSql: "WITH RECURSIVE Subordinates AS (\n  SELECT emp_id, first_name, manager_id, 1 AS level\n  FROM employees\n  WHERE manager_id = 101\n  UNION ALL\n  SELECT e.emp_id, e.first_name, e.manager_id, s.level + 1\n  FROM employees e\n  JOIN Subordinates s ON e.manager_id = s.emp_id\n)\nSELECT emp_id, first_name, manager_id, level\nFROM Subordinates\nORDER BY level, emp_id;"
  },
  {
    id: 'pat-18-3',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 18: Recursive CTEs',
    title: 'Generate Full Management Chain Path String',
    description: "Generate a concatenated path string showing the management tree from CEO down to employee (e.g. 'Satya -> Sundar -> Jeff').",
    hint: "Anchor: first_name AS path. Recursive: path || ' -> ' || e.first_name.",
    starterSql: "WITH RECURSIVE Tree AS (\n  SELECT emp_id, first_name, manager_id, first_name AS path\n  FROM employees\n  WHERE manager_id IS NULL\n  UNION ALL\n  SELECT e.emp_id, e.first_name, e.manager_id, t.path || ' -> ' || e.first_name\n  FROM employees e\n  JOIN Tree t ON e.manager_id = t.emp_id\n)\nSELECT emp_id, first_name, path\nFROM Tree\nORDER BY emp_id;",
    solutionSql: "WITH RECURSIVE Tree AS (\n  SELECT emp_id, first_name, manager_id, first_name AS path\n  FROM employees\n  WHERE manager_id IS NULL\n  UNION ALL\n  SELECT e.emp_id, e.first_name, e.manager_id, t.path || ' -> ' || e.first_name\n  FROM employees e\n  JOIN Tree t ON e.manager_id = t.emp_id\n)\nSELECT emp_id, first_name, path\nFROM Tree\nORDER BY emp_id;"
  },
  {
    id: 'pat-18-4',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 18: Recursive CTEs',
    title: 'Bottom-Up Chain from Jeff Dean to CEO',
    description: 'Trace the reporting chain upwards starting from Jeff Dean (emp_id = 107) up to the ultimate manager.',
    hint: 'Anchor: WHERE emp_id = 107. Recursive: JOIN employees m ON chain.manager_id = m.emp_id.',
    starterSql: "WITH RECURSIVE UpwardChain AS (\n  SELECT emp_id, first_name, manager_id, 1 AS step\n  FROM employees\n  WHERE emp_id = 107\n  UNION ALL\n  SELECT m.emp_id, m.first_name, m.manager_id, u.step + 1\n  FROM employees m\n  JOIN UpwardChain u ON u.manager_id = m.emp_id\n)\nSELECT emp_id, first_name, manager_id, step\nFROM UpwardChain\nORDER BY step;",
    solutionSql: "WITH RECURSIVE UpwardChain AS (\n  SELECT emp_id, first_name, manager_id, 1 AS step\n  FROM employees\n  WHERE emp_id = 107\n  UNION ALL\n  SELECT m.emp_id, m.first_name, m.manager_id, u.step + 1\n  FROM employees m\n  JOIN UpwardChain u ON u.manager_id = m.emp_id\n)\nSELECT emp_id, first_name, manager_id, step\nFROM UpwardChain\nORDER BY step;"
  },
  {
    id: 'pat-18-5',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 18: Recursive CTEs',
    title: 'Generate Sequence of Numbers 1 to 10',
    description: 'Use a RECURSIVE CTE to generate a series of numbers from 1 to 10 without referencing any physical table.',
    hint: 'WITH RECURSIVE Nums AS (SELECT 1 AS n UNION ALL SELECT n + 1 FROM Nums WHERE n < 10) SELECT n FROM Nums;',
    starterSql: "WITH RECURSIVE Nums AS (\n  SELECT 1 AS n\n  UNION ALL\n  SELECT n + 1\n  FROM Nums\n  WHERE n < 10\n)\nSELECT n\nFROM Nums;",
    solutionSql: "WITH RECURSIVE Nums AS (\n  SELECT 1 AS n\n  UNION ALL\n  SELECT n + 1\n  FROM Nums\n  WHERE n < 10\n)\nSELECT n\nFROM Nums;"
  },
  {
    id: 'pat-18-6',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 18: Recursive CTEs',
    title: 'Generate Calendar Dates from Sept 1 to Sept 7',
    description: "Generate a sequence of calendar dates from '2023-09-01' to '2023-09-07' using a recursive CTE with date() function.",
    hint: "SELECT '2023-09-01' AS dt UNION ALL SELECT date(dt, '+1 day') FROM Dates WHERE dt < '2023-09-07'.",
    starterSql: "WITH RECURSIVE Dates AS (\n  SELECT '2023-09-01' AS calendar_date\n  UNION ALL\n  SELECT date(calendar_date, '+1 day')\n  FROM Dates\n  WHERE calendar_date < '2023-09-07'\n)\nSELECT calendar_date\nFROM Dates;",
    solutionSql: "WITH RECURSIVE Dates AS (\n  SELECT '2023-09-01' AS calendar_date\n  UNION ALL\n  SELECT date(calendar_date, '+1 day')\n  FROM Dates\n  WHERE calendar_date < '2023-09-07'\n)\nSELECT calendar_date\nFROM Dates;"
  },
  {
    id: 'pat-18-7',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 18: Recursive CTEs',
    title: 'Find Maximum Hierarchy Depth of the Company',
    description: 'Find the maximum organizational depth level in the company hierarchy tree.',
    hint: 'SELECT MAX(level) AS max_depth FROM OrgHierarchyCTE;',
    starterSql: "WITH RECURSIVE Org AS (\n  SELECT emp_id, manager_id, 1 AS level\n  FROM employees\n  WHERE manager_id IS NULL\n  UNION ALL\n  SELECT e.emp_id, e.manager_id, o.level + 1\n  FROM employees e\n  JOIN Org o ON e.manager_id = o.emp_id\n)\nSELECT MAX(level) AS max_hierarchy_depth\nFROM Org;",
    solutionSql: "WITH RECURSIVE Org AS (\n  SELECT emp_id, manager_id, 1 AS level\n  FROM employees\n  WHERE manager_id IS NULL\n  UNION ALL\n  SELECT e.emp_id, e.manager_id, o.level + 1\n  FROM employees e\n  JOIN Org o ON e.manager_id = o.emp_id\n)\nSELECT MAX(level) AS max_hierarchy_depth\nFROM Org;"
  },
  {
    id: 'pat-18-8',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 18: Recursive CTEs',
    title: 'Count Employees at Each Hierarchy Level',
    description: 'Count how many employees are situated at each depth level (Level 1, Level 2, Level 3, etc.) in the company.',
    hint: 'GROUP BY level in the recursive org CTE.',
    starterSql: "WITH RECURSIVE Org AS (\n  SELECT emp_id, manager_id, 1 AS level\n  FROM employees\n  WHERE manager_id IS NULL\n  UNION ALL\n  SELECT e.emp_id, e.manager_id, o.level + 1\n  FROM employees e\n  JOIN Org o ON e.manager_id = o.emp_id\n)\nSELECT level, COUNT(*) AS employee_count\nFROM Org\nGROUP BY level\nORDER BY level;",
    solutionSql: "WITH RECURSIVE Org AS (\n  SELECT emp_id, manager_id, 1 AS level\n  FROM employees\n  WHERE manager_id IS NULL\n  UNION ALL\n  SELECT e.emp_id, e.manager_id, o.level + 1\n  FROM employees e\n  JOIN Org o ON e.manager_id = o.emp_id\n)\nSELECT level, COUNT(*) AS employee_count\nFROM Org\nGROUP BY level\nORDER BY level;"
  },
  {
    id: 'pat-18-9',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 18: Recursive CTEs',
    title: 'Total Headcount Under Each Top Executive',
    description: 'For each executive with manager_id IS NULL, count total subordinates reporting under their tree.',
    hint: 'Anchor with top exec id, then group by top_exec_id.',
    starterSql: "WITH RECURSIVE Branch AS (\n  SELECT emp_id AS exec_id, emp_id\n  FROM employees\n  WHERE manager_id IS NULL\n  UNION ALL\n  SELECT b.exec_id, e.emp_id\n  FROM employees e\n  JOIN Branch b ON e.manager_id = b.emp_id\n)\nSELECT exec_id, COUNT(*) - 1 AS subordinates_count\nFROM Branch\nGROUP BY exec_id;",
    solutionSql: "WITH RECURSIVE Branch AS (\n  SELECT emp_id AS exec_id, emp_id\n  FROM employees\n  WHERE manager_id IS NULL\n  UNION ALL\n  SELECT b.exec_id, e.emp_id\n  FROM employees e\n  JOIN Branch b ON e.manager_id = b.emp_id\n)\nSELECT exec_id, COUNT(*) - 1 AS subordinates_count\nFROM Branch\nGROUP BY exec_id;"
  },
  {
    id: 'pat-18-10',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 18: Recursive CTEs',
    title: 'Identify Leaf Employees (No Subordinates)',
    description: 'Find all employees who have zero subordinates reporting to them (leaf nodes in the org hierarchy).',
    hint: 'SELECT emp_id, first_name FROM employees WHERE emp_id NOT IN (SELECT DISTINCT manager_id FROM employees WHERE manager_id IS NOT NULL);',
    starterSql: "SELECT emp_id, first_name, last_name\nFROM employees\nWHERE emp_id NOT IN (\n  SELECT DISTINCT manager_id FROM employees WHERE manager_id IS NOT NULL\n)\nORDER BY emp_id;",
    solutionSql: "SELECT emp_id, first_name, last_name\nFROM employees\nWHERE emp_id NOT IN (\n  SELECT DISTINCT manager_id FROM employees WHERE manager_id IS NOT NULL\n)\nORDER BY emp_id;"
  },

  // =========================================================================
  // 🎯 PATTERN 19: MEDIAN AND PERCENTILES (10 Questions)
  // =========================================================================
  {
    id: 'pat-19-1',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 19: Median and Percentiles',
    title: 'Calculate Median Employee Salary',
    description: 'Calculate the median salary of all employees using ROW_NUMBER() and COUNT(*) window functions.',
    hint: 'Filter where row_number IN ((total_count + 1) / 2, (total_count + 2) / 2) and take AVG(salary).',
    starterSql: "WITH Ranked AS (\n  SELECT salary,\n    ROW_NUMBER() OVER (ORDER BY salary ASC) AS r,\n    COUNT(*) OVER () AS total_count\n  FROM employees\n)\nSELECT ROUND(AVG(salary), 2) AS median_salary\nFROM Ranked\nWHERE r IN ((total_count + 1) / 2, (total_count + 2) / 2);",
    solutionSql: "WITH Ranked AS (\n  SELECT salary,\n    ROW_NUMBER() OVER (ORDER BY salary ASC) AS r,\n    COUNT(*) OVER () AS total_count\n  FROM employees\n)\nSELECT ROUND(AVG(salary), 2) AS median_salary\nFROM Ranked\nWHERE r IN ((total_count + 1) / 2, (total_count + 2) / 2);"
  },
  {
    id: 'pat-19-2',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 19: Median and Percentiles',
    title: 'Median Product Price in Catalog',
    description: 'Calculate the median price of products in the catalog using row numbers.',
    hint: 'Filter row_number IN ((total + 1)/2, (total + 2)/2) on products.',
    starterSql: "WITH Ranked AS (\n  SELECT price,\n    ROW_NUMBER() OVER (ORDER BY price ASC) AS r,\n    COUNT(*) OVER () AS total_count\n  FROM products\n)\nSELECT ROUND(AVG(price), 2) AS median_price\nFROM Ranked\nWHERE r IN ((total_count + 1) / 2, (total_count + 2) / 2);",
    solutionSql: "WITH Ranked AS (\n  SELECT price,\n    ROW_NUMBER() OVER (ORDER BY price ASC) AS r,\n    COUNT(*) OVER () AS total_count\n  FROM products\n)\nSELECT ROUND(AVG(price), 2) AS median_price\nFROM Ranked\nWHERE r IN ((total_count + 1) / 2, (total_count + 2) / 2);"
  },
  {
    id: 'pat-19-3',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 19: Median and Percentiles',
    title: 'Median Completed Order Amount',
    description: 'Find the median total_amount across all completed orders.',
    hint: "Filter status = 'Completed' before ranking total_amount.",
    starterSql: "WITH Ranked AS (\n  SELECT total_amount,\n    ROW_NUMBER() OVER (ORDER BY total_amount ASC) AS r,\n    COUNT(*) OVER () AS total_count\n  FROM orders\n  WHERE status = 'Completed'\n)\nSELECT ROUND(AVG(total_amount), 2) AS median_order_amount\nFROM Ranked\nWHERE r IN ((total_count + 1) / 2, (total_count + 2) / 2);",
    solutionSql: "WITH Ranked AS (\n  SELECT total_amount,\n    ROW_NUMBER() OVER (ORDER BY total_amount ASC) AS r,\n    COUNT(*) OVER () AS total_count\n  FROM orders\n  WHERE status = 'Completed'\n)\nSELECT ROUND(AVG(total_amount), 2) AS median_order_amount\nFROM Ranked\nWHERE r IN ((total_count + 1) / 2, (total_count + 2) / 2);"
  },
  {
    id: 'pat-19-4',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 19: Median and Percentiles',
    title: 'Median Salary in Engineering Department',
    description: 'Calculate the median salary specifically within Department 1 (Engineering).',
    hint: 'WHERE dept_id = 1 inside the ranking CTE.',
    starterSql: "WITH Ranked AS (\n  SELECT salary,\n    ROW_NUMBER() OVER (ORDER BY salary ASC) AS r,\n    COUNT(*) OVER () AS total_count\n  FROM employees\n  WHERE dept_id = 1\n)\nSELECT ROUND(AVG(salary), 2) AS median_eng_salary\nFROM Ranked\nWHERE r IN ((total_count + 1) / 2, (total_count + 2) / 2);",
    solutionSql: "WITH Ranked AS (\n  SELECT salary,\n    ROW_NUMBER() OVER (ORDER BY salary ASC) AS r,\n    COUNT(*) OVER () AS total_count\n  FROM employees\n  WHERE dept_id = 1\n)\nSELECT ROUND(AVG(salary), 2) AS median_eng_salary\nFROM Ranked\nWHERE r IN ((total_count + 1) / 2, (total_count + 2) / 2);"
  },
  {
    id: 'pat-19-5',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 19: Median and Percentiles',
    title: 'Compare Average Salary vs Median Salary',
    description: 'Calculate both the average salary and the median salary in the same query to assess distribution skewness.',
    hint: 'Combine scalar subquery of AVG with median calculation.',
    starterSql: "WITH Ranked AS (\n  SELECT salary,\n    ROW_NUMBER() OVER (ORDER BY salary ASC) AS r,\n    COUNT(*) OVER () AS total_count\n  FROM employees\n)\nSELECT\n  (SELECT ROUND(AVG(salary), 2) FROM employees) AS avg_salary,\n  ROUND(AVG(salary), 2) AS median_salary\nFROM Ranked\nWHERE r IN ((total_count + 1) / 2, (total_count + 2) / 2);",
    solutionSql: "WITH Ranked AS (\n  SELECT salary,\n    ROW_NUMBER() OVER (ORDER BY salary ASC) AS r,\n    COUNT(*) OVER () AS total_count\n  FROM employees\n)\nSELECT\n  (SELECT ROUND(AVG(salary), 2) FROM employees) AS avg_salary,\n  ROUND(AVG(salary), 2) AS median_salary\nFROM Ranked\nWHERE r IN ((total_count + 1) / 2, (total_count + 2) / 2);"
  },
  {
    id: 'pat-19-6',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 19: Median and Percentiles',
    title: 'Median Daily Website Visits',
    description: 'Calculate the median number of daily website visits recorded in daily_metrics.',
    hint: 'Rank visits and extract the midpoint rows.',
    starterSql: "WITH Ranked AS (\n  SELECT visits,\n    ROW_NUMBER() OVER (ORDER BY visits ASC) AS r,\n    COUNT(*) OVER () AS total_count\n  FROM daily_metrics\n)\nSELECT ROUND(AVG(visits), 1) AS median_visits\nFROM Ranked\nWHERE r IN ((total_count + 1) / 2, (total_count + 2) / 2);",
    solutionSql: "WITH Ranked AS (\n  SELECT visits,\n    ROW_NUMBER() OVER (ORDER BY visits ASC) AS r,\n    COUNT(*) OVER () AS total_count\n  FROM daily_metrics\n)\nSELECT ROUND(AVG(visits), 1) AS median_visits\nFROM Ranked\nWHERE r IN ((total_count + 1) / 2, (total_count + 2) / 2);"
  },
  {
    id: 'pat-19-7',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 19: Median and Percentiles',
    title: 'Median Transaction Amount on Account 9001',
    description: 'Calculate the median transaction amount for account_id 9001.',
    hint: 'WHERE account_id = 9001 on transactions.',
    starterSql: "WITH Ranked AS (\n  SELECT amount,\n    ROW_NUMBER() OVER (ORDER BY amount ASC) AS r,\n    COUNT(*) OVER () AS total_count\n  FROM transactions\n  WHERE account_id = 9001\n)\nSELECT ROUND(AVG(amount), 2) AS median_txn_amount\nFROM Ranked\nWHERE r IN ((total_count + 1) / 2, (total_count + 2) / 2);",
    solutionSql: "WITH Ranked AS (\n  SELECT amount,\n    ROW_NUMBER() OVER (ORDER BY amount ASC) AS r,\n    COUNT(*) OVER () AS total_count\n  FROM transactions\n  WHERE account_id = 9001\n)\nSELECT ROUND(AVG(amount), 2) AS median_txn_amount\nFROM Ranked\nWHERE r IN ((total_count + 1) / 2, (total_count + 2) / 2);"
  },
  {
    id: 'pat-19-8',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 19: Median and Percentiles',
    title: 'NTILE(4) Quartile Assignment for Employees',
    description: 'Assign each employee into salary quartiles 1 to 4 using the NTILE(4) window function. Show first_name, salary, and quartile.',
    hint: 'NTILE(4) OVER (ORDER BY salary ASC) AS salary_quartile.',
    starterSql: "SELECT first_name, salary,\n  NTILE(4) OVER (ORDER BY salary ASC) AS salary_quartile\nFROM employees\nORDER BY salary ASC;",
    solutionSql: "SELECT first_name, salary,\n  NTILE(4) OVER (ORDER BY salary ASC) AS salary_quartile\nFROM employees\nORDER BY salary ASC;"
  },
  {
    id: 'pat-19-9',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 19: Median and Percentiles',
    title: 'Upper Quartile (75th Percentile) Salary',
    description: 'Approximate the 75th percentile salary using NTILE(4) or row number ratio.',
    hint: 'Select the boundary salary where quartile = 4 begins.',
    starterSql: "WITH Quartiles AS (\n  SELECT salary, NTILE(4) OVER (ORDER BY salary ASC) AS q\n  FROM employees\n)\nSELECT MIN(salary) AS q3_75th_percentile_salary\nFROM Quartiles\nWHERE q = 4;",
    solutionSql: "WITH Quartiles AS (\n  SELECT salary, NTILE(4) OVER (ORDER BY salary ASC) AS q\n  FROM employees\n)\nSELECT MIN(salary) AS q3_75th_percentile_salary\nFROM Quartiles\nWHERE q = 4;"
  },
  {
    id: 'pat-19-10',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 19: Median and Percentiles',
    title: 'Lower Quartile (25th Percentile) Salary',
    description: 'Approximate the 25th percentile salary boundary using NTILE(4).',
    hint: 'Select the maximum salary in quartile 1.',
    starterSql: "WITH Quartiles AS (\n  SELECT salary, NTILE(4) OVER (ORDER BY salary ASC) AS q\n  FROM employees\n)\nSELECT MAX(salary) AS q1_25th_percentile_salary\nFROM Quartiles\nWHERE q = 1;",
    solutionSql: "WITH Quartiles AS (\n  SELECT salary, NTILE(4) OVER (ORDER BY salary ASC) AS q\n  FROM employees\n)\nSELECT MAX(salary) AS q1_25th_percentile_salary\nFROM Quartiles\nWHERE q = 1;"
  },

  // =========================================================================
  // 🎯 PATTERN 20: JOINS WITH AGGREGATES (FAN-OUT TRAP) (10 Questions)
  // =========================================================================
  {
    id: 'pat-20-1',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 20: Joins with Aggregates',
    title: 'Customer Total Orders and Total Distinct Products (Fan-Out Prevention)',
    description: 'For each customer, calculate their total order count and total distinct products purchased without multiplying counts.',
    hint: 'Use COUNT(DISTINCT o.order_id) and COUNT(DISTINCT oi.product_id).',
    starterSql: "SELECT c.customer_id, c.customer_name,\n  COUNT(DISTINCT o.order_id) AS total_orders,\n  COUNT(DISTINCT oi.product_id) AS distinct_products_bought\nFROM customers c\nLEFT JOIN orders o ON c.customer_id = o.customer_id\nLEFT JOIN order_items oi ON o.order_id = oi.order_id\nGROUP BY c.customer_id, c.customer_name\nORDER BY total_orders DESC;",
    solutionSql: "SELECT c.customer_id, c.customer_name,\n  COUNT(DISTINCT o.order_id) AS total_orders,\n  COUNT(DISTINCT oi.product_id) AS distinct_products_bought\nFROM customers c\nLEFT JOIN orders o ON c.customer_id = o.customer_id\nLEFT JOIN order_items oi ON o.order_id = oi.order_id\nGROUP BY c.customer_id, c.customer_name\nORDER BY total_orders DESC;"
  },
  {
    id: 'pat-20-2',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 20: Joins with Aggregates',
    title: 'Pre-Aggregate Orders Before Joining Customers (Best Practice)',
    description: 'Pre-aggregate completed order counts and total spend in a CTE, then join with customers to eliminate fan-out.',
    hint: 'WITH AggOrders AS (SELECT customer_id, COUNT(*) AS cnt, SUM(total_amount) AS spend FROM orders WHERE status="Completed" GROUP BY customer_id) SELECT ... FROM customers c LEFT JOIN AggOrders a ON c.customer_id = a.customer_id.',
    starterSql: "WITH AggOrders AS (\n  SELECT customer_id,\n    COUNT(*) AS total_orders,\n    SUM(total_amount) AS total_spend\n  FROM orders\n  WHERE status = 'Completed'\n  GROUP BY customer_id\n)\nSELECT c.customer_id, c.customer_name,\n  COALESCE(a.total_orders, 0) AS orders_count,\n  COALESCE(a.total_spend, 0.0) AS total_spent\nFROM customers c\nLEFT JOIN AggOrders a ON c.customer_id = a.customer_id\nORDER BY total_spent DESC;",
    solutionSql: "WITH AggOrders AS (\n  SELECT customer_id,\n    COUNT(*) AS total_orders,\n    SUM(total_amount) AS total_spend\n  FROM orders\n  WHERE status = 'Completed'\n  GROUP BY customer_id\n)\nSELECT c.customer_id, c.customer_name,\n  COALESCE(a.total_orders, 0) AS orders_count,\n  COALESCE(a.total_spend, 0.0) AS total_spent\nFROM customers c\nLEFT JOIN AggOrders a ON c.customer_id = a.customer_id\nORDER BY total_spent DESC;"
  },
  {
    id: 'pat-20-3',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 20: Joins with Aggregates',
    title: 'Department Payroll Joined with Department Headcount',
    description: 'Pre-aggregate employee statistics (count and payroll sum) in a CTE, then join with departments.',
    hint: 'WITH EmpStats AS (SELECT dept_id, COUNT(*) AS cnt, SUM(salary) AS total_sal FROM employees GROUP BY dept_id) SELECT d.dept_name, e.cnt, e.total_sal FROM departments d JOIN EmpStats e ON d.dept_id = e.dept_id.',
    starterSql: "WITH EmpStats AS (\n  SELECT dept_id, COUNT(*) AS emp_count, SUM(salary) AS total_payroll\n  FROM employees\n  GROUP BY dept_id\n)\nSELECT d.dept_id, d.dept_name, s.emp_count, s.total_payroll\nFROM departments d\nJOIN EmpStats s ON d.dept_id = s.dept_id\nORDER BY s.total_payroll DESC;",
    solutionSql: "WITH EmpStats AS (\n  SELECT dept_id, COUNT(*) AS emp_count, SUM(salary) AS total_payroll\n  FROM employees\n  GROUP BY dept_id\n)\nSELECT d.dept_id, d.dept_name, s.emp_count, s.total_payroll\nFROM departments d\nJOIN EmpStats s ON d.dept_id = s.dept_id\nORDER BY s.total_payroll DESC;"
  },
  {
    id: 'pat-20-4',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 20: Joins with Aggregates',
    title: 'Products Sold Quantity without Duplicating Product Price',
    description: 'Calculate total units sold per product in order_items and join product details cleanly.',
    hint: 'JOIN order_items and GROUP BY p.product_id, p.product_name, p.price.',
    starterSql: "SELECT p.product_id, p.product_name, p.price,\n  SUM(oi.quantity) AS total_units_sold\nFROM products p\nJOIN order_items oi ON p.product_id = oi.product_id\nGROUP BY p.product_id, p.product_name, p.price\nORDER BY total_units_sold DESC;",
    solutionSql: "SELECT p.product_id, p.product_name, p.price,\n  SUM(oi.quantity) AS total_units_sold\nFROM products p\nJOIN order_items oi ON p.product_id = oi.product_id\nGROUP BY p.product_id, p.product_name, p.price\nORDER BY total_units_sold DESC;"
  },
  {
    id: 'pat-20-5',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 20: Joins with Aggregates',
    title: 'Order Header Total vs Sum of Order Items',
    description: 'Verify order totals: Compare orders.total_amount against the calculated SUM(quantity * unit_price) from order_items.',
    hint: 'JOIN order_items on order_id GROUP BY o.order_id, o.total_amount.',
    starterSql: "SELECT o.order_id, o.total_amount AS recorded_total,\n  SUM(oi.quantity * oi.unit_price) AS calculated_items_total\nFROM orders o\nJOIN order_items oi ON o.order_id = oi.order_id\nGROUP BY o.order_id, o.total_amount\nORDER BY o.order_id;",
    solutionSql: "SELECT o.order_id, o.total_amount AS recorded_total,\n  SUM(oi.quantity * oi.unit_price) AS calculated_items_total\nFROM orders o\nJOIN order_items oi ON o.order_id = oi.order_id\nGROUP BY o.order_id, o.total_amount\nORDER BY o.order_id;"
  },
  {
    id: 'pat-20-6',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 20: Joins with Aggregates',
    title: 'Category Product Count and Total Catalog Valuation',
    description: 'Pre-aggregate products by category in a CTE, then join with categories.',
    hint: 'WITH ProdAgg AS (SELECT category_id, COUNT(*) AS p_count, SUM(price) AS val FROM products GROUP BY category_id) SELECT ... FROM categories c JOIN ProdAgg p ON c.category_id = p.category_id.',
    starterSql: "WITH ProdAgg AS (\n  SELECT category_id, COUNT(*) AS product_count, SUM(price) AS total_val\n  FROM products\n  GROUP BY category_id\n)\nSELECT c.category_id, c.category_name, p.product_count, p.total_val\nFROM categories c\nJOIN ProdAgg p ON c.category_id = p.category_id\nORDER BY p.total_val DESC;",
    solutionSql: "WITH ProdAgg AS (\n  SELECT category_id, COUNT(*) AS product_count, SUM(price) AS total_val\n  FROM products\n  GROUP BY category_id\n)\nSELECT c.category_id, c.category_name, p.product_count, p.total_val\nFROM categories c\nJOIN ProdAgg p ON c.category_id = p.category_id\nORDER BY p.total_val DESC;"
  },
  {
    id: 'pat-20-7',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 20: Joins with Aggregates',
    title: 'Customer Order Count vs Items Count without Multiplication Trap',
    description: 'Count distinct orders and total line items ordered for customer_id = 1 without cross-product multiplication.',
    hint: 'Use COUNT(DISTINCT o.order_id) and COUNT(oi.product_id).',
    starterSql: "SELECT o.customer_id,\n  COUNT(DISTINCT o.order_id) AS distinct_orders,\n  COUNT(oi.product_id) AS total_line_items\nFROM orders o\nJOIN order_items oi ON o.order_id = oi.order_id\nWHERE o.customer_id = 1\nGROUP BY o.customer_id;",
    solutionSql: "SELECT o.customer_id,\n  COUNT(DISTINCT o.order_id) AS distinct_orders,\n  COUNT(oi.product_id) AS total_line_items\nFROM orders o\nJOIN order_items oi ON o.order_id = oi.order_id\nWHERE o.customer_id = 1\nGROUP BY o.customer_id;"
  },
  {
    id: 'pat-20-8',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 20: Joins with Aggregates',
    title: 'Pre-Aggregated User Login Count Joined with Customer Profile',
    description: 'Pre-aggregate user_logins count in a CTE and left-join with customer profiles (user_id = customer_id).',
    hint: 'WITH Logins AS (SELECT user_id, COUNT(*) AS cnt FROM user_logins GROUP BY user_id) SELECT c.customer_name, COALESCE(l.cnt, 0) FROM customers c LEFT JOIN Logins l ON c.customer_id = l.user_id.',
    starterSql: "WITH Logins AS (\n  SELECT user_id, COUNT(*) AS login_count\n  FROM user_logins\n  GROUP BY user_id\n)\nSELECT c.customer_id, c.customer_name, COALESCE(l.login_count, 0) AS total_logins\nFROM customers c\nLEFT JOIN Logins l ON c.customer_id = l.user_id\nORDER BY total_logins DESC;",
    solutionSql: "WITH Logins AS (\n  SELECT user_id, COUNT(*) AS login_count\n  FROM user_logins\n  GROUP BY user_id\n)\nSELECT c.customer_id, c.customer_name, COALESCE(l.login_count, 0) AS total_logins\nFROM customers c\nLEFT JOIN Logins l ON c.customer_id = l.user_id\nORDER BY total_logins DESC;"
  },
  {
    id: 'pat-20-9',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Pattern 20: Joins with Aggregates',
    title: 'Bank Account Total Transactions and Net Balance',
    description: 'Aggregate transactions per account: show account_id, transaction count, and net sum amount.',
    hint: 'GROUP BY account_id with COUNT(*) and SUM(amount).',
    starterSql: "SELECT account_id, COUNT(*) AS txn_count, SUM(amount) AS net_balance\nFROM transactions\nGROUP BY account_id\nORDER BY account_id;",
    solutionSql: "SELECT account_id, COUNT(*) AS txn_count, SUM(amount) AS net_balance\nFROM transactions\nGROUP BY account_id\nORDER BY account_id;"
  },
  {
    id: 'pat-20-10',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Pattern 20: Joins with Aggregates',
    title: 'Accurate Category Revenue from Order Items',
    description: 'Calculate total revenue generated per product category from order_items without double counting.',
    hint: 'JOIN order_items oi on p.product_id = oi.product_id, JOIN categories c on p.category_id = c.category_id, SUM(oi.quantity * oi.unit_price).',
    starterSql: "SELECT c.category_id, c.category_name,\n  SUM(oi.quantity * oi.unit_price) AS total_category_revenue\nFROM categories c\nJOIN products p ON c.category_id = p.category_id\nJOIN order_items oi ON p.product_id = oi.product_id\nGROUP BY c.category_id, c.category_name\nORDER BY total_category_revenue DESC;",
    solutionSql: "SELECT c.category_id, c.category_name,\n  SUM(oi.quantity * oi.unit_price) AS total_category_revenue\nFROM categories c\nJOIN products p ON c.category_id = p.category_id\nJOIN order_items oi ON p.product_id = oi.product_id\nGROUP BY c.category_id, c.category_name\nORDER BY total_category_revenue DESC;"
  }
];
