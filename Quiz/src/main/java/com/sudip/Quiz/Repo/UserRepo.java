package com.sudip.Quiz.Repo;

import com.sudip.Quiz.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {

    User findByUsername(String username);

    @Query(value = "SELECT u.id FROM quiz q JOIN user u ON q.created_by = u.id WHERE u.username = :username ORDER BY q.created_date DESC LIMIT 1", nativeQuery = true)
    Long findIdByUsernameForEmptyQuiz(String username);


    @Query("SELECT u.id FROM User u WHERE u.username = :username")
    Long findIdByUsernameForResult(String username);
}
