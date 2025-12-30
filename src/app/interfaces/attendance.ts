export interface attenance {
  id: string;
  subject: string;
  program: string;
  section: string;
  semester: 7;
  date: string;
  attendance: [
    {
      studentId: string;
      fullName: string;
      status: string;
    }
  ];
}
