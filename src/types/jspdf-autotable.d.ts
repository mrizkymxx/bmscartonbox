declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: {
      head?: any[][];
      body?: any[][];
      startY?: number;
      theme?: 'striped' | 'grid' | 'plain';
      headStyles?: any;
      alternateRowStyles?: any;
      columnStyles?: any;
      margin?: any;
      pageBreak?: string;
      rowPageBreak?: string;
      tableWidth?: string | number;
      showHead?: string;
      showFoot?: string;
    }) => jsPDF;
    lastAutoTable?: {
      finalY: number;
    };
    previousAutoTable?: {
      finalY: number;
    };
  }
}