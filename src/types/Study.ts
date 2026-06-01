export interface Study {
  id: string;
  title: string;
  phase: string;
  indication: string;
  sponsor: string;
  sampleSize: number;
  protocolVersion: string;
  comparator?: string;
  population?: string;
  region?: string;
  duration?: string;
  randomization?: string;
  blinding?: string;
  status: 'Design' | 'Active' | 'Completed' | 'Archived';
  createdAt: string;
  updatedAt: string;
}
