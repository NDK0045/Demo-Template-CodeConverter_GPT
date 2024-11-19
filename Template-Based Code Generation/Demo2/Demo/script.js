/*function generateCode() {
    const description = document.getElementById("description").value;
    const language = document.getElementById("language").value;

    if (!description) {
        alert("Please enter a description.");
        return;
    }

    let generatedCode = "";

    // Convert description to lowercase for case-insensitive matching
    const normalizedDescription = description.toLowerCase();

    // Generate code based on the selected language and description
    if (language === "html") {
        generatedCode = generateHTMLCode(normalizedDescription);
    } else if (language === "java") {
        generatedCode = generateJavaCode(normalizedDescription);
    } else if (language === "python") {
        generatedCode = generatePythonCode(normalizedDescription);
    } else if (language === "sql") {
        generatedCode = generateSQLCode(normalizedDescription);
    }

    // Display the generated code in the text content area
    document.getElementById("generatedCode").textContent = generatedCode;

    // Display live HTML preview if HTML is selected
    if (language === "html") {
        displayLivePreview(generatedCode);
    }
}*/

// Initialize CodeMirror 
let editor;

window.onload = () => {
    // Initialize CodeMirror
    editor = CodeMirror.fromTextArea(document.getElementById("generatedCode"), {
        mode: "text/html", 
        lineNumbers: true,
        readOnly: false, // allow edit
        theme: "default"
    });

    // Listen for changes in the editor and update the live preview in real-time
    editor.on("change", function() {
        const generatedCode = editor.getValue();
        displayLivePreview(generatedCode);
    });
};

function generateCode() {
    const description = document.getElementById("description").value;
    const language = document.getElementById("language").value;

    if (!description) {
        alert("Please enter a description.");
        return;
    }

    let generatedCode = "";

    // Convert description to lowercase for case-insensitive matching
    const normalizedDescription = description.toLowerCase();

    // Generate code based on the selected language and description
    if (language === "html") {
        generatedCode = generateHTMLCode(normalizedDescription);
    } else if (language === "java") {
        generatedCode = generateJavaCode(normalizedDescription);
    } else if (language === "python") {
        generatedCode = generatePythonCode(normalizedDescription);
    } else if (language === "sql") {
        generatedCode = generateSQLCode(normalizedDescription);
    }

    // Set the generated code into the CodeMirror editor
    editor.setValue(generatedCode);

    // Display live HTML preview if HTML is selected
    if (language === "html") {
        displayLivePreview(generatedCode);
    }
}


function getCodeMirrorMode(language) {
    switch (language) {
        case "html":
            return "xml";
        case "java":
            return "text/x-java";
        case "python":
            return "python";
        case "sql":
            return "sql";
        default:
            return "text/plain";
    }
}

// Function to display HTML code in the iframe
function displayLivePreview(htmlCode) {
    const iframe = document.getElementById("iframePreview");

    
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(htmlCode);
    iframeDoc.close();
}

document.addEventListener("keydown", function(event) {
    
    if (event.key === "Enter") {
        generateCode(); 
    }
});


function copyCode() {
    const code = editor.getValue();
    navigator.clipboard.writeText(code).then(() => {
        alert("Code copied to clipboard!");
    });
}


