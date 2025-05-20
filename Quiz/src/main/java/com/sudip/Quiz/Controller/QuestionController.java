package com.sudip.Quiz.Controller;

import com.sudip.Quiz.Model.Question;
import com.sudip.Quiz.Service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/question")
@CrossOrigin(origins = "http://localhost:5173" ,allowCredentials = "true")
public class QuestionController {

    @Autowired
    QuestionService questionService;


    @GetMapping("allQuestion")
    public List<Question> getAllQuestion(){

        return questionService.getAllQuestions();
    }

    @PostMapping("add")
    public Question addQuestion(@RequestBody Question question){

        return questionService.addQuestion(question);
    }

    @GetMapping("category")
    public List<String> getAllCategories() {
        return questionService.getAllCategories();
    }

    @DeleteMapping("delete/{id}")
    public void deleteQuestion(@PathVariable("id") Long id) {
        questionService.deleteQuestion(id);
    }
}
