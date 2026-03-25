package com.campushub.campus_hub.Controller;

import com.campushub.campus_hub.DTO.StudentsClubDTO;
import com.campushub.campus_hub.Service.StudentsClubService;
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

    @PostMapping("/join")
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
}
