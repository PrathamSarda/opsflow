package jar.service;

import jar.model.User;
import jar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public boolean existsByUsername(String username) {
        if (username == null) return false;
        return userRepository.existsByUsername(username.trim());
    }

    public User registerUser(User user) {
        if (user.getRole() == null || user.getRole().trim().isEmpty()) {
            user.setRole("CUSTOMER");
        }
        return userRepository.save(user);
    }

    public String login(String username, String password) {
        if (username == null || password == null) {
            return "invalid";
        }

        String cleanUsername = username.trim();

        // 1. Check default owner credentials
        if ("owner".equalsIgnoreCase(cleanUsername) && "admin123".equals(password)) {
            return "owner_success";
        }

        // 2. Check credentials from database
        Optional<User> userOpt = userRepository.findByUsername(cleanUsername);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(password)) {
                if ("OWNER".equalsIgnoreCase(user.getRole())) {
                    return "owner_success";
                }
                return "customer_success";
            }
        }

        return "invalid";
    }
}