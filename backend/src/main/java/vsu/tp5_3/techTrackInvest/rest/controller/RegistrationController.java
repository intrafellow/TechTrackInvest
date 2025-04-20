package vsu.tp5_3.techTrackInvest.rest.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vsu.tp5_3.techTrackInvest.dto.AppErrorDto;
import vsu.tp5_3.techTrackInvest.dto.RegistrationDto;
import vsu.tp5_3.techTrackInvest.service.UserService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/registration")
public class RegistrationController {
    private final UserService userService;
    @PostMapping()
    public ResponseEntity<?> createNewUser(@RequestBody RegistrationDto registrationDto) {
        if (userService.findByEmail(registrationDto.getEmail()) == null) {
            return new ResponseEntity<>(new AppErrorDto( HttpStatus.BAD_REQUEST.value(), "Такой пользвоатель уже существует"),
                    HttpStatus.BAD_REQUEST);
        }
        userService.create(registrationDto);
        return ResponseEntity.ok("Заменить на нормальный ответ дто");
    }
}
