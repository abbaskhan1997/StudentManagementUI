import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StudentService } from '../services/student.service';
import { Student as StudentModel } from '../Models/student';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student',
  imports: [FormsModule],
  templateUrl: './student.html',
  styleUrl: './student.css',
})
export class Student implements OnInit {
  students: StudentModel[] = [];

  student: StudentModel = {
    id: 0,
    name: '',
    age: 0,
    email: '',
    course: '',
    AdmissionDate: '',
  };

  constructor(
    private studentservice: StudentService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.getStudents();
  }

  getStudents() {
    this.studentservice.getStudents().subscribe((response: StudentModel[]) => {
      console.log(response);
      this.students = response;
      this.cdr.detectChanges();
    });
  }

  addStudent() {

    const studentToSend = {
    ...this.student,
    AdmissionDate: new Date(this.student.AdmissionDate + 'T00:00:00Z')
  };

    this.studentservice.addStudent(this.student).subscribe((response: StudentModel) => {
      console.log('Student added:', response);
      this.getStudents(); // Refresh the student list after adding a new student

      this.student = {
  id: 0,
  name: '',
  email: '',
  age: 0,
  course: '',
  AdmissionDate: ''
};
    });
  }
}
