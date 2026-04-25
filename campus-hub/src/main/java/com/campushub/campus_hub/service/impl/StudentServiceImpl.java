package com.campushub.campus_hub.service.impl;

import com.campushub.campus_hub.dto.StudentDTO;
import com.campushub.campus_hub.dao.StudentDao;
import com.campushub.campus_hub.entity.StudentEntity;
import com.campushub.campus_hub.exceptions.StudentNotFoundException;
import com.campushub.campus_hub.service.StudentService;
import com.campushub.campus_hub.util.EntityDTOConversion;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {
    private final StudentDao studentDao;
    private final EntityDTOConversion entityDTOConversion;
    private final FileStorageService fileStorageService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void saveStudent(StudentDTO student) {
        StudentEntity entity = entityDTOConversion.toStudentEntity(student);
        entity.setStudent_pwd(passwordEncoder.encode(student.getStudent_pwd()));
        studentDao.save(entity);
    }

    @Override
    public void saveStudents(List<StudentDTO> students) {
        List<StudentEntity> studentEntities = students.stream()
                .map(entityDTOConversion::toStudentEntity)
                .collect(Collectors.toList());

        for (StudentEntity student : studentEntities) {
            student.setStudent_pwd(passwordEncoder.encode(student.getStudent_pwd()));
        }
        studentDao.saveAll(studentEntities);
    }

    @Override
    public void updateStudent(StudentDTO student) {
        Optional<StudentEntity> foundStudent = studentDao.findById(student.getStudent_id());
        if (!foundStudent.isPresent()) {
            throw new StudentNotFoundException("Student not found");
        }

        foundStudent.get().setStudent_id(student.getStudent_id());
        foundStudent.get().setStudent_pwd(student.getStudent_pwd());
        foundStudent.get().setFirst_name(student.getFirst_name());
        foundStudent.get().setLast_name(student.getLast_name());
        foundStudent.get().setPhone(student.getPhone());
        foundStudent.get().setEmail(student.getEmail());
        foundStudent.get().setEnrolled_Year(student.getEnrolled_Year());
        foundStudent.get().setDepartment_id(student.getDepartment_id());

    }

    @Override
    public void deleteStudent(String student_Id) {
        Optional<StudentEntity> foundStudent = studentDao.findById(student_Id);
        if (!foundStudent.isPresent()) {
            throw new StudentNotFoundException("Student not found");
        }
        studentDao.delete(foundStudent.get());

    }

    @Override
    public String updateProfileImage(String studentId, MultipartFile file) {
        StudentEntity studentEntity = studentDao.findById(studentId).
                orElseThrow(() -> new StudentNotFoundException("Student not found with id: " + studentId));

        String fileName = fileStorageService.saveProfileImage(file);

        studentEntity.setProfileImageUrl(("/uploads/profiles/" + fileName));
        studentDao.save(studentEntity);
        return studentEntity.getProfileImageUrl();
    }

    @Override
    public StudentDTO getStudentById(String student_Id) {
        Optional<StudentEntity> student = studentDao.findById(student_Id);
        if (!student.isPresent()) {
            throw new StudentNotFoundException("Student not found.");
        }
        return entityDTOConversion.toStudentDTO(studentDao.getReferenceById(student.get().getStudent_id()));
    }

    @Override
    public List<StudentDTO> getAllStudents() {
        List<StudentEntity> allStudents = studentDao.findAll();
        return entityDTOConversion.toStudentDTOList(allStudents);
    }
}
