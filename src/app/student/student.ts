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

  validateForm(): boolean {
  //  general validation
  if (
    !this.student.name ||
    !this.student.age ||
    !this.student.email ||
    !this.student.course ||
    !this.student.admissionDate
  ) {
    alert('Please fill all required fields!');
    return false;
  }
    
  // format validation
    if (!/^[A-Za-z ]+$/.test(this.student.name)) {
      alert('Name can contain only alphabets!');
      return false;
    }

    if (!this.student.age) {
      alert('Age is required!');
      return false;
    }

    if (!/^[0-9]+$/.test(this.student.age.toString())) {
      alert('Age can contain only numbers!');
      return false;
    }

    if (!this.student.email) {
      alert('Email is required!');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.student.email)) {
      alert('Please enter a valid email!');
      return false;
    }

    if (!this.student.course) {
      alert('Course is required!');
      return false;
    }

    if (!/^[A-Za-z0-9 ]+$/.test(this.student.course)) {
      alert('Course can contain only letters and numbers!');
      return false;
    }

    if (!this.student.admissionDate) {
      alert('Admission Date is required!');
      return false;
    }

    return true;
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
    if (!this.validateForm()) {
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

  editStudent(student: StudentModel) {
    this.student = {
      ...student,
      admissionDate: student.admissionDate.split('T')[0],
    };
    this.isEditMode = true;
  }

  updateStudent(student: StudentModel, form: any) {
    if (!this.validateForm()) {
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

  deleteStudent(id: number) {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentservice.deleteStudent(id).subscribe({
        next: () => {
          alert('Student deleted successfully!');
          this.getStudents(); // Refresh the student list after deletion
        },
        error: (error) => {
          console.error('Error deleting student:', error);
        },
      });
    }
  }
}