function downloadCode() {
    const code = editor.getValue();
    const blob = new Blob([code], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'generated_code.txt';
    link.click();
}

// Attributes Class
class Attributes {
    constructor(description) {
        this.description = description.toLowerCase();
        this.attributes = this.parseAttributes();
    }

    // Parse the description to extract relevant attributes
    parseAttributes() {
        return {
            theme: this.getTheme(),
            color: this.extractColor(),
            backgroundColor: this.extractBackgroundColor(),
            hoverColor: this.extractHoverColor(),
            fontSize: this.extractFontSize(),
            fontFamily: this.extractFontFamily(),
            borderRadius: this.description.includes("rounded") ? "8px" : "0px",
            padding: this.description.includes("padded") ? "20px" : "10px",
            buttonCount: this.extractButtonCount(),
            buttonText: this.extractButtonText(),
            title: this.extractTitle(),
            content: this.extractContent(),
        };
    }

    // Helper methods to parse specific attributes
    getTheme() {
        if (this.description.includes("dark theme")) return "dark";
        if (this.description.includes("light theme")) return "light";
        return "default";
    }

    extractColor() {
        const match = this.description.match(/color:\s*([\w#]+)/);
        return match ? match[1] : (this.attributes?.theme === "dark" ? "#333" : "#000");
    }

    extractBackgroundColor() {
        const match = this.description.match(/background color:\s*([\w#]+)/);
        return match ? match[1] : (this.attributes?.theme === "dark" ? "#222" : "#f9f9f9");
    }

    extractHoverColor() {
        const match = this.description.match(/hover color:\s*([\w#]+)/);
        return match ? match[1] : "#555";
    }

    extractFontSize() {
        const match = this.description.match(/font size:\s*(\d+)px/);
        return match ? `${match[1]}px` : "16px";
    }

    extractFontFamily() {
        const match = this.description.match(/font family:\s*([\w\s]+)/);
        return match ? match[1] : "Arial, sans-serif";
    }

    extractButtonCount() {
        const match = this.description.match(/(\d+)\s*buttons?/);
        return match ? parseInt(match[1]) : 1;
    }

    extractButtonText() {
        const match = this.description.match(/button text:\s*\"(.*?)\"/g);
        if (match) {
            return match.map(text => text.replace(/button text:\s*\"/, '').replace(/\"/, ''));
        }
        return ["Click Me"];
    }

    extractTitle() {
        const match = this.description.match(/title:\s*\"(.*?)\"/);
        return match ? match[1] : "";
    }

    extractContent() {
        const match = this.description.match(/content:\s*\"(.*?)\"/);
        return match ? match[1] : "";
    }

    getStyle() {
        const { color, backgroundColor, borderRadius, padding, fontSize, fontFamily } = this.attributes;
        return `
            color: ${color};
            background-color: ${backgroundColor};
            border-radius: ${borderRadius};
            padding: ${padding};
            font-size: ${fontSize};
            font-family: ${fontFamily};
        `;
    }

    getButtonStyle() {
        return `
            background-color: ${this.attributes.color};
            color: white;
            border-radius: ${this.attributes.borderRadius};
            padding: 10px 20px;
            font-size: ${this.attributes.fontSize};
            transition: background-color 0.3s ease;
        `;
    }

    getButtonHoverStyle() {
        return `background-color: ${this.attributes.hoverColor};`;
    }
}

// Base UI Component Class
class UIComponent {
    constructor(attributes) {
        this.attributes = attributes;
    }

    render() {
        return "<!-- Base UI Component -->";
    }
}

// Specific UI Components
class LoginForm extends UIComponent {
    render() {
        const style = this.attributes.getStyle();
        const buttonStyle = this.attributes.getButtonStyle();
        const hoverStyle = this.attributes.getButtonHoverStyle();
        const { buttonText, title } = this.attributes.attributes;

        return `
<!-- Login Form -->
<form id="loginForm" style="${style}">
    <h2>${title}</h2>
    <label for="username">Username:</label>
    <input type="text" id="username" name="username" required style="border-radius: ${this.attributes.attributes.borderRadius};">
    <label for="password">Password:</label>
    <input type="password" id="password" name="password" required style="border-radius: ${this.attributes.attributes.borderRadius};">
    <button type="submit" style="${buttonStyle}">${buttonText}</button>
    <style>
        #loginForm button:hover { ${hoverStyle} }
    </style>
</form>
<script>
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert("Form submitted!");
    });
</script>
        `;
    }
}

class Card extends UIComponent {
    render() {
        const style = this.attributes.getStyle();
        const buttonStyle = this.attributes.getButtonStyle();
        const hoverStyle = this.attributes.getButtonHoverStyle();
        const { title, content, buttonText } = this.attributes.attributes;

        return `
<!-- Card Layout -->
<div class="card" style="width: 300px; ${style}; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin: auto;">
    <img src="https://via.placeholder.com/300x200" alt="Card Image" style="border-radius: ${this.attributes.attributes.borderRadius} ${this.attributes.attributes.borderRadius} 0 0;">
    <div style="padding: 10px;">
        <h3>${title}</h3>
        <p>${content}</p>
        <button style="${buttonStyle}">${buttonText}</button>
        <style>
            .card button:hover { ${hoverStyle} }
        </style>
    </div>
</div>
        `;
    }
}

// Component Generator Class
class ComponentGenerator {
    constructor(description) {
        this.attributes = new Attributes(description);
        this.description = description.toLowerCase();
    }

    generateComponent() {
        const keywordMap = {
            "login form": LoginForm,
            "card layout": Card,
            // Add more mappings as needed
        };

        for (let keyword in keywordMap) {
            if (this.description.includes(keyword)) {
                const ComponentClass = keywordMap[keyword];
                const componentInstance = new ComponentClass(this.attributes);
                return componentInstance.render();
            }
        }

        return "<!-- Unknown HTML structure -->";
    }
}

function generateHTMLCode(description) {
    const generator = new ComponentGenerator(description);
    const htmlCode = generator.generateComponent();
    console.log(generator.attributes.attributes);
    console.log(htmlCode);
    return htmlCode;
}


function generatePythonCode(description) {
    // Match for class description
    if (description.toLowerCase().includes("class")) {
        return `
class SampleClass:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def greet(self):
        return f"Hello, my name is {self.name} and I am {self.age} years old."
`;
    }

    // Match for if-else description
    if (description.toLowerCase().includes("if") || description.toLowerCase().includes("else")) {
        return `
def check_age(age):
    if age >= 18:
        return "You are an adult."
    else:
        return "You are a minor."
`;
    }

    // Match for for/loop description
    if (description.toLowerCase().includes("for") || description.toLowerCase().includes("loop")) {
        return `
def print_numbers():
    for i in range(1, 6):
        print(i)
`;
    }

    // Match for while loop description
    if (description.toLowerCase().includes("while")) {
        return `
def countdown(start):
    while start > 0:
        print(start)
        start -= 1
    print("Liftoff!")
`;
    }

    // Match for multiple parameters in a function
    if (description.toLowerCase().includes("multiple parameters")) {
        return `
def add_numbers(a, b, c):
    """
    Adds three numbers and returns the result.
    """
    return a + b + c
`;
    }

    // Match for list comprehension description
    if (description.toLowerCase().includes("list") && description.toLowerCase().includes("comprehension")) {
        return `
def get_square_numbers(numbers):
    return [x**2 for x in numbers]
`;
    }

    // Match for try-except block description
    if (description.toLowerCase().includes("try") || description.toLowerCase().includes("except")) {
        return `
def safe_divide(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        return "Cannot divide by zero"
    return result
`;
    }

    // Match for import statement description
    if (description.toLowerCase().includes("import")) {
        return `
import math

def calculate_area(radius):
    return math.pi * (radius ** 2)
`;
    }

    // Match for decorator description
    if (description.toLowerCase().includes("decorator")) {
        return `
def my_decorator(func):
    def wrapper():
        print("Something before the function.")
        func()
        print("Something after the function.")
    return wrapper

@my_decorator
def say_hello():
    print("Hello, world!")

say_hello()
`;
    }

    // Match for lambda function description
    if (description.toLowerCase().includes("lambda")) {
        return `
multiply = lambda x, y: x * y
result = multiply(5, 3)
print(result)
`;
    }

    // Match for dictionary description
    if (description.toLowerCase().includes("dictionary") || description.toLowerCase().includes("dict")) {
        return `
person = {
    "name": "John",
    "age": 30,
    "city": "New York"
}

print(person["name"])
`;
    }

    // Match for inheritance description
    if (description.toLowerCase().includes("inheritance example")) {
        return `
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        raise NotImplementedError("Subclass must implement abstract method")

class Dog(Animal):
    def speak(self):
        return f"{self.name} says Woof!"

dog = Dog("Buddy")
print(dog.speak())
`;
    }

    // Default response if no match is found
    return "# Unknown Python structure";
}

function generateJavaCode(description) {
    // Normalize the description to lowercase for case-insensitive matching
    const normalizedDescription = description.toLowerCase();

    // Match for Servlet example (Handling HTTP Requests)
    if (normalizedDescription.includes("servlet") || normalizedDescription.includes("http request")) {
        return `
import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;

public class SimpleServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<html><body><h1>GET Request Processed</h1></body></html>");
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String name = request.getParameter("name");
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<html><body><h1>POST Request Processed</h1>");
        out.println("<p>Hello, " + name + "!</p></body></html>");
    }
}
`;
    }

    // Match for Spring Boot RESTful API (CRUD Operations)
    if (normalizedDescription.includes("rest api") || normalizedDescription.includes("crud")) {
        return `
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
public class SpringBootRestApi {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootRestApi.class, args);
    }
}

@RestController
@RequestMapping("/api/users")
class UserController {

    private final List<User> users = new ArrayList<>();

    @PostMapping
    public User createUser(@RequestBody User user) {
        users.add(user);
        return user;
    }

    @GetMapping
    public List<User> getUsers() {
        return users;
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable int id) {
        return users.stream().filter(u -> u.getId() == id).findFirst().orElse(null);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable int id, @RequestBody User updatedUser) {
        User user = users.stream().filter(u -> u.getId() == id).findFirst().orElse(null);
        if (user != null) {
            user.setName(updatedUser.getName());
            return user;
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable int id) {
        users.removeIf(u -> u.getId() == id);
        return "User with ID " + id + " deleted";
    }
}

class User {
    private int id;
    private String name;

    // Constructor, Getters, Setters
    public User(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
`;
    }

    // Match for Spring Boot + JPA (Database Interaction)
    if (normalizedDescription.includes("jpa") || normalizedDescription.includes("database interaction")) {
        return `
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.*;

import javax.persistence.Entity;
import javax.persistence.Id;

@SpringBootApplication
public class SpringBootJpaExample {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootJpaExample.class, args);
    }
}

@Entity
class Product {
    @Id
    private Long id;
    private String name;
    private double price;

    // Constructor, Getters, Setters
    public Product() {}

    public Product(Long id, String name, double price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}

interface ProductRepository extends JpaRepository<Product, Long> {}

@RestController
@RequestMapping("/api/products")
class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @GetMapping("/{id}")
    public Product getProduct(@PathVariable Long id) {
        return productRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
        Product product = productRepository.findById(id).orElse(null);
        if (product != null) {
            product.setName(updatedProduct.getName());
            product.setPrice(updatedProduct.getPrice());
            return productRepository.save(product);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
        return "Product with ID " + id + " deleted";
    }
}
`;
    }

    // Match for Spring Boot + Thymeleaf (Server-side Rendering)
    if (normalizedDescription.includes("thymeleaf") || normalizedDescription.includes("template rendering")) {
        return `
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@SpringBootApplication
public class SpringBootThymeleafExample {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootThymeleafExample.class, args);
    }
}

@Controller
class WebController {

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("message", "Welcome to Thymeleaf!");
        return "home"; // Return the "home.html" template
    }
}
`;
    }

    // Match for Spring Security (User Authentication)
    if (normalizedDescription.includes("spring security") || normalizedDescription.includes("authentication")) {
        return `
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@SpringBootApplication
public class SpringBootSecurityExample {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootSecurityExample.class, args);
    }
}

@EnableWebSecurity
class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
                .antMatchers("/login", "/signup").permitAll()
                .anyRequest().authenticated()
            .and()
            .formLogin()
                .loginPage("/login")
                .permitAll()
            .and()
            .logout()
                .permitAll();
    }
}
`;
    }

    // Default response if no match is found
    return "// Unknown Java structure";
}


function generateSQLCode(description) {
    // Normalize the description to lowercase for case-insensitive matching
    const normalizedDescription = description.toLowerCase();

    // Match for SELECT query description
    if (/select|fetch/i.test(normalizedDescription)) {
        return `
-- SQL SELECT Query
SELECT column1, column2, column3
FROM your_table
WHERE condition;
`;
    }

    // Match for INSERT query description
    if (/insert|add|insert into/i.test(normalizedDescription)) {
        return `
-- SQL INSERT Query
INSERT INTO your_table (column1, column2, column3)
VALUES (value1, value2, value3);
`;
    }

    // Match for UPDATE query description
    if (/update|modify|set/i.test(normalizedDescription)) {
        return `
-- SQL UPDATE Query
UPDATE your_table
SET column1 = value1, column2 = value2
WHERE condition;
`;
    }

    // Match for DELETE query description
    if (/delete|remove/i.test(normalizedDescription)) {
        return `
-- SQL DELETE Query
DELETE FROM your_table
WHERE condition;
`;
    }

    // Match for CREATE TABLE query description
    if (/create table/i.test(normalizedDescription)) {
        return `
-- SQL CREATE TABLE Query
CREATE TABLE your_table (
    column1 datatype,
    column2 datatype,
    column3 datatype
);
`;
    }

    // Match for ALTER TABLE query description
    if (/alter table/i.test(normalizedDescription)) {
        return `
-- SQL ALTER TABLE Query
ALTER TABLE your_table
ADD column_name datatype;
`;
    }

    // Match for JOIN query description
    if (/join|inner join|left join|right join/i.test(normalizedDescription)) {
        return `
-- SQL JOIN Query
SELECT a.column1, b.column2
FROM table1 a
INNER JOIN table2 b ON a.common_column = b.common_column;
`;
    }

    // Match for GROUP BY query description
    if (/group by/i.test(normalizedDescription)) {
        return `
-- SQL GROUP BY Query
SELECT column1, COUNT(*)
FROM your_table
GROUP BY column1;
`;
    }

    // Match for ORDER BY query description
    if (/order by/i.test(normalizedDescription)) {
        return `
-- SQL ORDER BY Query
SELECT column1, column2
FROM your_table
ORDER BY column1 ASC;
`;
    }

    // Match for WHERE clause query description
    if (/where/i.test(normalizedDescription)) {
        return `
-- SQL WHERE Query
SELECT column1, column2
FROM your_table
WHERE column1 = 'value';
`;
    }

    // Default response if no match is found
    return "-- Unknown SQL structure";
}

