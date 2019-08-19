const app = require('./app')
app.set('port', process.env.PORT || 3000)

app.listen(app.get('port'), () => {
  console.log(`${app.locals.notes} is running on http://localhost:${app.get('port')}.`);
});

