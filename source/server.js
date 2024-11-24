const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const pool = require('./db');
const cors = require('cors')
const { PDFDocument } = require('pdf-lib');
const sharp = require('sharp'); // Для преобразования в изображение
const fs = require('fs');
const { fromPath } = require('pdf2pic'); // Библиотека для конвертации PDF в изображение



dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json());  // Для обработки JSON
app.use(express.urlencoded({ extended: true }));  // Для обработки URL-encoded данных

// Настройка загрузки файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
console.log(process.env.DB_NAME);  // Должен вывести 'library_db'
app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}`);
    next();
});

const uploadsPath = path.join(__dirname, 'uploads');  // Путь к папке uploads на сервере
console.log(uploadsPath);
app.use('/uploads', express.static(uploadsPath));  // Сервер будет отдавать файлы по пути /uploads

app.get('/debug', (req, res) => {
    const fs = require('fs');
    const filePath = path.join(__dirname, 'uploads', '1731632165877.pdf');
    const fileExists = fs.existsSync(filePath); // Проверяем существование файла

    res.json({
        filePath,
        exists: fileExists,
    });
});

// Настроим Express отдавать файлы из папки `uploads/source`
app.get(`/uploads/${uploadsPath}`,() => {
    console.log(uploadsPath)
    express.static(uploadsPath)});

app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Хеширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // Вставка данных в базу данных
        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error during user creation:', err);  // Логируем ошибку
        res.status(500).json({ error: 'User creation failed', details: err.message });
    }
});
app.get('/api/books/:id/cover', async (req, res) => {
    const { id } = req.params;

    try {
        // Получаем путь к файлу книги из базы данных
        const result = await pool.query('SELECT file_path FROM books WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const filePath = result.rows[0].file_path;
        const fullPath = path.join(__dirname, filePath);

        // Настроим pdf2pic для извлечения первой страницы как изображения
        const pdfPath = fullPath; // Путь к PDF файлу
        const outputPath = path.join(__dirname, 'uploads', `cover-${id}.png`); // Папка для сохранения обложки

        const options = {
            density: 1000, // Качество изображения
            saveFilename: `cover-${id}`,
            savePath: path.join(__dirname, 'uploads'), // Папка для сохранения изображений
            format: "png",
            width: 600, // Ширина изображения
            height: 800, // Высота изображения
        };

        const convert = fromPath(pdfPath, options);

        // Извлекаем первую страницу как изображение
        await convert(1).then((resolve) => {
            const imagePath = resolve.path;

            // Отправляем изображение клиенту
            res.setHeader('Content-Type', 'image/png');
            fs.createReadStream(imagePath).pipe(res);
        }).catch((error) => {
            console.error('Error extracting cover:', error);
            res.status(500).json({ error: 'Failed to extract cover', details: error.message });
        });

    } catch (error) {
        console.error('Error during book cover extraction:', error);
        res.status(500).json({ error: 'Failed to extract cover', details: error.message });
    }
});

// Аутентификация пользователя
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Защищенный маршрут для получения информации о пользователе
app.get('/api/user', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.userId]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Middleware для проверки токена JWT
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (!token) return res.sendStatus(403);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.userId = user.userId;
        next();
    });
}
const upload = multer({ storage }).single('file'); // "file" — имя поля формы

app.post('/api/books/upload', authenticateToken, (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error('Error during file upload:', err);
            return res.status(400).json({ error: 'File upload failed', details: err.message });
        }

        const { title, author, description, genre } = req.body;

        // Отладка: проверяем данные, пришедшие на сервер
        console.log('Title:', title);
        console.log('Author:', author);
        console.log('Description:', description);
        console.log('Genre:', genre);

        const filePath = req.file ? req.file.path : null;

        if (!title || !author || !description || !genre || !filePath) {
            return res.status(400).json({ error: 'Missing title, author, description, genre, or file' });
        }

        try {
            const result = await pool.query(
                'INSERT INTO books (title, author, description, genre, file_path) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [title, author, description, genre, filePath]
            );

            if (result && result.rows && result.rows[0]) {
                res.status(201).json(result.rows[0]);
            } else {
                throw new Error('Failed to insert book into database');
            }
        } catch (err) {
            console.error('Error during book insert:', err);
            res.status(500).json({ error: 'Book upload failed', details: err.message });
        }
    });
});


// Добавление книги в список прочитанных
app.post('/api/user/books', authenticateToken, async (req, res) => {
    const { bookId } = req.body;

    if (!bookId) {
        return res.status(400).json({ error: 'Book ID is required' });
    }

    try {
        // Добавляем запись в таблицу user_books, связывая пользователя и книгу
        const result = await pool.query(
            'INSERT INTO user_books (user_id, book_id) VALUES ($1, $2) RETURNING *',
            [req.userId, bookId]
        );

        if (result && result.rows && result.rows[0]) {
            res.status(201).json({ message: 'Book added to your list of read books' });
        } else {
            throw new Error('Failed to add book to user books');
        }
    } catch (err) {
        console.error('Error adding book to user books:', err);
        res.status(500).json({ error: 'Failed to add book to your list', details: err.message });
    }
});



// Получение списка книг
app.get('/api/books', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM books');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

// Получение информации о книге по ID
app.get('/api/books/:id', async (req, res) => {
    const bookId = req.params.id;

    try {
        // Запрос к базе данных для получения книги по ID
        const result = await pool.query('SELECT * FROM books WHERE id = $1', [bookId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const book = result.rows[0];
        res.json(book);
    } catch (err) {
        console.error('Error fetching book:', err);
        res.status(500).json({ error: 'Failed to fetch book' });
    }
});

// Прочитанные книги пользователя
app.get('/api/user/books', authenticateToken, async (req, res) => {
    try {
        // Получаем список прочитанных книг
        const result = await pool.query(
            'SELECT books.* FROM books INNER JOIN user_books ON books.id = user_books.book_id WHERE user_books.user_id = $1',
            [req.userId]
        );

        if (result.rows.length === 0) {
            // Если книги не найдены, возвращаем пустой массив
            return res.json([]);
        }

        console.log("Fetched books: ", result.rows); // Логируем результат для отладки
        res.json(result.rows); // Отправляем результат на клиент
    } catch (err) {
        console.error("Error fetching user books:", err); // Логируем ошибку
        res.status(500).json({ error: 'Failed to fetch user books' });
    }
});


// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
