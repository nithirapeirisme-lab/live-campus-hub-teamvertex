package com.campushub.campus_hub.service;

import com.campushub.campus_hub.dto.StudentDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface StudentService {
    void saveStudent(StudentDTO student);
    void saveStudents(List<StudentDTO> students);
    void updateStudent(StudentDTO student);
    void deleteStudent(String student_Id);
    String updateProfileImage(String studentId, MultipartFile file);
    StudentDTO getStudentById(String student_Id);
    List<StudentDTO> getAllStudents();
}
