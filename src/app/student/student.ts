import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StudentService } from '../services/student.service';
import { Student as StudentModel } from '../Models/student';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-student',
  imports: [FormsModule, DatePipe],
  templateUrl: './student.html',
  styleUrl: './student.css',
})
export class Student implements OnInit {
  students: StudentModel[] = [];
  isEditMode: boolean = false;

  student: StudentModel = {
    id: 0,
    name: '',
    age: 0,
    email: '',
    course: '',
    admissionDate: '',
  };

  resetForm() {
    this.student = {
      id: 0,
      name: '',
      email: '',
      age: 0,
      course: '',
      admissionDate: '',
    };
  }

  constructor(
    private studentservice: StudentService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.getStudents();
  }

  getStudents() {
    this.studentservice.getStudents().subscribe((response: StudentModel[]) => {
      this.students = response;
      this.cdr.detectChanges();
    });
  }

  addStudent(form: any) {
     if (form.invalid) {
    alert('Please fill all required fields!');
    return;
  }

    const studentToSend = {
      ...this.student,
      admissionDate: this.student.admissionDate + 'T00:00:000',
    };

    this.studentservice.addStudent(this.student).subscribe((response: StudentModel) => {
      alert('Student added successfully!');
      this.getStudents(); // Refresh the student list after adding a new student

      this.resetForm(); // Reset the form after adding a student
    });
  }

  updateStudent(student: StudentModel , form: any) {
     if (form.invalid) {
    alert('Please fill all required fields!');
    return;
  }
    this.studentservice.updateStudent(student).subscribe({
      next: (response: StudentModel) => {
        alert('Student updated successfully!');
        this.resetForm(); // Reset the form after updating a student
        this.getStudents();
        this.isEditMode = false;
      },
      error: (error) => {
        console.error('Student Not Found:', error);
      },
    });
  }

  editStudent(student: StudentModel) {
    this.student = {
      ...student,
      admissionDate: student.admissionDate.split('T')[0],
    };
    this.isEditMode = true;
  }
}
