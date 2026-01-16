
export enum AnimalStatus {
  HEALTHY = 'Healthy',
  SICK = 'Sick',
  RECOVERING = 'Recovering',
  SOLD = 'Sold'
}

export interface Animal {
  id: string;
  name: string;
  species: string;
  status: AnimalStatus;
  entryDate: string;
}

export interface HealthRecord {
  id: string;
  animalId: string;
  symptoms: string;
  treatment: string;
  cost: number;
  date: string;
}

export interface FinancialEntry {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  description: string;
  date: string;
}

export interface LaborRecord {
  id: string;
  workerName: string;
  date: string;
  hours: number;
  wage: number;
  task: string;
}

export interface FarmData {
  animals: Animal[];
  healthRecords: HealthRecord[];
  finances: FinancialEntry[];
  labor: LaborRecord[];
}
