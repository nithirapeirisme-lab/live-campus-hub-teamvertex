package com.campushub.campus_hub.service.impl;

import com.campushub.campus_hub.dao.ClubDao;
import com.campushub.campus_hub.dao.StudentDao;
import com.campushub.campus_hub.dto.StudentsClubDTO;
import com.campushub.campus_hub.dao.StudentsClubDao;
import com.campushub.campus_hub.entity.ClubEntity;
import com.campushub.campus_hub.entity.StudentEntity;
import com.campushub.campus_hub.entity.StudentsClubEntity;
import com.campushub.campus_hub.entity.StudentsClubId;
import com.campushub.campus_hub.exceptions.ResourceNotFoundException;
import com.campushub.campus_hub.exceptions.StudentClubNotFoundException;
import com.campushub.campus_hub.service.StudentsClubService;
import com.campushub.campus_hub.util.EntityDTOConversion;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class StudentsClubServiceImpl implements StudentsClubService {
    private final StudentsClubDao studentsClubDao;
    private final EntityDTOConversion entityDTOConversion;
    private final ClubDao clubDao;
    private final StudentDao studentDao;

    @Override
    public StudentsClubDTO saveStudentsClub(StudentsClubDTO dto) {
        ClubEntity club = clubDao.findById(dto.getClub_id())
                .orElseThrow(() -> new ResourceNotFoundException("Club not found with ID: " + dto.getClub_id()));

        StudentEntity student = studentDao.findById(dto.getStudent_id())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + dto.getStudent_id()));

        StudentsClubEntity entity = new StudentsClubEntity();
        entity.setClub(club);
        entity.setStudent(student);

        StudentsClubId id = new StudentsClubId(dto.getStudent_id(), dto.getClub_id());
        entity.setId(id);

        entity.setJoined_date(dto.getJoined_date() != null ? dto.getJoined_date() : LocalDate.now());
        entity.setActiveStatus(dto.getActiveStatus() != null ? dto.getActiveStatus() : true);

        StudentsClubEntity saved = studentsClubDao.save(entity);
        return entityDTOConversion.toStudentsClubDTO(saved);
    }

    @Override
    public void updateStudentsClub(String studentId, String clubId) {
        StudentsClubEntity membership = studentsClubDao.findByIdStudentIdAndIdClubId(studentId, clubId)
                .orElseThrow(() -> new StudentClubNotFoundException("Student's club relationship not found."));

        membership.setActiveStatus(true);
        studentsClubDao.save(membership);
    }

    @Override
    public void deleteStudentsClub(StudentsClubDTO studentsClub) {
        StudentsClubEntity membership = studentsClubDao.findByIdStudentIdAndIdClubId(studentsClub.getStudent_id(), studentsClub.getClub_id())
                .orElseThrow(() -> new StudentClubNotFoundException("Student's club not found."));

        studentsClubDao.delete(membership);
    }

    @Override
    public StudentsClubDTO joinClub(StudentsClubDTO dto) {
        ClubEntity club = clubDao.findById(dto.getClub_id())
                .orElseThrow(() -> new ResourceNotFoundException("Club not found with ID: " + dto.getClub_id()));

        StudentEntity student = studentDao.findById(dto.getStudent_id())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + dto.getStudent_id()));

        StudentsClubEntity entity = new StudentsClubEntity();
        entity.setClub(club);
        entity.setStudent(student);

        StudentsClubId id = new StudentsClubId(dto.getStudent_id(), dto.getClub_id());
        entity.setId(id);

        entity.setJoined_date(LocalDate.now());
        entity.setActiveStatus(true);

        StudentsClubEntity saved = studentsClubDao.save(entity);
        return entityDTOConversion.toStudentsClubDTO(saved);
    }

    @Override
    public void deactivateMembership(String studentId, String clubId) {
        StudentsClubEntity membership = studentsClubDao.findByIdStudentIdAndIdClubId(studentId, clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Membership not found for this Student and Club"));

        membership.setActiveStatus(false);
        studentsClubDao.save(membership);
    }

    @Override
    public List<StudentsClubDTO> getStudentsClubs() {
        List<StudentsClubEntity> studentsClubs = studentsClubDao.findAll();
        return entityDTOConversion.toStudentsClubDTOList(studentsClubs);
    }
}