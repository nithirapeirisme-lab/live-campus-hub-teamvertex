package com.campushub.campus_hub.controller;

import com.campushub.campus_hub.dto.StudentsClubDTO;
import com.campushub.campus_hub.service.StudentsClubService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/students_club")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StudentsClubController {
    private final StudentsClubService studentsClubService;

    @PostMapping("/join-auth")
    public ResponseEntity<Void> joinClub(@RequestBody StudentsClubDTO studentsClubDTO, Authentication authentication){
        studentsClubDTO.setStudent_id(authentication.getName());
        studentsClubService.saveStudentsClub((StudentsClubDTO) studentsClubDTO);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    public ResponseEntity<List<StudentsClubDTO>> getStudentsClubs() {
        return ResponseEntity.ok(studentsClubService.getStudentsClubs());
    }

    @PutMapping("/{clubId}")
        public ResponseEntity<Void> updateMembership(@PathVariable String clubId, Authentication authentication){
        String student_id = authentication.getName();
        studentsClubService.updateStudentsClub(student_id, clubId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping("/leave")
    public ResponseEntity<Void> leaveClub(@RequestBody StudentsClubDTO studentsClubDTO, Authentication authentication){
        studentsClubDTO.setStudent_id(authentication.getName());
        studentsClubService.deleteStudentsClub(studentsClubDTO);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PostMapping("/join")
    public ResponseEntity<StudentsClubDTO> join(@RequestBody StudentsClubDTO request) {
        return ResponseEntity.ok(studentsClubService.joinClub(request));
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivate(@PathVariable String  student_id, String club_id) {
        studentsClubService.deactivateMembership(student_id, club_id);
        return ResponseEntity.noContent().build();
    }
}
