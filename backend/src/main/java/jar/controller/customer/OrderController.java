package jar.controller.customer;

import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jar.model.Order;
import jar.model.Product;
import jar.repository.OrderRepository;
import jar.repository.ProductRepository;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://127.0.0.1:5173", "http://127.0.0.1:5174", "http://127.0.0.1:5175"}, allowCredentials = "true")
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    private static final Pattern ITEM_PATTERN = Pattern.compile("^(.*?)\\s*\\(x(\\d+)\\)$");

    @GetMapping("/customer/{username}")
    public ResponseEntity<List<Order>> getOrdersByCustomer(@PathVariable String username) {
        return ResponseEntity.ok(orderRepository.findByCustomerUsernameOrderByIdDesc(username));
    }

    @PutMapping("/status/{id}")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status.toUpperCase());
        Order updatedOrder = orderRepository.save(order);
        return ResponseEntity.ok(updatedOrder);
    }

    @PostMapping("/checkout")
    public ResponseEntity<Order> placeOrder(@RequestBody Order order) {
        order.setStatus("PENDING");
        Order savedOrder = orderRepository.save(order);

        // Deduct inventory stock for ordered items
        if (order.getOrderedItems() != null) {
            for (String itemStr : order.getOrderedItems()) {
                try {
                    Matcher matcher = ITEM_PATTERN.matcher(itemStr.trim());
                    String productName = itemStr;
                    int quantity = 1;

                    if (matcher.matches()) {
                        productName = matcher.group(1).trim();
                        quantity = Integer.parseInt(matcher.group(2));
                    }

                    Optional<Product> productOpt = productRepository.findByName(productName);
                    if (productOpt.isPresent()) {
                        Product product = productOpt.get();
                        int newStock = Math.max(0, product.getStockQuantity() - quantity);
                        product.setStockQuantity(newStock);
                        productRepository.save(product);
                    }
                } catch (Exception ex) {
                    System.err.println("Could not deduct stock for: " + itemStr + " - " + ex.getMessage());
                }
            }
        }

        return ResponseEntity.ok(savedOrder);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAllByOrderByIdDesc());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return orderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}