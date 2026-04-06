package com.campushub.campus_hub.Controller;

import com.campushub.campus_hub.DTO.CheckInDTO;
import com.campushub.campus_hub.Service.CheckInService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/checkIn")
@RequiredArgsConstructor
public class CheckInController {

    private final CheckInService checkinService;

    @PostMapping("/{locationId}")
    public ResponseEntity<String> checkin(@PathVariable String locationId, Authentication authentication) {
        String studentId = authentication.getName();
        checkinService.saveCheckIn(studentId, locationId);
        return ResponseEntity.ok("Checkin successful for Student: " + studentId + " 5 points granted to your account!");
    }

    @GetMapping("/my-history")
    public ResponseEntity<List<CheckInDTO>> getMyHistory(Authentication authentication) {
        String studentId = authentication.getName();
        return ResponseEntity.ok(checkinService.getAllCheckIns(studentId));
    }
}