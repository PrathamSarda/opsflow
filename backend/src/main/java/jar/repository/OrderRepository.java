package jar.repository;

import jar.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerUsername(String customerUsername);
    List<Order> findByCustomerUsernameOrderByIdDesc(String customerUsername);
    List<Order> findAllByOrderByIdDesc();
}