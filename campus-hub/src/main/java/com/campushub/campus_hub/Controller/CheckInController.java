package com.campushub.campus_hub.Controller;

import com.campushub.campus_hub.DTO.CheckInDTO;
import com.campushub.campus_hub.Service.CheckInService;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/checkIn")
@RequiredArgsConstructor
public class CheckInController {

    private final CheckInService checkinService;

    @PostMapping("/at-location/{locationId}")
    public ResponseEntity<String> checkin(@PathVariable Long locationId, Authentication authentication) {
        String studentId = authentication.name();
        checkinService.saveCheckIn(studentId, String.valueOf(locationId));
        return ResponseEntity.ok("Checkin successful for Student: " + studentId);
    }

    @GetMapping("/my-history")
    public ResponseEntity<List<CheckInDTO>> getMyHistory(Authentication authentication) {
        String studentId = authentication.name();
        return ResponseEntity.ok(checkinService.getAllCheckIns(studentId));
    }
}