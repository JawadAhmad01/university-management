export interface studTimeTable {
  id: string;
  class: string;
  semester: number;
  days: [
    {
      id: string;
      instructor: string;
      day: string;
      time: string;
      subject: string;
      room: number;
    }
  ];
}
