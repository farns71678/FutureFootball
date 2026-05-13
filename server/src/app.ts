import express from 'express';
const app = express();
const port = process.env.PORT || 3300;

app.get('/info/:id', (req, res) => {
  res.send(`Getting info for team: ` + req.params.id);
});

app.use((req, res) => {
  res.status(404).send('Not found');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
