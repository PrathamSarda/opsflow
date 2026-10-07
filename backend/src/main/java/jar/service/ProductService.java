package jar.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jar.model.Product;
import jar.repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // Save or add a new product
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    // Get all products, newest first
    public List<Product> getAllProducts() {
        return productRepository.findAllByOrderByIdDesc();
    }

    // Get product by ID
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    // Update existing product
    public Optional<Product> updateProduct(Long id, Product details) {
        return productRepository.findById(id).map(existing -> {
            if (details.getName() != null) existing.setName(details.getName());
            if (details.getDescription() != null) existing.setDescription(details.getDescription());
            if (details.getPrice() > 0) existing.setPrice(details.getPrice());
            if (details.getStockQuantity() >= 0) existing.setStockQuantity(details.getStockQuantity());
            if (details.getImageUrl() != null) existing.setImageUrl(details.getImageUrl());
            return productRepository.save(existing);
        });
    }

    // Delete a product by ID
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}