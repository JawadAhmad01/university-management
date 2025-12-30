export interface timetable {
  id: string;
  instructor: string;
  days: [
    {
      id: string;
      day: string;
      section: string;
      action: string;
      class: string;
      time: string;
      subject: string;
      room: number;
      semester: number;
    }
  ];
}
