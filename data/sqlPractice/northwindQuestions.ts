import { SqlQuestion } from '../sqlPracticeData';

export const NORTHWIND_QUESTIONS: SqlQuestion[] = [
  // ==========================================
  // 🏢 NORTHWIND / ENTERPRISE - Easy
  // ==========================================
  {
    id: 'ent-easy-1',
    database: 'enterprise',
    difficulty: 'Easy',
    category: 'Filtering',
    title: 'High-Earning Engineers',
    description: 'Show first_name, last_name, and salary of all employees in Engineering (department_id = 1) earning more than 135,000. Order by salary descending.',
    hint: 'Combine department_id = 1 AND salary > 135000 in your WHERE clause.',
    starterSql: "SELECT first_name, last_name, salary\nFROM employees\nWHERE department_id = 1 AND salary > 135000\nORDER BY salary DESC;",
    solutionSql: "SELECT first_name, last_name, salary\nFROM employees\nWHERE department_id = 1 AND salary > 135000\nORDER BY salary DESC;"
  },
  {
    id: 'ent-easy-2',
    database: 'enterprise',
    difficulty: 'Easy',
    category: 'Aggregation',
    title: 'Department Average Salary',
    description: 'Show department_id, count of employees, and the average salary rounded to whole number for each department.',
    hint: 'Use COUNT(*) and ROUND(AVG(salary)) GROUP BY department_id.',
    starterSql: "SELECT department_id, COUNT(*) AS emp_count, ROUND(AVG(salary)) AS avg_salary\nFROM employees\nGROUP BY department_id;",
    solutionSql: "SELECT department_id, COUNT(*) AS emp_count, ROUND(AVG(salary)) AS avg_salary\nFROM employees\nGROUP BY department_id;"
  },
  {
    id: 'ent-easy-3',
    database: 'enterprise',
    difficulty: 'Easy',
    category: 'NULL Handling',
    title: 'Top-Level Executives (No Manager)',
    description: 'Show first_name, last_name, and email of all leadership employees who do not have a manager (manager_id is NULL).',
    hint: 'Compare null values using IS NULL.',
    starterSql: "SELECT first_name, last_name, email\nFROM employees\nWHERE manager_id IS NULL;",
    solutionSql: "SELECT first_name, last_name, email\nFROM employees\nWHERE manager_id IS NULL;"
  },
  {
    id: 'ent-easy-4',
    database: 'enterprise',
    difficulty: 'Easy',
    category: 'Sorting',
    title: 'Projects Ordered by Budget',
    description: 'Show project_name and budget for all strategic company initiatives, ordered from highest budget to lowest.',
    hint: 'ORDER BY budget DESC.',
    starterSql: "SELECT project_name, budget\nFROM projects\nORDER BY budget DESC;",
    solutionSql: "SELECT project_name, budget\nFROM projects\nORDER BY budget DESC;"
  },
  {
    id: 'ent-easy-5',
    database: 'enterprise',
    difficulty: 'Easy',
    category: 'Pattern Matching',
    title: 'Enterprise Email Domain Verification',
    description: "Show employee_id, first_name, and email of all staff whose email address ends with '@enterprise.io'.",
    hint: "Use LIKE '%@enterprise.io'.",
    starterSql: "SELECT employee_id, first_name, email\nFROM employees\nWHERE email LIKE '%@enterprise.io';",
    solutionSql: "SELECT employee_id, first_name, email\nFROM employees\nWHERE email LIKE '%@enterprise.io';"
  },
  {
    id: 'ent-easy-6',
    database: 'enterprise',
    difficulty: 'Easy',
    category: 'Date Filtering',
    title: 'Recent Hires (Since 2022)',
    description: "Show first_name, last_name, and hire_date of employees hired on or after '2022-01-01'.",
    hint: "WHERE hire_date >= '2022-01-01' ORDER BY hire_date ASC.",
    starterSql: "SELECT first_name, last_name, hire_date\nFROM employees\nWHERE hire_date >= '2022-01-01'\nORDER BY hire_date ASC;",
    solutionSql: "SELECT first_name, last_name, hire_date\nFROM employees\nWHERE hire_date >= '2022-01-01'\nORDER BY hire_date ASC;"
  },

  // ==========================================
  // 🏢 NORTHWIND / ENTERPRISE - Medium
  // ==========================================
  {
    id: 'ent-med-7',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Joins',
    title: 'Employees with Department Name and City',
    description: 'Show employee first_name, last_name, salary, department_name, and department location by joining employees with departments.',
    hint: 'INNER JOIN employees e ON e.department_id = d.department_id.',
    starterSql: "SELECT e.first_name, e.last_name, e.salary, d.department_name, d.location\nFROM employees e\nJOIN departments d ON e.department_id = d.department_id;",
    solutionSql: "SELECT e.first_name, e.last_name, e.salary, d.department_name, d.location\nFROM employees e\nJOIN departments d ON e.department_id = d.department_id;"
  },
  {
    id: 'ent-med-8',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Subqueries',
    title: 'Employees Earning Above Department Average',
    description: 'Find all employees who earn more than the average salary of their respective department.',
    hint: 'Correlated subquery: salary > (SELECT AVG(salary) FROM employees e2 WHERE e2.department_id = e1.department_id).',
    starterSql: "SELECT e1.first_name, e1.last_name, e1.salary, e1.department_id\nFROM employees e1\nWHERE e1.salary > (\n  SELECT AVG(salary) FROM employees e2 WHERE e2.department_id = e1.department_id\n);",
    solutionSql: "SELECT e1.first_name, e1.last_name, e1.salary, e1.department_id\nFROM employees e1\nWHERE e1.salary > (\n  SELECT AVG(salary) FROM employees e2 WHERE e2.department_id = e1.department_id\n);"
  },
  {
    id: 'ent-med-9',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Multi-table Joins',
    title: 'Project Hours Allocation Breakdown',
    description: 'Show project_name, employee first_name, and hours_allocated for all projects with a budget exceeding 150,000.',
    hint: 'JOIN projects with employee_projects on project_id, then JOIN employees on employee_id.',
    starterSql: "SELECT pr.project_name, e.first_name, ep.hours_allocated\nFROM projects pr\nJOIN employee_projects ep ON pr.project_id = ep.project_id\nJOIN employees e ON ep.employee_id = e.employee_id\nWHERE pr.budget > 150000\nORDER BY pr.project_name, ep.hours_allocated DESC;",
    solutionSql: "SELECT pr.project_name, e.first_name, ep.hours_allocated\nFROM projects pr\nJOIN employee_projects ep ON pr.project_id = ep.project_id\nJOIN employees e ON ep.employee_id = e.employee_id\nWHERE pr.budget > 150000\nORDER BY pr.project_name, ep.hours_allocated DESC;"
  },
  {
    id: 'ent-med-10',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Self Joins',
    title: 'Direct Report Count per Manager',
    description: 'For each manager, show their manager_id, full_name, and total count of direct reports who report to them.',
    hint: 'JOIN employees m (as manager) with employees e (as report) ON m.employee_id = e.manager_id GROUP BY m.employee_id.',
    starterSql: "SELECT m.employee_id AS manager_id, m.first_name || ' ' || m.last_name AS manager_name, COUNT(e.employee_id) AS direct_reports\nFROM employees m\nJOIN employees e ON m.employee_id = e.manager_id\nGROUP BY m.employee_id\nORDER BY direct_reports DESC;",
    solutionSql: "SELECT m.employee_id AS manager_id, m.first_name || ' ' || m.last_name AS manager_name, COUNT(e.employee_id) AS direct_reports\nFROM employees m\nJOIN employees e ON m.employee_id = e.manager_id\nGROUP BY m.employee_id\nORDER BY direct_reports DESC;"
  },
  {
    id: 'ent-med-11',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Aggregation & HAVING',
    title: 'High Workload Projects',
    description: 'Find all projects where the total hours allocated across all assigned employees exceeds 50 hours. Show project_name and total_hours.',
    hint: 'GROUP BY pr.project_name HAVING SUM(ep.hours_allocated) > 50.',
    starterSql: "SELECT pr.project_name, SUM(ep.hours_allocated) AS total_hours\nFROM projects pr\nJOIN employee_projects ep ON pr.project_id = ep.project_id\nGROUP BY pr.project_name\nHAVING SUM(ep.hours_allocated) > 50;",
    solutionSql: "SELECT pr.project_name, SUM(ep.hours_allocated) AS total_hours\nFROM projects pr\nJOIN employee_projects ep ON pr.project_id = ep.project_id\nGROUP BY pr.project_name\nHAVING SUM(ep.hours_allocated) > 50;"
  },
  {
    id: 'ent-med-12',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Anti-joins',
    title: 'Employees with No Project Assignments',
    description: 'Show employee_id, first_name, and last_name of all employees who have not been allocated to any project.',
    hint: 'Use NOT IN (SELECT DISTINCT employee_id FROM employee_projects) or LEFT JOIN ... WHERE ep.project_id IS NULL.',
    starterSql: "SELECT employee_id, first_name, last_name\nFROM employees\nWHERE employee_id NOT IN (SELECT DISTINCT employee_id FROM employee_projects);",
    solutionSql: "SELECT employee_id, first_name, last_name\nFROM employees\nWHERE employee_id NOT IN (SELECT DISTINCT employee_id FROM employee_projects);"
  },
  {
    id: 'ent-med-13',
    database: 'enterprise',
    difficulty: 'Medium',
    category: 'Conditional Aggregation',
    title: 'Salary Tier Distribution',
    description: "Categorize employees into salary tiers: 'High' (>= 140000), 'Mid' (115000 to 139999), and 'Entry' (< 115000). Show salary_tier and count of employees.",
    hint: "Use CASE WHEN in GROUP BY or subquery.",
    starterSql: "SELECT\n  CASE\n    WHEN salary >= 140000 THEN 'High'\n    WHEN salary >= 115000 THEN 'Mid'\n    ELSE 'Entry'\n  END AS salary_tier,\n  COUNT(*) AS employee_count\nFROM employees\nGROUP BY salary_tier\nORDER BY employee_count DESC;",
    solutionSql: "SELECT\n  CASE\n    WHEN salary >= 140000 THEN 'High'\n    WHEN salary >= 115000 THEN 'Mid'\n    ELSE 'Entry'\n  END AS salary_tier,\n  COUNT(*) AS employee_count\nFROM employees\nGROUP BY salary_tier\nORDER BY employee_count DESC;"
  },

  // ==========================================
  // 🏢 NORTHWIND / ENTERPRISE - Hard
  // ==========================================
  {
    id: 'ent-hard-14',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Window Ranking',
    title: 'Top Paid Employee per Department',
    description: 'Find the highest paid employee(s) in each department using DENSE_RANK(). Show department_name, first_name, and salary.',
    hint: 'Use a CTE or subquery with DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as rnk WHERE rnk = 1.',
    starterSql: "WITH RankedSalaries AS (\n  SELECT d.department_name, e.first_name, e.salary,\n    DENSE_RANK() OVER (PARTITION BY e.department_id ORDER BY e.salary DESC) AS rnk\n  FROM employees e\n  JOIN departments d ON e.department_id = d.department_id\n)\nSELECT department_name, first_name, salary\nFROM RankedSalaries\nWHERE rnk = 1;",
    solutionSql: "WITH RankedSalaries AS (\n  SELECT d.department_name, e.first_name, e.salary,\n    DENSE_RANK() OVER (PARTITION BY e.department_id ORDER BY e.salary DESC) AS rnk\n  FROM employees e\n  JOIN departments d ON e.department_id = d.department_id\n)\nSELECT department_name, first_name, salary\nFROM RankedSalaries\nWHERE rnk = 1;"
  },
  {
    id: 'ent-hard-15',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Window Functions (LEAD)',
    title: 'Salary Difference to Next Senior Peer',
    description: 'Use the LEAD() window function to calculate the salary difference between each employee and the next higher-paid employee within their department.',
    hint: 'LEAD(salary) OVER (PARTITION BY department_id ORDER BY salary ASC) - salary AS salary_gap_to_next.',
    starterSql: "SELECT department_id, first_name, salary,\n  LEAD(salary) OVER (PARTITION BY department_id ORDER BY salary ASC) - salary AS salary_gap_to_next\nFROM employees\nORDER BY department_id, salary ASC;",
    solutionSql: "SELECT department_id, first_name, salary,\n  LEAD(salary) OVER (PARTITION BY department_id ORDER BY salary ASC) - salary AS salary_gap_to_next\nFROM employees\nORDER BY department_id, salary ASC;"
  },
  {
    id: 'ent-hard-16',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Self Joins',
    title: 'Employees Earning More Than Their Manager',
    description: 'Find all employees who earn a higher salary than their direct manager. Show employee name, employee salary, manager name, and manager salary.',
    hint: 'JOIN employees e with employees m ON e.manager_id = m.employee_id WHERE e.salary > m.salary.',
    starterSql: "SELECT e.first_name || ' ' || e.last_name AS employee_name, e.salary AS employee_salary,\n  m.first_name || ' ' || m.last_name AS manager_name, m.salary AS manager_salary\nFROM employees e\nJOIN employees m ON e.manager_id = m.employee_id\nWHERE e.salary > m.salary;",
    solutionSql: "SELECT e.first_name || ' ' || e.last_name AS employee_name, e.salary AS employee_salary,\n  m.first_name || ' ' || m.last_name AS manager_name, m.salary AS manager_salary\nFROM employees e\nJOIN employees m ON e.manager_id = m.employee_id\nWHERE e.salary > m.salary;"
  },
  {
    id: 'ent-hard-17',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Window Running Totals',
    title: 'Cumulative Department Payroll',
    description: 'Calculate the running cumulative salary total for each department, ordered by employee hire date.',
    hint: 'SUM(salary) OVER (PARTITION BY department_id ORDER BY hire_date ASC) AS running_payroll.',
    starterSql: "SELECT department_id, first_name, hire_date, salary,\n  SUM(salary) OVER (PARTITION BY department_id ORDER BY hire_date ASC) AS running_payroll\nFROM employees\nORDER BY department_id, hire_date ASC;",
    solutionSql: "SELECT department_id, first_name, hire_date, salary,\n  SUM(salary) OVER (PARTITION BY department_id ORDER BY hire_date ASC) AS running_payroll\nFROM employees\nORDER BY department_id, hire_date ASC;"
  },
  {
    id: 'ent-hard-18',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Recursive CTEs',
    title: 'Corporate Hierarchy Tree Traversal',
    description: 'Use a RECURSIVE Common Table Expression (CTE) to traverse the management hierarchy starting from top leaders (manager_id IS NULL) to all subordinate levels.',
    hint: 'WITH RECURSIVE OrgHierarchy AS (SELECT employee_id, first_name, manager_id, 1 AS level FROM employees WHERE manager_id IS NULL UNION ALL SELECT e.employee_id, e.first_name, e.manager_id, o.level + 1 FROM employees e JOIN OrgHierarchy o ON e.manager_id = o.employee_id) SELECT * FROM OrgHierarchy ORDER BY level, employee_id;',
    starterSql: "WITH RECURSIVE OrgHierarchy AS (\n  SELECT employee_id, first_name, manager_id, 1 AS level\n  FROM employees\n  WHERE manager_id IS NULL\n  UNION ALL\n  SELECT e.employee_id, e.first_name, e.manager_id, o.level + 1\n  FROM employees e\n  JOIN OrgHierarchy o ON e.manager_id = o.employee_id\n)\nSELECT employee_id, first_name, manager_id, level\nFROM OrgHierarchy\nORDER BY level, employee_id;",
    solutionSql: "WITH RECURSIVE OrgHierarchy AS (\n  SELECT employee_id, first_name, manager_id, 1 AS level\n  FROM employees\n  WHERE manager_id IS NULL\n  UNION ALL\n  SELECT e.employee_id, e.first_name, e.manager_id, o.level + 1\n  FROM employees e\n  JOIN OrgHierarchy o ON e.manager_id = o.employee_id\n)\nSELECT employee_id, first_name, manager_id, level\nFROM OrgHierarchy\nORDER BY level, employee_id;"
  },
  {
    id: 'ent-hard-19',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Share of Total Percentage',
    title: 'Employee Salary as Share of Department Total',
    description: 'Calculate each employee salary as a percentage of the total payroll for their department, rounded to 2 decimal places.',
    hint: 'Use window SUM: ROUND(100.0 * salary / SUM(salary) OVER (PARTITION BY department_id), 2) AS dept_salary_pct.',
    starterSql: "SELECT department_id, first_name, salary,\n  ROUND(100.0 * salary / SUM(salary) OVER (PARTITION BY department_id), 2) AS dept_salary_pct\nFROM employees\nORDER BY department_id, salary DESC;",
    solutionSql: "SELECT department_id, first_name, salary,\n  ROUND(100.0 * salary / SUM(salary) OVER (PARTITION BY department_id), 2) AS dept_salary_pct\nFROM employees\nORDER BY department_id, salary DESC;"
  },
  {
    id: 'ent-hard-20',
    database: 'enterprise',
    difficulty: 'Hard',
    category: 'Fan-Out Prevention',
    title: 'Accurate Project Budget vs Total Employee Salary',
    description: 'Find each project_name, its budget, and the exact count of assigned employees. Avoid fan-out double counting traps.',
    hint: 'JOIN employee_projects then GROUP BY project_id, project_name, budget.',
    starterSql: "SELECT pr.project_id, pr.project_name, pr.budget,\n  COUNT(DISTINCT ep.employee_id) AS total_assigned_engineers,\n  SUM(ep.hours_allocated) AS total_allocated_hours\nFROM projects pr\nLEFT JOIN employee_projects ep ON pr.project_id = ep.project_id\nGROUP BY pr.project_id, pr.project_name, pr.budget\nORDER BY total_allocated_hours DESC;",
    solutionSql: "SELECT pr.project_id, pr.project_name, pr.budget,\n  COUNT(DISTINCT ep.employee_id) AS total_assigned_engineers,\n  SUM(ep.hours_allocated) AS total_allocated_hours\nFROM projects pr\nLEFT JOIN employee_projects ep ON pr.project_id = ep.project_id\nGROUP BY pr.project_id, pr.project_name, pr.budget\nORDER BY total_allocated_hours DESC;"
  }
];
