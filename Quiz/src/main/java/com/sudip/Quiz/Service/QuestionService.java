package com.sudip.Quiz.Service;

import com.sudip.Quiz.Model.Question;
import com.sudip.Quiz.Model.Quiz;
import com.sudip.Quiz.Model.User;
import com.sudip.Quiz.Repo.QuestionRepo;
import com.sudip.Quiz.Repo.QuizRepo;
import com.sudip.Quiz.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class QuestionService {

    @Autowired
    QuestionRepo questionRepo;
    @Autowired
    UserRepo userRepo;

    @Autowired
    QuizRepo quizRepo;

    public List<Question> getAllQuestions() {
        Long id = GetUserId();
        System.out.println("My Id "+ id);
       return questionRepo.findByCreatedBy_Id(id);
    }

    public Long GetUserId(){
        String username = getCurrentUsername();
        return questionRepo.findIdByUsername(username);
    }

    String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("AAATT "+ authentication);
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        return authentication.getName();
    }

    public Question addQuestion(Question question) {
        String username = getCurrentUsername();
        User creator = userRepo.findByUsername(username);
        question.setCreatedBy(creator);

        return questionRepo.save(question);
    }

    public List<String> getAllCategories() {
        Long id = GetUserId();

        return questionRepo.findAllCategory(id);
    }

    @Transactional
    public void deleteQuestion(Long id) {
//        List<Quiz> quizzes = quizRepo.findByQuestions_Id(id);
//        for (Quiz quiz : quizzes) {
//            quiz.getQuestions().removeIf(question -> question.getId().equals(id));
//            quizRepo.save(quiz);
//        }
//        questionRepo.deleteById(Math.toIntExact(id));

        quizRepo.removeQuestionFromAllQuizzes(id);

        // Then delete the question
        questionRepo.deleteById((int) Math.toIntExact(id));
    }
}
