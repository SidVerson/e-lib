// GET /api/books/:id - Получить информацию о книге по ID
const router = useRouter()
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch book details' });
    }
});
