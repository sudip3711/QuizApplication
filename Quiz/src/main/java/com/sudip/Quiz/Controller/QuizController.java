package com.sudip.Quiz.Controller;

import com.sudip.Quiz.Model.*;
import com.sudip.Quiz.Service.QuizService;

import com.sudip.Quiz.Service.ResultService;

import com.sudip.Quiz.Service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/quiz")
@CrossOrigin(origins = "http://localhost:5173")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @Autowired
   ResultService resultService;


    @PostMapping("/create")
    public ResponseEntity<String> createQuiz(
            @RequestParam String category,
            @RequestParam int numQ,
            @RequestParam String title,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime quizStartTime,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime quizEndTime,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) Integer defaultPointsPerQuestion) {

        return quizService.createQuiz(
                category, numQ, title,
                quizStartTime, quizEndTime,
                isActive, defaultPointsPerQuestion
        );
    }




    @PostMapping("createUseTitle")
    public ResponseEntity<String> createQuiz(
            @RequestParam String title,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime quizStartTime,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime quizEndTime,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) Integer defaultPointsPerQuestion) {

        return quizService.createQuizUsingTitle(
                title,
                quizStartTime, quizEndTime,
                isActive, defaultPointsPerQuestion
        );
    }





    @GetMapping("get")
    public Optional<List<QuizSummaryForGetAll>> getQuizQuestions(){
        return quizService.getCurrentUserQuizTitles();
    }

    @GetMapping("getQuestions/{id}")
    public ResponseEntity<List<QuestionWrapper>> getQuizQuestions(@PathVariable Integer id){
        return quizService.getQuizQuestions(id);
    }

    @PostMapping("/addQuestionOnQuiz/{quizId}/{questionId}")
    public ResponseEntity<?> addQuestionToQuiz(
            @PathVariable Long quizId,
            @PathVariable Long questionId) {
        return quizService.addQuestionToQuiz(quizId, questionId);
    }


    @GetMapping("/get/particular/{id}")
    public ResponseEntity<AvailabilityDTO> getQuiz(@PathVariable Integer id) {
        try {
            AvailabilityDTO response = quizService.getQuizWithAvailability(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }


    @PostMapping("submit/{id}")
    public ResponseEntity<?> submitQuiz(
            @PathVariable("id") Integer quizId,
            @RequestBody List<Response> responses) {
        return quizService.submitQuiz(quizId, responses);
    }


    @GetMapping("/getresult/{id}")
    public ResultDTO getResultByQuizIdAndUser(@PathVariable("id") Integer quizId) {
        return resultService.getResultByQuizIdAndUserId(quizId);
    }



}
