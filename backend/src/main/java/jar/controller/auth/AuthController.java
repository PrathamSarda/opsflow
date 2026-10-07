package jar.controller.auth;

import jar.model.User;
import jar.security.JwtUtil;
import jar.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://127.0.0.1:5173", "http://127.0.0.1:5174", "http://127.0.0.1:5175"}, allowCredentials = "true")
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<?> processSignup(@RequestBody User user) {
        if (user.getUsername() == null || user.getUsername().trim().isEmpty() ||
            user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Username and password are required.");
        }

        String username = user.getUsername().trim();
        if (userService.existsByUsername(username) || "owner".equalsIgnoreCase(username)) {
            return ResponseEntity.badRequest().body("Username is already taken. Please choose another.");
        }

        user.setUsername(username);
        userService.registerUser(user);
        return ResponseEntity.ok("Signup successful! You can now log in.");
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> processLogin(@RequestBody User loginRequest) {
        if (loginRequest.getUsername() == null || loginRequest.getPassword() == null) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Username and password are required");
            return ResponseEntity.status(400).body(response);
        }

        String username = loginRequest.getUsername().trim();
        String loginResult = userService.login(username, loginRequest.getPassword());
        Map<String, String> response = new HashMap<>();

        if (loginResult.equals("owner_success") || loginResult.equals("customer_success")) {
            String token = jwtUtil.generateToken(username);
            response.put("token", token);
            response.put("role", loginResult);
            response.put("username", username);
            return ResponseEntity.ok(response);
        }

        response.put("error", "Invalid username or password");
        return ResponseEntity.status(401).body(response);
    }
}