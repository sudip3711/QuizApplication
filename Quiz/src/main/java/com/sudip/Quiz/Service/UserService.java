package com.sudip.Quiz.Service;

import com.sudip.Quiz.Model.User;
import com.sudip.Quiz.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class UserService {

    @Autowired
    UserRepo userRepo;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtService jwtService;

    BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(12);

    public User registerUser(User user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        return userRepo.save(user);
    }


//    public String verify(User user) {
//        try {
//            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
//            return jwtService.generateToken(user.getUsername());
//        } catch (BadCredentialsException e) {
//            return "failure"+" " + e;
//        }
////        Authentication authentication = authenticationManager.authenticate( new UsernamePasswordAuthenticationToken(user.getUsername(),user.getPassword()));
////
////        System.out.println(user.getUsername());
////        if (!authentication.isAuthenticated()) {
////            return jwtService.generateToken(user.getUsername());
////        } else {
////            return "failure";
////        }
//
//
//    }



public ResponseEntity<?> verify(User user) {
    try {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
        );
        String DisUsername =user.getUsername();
        String token = jwtService.generateToken(user.getUsername());
        return ResponseEntity.ok()
                .body(Map.of(
                        "token", token,
                        "message", "Authentication successful",
                        "username",DisUsername
                ));
    } catch (BadCredentialsException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                        "error", "Invalid credentials",
                        "message", e.getMessage()
                ));
    }
}
}


