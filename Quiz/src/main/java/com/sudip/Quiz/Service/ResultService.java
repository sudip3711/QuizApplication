package com.sudip.Quiz.Service;

import com.sudip.Quiz.Model.Quiz;
import com.sudip.Quiz.Model.Result;
import com.sudip.Quiz.Model.ResultDTO;
import com.sudip.Quiz.Repo.QuizRepo;
import com.sudip.Quiz.Repo.ResultRepo;
import com.sudip.Quiz.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class ResultService {

    @Autowired
    private QuizRepo quizRepo;

    @Autowired
    UserRepo  userRepository;

    @Autowired
    ResultRepo resultRepository;

    @Autowired
    QuestionService questionService;



//    public ResultDTO getResultByQuizIdAndUserId(Integer quizId) {
//        // Get current logged-in username
//        String username = questionService.getCurrentUsername();
//
//        // Find user ID by username
//        Long userId = userRepository.findIdByUsernameForResult(username);
//
//        Quiz quiz = quizRepo.findById(quizId).orElseThrow(() -> new ResponseStatusException(
//                HttpStatus.NOT_FOUND, "Quiz not found"));
//
//
//        int pointsPerQuestion = quiz.getDefaultPointsPerQuestion() != null ?
//                quiz.getDefaultPointsPerQuestion() : 1;
//
//
//
//        if (userId == null) {
//            throw new RuntimeException("User not found with username: " + username);
//        }
//
//        // Fetch result from DB
//        Optional<Result> result = resultRepository.findByQuizIdAndUserId(quizId, userId);
//        return result.map(r -> new ResultDTO(r.getScore(), r.getGainScore(), r.getSubmittedAt(),pointsPerQuestion))
//                .orElseThrow(() -> new RuntimeException("No result found for this quiz and user."));
//    }


    public ResultDTO getResultByQuizIdAndUserId(Integer quizId) {
        // Get current logged-in username
        String username = questionService.getCurrentUsername();

        // Find user ID by username
        Long userId = userRepository.findIdByUsernameForResult(username);

        if (userId == null) {
            throw new RuntimeException("User not found with username: " + username);
        }

        Quiz quiz = quizRepo.findById(quizId).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Quiz not found"));

        int pointsPerQuestion = quiz.getDefaultPointsPerQuestion() != null ?
                quiz.getDefaultPointsPerQuestion() : 1;

        // Fetch result from DB
        Optional<Result> result = resultRepository.findByQuizIdAndUserId(quizId, userId);

        return result.map(r -> new ResultDTO(
                r.getScore(),
                r.getGainScore(),
                r.getSubmittedAt()
        )).orElseThrow(() -> new RuntimeException("No result found for this quiz and user."));
    }








}
