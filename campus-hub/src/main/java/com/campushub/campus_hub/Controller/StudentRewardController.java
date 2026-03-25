package com.campushub.campus_hub.Controller;

import com.campushub.campus_hub.DTO.StudentRewardDTO;
import com.campushub.campus_hub.Service.StudentRewardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/student_rewards")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StudentRewardController {
    private final StudentRewardService studentRewardService;

    @PostMapping("/assign")
    public ResponseEntity<StudentRewardDTO> assignReward(@RequestBody StudentRewardDTO rewardDTO, Authentication authentication) {
        studentRewardService.checkDuplicateReward(rewardDTO.getStudent_id(), rewardDTO.getReward_id());
        studentRewardService.assignRewardsToStudent(rewardDTO);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/admin/all")
    public ResponseEntity<List<StudentRewardDTO>> getAllRewards(Authentication authentication) {
        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.ok(studentRewardService.getAllStudentRewards());
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @GetMapping("/my-rewards")
    public ResponseEntity<List<StudentRewardDTO>> getMyRewards(Authentication authentication) {
        String studentId = authentication.getName();
        return ResponseEntity.ok(studentRewardService.getAllStudentRewards());
    }


}
