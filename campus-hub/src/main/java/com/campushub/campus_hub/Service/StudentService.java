package com.campushub.campus_hub.Service;

import com.campushub.campus_hub.DTO.StudentDTO;

import java.util.List;

public interface StudentService {
    void saveStudent(StudentDTO student);
    void updateStudent(StudentDTO student);
    void deleteStudent(String student_Id);
    StudentDTO getStudentById(String student_Id);
    List<StudentDTO> getAllStudents();
}
