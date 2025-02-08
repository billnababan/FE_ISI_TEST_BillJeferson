-- Tabel Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Tasks
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'Not Started',
    assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Logs
CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    performed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    description TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Data Dummy ke Tabel Users
INSERT INTO users (name, email, password, role) VALUES
('John Doe', 'john.doe@example.com', 'hashed_password_1', 'lead'),
('Jane Smith', 'jane.smith@example.com', 'hashed_password_2', 'team'),
('Alice Johnson', 'alice.johnson@example.com', 'hashed_password_3', 'team');

-- Insert Data Dummy ke Tabel Tasks
INSERT INTO tasks (title, description, status, assigned_to, created_by) VALUES
('Design Database', 'Design the database schema for the application.', 'On Progress', 2, 1),
('Implement Authentication', 'Implement JWT-based authentication system.', 'Not Started', 3, 1);

-- Insert Data Dummy ke Tabel Logs
INSERT INTO logs (task_id, action, performed_by, description) VALUES
(1, 'CREATE', 1, 'Task created and assigned to Jane Smith.'),
(1, 'UPDATE', 2, 'Status updated to On Progress by Jane Smith.'),
(2, 'CREATE', 1, 'Task created and assigned to Alice Johnson.');
