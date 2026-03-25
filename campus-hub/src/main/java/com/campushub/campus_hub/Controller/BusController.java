package com.campushub.campus_hub.Controller;

import com.campushub.campus_hub.DTO.BusDTO;
import com.campushub.campus_hub.Exceptions.BusNotFoundException;
import com.campushub.campus_hub.Service.BusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bus")
@CrossOrigin(origins = "*")
public class BusController {
    private final BusService busService;

    @Autowired
    public BusController(BusService busService) {
        this.busService = busService;
    }

    @PostMapping("/save" )
    public ResponseEntity<Void> addBus(@RequestBody BusDTO busDTO) {
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

    @GetMapping(value = "getall", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<BusDTO>> getAllBuses(){
            return ResponseEntity.ok(busService.getAllBuses());

    }
}
