package com.campushub.campus_hub.controller;

import com.campushub.campus_hub.dto.BusDTO;
import com.campushub.campus_hub.dao.BusDao;
import com.campushub.campus_hub.exceptions.BusNotFoundException;
import com.campushub.campus_hub.service.BusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bus")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BusController {
    private final BusService busService;
    private final BusDao busDao;


    @PostMapping("/save" )
    public ResponseEntity<String> addBus(@RequestBody BusDTO busDTO) {
        busService.saveBus(busDTO);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("{bus_id}")
    public ResponseEntity<Void> deleteBus(@PathVariable String bus_id) {
        try{
            busService.deleteBus(bus_id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }catch(BusNotFoundException e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping
    public ResponseEntity<Void> updateBus(@RequestBody BusDTO busDTO) {
        try{
            busService.updateBus(busDTO.getBus_id(), busDTO);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }catch(BusNotFoundException e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping(value = "/get-all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<BusDTO>> getAllBuses(){
            return ResponseEntity.ok(busService.getAllBuses());

    }
}
