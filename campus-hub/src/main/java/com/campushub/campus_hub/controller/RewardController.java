package com.campushub.campus_hub.controller;

import com.campushub.campus_hub.dto.RewardDTO;
import com.campushub.campus_hub.service.RewardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/rewards")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RewardController {
    private final RewardService rewardService;

    @PostMapping
    public ResponseEntity<Void> saveReward(@RequestBody RewardDTO rewardDTO){
        rewardService.createReward(rewardDTO);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    public ResponseEntity<List<RewardDTO>> getAllRewards(){
        return ResponseEntity.ok(rewardService.getAllRewards());
    }

    @GetMapping("/{reward_id}")
    public ResponseEntity<RewardDTO> getRewardById(@PathVariable("reward_id") String reward_id){
        return ResponseEntity.ok(rewardService.getRewardDetails(reward_id));
    }

    @PostMapping("/add-points/{points}")
    public ResponseEntity<String> addPoints(@PathVariable("points") BigDecimal points, Authentication auth){
        String studentId = auth.getName();
        rewardService.addPoints(studentId, points);
        return ResponseEntity.ok(points + "points were added successfully!");
    }

}
