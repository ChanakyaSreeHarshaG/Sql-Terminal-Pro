import { SqlQuestion } from '../sqlPracticeData';

export const HOSPITAL_QUESTIONS: SqlQuestion[] = [
  // ==========================================
  // 🏥 EASY (1 to 16) - Healthcare Patient Queries
  // ==========================================
  {
    id: 'hosp-easy-1',
    database: 'hospital',
    difficulty: 'Easy',
    category: 'Filtering',
    title: 'Show Male Patients',
    description: "Show first name, last name, and gender of patients whose gender is 'M'.",
    hint: "Use a simple WHERE clause: WHERE gender = 'M'.",
    starterSql: "SELECT first_name, last_name, gender\nFROM patients\nWHERE ;",
    solutionSql: "SELECT first_name, last_name, gender\nFROM patients\nWHERE gender = 'M';"
  },
  {
    id: 'hosp-easy-2',
    database: 'hospital',
    difficulty: 'Easy',
    category: 'NULL Handling',
    title: 'Patients with No Allergies',
    description: 'Show first name and last name of patients who do not have allergies (allergies is NULL).',
    hint: 'Compare null values using IS NULL instead of = NULL.',
    starterSql: "SELECT first_name, last_name\nFROM patients\nWHERE allergies ;",
    solutionSql: "SELECT first_name, last_name\nFROM patients\nWHERE allergies IS NULL;"
  },
  {
    id: 'hosp-easy-3',
    database: 'hospital',
    difficulty: 'Easy',
    category: 'Pattern Matching',
    title: "First Names Starting with 'C'",
    description: "Show first name of patients whose first name starts with the letter 'C'.",
    hint: "Use the LIKE operator with the wildcard '%' (e.g. LIKE 'C%').",
    starterSql: "SELECT first_name\nFROM patients\nWHERE ;",
    solutionSql: "SELECT first_name\nFROM patients\nWHERE first_name LIKE 'C%';"
  },
  {
    id: 'hosp-easy-4',
    database: 'hospital',
    difficulty: 'Easy',
    category: 'Ranges',
    title: 'Weight Between 60 and 80',
    description: 'Show first name and last name of patients that weigh within the range of 60 to 80 (inclusive).',
    hint: 'Use the BETWEEN operator: weight BETWEEN 60 AND 80.',
    starterSql: "SELECT first_name, last_name\nFROM patients\nWHERE weight ;",
    solutionSql: "SELECT first_name, last_name\nFROM patients\nWHERE weight BETWEEN 60 AND 80;"
  },
  {
    id: 'hosp-easy-5',
    database: 'hospital',
    difficulty: 'Easy',
    category: 'String Functions',
    title: 'Concatenate Full Name',
    description: "Show first name and last name concatenated into one column called 'full_name' with a space in between.",
    hint: "Use SQLite concatenation operator ||: first_name || ' ' || last_name AS full_name.",
    starterSql: "SELECT \nFROM patients;",
    solutionSql: "SELECT first_name || ' ' || last_name AS full_name\nFROM patients;"
  },
  {
    id: 'hosp-easy-6',
    database: 'hospital',
    difficulty: 'Easy',
    category: 'Joins',
    title: 'Show Patient Full Province Name',
    description: "Show first name, last name, and the full province name of each patient. For example: 'Ontario' instead of 'ON'.",
    hint: 'INNER JOIN patients with province_names on province_id.',
    starterSql: "SELECT p.first_name, p.last_name, pn.province_name\nFROM patients p\nJOIN province_names pn ON ;",
    solutionSql: "SELECT p.first_name, p.last_name, pn.province_name\nFROM patients p\nJOIN province_names pn ON p.province_id = pn.province_id;"
  },
  {
    id: 'hosp-easy-7',
    database: 'hospital',
    difficulty: 'Easy',
    category: 'Aggregation',
    title: 'Total Admissions Count',
    description: 'Show the total count of admissions recorded in the hospital admissions table.',
    hint: 'Use COUNT(*) AS total_admissions FROM admissions.',
    starterSql: "SELECT \nFROM admissions;",
    solutionSql: "SELECT COUNT(*) AS total_admissions\nFROM admissions;"
  },
  {
    id: 'hosp-easy-8',
    database: 'hospital',
    difficulty: 'Easy',
    category: 'Date Filtering',
    title: 'Patients Born in 2010',
    description: 'Show how many patients have a birth_date with 2010 as the birth year.',
    hint: "Filter with birth_date LIKE '2010%' or strftime('%Y', birth_date) = '2010'.",
    starterSql: "SELECT COUNT(*)\nFROM patients\nWHERE ;",
    solutionSql: "SELECT COUNT(*) AS count_2010\nFROM patients\nWHERE birth_date LIKE '2010%';"
  },
  {
    id: 'hosp-easy-9',
    database: 'hospital',
    difficulty: 'Easy',
    category: 'Sorting & Limits',
    title: 'Tallest Patient in Hospital',
    description: 'Show the first_name, last_name, and height of the patient with the greatest height.',
    hint: 'ORDER BY height DESC LIMIT 1.',
    starterSql: "SELECT first_name, last_name, height\nFROM patients\nORDER BY \nLIMIT 1;",
    solutionSql: "SELECT first_name, last_name, height\nFROM patients\nORDER BY height DESC\nLIMIT 1;"
  },
  {
    id: 'hosp-easy-10',
    database: 'hospital',
    difficulty: 'Easy',
    category: 'Set Filtering',
    title: 'Specific Patient IDs Lookup',
    description: 'Show all columns for patients who have one of the following patient_ids: 1, 3, 5, 7, 10.',
    hint: 'Use the IN operator: patient_id IN (1, 3, 5, 7, 10).',
    starterSql: "SELECT *\nFROM patients\nWHERE patient_id IN ;",
    solutionSql: "SELECT *\nFROM patients\nWHERE patient_id IN (1, 3, 5, 7, 10);"
  },
  {
    id: 'hosp-easy-11',
    database: 'hospital',
    difficulty: 'Easy',
    category: 'Date Filtering',
    title: 'Same Day Admissions and Discharges',
    description: 'Show all the columns from admissions where the patient was admitted and discharged on the same day.',
    hint: 'Filter WHERE admission_date = discharge_date.',
    starterSql: "SELECT *\nFROM admissions\nWHERE ;",
    solutionSql: "SELECT *\nFROM admissions\nWHERE admission_date = discharge_date;"
  },
  {
    id: 'hosp-easy-12',
    database: 'hospital',
    difficulty: 'Easy',
    category: 'Aggregation & Filtering',
    title: 'Admissions for Patient 1',
    description: 'Show the patient_id and the total number of admissions for patient_id 1.',
    hint: 'SELECT patient_id, COUNT(*) FROM admissions WHERE patient_id = 1 GROUP BY patient_id.',
    starterSql: "SELECT patient_id, COUNT(*)\nFROM admissions\nWHERE ;",
    solutionSql: "SELECT patient_id, COUNT(*) AS total_admissions\nFROM admissions\nWHERE patient_id = 1\nGROUP BY patient_id;"
  },
  {
    id: 'hosp-easy-13',
    database: 'hospital',
    difficulty: 'Easy',
    category: 'Distinct Values',
    title: "Unique Cities in Nova Scotia ('NS')",
    description: "Based on the cities our patients live in, show unique cities that are in province_id 'NS'.",
    hint: "Use DISTINCT(city) WHERE province_id = 'NS'.",
    starterSql: "SELECT DISTINCT city\nFROM patients\nWHERE ;",
    solutionSql: "SELECT DISTINCT city\nFROM patients\nWHERE province_id = 'NS';"
  },
  {
    id: 'hosp-easy-14',
    database: 'hospital',
    difficulty: 'Easy',
    category: 'Multi-condition',
    title: 'Tall and Heavy Patients',
    description: 'Write a query to find the first_name, last_name, and birth_date of patients who have height greater than 160 and weight greater than 70.',
    hint: 'Combine both conditions using AND: height > 160 AND weight > 70.',
    starterSql: "SELECT first_name, last_name, birth_date\nFROM patients\nWHERE ;",
    solutionSql: "SELECT first_name, last_name, birth_date\nFROM patients\nWHERE height > 160 AND weight > 70;"
  },
  {
    id: 'hosp-easy-15',
    database: 'hospital',
    difficulty: 'Easy',
    category: 'Filtering',
    title: 'Allergies in Halifax',
    description: "Find list of patients first_name, last_name, and allergies from city 'Halifax' where allergies is not null.",
    hint: "WHERE city = 'Halifax' AND allergies IS NOT NULL.",
    starterSql: "SELECT first_name, last_name, allergies\nFROM patients\nWHERE ;",
    solutionSql: "SELECT first_name, last_name, allergies\nFROM patients\nWHERE city = 'Halifax' AND allergies IS NOT NULL;"
  },
  {
    id: 'hosp-easy-16',
    database: 'hospital',
    difficulty: 'Easy',
    category: 'Pattern Matching',
    title: 'Cities Starting with a Vowel',
    description: 'Based on cities where our patients live, write a query to display the list of unique cities starting with a vowel (a, e, i, o, u) ordered ascending by city.',
    hint: "Use DISTINCT city and LIKE conditions or GLOB '[AEIOUaeiou]*' ORDER BY city ASC.",
    starterSql: "SELECT DISTINCT city\nFROM patients\nWHERE city LIKE 'A%' OR city LIKE 'E%' OR city LIKE 'I%' OR city LIKE 'O%' OR city LIKE 'U%'\nORDER BY city ASC;",
    solutionSql: "SELECT DISTINCT city\nFROM patients\nWHERE city LIKE 'A%' OR city LIKE 'E%' OR city LIKE 'I%' OR city LIKE 'O%' OR city LIKE 'U%'\nORDER BY city ASC;"
  },

  // ==========================================
  // 🏥 MEDIUM (17 to 41) - Relational Aggregations & Joins
  // ==========================================
  {
    id: 'hosp-med-17',
    database: 'hospital',
    difficulty: 'Medium',
    category: 'Date Functions',
    title: 'Unique Birth Years',
    description: 'Show unique birth years from patients and order them in ascending order.',
    hint: "In SQLite, extract year with CAST(strftime('%Y', birth_date) AS INT) or SUBSTR(birth_date, 1, 4).",
    starterSql: "SELECT DISTINCT SUBSTR(birth_date, 1, 4) AS birth_year\nFROM patients\nORDER BY ;",
    solutionSql: "SELECT DISTINCT SUBSTR(birth_date, 1, 4) AS birth_year\nFROM patients\nORDER BY birth_year ASC;"
  },
  {
    id: 'hosp-med-18',
    database: 'hospital',
    difficulty: 'Medium',
    category: 'Aggregation & HAVING',
    title: 'Unique First Names with Only One Occurrence',
    description: "Show unique first names from the patients table which only occur once in the entire list. For example, if two people share 'Sarah', exclude it.",
    hint: 'GROUP BY first_name HAVING COUNT(*) = 1.',
    starterSql: "SELECT first_name\nFROM patients\nGROUP BY first_name\nHAVING ;",
    solutionSql: "SELECT first_name\nFROM patients\nGROUP BY first_name\nHAVING COUNT(*) = 1;"
  },
  {
    id: 'hosp-med-19',
    database: 'hospital',
    difficulty: 'Medium',
    category: 'Pattern Matching',
    title: "First Names Starting and Ending with 'S'",
    description: "Show patient_id and first_name from patients where their first_name starts and ends with 'S' (case insensitive) and is at least 6 characters long.",
    hint: "WHERE first_name LIKE 's%s' AND LENGTH(first_name) >= 6.",
    starterSql: "SELECT patient_id, first_name\nFROM patients\nWHERE ;",
    solutionSql: "SELECT patient_id, first_name\nFROM patients\nWHERE first_name LIKE 's%s' AND LENGTH(first_name) >= 6;"
  },
  {
    id: 'hosp-med-20',
    database: 'hospital',
    difficulty: 'Medium',
    category: 'Joins',
    title: 'Dementia Diagnoses Patients',
    description: "Show patient_id, first_name, and last_name from patients whose diagnosis in the admissions table is 'Dementia'.",
    hint: "JOIN patients with admissions on patient_id WHERE admissions.diagnosis = 'Dementia'.",
    starterSql: "SELECT p.patient_id, p.first_name, p.last_name\nFROM patients p\nJOIN admissions a ON ;\nWHERE ;",
    solutionSql: "SELECT p.patient_id, p.first_name, p.last_name\nFROM patients p\nJOIN admissions a ON p.patient_id = a.patient_id\nWHERE a.diagnosis = 'Dementia';"
  },
  {
    id: 'hosp-med-21',
    database: 'hospital',
    difficulty: 'Medium',
    category: 'Sorting by Length',
    title: 'Order by First Name Length',
    description: "Display every patient's first_name. Order the list by the length of each name and then alphabetically.",
    hint: 'ORDER BY LENGTH(first_name), first_name.',
    starterSql: "SELECT first_name\nFROM patients\nORDER BY ;",
    solutionSql: "SELECT first_name\nFROM patients\nORDER BY LENGTH(first_name), first_name;"
  },
  {
    id: 'hosp-med-22',
    database: 'hospital',
    difficulty: 'Medium',
    category: 'Subqueries',
    title: 'Male and Female Counts in One Row',
    description: 'Show the total amount of male patients and the total amount of female patients in the patients table in the exact same row.',
    hint: "Use scalar subqueries: (SELECT COUNT(*) FROM patients WHERE gender = 'M') AS male_count, etc.",
    starterSql: "SELECT\n  (SELECT COUNT(*) FROM patients WHERE gender = 'M') AS male_patients,\n  (SELECT COUNT(*) FROM patients WHERE gender = 'F') AS female_patients;",
    solutionSql: "SELECT\n  (SELECT COUNT(*) FROM patients WHERE gender = 'M') AS male_patients,\n  (SELECT COUNT(*) FROM patients WHERE gender = 'F') AS female_patients;"
  },
  {
    id: 'hosp-med-23',
    database: 'hospital',
    difficulty: 'Medium',
    category: 'Filtering & Multi-sorting',
    title: 'Penicillin or Morphine Allergies',
    description: "Show first_name, last_name, and allergies from patients who have allergies to either 'Penicillin' or 'Morphine'. Order ascending by allergies, then first_name, then last_name.",
    hint: "WHERE allergies IN ('Penicillin', 'Morphine') ORDER BY allergies, first_name, last_name.",
    starterSql: "SELECT first_name, last_name, allergies\nFROM patients\nWHERE allergies IN ('Penicillin', 'Morphine')\nORDER BY ;",
    solutionSql: "SELECT first_name, last_name, allergies\nFROM patients\nWHERE allergies IN ('Penicillin', 'Morphine')\nORDER BY allergies, first_name, last_name;"
  },
  {
    id: 'hosp-med-24',
    database: 'hospital',
    difficulty: 'Medium',
    category: 'Set Operations',
    title: 'All Patients and Doctors in One List',
    description: "Show first_name, last_name, and role of every person that is either a patient or a doctor. The roles are either 'Patient' or 'Doctor'.",
    hint: "Use UNION ALL combining SELECT first_name, last_name, 'Patient' AS role FROM patients with doctors.",
    starterSql: "SELECT first_name, last_name, 'Patient' AS role\nFROM patients\nUNION ALL\nSELECT ;",
    solutionSql: "SELECT first_name, last_name, 'Patient' AS role\nFROM patients\nUNION ALL\nSELECT first_name, last_name, 'Doctor' AS role\nFROM doctors;"
  },
  {
    id: 'hosp-med-25',
    database: 'hospital',
    difficulty: 'Medium',
    category: 'Aggregation',
    title: 'Allergies Ranked by Popularity',
    description: 'Show all allergies ordered by popularity (frequency of occurrence). Exclude NULL values from the result.',
    hint: 'GROUP BY allergies WHERE allergies IS NOT NULL ORDER BY COUNT(*) DESC.',
    starterSql: "SELECT allergies, COUNT(*) AS total_diagnosis\nFROM patients\nWHERE allergies IS NOT NULL\nGROUP BY ;\nORDER BY ;",
    solutionSql: "SELECT allergies, COUNT(*) AS total_diagnosis\nFROM patients\nWHERE allergies IS NOT NULL\nGROUP BY allergies\nORDER BY total_diagnosis DESC;"
  },
  {
    id: 'hosp-med-26',
    database: 'hospital',
    difficulty: 'Medium',
    category: 'Date Filtering',
    title: 'Patients Born in the 1970s Decade',
    description: 'Show all patient first_name, last_name, and birth_date who were born in the 1970s decade (1970 through 1979 inclusive).',
    hint: "Use birth_date BETWEEN '1970-01-01' AND '1979-12-31' or SUBSTR(birth_date, 1, 3) = '197'.",
    starterSql: "SELECT first_name, last_name, birth_date\nFROM patients\nWHERE ;",
    solutionSql: "SELECT first_name, last_name, birth_date\nFROM patients\nWHERE birth_date BETWEEN '1970-01-01' AND '1979-12-31'\nORDER BY birth_date;"
  },
  {
    id: 'hosp-med-27',
    database: 'hospital',
    difficulty: 'Medium',
    category: 'Joins & Limits',
    title: 'Patient with Most Admissions',
    description: 'Show the first_name and last_name of the patient who has the most admissions in the hospital.',
    hint: 'JOIN patients with admissions, GROUP BY patient_id, ORDER BY COUNT(*) DESC LIMIT 1.',
    starterSql: "SELECT p.first_name, p.last_name\nFROM patients p\nJOIN admissions a ON p.patient_id = a.patient_id\nGROUP BY p.patient_id\nORDER BY COUNT(*) DESC\nLIMIT 1;",
    solutionSql: "SELECT p.first_name, p.last_name\nFROM patients p\nJOIN admissions a ON p.patient_id = a.patient_id\nGROUP BY p.patient_id\nORDER BY COUNT(*) DESC\nLIMIT 1;"
  },
  {
    id: 'hosp-med-28',
    database: 'hospital',
    difficulty: 'Medium',
    category: 'Subqueries & IN',
    title: 'Patients with Multiple Admissions',
    description: 'Show patient_id, first_name, and last_name for all patients who have been admitted more than 1 time.',
    hint: 'WHERE patient_id IN (SELECT patient_id FROM admissions GROUP BY patient_id HAVING COUNT(*) > 1).',
    starterSql: "SELECT patient_id, first_name, last_name\nFROM patients\nWHERE patient_id IN (\n  SELECT patient_id FROM admissions GROUP BY patient_id HAVING COUNT(*) > 1\n);",
    solutionSql: "SELECT patient_id, first_name, last_name\nFROM patients\nWHERE patient_id IN (\n  SELECT patient_id FROM admissions GROUP BY patient_id HAVING COUNT(*) > 1\n);"
  },
  {
    id: 'hosp-med-29',
    database: 'hospital',
    difficulty: 'Medium',
    category: 'Date Aggregation',
    title: 'Admissions Count by Day of Month',
    description: 'Show all days of the month (1-31) and how many admissions occurred on that day. Sort by the day with the most admissions to the least.',
    hint: "Use CAST(SUBSTR(admission_date, 9, 2) AS INT) AS day_of_month, COUNT(*) AS admission_count GROUP BY day_of_month ORDER BY admission_count DESC.",
    starterSql: "SELECT CAST(SUBSTR(admission_date, 9, 2) AS INT) AS day_of_month, COUNT(*) AS admission_count\nFROM admissions\nGROUP BY day_of_month\nORDER BY admission_count DESC;",
    solutionSql: "SELECT CAST(SUBSTR(admission_date, 9, 2) AS INT) AS day_of_month, COUNT(*) AS admission_count\nFROM admissions\nGROUP BY day_of_month\nORDER BY admission_count DESC;"
  },
  {
    id: 'hosp-med-30',
    database: 'hospital',
    difficulty: 'Medium',
    category: 'Subqueries & Ordering',
    title: "Patient 1's Most Recent Admission",
    description: "Show all columns from admissions for patient_id 1's most recent admission date.",
    hint: 'WHERE patient_id = 1 ORDER BY admission_date DESC LIMIT 1.',
    starterSql: "SELECT *\nFROM admissions\nWHERE patient_id = 1\nORDER BY admission_date DESC\nLIMIT 1;",
    solutionSql: "SELECT *\nFROM admissions\nWHERE patient_id = 1\nORDER BY admission_date DESC\nLIMIT 1;"
  },
  {
    id: 'hosp-med-31',
    database: 'hospital',
    difficulty: 'Medium',
    category: 'Min/Max with Grouping',
    title: 'Doctors First and Last Admission Date',
    description: 'For each doctor, display their doctor_id, full name (first and last name separated by a space), and their earliest (MIN) and latest (MAX) admission date.',
    hint: 'JOIN doctors with admissions on doctor_id = attending_doctor_id, GROUP BY doctor_id.',
    starterSql: "SELECT d.doctor_id, d.first_name || ' ' || d.last_name AS full_name,\n  MIN(a.admission_date) AS first_admission_date,\n  MAX(a.admission_date) AS last_admission_date\nFROM doctors d\nJOIN admissions a ON d.doctor_id = a.attending_doctor_id\nGROUP BY d.doctor_id;",
    solutionSql: "SELECT d.doctor_id, d.first_name || ' ' || d.last_name AS full_name,\n  MIN(a.admission_date) AS first_admission_date,\n  MAX(a.admission_date) AS last_admission_date\nFROM doctors d\nJOIN admissions a ON d.doctor_id = a.attending_doctor_id\nGROUP BY d.doctor_id;"
  },
  {
    id: 'hosp-med-32',
    database: 'hospital',
    difficulty: 'Medium',
    category: 'Joins & Aggregations',
    title: 'Patient Count per Province',
    description: 'Display the province_name and total count of patients residing in each province. Order by patient count descending.',
    hint: 'JOIN patients with province_names on province_id, GROUP BY pn.province_name ORDER BY COUNT(*) DESC.',
    starterSql: "SELECT pn.province_name, COUNT(p.patient_id) AS patient_count\nFROM patients p\nJOIN province_names pn ON p.province_id = pn.province_id\nGROUP BY pn.province_name\nORDER BY patient_count DESC;",
    solutionSql: "SELECT pn.province_name, COUNT(p.patient_id) AS patient_count\nFROM patients p\nJOIN province_names pn ON p.province_id = pn.province_id\nGROUP BY pn.province_name\nORDER BY patient_count DESC;"
  },
  {
    id: 'hosp-med-33',
    database: 'hospital',
    difficulty: 'Medium',
    category: 'Complex Filtering',
    title: 'Complex Admission Criteria',
    description: "Show patient_id, attending_doctor_id, and diagnosis for admissions where either: (1) patient_id is odd and doctor_id in (1, 2, 7), OR (2) diagnosis length is greater than 15.",
    hint: 'Use (patient_id % 2 != 0 AND attending_doctor_id IN (1, 2, 7)) OR LENGTH(diagnosis) > 15.',
    starterSql: "SELECT patient_id, attending_doctor_id, diagnosis\nFROM admissions\nWHERE (patient_id % 2 != 0 AND attending_doctor_id IN (1, 2, 7))\n   OR LENGTH(diagnosis) > 15;",
    solutionSql: "SELECT patient_id, attending_doctor_id, diagnosis\nFROM admissions\nWHERE (patient_id % 2 != 0 AND attending_doctor_id IN (1, 2, 7))\n   OR LENGTH(diagnosis) > 15;"
  },
  {
    id: 'hosp-med-34',
    database: 'hospital',
    difficulty: 'Medium',
    category: 'String Functions',
    title: 'Format Doctor Name with Specialty',
    description: "Display doctor_id and a single column named doctor_info showing 'Dr. [first_name] [last_name] ([specialty])'.",
    hint: "Use SQLite concatenation: 'Dr. ' || first_name || ' ' || last_name || ' (' || specialty || ')'.",
    starterSql: "SELECT doctor_id, 'Dr. ' || first_name || ' ' || last_name || ' (' || specialty || ')' AS doctor_info\nFROM doctors;",
    solutionSql: "SELECT doctor_id, 'Dr. ' || first_name || ' ' || last_name || ' (' || specialty || ')' AS doctor_info\nFROM doctors;"
  },
  {
    id: 'hosp-med-35',
    database: 'hospital',
    difficulty: 'Medium',
    category: 'Average Calculations',
    title: 'Average Patient Height and Weight by Gender',
    description: 'Show gender, ROUND(AVG(height), 1) as avg_height, and ROUND(AVG(weight), 1) as avg_weight grouped by gender.',
    hint: 'GROUP BY gender using AVG(height) and AVG(weight).',
    starterSql: "SELECT gender, ROUND(AVG(height), 1) AS avg_height, ROUND(AVG(weight), 1) AS avg_weight\nFROM patients\nGROUP BY gender;",
    solutionSql: "SELECT gender, ROUND(AVG(height), 1) AS avg_height, ROUND(AVG(weight), 1) AS avg_weight\nFROM patients\nGROUP BY gender;"
  },
  {
    id: 'hosp-med-36',
    database: 'hospital',
    difficulty: 'Medium',
    category: 'Conditional Logic',
    title: 'Height Category Classification',
    description: "Display patient_id, first_name, height, and a category column where height >= 175 is 'Tall', between 160 and 174 is 'Medium', and below 160 is 'Short'.",
    hint: "Use CASE WHEN height >= 175 THEN 'Tall' WHEN height >= 160 THEN 'Medium' ELSE 'Short' END.",
    starterSql: "SELECT patient_id, first_name, height,\n  CASE\n    WHEN height >= 175 THEN 'Tall'\n    WHEN height >= 160 THEN 'Medium'\n    ELSE 'Short'\n  END AS height_category\nFROM patients;",
    solutionSql: "SELECT patient_id, first_name, height,\n  CASE\n    WHEN height >= 175 THEN 'Tall'\n    WHEN height >= 160 THEN 'Medium'\n    ELSE 'Short'\n  END AS height_category\nFROM patients;"
  },
  {
    id: 'hosp-med-37',
    database: 'hospital',
    difficulty: 'Medium',
    category: 'Stay Length Calculation',
    title: 'Average Admission Stay Duration',
    description: "Show patient_id and the stay duration in days (julianday(discharge_date) - julianday(admission_date)) for all admissions where discharge_date is not null.",
    hint: 'In SQLite, calculate day differences using CAST(julianday(discharge_date) - julianday(admission_date) AS INT) AS stay_days.',
    starterSql: "SELECT patient_id, admission_date, discharge_date,\n  CAST(julianday(discharge_date) - julianday(admission_date) AS INT) AS stay_days\nFROM admissions\nWHERE discharge_date IS NOT NULL;",
    solutionSql: "SELECT patient_id, admission_date, discharge_date,\n  CAST(julianday(discharge_date) - julianday(admission_date) AS INT) AS stay_days\nFROM admissions\nWHERE discharge_date IS NOT NULL;"
  },
  {
    id: 'hosp-med-38',
    database: 'hospital',
    difficulty: 'Medium',
    category: 'Subqueries',
    title: 'Patients Never Admitted',
    description: 'Find all patients (patient_id, first_name, last_name) who have never been admitted to the hospital.',
    hint: 'Use NOT IN (SELECT patient_id FROM admissions) or LEFT JOIN admissions WHERE admission_date IS NULL.',
    starterSql: "SELECT patient_id, first_name, last_name\nFROM patients\nWHERE patient_id NOT IN (SELECT DISTINCT patient_id FROM admissions);",
    solutionSql: "SELECT patient_id, first_name, last_name\nFROM patients\nWHERE patient_id NOT IN (SELECT DISTINCT patient_id FROM admissions);"
  },
  {
    id: 'hosp-med-39',
    database: 'hospital',
    difficulty: 'Medium',
    category: 'Aggregation',
    title: 'Admissions Count per Specialty',
    description: 'Show doctor specialty and the total count of admissions handled by doctors of that specialty. Order by count descending.',
    hint: 'JOIN doctors with admissions ON doctor_id = attending_doctor_id, GROUP BY specialty ORDER BY COUNT(*) DESC.',
    starterSql: "SELECT d.specialty, COUNT(a.patient_id) AS admission_count\nFROM doctors d\nJOIN admissions a ON d.doctor_id = a.attending_doctor_id\nGROUP BY d.specialty\nORDER BY admission_count DESC;",
    solutionSql: "SELECT d.specialty, COUNT(a.patient_id) AS admission_count\nFROM doctors d\nJOIN admissions a ON d.doctor_id = a.attending_doctor_id\nGROUP BY d.specialty\nORDER BY admission_count DESC;"
  },
  {
    id: 'hosp-med-40',
    database: 'hospital',
    difficulty: 'Medium',
    category: 'String Length',
    title: 'Longest Diagnosis Names',
    description: 'Show diagnosis and the character length of diagnosis for the 3 longest diagnoses in the admissions table.',
    hint: 'DISTINCT diagnosis, LENGTH(diagnosis) AS len ORDER BY len DESC LIMIT 3.',
    starterSql: "SELECT DISTINCT diagnosis, LENGTH(diagnosis) AS diagnosis_length\nFROM admissions\nORDER BY diagnosis_length DESC\nLIMIT 3;",
    solutionSql: "SELECT DISTINCT diagnosis, LENGTH(diagnosis) AS diagnosis_length\nFROM admissions\nORDER BY diagnosis_length DESC\nLIMIT 3;"
  },
  {
    id: 'hosp-med-41',
    database: 'hospital',
    difficulty: 'Medium',
    category: 'Multi-table Joins',
    title: 'Full Patient Admission Roster',
    description: 'Show patient full_name (first and last), admission_date, diagnosis, and attending doctor full name for all admissions.',
    hint: 'JOIN patients on patient_id, JOIN doctors on doctor_id = attending_doctor_id.',
    starterSql: "SELECT p.first_name || ' ' || p.last_name AS patient_name,\n  a.admission_date, a.diagnosis,\n  d.first_name || ' ' || d.last_name AS doctor_name\nFROM admissions a\nJOIN patients p ON a.patient_id = p.patient_id\nJOIN doctors d ON a.attending_doctor_id = d.doctor_id;",
    solutionSql: "SELECT p.first_name || ' ' || p.last_name AS patient_name,\n  a.admission_date, a.diagnosis,\n  d.first_name || ' ' || d.last_name AS doctor_name\nFROM admissions a\nJOIN patients p ON a.patient_id = p.patient_id\nJOIN doctors d ON a.attending_doctor_id = d.doctor_id;"
  },

  // ==========================================
  // 🏥 HARD (42 to 52) - Advanced SQL & Window Analytics
  // ==========================================
  {
    id: 'hosp-hard-42',
    database: 'hospital',
    difficulty: 'Hard',
    category: 'Floor Division Grouping',
    title: 'Group Patients into Weight Groups',
    description: 'Show all patients grouped into weight groups of 10 (e.g. 60-69 is group 60, 70-79 is group 70). Show the weight_group and the count of patients in each group, ordered by weight_group descending.',
    hint: 'Use (weight / 10) * 10 AS weight_group, COUNT(*) AS patients_in_group GROUP BY weight_group ORDER BY weight_group DESC.',
    starterSql: "SELECT (weight / 10) * 10 AS weight_group, COUNT(*) AS patients_in_group\nFROM patients\nGROUP BY weight_group\nORDER BY weight_group DESC;",
    solutionSql: "SELECT (weight / 10) * 10 AS weight_group, COUNT(*) AS patients_in_group\nFROM patients\nGROUP BY weight_group\nORDER BY weight_group DESC;"
  },
  {
    id: 'hosp-hard-43',
    database: 'hospital',
    difficulty: 'Hard',
    category: 'Mathematical Formula & Boolean',
    title: 'Calculate Patient Obesity (BMI)',
    description: 'Show patient_id, weight, height, and isObese (1 if obese, 0 if not). A patient is defined as obese if BMI = weight(kg) / (height(m))^2 >= 30. Note: height is stored in cm.',
    hint: 'Height in meters is height / 100.0. BMI is weight / ((height / 100.0) * (height / 100.0)). Check >= 30.',
    starterSql: "SELECT patient_id, weight, height,\n  CASE\n    WHEN weight / ((height / 100.0) * (height / 100.0)) >= 30 THEN 1\n    ELSE 0\n  END AS isObese\nFROM patients;",
    solutionSql: "SELECT patient_id, weight, height,\n  CASE\n    WHEN weight / ((height / 100.0) * (height / 100.0)) >= 30 THEN 1\n    ELSE 0\n  END AS isObese\nFROM patients;"
  },
  {
    id: 'hosp-hard-44',
    database: 'hospital',
    difficulty: 'Hard',
    category: '3-Table Joins & Distinct',
    title: 'Patient and Attending Doctor Specialty',
    description: "Show distinct patient_id, first_name, last_name, and attending doctor's specialty for all patients who have had an admission.",
    hint: 'JOIN patients to admissions on patient_id, then JOIN doctors on attending_doctor_id.',
    starterSql: "SELECT DISTINCT p.patient_id, p.first_name, p.last_name, d.specialty\nFROM patients p\nJOIN admissions a ON p.patient_id = a.patient_id\nJOIN doctors d ON a.attending_doctor_id = d.doctor_id;",
    solutionSql: "SELECT DISTINCT p.patient_id, p.first_name, p.last_name, d.specialty\nFROM patients p\nJOIN admissions a ON p.patient_id = a.patient_id\nJOIN doctors d ON a.attending_doctor_id = d.doctor_id;"
  },
  {
    id: 'hosp-hard-45',
    database: 'hospital',
    difficulty: 'Hard',
    category: 'Conditional Aggregation',
    title: 'Insurance Cost Calculation (Even vs Odd IDs)',
    description: "Each admission costs $50 for patients without insurance and $10 for patients with insurance. Patients with an even patient_id have insurance. Display 'Yes' or 'No' as has_insurance, and sum the admission_total for each group.",
    hint: "CASE WHEN patient_id % 2 = 0 THEN 'Yes' ELSE 'No' END AS has_insurance, and SUM(CASE WHEN patient_id % 2 = 0 THEN 10 ELSE 50 END) AS admission_total.",
    starterSql: "SELECT\n  CASE WHEN patient_id % 2 = 0 THEN 'Yes' ELSE 'No' END AS has_insurance,\n  SUM(CASE WHEN patient_id % 2 = 0 THEN 10 ELSE 50 END) AS admission_total\nFROM admissions\nGROUP BY has_insurance;",
    solutionSql: "SELECT\n  CASE WHEN patient_id % 2 = 0 THEN 'Yes' ELSE 'No' END AS has_insurance,\n  SUM(CASE WHEN patient_id % 2 = 0 THEN 10 ELSE 50 END) AS admission_total\nFROM admissions\nGROUP BY has_insurance;"
  },
  {
    id: 'hosp-hard-46',
    database: 'hospital',
    difficulty: 'Hard',
    category: 'HAVING with Filtered Counts',
    title: 'Provinces with More Male than Female Patients',
    description: 'Show the full province_name for provinces that have more patients identified as male than female.',
    hint: "GROUP BY pn.province_name HAVING COUNT(CASE WHEN p.gender = 'M' THEN 1 END) > COUNT(CASE WHEN p.gender = 'F' THEN 1 END).",
    starterSql: "SELECT pn.province_name\nFROM province_names pn\nJOIN patients p ON pn.province_id = p.province_id\nGROUP BY pn.province_name\nHAVING COUNT(CASE WHEN p.gender = 'M' THEN 1 END) > COUNT(CASE WHEN p.gender = 'F' THEN 1 END);",
    solutionSql: "SELECT pn.province_name\nFROM province_names pn\nJOIN patients p ON pn.province_id = p.province_id\nGROUP BY pn.province_name\nHAVING COUNT(CASE WHEN p.gender = 'M' THEN 1 END) > COUNT(CASE WHEN p.gender = 'F' THEN 1 END);"
  },
  {
    id: 'hosp-hard-47',
    database: 'hospital',
    difficulty: 'Hard',
    category: 'Ratio Calculation',
    title: 'Percentage of Male Patients',
    description: "Show the percentage of patients with 'M' as their gender, rounded to 2 decimal places (e.g. 53.33).",
    hint: "ROUND(100.0 * COUNT(CASE WHEN gender = 'M' THEN 1 END) / COUNT(*), 2) AS male_percentage.",
    starterSql: "SELECT ROUND(100.0 * COUNT(CASE WHEN gender = 'M' THEN 1 END) / COUNT(*), 2) AS male_percentage\nFROM patients;",
    solutionSql: "SELECT ROUND(100.0 * COUNT(CASE WHEN gender = 'M' THEN 1 END) / COUNT(*), 2) AS male_percentage\nFROM patients;"
  },
  {
    id: 'hosp-hard-48',
    database: 'hospital',
    difficulty: 'Hard',
    category: 'Window Functions (LAG)',
    title: 'Day-over-Day Admissions Change',
    description: 'For each admission_date, display the total admissions on that date, and the difference in admissions compared to the previous recorded date using the LAG() window function.',
    hint: 'COUNT(*) - LAG(COUNT(*)) OVER (ORDER BY admission_date) AS admissions_change.',
    starterSql: "SELECT admission_date, COUNT(*) AS daily_admissions,\n  COUNT(*) - LAG(COUNT(*)) OVER (ORDER BY admission_date) AS admissions_change\nFROM admissions\nGROUP BY admission_date\nORDER BY admission_date;",
    solutionSql: "SELECT admission_date, COUNT(*) AS daily_admissions,\n  COUNT(*) - LAG(COUNT(*)) OVER (ORDER BY admission_date) AS admissions_change\nFROM admissions\nGROUP BY admission_date\nORDER BY admission_date;"
  },
  {
    id: 'hosp-hard-49',
    database: 'hospital',
    difficulty: 'Hard',
    category: 'Custom Sorting',
    title: "Custom Sort Ordering ('Ontario' First)",
    description: "Sort the province names in alphabetical order, but ensure 'Ontario' is always pinned at the very top (first row).",
    hint: "Use CASE WHEN province_name = 'Ontario' THEN 0 ELSE 1 END in ORDER BY.",
    starterSql: "SELECT province_name\nFROM province_names\nORDER BY\n  CASE WHEN province_name = 'Ontario' THEN 0 ELSE 1 END,\n  province_name ASC;",
    solutionSql: "SELECT province_name\nFROM province_names\nORDER BY\n  CASE WHEN province_name = 'Ontario' THEN 0 ELSE 1 END,\n  province_name ASC;"
  },
  {
    id: 'hosp-hard-50',
    database: 'hospital',
    difficulty: 'Hard',
    category: 'Date Grouping & Rollup',
    title: 'Doctor Admissions Breakdown by Year',
    description: "Provide a breakdown of the total number of admissions each doctor attended per year. Show doctor_id, doctor_full_name, specialty, year, and total_admissions.",
    hint: "Extract year with SUBSTR(admission_date, 1, 4) AS admission_year and GROUP BY doctor_id, admission_year.",
    starterSql: "SELECT d.doctor_id, d.first_name || ' ' || d.last_name AS doctor_full_name, d.specialty,\n  SUBSTR(a.admission_date, 1, 4) AS admission_year,\n  COUNT(*) AS total_admissions\nFROM doctors d\nJOIN admissions a ON d.doctor_id = a.attending_doctor_id\nGROUP BY d.doctor_id, admission_year\nORDER BY d.doctor_id, admission_year;",
    solutionSql: "SELECT d.doctor_id, d.first_name || ' ' || d.last_name AS doctor_full_name, d.specialty,\n  SUBSTR(a.admission_date, 1, 4) AS admission_year,\n  COUNT(*) AS total_admissions\nFROM doctors d\nJOIN admissions a ON d.doctor_id = a.attending_doctor_id\nGROUP BY d.doctor_id, admission_year\nORDER BY d.doctor_id, admission_year;"
  },
  {
    id: 'hosp-hard-51',
    database: 'hospital',
    difficulty: 'Hard',
    category: 'Window Ranking',
    title: 'Rank Doctors by Patient Count',
    description: 'Use DENSE_RANK() to rank doctors by the number of unique patients they have treated. Show doctor first_name, last_name, unique_patients, and doctor_rank.',
    hint: 'DENSE_RANK() OVER (ORDER BY COUNT(DISTINCT a.patient_id) DESC) AS doctor_rank.',
    starterSql: "SELECT d.first_name, d.last_name,\n  COUNT(DISTINCT a.patient_id) AS unique_patients,\n  DENSE_RANK() OVER (ORDER BY COUNT(DISTINCT a.patient_id) DESC) AS doctor_rank\nFROM doctors d\nLEFT JOIN admissions a ON d.doctor_id = a.attending_doctor_id\nGROUP BY d.doctor_id\nORDER BY doctor_rank;",
    solutionSql: "SELECT d.first_name, d.last_name,\n  COUNT(DISTINCT a.patient_id) AS unique_patients,\n  DENSE_RANK() OVER (ORDER BY COUNT(DISTINCT a.patient_id) DESC) AS doctor_rank\nFROM doctors d\nLEFT JOIN admissions a ON d.doctor_id = a.attending_doctor_id\nGROUP BY d.doctor_id\nORDER BY doctor_rank;"
  },
  {
    id: 'hosp-hard-52',
    database: 'hospital',
    difficulty: 'Hard',
    category: 'String Construction',
    title: 'Generate Temporary Hospital Passwords',
    description: "Generate a temporary portal password for all patients who have been admitted. The password pattern is: patient_id followed by first 2 letters of last_name capitalized, followed by birth year (e.g. 1WA1963).",
    hint: "Use patient_id || UPPER(SUBSTR(last_name, 1, 2)) || SUBSTR(birth_date, 1, 4) AS temp_password.",
    starterSql: "SELECT DISTINCT p.patient_id, p.first_name, p.last_name,\n  p.patient_id || UPPER(SUBSTR(p.last_name, 1, 2)) || SUBSTR(p.birth_date, 1, 4) AS temp_password\nFROM patients p\nJOIN admissions a ON p.patient_id = a.patient_id;",
    solutionSql: "SELECT DISTINCT p.patient_id, p.first_name, p.last_name,\n  p.patient_id || UPPER(SUBSTR(p.last_name, 1, 2)) || SUBSTR(p.birth_date, 1, 4) AS temp_password\nFROM patients p\nJOIN admissions a ON p.patient_id = a.patient_id;"
  }
];
