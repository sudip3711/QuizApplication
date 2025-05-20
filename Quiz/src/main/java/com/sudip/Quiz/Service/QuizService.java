package com.sudip.Quiz.Service;

import com.sudip.Quiz.Model.*;
import com.sudip.Quiz.Repo.QuestionRepo;
import com.sudip.Quiz.Repo.QuizRepo;
import com.sudip.Quiz.Repo.ResultRepo;
import com.sudip.Quiz.Repo.UserRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class QuizService {

    @Autowired
    private QuizRepo quizRepo;
    @Autowired
    private QuestionRepo questionRepo;

    @Autowired
    QuestionService questionService;

    @Autowired
    UserRepo userRepo;

    @Autowired
    ResultRepo resultRepo;



    public Optional<List<QuizSummaryForGetAll>> getCurrentUserQuizTitles() {
//        Long Id = questionService.GetUserId();
        String username = questionService.getCurrentUsername();
        Long Id = userRepo.findIdByUsernameForEmptyQuiz(username);
           System.out.println("Created By Id "+ Id);
        return quizRepo.findTitlesByCreatedBy(Id);
    }

    @Transactional
    public ResponseEntity<List<QuestionWrapper>> getQuizQuestions(Integer id) {
        Optional<Quiz> quiz= quizRepo.findById(id);
        if (quiz.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        List<Question> questionListDb = quiz.get().getQuestions();
        List<QuestionWrapper> questionForUser = new ArrayList<>();

        for (Question q: questionListDb){
            QuestionWrapper qw = new QuestionWrapper(Math.toIntExact(q.getId()),q.getQuestionTitle(),q.getCategory(),
                    q.getOption1(),q.getOption2(),q.getOption3(),q.getOption4());
            questionForUser.add(qw);
        }

        return  new ResponseEntity<>(questionForUser,HttpStatus.OK);
    }



    @Transactional
    public ResponseEntity<?> addQuestionToQuiz(Long quizId, Long questionId) {
        String username = questionService.getCurrentUsername();

        // Find user ID by username
        Long userId = userRepo.findIdByUsernameForEmptyQuiz(username);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("User not found");
        }

        // Find the quiz and question
        Optional<Quiz> quizOptional = quizRepo.findById(Math.toIntExact(quizId));
        Optional<Question> questionOptional = questionRepo.findById(Math.toIntExact(questionId));

        if (quizOptional.isEmpty() || questionOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Quiz or Question not found");
        }

        Quiz quiz = quizOptional.get();
        Question question = questionOptional.get();

        // Verify question ownership
        if (!question.getCreatedBy().getId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You can only add questions you created");
        }

        // Check if question already exists in quiz
        if (quiz.getQuestions().contains(question)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Question already exists in this quiz");
        }

        // Add question to quiz
        quiz.getQuestions().add(question);
        quizRepo.save(quiz);

        return ResponseEntity.ok("Question added to quiz successfully");
    }



    public AvailabilityDTO getQuizWithAvailability(Integer id) {
        QuizSummary summary = quizRepo.findTitlesByQuizId(id);
        if (summary == null) {
            throw new RuntimeException("Quiz not found with id: " + id);
        }

        boolean isAvailable = isQuizAvailable(summary);
        return new AvailabilityDTO(summary, isAvailable);
    }



    private boolean isQuizAvailable(QuizSummary summary) {
        LocalDateTime now = LocalDateTime.now();
        return now.isAfter(summary.getQuizStartTime()) &&
                now.isAfter(summary.getQuizStartTime()) &&
                now.isBefore(summary.getQuizEndTime());
    }




    public ResponseEntity<String> createQuizUsingTitle(
            String title,
            LocalDateTime quizStartTime,
            LocalDateTime quizEndTime,
            Boolean isActive,
            Integer defaultPointsPerQuestion) {

        User creator = userRepo.findByUsername(questionService.getCurrentUsername());
        if (creator == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        Quiz quiz = new Quiz();
        quiz.setTitle(title);
        quiz.setCreatedBy(creator);
        quiz.setQuizStartTime(quizStartTime != null ? quizStartTime : LocalDateTime.now());
        quiz.setQuizEndTime(quizEndTime != null ? quizEndTime : LocalDateTime.now().plusDays(7));
        quiz.setIsActive(isActive != null ? isActive : false);
        quiz.setDefaultPointsPerQuestion(defaultPointsPerQuestion != null ? defaultPointsPerQuestion : 1);

        Quiz savedQuiz = quizRepo.save(quiz);

        return new ResponseEntity<>(
                "Quiz created successfully. ID: " + savedQuiz.getId() +
                        "\nQuiz available: " + savedQuiz.isAvailable(),
                HttpStatus.CREATED
        );
    }

    public ResponseEntity<String> createQuiz(
            String category,
            int numQ,
            String title,
            LocalDateTime quizStartTime,
            LocalDateTime quizEndTime,
            Boolean isActive,
            Integer defaultPointsPerQuestion) {

        if (numQ <= 0) {
            return new ResponseEntity<>("Number of questions must be positive", HttpStatus.BAD_REQUEST);
        }

        User creator = userRepo.findByUsername(questionService.getCurrentUsername());
        if (creator == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        List<Question> questions = questionRepo.findRandomQuestionsByCategory(
                category,
                creator.getId(),
                numQ
        );

        if (questions.isEmpty()) {
            return new ResponseEntity<>("No questions available for this category", HttpStatus.BAD_REQUEST);
        }

        Quiz quiz = new Quiz();
        quiz.setTitle(title);
        quiz.setQuestions(questions);
        quiz.setCreatedBy(creator);
        quiz.setQuizStartTime(quizStartTime != null ? quizStartTime : LocalDateTime.now());
        quiz.setQuizEndTime(quizEndTime != null ? quizEndTime : LocalDateTime.now().plusDays(7));
        quiz.setIsActive(isActive != null ? isActive : false);
        quiz.setDefaultPointsPerQuestion(defaultPointsPerQuestion != null ? defaultPointsPerQuestion : 1);

        Quiz savedQuiz = quizRepo.save(quiz);

        return new ResponseEntity<>(
                "Quiz created successfully. ID: " + savedQuiz.getId() +
                        "\nQuiz available: " + savedQuiz.isAvailable(),
                HttpStatus.CREATED
        );
    }



//    TODO


@Transactional
public ResponseEntity<?> submitQuiz(Integer quizId, List<Response> responses) {
    // 1. Get authenticated user
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "User not authenticated"));
    }

    String username = authentication.getName();
    User user = userRepo.findByUsername(username);
    if (user == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "User not found"));
    }

    // 2. Get quiz
    Quiz quiz = quizRepo.findById(quizId)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Quiz not found"));
    System.out.println(quiz);

    // 3. Check for existing attempt
    if (resultRepo.existsByUserAndQuiz(user, quiz)) {
        throw new ResponseStatusException(
                HttpStatus.CONFLICT, "You've already taken this quiz");
    }

    try {
        // 4. Calculate score
        int pointsPerQuestion = quiz.getDefaultPointsPerQuestion() != null ?
                quiz.getDefaultPointsPerQuestion() : 1;

        int correctAnswers = 0;
        Map<Integer, Boolean> questionResults = new HashMap<>();

        for (Response response : responses) {
            Question question = questionRepo.findById(response.getId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Question not found with id: " + response.getId()));

            boolean isCorrect = response.getResponse().equals(question.getRightAnswer());
            if (isCorrect) correctAnswers++;
            questionResults.put(response.getId(), isCorrect);
        }

        // 5. Save result
        Result result = new Result();
        result.setUser(user);
        result.setQuiz(quiz);
        result.setScore(quiz.getQuestions().size() * pointsPerQuestion);
        result.setGainScore(correctAnswers * pointsPerQuestion);
        resultRepo.save(result);

        return  new ResponseEntity<>(correctAnswers * pointsPerQuestion,HttpStatus.OK);


    } catch (Exception ex) {
        // Convert to ResponseStatusException to avoid rollback-only
        throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Internal server error: " + ex.getMessage());
    }
}


}
