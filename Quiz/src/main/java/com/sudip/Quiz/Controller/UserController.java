package com.sudip.Quiz.Controller;
import com.sudip.Quiz.Model.User;
import com.sudip.Quiz.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    UserService userService;

    @PostMapping("/register")
    public User registerUser(@RequestBody User user){
        return userService.registerUser(user);
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        return userService.verify(user);
    }
    @GetMapping("/get")
    public String getData(){
        return "get data";
    }

}
