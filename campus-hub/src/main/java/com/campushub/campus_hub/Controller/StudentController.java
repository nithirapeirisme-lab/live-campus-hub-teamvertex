package com.campushub.campus_hub.Controller;

import com.campushub.campus_hub.DTO.StudentDTO;
import com.campushub.campus_hub.Service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StudentController {
    private final StudentService studentService;

    @PostMapping
    public ResponseEntity<Void> saveStudent(@RequestBody StudentDTO studentDTO) {
        studentService.saveStudent(studentDTO);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/me")
    public ResponseEntity<StudentDTO> getMe(Authentication authentication) {
        String studentId = authentication.getName();
        return ResponseEntity.ok(studentService.getStudentById(studentId));
    }

    @PutMapping("/me")
    public ResponseEntity<Void> updateMe(@RequestBody StudentDTO studentDTO, Authentication authentication) {
        studentDTO.setStudent_id(authentication.getName());
        studentService.updateStudent(studentDTO);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping
    public ResponseEntity<List<StudentDTO>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable String id) {
        studentService.deleteStudent(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
