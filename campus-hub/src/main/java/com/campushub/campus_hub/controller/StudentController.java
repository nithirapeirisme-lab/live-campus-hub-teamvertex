package com.campushub.campus_hub.controller;

import com.campushub.campus_hub.dto.StudentDTO;
import com.campushub.campus_hub.service.StudentRewardService;
import com.campushub.campus_hub.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StudentController {
    private final StudentService studentService;
    private final StudentRewardService studentRewardService;

    @PostMapping
    public ResponseEntity<Void> saveStudent(@RequestBody StudentDTO studentDTO) {
        studentService.saveStudent(studentDTO);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/save-students")
    public ResponseEntity<String> registerStudents(@RequestBody List<StudentDTO> studentDTOs) {
        studentService.saveStudents(studentDTOs);
        return ResponseEntity.ok("All students registered successfully.");
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

    @PostMapping("/profile/image")
    public ResponseEntity<String> uploadProfileImage(@RequestParam("file") MultipartFile file,
                                                     Authentication authentication) {
        String studentId = authentication.getName();
        String image = studentService.updateProfileImage(studentId, file);

        return ResponseEntity.ok(image);
    }

    @PostMapping("/apply-discount")
    public ResponseEntity<String> applyDiscount(@RequestParam String studentId, @RequestParam String discountTier) {
        studentRewardService.redeemDiscount(studentId, discountTier);
        return ResponseEntity.ok("Discount " + discountTier + " applied and marked as used.");
    }
}
