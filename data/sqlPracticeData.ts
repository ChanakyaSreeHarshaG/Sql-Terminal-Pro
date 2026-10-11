import { HOSPITAL_QUESTIONS } from './sqlPractice/hospitalQuestions';
import { NORTHWIND_QUESTIONS } from './sqlPractice/northwindQuestions';
import { SQL_PATTERNS, PATTERN_QUESTIONS, SqlPatternDefinition } from './sqlPractice/patternQuestions';
import { PATTERNS_DATABASE_DEFINITION, PATTERNS_INIT_SQL } from './sqlPractice/patternsData';

export interface SqlColumn {
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
  references?: string;
}

export interface SqlTableSchema {
  tableName: string;
  description: string;
  columns: SqlColumn[];
}

export interface SqlQuestion {
  id: string;
  database: 'hospital' | 'enterprise';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  title: string;
  description: string;
  hint: string;
  starterSql: string;
  solutionSql: string;
  category: string;
  expectedColumns?: string[];
}

export interface DatabaseDefinition {
  id: 'hospital' | 'enterprise';
  name: string;
  badge: string;
  description: string;
  initSql: string;
  tables: SqlTableSchema[];
}

// 🏥 Hospital Database DDL & Seed (Healthcare Relational Schema)
export const HOSPITAL_INIT_SQL = `
CREATE TABLE IF NOT EXISTS province_names (
  province_id TEXT PRIMARY KEY,
  province_name TEXT NOT NULL
);

INSERT INTO province_names (province_id, province_name) VALUES
('ON', 'Ontario'),
('QC', 'Quebec'),
('NS', 'Nova Scotia'),
('NB', 'New Brunswick'),
('MB', 'Manitoba'),
('BC', 'British Columbia'),
('PE', 'Prince Edward Island'),
('SK', 'Saskatchewan'),
('AB', 'Alberta'),
('NL', 'Newfoundland and Labrador');

CREATE TABLE IF NOT EXISTS doctors (
  doctor_id INTEGER PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  specialty TEXT NOT NULL
);

INSERT INTO doctors (doctor_id, first_name, last_name, specialty) VALUES
(1, 'Donna', 'Guthrie', 'Pediatrics'),
(2, 'Matthew', 'Weiss', 'Cardiology'),
(3, 'Jason', 'Adler', 'Neurology'),
(4, 'Sarah', 'Conner', 'Oncology'),
(5, 'David', 'Banner', 'Orthopedics'),
(6, 'Elena', 'Rostova', 'Dermatology'),
(7, 'Marcus', 'Brody', 'General Surgery');

CREATE TABLE IF NOT EXISTS patients (
  patient_id INTEGER PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  gender TEXT NOT NULL,
  birth_date TEXT NOT NULL,
  city TEXT NOT NULL,
  province_id TEXT NOT NULL,
  allergies TEXT,
  height INTEGER,
  weight INTEGER
);

INSERT INTO patients (patient_id, first_name, last_name, gender, birth_date, city, province_id, allergies, height, weight) VALUES
(1, 'Donald', 'Waterfield', 'M', '1963-02-12', 'Barrie', 'ON', 'Penicillin', 156, 65),
(2, 'Mickey', 'Brumleve', 'M', '1974-07-28', 'Dundas', 'ON', NULL, 180, 88),
(3, 'Jaden', 'Frost', 'M', '1998-11-04', 'Hamilton', 'ON', 'Peanuts', 172, 71),
(4, 'Kofi', 'Thomas', 'M', '1985-04-19', 'Halifax', 'NS', 'Sulfa', 188, 92),
(5, 'Sarah', 'Jenkins', 'F', '2010-06-14', 'Toronto', 'ON', NULL, 142, 45),
(6, 'Chloe', 'Simmons', 'F', '1992-09-23', 'Montreal', 'QC', 'Penicillin', 165, 58),
(7, 'Lucas', 'Graham', 'M', '2010-01-30', 'Vancouver', 'BC', NULL, 150, 48),
(8, 'Amelia', 'Watson', 'F', '1988-12-05', 'Calgary', 'AB', 'Aspirin', 170, 64),
(9, 'Stella', 'Maris', 'F', '1970-03-17', 'Sydney', 'NS', NULL, 162, 73),
(10, 'Carlos', 'Santana', 'M', '1965-08-11', 'Halifax', 'NS', 'Penicillin', 175, 82),
(11, 'Oliver', 'Queen', 'M', '1984-05-16', 'Star City', 'ON', NULL, 185, 89),
(12, 'Hannah', 'Abbott', 'F', '2001-10-09', 'Ottawa', 'ON', 'Latex', 158, 54),
(13, 'Clara', 'Oswald', 'F', '1995-11-23', 'London', 'ON', NULL, 160, 52),
(14, 'Arthur', 'Dent', 'M', '1978-04-01', 'Victoria', 'BC', 'Dust', 179, 78),
(15, 'Diana', 'Prince', 'F', '1982-03-22', 'Toronto', 'ON', NULL, 182, 75),
(45, 'Victor', 'Stone', 'M', '1994-01-25', 'Detroit', 'ON', 'Morphine', 190, 95),
(534, 'Barry', 'Allen', 'M', '1992-03-30', 'Central City', 'ON', NULL, 180, 78),
(542, 'Iris', 'West', 'F', '1993-06-24', 'Central City', 'ON', 'Penicillin', 165, 58),
(579, 'Hal', 'Jordan', 'M', '1985-02-20', 'Coast City', 'BC', NULL, 182, 85),
(879, 'John', 'Stewart', 'M', '1980-10-17', 'Detroit', 'ON', NULL, 186, 92),
(1000, 'Kara', 'Zor-El', 'F', '1996-09-22', 'National City', 'AB', NULL, 173, 62);

CREATE TABLE IF NOT EXISTS admissions (
  patient_id INTEGER NOT NULL,
  admission_date TEXT NOT NULL,
  discharge_date TEXT,
  diagnosis TEXT NOT NULL,
  attending_doctor_id INTEGER NOT NULL
);

INSERT INTO admissions (patient_id, admission_date, discharge_date, diagnosis, attending_doctor_id) VALUES
(1, '2022-09-01', '2022-09-07', 'Hypertension', 2),
(1, '2023-01-15', '2023-01-18', 'Angina', 2),
(2, '2023-05-10', '2023-05-10', 'Routine Checkup', 7),
(3, '2022-11-12', '2022-11-14', 'Anaphylaxis', 1),
(4, '2023-02-01', '2023-02-10', 'Pneumonia', 7),
(5, '2023-03-14', '2023-03-16', 'Asthma Exacerbation', 1),
(6, '2022-08-20', '2022-08-25', 'Dementia', 3),
(6, '2023-04-11', '2023-04-19', 'Dementia', 3),
(8, '2023-06-01', '2023-06-05', 'Breast Mass Biopsy', 4),
(9, '2022-12-05', '2022-12-05', 'Migraine Treatment', 3),
(10, '2023-07-04', '2023-07-12', 'Fractured Femur', 5),
(12, '2023-08-15', '2023-08-18', 'Eczema Flare-up', 6),
(15, '2023-09-02', '2023-09-04', 'Laceration Repair', 7),
(542, '2023-05-12', '2023-05-15', 'Sprained Ankle', 5),
(542, '2023-08-20', '2023-08-22', 'Acute Bronchitis', 7),
(579, '2023-04-01', '2023-04-04', 'Concussion', 3),
(579, '2023-07-18', '2023-07-20', 'Shoulder Dislocation', 5);
`;

