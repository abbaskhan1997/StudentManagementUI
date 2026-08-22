import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student as StudentModel } from '../Models/student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }

  getStudents(): Observable<StudentModel[]> {
    return this.http.get<StudentModel[]>('https://localhost:7229/api/Students');
  }

  addStudent(student: StudentModel): Observable<StudentModel> {
    return this.http.post<StudentModel>('https://localhost:7229/api/Students', student);
  }

}