export const DATABASES: DatabaseDefinition[] = [
  {
    id: 'hospital',
    name: 'Hospital Patient Database',
    badge: 'Healthcare Analytics (52 Qs)',
    description: 'The iconic healthcare schema featuring patients, admissions, doctors, and Canadian province regions.',
    initSql: HOSPITAL_INIT_SQL,
    tables: [
      {
        tableName: 'patients',
        description: 'Contains demographics, physical measurements, and allergy data for patients.',
        columns: [
          { name: 'patient_id', type: 'INTEGER', isPk: true },
          { name: 'first_name', type: 'TEXT' },
          { name: 'last_name', type: 'TEXT' },
          { name: 'gender', type: 'TEXT' },
          { name: 'birth_date', type: 'TEXT' },
          { name: 'city', type: 'TEXT' },
          { name: 'province_id', type: 'TEXT', isFk: true, references: 'province_names.province_id' },
          { name: 'allergies', type: 'TEXT' },
          { name: 'height', type: 'INTEGER' },
          { name: 'weight', type: 'INTEGER' }
        ]
      },
      {
        tableName: 'admissions',
        description: 'Hospital admission records with dates, diagnoses, and attending doctor IDs.',
        columns: [
          { name: 'patient_id', type: 'INTEGER', isFk: true, references: 'patients.patient_id' },
          { name: 'admission_date', type: 'TEXT' },
          { name: 'discharge_date', type: 'TEXT' },
          { name: 'diagnosis', type: 'TEXT' },
          { name: 'attending_doctor_id', type: 'INTEGER', isFk: true, references: 'doctors.doctor_id' }
        ]
      },
      {
        tableName: 'doctors',
        description: 'Medical staff directory with assigned specialties.',
        columns: [
          { name: 'doctor_id', type: 'INTEGER', isPk: true },
          { name: 'first_name', type: 'TEXT' },
          { name: 'last_name', type: 'TEXT' },
          { name: 'specialty', type: 'TEXT' }
        ]
      },
      {
        tableName: 'province_names',
        description: 'Reference lookup of 2-letter province codes to province names.',
        columns: [
          { name: 'province_id', type: 'TEXT', isPk: true },
          { name: 'province_name', type: 'TEXT' }
        ]
      }
    ]
  },
  PATTERNS_DATABASE_DEFINITION
];

// Combine all questions
export const SQL_PRACTICE_QUESTIONS: SqlQuestion[] = [
  ...HOSPITAL_QUESTIONS,
  ...NORTHWIND_QUESTIONS
];

// Re-export pattern models
export { SQL_PATTERNS, PATTERN_QUESTIONS };
export type { SqlPatternDefinition };
